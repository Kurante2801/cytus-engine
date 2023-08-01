import { ParticleEffectName } from "sonolus-core";

export const particle = defineParticle({
	effects: {
		tap: ParticleEffectName.NoteCircularTapBlue,
		hold: ParticleEffectName.NoteCircularTapRed,
		longHold: ParticleEffectName.NoteCircularTapYellow,
		drag: ParticleEffectName.NoteCircularTapPurple,
	},
});
