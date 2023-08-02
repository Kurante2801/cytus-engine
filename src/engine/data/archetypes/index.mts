import { Initialization } from "./Initialization.mjs";
import { InputManager } from "./InputManager.mjs";
import { ScanlineCommand } from "./ScanlineCommand.mjs";
import { Stage } from "./Stage.mjs";
import { FlickNote } from "./notes/FlickNote.mjs";
import { TapNote } from "./notes/TapNote.mjs";
import { DragNote } from "./notes/drag/DragNote.mjs";
import { DragSegment } from "./notes/drag/DragSegment.mjs";
import { HoldEndNote } from "./notes/hold/HoldEndNote.mjs";
import { HoldStartNote } from "./notes/hold/HoldStartNote.mjs";
import { LongHoldEndNote } from "./notes/hold/LongHoldEndNote.mjs";
import { LongHoldStartNote } from "./notes/hold/LongHoldStartNote.mjs";

export const archetypes = defineArchetypes({
	Initialization,
	Stage,
	InputManager,
	ScanlineCommand,

	TapNote,
	HoldStartNote,
	HoldEndNote,
	LongHoldStartNote,
	LongHoldEndNote,
	DragNote,
	FlickNote,

	DragSegment,
});
