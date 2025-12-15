import "./style.css";
import { ctx, canvas, initCanvas } from "./canvas-ctx";
import { GameManager } from "./game-manager";

initCanvas();

let gm = new GameManager(ctx, canvas);
// let lastTimestamp = 0;

function gameLoop() {
	// let elapsedTime = timestamp - lastTimestamp;
	// lastTimestamp = timestamp;

	gm.update();
	gm.draw();

	// make sure this stays as the last thing
	requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
