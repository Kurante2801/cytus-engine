import { EngineInfo } from "sonolus-core";
import { Resource } from "./Resource.cjs";

export { cytus2toLevelData } from "./c2/convert.cjs";
export * from "./c2/index.cjs";

export const version = "0.1.0";

export const engineInfo = {
	name: "cytus",
	version: 8,
	title: {
		en: "Cytus",
	},
	subtitle: {
		en: "",
	},
	author: {
		en: "Kurante",
	},
	description: {
		en: `Cytus engine for Sonolus.\nVersion: ${version}\nGitHub: https://github.com/Kurante2801/cytus-engine`,
		es: `Motor Cytus para Sonolus.\nVersion: ${version}\nGitHub: https://github.com/Kurante2801/cytus-engine`,
	},
} as const satisfies Partial<EngineInfo>;

export const engineConfiguration = new Resource("EngineConfiguration");
export const engineData = new Resource("EngineData");
export const engineThumbnail = new Resource("thumbnail.png");
