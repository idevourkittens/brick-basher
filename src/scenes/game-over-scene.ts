export class gameOverScene
{
	static draw() {
		throw new Error("Method not implemented.");
	}
    constructor
    (
        private readonly ctx: CanvasRenderingContext2D,
		private readonly canvas: HTMLCanvasElement,

        private x: number,
        private y: number,
        private w: number,
        private h: number,
    )
    {}

    public draw() : void 
    {
        const { canvas, ctx, x, y, w, h } = this;
        ctx.save();

        let gameoverX = canvas.width/2;
        let gameoverY = canvas.height/2 + 50;

        ctx.font = "100px Science Gothic";
        ctx.textAlign = "center";
        ctx.fillStyle = "White";

        ctx.fillText("GAME OVER!", gameoverX, gameoverY)

        ctx.restore();
    }


}