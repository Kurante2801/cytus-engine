export const Direction = {
	Up: 1,
	Down: -1,
} as const;

export type Direction = (typeof Direction)[keyof typeof Direction];

export enum Layer {
	HOLD_BAR,
	DRAG_CHILD,
	NOTE,
	DRAG_ARROW, // Unused in code
	JUDGMENT,
}

export const scanlineThick = 0.05;
export const noteRadius = 0.3125;

// Seconds until an sfx can play again
export const minSFXDistance = 0.02;

export const holdBarWidth = 0.1;
export const longHoldBarWidth = 0.15;
export const holdIndicatorRadius = 0.375;

export const maxDegree = Math.PI * 2;
