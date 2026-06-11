import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { LayoutService } from '../../core/services/layout.service';
import { TranslationService } from '../../core/i18n/translation.service';
import { TranslatePipe } from '../../core/i18n/translation.pipe';

interface NavItem {
  labelKey: string;
  route: string;
  badge: 'stable' | 'new' | 'experimental';
  icon: string;
  exact?: boolean;
}

interface NavGroup {
  titleKey: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    titleKey: '',
    items: [
      {
        labelKey: 'nav.dashboard',
        route: '/',
        badge: 'stable',
        exact: true,
        icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
      },
    ],
  },
  {
    titleKey: 'nav.groups.data',
    items: [
      {
        labelKey: 'nav.dataExplorer',
        route: '/data-explorer',
        badge: 'new',
        icon: 'M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125v-6.375A1.125 1.125 0 013.375 12h17.25c.621 0 1.125.504 1.125 1.125V18.375c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5M6 12v-2.25M18 12v-2.25M6 9.75v-3A1.125 1.125 0 017.125 5.625h9.75c.621 0 1.125.504 1.125 1.125v3',
      },
    ],
  },
  {
    titleKey: 'nav.groups.reactivity',
    items: [
      {
        labelKey: 'nav.signals',
        route: '/signals',
        badge: 'stable',
        icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
      },
      {
        labelKey: 'nav.resourceApi',
        route: '/resources',
        badge: 'new',
        icon: 'M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z',
      },
    ],
  },
  {
    titleKey: 'nav.groups.forms',
    items: [
      {
        labelKey: 'nav.signalForms',
        route: '/signal-forms',
        badge: 'new',
        icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
      },
      {
        labelKey: 'nav.reactiveForms',
        route: '/reactive-forms',
        badge: 'stable',
        icon: 'M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
      },
    ],
  },
  {
    titleKey: 'nav.groups.core',
    items: [
      {
        labelKey: 'nav.templates',
        route: '/templates',
        badge: 'stable',
        icon: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
      },
      {
        labelKey: 'nav.router',
        route: '/router',
        badge: 'stable',
        icon: 'M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z',
      },
      {
        labelKey: 'nav.di',
        route: '/di',
        badge: 'new',
        icon: 'M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z',
      },
    ],
  },
  {
    titleKey: 'nav.groups.uiA11y',
    items: [
      {
        labelKey: 'nav.aria',
        route: '/aria',
        badge: 'new',
        icon: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      },
      {
        labelKey: 'nav.componentsLab',
        route: '/components-lab',
        badge: 'stable',
        icon: 'M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z',
      },
      {
        labelKey: 'nav.performance',
        route: '/performance',
        badge: 'new',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      },
    ],
  },
];

const BADGE_CLASSES: Record<NavItem['badge'], string> = {
  stable: 'badge-stable bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  new: 'badge-new bg-blue-500/10 text-blue-400 border border-blue-500/20',
  experimental: 'badge-experimental bg-amber-500/10 text-amber-400 border border-amber-500/20',
};

const BADGE_KEY: Record<NavItem['badge'], string> = {
  stable: 'badge.stable',
  new: 'badge.new',
  experimental: 'badge.experimental',
};

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  template: `
    <aside [class]="sidebarClasses()" aria-label="Main navigation">
      <!-- Logo header -->
      <div class="flex items-center gap-3 px-4 h-16 border-b border-neutral-800 shrink-0">
        <div class="relative w-8 h-8 rounded-lg bg-angular-red flex items-center justify-center text-white font-bold text-sm shrink-0 select-none">
          <span class="relative z-10">A</span>
          <div class="absolute inset-0 rounded-lg ring-2 ring-angular-red/20 ring-offset-2 ring-offset-surface-800"></div>
        </div>
        @if (!layout.sidebarCollapsed()) {
          <div class="overflow-hidden min-w-0">
            <div class="text-neutral-100 font-semibold text-sm leading-tight truncate">
              {{ 'navbar.appName' | translate : ts.currentLanguage() }}
            </div>
            <div class="text-neutral-500 text-xs leading-tight">
              {{ 'navbar.showcase' | translate : ts.currentLanguage() }}
            </div>
          </div>
        }
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-3 space-y-1" aria-label="Sections">
        @for (group of navGroups; track $index) {
          @if (group.titleKey && !layout.sidebarCollapsed()) {
            <div class="px-4 pt-4 pb-1">
              <span class="text-neutral-500 text-xs font-semibold uppercase tracking-wider">
                {{ group.titleKey | translate : ts.currentLanguage() }}
              </span>
            </div>
          }
          @if (group.titleKey && layout.sidebarCollapsed()) {
            <div class="border-t border-neutral-800/60 mx-3 my-2"></div>
          }
          @for (item of group.items; track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="bg-angular-red/10 text-neutral-100 border-l-2 border-angular-red"
              [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
              class="flex items-start gap-3 mx-2 px-3 py-2.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-angular-red transition-colors duration-150 border-l-2 border-transparent no-underline cursor-pointer"
              [title]="layout.sidebarCollapsed() ? (item.labelKey | translate : ts.currentLanguage()) : ''"
              (click)="handleNavClick()"
            >
              <svg
                class="w-5 h-5 shrink-0 mt-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
              >
                <path [attr.d]="item.icon" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              @if (!layout.sidebarCollapsed()) {
                <span class="flex-1 min-w-0 flex flex-col gap-0.5">
                  <span class="text-sm font-medium leading-snug break-words">
                    {{ item.labelKey | translate : ts.currentLanguage() }}
                  </span>
                  <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded self-start {{ badgeClasses(item.badge) }}">
                    {{ badgeKey(item.badge) | translate : ts.currentLanguage() }}
                  </span>
                </span>
              }
            </a>
          }
        }
      </nav>

      <!-- Collapse toggle (desktop only) -->
      <div class="hidden lg:flex items-center justify-end px-3 py-3 border-t border-neutral-800 shrink-0">
        <button
          (click)="layout.toggleSidebar()"
          class="p-2 rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-angular-red transition-colors"
          [title]="layout.sidebarCollapsed()
            ? ('sidebar.expandSidebar' | translate : ts.currentLanguage())
            : ('sidebar.collapseSidebar' | translate : ts.currentLanguage())"
          type="button"
          [attr.aria-label]="layout.sidebarCollapsed()
            ? ('sidebar.expandSidebar' | translate : ts.currentLanguage())
            : ('sidebar.collapseSidebar' | translate : ts.currentLanguage())"
        >
          <svg class="w-4 h-4 transition-transform duration-200" [class.rotate-180]="layout.sidebarCollapsed()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </aside>
  `,
})
export class Sidebar {
  protected readonly layout = inject(LayoutService);
  protected readonly ts = inject(TranslationService);

  protected readonly navGroups = NAV_GROUPS;

  protected readonly sidebarClasses = computed(() => {
    const collapsed = this.layout.sidebarCollapsed();
    const mobileOpen = this.layout.mobileSidebarOpen();
    return [
      'app-sidebar flex flex-col bg-surface-800 border-r border-neutral-800 overflow-y-auto',
      'transition-all duration-200',
      'lg:relative lg:flex-shrink-0',
      collapsed ? 'lg:w-16' : 'lg:w-60',
      'max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-50 max-lg:w-60',
      mobileOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full',
    ].join(' ');
  });

  protected badgeClasses(badge: NavItem['badge']): string {
    return BADGE_CLASSES[badge];
  }

  protected badgeKey(badge: NavItem['badge']): string {
    return BADGE_KEY[badge];
  }

  protected handleNavClick(): void {
    this.layout.closeMobileSidebar();
  }
}
