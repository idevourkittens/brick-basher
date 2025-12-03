import { BRICK_SIZE } from "../constants";
import { Brick } from "./brick";
import { Point } from "./point";

const pointMap: Array<Point> = [
	new Point(BRICK_SIZE * 0, BRICK_SIZE * 0), // 0
	new Point(BRICK_SIZE * 1, BRICK_SIZE * 0), // 1
	new Point(BRICK_SIZE * 2, BRICK_SIZE * 0), // 2
	new Point(BRICK_SIZE * 3, BRICK_SIZE * 0), // 3

	new Point(BRICK_SIZE * 0, BRICK_SIZE * 1), // 4
	new Point(BRICK_SIZE * 1, BRICK_SIZE * 1), // 5
	new Point(BRICK_SIZE * 2, BRICK_SIZE * 1), // 6
	new Point(BRICK_SIZE * 3, BRICK_SIZE * 1), // 7

	new Point(BRICK_SIZE * 0, BRICK_SIZE * 2), // 8
	new Point(BRICK_SIZE * 1, BRICK_SIZE * 2), // 9
	new Point(BRICK_SIZE * 2, BRICK_SIZE * 2), // 10
	new Point(BRICK_SIZE * 3, BRICK_SIZE * 2), // 11

	new Point(BRICK_SIZE * 0, BRICK_SIZE * 3), // 12
	new Point(BRICK_SIZE * 1, BRICK_SIZE * 3), // 13
	new Point(BRICK_SIZE * 2, BRICK_SIZE * 3), // 14
	new Point(BRICK_SIZE * 3, BRICK_SIZE * 3), // 15
];

export class BrickSet {
	public bricks: Array<Brick> = [];
	public color: string = "red";

	constructor(
		protected readonly ctx: CanvasRenderingContext2D,
		public x: number,
		public y: number,
		public pos: Array<number> = []
	) {
		this.setColor();

		pos.forEach((p) => {
			let point = pointMap[p - 1];
			let brick = new Brick(ctx, x + point.x, y + point.y, this.color);
			this.bricks.push(brick);
		});
	}

	public draw(): void {
		this.bricks.forEach((b) => b.draw());
	}

	protected setColor(): void {
		const colors: Array<string> = ["red", "orange", "green", "blue", "purple"];

		let rand = Math.floor(Math.random() * colors.length);

		this.color = colors[rand];
	}

	public isPointOver(point: Point): boolean {
		const isPointOver = this.bricks.some((b) => b.isPointOver(point));
		return isPointOver;
	}

	public move(point: Point): void {
		this.x = point.x;
		this.y = point.y;

		const { x, y, pos, bricks } = this;

		pos.forEach((p, idx) => {
			let point = pointMap[p - 1];
			bricks[idx].x = x + point.x;
			bricks[idx].y = y + point.y;
		});
	}
}
