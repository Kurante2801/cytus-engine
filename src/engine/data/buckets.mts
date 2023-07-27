import { skin } from "./skin.mjs";

export const buckets = defineBuckets({
	tap: {
		sprites: [
			{
				id: skin.sprites.tapUp.id,
				x: 0,
				y: 0,
				w: 2,
				h: 2,
				rotation: 0,
			},
		],
	},
});
