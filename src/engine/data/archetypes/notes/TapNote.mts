import { buckets } from "../../buckets.mjs";
import { Direction, noteRadius } from "../../constants.mjs";
import { note } from "../../shared.mjs";
import { skin } from "../../skin.mjs";
import { windows } from "../../windows.mjs";
import { Note } from "./Note.mjs";

export class TapNote extends Note {
	bucket = buckets.tap;
	windows = windows.tap;

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
