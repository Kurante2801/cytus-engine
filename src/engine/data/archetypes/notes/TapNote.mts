import { buckets } from "../../buckets.mjs";
import { Direction, noteRadius } from "../../constants.mjs";
import { skin } from "../../skin.mjs";
import { windows } from "../../windows.mjs";
import { Note, NoteType } from "./Note.mjs";
import { particle } from "../../particle.mjs";

export class TapNote extends Note {
	bucket = buckets.tap;
	windows = windows.tap;
	effect = particle.effects.tap;
	type = NoteType.TAP;

	preprocess(): void {
		super.preprocess();

		this.sprite = this.data.direction === Direction.Up ? skin.sprites.tapUp.id : skin.sprites.tapDown.id;
		if (!skin.sprites.exists(this.sprite)) this.sprite = skin.sprites.tapFallback.id;
	}

	get width(): number {
		return noteRadius;
	}

	get height(): number {
		return noteRadius;
	}
}
