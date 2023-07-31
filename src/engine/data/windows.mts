// https://github.com/NonSpicyBurrito/sonolus-voez-engine/blob/6ab6fa91aedc2de57d806ad6a49527bd7e943d9c/src/engine/data/archetypes/windows.mts
type Seconds = number | [min: number, max: number];

function fromSeconds(perfect: Seconds, great: Seconds, good: Seconds) {
	const toWindow = (seconds: Seconds) =>
		typeof seconds === "number" ? { min: -seconds, max: seconds } : { min: seconds[0], max: seconds[1] };

	return {
		perfect: toWindow(perfect),
		great: toWindow(great),
		good: toWindow(good),
	};
}

const perfect = 0.04;
const great = 0.1;
const good = 0.15;

const drag = 0.1;

export const windows = {
	tap: fromSeconds(perfect, great, good),
	drag: fromSeconds([-drag, perfect], [-drag, great], [-drag, good]),
	flick: fromSeconds(perfect, great, good),
	holdStart: fromSeconds([0, perfect], [0, great], [0, good]),
	holdEnd: fromSeconds([-perfect, 0], [-great, 0], [-good, 0]),
};
