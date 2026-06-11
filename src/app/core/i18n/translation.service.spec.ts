import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { TranslationService } from './translation.service';

const EN_DATA = {
  nav: { dashboard: 'Dashboard', groups: { data: 'Data' } },
  common: { loading: 'Loading...' },
};

const ES_DATA = {
  nav: { dashboard: 'Inicio', groups: { data: 'Datos' } },
  // common intentionally missing to test fallback
};

function mockFetch(): void {
  vi.spyOn(globalThis, 'fetch').mockImplementation((url: RequestInfo | URL) => {
    const data = url.toString().includes('/es.json') ? ES_DATA : EN_DATA;
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data),
    } as Response);
  });
}

describe('TranslationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
    document.documentElement.lang = '';
    mockFetch();
  });

  it('initializes with English by default', async () => {
    const ts = TestBed.inject(TranslationService);
    await ts.initialize();
    expect(ts.currentLanguage()).toBe('en');
  });

  it('translates a nested key', async () => {
    const ts = TestBed.inject(TranslationService);
    await ts.initialize();
    expect(ts.translate('nav.dashboard')).toBe('Dashboard');
    expect(ts.translate('nav.groups.data')).toBe('Data');
  });

  it('returns the key itself when translation is missing', async () => {
    const ts = TestBed.inject(TranslationService);
    await ts.initialize();
    expect(ts.translate('does.not.exist')).toBe('does.not.exist');
  });

  it('persists the chosen language to localStorage', async () => {
    const ts = TestBed.inject(TranslationService);
    await ts.initialize();
    await ts.setLanguage('es');
    expect(localStorage.getItem('lang')).toBe('es');
  });

  it('restores language from localStorage on next initialize', async () => {
    localStorage.setItem('lang', 'es');
    const ts = TestBed.inject(TranslationService);
    await ts.initialize();
    expect(ts.currentLanguage()).toBe('es');
    expect(ts.translate('nav.dashboard')).toBe('Inicio');
  });

  it('falls back to English for keys missing in current language', async () => {
    const ts = TestBed.inject(TranslationService);
    await ts.initialize();
    await ts.setLanguage('es');
    // 'common.loading' is not in ES_DATA — should fall back to EN
    expect(ts.translate('common.loading')).toBe('Loading...');
  });

  it('updates document.documentElement.lang on language switch', async () => {
    const ts = TestBed.inject(TranslationService);
    await ts.initialize();
    await ts.setLanguage('es');
    expect(document.documentElement.lang).toBe('es');
  });

  it('switches back to English after being set to Spanish', async () => {
    const ts = TestBed.inject(TranslationService);
    await ts.initialize();
    await ts.setLanguage('es');
    await ts.setLanguage('en');
    expect(ts.currentLanguage()).toBe('en');
    expect(ts.translate('nav.dashboard')).toBe('Dashboard');
  });
});
