import { Component, computed, signal } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type BadgeColor = 'red' | 'green' | 'blue' | 'amber' | 'purple' | 'neutral';
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMsg {
  id: number;
  type: ToastType;
  message: string;
}

interface TableRow {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  joined: string;
}

const TABLE_DATA: TableRow[] = [
  { id: 1, name: 'Alice Chen', role: 'Frontend', status: 'active', joined: '2023-01' },
  { id: 2, name: 'Bob Müller', role: 'Backend', status: 'inactive', joined: '2022-08' },
  { id: 3, name: 'Carol Smith', role: 'DevOps', status: 'active', joined: '2023-06' },
  { id: 4, name: 'Dan Rossi', role: 'Design', status: 'pending', joined: '2024-02' },
  { id: 5, name: 'Eve Park', role: 'QA', status: 'active', joined: '2023-11' },
];

let _toastId = 0;

@Component({
  selector: 'app-components-lab',
  template: `
    <div class="max-w-6xl space-y-8">

      <!-- Header -->
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h1 class="text-2xl font-bold text-neutral-100">Components Lab</h1>
          <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-angular-red/15 text-angular-red border border-angular-red/25">UI Patterns</span>
        </div>
        <p class="text-neutral-400 text-sm">
          Buttons · Badges · Cards · Toasts · Data table — all signal-driven, no extra dependencies
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- 1. Buttons -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">Buttons</h2>
          </div>
          <div class="p-5 space-y-4">
            <div class="flex flex-wrap gap-2">
              @for (btn of buttonVariants; track btn.variant) {
                <button
                  [class]="btnClass(btn.variant)"
                  (click)="addToast(btn.toast, btn.label)"
                  [disabled]="btn.disabled"
                >{{ btn.label }}</button>
              }
            </div>
            <div class="flex flex-wrap gap-2">
              <!-- Sizes -->
              <button class="rounded px-2 py-1 text-[10px] font-medium bg-angular-red text-white hover:bg-angular-dark-red transition-colors">xs</button>
              <button class="rounded px-3 py-1.5 text-xs font-medium bg-angular-red text-white hover:bg-angular-dark-red transition-colors">sm</button>
              <button class="rounded-lg px-4 py-2 text-sm font-medium bg-angular-red text-white hover:bg-angular-dark-red transition-colors">md</button>
              <button class="rounded-xl px-6 py-3 text-base font-medium bg-angular-red text-white hover:bg-angular-dark-red transition-colors">lg</button>
            </div>
            <div class="flex flex-wrap gap-2 items-center">
              <!-- With icons -->
              <button class="flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-400 hover:text-neutral-200 hover:border-neutral-500 transition-colors">
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Upload
              </button>
              <button class="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 transition-colors">
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Confirm
              </button>
              <!-- Loading state -->
              <button class="flex items-center gap-1.5 rounded-lg bg-angular-red/60 px-3 py-2 text-xs font-medium text-white cursor-not-allowed" disabled>
                <svg class="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="31.4" stroke-dashoffset="10"/>
                </svg>
                Loading…
              </button>
            </div>
          </div>
        </div>

        <!-- 2. Badges -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">Badges</h2>
          </div>
          <div class="p-5 space-y-4">
            <!-- Solid badges -->
            <div>
              <p class="text-[10px] uppercase tracking-wider text-neutral-600 mb-2">Solid</p>
              <div class="flex flex-wrap gap-2">
                @for (b of badges; track b.color) {
                  <span [class]="badgeClass(b.color, 'solid')">{{ b.label }}</span>
                }
              </div>
            </div>
            <!-- Subtle badges -->
            <div>
              <p class="text-[10px] uppercase tracking-wider text-neutral-600 mb-2">Subtle</p>
              <div class="flex flex-wrap gap-2">
                @for (b of badges; track b.color) {
                  <span [class]="badgeClass(b.color, 'subtle')">{{ b.label }}</span>
                }
              </div>
            </div>
            <!-- Pill with dot -->
            <div>
              <p class="text-[10px] uppercase tracking-wider text-neutral-600 mb-2">With dot</p>
              <div class="flex flex-wrap gap-2">
                <span class="flex items-center gap-1.5 rounded-full border border-green-800/30 bg-green-900/20 px-2.5 py-0.5 text-xs text-green-400">
                  <span class="h-1.5 w-1.5 rounded-full bg-green-400"></span> Online
                </span>
                <span class="flex items-center gap-1.5 rounded-full border border-red-800/30 bg-red-900/20 px-2.5 py-0.5 text-xs text-red-400">
                  <span class="h-1.5 w-1.5 rounded-full bg-red-400"></span> Offline
                </span>
                <span class="flex items-center gap-1.5 rounded-full border border-amber-800/30 bg-amber-900/20 px-2.5 py-0.5 text-xs text-amber-400">
                  <span class="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span> Pending
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Cards -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">Cards</h2>
          </div>
          <div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Stat card -->
            <div class="rounded-xl border border-neutral-800 bg-surface-800 p-4 space-y-2">
              <div class="flex items-center justify-between">
                <p class="text-xs text-neutral-500">Total signals</p>
                <div class="rounded-lg bg-angular-red/10 p-1.5">
                  <svg class="h-4 w-4 text-angular-red" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4.09 12.26c-.36.43-.54.65-.54.9 0 .17.07.33.19.45l.07.06c.14.13.32.2.51.2h5.68L8 22l10.91-10.26c.36-.43.54-.65.54-.9a.63.63 0 00-.26-.51c-.14-.13-.32-.2-.51-.2H13L15 2h-2z"/></svg>
                </div>
              </div>
              <p class="text-2xl font-bold text-neutral-100">{{ statCount() }}</p>
              <div class="flex items-center gap-1 text-[11px]">
                <svg class="h-3 w-3 text-green-400" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14l5-5 5 5"/></svg>
                <span class="text-green-400">+12%</span>
                <span class="text-neutral-600">this month</span>
              </div>
            </div>
            <!-- Info card -->
            <div class="rounded-xl border border-neutral-800 bg-surface-800 p-4 space-y-2">
              <p class="text-xs text-neutral-500">Framework</p>
              <p class="text-lg font-bold text-neutral-100">Angular 22</p>
              <div class="flex flex-wrap gap-1">
                <span class="rounded border border-neutral-700 px-1.5 py-0.5 text-[10px] font-mono text-neutral-500">signals</span>
                <span class="rounded border border-neutral-700 px-1.5 py-0.5 text-[10px] font-mono text-neutral-500">zoneless</span>
                <span class="rounded border border-neutral-700 px-1.5 py-0.5 text-[10px] font-mono text-neutral-500">SSR</span>
              </div>
            </div>
            <!-- Action card -->
            <div class="sm:col-span-2 rounded-xl border border-neutral-800 bg-surface-800 p-4 flex items-center justify-between gap-4">
              <div>
                <p class="text-sm font-semibold text-neutral-200">Deploy ready</p>
                <p class="text-xs text-neutral-500 mt-0.5">Build passing · 100% coverage</p>
              </div>
              <button
                (click)="addToast('success', 'Deployment triggered!')"
                class="shrink-0 rounded-lg bg-angular-red px-4 py-2 text-xs font-medium text-white hover:bg-angular-dark-red transition-colors"
              >Deploy</button>
            </div>
          </div>
        </div>

        <!-- 4. Toast system -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-neutral-200">Toast Notifications</h2>
            <button (click)="clearToasts()" class="text-[10px] text-neutral-600 hover:text-neutral-400 transition-colors">clear all</button>
          </div>
          <div class="p-5 space-y-4">
            <div class="flex flex-wrap gap-2">
              <button (click)="addToast('success', 'Changes saved successfully!')"
                class="rounded border border-green-800/40 bg-green-900/10 px-3 py-1.5 text-xs text-green-400 hover:bg-green-900/20 transition-colors">Success</button>
              <button (click)="addToast('error', 'Something went wrong. Try again.')"
                class="rounded border border-red-800/40 bg-red-900/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-900/20 transition-colors">Error</button>
              <button (click)="addToast('warning', 'This action cannot be undone.')"
                class="rounded border border-amber-800/40 bg-amber-900/10 px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-900/20 transition-colors">Warning</button>
              <button (click)="addToast('info', 'New version available.')"
                class="rounded border border-blue-800/40 bg-blue-900/10 px-3 py-1.5 text-xs text-blue-400 hover:bg-blue-900/20 transition-colors">Info</button>
            </div>
            <!-- Toast stack (inline preview) -->
            <div class="space-y-2 min-h-16">
              @for (toast of toasts(); track toast.id) {
                <div [class]="toastClass(toast.type)" class="flex items-start gap-3 rounded-xl border px-4 py-3 text-xs shadow-lg">
                  <span class="text-base leading-none shrink-0">{{ toastIcon(toast.type) }}</span>
                  <p class="flex-1 leading-relaxed">{{ toast.message }}</p>
                  <button (click)="dismissToast(toast.id)" class="shrink-0 opacity-50 hover:opacity-100 transition-opacity">
                    <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              }
              @if (toasts().length === 0) {
                <p class="text-xs text-neutral-600 text-center pt-4">Click a button above to trigger a toast</p>
              }
            </div>
            <p class="text-[10px] text-neutral-600">Auto-dismiss after 4 seconds. Signals keep the toast list reactive.</p>
          </div>
        </div>

      </div>

      <!-- 5. Data table -->
      <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
        <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-neutral-200">Data Table</h2>
          <div class="flex items-center gap-2">
            <input
              type="text"
              placeholder="Filter…"
              [value]="tableFilter()"
              (input)="tableFilter.set($any($event.target).value)"
              class="rounded-lg border border-neutral-700 bg-surface-800 px-3 py-1.5 text-xs text-neutral-300 placeholder-neutral-600 focus:border-angular-red/50 focus:outline-none w-32"
            />
            <span class="text-[10px] text-neutral-600">{{ filteredRows().length }} / {{ tableData.length }}</span>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-neutral-800 bg-surface-800/50">
                @for (col of tableCols; track col.key) {
                  <th
                    class="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-neutral-500 cursor-pointer hover:text-neutral-300 transition-colors"
                    (click)="setSortCol(col.key)"
                  >
                    <div class="flex items-center gap-1">
                      {{ col.label }}
                      @if (sortCol() === col.key) {
                        <svg class="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                          @if (sortAsc()) {
                            <path d="M12 5l7 7H5l7-7z"/>
                          } @else {
                            <path d="M12 19l-7-7h14l-7 7z"/>
                          }
                        </svg>
                      }
                    </div>
                  </th>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of filteredRows(); track row.id; let even = $even) {
                <tr
                  class="border-b border-neutral-800/50 transition-colors hover:bg-surface-800/40"
                  [class.bg-surface-800]="even"
                >
                  <td class="px-4 py-3 font-mono text-neutral-500">{{ row.id }}</td>
                  <td class="px-4 py-3 font-medium text-neutral-200">{{ row.name }}</td>
                  <td class="px-4 py-3 text-neutral-400">{{ row.role }}</td>
                  <td class="px-4 py-3">
                    <span [class]="statusBadge(row.status)">{{ row.status }}</span>
                  </td>
                  <td class="px-4 py-3 font-mono text-neutral-500">{{ row.joined }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-4 py-8 text-center text-neutral-600">No rows match the filter</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `,
})
export class ComponentsLab {
  protected readonly tableData = TABLE_DATA;
  protected readonly tableFilter = signal('');
  protected readonly sortCol = signal<string>('id');
  protected readonly sortAsc = signal(true);
  protected readonly toasts = signal<ToastMsg[]>([]);
  protected readonly statCount = signal(247);

  protected readonly tableCols = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'joined', label: 'Joined' },
  ];

  protected readonly filteredRows = computed(() => {
    const q = this.tableFilter().toLowerCase();
    const col = this.sortCol();
    const asc = this.sortAsc();
    const data = q
      ? TABLE_DATA.filter(r =>
          r.name.toLowerCase().includes(q) ||
          r.role.toLowerCase().includes(q) ||
          r.status.includes(q)
        )
      : [...TABLE_DATA];
    return data.sort((a, b) => {
      const av = String((a as unknown as Record<string, unknown>)[col] ?? '');
      const bv = String((b as unknown as Record<string, unknown>)[col] ?? '');
      return asc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  });

  protected setSortCol(key: string): void {
    if (this.sortCol() === key) {
      this.sortAsc.update(v => !v);
    } else {
      this.sortCol.set(key);
      this.sortAsc.set(true);
    }
  }

  protected addToast(type: ToastType, message: string): void {
    const id = ++_toastId;
    this.toasts.update(t => [...t, { id, type, message }]);
    setTimeout(() => this.dismissToast(id), 4000);
    this.statCount.update(n => n + 1);
  }

  protected dismissToast(id: number): void {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }

  protected clearToasts(): void {
    this.toasts.set([]);
  }

  protected btnClass(v: ButtonVariant): string {
    const base = 'rounded-lg px-4 py-2 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ';
    const map: Record<ButtonVariant, string> = {
      primary: 'bg-angular-red text-white hover:bg-angular-dark-red',
      secondary: 'bg-surface-700 text-neutral-200 hover:bg-surface-600 border border-neutral-700',
      danger: 'bg-red-600/80 text-white hover:bg-red-600',
      ghost: 'text-neutral-400 hover:text-neutral-200 hover:bg-surface-800',
      outline: 'border border-angular-red/50 text-angular-red hover:bg-angular-red/10',
    };
    return base + map[v];
  }

  protected badgeClass(color: BadgeColor, style: 'solid' | 'subtle'): string {
    const base = 'rounded-full px-2.5 py-0.5 text-xs font-semibold ';
    const map: Record<BadgeColor, { solid: string; subtle: string }> = {
      red:     { solid: 'bg-red-600 text-white',       subtle: 'bg-red-900/20 text-red-400 border border-red-800/30' },
      green:   { solid: 'bg-green-600 text-white',     subtle: 'bg-green-900/20 text-green-400 border border-green-800/30' },
      blue:    { solid: 'bg-blue-600 text-white',      subtle: 'bg-blue-900/20 text-blue-400 border border-blue-800/30' },
      amber:   { solid: 'bg-amber-500 text-white',     subtle: 'bg-amber-900/20 text-amber-400 border border-amber-800/30' },
      purple:  { solid: 'bg-purple-600 text-white',    subtle: 'bg-purple-900/20 text-purple-400 border border-purple-800/30' },
      neutral: { solid: 'bg-neutral-600 text-white',   subtle: 'bg-neutral-800 text-neutral-400 border border-neutral-700' },
    };
    return base + map[color][style];
  }

  protected toastClass(type: ToastType): string {
    const map: Record<ToastType, string> = {
      success: 'bg-green-900/10 border-green-800/30 text-green-300',
      error:   'bg-red-900/10 border-red-800/30 text-red-300',
      warning: 'bg-amber-900/10 border-amber-800/30 text-amber-300',
      info:    'bg-blue-900/10 border-blue-800/30 text-blue-300',
    };
    return map[type];
  }

  protected toastIcon(type: ToastType): string {
    const map: Record<ToastType, string> = {
      success: '✓', error: '✕', warning: '⚠', info: 'ℹ',
    };
    return map[type];
  }

  protected statusBadge(s: TableRow['status']): string {
    const map: Record<TableRow['status'], string> = {
      active:   'rounded-full px-2 py-0.5 text-[10px] font-semibold bg-green-900/20 text-green-400 border border-green-800/30',
      inactive: 'rounded-full px-2 py-0.5 text-[10px] font-semibold bg-neutral-800 text-neutral-500 border border-neutral-700',
      pending:  'rounded-full px-2 py-0.5 text-[10px] font-semibold bg-amber-900/20 text-amber-400 border border-amber-800/30',
    };
    return map[s];
  }

  protected readonly buttonVariants: { variant: ButtonVariant; label: string; toast: ToastType; disabled: boolean }[] = [
    { variant: 'primary',   label: 'Primary',   toast: 'success', disabled: false },
    { variant: 'secondary', label: 'Secondary', toast: 'info',    disabled: false },
    { variant: 'danger',    label: 'Danger',    toast: 'error',   disabled: false },
    { variant: 'ghost',     label: 'Ghost',     toast: 'info',    disabled: false },
    { variant: 'outline',   label: 'Outline',   toast: 'warning', disabled: false },
    { variant: 'primary',   label: 'Disabled',  toast: 'info',    disabled: true  },
  ];

  protected readonly badges: { color: BadgeColor; label: string }[] = [
    { color: 'red',     label: 'Red' },
    { color: 'green',   label: 'Green' },
    { color: 'blue',    label: 'Blue' },
    { color: 'amber',   label: 'Amber' },
    { color: 'purple',  label: 'Purple' },
    { color: 'neutral', label: 'Neutral' },
  ];
}
