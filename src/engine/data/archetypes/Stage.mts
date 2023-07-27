import { options } from "../../configuration/options.mjs";
import { Layer, scanlineThick } from "../constants.mjs";
import { scanline } from "../shared.mjs";
import { skin } from "../skin.mjs";

export class Stage extends Archetype {
	globalPreprocess(): void {
		// Defines the gameplay bounds
		// https://github.com/Cytoid/Cytoid/blob/e164f56b4894b70fcdcbdfae7bacb9de1c92d604/Assets/Scripts/Game/Chart/Chart.cs#L74
		const topRatio = 0.0966666;
		const bottomRatio = 0.07;

		const width = screen.w;
		const height = screen.h;

		const horizontalRatio = 0.8 + (5 - options.horizontalMargin - 1) * 0.02;
		const verticalRatio = 1 - (width * (topRatio + bottomRatio)) / height + (3 - options.verticalMargin) * 0.05;
		const verticalOffset = -(width * (topRatio - (topRatio + bottomRatio) / 2));

		const chartToScreenX = (x: number): number => (x * 2 * horizontalRatio - horizontalRatio) * width * 0.5;
		const chartToScreenY = (y: number): number => {
			const baseSize = height * 0.5;
			return verticalRatio * (-baseSize + 2 * baseSize * y) + verticalOffset;
		};

		scanline.bounds.t = chartToScreenY(1);
		scanline.bounds.b = chartToScreenY(0);

		scanline.bounds.l = chartToScreenX(0);
		scanline.bounds.r = chartToScreenX(1);
	}

	spawnOrder() {
		return 1;
	}

	shouldSpawn() {
		return entityInfos.get(0).state === EntityState.Despawned;
	}

	preprocess(): void {
		// Hide scanline until level starts
		scanline.y = 1 + scanlineThick * 2;
	}

	updateParallel(): void {
		const layout = new Rect({
			l: screen.l,
			r: screen.r,
			t: scanline.y + scanlineThick,
			b: scanline.y - scanlineThick,
		});

		skin.sprites.judgment.draw(layout, Layer.JUDGMENT, 1);
	}
}
