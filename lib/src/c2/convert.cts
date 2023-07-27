import { LevelDataEntity } from "sonolus-core";
import { Cytus2Source } from "./index.cjs";

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

	return {
		bgmOffset: chart.start_offset_time,
		entities: entities,
	};
}
