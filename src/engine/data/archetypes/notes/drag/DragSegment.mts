import { Direction, Layer, noteRadius } from "../../../constants.mjs";
import { skin } from "../../../skin.mjs";
import { angle, getZ } from "../../../util.mjs";
import { archetypes } from "../../index.mjs";
import { DragType } from "./DragNote.mjs";

export class DragSegment extends SpawnableArchetype({
	startRef: Number,
	endRef: Number,
	startX: Number,
	startY: Number,
	startZ: Number,
	endX: Number,
	endY: Number,
	endZ: Number,
	startType: Number,
	endType: Number,
}) {
	angle = this.entityMemory(Number);

	sprites = this.entityMemory({
		start: SkinSpriteId,
		end: SkinSpriteId,
		moving: SkinSpriteId,
	});

	times = this.entityMemory({
		start: Number,
		end: Number,
	});

	arrowLayout = this.entityMemory(Quad);

	segment = this.entityMemory({
		start: Quad,
		end: Quad,
		z: Number,
	});

	initialize(): void {
		this.angle = angle(this.spawnData.startX, this.spawnData.startY, this.spawnData.endX, this.spawnData.endY);

		this.sprites.start = this.startSprite;
		this.sprites.end = this.endShared.sprite;

		const type = this.spawnData.startType;
		if (type == DragType.DRAG_HEAD || type == DragType.DRAG_CHILD) {
			// Segment is a regular drag
			this.sprites.moving = this.startData.direction === Direction.Up ? skin.sprites.dragHeadUp.id : skin.sprites.dragHeadDown.id;
			if (!skin.sprites.exists(this.sprites.moving)) this.sprites.moving = skin.sprites.dragHeadFallback.id;
		} else {
			// Segment is a tap drag
			this.sprites.moving =
				this.startData.direction === Direction.Up ? skin.sprites.dragTapHeadUp.id : skin.sprites.dragTapHeadDown.id;
			if (!skin.sprites.exists(this.sprites.moving)) this.sprites.moving = skin.sprites.dragTapHeadFallback.id;

			// We don't want to draw a tap note if the tap drag note was pressed
			// instead we just want to draw a stationary arrow circle
			if (type == DragType.TAP_DRAG_HEAD) this.sprites.start = this.sprites.moving;
		}

		this.times.start = bpmChanges.at(this.startData.beat).time;
		this.times.end = bpmChanges.at(this.endData.beat).time;

		this.arrowLayout.copyFrom(
			new Rect({
				l: -noteRadius,
				r: noteRadius,
				t: noteRadius,
				b: -noteRadius,
			})
				.toQuad()
				.rotate(this.angle),
		);

		this.segment.z = getZ(Layer.DRAG_SEGMENT, this.times.start);

		// To create the bar connecting the note, we create two rectangles (one at start, the other at end)
		// then we turn the rectangles into quads and rotate them, finally we use them in updateParallel
		// see: https://wiki.sonolus.com/engine-specs/essentials/graphics.html#quad
		const thickness = new Rect({
			l: -0.025,
			r: 0.025,
			t: 0,
			b: 0,
		})
			.toQuad()
			.rotate(this.angle);

		thickness.translate(this.spawnData.startX, this.spawnData.startY).copyTo(this.segment.start);
		thickness.translate(this.spawnData.endX, this.spawnData.endY).copyTo(this.segment.end);
	}

	updateParallel(): void {
		if (time.now >= this.times.end) {
			this.despawn = true;
			return;
		}

		// Draw notes if they were judged (judged notes are despawned)
		if (this.startJudged && time.now <= this.times.start)
			this.drawNote(this.sprites.start, this.spawnData.startX, this.spawnData.startY, this.spawnData.startZ);
		if (this.endShared.judged && time.now <= this.times.end)
			this.drawNote(this.sprites.end, this.spawnData.endX, this.spawnData.endY, this.spawnData.endZ);

		const t = Math.clamp(Math.unlerp(this.times.start, this.times.end, time.now), 0, 1);
		const t2 = Math.clamp(Math.unlerp(this.startSpawn, this.times.start, time.now), 0, 0.5) * 2;
		const alpha = Math.clamp(Math.unlerp(this.startSpawn, this.times.start, time.now), 0, 1) * 0.5;

		// Draw bar
		const layout = new Quad({
			x1: Math.lerp(this.segment.start.x1, this.segment.end.x2, t),
			y1: Math.lerp(this.segment.start.y1, this.segment.end.y2, t),
			x2: Math.lerp(this.segment.start.x1, this.segment.end.x2, t2),
			y2: Math.lerp(this.segment.start.y1, this.segment.end.y2, t2),
			x3: Math.lerp(this.segment.start.x4, this.segment.end.x3, t2),
			y3: Math.lerp(this.segment.start.y4, this.segment.end.y3, t2),
			x4: Math.lerp(this.segment.start.x4, this.segment.end.x3, t),
			y4: Math.lerp(this.segment.start.y4, this.segment.end.y3, t),
		});

		skin.sprites.holdBar.draw(layout, this.segment.z, alpha);

		if (time.now < this.times.start) return;

		const x = Math.lerp(this.spawnData.startX, this.spawnData.endX, t);
		const y = Math.lerp(this.spawnData.startY, this.spawnData.endY, t);

		this.drawNote(this.sprites.moving, x, y, this.spawnData.startZ);
		skin.sprites.dragArrow.draw(this.arrowLayout.translate(x, y), this.spawnData.startZ + 0.0001, 1);
	}

	drawNote(sprite: SkinSpriteId, x: number, y: number, z: number) {
		const layout = new Rect({
			l: x - noteRadius,
			r: x + noteRadius,
			t: y + noteRadius,
			b: y - noteRadius,
		});

		skin.sprites.draw(sprite, layout, z, 1);
	}

	get startData() {
		return archetypes.DragNote.data.get(this.spawnData.startRef);
	}

	get endData() {
		return archetypes.DragNote.data.get(this.spawnData.endRef);
	}

	get startSprite(): SkinSpriteId {
		return this.spawnData.startType == DragType.TAP_DRAG_HEAD
			? archetypes.TapNote.shared.get(this.spawnData.startRef).sprite
			: archetypes.DragNote.shared.get(this.spawnData.startRef).sprite;
	}

	get startJudged(): boolean {
		return this.spawnData.startType == DragType.TAP_DRAG_HEAD
			? archetypes.TapNote.shared.get(this.spawnData.startRef).judged
			: archetypes.DragNote.shared.get(this.spawnData.startRef).judged;
	}

	get startSpawn(): number {
		return this.spawnData.startType == DragType.TAP_DRAG_HEAD
			? archetypes.TapNote.shared.get(this.spawnData.startRef).spawn
			: archetypes.DragNote.shared.get(this.spawnData.startRef).spawn;
	}

	get endShared() {
		return archetypes.DragNote.shared.get(this.spawnData.endRef);
	}
}
