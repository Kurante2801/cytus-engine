export const Direction = {
	Up: 1,
	Down: -1,
} as const;

export type Direction = (typeof Direction)[keyof typeof Direction];

export enum Layer {
	HOLD_BAR,
	NOTE,
	JUDGMENT,
}

export const scanlineThick = 0.05;
export const noteRadius = 0.3125;

// Seconds until an sfx can play again
export const minSFXDistance = 0.02;
