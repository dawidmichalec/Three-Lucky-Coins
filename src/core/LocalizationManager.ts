import en from "../localization/en";
import pl from "../localization/pl";
import { Language } from "../localization/Language";

export type TranslationKey = keyof typeof en;

type TranslationDictionary = Record<TranslationKey, string>;

export class LocalizationManager {
  private static instance: LocalizationManager;

  private currentLanguage: Language = Language.EN;

  private translations: Record<Language, TranslationDictionary> = {
    [Language.EN]: en,
    [Language.PL]: pl,
  };

  private listeners: (() => void)[] = [];

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new LocalizationManager();
    }

    return this.instance;
  }

  t(key: TranslationKey): string {
    const value =
      this.translations[this.currentLanguage][key] ?? this.translations.en[key];

    if (!value) {
      console.warn("Missing translation:", key);

      return key;
    }

    return value;
  }

  tList(keys: TranslationKey[]): string {
    return keys.map((key) => this.t(key)).join("\n");
  }

  setLanguage(language: Language) {
    this.currentLanguage = language;

    this.notify();
  }

  getLanguage() {
    return this.currentLanguage;
  }

  subscribe(callback: () => void) {
    this.listeners.push(callback);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}
