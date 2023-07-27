import { error, log } from "node:console";
import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { hash } from "sonolus-core";

/** @type import('sonolus.js').SonolusCLIConfig */
export default {
	entry: "./src/index.ts",

	devServer(sonolus) {
		const extensions = ["ogg", "mp3"];
		let found = false;

		for (const extension of extensions) {
			if (found || !existsSync("./src/level/bgm." + extension)) continue;

			try {
				copyFileSync("./src/level/bgm." + extension, "./.dev/bgm." + extension);

				sonolus.db.levels[0].bgm = {
					type: "LevelBgm",
					hash: hash(readFileSync("./.dev/bgm." + extension)),
					url: "/bgm." + extension,
				};

				found = true;
				break;
			} catch (_) {
				error("Error: Failed to setup bgm for file: bgm." + extension);
			}
		}

		if (!found) {
			error("Error: failed to setup bgm, using fallback");
			log();
		}
	},
};
