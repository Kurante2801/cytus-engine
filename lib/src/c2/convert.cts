import { EngineArchetypeDataName, EngineArchetypeName, LevelDataEntity } from "sonolus-core";
import { Cytus2Source, Note } from "./index.cjs";

export function cytus2toLevelData(chart: Cytus2Source) {
	const entities: LevelDataEntity[] = [
		{
			archetype: "Initialization",
			data: [],
		},
		{
			archetype: "Stage",
			data: [],
		},
		{
			archetype: "InputManager",
			data: [],
		},
	];

	// https://github.com/NonSpicyBurrito/sonolus-voez-engine/blob/6ab6fa91aedc2de57d806ad6a49527bd7e943d9c/lib/src/vc/convert.cts#LL64C8-L64C8
	const addEntity = (archetype: string, data: Record<string, number | string>, ref?: string) => {
		const length = entities.push({
			archetype,
			data: Object.entries(data).map(([k, v]) => (typeof v === "number" ? { name: k, value: v } : { name: k, ref: v })),
		});

		if (ref) entities[length - 1].ref = ref;
	};

	// https://github.com/Cytoid/Cytoid/blob/e164f56b4894b70fcdcbdfae7bacb9de1c92d604/Assets/Scripts/Game/Chart/Chart.cs#L237
	const tickToTime = (tick: number): number => {
		let result = 0;
		let currentTick = 0;
		let currentTimeZone = 0;

		for (let i = 1; i < chart.tempo_list.length; i++) {
			const tempo = chart.tempo_list[i];
			if (tempo.tick >= tick) break;

			result += ((tempo.tick - currentTick) * 1e-6 * chart.tempo_list[i - 1].value) / chart.time_base;

			currentTick = tempo.tick;
			currentTimeZone++;
		}

		return result + ((tick - currentTick) * 1e-6 * chart.tempo_list[currentTimeZone].value) / chart.time_base;
	};

	// Add a BPM of 60 so 1 beat equals 1 second and we don't have to convert anything
	addEntity(EngineArchetypeName.BpmChange, {
		[EngineArchetypeDataName.Beat]: 0,
		[EngineArchetypeDataName.Bpm]: 60,
	});

	for (const page of chart.page_list) {
		addEntity("ScanlineCommand", {
			startBeat: tickToTime(page.start_tick),
			endBeat: tickToTime(page.end_tick),
			direction: page.scan_line_direction,
		});
	}

	// Add notes
	const unlerp = (min: number, max: number, value: number): number => (value - min) / (max - min);

	// https://github.com/Cytoid/Cytoid/blob/e164f56b4894b70fcdcbdfae7bacb9de1c92d604/Assets/Scripts/Game/Chart/Chart.cs#L282
	const calculateNoteSpeed = (note: Note) => {
		const page = chart.page_list[note.page_index];
		const previous = chart.page_list[note.page_index - 1];
		const pageRatio = (1 * (note.tick - page.start_tick)) / (page.end_tick - page.start_tick);
		const tempo =
			tickToTime(page.end_tick - page.start_tick) * pageRatio +
			tickToTime(previous.end_tick - previous.start_tick) * (1.367 - pageRatio);
		return tempo >= 1.367 ? 1 : 1.367 / tempo;
	};

	const types = ["TapNote"];

	for (const note of chart.note_list) {
		if (note.page_index >= chart.page_list.length || !(note.type in types)) continue;
		const page = chart.page_list[note.page_index];

		const ref: undefined | string = undefined;

		const data: Record<string, string | number> = {
			[EngineArchetypeDataName.Beat]: tickToTime(note.tick),
			x: note.x,
			y: unlerp(page.start_tick, page.end_tick, note.tick),
			direction: page.scan_line_direction,
			speed: note.page_index == 0 ? 1 : calculateNoteSpeed(note),
		};

		addEntity(types[note.type], data, ref);
	}

	return {
		bgmOffset: chart.start_offset_time,
		entities: entities,
	};
}
