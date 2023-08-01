import { angle } from "../../../util.mjs";
import { archetypes } from "../../index.mjs";
import { DragType } from "./DragNote.mjs";

export class DragSegment extends SpawnableArchetype({
	startRef: Number,
	endRef: Number,
	startX: Number,
	startY: Number,
	endX: Number,
	endY: Number,
	startType: Number,
}) {
	angle = this.entityMemory(Number);

	initialize(): void {
		this.angle = angle(this.spawnData.startX, this.spawnData.startY, this.spawnData.endX, this.spawnData.endY);
	}

	get startData() {
		return this.spawnData.startType == DragType.TAP_DRAG_HEAD
			? archetypes.TapNote.shared.get(this.spawnData.startRef)
			: archetypes.DragNote.shared.get(this.spawnData.startRef);
	}

	get endData() {
		return archetypes.DragNote.shared.get(this.spawnData.endRef);
	}
}
