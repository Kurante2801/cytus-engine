export type Cytus2Source = {
	time_base: number;
	start_offset_time: number;
	page_list: Page[];
	tempo_list: Tempo[];
	note_list: Note[];
};

export type Page = {
	start_tick: number;
	end_tick: number;
	scan_line_direction: 1 | -1;
};

export type Tempo = {
	tick: number;
	value: number;
};

export enum NoteType {
	TAP,
	HOLD,
	HOLD_LONG,
	DRAG_HEAD,
	DRAG_CHILD,
	FLICK,
	TAP_DRAG_HEAD,
	TAP_DRAG_CHILD,
}

export type Note = {
	page_index: number;
	type: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
	id: number;
	tick: number;
	x: number;
	has_sibling: boolean;
	hold_tick: number;
	next_id: number;
	is_forward: boolean;
};

export enum DragType {
	DRAG_HEAD,
	DRAG_CHILD,
	TAP_DRAG_HEAD,
	TAP_DRAG_CHILD,
}
