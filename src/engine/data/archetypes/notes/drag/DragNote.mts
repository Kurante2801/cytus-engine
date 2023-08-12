import { Judgment, Touch } from "sonolus.js-compiler";
import { Note, NoteType } from "../Note.mjs";
import { buckets } from "../../../buckets.mjs";
import { windows } from "../../../windows.mjs";
import { particle } from "../../../particle.mjs";
import { Direction, Layer, effectRadius, noteRadius } from "../../../constants.mjs";
import { options } from "../../../../configuration/options.mjs";
import { angle, getZ } from "../../../util.mjs";
import { archetypes } from "../../index.mjs";
import { skin } from "../../../skin.mjs";

export enum DragType {
	DRAG_HEAD,
	DRAG_CHILD,
	TAP_DRAG_HEAD,
	TAP_DRAG_CHILD,
}

export class DragNote extends Note {
	dragData = this.defineData({
		type: { name: "type", type: DataType<DragType> },
		nextRef: { name: "nextRef", type: Number },
	});

	bucket = buckets.drag;
	windows = windows.drag;
	effect = particle.effects.drag;
	type = NoteType.DRAG;

	// Angle to rotate the arrow
	angle = this.entityMemory(Number);

	// // Was this note's sprite changed to a drag child sprite
	changed = this.entityMemory(Boolean);

	shared = this.defineSharedMemory({
		judged: Boolean,
		sprite: SkinSpriteId,
		spawn: Number,
		x: Number,
		y: Number,
		z: Number,
	});

	preprocess(): void {
		super.preprocess();
		this.shared.x = this.pos.x;
		this.shared.y = this.pos.y;

		if (this.dragData.type === DragType.DRAG_HEAD) {
			this.sprite = this.data.direction === Direction.Up ? skin.sprites.dragHeadUp.id : skin.sprites.dragHeadDown.id;
			if (!skin.sprites.exists(this.sprite)) this.sprite = skin.sprites.dragHeadFallback.id;
		} else if (this.dragData.type === DragType.DRAG_CHILD) {
			this.sprite = this.data.direction === Direction.Up ? skin.sprites.dragChildUp.id : skin.sprites.dragChildDown.id;
			if (!skin.sprites.exists(this.sprite)) this.sprite = skin.sprites.dragChildFallback.id;
		} else {
			this.sprite = this.data.direction === Direction.Up ? skin.sprites.dragTapChildUp.id : skin.sprites.dragTapChildDown.id;
			if (!skin.sprites.exists(this.sprite)) this.sprite = skin.sprites.dragTapChildFallback.id;
		}

		this.shared.sprite = this.sprite;
		this.shared.spawn = this.times.spawn;
		this.pos.z = getZ(this.dragData.type === DragType.DRAG_HEAD ? Layer.NOTE : Layer.DRAG_CHILD, this.times.target);
		this.shared.z = this.pos.z;
	}

	initialize(): void {
		super.initialize();

		if (this.dragData.nextRef <= 0) return;
		const next = this.nextShared;

		archetypes.DragSegment.spawn({
			startRef: this.info.index,
			endRef: this.dragData.nextRef,
			startX: this.pos.x,
			startY: this.pos.y,
			startZ: this.pos.z,
			endX: next.x,
			endY: next.y,
			endZ: next.z,
			startType: this.dragData.type,
			endType: this.nextDragData.type,
		});

		if (this.dragData.type !== DragType.DRAG_HEAD) return;

		this.angle = angle(this.pos.x, this.pos.y, next.x, next.y);
	}

	touch(): void {
		if (options.autoplay || time.now < this.input.min) return;

		for (const touch of touches) {
			if (this.isTouching(touch.x, touch.y)) {
				this.judge(touch, time.now, false);
				break;
			}
		}
	}

	judge(touch: Touch, time: number, mark: boolean): void {
		this.shared.judged = true;
		super.judge(touch, time, mark);
	}

	judgeMiss(): void {
		this.shared.judged = true;
		super.judgeMiss();
	}

	act(): void {
		super.act();

		// To avoid drawing two arrow graphics, change this note's sprite to a child one after its target time
		if (options.autoplay) return;
		if (this.dragData.type !== DragType.DRAG_HEAD || time.now < this.times.target || this.changed) return;

		this.changed = true;

		this.sprite = this.data.direction === Direction.Up ? skin.sprites.dragChildUp.id : skin.sprites.dragChildDown.id;
		if (!skin.sprites.exists(this.sprite)) this.sprite = skin.sprites.dragChildFallback.id;
	}

	draw(): void {
		super.draw();

		// Draw arrow
		if (this.dragData.type !== DragType.DRAG_HEAD || this.changed) return;

		const alpha = Math.min(1, Math.unlerp(this.times.alpha.start, this.times.alpha.end, time.now));
		const scale = Math.min(1, Math.unlerp(this.times.scale.start, this.times.scale.end, time.now));

		const layout = new Rect({
			l: -this.width * scale,
			r: this.width * scale,
			t: this.height * scale,
			b: -this.height * scale,
		})
			.toQuad()
			.rotate(this.angle)
			.translate(this.pos.x, this.pos.y);

		skin.sprites.dragArrow.draw(layout, this.pos.z + 0.0001, alpha);
	}

	particleEffects(judgment: Judgment): void {
		if (this.dragData.type !== DragType.TAP_DRAG_CHILD) return super.particleEffects(judgment);

		const radius = effectRadius * options.effectSize;
		const layout = new Rect({
			l: this.pos.x - radius,
			r: this.pos.x + radius,
			t: this.pos.y + radius,
			b: this.pos.y - radius,
		});

		particle.effects.tap.spawn(layout, 0.25, false);
	}

	get width(): number {
		return noteRadius;
	}

	get height(): number {
		return noteRadius;
	}

	get nextShared() {
		return archetypes.DragNote.shared.get(this.dragData.nextRef);
	}

	get nextDragData() {
		return archetypes.DragNote.dragData.get(this.dragData.nextRef);
	}
}
