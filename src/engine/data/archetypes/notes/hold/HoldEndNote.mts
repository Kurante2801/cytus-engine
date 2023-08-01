import { Judgment } from "sonolus.js-compiler";
import { options } from "../../../../configuration/options.mjs";
import { buckets } from "../../../buckets.mjs";
import { Direction, Layer, holdBarWidth, holdIndicatorRadius, maxDegree, noteRadius } from "../../../constants.mjs";
import { particle } from "../../../particle.mjs";
import { skin } from "../../../skin.mjs";
import { animTimes, getY, getZ } from "../../../util.mjs";
import { windows } from "../../../windows.mjs";
import { archetypes } from "../../index.mjs";
import { Note, NoteType } from "../Note.mjs";
import { scanline } from "../../../shared.mjs";

export class HoldEndNote extends Note {
	holdData = this.defineData({
		startRef: { name: "startRef", type: Number },
	});

	bucket = buckets.holdStart;
	windows = windows.holdEnd;
	effect = particle.effects.hold;
	type = NoteType.HOLD_END;

	startTarget = this.entityMemory(Number);
	bar = this.entityMemory({ y: Number, z: Number });
	touched = this.entityMemory(Boolean);
	indicator = this.entityMemory(SkinSpriteId);

	preprocess(): void {
		super.preprocess();

		this.sprite = this.data.direction === Direction.Up ? skin.sprites.holdUp.id : skin.sprites.holdDown.id;
		if (!skin.sprites.exists(this.sprite)) this.sprite = skin.sprites.holdFallback.id;

		this.bar.y = this.pos.y;
		this.bar.z = getZ(Layer.HOLD_BAR, this.times.target);

		const start = this.startData;

		// We want this note's sprite to be drawn at the start note's position
		this.pos.y = getY(this.data.direction, start.y);

		// Temporarily override target time to setup animations according to HoldStartNote
		const target = this.times.target;

		this.startTarget = bpmChanges.at(start.beat).time;

		this.times.target = this.startTarget;
		animTimes(this.type, start.speed, this.times, this.windows);
		this.times.target = target;

		// It doesn't matter if hold indicator doesn't exist, it will just not get drawn
		this.indicator = this.data.direction === Direction.Up ? skin.sprites.holdIndicatorUp.id : skin.sprites.holdIndicatorDown.id;
	}

	updateSequential(): void {
		super.updateSequential();
		this.touched = false;
	}

	act(): void {
		if (options.autoplay || this.startInfo.state !== EntityState.Despawned) return;

		// Note is being held and has time left
		if (this.touched && time.now <= this.input.max && this.startShared.judged) return;

		// Note ended or was let go
		this.despawn = true;

		// Missed start
		if (time.now < this.input.min || !this.startShared.judged) return;

		const hitTime = Math.min(time.now - input.offset, this.times.target);

		this.result.judgment = input.judge(hitTime, this.times.target, this.windows);
		this.result.accuracy = hitTime - this.times.target;

		this.result.bucket.index = this.bucket.index;
		this.result.bucket.value = this.result.accuracy * 1000;
	}

	draw(): void {
		// Draw starting note after target (because starting note despawns after being judged)
		if (time.now >= this.startTarget) super.draw();
		this.drawBar();

		// Draw hold indicator
		if (this.startInfo.state !== EntityState.Despawned) return;

		const layout = new Rect({
			l: this.pos.x - holdIndicatorRadius,
			r: this.pos.x + holdIndicatorRadius,
			t: this.pos.y + holdIndicatorRadius,
			b: this.pos.y - holdIndicatorRadius,
		});

		skin.sprites.holdIndicatorBackground.draw(layout, this.pos.z, 1);
		skin.sprites.draw(this.indicator, layout, this.pos.z, 1);

		const t = Math.unlerp(this.times.target, this.startTarget, time.now);
		const rotatedLayout = new Rect({
			l: -holdIndicatorRadius,
			r: holdIndicatorRadius,
			t: holdIndicatorRadius,
			b: -holdIndicatorRadius,
		})
			.toQuad()
			.rotate(t * maxDegree)
			.translate(this.pos.x, this.pos.y);

		skin.sprites.draw(this.indicator, rotatedLayout, this.pos.z, 1);
	}

	drawBar(): void {
		const alpha = Math.min(1, Math.unlerp(this.times.alpha.start, this.times.alpha.end, time.now));
		const tall = Math.min(1, Math.unlerp(this.times.scale.start, this.times.scale.end, time.now));

		const layout = new Rect({
			l: this.pos.x - holdBarWidth,
			r: this.pos.x + holdBarWidth,
			t: Math.lerp(this.pos.y, this.bar.y, tall),
			b: this.pos.y,
		});

		skin.sprites.holdBar.draw(layout, this.bar.z, alpha);
	}

	touch(): void {
		if (options.autoplay) return;
		this.touched = false;

		for (const touch of touches) {
			if (this.isTouching(touch.x, touch.y)) {
				this.touched = true;
				break;
			}
		}
	}

	particleEffects(judgement: Judgment): void {
		// Move the note so the effect plays at the scanline position
		this.pos.y = scanline.y;
		super.particleEffects(judgement);
	}

	get width(): number {
		return noteRadius;
	}

	get height(): number {
		return noteRadius;
	}

	get startInfo(): EntityInfo {
		return entityInfos.get(this.holdData.startRef);
	}

	get startData() {
		return archetypes.HoldStartNote.data.get(this.holdData.startRef);
	}

	get startShared() {
		return archetypes.HoldStartNote.shared.get(this.holdData.startRef);
	}
}
