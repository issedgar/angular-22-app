import { Service, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

export interface PrimaryColorPreset {
  key: string;
  labelKey: string;
  value: string;
  hover: string;
}

export const PRIMARY_COLOR_PRESETS: PrimaryColorPreset[] = [
  { key: 'angular-red', labelKey: 'theme.colorAngularRed', value: '#dd0031', hover: '#c3002f' },
  { key: 'blue',        labelKey: 'theme.colorBlue',       value: '#2563eb', hover: '#1d4ed8' },
  { key: 'violet',      labelKey: 'theme.colorViolet',     value: '#7c3aed', hover: '#6d28d9' },
  { key: 'emerald',     labelKey: 'theme.colorEmerald',    value: '#059669', hover: '#047857' },
  { key: 'amber',       labelKey: 'theme.colorAmber',      value: '#d97706', hover: '#b45309' },
  { key: 'cyan',        labelKey: 'theme.colorCyan',       value: '#0891b2', hover: '#0e7490' },
];

const THEME_KEY   = 'angular-showcase-theme';
const PRIMARY_KEY = 'angular-showcase-primary-color';

@Service()
export class AppearanceService {
  readonly theme        = signal<Theme>('dark');
  readonly primaryColor = signal<string>(PRIMARY_COLOR_PRESETS[0].value);

  initialize(): void {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const theme: Theme = savedTheme === 'light' ? 'light' : 'dark';
    this._applyTheme(theme);

    const savedColor = localStorage.getItem(PRIMARY_KEY);
    const preset = PRIMARY_COLOR_PRESETS.find(p => p.value === savedColor) ?? PRIMARY_COLOR_PRESETS[0];
    this._applyPrimaryColor(preset);
  }

  setTheme(theme: Theme): void {
    this._applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  setPrimaryColor(preset: PrimaryColorPreset): void {
    this._applyPrimaryColor(preset);
    localStorage.setItem(PRIMARY_KEY, preset.value);
  }

  toggleTheme(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private _applyTheme(theme: Theme): void {
    this.theme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  private _applyPrimaryColor(preset: PrimaryColorPreset): void {
    this.primaryColor.set(preset.value);
    const root = document.documentElement;
    root.style.setProperty('--color-angular-red', preset.value);
    root.style.setProperty('--color-angular-dark-red', preset.hover);
  }
}
