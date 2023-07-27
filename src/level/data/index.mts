import { LevelData } from "sonolus-core";
import { archetypes } from "../../engine/data/archetypes/index.mjs";

export const data: LevelData = {
	bgmOffset: 0,
	entities: [
		{
			archetype: archetypes.Initialization.name,
			data: [],
		},
		{
			archetype: archetypes.Stage.name,
			data: [],
		},
	],
};
