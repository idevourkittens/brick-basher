let canvas = document.querySelector<HTMLCanvasElement>("#main-game")!;
let ctx = canvas.getContext("2d")!;

function initCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	window.addEventListener("resize", onResize);
}

function onResize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

export { canvas, ctx, initCanvas };
