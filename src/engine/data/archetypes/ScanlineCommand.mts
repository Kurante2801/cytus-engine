import { Direction } from "../constants.mjs";
import { scanline } from "../shared.mjs";
import { getY } from "../util.mjs";

export class ScanlineCommand extends Archetype {
	data = this.defineData({
		startBeat: { name: "startBeat", type: Number },
		endBeat: { name: "endBeat", type: Number },
		direction: { name: "direction", type: DataType<Direction> },
	});

	times = this.entityMemory({
		start: Number,
		end: Number,
	});

	preprocess(): void {
		this.times.start = bpmChanges.at(this.data.startBeat).time;
		this.times.end = bpmChanges.at(this.data.endBeat).time;
	}

	spawnOrder(): number {
		return 1000 + this.times.start;
	}

	shouldSpawn(): boolean {
		return time.now >= this.times.start;
	}

	updateSequential(): void {
		if (time.now >= this.times.end) {
			this.despawn = true;
			return;
		}

		scanline.y = getY(this.data.direction, Math.unlerp(this.times.start, this.times.end, time.now));
	}
}
