import { BRICK_SIZE } from "./constants";
import { GameOverEvent } from "./game-events";
import { GameBoard } from "./game-objects/game-board";
import { PatternSlot } from "./game-objects/pattern-slot";
import { Point } from "./game-objects/point";
import { ScoreBoard } from "./game-objects/score-board";

export class GameManager {
	private board: GameBoard;
	private scoreBoard: ScoreBoard;
	private boardPadding = {
		top: 100,
		bottom: 50,
	};

	private slotAlpha!: PatternSlot;
	private slotBeta!: PatternSlot;
	private slotCharlie!: PatternSlot;

	private mousePosition: Point = new Point(0, 0);
	private selectedSlot: PatternSlot | null = null;

	private isGameOver: boolean = false;

	constructor(
		private readonly ctx: CanvasRenderingContext2D,
		private readonly canvas: HTMLCanvasElement
	) {
		this.wireUpEvents();

		this.scoreBoard = new ScoreBoard( ctx, 0, 0, canvas.width, this.boardPadding.top);
		this.board = new GameBoard(ctx, canvas.width / 2, this.boardPadding.top);
		this.initSlots();
	}

	public draw(): void {
		const { scoreBoard, board, slotAlpha, slotBeta, slotCharlie, ctx, canvas } = this;

		// clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		scoreBoard.draw();
		board.draw();
		slotAlpha.brickSet?.draw();
		slotBeta.brickSet?.draw();
		slotCharlie.brickSet?.draw();

		this.selectedSlot?.brickSet?.draw();
	}

	public update(): void {
		document.body.style.cursor = "default";

		if (this.isGameOver) {
			return;
		}

		const { selectedSlot, mousePosition } = this;

		if (selectedSlot) {
			document.body.style.cursor = "none";
			selectedSlot.move(this.mousePosition);
			this.board.highlightBrickSet(selectedSlot.brickSet!);
		}

		const slots = [this.slotAlpha, this.slotBeta, this.slotCharlie];

		// set mouse cursor to grab if we don't have a selected slot
		// and the mouse is over an available slot
		if (
			selectedSlot === null &&
			slots.some((s) => s.isPointOver(mousePosition))
		) {
			document.body.style.cursor = "grab";
		}

		// if all slots have been placed, generate new brick sets
		if (selectedSlot === null && !slots.some((s) => s.brickSet)) {
			slots.forEach((s) => {
				s.generateSet();
			});

			// check the game state after generating new sets
			this.checkForGameOver();
		}
	}

	private initSlots() {
		//set 12 to 8 if wanting to go back to normal board
		const y = this.boardPadding.top + BRICK_SIZE * 12 + this.boardPadding.bottom;
		
		//set 1.9 to 1.8 if  wanting to go back to normal board
		let pointBeta = new Point(this.canvas.width / 1.9 - BRICK_SIZE * 2, y);
		let pointAlpha = new Point(pointBeta.x - BRICK_SIZE * 5, y);
		let pointCharlie = new Point(pointBeta.x + BRICK_SIZE * 5, y);

		this.slotAlpha = new PatternSlot(this.ctx, pointAlpha);
		this.slotBeta = new PatternSlot(this.ctx, pointBeta);
		this.slotCharlie = new PatternSlot(this.ctx, pointCharlie);
	}

	private wireUpEvents() {
		this.onMouseMove = this.onMouseMove.bind(this);
		document.addEventListener("mousemove", this.onMouseMove);

		this.onClick = this.onClick.bind(this);
		document.addEventListener("click", this.onClick);
	}

	private onMouseMove(event: MouseEvent): void {
		this.mousePosition.x = event.clientX;
		this.mousePosition.y = event.clientY;
	}

	private onClick() {
		const { slotAlpha, slotBeta, slotCharlie, mousePosition, board } = this;

		// If we have a brick set selected and the board has
		// target slots available for the set, that means we
		// can place the bricks on the board and clear the
		// brick set for the selected slot.
		if (this.selectedSlot && this.selectedSlot.brickSet) {
			if (board.targetSlots.length) {
				board.targetSlots.forEach((s, i) => {
					board.slots[s].setBrick(this.selectedSlot!.brickSet!.bricks[i]);
				});
				board.clearFilledSlots();
				this.selectedSlot.brickSet = null;
			}

			// Reset the brick set position, and clear the selected slot.
			this.selectedSlot.resetPosition();
			this.selectedSlot = null;

			this.checkForGameOver();
			return;
		}

		const slots = [slotAlpha, slotBeta, slotCharlie];
		// check each slot to see of the mouse is over a brick set
		// if it is, make that slot the selected one
		slots.forEach((s) => {
			if (s.isPointOver(mousePosition)) {
				document.body.style.cursor = "none";
				this.selectedSlot = s;
			}
		});
	}

	private checkForGameOver(): void {
		// check our remaining slots with brick sets to see if we can place at least one
		const slotsWithSets = [
			this.slotAlpha,
			this.slotBeta,
			this.slotCharlie,
		].filter((s) => s.brickSet !== null);

		if (slotsWithSets.length) {
			let canPlaceRemainingSlots = slotsWithSets.some((s) =>
				this.board.isBrickSetPlaceable(s.brickSet)
			);
			this.isGameOver = !canPlaceRemainingSlots;
		}

		console.log("Game over?", this.isGameOver);

		if (this.isGameOver)
		{
			let event = new GameOverEvent();
			window.dispatchEvent(event);
			console.log("Game is over");
		}
	}
}
