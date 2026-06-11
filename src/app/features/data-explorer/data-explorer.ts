import { Component, computed, debounced, inject, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { httpResource } from '@angular/common/http';

import { TranslationService } from '../../core/i18n/translation.service';
import { TranslatePipe } from '../../core/i18n/translation.pipe';
import { PokemonService } from '../../core/services/pokemon.service';
import { PokemonListResponse, Pokemon } from '../../core/models/pokemon.model';

const PAGE_SIZES = [10, 20, 25, 50] as const;
type PageSize = (typeof PAGE_SIZES)[number];

@Component({
  selector: 'app-data-explorer',
  imports: [RouterLink, TranslatePipe],
  template: `
    <div class="flex flex-col gap-4 h-full">

      <!-- Section header -->
      <div class="shrink-0">
        <h1 class="text-2xl font-bold text-neutral-100">
          {{ 'nav.dataExplorer' | translate : ts.currentLanguage() }}
        </h1>
        <p class="mt-1 text-sm text-neutral-500">
          {{ 'sections.dataExplorer.description' | translate : ts.currentLanguage() }}
        </p>
      </div>

      <!-- Toolbar -->
      <div class="shrink-0 flex flex-wrap items-center gap-3">
        <!-- Search — type="text" evita el botón X nativo del browser -->
        <div class="relative flex-1 min-w-56">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <input
            type="text"
            [value]="searchInput()"
            (input)="onSearchInput($any($event.target).value)"
            [placeholder]="'dataExplorer.searchPlaceholder' | translate : ts.currentLanguage()"
            class="w-full rounded-lg border border-neutral-700 bg-surface-800 py-2 pl-9 pr-9 text-sm text-neutral-100 placeholder-neutral-500 focus:border-angular-red/50 focus:outline-none focus:ring-1 focus:ring-angular-red/30 transition-colors"
            [attr.aria-label]="'common.search' | translate : ts.currentLanguage()"
            autocomplete="off"
          />
          @if (debouncedSearch.isLoading()) {
            <div class="absolute right-3 top-1/2 -translate-y-1/2">
              <svg class="h-4 w-4 animate-spin text-angular-red" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          } @else if (searchInput()) {
            <button
              (click)="clearSearch()"
              type="button"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-neutral-500 hover:text-neutral-200 transition-colors"
              [attr.aria-label]="'common.clearSearch' | translate : ts.currentLanguage()"
            >
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          }
        </div>

        <!-- Page size selector -->
        @if (!isSearchActive()) {
          <div class="flex items-center gap-2 shrink-0">
            <label class="text-xs text-neutral-500 hidden sm:inline whitespace-nowrap">
              {{ 'paginator.rowsPerPage' | translate : ts.currentLanguage() }}
            </label>
            <select
              [value]="pageSize()"
              (change)="setPageSize(+$any($event.target).value)"
              class="rounded-lg border border-neutral-700 bg-surface-800 py-2 pl-3 pr-7 text-sm text-neutral-300 focus:border-angular-red/50 focus:outline-none focus:ring-1 focus:ring-angular-red/30 transition-colors appearance-none"
            >
              @for (size of pageSizes; track size) {
                <option [value]="size">{{ size }}</option>
              }
            </select>
          </div>
        }

        <!-- Refresh -->
        @if (!isSearchActive()) {
          <button
            (click)="listResource.reload()"
            type="button"
            class="shrink-0 p-2 rounded-lg border border-neutral-700 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
            [attr.aria-label]="'common.retry' | translate : ts.currentLanguage()"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        }

        <!-- Total count -->
        @if (!isSearchActive() && totalCount() > 0) {
          <span class="text-xs text-neutral-500 shrink-0">
            {{ showingFrom() }}–{{ showingTo() }} / {{ totalCount() }}
          </span>
        }
      </div>

      <!-- Search hint -->
      @if (!isSearchActive()) {
        <p class="shrink-0 text-xs text-neutral-600">
          {{ 'dataExplorer.searchHelper' | translate : ts.currentLanguage() }}
        </p>
      }

      <!-- Main table panel -->
      <div class="flex flex-col rounded-xl border border-neutral-800 bg-surface-800 overflow-hidden shadow-card flex-1 min-h-[420px]">

        <!-- Search result panel -->
        @if (isSearchActive()) {
          <div class="overflow-auto flex-1">
            @if (searchResource.isLoading()) {
              <div class="flex items-center justify-center gap-3 py-16 text-neutral-500">
                <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <span class="text-sm">{{ 'common.loading' | translate : ts.currentLanguage() }}</span>
              </div>
            } @else if (searchResource.error()) {
              <div class="flex flex-col items-center justify-center gap-4 py-16">
                <svg class="h-10 w-10 text-neutral-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                  <path d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.166 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div class="text-center">
                  <p class="text-sm font-medium text-neutral-300">
                    {{ 'dataExplorer.noResultsFor' | translate : ts.currentLanguage() }}
                    <span class="font-mono text-angular-red">"{{ debouncedSearch.value() }}"</span>
                  </p>
                  <p class="text-xs text-neutral-600 mt-1">
                    {{ 'dataExplorer.searchHelper' | translate : ts.currentLanguage() }}
                  </p>
                </div>
                <button
                  (click)="clearSearch()"
                  type="button"
                  class="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
                >
                  {{ 'common.clearSearch' | translate : ts.currentLanguage() }}
                </button>
              </div>
            } @else if (searchResource.hasValue()) {
              <div class="flex flex-col sm:flex-row items-start gap-6 p-6">
                <div class="mx-auto sm:mx-0">
                  <div class="rounded-xl bg-surface-700 p-3 w-32 h-32 flex items-center justify-center">
                    <img
                      [src]="svc.artworkUrl(searchResource.value()!.id)"
                      [alt]="svc.capitalize(searchResource.value()!.name)"
                      class="w-24 h-24 object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div class="flex-1 min-w-0 space-y-4">
                  <div>
                    <div class="flex flex-wrap items-center gap-3">
                      <span class="font-mono text-xs text-neutral-500">
                        #{{ searchResource.value()!.id.toString().padStart(4, '0') }}
                      </span>
                      <h2 class="text-xl font-bold text-neutral-100">
                        {{ svc.capitalize(searchResource.value()!.name) }}
                      </h2>
                    </div>
                    <div class="flex flex-wrap gap-1.5 mt-2">
                      @for (t of searchResource.value()!.types; track t.type.name) {
                        <span
                          class="rounded-md px-2.5 py-0.5 text-xs font-bold uppercase text-white"
                          [style.background]="svc.typeColor(t.type.name)"
                        >{{ t.type.name }}</span>
                      }
                    </div>
                  </div>
                  <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    @for (stat of searchResource.value()!.stats; track stat.stat.name) {
                      <div class="rounded-lg bg-surface-700 px-2.5 py-2 text-center">
                        <p class="text-[10px] text-neutral-500 mb-0.5 uppercase tracking-wider">{{ svc.statLabel(stat.stat.name) }}</p>
                        <p class="text-base font-bold text-neutral-200">{{ stat.base_stat }}</p>
                        <div class="mt-1 h-1 rounded-full bg-surface-600">
                          <div
                            class="h-1 rounded-full bg-angular-red transition-all"
                            [style.width.%]="svc.statPercent(stat.base_stat, stat.stat.name)"
                          ></div>
                        </div>
                      </div>
                    }
                  </div>
                  <a
                    [routerLink]="['/data-explorer', searchResource.value()!.name]"
                    (click)="svc.setSelected(searchResource.value()!.name)"
                    class="inline-flex items-center gap-2 rounded-lg bg-angular-red px-4 py-2 text-sm font-semibold text-white hover:bg-angular-dark-red transition-colors no-underline"
                  >
                    {{ 'common.learnMore' | translate : ts.currentLanguage() }}
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            }
          </div>

        } @else {
          <!-- Pokemon list table -->
          <div class="flex flex-col flex-1 overflow-hidden">
            <!-- Sticky table header — desktop -->
            <div class="shrink-0 hidden lg:grid lg:grid-cols-[3.5rem_4.5rem_12rem_minmax(0,1fr)_6.5rem_6.5rem_3.5rem] items-center gap-3 border-b border-neutral-800 px-4 py-2.5 bg-surface-800">
              <span class="text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
                {{ 'dataExplorer.col.id' | translate : ts.currentLanguage() }}
              </span>
              <span class="text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
                {{ 'dataExplorer.col.image' | translate : ts.currentLanguage() }}
              </span>
              <span class="text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
                {{ 'dataExplorer.col.name' | translate : ts.currentLanguage() }}
              </span>
              <span class="text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
                {{ 'dataExplorer.col.types' | translate : ts.currentLanguage() }}
              </span>
              <span class="text-[10px] font-semibold uppercase tracking-wider text-neutral-600 text-right">
                {{ 'dataExplorer.col.height' | translate : ts.currentLanguage() }}
              </span>
              <span class="text-[10px] font-semibold uppercase tracking-wider text-neutral-600 text-right">
                {{ 'dataExplorer.col.weight' | translate : ts.currentLanguage() }}
              </span>
              <span class="text-[10px] font-semibold uppercase tracking-wider text-neutral-600 flex justify-center">
                {{ 'dataExplorer.col.action' | translate : ts.currentLanguage() }}
              </span>
            </div>

            <!-- Sticky table header — tablet -->
            <div class="shrink-0 hidden md:grid lg:hidden md:grid-cols-[3.5rem_4.5rem_1fr_auto] items-center gap-3 border-b border-neutral-800 px-4 py-2.5 bg-surface-800">
              <span class="text-[10px] font-semibold uppercase tracking-wider text-neutral-600">#</span>
              <span class="text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
                {{ 'dataExplorer.col.image' | translate : ts.currentLanguage() }}
              </span>
              <span class="text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
                {{ 'dataExplorer.col.name' | translate : ts.currentLanguage() }}
              </span>
              <span class="text-[10px] font-semibold uppercase tracking-wider text-neutral-600 flex justify-end pr-1">
                {{ 'dataExplorer.col.action' | translate : ts.currentLanguage() }}
              </span>
            </div>

            <!-- Scrollable body -->
            <div class="flex-1 overflow-y-auto">
              @if (listResource.isLoading()) {
                <div class="flex items-center justify-center gap-3 py-16 text-neutral-500">
                  <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span class="text-sm">{{ 'common.loading' | translate : ts.currentLanguage() }}</span>
                </div>
              } @else if (listResource.error()) {
                <div class="flex flex-col items-center justify-center gap-4 py-16">
                  <p class="text-sm text-neutral-400">{{ 'common.error' | translate : ts.currentLanguage() }}</p>
                  <button
                    (click)="listResource.reload()"
                    type="button"
                    class="rounded-lg bg-angular-red px-4 py-2 text-sm font-semibold text-white hover:bg-angular-dark-red transition-colors"
                  >
                    {{ 'common.retry' | translate : ts.currentLanguage() }}
                  </button>
                </div>
              } @else {
                @for (item of listResource.value()?.results ?? []; track item.name; let i = $index) {
                  @let detail = getDetail(item.name);
                  <!-- Fila: click solo selecciona; el botón detalle navega -->
                  <div
                    (click)="svc.setSelected(item.name)"
                    class="de-row group stagger-item cursor-pointer text-neutral-400 border-b border-neutral-800/50 last:border-0 focus:outline-none"
                    [class.de-row--selected]="svc.selectedName() === item.name"
                    [style.animation-delay.ms]="i * 30"
                  >
                    <!-- Desktop row (lg+) -->
                    <div class="hidden lg:grid lg:grid-cols-[3.5rem_4.5rem_12rem_minmax(0,1fr)_6.5rem_6.5rem_3.5rem] items-center gap-3 px-4 py-2.5">
                      <!-- ID + copy -->
                      <div class="flex items-center gap-1 min-w-0">
                        <span class="font-mono text-xs text-neutral-500 truncate">
                          #{{ svc.extractId(item.url).toString().padStart(4, '0') }}
                        </span>
                        <button
                          (click)="copy($event, svc.extractId(item.url).toString(), 'id-' + item.name)"
                          type="button"
                          class="shrink-0 opacity-0 group-hover:opacity-40 hover:!opacity-100 text-neutral-400 transition-opacity"
                          title="Copiar ID"
                        >
                          @if (copiedKey() === 'id-' + item.name) {
                            <svg class="h-3 w-3 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                              <path d="M4.5 12.75l6 6 9-13.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          } @else {
                            <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          }
                        </button>
                      </div>
                      <!-- Image -->
                      <div class="flex items-center justify-center h-12 w-12 rounded-lg bg-surface-700/50">
                        <img
                          [src]="svc.artworkUrl(svc.extractId(item.url))"
                          [alt]="svc.capitalize(item.name)"
                          class="h-10 w-10 object-contain transition-transform duration-200 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                      <!-- Name + copy -->
                      <div class="flex items-center gap-1 min-w-0">
                        <span class="text-sm font-semibold text-neutral-200 truncate">{{ svc.capitalize(item.name) }}</span>
                        <button
                          (click)="copy($event, svc.capitalize(item.name), 'name-' + item.name)"
                          type="button"
                          class="shrink-0 opacity-0 group-hover:opacity-40 hover:!opacity-100 text-neutral-400 transition-opacity"
                          title="Copiar nombre"
                        >
                          @if (copiedKey() === 'name-' + item.name) {
                            <svg class="h-3 w-3 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                              <path d="M4.5 12.75l6 6 9-13.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          } @else {
                            <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          }
                        </button>
                      </div>
                      <!-- Types -->
                      <div class="flex flex-wrap gap-1">
                        @if (detail) {
                          @for (t of detail.types; track t.type.name) {
                            <span
                              class="rounded px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                              [style.background]="svc.typeColor(t.type.name)"
                            >{{ t.type.name }}</span>
                          }
                        } @else {
                          <div class="h-5 w-16 rounded bg-surface-600 animate-pulse"></div>
                        }
                      </div>
                      <!-- Height -->
                      <span class="text-xs text-neutral-400 text-right tabular-nums pr-2">
                        @if (detail) {
                          {{ (detail.height / 10).toFixed(1) }} m
                        } @else {
                          <span class="inline-block h-3 w-10 rounded bg-surface-600 animate-pulse"></span>
                        }
                      </span>
                      <!-- Weight -->
                      <span class="text-xs text-neutral-400 text-right tabular-nums pr-2">
                        @if (detail) {
                          {{ (detail.weight / 10).toFixed(1) }} kg
                        } @else {
                          <span class="inline-block h-3 w-10 rounded bg-surface-600 animate-pulse"></span>
                        }
                      </span>
                      <!-- Detail button — navega al detalle -->
                      <div class="flex justify-center">
                        <a
                          [routerLink]="['/data-explorer', item.name]"
                          (click)="openDetail($event, item.name)"
                          class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-neutral-700 text-neutral-500 hover:border-angular-red/50 hover:text-angular-red hover:bg-angular-red/5 transition-colors no-underline"
                          [attr.aria-label]="'dataExplorer.col.action' | translate : ts.currentLanguage()"
                        >
                          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                            <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </a>
                      </div>
                    </div>

                    <!-- Tablet row (md only) -->
                    <div class="hidden md:grid lg:hidden md:grid-cols-[3.5rem_4.5rem_1fr_auto] items-center gap-3 px-4 py-2.5">
                      <span class="font-mono text-xs text-neutral-500">
                        #{{ svc.extractId(item.url).toString().padStart(4, '0') }}
                      </span>
                      <div class="flex items-center justify-center h-12 w-12 rounded-lg bg-surface-700/50">
                        <img
                          [src]="svc.artworkUrl(svc.extractId(item.url))"
                          [alt]="svc.capitalize(item.name)"
                          class="h-10 w-10 object-contain transition-transform duration-200 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-neutral-200 truncate">{{ svc.capitalize(item.name) }}</p>
                        @if (detail) {
                          <div class="flex flex-wrap gap-1 mt-0.5">
                            @for (t of detail.types; track t.type.name) {
                              <span
                                class="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-white"
                                [style.background]="svc.typeColor(t.type.name)"
                              >{{ t.type.name }}</span>
                            }
                          </div>
                        }
                      </div>
                      <div class="flex justify-end pr-1">
                        <a
                          [routerLink]="['/data-explorer', item.name]"
                          (click)="openDetail($event, item.name)"
                          class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-neutral-700 text-neutral-500 hover:border-angular-red/50 hover:text-angular-red transition-colors no-underline"
                          [attr.aria-label]="'dataExplorer.col.action' | translate : ts.currentLanguage()"
                        >
                          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                            <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </a>
                      </div>
                    </div>

                    <!-- Mobile card -->
                    <div class="flex md:hidden items-center gap-3 px-4 py-3">
                      <div class="h-14 w-14 shrink-0 rounded-lg bg-surface-700/50 flex items-center justify-center">
                        <img
                          [src]="svc.artworkUrl(svc.extractId(item.url))"
                          [alt]="svc.capitalize(item.name)"
                          class="h-12 w-12 object-contain transition-transform duration-200 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-neutral-200">{{ svc.capitalize(item.name) }}</p>
                        <p class="text-xs font-mono text-neutral-500">#{{ svc.extractId(item.url).toString().padStart(4, '0') }}</p>
                        @if (detail) {
                          <div class="flex flex-wrap gap-1 mt-1">
                            @for (t of detail.types; track t.type.name) {
                              <span
                                class="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-white"
                                [style.background]="svc.typeColor(t.type.name)"
                              >{{ t.type.name }}</span>
                            }
                          </div>
                        }
                      </div>
                      <a
                        [routerLink]="['/data-explorer', item.name]"
                        (click)="openDetail($event, item.name)"
                        class="shrink-0 p-2 rounded-lg border border-neutral-700 text-neutral-500 hover:text-angular-red hover:border-angular-red/40 transition-colors no-underline"
                        [attr.aria-label]="'dataExplorer.col.action' | translate : ts.currentLanguage()"
                      >
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                          <path d="M8.25 4.5l7.5 7.5-7.5 7.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                }
              }
            </div>

            <!-- Sticky paginator footer -->
            <div class="shrink-0 border-t border-neutral-800 bg-surface-800 px-4 py-3">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <p class="text-xs text-neutral-500 hidden sm:block">
                  {{ 'paginator.showing' | translate : ts.currentLanguage() }}
                  <span class="text-neutral-300 font-medium">{{ showingFrom() }}</span>
                  {{ 'paginator.to' | translate : ts.currentLanguage() }}
                  <span class="text-neutral-300 font-medium">{{ showingTo() }}</span>
                  {{ 'paginator.of' | translate : ts.currentLanguage() }}
                  <span class="text-neutral-300 font-medium">{{ totalCount() }}</span>
                </p>

                <div class="flex items-center gap-3 ml-auto">
                  <span class="text-xs text-neutral-400">
                    {{ 'paginator.page' | translate : ts.currentLanguage() }}
                    <span class="font-medium text-neutral-200 mx-1">{{ currentPage() }}</span>
                    {{ 'paginator.of' | translate : ts.currentLanguage() }}
                    <span class="font-medium text-neutral-200 ml-1">{{ totalPages() }}</span>
                  </span>
                  <div class="flex items-center gap-1">
                    <button
                      (click)="prevPage()"
                      [disabled]="currentPage() <= 1"
                      type="button"
                      class="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-neutral-700 enabled:hover:text-neutral-100"
                    >
                      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M15.75 19.5L8.25 12l7.5-7.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span class="hidden sm:inline">{{ 'paginator.prev' | translate : ts.currentLanguage() }}</span>
                    </button>
                    <button
                      (click)="nextPage()"
                      [disabled]="currentPage() >= totalPages()"
                      type="button"
                      class="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-neutral-700 enabled:hover:text-neutral-100"
                    >
                      <span class="hidden sm:inline">{{ 'paginator.next' | translate : ts.currentLanguage() }}</span>
                      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M8.25 4.5l7.5 7.5-7.5 7.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class DataExplorer {
  protected readonly ts  = inject(TranslationService);
  protected readonly svc = inject(PokemonService);

  protected readonly pageSizes = PAGE_SIZES;
  protected readonly searchInput = signal('');
  protected readonly debouncedSearch = debounced(this.searchInput, 400);
  protected readonly isSearchActive = computed(() => !!this.debouncedSearch.value()?.trim());

  protected readonly page     = signal(1);
  protected readonly pageSize = signal<PageSize>(20);
  protected readonly copiedKey = signal<string | null>(null);

  private readonly offset = computed(() => (this.page() - 1) * this.pageSize());

  protected readonly searchResource = httpResource<Pokemon>(() => {
    const term = this.debouncedSearch.value()?.trim();
    return term ? this.svc.detailUrl(term) : undefined;
  });

  protected readonly listResource = httpResource<PokemonListResponse>(
    () => this.svc.listUrl(this.pageSize(), this.offset()),
  );

  private readonly pageNames = computed(() => {
    const items = this.listResource.value()?.results;
    if (!items || items.length === 0) return '';
    return items.map(i => i.name).join(',');
  });

  protected readonly detailsResource = resource<Map<string, Pokemon>, string>({
    params: () => this.pageNames(),
    loader: async ({ params, abortSignal }) => {
      const key = params;
      if (!key) return new Map<string, Pokemon>();
      const items = this.listResource.value()?.results ?? [];
      const details = await Promise.all(
        items.map(item =>
          fetch(this.svc.detailUrl(item.name), { signal: abortSignal })
            .then(r => r.json() as Promise<Pokemon>)
        )
      );
      const map = new Map<string, Pokemon>();
      for (const p of details) {
        map.set(p.name, p);
      }
      return map;
    },
  });

  protected getDetail(name: string): Pokemon | undefined {
    return this.detailsResource.value()?.get(name);
  }

  protected readonly totalCount  = computed(() => this.listResource.value()?.count ?? 0);
  protected readonly totalPages  = computed(() => Math.max(1, Math.ceil(this.totalCount() / this.pageSize())));
  protected readonly currentPage = this.page.asReadonly();

  protected readonly showingFrom = computed(() =>
    this.totalCount() === 0 ? 0 : this.offset() + 1
  );
  protected readonly showingTo = computed(() =>
    Math.min(this.offset() + this.pageSize(), this.totalCount())
  );

  protected openDetail(e: MouseEvent, name: string): void {
    e.stopPropagation();
    this.svc.setSelected(name);
  }

  protected copy(e: MouseEvent, text: string, key: string): void {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      this.copiedKey.set(key);
      setTimeout(() => this.copiedKey.set(null), 1500);
    }).catch(() => {});
  }

  protected onSearchInput(value: string): void {
    this.searchInput.set(value);
    this.page.set(1);
  }

  protected clearSearch(): void {
    this.searchInput.set('');
    this.page.set(1);
  }

  protected prevPage(): void {
    if (this.page() > 1) this.page.update(p => p - 1);
  }

  protected nextPage(): void {
    if (this.page() < this.totalPages()) this.page.update(p => p + 1);
  }

  protected setPageSize(size: number): void {
    if (PAGE_SIZES.includes(size as PageSize)) {
      this.pageSize.set(size as PageSize);
      this.page.set(1);
    }
  }
}
