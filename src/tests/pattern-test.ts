import { canvas, ctx } from "../canvas-ctx";
import { patternSets } from "../pattern-sets";
import { Brick } from "../game-objects/brick";
import { BRICK_SIZE, BOARD_COLOR } from "../constants";
import "../style.css";
import { BrickSet } from "../game-objects/brick-set";

let width = window.innerWidth;

// figure out the number of rows and columns based on
// how many patternSets we have

let gridPositions = 5;
let gridSize = BRICK_SIZE * gridPositions;
let numberOfGridsPerRow = Math.floor(width / gridSize);
let numberOfRows = Math.ceil(patternSets.length / numberOfGridsPerRow);

// set canvas width and height based on the number of patterns
// we have to draw
canvas.width = width;
canvas.height = numberOfRows * gridPositions * BRICK_SIZE + BRICK_SIZE;

console.log(
	numberOfGridsPerRow,
	numberOfRows,
	numberOfGridsPerRow * gridPositions
);

let x = BRICK_SIZE;
let y = BRICK_SIZE;

// draw empty grids based on the number of rows and columns
for (let row = 0; row < numberOfRows; row++, y += gridSize) {
	for (
		let col = 0, x = BRICK_SIZE;
		col < numberOfGridsPerRow;
		col++, x += gridSize
	) {
		drawEmptyGrid(x, y);
	}
}

// time to draw our patterns, set our x and y back to start
x = BRICK_SIZE;
y = BRICK_SIZE;

// set up an index counter for the patternSets array
let idx = 0;

// draw patterns based on the number of rows and columns
for (
	let row = 0;
	idx < patternSets.length && row < numberOfRows;
	row++, y += gridSize
) {
	for (
		let col = 0, x = BRICK_SIZE;
		idx < patternSets.length && col < numberOfGridsPerRow;
		col++, x += gridSize
	) {
		let pattern = new BrickSet(ctx, x, y, patternSets[idx]);
		pattern.draw();
		idx++;
	}
}

function drawEmptyGrid(x: number, y: number) {
	for (let row = 0; row < gridPositions - 1; row++) {
		for (let col = 0; col < gridPositions - 1; col++) {
			let cell = new Brick(
				ctx,
				x + BRICK_SIZE * col,
				y + BRICK_SIZE * row,
				BOARD_COLOR
			);
			cell.draw();
		}
	}
}