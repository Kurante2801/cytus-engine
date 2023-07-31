import { archetypes } from "./index.mjs";

export class Initialization extends Archetype {
	preprocess() {
		// https://github.com/NonSpicyBurrito/sonolus-voez-engine/blob/6ab6fa91aedc2de57d806ad6a49527bd7e943d9c/src/engine/data/archetypes/Initialization.mts#L34
		const gap = 0.05;
		const uiRect = new Rect({
			l: screen.l + gap,
			r: screen.r - gap,
			b: screen.b + gap,
			t: screen.t - gap,
		});

		ui.menu.set({
			anchor: uiRect.lt,
			pivot: { x: 0, y: 1 },
			size: new Vec(0.15, 0.15).mul(ui.configuration.menu.scale),
			rotation: 0,
			alpha: ui.configuration.menu.alpha,
			horizontalAlign: HorizontalAlign.Center,
			background: true,
		});

		ui.metric.secondary.bar.set({
			anchor: uiRect.lt.add(new Vec(gap, 0)).add(new Vec(0.15, 0).mul(ui.configuration.menu.scale)),
			pivot: { x: 0, y: 1 },
			size: new Vec(0.75, 0.15).mul(ui.configuration.metric.secondary.scale),
			rotation: 0,
			alpha: ui.configuration.metric.secondary.alpha,
			horizontalAlign: HorizontalAlign.Left,
			background: true,
		});
		ui.metric.secondary.value.set({
			anchor: uiRect.lt
				.add(new Vec(gap, 0))
				.add(new Vec(0.15, 0).mul(ui.configuration.menu.scale))
				.add(new Vec(0.715, -0.035).mul(ui.configuration.metric.secondary.scale)),
			pivot: { x: 0, y: 1 },
			size: new Vec(0, 0.08).mul(ui.configuration.metric.secondary.scale),
			rotation: 0,
			alpha: ui.configuration.metric.secondary.alpha,
			horizontalAlign: HorizontalAlign.Right,
			background: false,
		});

		ui.metric.primary.bar.set({
			anchor: uiRect.rt,
			pivot: { x: 1, y: 1 },
			size: new Vec(0.75, 0.15).mul(ui.configuration.metric.primary.scale),
			rotation: 0,
			alpha: ui.configuration.metric.primary.alpha,
			horizontalAlign: HorizontalAlign.Left,
			background: true,
		});
		ui.metric.primary.value.set({
			anchor: uiRect.rt.sub(new Vec(0.035, 0.035).mul(ui.configuration.metric.primary.scale)),
			pivot: { x: 1, y: 1 },
			size: new Vec(0, 0.08).mul(ui.configuration.metric.primary.scale),
			rotation: 0,
			alpha: ui.configuration.metric.primary.alpha,
			horizontalAlign: HorizontalAlign.Right,
			background: false,
		});

		const comboTall = 0.15 * ui.configuration.combo.scale;
		const judgeTall = 0.06 * ui.configuration.judgment.scale;

		ui.combo.value.set({
			anchor: { x: 0, y: uiRect.t - comboTall * 0.5 },
			pivot: { x: 0.5, y: 0.5 },
			size: new Vec(0, comboTall),
			rotation: 0,
			alpha: ui.configuration.combo.alpha,
			horizontalAlign: HorizontalAlign.Center,
			background: false,
		});

		ui.judgment.set({
			anchor: { x: 0, y: uiRect.t - comboTall * 0.5 },
			pivot: {
				x: 0.5,
				y: (2.5 * ui.configuration.combo.scale) / ui.configuration.judgment.scale + 0.5,
			},
			size: new Vec(0, judgeTall),
			rotation: 0,
			alpha: ui.configuration.judgment.alpha,
			horizontalAlign: HorizontalAlign.Center,
			background: false,
		});

		// Call globalPreprocess on archetypes that define it
		for (const archetype of Object.values(archetypes)) {
			if ("globalPreprocess" in archetype) archetype.globalPreprocess();
		}
	}

	spawnOrder() {
		return 0;
	}

	updateSequential() {
		this.despawn = true;
	}
}
