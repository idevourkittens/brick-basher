//Events must be registered with global event handler map
declare global 
{
    interface GlobalEventHandlersEventMap
    {
        "bb-score": ScoreEvent;
        "bb-game-over": GameOverEvent;
    }   
}

export class ScoreEvent extends Event
{
    constructor
    (
        public readonly score: BrickScore    
    )
    {
        super("bb-score");
    }
}

export class BrickScore {
	constructor(
		public bricks: number = 0,
		public rows: number = 0,
		public cols: number = 0
	) 
    {}

    public total()
    {
        return this.bricks * 10 + (this.rows + this.cols) * 10;
    }
}

export class GameOverEvent extends Event
{
    constructor
    ()
    {
        super("bb-game-over");
    }
}