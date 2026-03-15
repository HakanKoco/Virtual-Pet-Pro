import { Audio } from "expo-av";
import { Platform } from "react-native";

// Free sound URLs — Google Actions on Google Sounds (CC BY)
// and other public domain sources
const SOUND_URLS = {
  // Background ambient — cheerful loop
  background: "https://actions.google.com/sounds/v1/ambiences/music_box.ogg",

  // Activity sounds
  eat: "https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg",
  eat2: "https://actions.google.com/sounds/v1/cartoon/pop.ogg",
  play: "https://actions.google.com/sounds/v1/cartoon/woodpecker.ogg",
  playTap: "https://actions.google.com/sounds/v1/cartoon/pop.ogg",
  sleep: "https://actions.google.com/sounds/v1/ambiences/crickets_in_the_wild.ogg",
  clean: "https://actions.google.com/sounds/v1/water/water_dripping_in_cave.ogg",
  cleanBubble: "https://actions.google.com/sounds/v1/cartoon/balloon_pop.ogg",
  heal: "https://actions.google.com/sounds/v1/magic/magic_spell_001.ogg",

  // Reward & level-up
  levelUp: "https://actions.google.com/sounds/v1/cartoon/metal_twang.ogg",
  achievement: "https://actions.google.com/sounds/v1/cartoon/concussive_hit_guitar_boing.ogg",
  dailyReward: "https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg",

  // Coin
  coin: "https://actions.google.com/sounds/v1/cartoon/pop.ogg",
};

export type SoundKey = keyof typeof SOUND_URLS;

class SoundManager {
  private cache: Map<SoundKey, Audio.Sound> = new Map();
  private backgroundSound: Audio.Sound | null = null;
  private backgroundEnabled = true;
  private sfxEnabled = true;
  private initialized = false;

  async init() {
    if (this.initialized) return;
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
      this.initialized = true;
    } catch {}
  }

  async preload(keys: SoundKey[]) {
    await this.init();
    for (const key of keys) {
      if (this.cache.has(key)) continue;
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: SOUND_URLS[key] },
          { shouldPlay: false, volume: 0.6 }
        );
        this.cache.set(key, sound);
      } catch {}
    }
  }

  async play(key: SoundKey, volume = 0.6) {
    if (!this.sfxEnabled) return;
    await this.init();
    try {
      // Try cache first
      let sound = this.cache.get(key);
      if (!sound) {
        const result = await Audio.Sound.createAsync(
          { uri: SOUND_URLS[key] },
          { shouldPlay: false, volume }
        );
        sound = result.sound;
        this.cache.set(key, sound);
      }
      await sound.setPositionAsync(0);
      await sound.setVolumeAsync(volume);
      await sound.playAsync();
    } catch {}
  }

  async startBackground() {
    if (!this.backgroundEnabled) return;
    await this.init();
    try {
      if (this.backgroundSound) {
        await this.backgroundSound.stopAsync();
        await this.backgroundSound.unloadAsync();
        this.backgroundSound = null;
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: SOUND_URLS.background },
        {
          shouldPlay: true,
          isLooping: true,
          volume: 0.2,
        }
      );
      this.backgroundSound = sound;
    } catch {}
  }

  async stopBackground() {
    try {
      if (this.backgroundSound) {
        await this.backgroundSound.stopAsync();
        await this.backgroundSound.unloadAsync();
        this.backgroundSound = null;
      }
    } catch {}
  }

  setBackgroundEnabled(enabled: boolean) {
    this.backgroundEnabled = enabled;
    if (!enabled) {
      this.stopBackground();
    } else {
      this.startBackground();
    }
  }

  setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
  }

  async cleanup() {
    try {
      await this.stopBackground();
      for (const sound of this.cache.values()) {
        await sound.unloadAsync();
      }
      this.cache.clear();
    } catch {}
  }
}

// Singleton
export const soundManager = new SoundManager();
