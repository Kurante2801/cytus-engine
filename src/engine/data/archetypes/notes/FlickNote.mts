import { options } from "../../../configuration/options.mjs";
import { buckets } from "../../buckets.mjs";
import { Direction, flickWidth, noteRadius } from "../../constants.mjs";
import { particle } from "../../particle.mjs";
import { note } from "../../shared.mjs";
import { skin } from "../../skin.mjs";
import { windows } from "../../windows.mjs";
import { isUsed, markAsUsed } from "../InputManager.mjs";
import { Note, NoteType } from "./Note.mjs";

export class FlickNote extends Note {
	bucket = buckets.flick;
	windows = windows.flick;
	effect = particle.effects.flick;
	type = NoteType.FLICK;

	inputLayout = this.entityMemory(Rect);
	activatedTouch = this.entityMemory(TouchId);
	fallback = this.entityMemory(Boolean);

	globalPreprocess(): void {
		super.globalPreprocess();

		// Require moving a flick note by at least 0.25% of the screen to trigger it
		note.flickThreshold = Math.lerp(0, screen.w, 0.025);
	}

	preprocess(): void {
		super.preprocess();

		this.sprite = this.data.direction === Direction.Up ? skin.sprites.flickUp.id : skin.sprites.flickDown.id;

		this.fallback = !skin.sprites.exists(this.sprite);
		if (this.fallback) this.sprite = skin.sprites.flickFallback.id;

		this.inputLayout.l = this.pos.x - this.width;
		this.inputLayout.r = this.pos.x + this.width;
		this.inputLayout.t = this.pos.y + this.height;
		this.inputLayout.b = this.pos.y - this.height;
	}

	isTouching(x: number, y: number): boolean {
		return this.inputLayout.l <= x && x <= this.inputLayout.r && this.inputLayout.b <= y && y <= this.inputLayout.t;
	}

	touch(): void {
		if (options.autoplay || time.now < this.input.min) return;

		if (!this.activatedTouch) {
			for (const touch of touches) {
				if (!touch.started || !this.isTouching(touch.x, touch.y) || isUsed(touch)) continue;

				markAsUsed(touch);
				this.activatedTouch = touch.id;
				break;
			}
		}

		// Trigger flick
		if (this.activatedTouch) {
			for (const touch of touches) {
				if (touch.id !== this.activatedTouch) continue;
				const offset = Math.abs(touch.position.x - touch.startPosition.x);

				if (offset >= note.flickThreshold) this.judge(touch, time.now, false);
				else if (touch.ended) this.despawn = true;

				break;
			}
		}
	}

	get width(): number {
		return this.fallback ? noteRadius : flickWidth;
	}

	get height(): number {
		return noteRadius;
	}
}
