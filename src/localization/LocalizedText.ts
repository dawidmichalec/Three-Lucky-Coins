import { Text, TextStyleOptions } from "pixi.js";
import {
  LocalizationManager,
  TranslationKey,
} from "../core/LocalizationManager";

interface LocalizedTextStyle extends TextStyleOptions {
  font?: string;
}

export class LocalizedText extends Text {
  private localization: LocalizationManager;

  private translationKey: TranslationKey;

  constructor(key: TranslationKey, style: LocalizedTextStyle) {
    const localization = LocalizationManager.getInstance();

    super({
      text: localization.t(key),

      style,
    });

    this.localization = localization;

    this.translationKey = key;

    this.localization.subscribe(() => {
      this.text = this.localization.t(this.translationKey);
    });
  }

  setKey(key: TranslationKey) {
    this.translationKey = key;
    this.text = this.localization.t(key);
  }
}
