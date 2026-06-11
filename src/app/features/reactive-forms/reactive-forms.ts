import { Component, computed, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

// Custom validator: passwords must match
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pwd = control.get('password');
  const confirm = control.get('confirm');
  if (!pwd || !confirm) return null;
  return pwd.value === confirm.value ? null : { passwordMismatch: true };
}

// Custom validator: no consecutive repeated characters
function noRepeatValidator(control: AbstractControl): ValidationErrors | null {
  const v: string = control.value ?? '';
  return /(.)\1{2,}/.test(v) ? { noRepeat: true } : null;
}

@Component({
  selector: 'app-reactive-forms',
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-6xl space-y-8">

      <!-- Header -->
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h1 class="text-2xl font-bold text-neutral-100">Reactive Forms</h1>
          <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-angular-red/15 text-angular-red border border-angular-red/25">Stable</span>
        </div>
        <p class="text-neutral-400 text-sm">
          FormGroup · FormControl · FormArray · Validators · Cross-field validation · Dynamic fields
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- 1. Basic FormGroup with validation -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">FormGroup — registration</h2>
          </div>
          <div class="p-5 space-y-4">
            <form [formGroup]="regForm" (ngSubmit)="submitReg()" class="space-y-3" novalidate>
              <!-- Email -->
              <div class="space-y-1">
                <label class="text-xs text-neutral-500">Email</label>
                <input
                  formControlName="email"
                  type="email"
                  placeholder="user@example.com"
                  class="w-full rounded-lg border px-3 py-2 text-xs bg-surface-800 text-neutral-200 placeholder-neutral-600 focus:outline-none transition-colors"
                  [class.border-neutral-700]="!isInvalid(regEmail)"
                  [class.border-red-600]="isInvalid(regEmail)"
                  [class.focus:border-angular-red]="!isInvalid(regEmail)"
                />
                @if (isInvalid(regEmail) && regEmail.errors?.['required']) {
                  <p class="text-[10px] text-red-400">Email is required</p>
                }
                @if (isInvalid(regEmail) && regEmail.errors?.['email']) {
                  <p class="text-[10px] text-red-400">Enter a valid email address</p>
                }
              </div>
              <!-- Password -->
              <div class="space-y-1">
                <label class="text-xs text-neutral-500">Password</label>
                <input
                  formControlName="password"
                  type="password"
                  placeholder="Min 8 characters"
                  class="w-full rounded-lg border px-3 py-2 text-xs bg-surface-800 text-neutral-200 placeholder-neutral-600 focus:outline-none transition-colors"
                  [class.border-neutral-700]="!isInvalid(regPassword)"
                  [class.border-red-600]="isInvalid(regPassword)"
                />
                @if (isInvalid(regPassword) && regPassword.errors?.['required']) {
                  <p class="text-[10px] text-red-400">Password is required</p>
                }
                @if (isInvalid(regPassword) && regPassword.errors?.['minlength']) {
                  <p class="text-[10px] text-red-400">Minimum 8 characters</p>
                }
                @if (isInvalid(regPassword) && regPassword.errors?.['noRepeat']) {
                  <p class="text-[10px] text-red-400">Avoid repeated characters</p>
                }
              </div>
              <!-- Confirm -->
              <div class="space-y-1">
                <label class="text-xs text-neutral-500">Confirm password</label>
                <input
                  formControlName="confirm"
                  type="password"
                  placeholder="Repeat password"
                  class="w-full rounded-lg border px-3 py-2 text-xs bg-surface-800 text-neutral-200 placeholder-neutral-600 focus:outline-none transition-colors"
                  [class.border-neutral-700]="!regForm.errors?.['passwordMismatch']"
                  [class.border-red-600]="regForm.errors?.['passwordMismatch'] && regConfirm.touched"
                />
                @if (regForm.errors?.['passwordMismatch'] && regConfirm.touched) {
                  <p class="text-[10px] text-red-400">Passwords do not match</p>
                }
              </div>
              <!-- Status -->
              <div class="rounded-lg border border-neutral-800 bg-surface-800 px-3 py-2 text-[10px] font-mono space-y-0.5">
                <div class="flex gap-3">
                  <span [class.text-green-400]="regForm.valid" [class.text-neutral-600]="!regForm.valid">valid: {{ regForm.valid }}</span>
                  <span [class.text-amber-400]="regForm.dirty" [class.text-neutral-600]="!regForm.dirty">dirty: {{ regForm.dirty }}</span>
                  <span [class.text-blue-400]="regForm.touched" [class.text-neutral-600]="!regForm.touched">touched: {{ regForm.touched }}</span>
                </div>
              </div>
              <button
                type="submit"
                [disabled]="regForm.invalid"
                class="w-full rounded-lg bg-angular-red py-2 text-xs font-medium text-white transition-colors hover:bg-angular-dark-red disabled:opacity-40 disabled:cursor-not-allowed"
              >Register</button>
            </form>
            @if (regResult()) {
              <div class="rounded-lg border border-green-800/30 bg-green-900/10 px-3 py-2 text-xs text-green-400">
                {{ regResult() }}
              </div>
            }
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.formGroup }}</pre>
          </div>
        </div>

        <!-- 2. FormArray — dynamic fields -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">FormArray — dynamic fields</h2>
          </div>
          <div class="p-5 space-y-4">
            <p class="text-xs text-neutral-500">Add or remove skill entries at runtime using FormArray.</p>
            <form [formGroup]="skillsForm" (ngSubmit)="submitSkills()" class="space-y-3" novalidate>
              <div formArrayName="skills" class="space-y-2">
                @for (ctrl of skillControls; track $index; let i = $index) {
                  <div class="flex gap-2 items-center">
                    <input
                      [formControlName]="i"
                      type="text"
                      [placeholder]="'Skill ' + (i + 1)"
                      class="flex-1 rounded-lg border border-neutral-700 px-3 py-2 text-xs bg-surface-800 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-angular-red/50 transition-colors"
                    />
                    <button
                      type="button"
                      (click)="removeSkill(i)"
                      [disabled]="skillControls.length <= 1"
                      class="shrink-0 rounded border border-red-800/30 px-2 py-1.5 text-xs text-red-500 hover:bg-red-900/10 transition-colors disabled:opacity-30"
                    >✕</button>
                  </div>
                }
              </div>
              <button
                type="button"
                (click)="addSkill()"
                class="w-full rounded-lg border border-dashed border-neutral-700 py-2 text-xs text-neutral-500 hover:border-neutral-500 hover:text-neutral-300 transition-colors"
              >+ Add skill</button>
              <button
                type="submit"
                [disabled]="skillsForm.invalid"
                class="w-full rounded-lg bg-angular-red py-2 text-xs font-medium text-white transition-colors hover:bg-angular-dark-red disabled:opacity-40 disabled:cursor-not-allowed"
              >Save skills</button>
            </form>
            @if (skillsResult()) {
              <div class="rounded-lg border border-green-800/30 bg-green-900/10 px-3 py-2 text-xs text-green-400">
                {{ skillsResult() }}
              </div>
            }
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.formArray }}</pre>
          </div>
        </div>

        <!-- 3. FormControl + valueChanges reactive stream -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">
              FormControl + <code class="text-angular-red">valueChanges</code> → <code class="text-angular-red">toSignal()</code>
            </h2>
          </div>
          <div class="p-5 space-y-4">
            <p class="text-xs text-neutral-500">
              Bridge <code class="text-angular-red">valueChanges</code> (Observable) to a signal using
              <code class="text-angular-red">toSignal()</code>.
            </p>
            <input
              [formControl]="searchControl"
              type="text"
              placeholder="Type to search…"
              class="w-full rounded-lg border border-neutral-700 px-3 py-2 text-xs bg-surface-800 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-angular-red/50 transition-colors"
            />
            <div class="rounded-lg border border-neutral-800 bg-surface-800 p-4 space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-neutral-500">searchValue (signal)</span>
                <span class="font-mono text-angular-red">"{{ searchValue() }}"</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-500">length (computed)</span>
                <span class="font-mono text-neutral-300">{{ searchLength() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-500">valid</span>
                <span [class.text-green-400]="searchControl.valid" [class.text-red-400]="searchControl.invalid" class="font-mono">{{ searchControl.valid }}</span>
              </div>
            </div>
            @if (filteredItems().length) {
              <div class="space-y-1">
                @for (item of filteredItems(); track item) {
                  <div class="rounded border border-neutral-800 bg-surface-800/50 px-3 py-1.5 text-xs text-neutral-300">{{ item }}</div>
                }
              </div>
            }
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.valueChanges }}</pre>
          </div>
        </div>

        <!-- 4. Validators summary -->
        <div class="rounded-2xl border border-neutral-800 bg-surface-900 overflow-hidden">
          <div class="px-5 py-3 border-b border-neutral-800 bg-surface-800/50">
            <h2 class="text-sm font-semibold text-neutral-200">Built-in Validators</h2>
          </div>
          <div class="p-5 space-y-3">
            <div class="divide-y divide-neutral-800/50 text-xs">
              @for (v of validatorDocs; track v.name) {
                <div class="py-2.5 grid grid-cols-[120px_1fr]">
                  <code class="text-angular-red">{{ v.name }}</code>
                  <span class="text-neutral-500">{{ v.desc }}</span>
                </div>
              }
            </div>
            <pre class="rounded-lg bg-surface-800 p-3 text-xs font-mono text-neutral-300 leading-relaxed overflow-x-auto">{{ snippets.validators }}</pre>
          </div>
        </div>

      </div>
    </div>
  `,
})
export class ReactiveForms {
  // ── FormGroup with cross-field validation ──────────────────────────────────
  protected readonly regEmail    = new FormControl('', [Validators.required, Validators.email]);
  protected readonly regPassword = new FormControl('', [Validators.required, Validators.minLength(8), noRepeatValidator]);
  protected readonly regConfirm  = new FormControl('', [Validators.required]);

  protected readonly regForm = new FormGroup(
    { email: this.regEmail, password: this.regPassword, confirm: this.regConfirm },
    { validators: passwordMatchValidator }
  );

  protected readonly regResult = signal('');

  protected submitReg(): void {
    if (this.regForm.invalid) return;
    this.regResult.set(`Registered: ${this.regEmail.value}`);
    this.regForm.reset();
    setTimeout(() => this.regResult.set(''), 4000);
  }

  // ── FormArray ──────────────────────────────────────────────────────────────
  protected readonly skillsArray = new FormArray([
    new FormControl('Angular', Validators.required),
    new FormControl('TypeScript', Validators.required),
  ]);
  protected readonly skillsForm = new FormGroup({ skills: this.skillsArray });
  protected readonly skillsResult = signal('');

  get skillControls(): FormControl[] {
    return this.skillsArray.controls as FormControl[];
  }

  protected addSkill(): void {
    this.skillsArray.push(new FormControl('', Validators.required));
  }

  protected removeSkill(i: number): void {
    if (this.skillsArray.length > 1) this.skillsArray.removeAt(i);
  }

  protected submitSkills(): void {
    const skills = this.skillsArray.value.filter(Boolean).join(', ');
    this.skillsResult.set(`Saved: ${skills}`);
    setTimeout(() => this.skillsResult.set(''), 4000);
  }

  // ── FormControl + valueChanges + toSignal ──────────────────────────────────
  protected readonly searchControl = new FormControl('', Validators.minLength(2));
  protected readonly searchValue = toSignal(this.searchControl.valueChanges, { initialValue: '' });
  protected readonly searchLength = computed(() => (this.searchValue() ?? '').length);

  private readonly allItems = ['Angular', 'Angular CLI', 'Angular CDK', 'Signals', 'Signal Forms', 'RxJS', 'TypeScript', 'Tailwind', 'Vitest'];

  protected readonly filteredItems = computed(() => {
    const q = (this.searchValue() ?? '').toLowerCase().trim();
    if (!q || q.length < 2) return [];
    return this.allItems.filter(i => i.toLowerCase().includes(q));
  });

  // ── Helpers ────────────────────────────────────────────────────────────────
  protected isInvalid(ctrl: FormControl): boolean {
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  protected readonly validatorDocs = [
    { name: 'required',      desc: 'Control value must be non-empty.' },
    { name: 'email',         desc: 'Value must match an email pattern.' },
    { name: 'minLength(n)',  desc: 'Value length must be ≥ n.' },
    { name: 'maxLength(n)',  desc: 'Value length must be ≤ n.' },
    { name: 'min(n)',        desc: 'Numeric value must be ≥ n.' },
    { name: 'max(n)',        desc: 'Numeric value must be ≤ n.' },
    { name: 'pattern(r)',   desc: 'Value must match the RegExp r.' },
    { name: 'nullValidator', desc: 'Always returns null (valid).' },
    { name: 'compose()',     desc: 'Combine multiple sync validators.' },
    { name: 'composeAsync()',desc: 'Combine multiple async validators.' },
  ];

  protected readonly snippets = {
    formGroup: `const form = new FormGroup(
  {
    email:    new FormControl('', [required, email]),
    password: new FormControl('', [required, minLength(8)]),
    confirm:  new FormControl('', required),
  },
  { validators: passwordMatchValidator }  // cross-field
);

// Typed value access
form.value.email; // string | null`,

    formArray: `// Dynamic list of controls
const skills = new FormArray([
  new FormControl('Angular', required),
]);

// Add / remove at runtime
skills.push(new FormControl('', required));
skills.removeAt(i);

// Wrap in FormGroup
const form = new FormGroup({ skills });`,

    valueChanges: `import { toSignal } from '@angular/core/rxjs-interop';

const ctrl = new FormControl('', minLength(2));

// Bridge Observable to signal
const value = toSignal(ctrl.valueChanges, {
  initialValue: '',
});

// Use in computed()
const length = computed(() => value().length);`,

    validators: `// Combine validators
new FormControl('', [
  Validators.required,
  Validators.email,
  Validators.minLength(6),
  myCustomValidator,    // (ctrl) => ValidationErrors | null
  myAsyncValidator,     // (ctrl) => Observable<ValidationErrors | null>
])`,
  };
}
