import { Component, computed, signal } from '@angular/core';

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

interface Item {
  id: number;
  name: string;
  category: string;
}

const ITEMS: Item[] = [
  { id: 1, name: 'Angular', category: 'framework' },
  { id: 2, name: 'React', category: 'library' },
  { id: 3, name: 'Vue', category: 'framework' },
  { id: 4, name: 'Svelte', category: 'compiler' },
  { id: 5, name: 'Solid', category: 'library' },
];

@Component({
  selector: 'app-templates',
  template: `
    <div class="w-full space-y-8">

      <!-- Header -->
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h1 class="text-2xl font-bold text-neutral-100">Template Syntax</h1>
          <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-angular-red/15 text-angular-red border border-angular-red/25">Stable</span>
        </div>
        <p class="text-neutral-400 text-sm">
          Native control flow, <code class="text-angular-red">&#64;defer</code>,
          <code class="text-angular-red">&#64;let</code>, structural directives, content projection
        </p>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- @if / @else if / @else -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-neutral-200">
              <code class="text-angular-red">&#64;if</code> /
              <code class="text-angular-red">&#64;else if</code> /
              <code class="text-angular-red">&#64;else</code>
            </h2>
            <span class="text-[10px] font-mono text-neutral-600">native control flow</span>
          </div>
          <div class="p-5 space-y-4">
            <!-- Demo -->
            <div class="space-y-2">
              <label class="text-xs text-neutral-500">Score:</label>
              <input
                type="range"
                min="0"
                max="100"
                [value]="score()"
                (input)="score.set(+$any($event.target).value)"
                class="w-full accent-angular-red"
              />
              <p class="text-xs text-neutral-500">value: <strong class="text-neutral-200">{{ score() }}</strong></p>
              <div class="rounded-lg px-4 py-2.5 text-sm font-semibold text-center"
                [class]="scoreBadgeClass()"
              >
                @if (score() >= 90) {
                  Excellent — {{ score() }}
                } @else if (score() >= 70) {
                  Good — {{ score() }}
                } @else if (score() >= 50) {
                  Average — {{ score() }}
                } @else {
                  Needs work — {{ score() }}
                }
              </div>
            </div>
            <!-- Code -->
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.if }}</pre>
          </div>
        </div>

        <!-- @for with track -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-neutral-200">
              <code class="text-angular-red">&#64;for</code> with <code class="text-angular-red">track</code> + <code class="text-angular-red">&#64;empty</code>
            </h2>
          </div>
          <div class="p-5 space-y-4">
            <!-- Controls -->
            <div class="flex gap-2">
              <button
                (click)="toggleAll()"
                class="rounded border border-neutral-700 px-3 py-1 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
              >{{ filtered().length === 0 ? 'Show All' : 'Hide All' }}</button>
              <button
                (click)="filterCat.set(filterCat() === 'framework' ? '' : 'framework')"
                class="rounded px-3 py-1 text-xs transition-colors"
                [class.bg-angular-red]="filterCat() === 'framework'"
                [class.text-white]="filterCat() === 'framework'"
                [class.border]="filterCat() !== 'framework'"
                [class.border-neutral-700]="filterCat() !== 'framework'"
                [class.text-neutral-400]="filterCat() !== 'framework'"
              >frameworks only</button>
            </div>
            <!-- List -->
            <div class="space-y-1.5">
              @for (item of filtered(); track item.id; let i = $index; let last = $last) {
                <div class="rounded-lg border border-neutral-800 bg-surface-800 px-3 py-2 flex items-center gap-3">
                  <span class="w-5 text-xs font-mono text-neutral-600">{{ i + 1 }}</span>
                  <span class="text-sm text-neutral-200 flex-1">{{ item.name }}</span>
                  <span class="text-[10px] font-mono text-neutral-500 rounded border border-neutral-700 px-1.5 py-0.5">{{ item.category }}</span>
                  @if (last) {
                    <span class="text-[10px] text-amber-400">$last</span>
                  }
                </div>
              } @empty {
                <div class="rounded-lg border border-dashed border-neutral-700 px-4 py-6 text-center text-xs text-neutral-600">
                  &#64;empty — no items match
                </div>
              }
            </div>
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.for }}</pre>
          </div>
        </div>

        <!-- @switch -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">
              <code class="text-angular-red">&#64;switch</code> / <code class="text-angular-red">&#64;case</code> / <code class="text-angular-red">&#64;default</code>
            </h2>
          </div>
          <div class="p-5 space-y-4">
            <div class="flex flex-wrap gap-2">
              @for (s of seasons; track s) {
                <button
                  (click)="season.set(s)"
                  class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors capitalize"
                  [class.ring-2]="season() === s"
                  [class.ring-angular-red]="season() === s"
                  [class.bg-surface-800]="season() !== s"
                  [class.text-neutral-400]="season() !== s"
                  [class.bg-angular-red]="season() === s"
                  [class.text-white]="season() === s"
                >{{ s }}</button>
              }
            </div>

            @switch (season()) {
              @case ('spring') {
                <div class="rounded-xl bg-green-900/10 border border-green-800/30 p-4 text-sm text-green-300">
                  🌸 Spring — new growth, renewal, components bootstrapping
                </div>
              }
              @case ('summer') {
                <div class="rounded-xl bg-yellow-900/10 border border-yellow-800/30 p-4 text-sm text-yellow-300">
                  ☀️ Summer — peak performance, change detection in full swing
                </div>
              }
              @case ('autumn') {
                <div class="rounded-xl bg-orange-900/10 border border-orange-800/30 p-4 text-sm text-orange-300">
                  🍂 Autumn — lifecycle hooks running, cleanup time
                </div>
              }
              @default {
                <div class="rounded-xl bg-blue-900/10 border border-blue-800/30 p-4 text-sm text-blue-300">
                  ❄️ Winter — idle state, waiting for next render cycle
                </div>
              }
            }
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.switch }}</pre>
          </div>
        </div>

        <!-- @let -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">
              <code class="text-angular-red">&#64;let</code>
              <span class="ml-2 text-xs font-normal text-neutral-500">— template local variables</span>
            </h2>
          </div>
          <div class="p-5 space-y-4">
            <p class="text-xs text-neutral-500">
              <code class="text-angular-red">&#64;let</code> declares block-scoped template variables.
              Useful for aliasing expensive computations or piped values.
            </p>
            <!-- Demo: compute inside template -->
            @let doubled = score() * 2;
            @let label = score() >= 50 ? 'Pass' : 'Fail';
            @let color = score() >= 50 ? '#22c55e' : '#ef4444';
            <div class="rounded-lg border border-neutral-800 bg-surface-800 p-4 space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-neutral-500">score</span>
                <span class="text-neutral-200 font-mono">{{ score() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-500">doubled <code class="text-[10px] text-angular-red">(&#64;let doubled)</code></span>
                <span class="text-neutral-200 font-mono">{{ doubled }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-500">label <code class="text-[10px] text-angular-red">(&#64;let label)</code></span>
                <span class="font-semibold" [style.color]="color">{{ label }}</span>
              </div>
            </div>
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.let }}</pre>
          </div>
        </div>

        <!-- @defer -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden lg:col-span-2">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">
              <code class="text-angular-red">&#64;defer</code>
              <span class="ml-2 text-xs font-normal text-neutral-500">— lazy loading blocks with triggers</span>
            </h2>
          </div>
          <div class="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Demo -->
            <div class="space-y-4">
              <p class="text-xs text-neutral-500">
                <code class="text-angular-red">&#64;defer</code> lazily loads a block of template on a trigger condition.
                Reduces initial bundle size.
              </p>
              <div class="space-y-2">
                <button
                  (click)="showDeferred.set(!showDeferred())"
                  class="rounded-lg bg-angular-red px-4 py-2 text-sm font-medium text-white hover:bg-angular-dark-red transition-colors"
                >
                  {{ showDeferred() ? 'Hide' : 'Load' }} deferred block
                </button>
              </div>

              @defer (when showDeferred()) {
                <div class="rounded-xl border border-angular-red/20 bg-angular-red/5 p-4 text-sm text-angular-red/90 space-y-1">
                  <p class="font-semibold">Deferred block loaded!</p>
                  <p class="text-xs text-neutral-400">This block was lazily rendered when the trigger fired.</p>
                  <p class="text-xs font-mono text-neutral-500 mt-2">timestamp: {{ loadTime() }}</p>
                </div>
              } @placeholder {
                <div class="rounded-xl border border-dashed border-neutral-700 p-4 text-xs text-neutral-600 text-center">
                  &#64;placeholder — shown before defer triggers
                </div>
              } @loading (minimum 300ms) {
                <div class="rounded-xl border border-neutral-800 p-4 text-xs text-neutral-500 flex items-center gap-2">
                  <svg class="h-4 w-4 animate-spin text-angular-red" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="31.4" stroke-dashoffset="10"/>
                  </svg>
                  &#64;loading — shown while loading
                </div>
              } @error {
                <div class="rounded-xl border border-red-800/30 p-4 text-xs text-red-400">
                  &#64;error — shown if loading fails
                </div>
              }
            </div>

            <!-- Code -->
            <pre class="rounded-lg bg-surface-800 p-4 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto self-start">{{ snippets.defer }}</pre>
          </div>
        </div>

      </div>
    </div>
  `,
})
export class Templates {
  protected readonly score = signal(72);
  protected readonly filterCat = signal('');
  protected readonly showItems = signal(true);
  protected readonly season = signal<Season>('spring');
  protected readonly seasons: Season[] = ['spring', 'summer', 'autumn', 'winter'];
  protected readonly showDeferred = signal(false);
  protected readonly loadTime = signal('');

  protected readonly filtered = computed(() => {
    if (!this.showItems()) return [];
    const cat = this.filterCat();
    return cat ? ITEMS.filter(i => i.category === cat) : ITEMS;
  });

  protected toggleAll(): void {
    if (this.filtered().length === 0) {
      this.showItems.set(true);
      this.filterCat.set('');
    } else {
      this.showItems.set(false);
    }
  }

  protected readonly scoreBadgeClass = computed(() => {
    const s = this.score();
    if (s >= 90) return 'bg-green-900/20 border border-green-800/30 text-green-300';
    if (s >= 70) return 'bg-blue-900/20 border border-blue-800/30 text-blue-300';
    if (s >= 50) return 'bg-amber-900/20 border border-amber-800/30 text-amber-300';
    return 'bg-red-900/20 border border-red-800/30 text-red-300';
  });

  protected readonly snippets = {
    if: `@if (score >= 90) {
  <span>Excellent</span>
} @else if (score >= 70) {
  <span>Good</span>
} @else if (score >= 50) {
  <span>Average</span>
} @else {
  <span>Needs work</span>
}`,

    for: `@for (item of items(); track item.id;
      let i = $index; let last = $last) {
  <div>{{ i + 1 }}. {{ item.name }}</div>
  @if (last) { <hr /> }
} @empty {
  <p>No items found.</p>
}

// $index, $first, $last, $even, $odd, $count`,

    switch: `@switch (season()) {
  @case ('spring') {
    <div>Spring content</div>
  }
  @case ('summer') {
    <div>Summer content</div>
  }
  @default {
    <div>Default content</div>
  }
}`,

    let: `@let doubled = score() * 2;
@let label = score() >= 50 ? 'Pass' : 'Fail';
@let color = label === 'Pass' ? 'green' : 'red';

<p [style.color]="color">{{ label }}: {{ doubled }}</p>

// @let is block-scoped
// Useful to alias signal calls or pipe results`,

    defer: `@defer (when condition()) {
  <heavy-component />
} @placeholder {
  <div>Placeholder shown first</div>
} @loading (minimum 300ms) {
  <spinner />
} @error {
  <error-state />
}

// Other triggers:
// on idle          — when browser is idle
// on viewport      — when enters viewport
// on interaction   — on click / focus
// on hover         — on mouse hover
// on timer(2s)     — after 2 seconds
// when expr()      — reactive signal`,
  };
}
