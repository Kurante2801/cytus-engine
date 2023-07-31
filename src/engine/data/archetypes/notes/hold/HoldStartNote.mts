import { options } from "../../../../configuration/options.mjs";
import { buckets } from "../../../buckets.mjs";
import { Direction, noteRadius } from "../../../constants.mjs";
import { particle } from "../../../particle.mjs";
import { skin } from "../../../skin.mjs";
import { windows } from "../../../windows.mjs";
import { Note, NoteType } from "../Note.mjs";

export class HoldStartNote extends Note {
	bucket = buckets.hold;
	windows = windows.holdStart;
	effect = particle.effects.hold;
	type = NoteType.HOLD_START;

	shared = this.defineSharedMemory({
		z: Number,
		sprite: SkinSpriteId,
		judged: Boolean,
	});

	preprocess(): void {
		super.preprocess();

		this.sprite = this.data.direction === Direction.Up ? skin.sprites.holdUp.id : skin.sprites.holdDown.id;
		if (!skin.sprites.exists(this.sprite)) this.sprite = skin.sprites.holdFallback.id;

		// preprocess runs at the start of gameplay
		// so this will be setup by the time HoldEndNote calls its initialize()
		this.shared.z = this.pos.z;
		this.shared.sprite = this.sprite;
	}

	draw(): void {
		// Don't draw this note after target time
		// This is because it will be drawn by HoldEndNote
		if (time.now < this.times.target) super.draw();
	}

	judge(touch: Touch, time: number, mark: boolean): void {
		this.shared.judged = true;
		super.judge(touch, time, mark);
	}

	judgeMiss(): void {
		this.shared.judged = false;
		super.judgeMiss();
	}

	touch(): void {
		if (options.autoplay || time.now < this.input.min) return;

		for (const touch of touches) {
			if (!this.isTouching(touch.x, touch.y)) continue;

			this.judge(touch, time.now, false);
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
