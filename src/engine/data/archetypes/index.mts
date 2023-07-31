import { Initialization } from "./Initialization.mjs";
import { InputManager } from "./InputManager.mjs";
import { ScanlineCommand } from "./ScanlineCommand.mjs";
import { Stage } from "./Stage.mjs";
import { TapNote } from "./notes/TapNote.mjs";
import { HoldEndNote } from "./notes/hold/HoldEndNote.mjs";
import { HoldStartNote } from "./notes/hold/HoldStartNote.mjs";

export const archetypes = defineArchetypes({
	Initialization,
	Stage,
	InputManager,
	ScanlineCommand,

	TapNote,
	HoldStartNote,
	HoldEndNote,
});
