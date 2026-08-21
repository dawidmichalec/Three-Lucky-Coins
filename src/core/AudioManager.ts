import { sound, PlayOptions } from "@pixi/sound";

import { SoundId } from "../audio/SoundId";
import { AUDIO_PATHS } from "../audio/AudioPaths";
import { AUDIO_REGISTRY } from "../audio/AudioRegistry";
import { AudioCategory } from "../audio/AudioCategory";

import { SettingsManager } from "./SettingsManager";

export class AudioManager {
  private static instance: AudioManager;

  private currentMusic?: SoundId;

  static getInstance(settingsManager?: SettingsManager) {
    if (!AudioManager.instance) {
      if (!settingsManager) {
        throw new Error("SettingsManager required");
      }

      AudioManager.instance = new AudioManager(settingsManager);
    }

    return AudioManager.instance;
  }

  private constructor(private settingsManager: SettingsManager) {}

  async load(id: SoundId, path: string) {
    if (sound.exists(id)) return;

    await sound.add(id, {
      url: path,
      preload: true,
    });
  }

  async loadAll() {
    await Promise.all(
      Object.entries(AUDIO_PATHS).map(([id, path]) =>
        this.load(id as SoundId, path),
      ),
    );
  }

  play(id: SoundId, options?: PlayOptions) {
    const category = AUDIO_REGISTRY[id];

    if (category === AudioCategory.MUSIC) {
      console.log("SETTING CURRENT MUSIC", id);
      this.currentMusic = id;
    }

    const settings = this.settingsManager.get();

    console.log("PLAY", id, category, settings.audioEnabled);

    if (!settings.audioEnabled) {
      return;
    }

    const volume =
      category === AudioCategory.MUSIC
        ? settings.musicVolume
        : settings.sfxVolume;

    sound.play(id, {
      ...options,
      volume,
      loop: category === AudioCategory.MUSIC,
    });
  }

  stop(id: SoundId) {
    sound.stop(id);
  }

  stopAll() {
    sound.stopAll();
  }

  refresh() {
    const settings = this.settingsManager.get();

    if (!settings.audioEnabled) {
      sound.stopAll();

      return;
    }

    this.updateVolumes();

    if (this.currentMusic) {
      this.play(this.currentMusic);
    }
  }

  updateVolumes() {
    const settings = this.settingsManager.get();

    Object.entries(AUDIO_REGISTRY).forEach(([id, category]) => {
      const volume =
        category === AudioCategory.MUSIC
          ? settings.musicVolume
          : settings.sfxVolume;

      const audio = sound.find(id);

      if (audio) {
        audio.volume = volume;
      }
    });
  }
}
