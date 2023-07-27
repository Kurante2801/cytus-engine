import { Direction } from "../constants.mjs";
import { scanline } from "../shared.mjs";
import { bounce, getY } from "../util.mjs";

// Adding an entity for each page makes the chart.json huge
// So this class instead relies on start and end times and the ammount of pages it should have
export class ScanlineCommand extends Archetype {
	data = this.defineData({
		startBeat: { name: "startBeat", type: Number },
		endBeat: { name: "endBeat", type: Number },
		pages: { name: "pages", type: Number },
		direction: { name: "direction", type: DataType<Direction> },
	});

	times = this.entityMemory({
		start: Number,
		end: Number,
	});

	// Percentage between start and end that a single page lasts
	duration = this.entityMemory(Number);

	preprocess(): void {
		this.times.start = bpmChanges.at(this.data.startBeat).time;
		this.times.end = bpmChanges.at(this.data.endBeat).time;

		this.duration = (this.times.end - this.times.start) / this.data.pages;
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

		// The modulo by 2 is so we can use the bounce function
		scanline.y = getY(this.data.direction, bounce((time.now / this.duration) % 2));
	}
}
