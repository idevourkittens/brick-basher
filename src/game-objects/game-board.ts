import { BOARD_COLOR, BRICK_SIZE } from "../constants";
import { Brick } from "./brick";
import { BrickSet } from "./brick-set";
import { Point } from "./point";
import { BrickScore, ScoreEvent } from "../game-events";

export class GameBoard {
	color: string = BOARD_COLOR;
	rows: number = 8;
	cols: number = 8;
	private readonly x: number;
	public cells: Array<Brick> = [];
	public slots: Array<BoardSlot> = [];
	public targetSlots: Array<number> = [];
	public targetColSlots: Array<number> = [];
	public targetRowSlots: Array<number> = [];

	constructor(
		private readonly ctx: CanvasRenderingContext2D,
		x: number,
		private readonly y: number
	) {
		let width = this.rows * BRICK_SIZE;
		this.x = x - width / 2;
		this.initGrid();
	}

	private initGrid() {
		const { rows, cols, x, y, ctx, cells, slots } = this;
		let idx: number = 0;
		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				let bx = x + BRICK_SIZE * col;
				let by = y + BRICK_SIZE * row;
				let cell = new Brick(ctx, bx, by, BOARD_COLOR);
				cells.push(cell);
				slots.push(new BoardSlot(new Point(bx, by), null, row, col, idx));
				idx++;
			}
		}
	}

	public draw(): void {
		this.cells.forEach((c) => {
			c.draw();
		});

		this.slots.forEach((s) => {
			s.brick?.draw();
		});
	}

	public highlightBrickSet(brickSet: BrickSet) {
		const { cells, slots } = this;

		this.targetSlots = [];
		this.targetColSlots = [];
		this.targetRowSlots = [];

		cells.forEach((c, idx) => {
			c.highlight(null);
			this.slots[idx].brick?.highlight(null);

			brickSet.bricks.forEach((b) => {
				if (slots[idx].brick === null && b.isOverOther(c)) {
					this.targetSlots.push(idx);
				}
			});
		});

		if (this.targetSlots.length === brickSet.bricks.length) {
			this.targetSlots.forEach((s) => {
				cells[s].highlight(brickSet.color);
			});

			// since we have target slots, see if we have any rows
			// or columns that are complete

			// start with rows
			for (let row = 0; row < this.rows; row++) {
				let slotsFilled: Array<number> = [];
				let slotsToCheck = slots.filter((s) => s.row === row);
				slotsToCheck.forEach((s) => {
					if (s.brick || this.targetSlots.includes(s.idx)) {
						slotsFilled.push(s.idx);
					}
				});

				if (slotsFilled.length === this.rows) {
					this.targetRowSlots = this.targetRowSlots.concat(slotsFilled);
				}
			}

			this.targetRowSlots.forEach((s) => {
				slots[s].brick?.highlight(brickSet.color);
			});

			// now go through columns
			for (let col = 0; col < this.cols; col++) {
				let slotsFilled: Array<number> = [];
				let slotsToCheck = slots.filter((s) => s.col === col);
				slotsToCheck.forEach((s) => {
					if (s.brick || this.targetSlots.includes(s.idx)) {
						slotsFilled.push(s.idx);
					}
				});

				if (slotsFilled.length === this.cols) {
					this.targetColSlots = this.targetColSlots.concat(slotsFilled);
				}
			}
			this.targetColSlots.forEach((s) => {
				slots[s].brick?.highlight(brickSet.color);
			});
		} else {
			this.targetSlots = [];
		}
	}

	public clearFilledSlots(): void {
		let { slots, targetColSlots, targetRowSlots, cols, rows, cells } = this;
		let score = new BrickScore();

		targetColSlots.forEach((t) => {
			if (slots[t].clearBrick()) {
				score.bricks++;
			}
		});

		score.cols = targetColSlots.length / cols;

		targetRowSlots.forEach((t) => {
			if (slots[t].clearBrick()) {
				score.bricks++;
			}
		});

		score.rows = targetRowSlots.length / rows;

		// clear any cell highlights
		cells.forEach((c) => {
			c.highlight(null);
		});

		const event = new ScoreEvent(score);
		window.dispatchEvent(event);

		console.log("score: ", score);
	}

	/**
	 * Determines if there is room on the board to place a
	 * set of bricks
	 * @param brickSet The brick set to check
	 * @returns boolean
	 */
	public isBrickSetPlaceable(brickSet: BrickSet | null): boolean {
		if (brickSet === null) {
			// return false for an empty set of bricks
			// even though they don't take up any room
			// since we can't place them
			return false;
		}

		// get a copy of the brick set so we don't change the original.
		const brickSetCopy = new BrickSet(
			this.ctx,
			brickSet.x,
			brickSet.y,
			brickSet.pos
		);

		// loop through our slots and see if the brick set has
		// room to be placed.  If we find an opening, return
		// true.
		for (let slot of this.slots) {
			// start by moving the brick set to the
			// slot coordinates
			brickSetCopy.move(slot.point);

			// setup a variable to track if we can fit and
			// default it to true.  We will set it to false
			// if we can't fit
			let canFit = true;

			// go through each brick and see if the slot that
			// is at the same coordinates has a brick.
			brickSetCopy.bricks.forEach((b) => {
				if (!canFit) {
					// if we have determined we cannot fit,
					// return from this foreach early to save some
					// processing time so we can move on to the
					// next slot in our for...of loop
					return;
				}

				let matchingSlot = this.slots.find(
					(s) => s.point.x === b.x && s.point.y === b.y
				);

				if (matchingSlot === undefined || matchingSlot.brick !== null) {
					// found a slot and it has a brick in it, or the brick coordinates
					// do not match a slot not on the board, so we cannot fit here
					canFit = false;
				}
			});

			if (canFit) {
				// if we found a slot we can fit into,
				// so we can stop checking and return true!
				return true;
			}
		}

		// if we haven't found any room, the brick set
		// can't be placed, so return false
		return false;
	}
}

class BoardSlot {
	/**
	 * @param point The point object that contains the coordinates of the slot
	 * @param brick The brick that is currently in this slot (can be null)
	 * @param row The row number on the board that this slot is in
	 * @param col The column number on the board that this slot is in
	 * @param idx The array index of this slot, useful when selecting elements from other board arrays
	 */
	constructor(
		public readonly point: Point,
		public brick: Brick | null,
		public readonly row: number,
		public readonly col: number,
		public readonly idx: number
	) {}

	public setBrick(brick: Brick): void {
		this.brick = brick;
		this.brick.x = this.point.x;
		this.brick.y = this.point.y;
	}

	public clearBrick(): boolean {
		if (this.brick) {
			this.brick = null;
			return true;
		}

		return false;
	}
}
