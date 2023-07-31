import { EngineConfigurationUI } from "sonolus-core";

export const ui: EngineConfigurationUI = {
	scope: "Cytus",
	primaryMetric: "arcade",
	secondaryMetric: "perfectRate",
	menuVisibility: {
		scale: 1,
		alpha: 1,
	},
	judgmentVisibility: {
		scale: 1,
		alpha: 1,
	},
	comboVisibility: {
		scale: 1,
		alpha: 1,
	},
	primaryMetricVisibility: {
		scale: 1,
		alpha: 1,
	},
	secondaryMetricVisibility: {
		scale: 1,
		alpha: 1,
	},
	judgmentAnimation: {
		scale: {
			from: 1.15,
			to: 1,
			duration: 0.15,
			ease: "OutCubic",
		},
		alpha: {
			from: 1,
			to: 1,
			duration: 0,
			ease: "None",
		},
	},
	comboAnimation: {
		scale: {
			from: 1.15,
			to: 1,
			duration: 0.15,
			ease: "OutCubic",
		},
		alpha: {
			from: 1,
			to: 1,
			duration: 0,
			ease: "None",
		},
	},
	judgmentErrorStyle: "plus",
	judgmentErrorPlacement: "both",
	judgmentErrorMin: 0,
};
