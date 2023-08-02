import { options } from "../../../configuration/options.mjs";
import { buckets } from "../../buckets.mjs";
import { Direction, flickArrowRadius, flickWidth, noteRadius } from "../../constants.mjs";
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

		this.inputLayout.l = this.pos.x - flickWidth;
		this.inputLayout.r = this.pos.x + flickWidth;
		this.inputLayout.t = this.pos.y + this.height;
		this.inputLayout.b = this.pos.y - this.height;
	}

	draw(): void {
		super.draw();

		// Draw flick arrows to indicate this note is a flick note
		if (!this.fallback) return;

		const alpha = Math.min(1, Math.unlerp(this.times.alpha.start, this.times.alpha.end, time.now));
		const scale = Math.min(1, Math.unlerp(this.times.scale.start, this.times.scale.end, time.now));

		const layout = new Rect({
			l: -flickArrowRadius * scale,
			r: flickArrowRadius * scale,
			t: flickArrowRadius * scale,
			b: -flickArrowRadius * scale,
		}).toQuad();

		const right = layout.rotate(-Math.PI * 0.5).translate(this.pos.x + this.width * scale, this.pos.y);
		const left = layout.rotate(Math.PI * 0.5).translate(this.pos.x - this.width * scale, this.pos.y);

		skin.sprites.flickArrow.draw(right, this.pos.z + 0.0001, alpha);
		skin.sprites.flickArrow.draw(left, this.pos.z + 0.0001, alpha);
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
