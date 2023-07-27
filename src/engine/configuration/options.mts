import { NameText } from "sonolus-core";

export const options = defineOptions({
	autoplay: {
		name: NameText.AutoPlay,
		scope: "Cytus",
		standard: true,
		type: "toggle",
		def: 0,
	},
	speed: {
		name: NameText.LevelSpeed,
		standard: true,
		type: "slider",
		def: 1,
		min: 0.5,
		max: 2,
		step: 0.05,
	},
	sfxEnabled: {
		name: NameText.SFX,
		scope: "Cytus",
		type: "toggle",
		def: 1,
	},
	autoSFX: {
		name: NameText.AutoSFX,
		scope: "Cytus",
		type: "toggle",
		def: 0,
	},
	mirrorX: {
		name: "Mirror Horizontally",
		scope: "Cytus",
		type: "toggle",
		def: 0,
	},
	mirrorY: {
		name: "Mirror Vertically",
		scope: "Cytus",
		type: "toggle",
		def: 0,
	},
	horizontalMargin: {
		name: "Horizontal Margin",
		scope: "Cytus",
		type: "slider",
		def: 3,
		min: 1,
		max: 5,
		step: 1,
	},
	verticalMargin: {
		name: "Vertical Margin",
		scope: "Cytus",
		type: "slider",
		def: 3,
		min: 1,
		max: 5,
		step: 1,
	},
	noteSize: {
		name: NameText.NoteSize,
		scope: "Cytus",
		type: "slider",
		def: 1,
		min: 0.75,
		max: 1.25,
		step: 0.25,
	},
});
