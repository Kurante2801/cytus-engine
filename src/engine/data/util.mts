import { NoteType } from "./archetypes/notes/Note.mjs";
import { Direction } from "./constants.mjs";
import { scanline } from "./shared.mjs";

export function getX(percent: number): number {
	return Math.lerp(scanline.bounds.l, scanline.bounds.r, percent);
}

export function getY(direction: Direction, percent: number): number {
	if (direction === Direction.Up) return Math.lerp(scanline.bounds.b, scanline.bounds.t, percent);
	else return Math.lerp(scanline.bounds.t, scanline.bounds.b, percent);
}

export function getZ(layer: number, time: number): number {
	return layer - time / 10000;
}

// When t is above 1, returns 1 minus the ammount over
export function bounce(t: number): number {
	if (t <= 1) return t;
	return 1 - (t - 1);
}

export function animTimes(
	_: NoteType,
	speed: number,
	data: {
		spawn: number;
		target: number;
		alpha: { start: number; end: number };
		scale: { start: number; end: number };
	},
	windows: JudgmentWindows,
) {
	// TODO: if drag head/child: 1.175f / speed
	data.spawn = data.target - 1.367 / speed;

	data.alpha.start = data.spawn;
	data.alpha.end = data.target + windows.perfect.min;

	data.scale.start = data.target - 3.0;
	data.scale.end = data.target + windows.great.min;
}
