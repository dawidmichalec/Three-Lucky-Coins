import { TranslationKey } from "../core/LocalizationManager";
import { LocalizationManager } from "../core/LocalizationManager";
import { TextStyleOptions, Text } from "pixi.js";

export class LocalizedTextList extends Text {
  private keys: TranslationKey[];
  private localization: LocalizationManager;

  constructor(keys: TranslationKey[], style: TextStyleOptions) {
    const localization = LocalizationManager.getInstance();

    super({
      text: localization.tList(keys),
      style,
    });

    this.keys = keys;
    this.localization = localization;

    this.localization.subscribe(() => {
      this.text = this.localization.tList(this.keys);
    });
  }
}
