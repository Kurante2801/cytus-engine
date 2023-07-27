const usedTocuhes = levelMemory(Collection(16, TouchId));

export const isUsed = (touch: Touch) => usedTocuhes.has(touch.id);
export const markAsUsed = (touch: Touch) => usedTocuhes.add(touch.id);

export class InputManager extends Archetype {
	touchOrder = 0;

	spawnOrder(): number {
		return 1;
	}

	shouldSpawn(): boolean {
		return entityInfos.get(0).state === EntityState.Despawned;
	}

	touch(): void {
		usedTocuhes.clear();
	}
}
