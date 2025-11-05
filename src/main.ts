import {canvas, ctx, initCanvas} from './canvas-ctx'; 
// import { Brick } from './game-objects/brick';
import { GameBoard } from './game-objects/game-board';
import './style.css';

initCanvas();

// ctx.fillStyle = "rgba(6, 1, 31, 1)";
// ctx.fillRect(0,0, canvas.width, canvas.height);

// let brick = new Brick(ctx, canvas.width/2, canvas.height/2);
// brick.draw();

let gb = new GameBoard(ctx, canvas.width/2, 100);
gb.draw();