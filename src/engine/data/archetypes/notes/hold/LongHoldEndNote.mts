import { buckets } from "../../../buckets.mjs";
import { longHoldBarWidth } from "../../../constants.mjs";
import { particle } from "../../../particle.mjs";
import { note } from "../../../shared.mjs";
import { skin } from "../../../skin.mjs";
import { HoldEndNote } from "./HoldEndNote.mjs";

export class LongHoldEndNote extends HoldEndNote {
	bucket = buckets.longHoldEnd;
	effect = particle.effects.longHold;

	globalPreprocess(): void {
		super.globalPreprocess();

		note.longHoldBar = skin.sprites.longHoldBar.id;
		if (!skin.sprites.exists(note.longHoldBar)) note.longHoldBar = skin.sprites.longHoldBarFallback.id;
	}

	preprocess(): void {
		super.preprocess();

		this.sprite = skin.sprites.longHold.id;
		if (!skin.sprites.exists(this.sprite)) this.sprite = skin.sprites.longHoldFallback.id;
	}

	drawBar(): void {
		const alpha = Math.min(1, Math.unlerp(this.times.alpha.start, this.times.alpha.end, time.now));

		const t =
			time.now < this.startTarget
				? Math.unlerp(this.times.scale.start, this.times.scale.end, time.now)
				: Math.unlerp(this.times.target, this.startTarget, time.now);
		const wide = longHoldBarWidth * t;

		const layout = new Rect({
			l: this.pos.x - wide,
			r: this.pos.x + wide,
			t: 1,
			b: -1,
		});

		skin.sprites.draw(note.longHoldBar, layout, this.bar.z, alpha);
	}
}
