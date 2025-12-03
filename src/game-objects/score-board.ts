export class ScoreBoard 
{

    private currentScore: number = 1234;
    private maxScore: number = 0;

    constructor
    (
        private readonly ctx: CanvasRenderingContext2D,
        private x: number,
        private y: number,
        private w: number,
        private h: number,
    ){}

    public draw() : void 
    {
        const { currentScore, maxScore, ctx, x, y, w, h } = this;
        ctx.save();

        let currentScoreX = x + w/2;
        let currentScoreY = y + h/2 + 15;

        ctx.font = "30px Science Gothic";
        ctx.textAlign = "center";
        ctx.fillStyle = "White";

        ctx.fillText(currentScore.toString(), currentScoreX, currentScoreY)

        ctx.font = "20px Science Gothic";
        ctx.textAlign = "left";
        ctx.fillStyle = "gold";

        ctx.fillText(maxScore.toString(), x + 20, y + 20)

        ctx.restore();

    }

}
