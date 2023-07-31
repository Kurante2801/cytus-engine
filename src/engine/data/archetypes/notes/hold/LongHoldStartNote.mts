import { buckets } from "../../../buckets.mjs";
import { particle } from "../../../particle.mjs";
import { skin } from "../../../skin.mjs";
import { HoldStartNote } from "./HoldStartNote.mjs";

export class LongHoldStartNote extends HoldStartNote {
	bucket = buckets.longHoldStart;
	effect = particle.effects.longHold;

	preprocess(): void {
		super.preprocess();

		this.sprite = skin.sprites.longHold.id;
		if (!skin.sprites.exists(this.sprite)) this.sprite = skin.sprites.longHoldFallback.id;
	}
}
