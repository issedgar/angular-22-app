import { Component, signal } from '@angular/core';
import {
  AccordionContent,
  AccordionGroup,
  AccordionPanel,
  AccordionTrigger,
} from '@angular/aria/accordion';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { Listbox, Option } from '@angular/aria/listbox';

interface ListOption {
  value: string;
  label: string;
  emoji: string;
}

const LIST_OPTIONS: ListOption[] = [
  { value: 'angular', label: 'Angular', emoji: '🅰️' },
  { value: 'react', label: 'React', emoji: '⚛️' },
  { value: 'vue', label: 'Vue', emoji: '💚' },
  { value: 'svelte', label: 'Svelte', emoji: '🔥' },
  { value: 'solid', label: 'Solid', emoji: '🔷' },
];

@Component({
  selector: 'app-aria-accessibility',
  imports: [
    AccordionGroup, AccordionTrigger, AccordionPanel, AccordionContent,
    Tabs, TabList, Tab, TabPanel, TabContent,
    Listbox, Option,
  ],
  template: `
    <div class="max-w-6xl space-y-8">

      <!-- Header -->
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h1 class="text-2xl font-bold text-neutral-100">ARIA / Accessibility</h1>
          <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-900/30 text-green-400 border border-green-800/30">&#64;angular/aria</span>
          <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-angular-red/15 text-angular-red border border-angular-red/25">Stable</span>
        </div>
        <p class="text-neutral-400 text-sm">
          Official Angular ARIA patterns — Accordion · Tabs · Listbox · Live regions
        </p>
      </div>

      <!-- WCAG quick checklist -->
      <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
        <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
          <h2 class="text-sm font-semibold text-neutral-200">WCAG AA Checklist</h2>
        </div>
        <div class="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          @for (item of wcagItems; track item.label) {
            <div class="flex items-start gap-2.5 rounded-lg border border-neutral-800 bg-surface-800/40 px-3 py-2.5">
              <svg class="h-3.5 w-3.5 shrink-0 mt-0.5 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.2l-4.2-4.2-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
              </svg>
              <div>
                <p class="font-semibold text-neutral-200">{{ item.label }}</p>
                <p class="text-neutral-600 mt-0.5">{{ item.desc }}</p>
              </div>
            </div>
          }
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- 1. Accordion (@angular/aria) -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">
              Accordion
              <span class="ml-2 text-[10px] font-mono text-neutral-600">ngAccordionGroup</span>
            </h2>
          </div>
          <div class="p-5 space-y-4">
            <div ngAccordionGroup class="space-y-1">
              @for (item of accordionItems; track item.id) {
                <div>
                  <h3>
                    <button
                      ngAccordionTrigger
                      [panel]="panel"
                      class="w-full flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium text-left transition-colors text-neutral-300 border-neutral-800 hover:border-neutral-700 aria-expanded:border-angular-red aria-expanded:text-neutral-100"
                    >
                      <span>{{ item.title }}</span>
                      <svg class="h-4 w-4 shrink-0 transition-transform duration-200 aria-expanded:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </h3>
                  <div ngAccordionPanel #panel="ngAccordionPanel"
                    class="overflow-hidden transition-all"
                    [class.hidden]="!panel.visible()"
                  >
                    <ng-template ngAccordionContent>
                      <div class="rounded-b-lg border border-t-0 border-angular-red/30 bg-angular-red/5 px-4 py-3 text-sm text-neutral-400">
                        {{ item.content }}
                      </div>
                    </ng-template>
                  </div>
                </div>
              }
            </div>
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.accordion }}</pre>
          </div>
        </div>

        <!-- 2. Tabs (@angular/aria) -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">
              Tabs
              <span class="ml-2 text-[10px] font-mono text-neutral-600">ngTabs · ngTabList · ngTab · ngTabPanel</span>
            </h2>
          </div>
          <div class="p-5 space-y-4">
            <div ngTabs>
              <ul
                ngTabList
                [(selectedTab)]="selectedTab"
                class="flex gap-1 rounded-lg bg-surface-800 p-1 list-none m-0"
              >
                @for (tab of tabItems; track tab.value) {
                  <li
                    ngTab
                    [value]="tab.value"
                    class="flex-1 rounded px-3 py-2 text-xs font-medium transition-colors cursor-pointer text-center list-none
                      aria-selected:bg-surface-900 aria-selected:text-neutral-100 aria-selected:shadow-sm
                      text-neutral-500 hover:text-neutral-300"
                  >{{ tab.label }}</li>
                }
              </ul>
              @for (tab of tabItems; track tab.value) {
                <div
                  ngTabPanel
                  [value]="tab.value"
                  class="rounded-lg border border-neutral-800 bg-surface-800/40"
                >
                  <ng-template ngTabContent>
                    <div class="px-4 py-3 text-sm text-neutral-400 leading-relaxed">{{ tab.content }}</div>
                  </ng-template>
                </div>
              }
            </div>
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.tabs }}</pre>
          </div>
        </div>

        <!-- 3. Listbox (@angular/aria) -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">
              Listbox
              <span class="ml-2 text-[10px] font-mono text-neutral-600">ngListbox · ngOption</span>
            </h2>
          </div>
          <div class="p-5 space-y-4">
            <p class="text-xs text-neutral-500">
              Selected: <strong class="text-neutral-200">{{ selectedListValue()[0] ?? 'none' }}</strong>
            </p>
            <ul
              ngListbox
              [(value)]="selectedListValue"
              aria-label="Choose a framework"
              class="rounded-lg border border-neutral-700 bg-surface-800 divide-y divide-neutral-800 list-none m-0 p-0 focus-within:ring-2 focus-within:ring-angular-red/30"
            >
              @for (opt of listOptions; track opt.value) {
                <li
                  ngOption
                  [value]="opt.value"
                  class="px-3 py-2.5 flex items-center gap-3 cursor-pointer transition-colors text-sm list-none
                    aria-selected:bg-angular-red/10 aria-selected:text-angular-red
                    text-neutral-300 hover:bg-surface-700"
                >
                  <span class="text-base">{{ opt.emoji }}</span>
                  <span>{{ opt.label }}</span>
                </li>
              }
            </ul>
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.listbox }}</pre>
          </div>
        </div>

        <!-- 4. Live region -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">Live Region</h2>
            <p class="text-[10px] text-neutral-600 mt-0.5">aria-live · aria-atomic · status announcements</p>
          </div>
          <div class="p-5 space-y-4">
            <p class="text-xs text-neutral-500">
              <code class="text-angular-red">aria-live</code> announces dynamic content to screen readers.
              Use <code class="text-neutral-300">polite</code> for non-critical, <code class="text-neutral-300">assertive</code> for errors.
            </p>
            <div class="space-y-2">
              <div class="flex flex-wrap gap-2">
                <button
                  (click)="announce('polite', 'Data saved successfully!')"
                  class="rounded border border-green-800/40 bg-green-900/10 px-3 py-1.5 text-xs text-green-400 hover:bg-green-900/20 transition-colors"
                >Announce success (polite)</button>
                <button
                  (click)="announce('assertive', 'Error: connection failed!')"
                  class="rounded border border-red-800/40 bg-red-900/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-900/20 transition-colors"
                >Announce error (assertive)</button>
              </div>
              <div aria-live="polite" aria-atomic="true" class="rounded-lg border border-neutral-800 bg-surface-800 min-h-8 px-3 py-2 text-xs">
                @if (politeMsg()) {
                  <p class="text-green-400">{{ politeMsg() }}</p>
                } @else {
                  <p class="text-neutral-600">polite region — silent</p>
                }
              </div>
              <div aria-live="assertive" aria-atomic="true" class="rounded-lg border border-neutral-800 bg-surface-800 min-h-8 px-3 py-2 text-xs">
                @if (assertiveMsg()) {
                  <p class="text-red-400">{{ assertiveMsg() }}</p>
                } @else {
                  <p class="text-neutral-600">assertive region — silent</p>
                }
              </div>
            </div>
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.live }}</pre>
          </div>
        </div>

      </div>
    </div>
  `,
})
export class AriaAccessibility {
  protected readonly listOptions = LIST_OPTIONS;
  protected readonly selectedTab = signal<string | undefined>('wcag');
  protected readonly selectedListValue = signal<string[]>([]);
  protected readonly politeMsg = signal('');
  protected readonly assertiveMsg = signal('');

  protected readonly accordionItems = [
    { id: 'a1', title: 'What are Angular signals?', content: 'Signals are reactive primitives that Angular uses to track dependencies and update the DOM efficiently. They replace zone.js for change detection.' },
    { id: 'a2', title: 'When to use computed() vs effect()?', content: 'Use computed() to derive values from signals — it memoizes and re-runs only when its dependencies change. Use effect() only for side effects like logging, DOM manipulation, or analytics.' },
    { id: 'a3', title: 'What is standalone architecture?', content: 'Angular 17+ makes standalone the default. Components declare their own imports array, eliminating the need for NgModules.' },
  ];

  protected readonly tabItems = [
    { value: 'wcag', label: 'WCAG AA', content: 'WCAG AA requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text. Angular templates should use semantic HTML and provide sufficient color contrast.' },
    { value: 'keyboard', label: 'Keyboard', content: 'All interactive elements must be keyboard accessible. Use tabindex, focus management, and ARIA roles to ensure users can navigate without a mouse.' },
    { value: 'screen', label: 'Screen Readers', content: 'Angular applications should announce dynamic content changes with aria-live regions. Use aria-label, aria-labelledby, and aria-describedby to provide context.' },
  ];

  protected announce(type: 'polite' | 'assertive', msg: string): void {
    if (type === 'polite') {
      this.politeMsg.set(msg);
      setTimeout(() => this.politeMsg.set(''), 3000);
    } else {
      this.assertiveMsg.set(msg);
      setTimeout(() => this.assertiveMsg.set(''), 3000);
    }
  }

  protected readonly wcagItems = [
    { label: 'Contrast 4.5:1', desc: 'Normal text min ratio' },
    { label: 'Keyboard nav', desc: 'All controls reachable' },
    { label: 'Focus visible', desc: 'Always visible focus ring' },
    { label: 'Semantic HTML', desc: 'Use elements as intended' },
    { label: 'ARIA roles', desc: 'Only when native fails' },
    { label: 'Live regions', desc: 'Announce dynamic content' },
  ];

  protected readonly snippets = {
    accordion: `<div ngAccordionGroup>
  <button ngAccordionTrigger [panel]="p1">
    Title
  </button>
  <div ngAccordionPanel #p1="ngAccordionPanel">
    <ng-template ngAccordionContent>
      Content (lazily rendered)
    </ng-template>
  </div>
</div>`,

    tabs: `<div ngTabs>
  <ul ngTabList [(selectedTab)]="selected">
    <li ngTab value="t1">Tab 1</li>
    <li ngTab value="t2">Tab 2</li>
  </ul>
  <div ngTabPanel value="t1">
    <ng-template ngTabContent>Panel 1</ng-template>
  </div>
  <div ngTabPanel value="t2">
    <ng-template ngTabContent>Panel 2</ng-template>
  </div>
</div>`,

    listbox: `<ul ngListbox [(value)]="selected">
  @for (opt of options; track opt.value) {
    <li ngOption [value]="opt.value">
      {{ opt.label }}
    </li>
  }
</ul>

// Keyboard: Arrow ↑↓, Home, End
// aria-selected managed automatically`,

    live: `<div aria-live="polite" aria-atomic="true">
  {{ statusMessage() }}
</div>

<div aria-live="assertive" aria-atomic="true">
  {{ errorMessage() }}
</div>

// polite: waits for user idle
// assertive: interrupts immediately`,
  };
}
