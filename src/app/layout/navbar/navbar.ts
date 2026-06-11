import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

import { LayoutService } from '../../core/services/layout.service';
import { TranslationService } from '../../core/i18n/translation.service';
import { TranslatePipe } from '../../core/i18n/translation.pipe';
import { Language, LANGUAGES } from '../../core/i18n/language.model';

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
    <header class="h-16 flex items-center px-4 gap-4 bg-surface-800/80 backdrop-blur-sm border-b border-neutral-800 shrink-0 z-30">
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

      <!-- Spacer -->
      <div class="flex-1"></div>

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
          >
            {{ lang.toUpperCase() }}
          </button>
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
  private readonly router = inject(Router);

  protected readonly languages: Language[] = LANGUAGES;

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
}
