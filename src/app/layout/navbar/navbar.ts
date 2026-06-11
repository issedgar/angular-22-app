import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

import { LayoutService } from '../../core/services/layout.service';
import { TranslationService } from '../../core/i18n/translation.service';
import { TranslatePipe } from '../../core/i18n/translation.pipe';
import { Language, LANGUAGES } from '../../core/i18n/language.model';
import { AppearanceService, PRIMARY_COLOR_PRESETS, PrimaryColorPreset } from '../../core/services/appearance.service';

const ROUTE_LABEL_KEYS: Record<string, string> = {
  '/': 'nav.dashboard',
  '/data-explorer': 'nav.dataExplorer',
  '/signals': 'nav.signals',
  '/signal-forms': 'nav.signalForms',
  '/reactive-forms': 'nav.reactiveForms',
  '/resources': 'nav.resourceApi',
  '/templates': 'nav.templates',
  '/router': 'nav.router',
  '/di': 'nav.di',
  '/aria': 'nav.aria',
  '/components-lab': 'nav.componentsLab',
  '/performance': 'nav.performance',
};

@Component({
  selector: 'app-navbar',
  imports: [TranslatePipe],
  template: `
    <header class="h-16 flex items-center px-4 gap-3 bg-surface-800/80 backdrop-blur-sm border-b border-neutral-800 shrink-0 z-[60] shadow-card">
      <!-- Mobile hamburger -->
      <button
        class="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
        (click)="layout.toggleMobileSidebar()"
        type="button"
        [attr.aria-label]="'navbar.openNav' | translate : ts.currentLanguage()"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <!-- Desktop: sidebar collapse toggle -->
      <button
        class="hidden lg:flex p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
        (click)="layout.toggleSidebar()"
        type="button"
        [attr.aria-label]="'navbar.toggleSidebar' | translate : ts.currentLanguage()"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm min-w-0" aria-label="Breadcrumb">
        <span class="text-neutral-500 hidden sm:inline">
          {{ 'navbar.appName' | translate : ts.currentLanguage() }}
        </span>
        <span class="text-neutral-700 hidden sm:inline" aria-hidden="true">/</span>
        <span class="text-neutral-100 font-medium truncate">{{ currentPageLabel() }}</span>
      </nav>

      <div class="flex-1"></div>

      <!-- Primary color picker -->
      <div class="relative flex items-center">
        <button
          (click)="toggleColorPicker()"
          class="p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          [title]="'theme.primary' | translate : ts.currentLanguage()"
          type="button"
        >
          <span class="block w-4 h-4 rounded-full border-2 border-white/20 transition-colors" [style.background]="appearance.primaryColor()"></span>
        </button>

        @if (colorPickerOpen()) {
          <!-- Backdrop -->
          <div class="fixed inset-0 z-40" (click)="colorPickerOpen.set(false)"></div>
          <!-- Popover -->
          <div class="color-picker-popover absolute right-0 top-full mt-2 z-50 rounded-xl border border-neutral-700 bg-surface-800 shadow-elevated p-3 min-w-44">
            <p class="text-[10px] uppercase tracking-wider text-neutral-500 mb-2 px-1">
              {{ 'theme.primary' | translate : ts.currentLanguage() }}
            </p>
            <div class="flex flex-wrap gap-2 justify-start">
              @for (preset of colorPresets; track preset.key) {
                <button
                  (click)="selectColor(preset)"
                  class="w-7 h-7 rounded-full border-2 transition-all hover:scale-110"
                  [style.background]="preset.value"
                  [class.border-white]="appearance.primaryColor() === preset.value"
                  [class.border-transparent]="appearance.primaryColor() !== preset.value"
                  [title]="preset.labelKey | translate : ts.currentLanguage()"
                  type="button"
                ></button>
              }
            </div>
          </div>
        }
      </div>

      <!-- Theme toggle -->
      <button
        (click)="appearance.toggleTheme()"
        class="p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
        [title]="'theme.toggle' | translate : ts.currentLanguage()"
        type="button"
        [attr.aria-label]="'theme.toggle' | translate : ts.currentLanguage()"
      >
        @if (appearance.theme() === 'dark') {
          <svg class="w-4 h-4 overflow-visible" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        } @else {
          <svg class="w-4 h-4 overflow-visible" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path d="M21.752 15.002A9.718 9.718 0 0118 15.75 9.75 9.75 0 018.25 6a9.718 9.718 0 01.75-3.752 9.753 9.753 0 00-10.375 9.256 9.75 9.75 0 0013.875 8.999 9.753 9.753 0 009.252-5.501z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        }
      </button>

      <!-- Language selector -->
      <div
        class="flex items-center rounded-lg border border-neutral-700 overflow-hidden"
        role="group"
        [attr.aria-label]="'navbar.selectLang' | translate : ts.currentLanguage()"
      >
        @for (lang of languages; track lang) {
          <button
            (click)="switchLang(lang)"
            type="button"
            class="px-2.5 py-1.5 text-xs font-semibold uppercase transition-colors leading-none"
            [class]="ts.currentLanguage() === lang
              ? 'bg-angular-red text-white'
              : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800'"
            [attr.aria-pressed]="ts.currentLanguage() === lang"
            [attr.aria-label]="('navbar.lang' + lang.charAt(0).toUpperCase() + lang.slice(1)) | translate : ts.currentLanguage()"
          >{{ lang.toUpperCase() }}</button>
        }
      </div>

      <!-- Angular version badge -->
      <div class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-angular-red/10 border border-angular-red/20">
        <div class="w-1.5 h-1.5 rounded-full bg-angular-red animate-pulse"></div>
        <span class="text-angular-red text-xs font-semibold">v22</span>
      </div>
    </header>
  `,
})
export class Navbar {
  protected readonly layout = inject(LayoutService);
  protected readonly ts = inject(TranslationService);
  protected readonly appearance = inject(AppearanceService);
  private readonly router = inject(Router);

  protected readonly languages: Language[] = LANGUAGES;
  protected readonly colorPresets = PRIMARY_COLOR_PRESETS;
  protected readonly colorPickerOpen = signal(false);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: '/' },
  );

  protected readonly currentPageLabel = computed(() => {
    const url = this.currentUrl() ?? '/';
    const base = url.split('?')[0];
    const key = ROUTE_LABEL_KEYS[base] ?? 'navbar.appName';
    return this.ts.translate(key);
  });

  protected switchLang(lang: Language): void {
    this.ts.setLanguage(lang).catch(console.error);
  }

  protected toggleColorPicker(): void {
    this.colorPickerOpen.update(v => !v);
  }

  protected selectColor(preset: PrimaryColorPreset): void {
    this.appearance.setPrimaryColor(preset);
    this.colorPickerOpen.set(false);
  }
}
