import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TranslationService } from '../../core/i18n/translation.service';
import { TranslatePipe } from '../../core/i18n/translation.pipe';

type BadgeType = 'stable' | 'new' | 'experimental';
type BadgeFilter = 'all' | BadgeType;

interface Feature {
  route: string;
  labelKey: string;
  descKey: string;
  badge: BadgeType;
  icon: string;
}

interface Stat {
  value: string;
  label: string;
  isKey: boolean;
  sparkline: string;
}

const FEATURES: Feature[] = [
  {
    route: '/data-explorer',
    labelKey: 'nav.dataExplorer',
    descKey: 'sections.dataExplorer.description',
    badge: 'new',
    icon: 'M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125v-6.375A1.125 1.125 0 013.375 12h17.25c.621 0 1.125.504 1.125 1.125V18.375c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5M6 12v-2.25M18 12v-2.25M6 9.75v-3A1.125 1.125 0 017.125 5.625h9.75c.621 0 1.125.504 1.125 1.125v3',
  },
  {
    route: '/signals',
    labelKey: 'nav.signals',
    descKey: 'sections.signals.description',
    badge: 'stable',
    icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
  },
  {
    route: '/resources',
    labelKey: 'nav.resourceApi',
    descKey: 'sections.resourceApi.description',
    badge: 'new',
    icon: 'M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z',
  },
  {
    route: '/signal-forms',
    labelKey: 'nav.signalForms',
    descKey: 'sections.signalForms.description',
    badge: 'new',
    icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
  },
  {
    route: '/reactive-forms',
    labelKey: 'nav.reactiveForms',
    descKey: 'sections.reactiveForms.description',
    badge: 'stable',
    icon: 'M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
  },
  {
    route: '/templates',
    labelKey: 'nav.templates',
    descKey: 'sections.templates.description',
    badge: 'stable',
    icon: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
  },
  {
    route: '/router',
    labelKey: 'nav.router',
    descKey: 'sections.router.description',
    badge: 'stable',
    icon: 'M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z',
  },
  {
    route: '/di',
    labelKey: 'nav.di',
    descKey: 'sections.di.description',
    badge: 'new',
    icon: 'M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z',
  },
  {
    route: '/aria',
    labelKey: 'nav.aria',
    descKey: 'sections.aria.description',
    badge: 'new',
    icon: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    route: '/components-lab',
    labelKey: 'nav.componentsLab',
    descKey: 'sections.componentsLab.description',
    badge: 'stable',
    icon: 'M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z',
  },
  {
    route: '/performance',
    labelKey: 'nav.performance',
    descKey: 'sections.performance.description',
    badge: 'new',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
];

const BADGE_CLASSES: Record<BadgeType, string> = {
  stable: 'badge-stable bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  new: 'badge-new bg-blue-500/10 text-blue-400 border border-blue-500/20',
  experimental: 'badge-experimental bg-amber-500/10 text-amber-400 border border-amber-500/20',
};

const FILTER_OPTIONS: BadgeFilter[] = ['all', 'stable', 'new', 'experimental'];

const STATS: Stat[] = [
  { value: '11', label: 'dashboard.sections', isKey: true, sparkline: 'M0 35 L12 28 L24 30 L36 22 L48 24 L60 16 L72 12 L80 8' },
  { value: 'v22', label: 'Angular', isKey: false, sparkline: 'M0 30 L12 25 L24 28 L36 20 L48 18 L60 15 L72 12 L80 8' },
  { value: 'TS 6', label: 'TypeScript', isKey: false, sparkline: 'M0 32 L12 26 L24 30 L36 24 L48 20 L60 16 L72 14 L80 10' },
  { value: 'TW 4', label: 'Tailwind', isKey: false, sparkline: 'M0 28 L12 32 L24 24 L36 28 L48 18 L60 14 L72 16 L80 9' },
];

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, TranslatePipe],
  template: `
    <div class="max-w-6xl mx-auto space-y-8">

      <!-- ── Hero ────────────────────────────────────────────── -->
      <section
        class="hero-gradient relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-surface-700 to-surface-900 p-8 lg:p-10 shadow-card"
        aria-labelledby="hero-title"
      >
        <!-- Background glows -->
        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
          <div class="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-angular-red/10 blur-3xl"></div>
          <div class="absolute -bottom-8 right-40 h-48 w-48 rounded-full bg-angular-red/5 blur-2xl"></div>
        </div>

        <!-- Angular shield watermark -->
        <div class="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 opacity-[0.04] lg:block" aria-hidden="true">
          <svg class="h-60 w-60 text-angular-red" viewBox="0 0 250 250" fill="currentColor">
            <polygon points="125,30 31.9,63.2 46.1,186.3 125,230 203.9,186.3 218.1,63.2"/>
            <path fill="white" d="M125,52.1L66.8,182.6h21.7l11.7-29.2h49.4l11.7,29.2h21.7L125,52.1z M142,135.4h-34l17-40.9L142,135.4z"/>
          </svg>
        </div>

        <div class="relative max-w-xl">
          <!-- Live badge -->
          <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-angular-red/20 bg-angular-red/10 px-3 py-1">
            <div class="h-1.5 w-1.5 animate-pulse rounded-full bg-angular-red"></div>
            <span class="text-xs font-semibold text-angular-red">Angular 22 Showcase</span>
          </div>

          <!-- Title -->
          <h1 id="hero-title" class="mb-3 text-4xl font-bold tracking-tight text-neutral-100 lg:text-5xl">
            {{ 'dashboard.title' | translate : ts.currentLanguage() }}
          </h1>

          <!-- Subtitle -->
          <p class="mb-7 text-base leading-relaxed text-neutral-400">
            {{ 'dashboard.subtitle' | translate : ts.currentLanguage() }}
          </p>

          <!-- CTA -->
          <a
            routerLink="/signals"
            class="inline-flex items-center gap-2 rounded-lg bg-angular-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-angular-dark-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-angular-red"
          >
            {{ 'dashboard.explore' | translate : ts.currentLanguage() }}
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      <!-- ── Stats row ─────────────────────────────────────── -->
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        @for (stat of stats; track stat.value) {
          <div class="relative overflow-hidden rounded-xl border border-neutral-800 bg-surface-800 px-5 py-4 shadow-card">
            <div class="relative z-10">
              <p class="text-2xl font-bold text-neutral-100">{{ stat.value }}</p>
              <p class="mt-0.5 text-sm text-neutral-500">
                @if (stat.isKey) {
                  {{ stat.label | translate : ts.currentLanguage() }}
                } @else {
                  {{ stat.label }}
                }
              </p>
            </div>
            <!-- Decorative sparkline -->
            <svg
              class="absolute bottom-0 right-0 h-10 w-20 text-angular-red/20"
              viewBox="0 0 80 40"
              fill="none"
              aria-hidden="true"
            >
              <path [attr.d]="stat.sparkline" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        }
      </div>

      <!-- ── Section header + filter ──────────────────────── -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h2 class="text-lg font-semibold text-neutral-200">
          {{ 'dashboard.sections' | translate : ts.currentLanguage() }}
          <span class="ml-2 text-sm font-normal text-neutral-500">({{ filteredFeatures().length }})</span>
        </h2>

        <div
          class="flex flex-wrap items-center gap-1.5"
          role="group"
          [attr.aria-label]="ts.currentLanguage() === 'es' ? 'Filtrar por tipo' : 'Filter by type'"
        >
          @for (f of filterOptions; track f) {
            <button
              (click)="activeFilter.set(f)"
              type="button"
              class="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
              [class]="activeFilter() === f
                ? 'bg-angular-red text-white'
                : 'bg-surface-700 text-neutral-500 hover:bg-surface-600 hover:text-neutral-300'"
              [attr.aria-pressed]="activeFilter() === f"
            >
              @if (f === 'all') {
                {{ ts.currentLanguage() === 'es' ? 'Todos' : 'All' }}
              } @else {
                {{ ('badge.' + f) | translate : ts.currentLanguage() }}
              }
              <span class="ml-1 opacity-50">({{ counts()[f] }})</span>
            </button>
          }
        </div>
      </div>

      <!-- ── Feature cards grid ────────────────────────────── -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (feature of filteredFeatures(); track feature.route; let i = $index) {
          <a
            [routerLink]="feature.route"
            class="stagger-item group flex flex-col gap-4 rounded-xl border border-neutral-800 bg-surface-800 p-5 no-underline transition-all duration-200 hover:border-neutral-700 hover:bg-surface-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-angular-red shadow-card"
            [style.animation-delay.ms]="i * 50"
          >
            <!-- Icon + badge -->
            <div class="flex items-start justify-between">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-600 text-neutral-400 transition-colors group-hover:bg-angular-red/10 group-hover:text-angular-red">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                  <path [attr.d]="feature.icon" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="rounded px-1.5 py-0.5 text-[10px] font-semibold {{ badgeClasses(feature.badge) }}">
                {{ ('badge.' + feature.badge) | translate : ts.currentLanguage() }}
              </span>
            </div>

            <!-- Title + description -->
            <div class="flex-1">
              <h3 class="mb-1.5 text-sm font-semibold text-neutral-200 transition-colors group-hover:text-white">
                {{ feature.labelKey | translate : ts.currentLanguage() }}
              </h3>
              <p class="text-xs leading-relaxed text-neutral-500">
                {{ feature.descKey | translate : ts.currentLanguage() }}
              </p>
            </div>

            <!-- Learn more arrow -->
            <div class="flex items-center gap-1 text-xs font-medium text-neutral-600 transition-colors group-hover:text-angular-red">
              {{ 'common.learnMore' | translate : ts.currentLanguage() }}
              <svg
                class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </a>
        }
      </div>

    </div>
  `,
})
export class Dashboard {
  protected readonly ts = inject(TranslationService);

  protected readonly activeFilter = signal<BadgeFilter>('all');
  protected readonly filterOptions = FILTER_OPTIONS;
  protected readonly stats = STATS;

  protected readonly filteredFeatures = computed(() => {
    const f = this.activeFilter();
    return f === 'all' ? FEATURES : FEATURES.filter(feat => feat.badge === f);
  });

  protected readonly counts = computed<Record<BadgeFilter, number>>(() => ({
    all: FEATURES.length,
    stable: FEATURES.filter(f => f.badge === 'stable').length,
    new: FEATURES.filter(f => f.badge === 'new').length,
    experimental: FEATURES.filter(f => f.badge === 'experimental').length,
  }));

  protected badgeClasses(badge: BadgeType): string {
    return BADGE_CLASSES[badge];
  }
}
