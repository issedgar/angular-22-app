import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { httpResource } from '@angular/common/http';

import { TranslationService } from '../../../core/i18n/translation.service';
import { TranslatePipe } from '../../../core/i18n/translation.pipe';
import { PokemonService } from '../../../core/services/pokemon.service';
import {
  EvolutionChainLink,
  EvolutionChainResponse,
  Pokemon,
  PokemonSpecies,
  PokemonSpeciesSummary,
} from '../../../core/models/pokemon.model';

@Component({
  selector: 'app-pokemon-detail',
  imports: [RouterLink, TranslatePipe],
  template: `
    <div class="w-full space-y-6">

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

        <div class="overflow-hidden rounded-2xl border border-neutral-800 bg-surface-800 shadow-card">
          <div
            class="grid gap-6 p-6 sm:p-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-center"
            [style.background]="headerGradient()"
          >
            <div class="mx-auto flex h-56 w-56 items-center justify-center rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm lg:mx-0">
              <img
                [src]="artworkUrl()"
                [alt]="svc.capitalize(pokemon.value()!.name)"
                class="h-48 w-48 object-contain drop-shadow-2xl"
                loading="eager"
              />
            </div>

            <div class="min-w-0">
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p class="font-mono text-sm text-white/55">
                    #{{ pokemon.value()!.id.toString().padStart(4, '0') }}
                  </p>
                  <h1 class="mt-1 text-3xl font-bold text-white sm:text-4xl">
                    {{ svc.capitalize(pokemon.value()!.name) }}
                  </h1>
                  @if (genus()) {
                    <p class="mt-1 text-sm font-medium text-white/65">{{ genus() }}</p>
                  }
                </div>
                <div class="flex flex-wrap gap-2">
                  @for (t of pokemon.value()!.types; track t.type.name) {
                    <span
                      class="rounded-full border border-white/20 px-4 py-1 text-xs font-bold uppercase text-white/90"
                      [style.background]="svc.typeColor(t.type.name)"
                    >{{ t.type.name }}</span>
                  }
                </div>
              </div>
              @if (flavorText()) {
                <p class="mt-5 max-w-3xl text-sm leading-relaxed text-white/75">
                  {{ flavorText() }}
                </p>
              }
              <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div class="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 backdrop-blur-sm">
                  <p class="mb-0.5 text-[10px] uppercase tracking-wider text-white/50">
                    {{ 'pokemon.height' | translate : ts.currentLanguage() }}
                  </p>
                  <p class="text-base font-bold text-white">{{ (pokemon.value()!.height / 10).toFixed(1) }} m</p>
                </div>
                <div class="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 backdrop-blur-sm">
                  <p class="mb-0.5 text-[10px] uppercase tracking-wider text-white/50">
                    {{ 'pokemon.weight' | translate : ts.currentLanguage() }}
                  </p>
                  <p class="text-base font-bold text-white">{{ (pokemon.value()!.weight / 10).toFixed(1) }} kg</p>
                </div>
                <div class="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 backdrop-blur-sm">
                  <p class="mb-0.5 text-[10px] uppercase tracking-wider text-white/50">
                    {{ 'pokemon.baseExp' | translate : ts.currentLanguage() }}
                  </p>
                  <p class="text-base font-bold text-white">{{ pokemon.value()!.base_experience ?? '-' }}</p>
                </div>
                <div class="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 backdrop-blur-sm">
                  <p class="mb-0.5 text-[10px] uppercase tracking-wider text-white/50">
                    {{ 'pokemon.captureRate' | translate : ts.currentLanguage() }}
                  </p>
                  <p class="text-base font-bold text-white">{{ species.value()?.capture_rate ?? '-' }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 border-t border-neutral-800 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div class="space-y-6">
              <section class="rounded-xl border border-neutral-800 bg-surface-900/35 p-4">
                <h2 class="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {{ 'pokemon.baseStats' | translate : ts.currentLanguage() }}
                </h2>
                <div class="space-y-3">
                  @for (stat of pokemon.value()!.stats; track stat.stat.name) {
                    <div class="grid grid-cols-[4rem_3rem_1fr] items-center gap-4">
                      <span class="text-right text-xs font-semibold text-neutral-400">
                        {{ svc.statLabel(stat.stat.name) }}
                      </span>
                      <span class="text-right text-sm font-bold tabular-nums text-neutral-200">
                        {{ stat.base_stat }}
                      </span>
                      <div class="h-2 overflow-hidden rounded-full bg-surface-600">
                        <div
                          role="progressbar"
                          [attr.aria-valuenow]="stat.base_stat"
                          aria-valuemin="0"
                          [attr.aria-valuemax]="svc.statMax(stat.stat.name)"
                          [attr.aria-label]="svc.statLabel(stat.stat.name) + ': ' + stat.base_stat"
                          class="h-full rounded-full transition-all duration-700"
                          [style.width]="svc.statPercent(stat.base_stat, stat.stat.name) + '%'"
                          [style.background]="statBarColor(svc.statPercent(stat.base_stat, stat.stat.name))"
                        ></div>
                      </div>
                    </div>
                  }
                </div>
              </section>

              <section class="rounded-xl border border-neutral-800 bg-surface-900/35 p-4">
                <h2 class="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {{ 'pokemon.abilities' | translate : ts.currentLanguage() }}
                </h2>
                <div class="grid gap-2 sm:grid-cols-2">
                  @for (a of pokemon.value()!.abilities; track a.slot) {
                    <div class="flex items-center justify-between rounded-lg border border-neutral-800 bg-surface-700/50 px-4 py-2.5">
                      <span class="text-sm font-medium capitalize text-neutral-200">
                        {{ svc.capitalize(a.ability.name) }}
                      </span>
                      @if (a.is_hidden) {
                        <span class="rounded-full border border-violet-800/40 bg-violet-900/40 px-2 py-0.5 text-[10px] font-bold text-violet-300">
                          {{ 'pokemon.hiddenAbility' | translate : ts.currentLanguage() }}
                        </span>
                      }
                    </div>
                  }
                </div>
              </section>

              <section class="rounded-xl border border-neutral-800 bg-surface-900/35 p-4">
                <h2 class="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {{ 'pokemon.moves' | translate : ts.currentLanguage() }}
                  <span class="ml-1 font-normal text-neutral-600">({{ movesPreview().length }}/{{ totalMoves() }})</span>
                </h2>
                <div class="flex flex-wrap gap-1.5">
                  @for (m of movesPreview(); track m.move.name) {
                    <span class="rounded-md border border-neutral-700 bg-surface-700/30 px-2.5 py-1 text-xs capitalize text-neutral-400">
                      {{ svc.capitalize(m.move.name) }}
                    </span>
                  }
                </div>
              </section>
            </div>

            <aside class="space-y-6">
              <section class="rounded-xl border border-neutral-800 bg-surface-900/35 p-4">
                <h2 class="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {{ 'pokemon.biology' | translate : ts.currentLanguage() }}
                </h2>
                <div class="grid grid-cols-2 gap-3">
                  <div class="rounded-lg border border-neutral-800 bg-surface-700/40 px-3 py-2.5">
                    <p class="text-[10px] uppercase tracking-wider text-neutral-500">{{ 'pokemon.generation' | translate : ts.currentLanguage() }}</p>
                    <p class="mt-1 text-sm font-semibold text-neutral-200">{{ generation() }}</p>
                  </div>
                  <div class="rounded-lg border border-neutral-800 bg-surface-700/40 px-3 py-2.5">
                    <p class="text-[10px] uppercase tracking-wider text-neutral-500">{{ 'pokemon.habitat' | translate : ts.currentLanguage() }}</p>
                    <p class="mt-1 text-sm font-semibold text-neutral-200">{{ habitat() }}</p>
                  </div>
                  <div class="rounded-lg border border-neutral-800 bg-surface-700/40 px-3 py-2.5">
                    <p class="text-[10px] uppercase tracking-wider text-neutral-500">{{ 'pokemon.baseHappiness' | translate : ts.currentLanguage() }}</p>
                    <p class="mt-1 text-sm font-semibold text-neutral-200">{{ species.value()?.base_happiness ?? '-' }}</p>
                  </div>
                  <div class="rounded-lg border border-neutral-800 bg-surface-700/40 px-3 py-2.5">
                    <p class="text-[10px] uppercase tracking-wider text-neutral-500">{{ 'pokemon.varieties' | translate : ts.currentLanguage() }}</p>
                    <p class="mt-1 text-sm font-semibold text-neutral-200">{{ varietiesCount() }}</p>
                  </div>
                </div>
                @if (eggGroups().length > 0) {
                  <div class="mt-3">
                    <p class="mb-2 text-[10px] uppercase tracking-wider text-neutral-500">{{ 'pokemon.eggGroups' | translate : ts.currentLanguage() }}</p>
                    <div class="flex flex-wrap gap-1.5">
                      @for (group of eggGroups(); track group) {
                        <span class="rounded-md border border-neutral-700 bg-surface-700/40 px-2.5 py-1 text-xs text-neutral-300">
                          {{ group }}
                        </span>
                      }
                    </div>
                  </div>
                }
              </section>

              <section class="rounded-xl border border-neutral-800 bg-surface-900/35 p-4">
                <h2 class="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {{ 'pokemon.evolution' | translate : ts.currentLanguage() }}
                </h2>
                <div class="space-y-2">
                  @for (node of evolutionNodes(); track node.name) {
                    <a
                      [routerLink]="['/data-explorer', node.name]"
                      class="flex items-center gap-3 rounded-lg border border-neutral-800 bg-surface-700/40 px-3 py-2 no-underline transition-colors hover:border-angular-red/40 hover:bg-angular-red/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-angular-red"
                    >
                      <img
                        [src]="svc.artworkUrl(svc.extractResourceId(node.url))"
                        [alt]="svc.capitalize(node.name)"
                        class="h-9 w-9 object-contain"
                        loading="lazy"
                      />
                      <span class="text-sm font-semibold text-neutral-200">{{ svc.capitalize(node.name) }}</span>
                    </a>
                  } @empty {
                    <p class="text-sm text-neutral-500">{{ 'common.loading' | translate : ts.currentLanguage() }}</p>
                  }
                </div>
              </section>
            </aside>
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

  protected readonly species = httpResource<PokemonSpecies>(() => {
    const n = this.name();
    return n ? this.svc.speciesUrl(n) : undefined;
  });

  protected readonly evolutionChain = httpResource<EvolutionChainResponse>(() => {
    const url = this.species.value()?.evolution_chain.url;
    return url ? this.svc.evolutionChainUrl(url) : undefined;
  });

  protected readonly flavorText = computed(() => {
    const entries = this.species.value()?.flavor_text_entries;
    if (!entries) return '';
    const lang = this.ts.currentLanguage() === 'es' ? 'es' : 'en';
    const entry = entries.find(e => e.language.name === lang) ?? entries.find(e => e.language.name === 'en');
    return entry?.flavor_text.replace(/[\n\f]/g, ' ') ?? '';
  });

  protected readonly genus = computed(() => {
    const genera = this.species.value()?.genera;
    if (!genera) return '';
    const lang = this.ts.currentLanguage() === 'es' ? 'es' : 'en';
    return genera.find(g => g.language.name === lang)?.name
      ?? genera.find(g => g.language.name === 'en')?.name
      ?? '';
  });

  protected readonly generation = computed(() => {
    const generation = this.species.value()?.generation.name;
    return generation ? this.svc.capitalize(generation) : '-';
  });

  protected readonly habitat = computed(() => {
    const habitat = this.species.value()?.habitat?.name;
    return habitat ? this.svc.capitalize(habitat) : '-';
  });

  protected readonly eggGroups = computed(() =>
    this.species.value()?.egg_groups.map(group => this.svc.capitalize(group.name)) ?? []
  );

  protected readonly varietiesCount = computed(() =>
    this.species.value()?.varieties.length ?? '-'
  );

  protected readonly evolutionNodes = computed(() => {
    const chain = this.evolutionChain.value()?.chain;
    return chain ? this.flattenEvolutionChain(chain) : [];
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

  private flattenEvolutionChain(chain: EvolutionChainLink): PokemonSpeciesSummary[] {
    return [
      chain.species,
      ...chain.evolves_to.flatMap(node => this.flattenEvolutionChain(node)),
    ];
  }

  protected statBarColor(percent: number): string {
    if (percent >= 70) return 'var(--stat-high)';
    if (percent >= 40) return 'var(--stat-mid)';
    return 'var(--stat-low)';
  }
}
