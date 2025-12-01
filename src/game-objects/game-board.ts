// import { ctx } from "../canvas-ctx";
import { BOARD_COLOR, BRICK_SIZE } from "../constants";
import { Brick } from "./brick";
import type { BrickSet } from "./brick-set";

export class GameBoard 
{
    color: string = BOARD_COLOR;
    rows: number = 8;
    columns: number = 8;
    private readonly x: number;
    private cells: Array<Brick> = [];

    constructor(
        private readonly ctx: CanvasRenderingContext2D,
        x: number,
        private readonly y: number,
    ) 
    {
        let width = this.rows * BRICK_SIZE;
        let height = this.columns * BRICK_SIZE;

        this.x = x - (width/2);

        this.initGrid();
    }

    private initGrid()
    {
        const {rows, columns, x, y, ctx, cells} = this;

        for(let row = 0; row < rows; row++)
        {
            for(let column = 0; column < columns; column++)
            {
                let bx = x + BRICK_SIZE * column;
                let by = y + BRICK_SIZE * row;

                let cell = new Brick(ctx, bx, by, BOARD_COLOR);
                cells.push(cell);
            }
        }
    }

    public draw() : void 
    {
        this.cells.forEach(c => 
        {
            c.draw();
        });
    }
    
    public highlightBrickSet(brickset: BrickSet) : void
    {
        const { cells } = this;
        let brickOverBoard = 0;

        cells.forEach(c => {
            c.highlightColor = null;
            brickset.bricks.forEach(b =>{
                if (b.isOtherOver(c))
                {
                    brickOverBoard ++;
                }
            });
        });

        if (brickOverBoard === brickset.bricks.length)
        {
            cells.forEach(c => {
                c.highlightColor = null;
                brickset.bricks.forEach(b =>{
                    if (b.isOtherOver(c))
                    {
                        brickOverBoard ++;
                    }
                });
            });
        }
    }
}