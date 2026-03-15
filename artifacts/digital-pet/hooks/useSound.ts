import { useCallback } from "react";
import { soundManager, SoundKey } from "@/utils/soundManager";

export function useSound() {
  const play = useCallback((key: SoundKey, volume?: number) => {
    soundManager.play(key, volume);
  }, []);

  return { play };
}
