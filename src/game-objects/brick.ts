import { BRICK_SIZE } from "../constants";
import { Point } from "./point";

export class Brick {
	size: number = BRICK_SIZE;
	highlightColor: string | null = null;

	constructor(
		private readonly ctx: CanvasRenderingContext2D,
		public x: number,
		public y: number,
		public readonly color: string = "red"
	) {}

	public draw(): void {
		// destructure this into variables
		const { ctx, x, y, size, color, highlightColor } = this;

		// saves the stats of the current context
		ctx.save();

		ctx.fillStyle = highlightColor ?? color;
		ctx.globalAlpha = highlightColor ? 0.5 : 1;

		ctx.fillRect(x, y, size, size);

		this.drawBevels();

		// restore the context
		ctx.restore();
	}

	private drawBevels(): void {
		const { ctx, x, y, size } = this;

		let borderSize = size * 0.15;

		// draw top bevel
		ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + size, y);
		ctx.lineTo(x + size - borderSize, y + borderSize);
		ctx.lineTo(x + borderSize, y + borderSize);
		ctx.closePath();
		ctx.fill();

		// draw left bevel
		ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x, y + size);
		ctx.lineTo(x + borderSize, y + size - borderSize);
		ctx.lineTo(x + borderSize, y + borderSize);
		ctx.closePath();
		ctx.fill();

		// draw bottom bevel
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.beginPath();
		ctx.moveTo(x, y + size);
		ctx.lineTo(x + size, y + size);
		ctx.lineTo(x + size - borderSize, y + size - borderSize);
		ctx.lineTo(x + borderSize, y + size - borderSize);
		ctx.closePath();
		ctx.fill();

		// draw right bevel
		ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
		ctx.beginPath();
		ctx.moveTo(x + size, y);
		ctx.lineTo(x + size, y + size);
		ctx.lineTo(x + size - borderSize, y + size - borderSize);
		ctx.lineTo(x + size - borderSize, y + borderSize);

		ctx.closePath();
		ctx.fill();
	}

	public isPointOver(point: Point): boolean {
		const { ctx, x, y, size } = this;
		const path = new Path2D();
		path.rect(x, y, size, size);

		const isInPath = ctx.isPointInPath(path, point.x, point.y);
		return isInPath;
	}

	public center(): Point {
		const { x, y, size } = this;
		return new Point(x + size / 2, y + size / 2);
	}

	public isOverOther(other: Brick): boolean {
		return other.isPointOver(this.center());
	}

	public highlightOtherIfOver(other: Brick) {
		if (this.isOverOther(other)) {
			other.highlightColor = this.color;
		}
	}

	public highlight(color: string | null) {
		this.highlightColor = color;
	}
}
