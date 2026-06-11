import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { httpResource } from '@angular/common/http';

import { TranslationService } from '../../../core/i18n/translation.service';
import { TranslatePipe } from '../../../core/i18n/translation.pipe';
import { PokemonService } from '../../../core/services/pokemon.service';
import { Pokemon } from '../../../core/models/pokemon.model';

@Component({
  selector: 'app-pokemon-detail',
  imports: [RouterLink, TranslatePipe],
  template: `
    <div class="max-w-5xl mx-auto space-y-6">

      <!-- Back link -->
      <a
        routerLink="/data-explorer"
        class="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-200 transition-colors no-underline"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ 'common.back' | translate : ts.currentLanguage() }}
      </a>

      @if (pokemon.isLoading()) {
        <div class="animate-pulse space-y-4">
          <div class="h-64 rounded-2xl bg-surface-700"></div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="h-52 rounded-2xl bg-surface-700"></div>
            <div class="h-52 rounded-2xl bg-surface-700"></div>
          </div>
        </div>
      } @else if (pokemon.error()) {
        <div class="rounded-xl border border-red-800/40 bg-red-900/10 px-6 py-10 text-center">
          <p class="mb-4 text-sm text-neutral-400">{{ 'common.error' | translate : ts.currentLanguage() }}</p>
          <div class="flex justify-center gap-3">
            <button
              (click)="pokemon.reload()"
              type="button"
              class="rounded-lg bg-angular-red px-4 py-2 text-sm font-semibold text-white hover:bg-angular-dark-red transition-colors"
            >{{ 'common.retry' | translate : ts.currentLanguage() }}</button>
            <a
              routerLink="/data-explorer"
              class="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-400 hover:text-neutral-100 transition-colors no-underline"
            >{{ 'common.back' | translate : ts.currentLanguage() }}</a>
          </div>
        </div>
      } @else if (pokemon.hasValue()) {

        <!-- Hero card -->
        <div class="overflow-hidden rounded-2xl border border-neutral-800 bg-surface-800">

          <!-- Gradient header -->
          <div
            class="relative flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8"
            [style.background]="headerGradient()"
          >
            <div class="shrink-0">
              <img
                [src]="artworkUrl()"
                [alt]="svc.capitalize(pokemon.value()!.name)"
                class="h-48 w-48 sm:h-56 sm:w-56 object-contain drop-shadow-2xl"
                loading="eager"
              />
            </div>

            <div class="flex-1 min-w-0">
              <p class="font-mono text-sm text-white/50 mb-1">
                #{{ pokemon.value()!.id.toString().padStart(4, '0') }}
              </p>
              <h1 class="text-3xl sm:text-4xl font-bold text-white mb-3">
                {{ svc.capitalize(pokemon.value()!.name) }}
              </h1>
              <div class="flex flex-wrap gap-2 mb-5">
                @for (t of pokemon.value()!.types; track t.type.name) {
                  <span
                    class="rounded-full px-4 py-1 text-xs font-bold uppercase text-white/90 border border-white/20"
                    [style.background]="svc.typeColor(t.type.name)"
                  >{{ t.type.name }}</span>
                }
              </div>
              <!-- Physical stats as cards -->
              <div class="grid grid-cols-3 gap-3">
                <div class="rounded-xl bg-black/20 backdrop-blur-sm px-3 py-2.5 text-center">
                  <p class="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">
                    {{ 'pokemon.height' | translate : ts.currentLanguage() }}
                  </p>
                  <p class="text-white font-bold text-base">{{ (pokemon.value()!.height / 10).toFixed(1) }} m</p>
                </div>
                <div class="rounded-xl bg-black/20 backdrop-blur-sm px-3 py-2.5 text-center">
                  <p class="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">
                    {{ 'pokemon.weight' | translate : ts.currentLanguage() }}
                  </p>
                  <p class="text-white font-bold text-base">{{ (pokemon.value()!.weight / 10).toFixed(1) }} kg</p>
                </div>
                @if (pokemon.value()!.base_experience) {
                  <div class="rounded-xl bg-black/20 backdrop-blur-sm px-3 py-2.5 text-center">
                    <p class="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">
                      {{ 'pokemon.baseExp' | translate : ts.currentLanguage() }}
                    </p>
                    <p class="text-white font-bold text-base">{{ pokemon.value()!.base_experience }}</p>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Body: 2-column on large screens -->
          <div class="p-6 sm:p-8 border-t border-neutral-800 grid grid-cols-1 lg:grid-cols-2 gap-8">

            <!-- Base Stats -->
            <div>
              <h2 class="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                {{ 'pokemon.baseStats' | translate : ts.currentLanguage() }}
              </h2>
              <div class="space-y-3">
                @for (stat of pokemon.value()!.stats; track stat.stat.name) {
                  <div class="grid grid-cols-[4rem_3rem_1fr] items-center gap-4">
                    <span class="text-xs font-semibold text-neutral-400 text-right">
                      {{ svc.statLabel(stat.stat.name) }}
                    </span>
                    <span class="text-sm font-bold text-neutral-200 text-right tabular-nums">
                      {{ stat.base_stat }}
                    </span>
                    <div class="h-2 overflow-hidden rounded-full bg-surface-600">
                      <div
                        class="h-full rounded-full transition-all duration-700"
                        [style.width]="svc.statPercent(stat.base_stat, stat.stat.name) + '%'"
                        [style.background]="statBarColor(svc.statPercent(stat.base_stat, stat.stat.name))"
                      ></div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Abilities + Moves -->
            <div class="space-y-6">

              <!-- Abilities -->
              <div>
                <h2 class="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {{ 'pokemon.abilities' | translate : ts.currentLanguage() }}
                </h2>
                <div class="space-y-2">
                  @for (a of pokemon.value()!.abilities; track a.slot) {
                    <div class="flex items-center justify-between rounded-lg border border-neutral-800 bg-surface-700/50 px-4 py-2.5">
                      <span class="text-sm font-medium text-neutral-200 capitalize">
                        {{ svc.capitalize(a.ability.name) }}
                      </span>
                      @if (a.is_hidden) {
                        <span class="rounded-full px-2 py-0.5 text-[10px] font-bold bg-violet-900/40 text-violet-300 border border-violet-800/40">
                          {{ 'pokemon.hiddenAbility' | translate : ts.currentLanguage() }}
                        </span>
                      }
                    </div>
                  }
                </div>
              </div>

              <!-- Moves (first 12) -->
              <div>
                <h2 class="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {{ 'pokemon.moves' | translate : ts.currentLanguage() }}
                  <span class="ml-1 font-normal text-neutral-600">({{ movesPreview().length }}/{{ totalMoves() }})</span>
                </h2>
                <div class="flex flex-wrap gap-1.5">
                  @for (m of movesPreview(); track m.move.name) {
                    <span class="rounded-md border border-neutral-700 bg-surface-700/30 px-2.5 py-1 text-xs text-neutral-400 capitalize">
                      {{ svc.capitalize(m.move.name) }}
                    </span>
                  }
                </div>
              </div>

            </div>
          </div>
        </div>
      }

    </div>
  `,
})
export class PokemonDetail {
  readonly name = input<string>('');

  protected readonly ts = inject(TranslationService);
  protected readonly svc = inject(PokemonService);

  protected readonly pokemon = httpResource<Pokemon>(() => {
    const n = this.name();
    return n ? this.svc.detailUrl(n) : undefined;
  });

  protected readonly artworkUrl = computed(() => {
    const p = this.pokemon.value();
    if (!p) return '';
    return p.sprites.other['official-artwork'].front_default
      ?? this.svc.spriteUrl(p.id);
  });

  protected readonly headerGradient = computed(() => {
    const types = this.pokemon.value()?.types ?? [];
    const primary = types[0]?.type.name ?? 'normal';
    const color = this.svc.typeColor(primary);
    return `linear-gradient(135deg, ${color}cc 0%, ${color}44 100%)`;
  });

  protected readonly movesPreview = computed(() =>
    this.pokemon.value()?.moves.slice(0, 12) ?? []
  );

  protected readonly totalMoves = computed(() =>
    this.pokemon.value()?.moves.length ?? 0
  );

  protected statBarColor(percent: number): string {
    if (percent >= 70) return '#78C850';
    if (percent >= 40) return '#F8D030';
    return '#F08030';
  }
}
