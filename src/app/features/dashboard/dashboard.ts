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
  descriptionKey: string;
  isKey: boolean;
  icon: string;
  iconClass: string;
  pattern: string;
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
  {
    value: '11',
    label: 'dashboard.sections',
    descriptionKey: 'dashboard.stack.sections',
    isKey: true,
    icon: 'M4.5 6.75A2.25 2.25 0 016.75 4.5h10.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25V6.75zm3 1.5h9m-9 3.75h9m-9 3.75h5.25',
    iconClass: 'text-angular-red',
    pattern: 'bg-[radial-gradient(circle_at_20%_20%,rgba(221,0,49,0.18),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent)]',
  },
  {
    value: 'v22',
    label: 'Angular',
    descriptionKey: 'dashboard.stack.angular',
    isKey: false,
    icon: 'M12 2.25L4.5 5.625l1.125 11.25L12 21.75l6.375-4.875L19.5 5.625 12 2.25zm0 4.5l3 9h-2l-.5-1.5h-3L9 15.75H7l3-9h2zm-.5 5.75L11 10.75l-.5 1.75h1z',
    iconClass: 'text-red-400',
    pattern: 'bg-[linear-gradient(135deg,rgba(221,0,49,0.2),transparent_55%),radial-gradient(circle_at_85%_15%,rgba(255,65,248,0.18),transparent_25%)]',
  },
  {
    value: 'TS 6',
    label: 'TypeScript',
    descriptionKey: 'dashboard.stack.typescript',
    isKey: false,
    icon: 'M4.5 5.25h15v13.5h-15V5.25zm3 3h5.25m-2.625 0v7.5m4.125-.375c.5.25 1.125.375 1.875.375 1.125 0 1.875-.5 1.875-1.375 0-.75-.5-1.125-1.625-1.5-1.125-.375-1.875-.875-1.875-1.875s.875-1.75 2.125-1.75c.625 0 1.125.125 1.5.25',
    iconClass: 'text-blue-400',
    pattern: 'bg-[linear-gradient(135deg,rgba(59,130,246,0.22),transparent_55%),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:auto,18px_18px]',
  },
  {
    value: 'TW 4',
    label: 'Tailwind',
    descriptionKey: 'dashboard.stack.tailwind',
    isKey: false,
    icon: 'M3.75 13.5c1.5-3 3.75-4.5 6.75-4.5 1.8 0 3.075.675 4.125 2.025.6.75 1.275 1.125 2.025 1.125 1.125 0 2.025-.675 2.7-2.025-1.5 3-3.75 4.5-6.75 4.5-1.8 0-3.075-.675-4.125-2.025-.6-.75-1.275-1.125-2.025-1.125-1.125 0-2.025.675-2.7 2.025zm0 4.5c1.5-3 3.75-4.5 6.75-4.5 1.8 0 3.075.675 4.125 2.025.6.75 1.275 1.125 2.025 1.125 1.125 0 2.025-.675 2.7-2.025-1.5 3-3.75 4.5-6.75 4.5-1.8 0-3.075-.675-4.125-2.025-.6-.75-1.275-1.125-2.025-1.125-1.125 0-2.025.675-2.7 2.025z',
    iconClass: 'text-cyan-400',
    pattern: 'bg-[radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.2),transparent_26%),linear-gradient(135deg,rgba(16,185,129,0.12),transparent_60%)]',
  },
];

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, TranslatePipe],
  template: `
    <div class="w-full space-y-8">

      <!-- ── Hero ────────────────────────────────────────────── -->
      <section
        class="hero-gradient relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-surface-700 to-surface-900 p-6 sm:p-8 lg:p-10 shadow-card"
        aria-labelledby="hero-title"
      >
        <!-- Background technical grid -->
        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
          <div class="absolute inset-y-0 right-0 hidden w-2/3 bg-[linear-gradient(90deg,transparent,rgba(221,0,49,0.08)),linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:auto,40px_40px,40px_40px] lg:block"></div>
        </div>

        <!-- Angular shield watermark — geometric pattern -->
        <div class="pointer-events-none absolute right-0 top-0 hidden h-full w-[58%] lg:block" aria-hidden="true">
          <svg class="showcase-watermark h-full w-full" viewBox="0 0 500 400" fill="none" preserveAspectRatio="xMaxYMid slice">
            <!-- Shield outline -->
            <polygon points="250,36 145,78 160,286 250,350 340,286 355,78" stroke="currentColor" stroke-width="2.8" fill="none"/>
            <!-- Inner A -->
            <path d="M250,76 L190,266h28l13-38h38l13,38h28L250,76z M266,202h-32l16-56L266,202z" fill="currentColor" opacity="0.74"/>
            <!-- Geometric lines radiating from shield -->
            <line x1="250" y1="36" x2="250" y2="0" stroke="currentColor" stroke-width="0.9"/>
            <line x1="355" y1="78" x2="500" y2="28" stroke="currentColor" stroke-width="0.9"/>
            <line x1="340" y1="286" x2="500" y2="350" stroke="currentColor" stroke-width="0.9"/>
            <line x1="145" y1="78" x2="0" y2="28" stroke="currentColor" stroke-width="0.9"/>
            <line x1="160" y1="286" x2="0" y2="350" stroke="currentColor" stroke-width="0.9"/>
            <!-- Horizontal grid lines -->
            <line x1="0" y1="100" x2="500" y2="100" stroke="currentColor" stroke-width="0.5" opacity="0.52"/>
            <line x1="0" y1="200" x2="500" y2="200" stroke="currentColor" stroke-width="0.5" opacity="0.52"/>
            <line x1="0" y1="300" x2="500" y2="300" stroke="currentColor" stroke-width="0.5" opacity="0.52"/>
            <!-- Corner accents -->
            <polyline points="458,20 482,20 482,44" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.74"/>
            <polyline points="20,20 44,20" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.5"/>
            <polyline points="20,380 44,380" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.5"/>
          </svg>
        </div>

        <div class="relative max-w-xl lg:max-w-2xl">
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
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        @for (stat of stats; track stat.value) {
          <div class="group relative min-h-36 overflow-hidden rounded-xl border border-neutral-800 bg-surface-800 p-5 shadow-card transition-colors duration-200 hover:border-neutral-700">
            <div class="absolute inset-0 opacity-80 {{ stat.pattern }}" aria-hidden="true"></div>
            <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" aria-hidden="true"></div>
            <div class="relative z-10 flex h-full flex-col justify-between gap-5">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-3xl font-bold tracking-tight text-neutral-100">{{ stat.value }}</p>
                  <p class="mt-1 text-sm font-semibold text-neutral-300">
                    @if (stat.isKey) {
                      {{ stat.label | translate : ts.currentLanguage() }}
                    } @else {
                      {{ stat.label }}
                    }
                  </p>
                </div>
                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-700/80 ring-1 ring-neutral-800 transition-transform duration-200 group-hover:-translate-y-0.5">
                  <svg class="h-5 w-5 {{ stat.iconClass }}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                    <path [attr.d]="stat.icon" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <p class="text-xs leading-relaxed text-neutral-500">
                {{ stat.descriptionKey | translate : ts.currentLanguage() }}
              </p>
            </div>
          </div>
        }
      </div>

      <!-- ── Section header + filter ──────────────────────── -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <!-- Shield accent fragment -->
          <svg class="h-5 w-5 text-angular-red/40 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <polygon points="12,2 4,6 5.5,18 12,22 18.5,18 20,6" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
          <h2 class="text-lg font-semibold text-neutral-200">
            {{ 'dashboard.sections' | translate : ts.currentLanguage() }}
            <span class="ml-2 text-sm font-normal text-neutral-500">({{ filteredFeatures().length }})</span>
          </h2>
        </div>

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
            class="stagger-item dot-bg group flex flex-col gap-4 rounded-xl border border-neutral-800 bg-surface-800 p-5 no-underline transition-all duration-200 hover:border-neutral-700 hover:bg-surface-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-angular-red shadow-card"
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
