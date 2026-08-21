import { AudioCategory } from "./AudioCategory";
import { SoundId } from "./SoundId";

export const AUDIO_REGISTRY = {
  [SoundId.COIN_SPIN]: AudioCategory.SFX,

  [SoundId.SPIN_START]: AudioCategory.SFX,

  [SoundId.SPIN_MIDDLE]: AudioCategory.SFX,

  [SoundId.COIN_LAND]: AudioCategory.SFX,

  [SoundId.BASIC_BUTTON_CLICK]: AudioCategory.SFX,

  [SoundId.TOSS_BUTTON_CLICKED]: AudioCategory.SFX,

  [SoundId.MULTIPLIER_INCREASED]: AudioCategory.SFX,

  [SoundId.WIN]: AudioCategory.SFX,

  [SoundId.LOSE]: AudioCategory.SFX,

  [SoundId.MAIN_THEME]: AudioCategory.MUSIC,

  [SoundId.COIN_ONE_CORRECT]: AudioCategory.SFX,

  [SoundId.COIN_TWO_CORRECT]: AudioCategory.SFX,

  [SoundId.COIN_THREE_CORRECT]: AudioCategory.SFX,

  [SoundId.CARD_SWIPE]: AudioCategory.SFX,
};
