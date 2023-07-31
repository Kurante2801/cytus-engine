import { buckets } from "../../buckets.mjs";
import { Direction, noteRadius } from "../../constants.mjs";
import { skin } from "../../skin.mjs";
import { windows } from "../../windows.mjs";
import { Note, NoteType } from "./Note.mjs";
import { particle } from "../../particle.mjs";
import { options } from "../../../configuration/options.mjs";
import { isUsed } from "../InputManager.mjs";

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

	touch(): void {
		if (options.autoplay || time.now < this.input.min) return;

		for (const touch of touches) {
			if (!touch.started || isUsed(touch) || !this.isTouching(touch.x, touch.y)) continue;

			this.judge(touch, touch.startTime, true);
			break;
		}
	}

	get width(): number {
		return noteRadius;
	}

	get height(): number {
		return noteRadius;
	}
}
