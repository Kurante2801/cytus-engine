import { Initialization } from "./Initialization.mjs";
import { InputManager } from "./InputManager.mjs";
import { ScanlineCommand } from "./ScanlineCommand.mjs";
import { Stage } from "./Stage.mjs";
import { TapNote } from "./notes/TapNote.mjs";

export const archetypes = defineArchetypes({
	Initialization,
	Stage,
	InputManager,
	ScanlineCommand,

	TapNote,
});
