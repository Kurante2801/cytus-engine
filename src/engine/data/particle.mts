import { ParticleEffectName } from "sonolus-core";

export const particle = defineParticle({
	effects: {
		tap: ParticleEffectName.NoteCircularTapCyan,
		hold: ParticleEffectName.NoteCircularTapRed,
		longHold: ParticleEffectName.NoteCircularTapYellow,
		drag: ParticleEffectName.NoteCircularTapPurple,
		flick: ParticleEffectName.NoteCircularTapGreen,
	},
});
