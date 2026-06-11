import { Service, signal } from '@angular/core';

import { Language, LANGUAGES } from './language.model';

type TranslationMap = Record<string, unknown>;

@Service()
export class TranslationService {
  private readonly _translations = signal<TranslationMap>({});
  private readonly _fallback = signal<TranslationMap>({});
  private readonly _currentLanguage = signal<Language>('en');

  readonly currentLanguage = this._currentLanguage.asReadonly();

  translate(key: string): string {
    const result = this.lookup(this._translations(), key);
    if (result !== undefined) return result;

    const fallback = this.lookup(this._fallback(), key);
    if (fallback !== undefined) return fallback;

    return key;
  }

  async setLanguage(lang: Language): Promise<void> {
    const data = await this.loadFile(lang);
    this._translations.set(data);
    this._currentLanguage.set(lang);
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }

  async initialize(): Promise<void> {
    const saved = localStorage.getItem('lang');
    const lang: Language = LANGUAGES.includes(saved as Language) ? (saved as Language) : 'en';

    const enData = await this.loadFile('en');
    this._fallback.set(enData);

    if (lang === 'en') {
      this._translations.set(enData);
    } else {
      const data = await this.loadFile(lang);
      this._translations.set(data);
    }

    this._currentLanguage.set(lang);
    document.documentElement.lang = lang;
  }

  private lookup(map: TranslationMap, key: string): string | undefined {
    const parts = key.split('.');
    let current: unknown = map;

    for (const part of parts) {
      if (current == null || typeof current !== 'object') return undefined;
      current = (current as Record<string, unknown>)[part];
    }

    return typeof current === 'string' ? current : undefined;
  }

  private async loadFile(lang: Language): Promise<TranslationMap> {
    const res = await fetch(`/assets/i18n/${lang}.json`);
    if (!res.ok) throw new Error(`Failed to load translations for "${lang}"`);
    return res.json() as Promise<TranslationMap>;
  }
}
