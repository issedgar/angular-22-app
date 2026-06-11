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
    <div class="max-w-3xl mx-auto space-y-6">

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
        <!-- Skeleton -->
          <div class="animate-pulse space-y-4">
          <div class="h-8 w-48 rounded-lg bg-surface-700"></div>
          <div class="flex gap-6">
            <div class="h-56 w-56 rounded-xl bg-surface-700"></div>
            <div class="flex-1 space-y-3 pt-2">
              <div class="h-5 w-32 rounded bg-surface-700"></div>
              <div class="h-4 w-24 rounded bg-surface-700"></div>
              <div class="h-4 w-40 rounded bg-surface-700"></div>
            </div>
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
            >
              {{ 'common.retry' | translate : ts.currentLanguage() }}
            </button>
            <a
              routerLink="/data-explorer"
              class="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-400 hover:text-neutral-100 transition-colors no-underline"
            >
              {{ 'common.back' | translate : ts.currentLanguage() }}
            </a>
          </div>
        </div>
      } @else if (pokemon.hasValue()) {
        <!-- Pokemon card -->
        <div class="overflow-hidden rounded-2xl border border-neutral-800 bg-surface-800 shadow-card">

          <!-- Header with gradient background -->
          <div
            class="relative flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8"
            [style.background]="headerGradient()"
          >
            <!-- Official artwork -->
            <div class="shrink-0">
              <img
                [src]="artworkUrl()"
                [alt]="svc.capitalize(pokemon.value()!.name)"
                class="h-56 w-56 object-contain drop-shadow-lg"
                loading="eager"
              />
            </div>

            <!-- Name, ID, types -->
            <div>
              <p class="font-mono text-sm text-white/50 mb-1">
                #{{ pokemon.value()!.id.toString().padStart(4, '0') }}
              </p>
              <h1 class="text-3xl font-bold text-white mb-3">
                {{ svc.capitalize(pokemon.value()!.name) }}
              </h1>
              <div class="flex flex-wrap gap-2 mb-4">
                @for (t of pokemon.value()!.types; track t.type.name) {
                  <span
                    class="rounded-full px-4 py-1 text-xs font-bold uppercase text-white/90 border border-white/20"
                    [style.background]="svc.typeColor(t.type.name)"
                  >{{ t.type.name }}</span>
                }
              </div>
              <!-- Physical info -->
              <div class="flex gap-6 text-sm text-white/60">
                <div>
                  <span class="text-white/40 text-xs uppercase tracking-wider">{{ 'pokemon.height' | translate : ts.currentLanguage() }}</span>
                  <p class="font-semibold text-white/80">{{ (pokemon.value()!.height / 10).toFixed(1) }} m</p>
                </div>
                <div>
                  <span class="text-white/40 text-xs uppercase tracking-wider">{{ 'pokemon.weight' | translate : ts.currentLanguage() }}</span>
                  <p class="font-semibold text-white/80">{{ (pokemon.value()!.weight / 10).toFixed(1) }} kg</p>
                </div>
                @if (pokemon.value()!.base_experience) {
                  <div>
                    <span class="text-white/40 text-xs uppercase tracking-wider">{{ 'pokemon.baseExp' | translate : ts.currentLanguage() }}</span>
                    <p class="font-semibold text-white/80">{{ pokemon.value()!.base_experience }}</p>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Base stats -->
          <div class="p-6 sm:p-8 border-t border-neutral-800">
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

        </div>
      }

    </div>
  `,
})
export class PokemonDetail {
  // withComponentInputBinding() maps ':name' route param to this input
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

  protected statBarColor(percent: number): string {
    if (percent >= 70) return '#78C850';  // green
    if (percent >= 40) return '#F8D030';  // yellow
    return '#F08030';                     // orange
  }
}
