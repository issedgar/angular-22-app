import { Component, computed, debounced, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { httpResource } from '@angular/common/http';

import { TranslationService } from '../../core/i18n/translation.service';
import { TranslatePipe } from '../../core/i18n/translation.pipe';
import { PokemonService } from '../../core/services/pokemon.service';
import { PokemonListResponse, Pokemon } from '../../core/models/pokemon.model';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-data-explorer',
  imports: [RouterLink, TranslatePipe],
  template: `
    <div class="max-w-5xl space-y-6">

      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-neutral-100">
          {{ 'nav.dataExplorer' | translate : ts.currentLanguage() }}
        </h1>
        <p class="mt-1 text-sm text-neutral-500">
          {{ 'sections.dataExplorer.description' | translate : ts.currentLanguage() }}
        </p>
      </div>

      <!-- Search row -->
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative flex-1 min-w-48">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <input
            type="text"
            [value]="searchInput()"
            (input)="searchInput.set($any($event.target).value)"
            [placeholder]="('common.search' | translate : ts.currentLanguage()) + '...'"
            class="w-full rounded-lg border border-neutral-700 bg-surface-800 py-2 pl-9 pr-9 text-sm text-neutral-100 placeholder-neutral-500 focus:border-angular-red/50 focus:outline-none focus:ring-1 focus:ring-angular-red/30 transition-colors"
            [attr.aria-label]="'common.search' | translate : ts.currentLanguage()"
          />
          @if (debouncedSearch.isLoading()) {
            <div class="absolute right-3 top-1/2 -translate-y-1/2">
              <svg class="h-4 w-4 animate-spin text-angular-red" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          }
        </div>
        @if (searchInput()) {
          <button
            (click)="clearSearch()"
            type="button"
            class="rounded-lg border border-neutral-700 bg-surface-800 px-3 py-2 text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
          >
            {{ 'common.close' | translate : ts.currentLanguage() }}
          </button>
        }
      </div>

      <!-- Search result panel -->
      @if (isSearchActive()) {
        <div class="rounded-xl border border-neutral-800 bg-surface-800">
          @if (searchResource.isLoading()) {
            <div class="flex items-center justify-center gap-3 py-10 text-neutral-500">
              <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span class="text-sm">{{ 'common.loading' | translate : ts.currentLanguage() }}</span>
            </div>
          } @else if (searchResource.error()) {
            <div class="px-6 py-10 text-center">
              <p class="text-sm text-neutral-400">
                {{ 'common.empty' | translate : ts.currentLanguage() }} —
                <span class="font-mono text-angular-red">"{{ debouncedSearch.value() }}"</span>
              </p>
            </div>
          } @else if (searchResource.hasValue()) {
            <div class="flex flex-wrap items-center gap-5 p-5">
              <img
                [src]="svc.spriteUrl(searchResource.value()!.id)"
                [alt]="svc.capitalize(searchResource.value()!.name)"
                class="h-20 w-20 shrink-0 object-contain"
                loading="lazy"
              />
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-3 mb-3">
                  <span class="font-mono text-xs text-neutral-500">
                    #{{ searchResource.value()!.id.toString().padStart(4, '0') }}
                  </span>
                  <h2 class="text-base font-semibold text-neutral-100">
                    {{ svc.capitalize(searchResource.value()!.name) }}
                  </h2>
                  <div class="flex gap-1">
                    @for (t of searchResource.value()!.types; track t.type.name) {
                      <span
                        class="rounded px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                        [style.background]="svc.typeColor(t.type.name)"
                      >{{ t.type.name }}</span>
                    }
                  </div>
                </div>
                <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  @for (stat of searchResource.value()!.stats; track stat.stat.name) {
                    <div>
                      <p class="text-[10px] text-neutral-500 mb-0.5">{{ svc.statLabel(stat.stat.name) }}</p>
                      <p class="text-sm font-bold text-neutral-200">{{ stat.base_stat }}</p>
                    </div>
                  }
                </div>
              </div>
              <a
                [routerLink]="['/data-explorer', searchResource.value()!.name]"
                class="shrink-0 rounded-lg bg-angular-red px-4 py-2 text-xs font-semibold text-white hover:bg-angular-dark-red transition-colors"
              >
                {{ 'common.learnMore' | translate : ts.currentLanguage() }} →
              </a>
            </div>
          }
        </div>
      }

      <!-- Pokémon list table -->
      @if (!isSearchActive()) {
        <div class="overflow-hidden rounded-xl border border-neutral-800 bg-surface-800">
          <div class="grid grid-cols-[3.5rem_3.5rem_1fr_1.5rem] items-center gap-4 border-b border-neutral-800 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-600">
            <span>#</span>
            <span></span>
            <span>Name</span>
            <span></span>
          </div>

          @if (listResource.isLoading()) {
            <div class="flex items-center justify-center gap-3 py-12 text-neutral-500">
              <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span class="text-sm">{{ 'common.loading' | translate : ts.currentLanguage() }}</span>
            </div>
          } @else if (listResource.error()) {
            <div class="px-6 py-12 text-center">
              <p class="mb-3 text-sm text-neutral-400">{{ 'common.error' | translate : ts.currentLanguage() }}</p>
              <button
                (click)="listResource.reload()"
                type="button"
                class="rounded-lg bg-angular-red px-4 py-2 text-sm font-semibold text-white hover:bg-angular-dark-red transition-colors"
              >
                {{ 'common.retry' | translate : ts.currentLanguage() }}
              </button>
            </div>
          } @else {
            @for (item of listResource.value()?.results ?? []; track item.name) {
              <a
                [routerLink]="['/data-explorer', item.name]"
                class="grid grid-cols-[3.5rem_3.5rem_1fr_1.5rem] items-center gap-4 border-b border-neutral-800/50 px-4 py-2.5 no-underline text-neutral-400 hover:bg-surface-700 hover:text-neutral-100 transition-colors last:border-0"
              >
                <span class="font-mono text-xs text-neutral-600">
                  {{ svc.extractId(item.url).toString().padStart(4, '0') }}
                </span>
                <img
                  [src]="svc.spriteUrl(svc.extractId(item.url))"
                  [alt]="svc.capitalize(item.name)"
                  class="h-10 w-10 object-contain"
                  loading="lazy"
                />
                <span class="text-sm font-medium">{{ svc.capitalize(item.name) }}</span>
                <svg class="h-4 w-4 text-neutral-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                  <path d="M8.25 4.5l7.5 7.5-7.5 7.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            }
          }
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between">
          <span class="text-sm text-neutral-500">
            {{ ts.currentLanguage() === 'es' ? 'Página' : 'Page' }}
            <span class="text-neutral-300 font-medium">{{ currentPage() }}</span>
            / {{ totalPages() }}
            <span class="text-neutral-600 text-xs ml-1">({{ totalCount() }} total)</span>
          </span>
          <div class="flex items-center gap-2">
            <button
              (click)="prevPage()"
              [disabled]="currentPage() <= 1"
              type="button"
              class="rounded-lg border border-neutral-700 px-4 py-1.5 text-sm text-neutral-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-neutral-800 enabled:hover:text-neutral-100"
            >← Prev</button>
            <button
              (click)="nextPage()"
              [disabled]="currentPage() >= totalPages()"
              type="button"
              class="rounded-lg border border-neutral-700 px-4 py-1.5 text-sm text-neutral-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-neutral-800 enabled:hover:text-neutral-100"
            >Next →</button>
          </div>
        </div>
      }

    </div>
  `,
})
export class DataExplorer {
  protected readonly ts = inject(TranslationService);
  protected readonly svc = inject(PokemonService);

  protected readonly searchInput = signal('');

  // debounced() is EXPERIMENTAL — wraps a signal with a delay before propagating changes
  protected readonly debouncedSearch = debounced(this.searchInput, 400);

  protected readonly isSearchActive = computed(() => !!this.debouncedSearch.value()?.trim());

  // httpResource fires only when URL is non-undefined; idle when search is empty
  protected readonly searchResource = httpResource<Pokemon>(() => {
    const term = this.debouncedSearch.value()?.trim();
    return term ? this.svc.detailUrl(term) : undefined;
  });

  protected readonly page = signal(1);
  private readonly offset = computed(() => (this.page() - 1) * PAGE_SIZE);

  protected readonly listResource = httpResource<PokemonListResponse>(
    () => this.svc.listUrl(PAGE_SIZE, this.offset()),
  );

  protected readonly totalCount = computed(() => this.listResource.value()?.count ?? 0);
  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalCount() / PAGE_SIZE)));
  protected readonly currentPage = this.page.asReadonly();

  protected prevPage(): void {
    if (this.page() > 1) this.page.update(p => p - 1);
  }

  protected nextPage(): void {
    if (this.page() < this.totalPages()) this.page.update(p => p + 1);
  }

  protected clearSearch(): void {
    this.searchInput.set('');
  }
}
