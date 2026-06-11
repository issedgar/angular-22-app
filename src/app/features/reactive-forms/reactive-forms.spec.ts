import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { describe, expect, it } from 'vitest';

// Replicate validators from reactive-forms.ts for isolated unit testing
function passwordMatchValidator(control: AbstractControl) {
  const pwd = control.get('password');
  const confirm = control.get('confirm');
  if (!pwd || !confirm) return null;
  return pwd.value === confirm.value ? null : { passwordMismatch: true };
}

function noRepeatValidator(control: AbstractControl) {
  const v: string = control.value ?? '';
  return /(.)\1{2,}/.test(v) ? { noRepeat: true } : null;
}

describe('noRepeatValidator', () => {
  const ctrl = (value: string) => {
    const c = new FormControl(value);
    return noRepeatValidator(c);
  };

  it('returns null for normal password', () => {
    expect(ctrl('Str0ngPass!')).toBeNull();
  });

  it('returns null for two identical consecutive chars', () => {
    expect(ctrl('password11')).toBeNull();
  });

  it('returns error for 3+ consecutive identical chars', () => {
    expect(ctrl('paaasword')).toEqual({ noRepeat: true });
  });

  it('returns error for aaa at end', () => {
    expect(ctrl('mypassaaa')).toEqual({ noRepeat: true });
  });

  it('returns null for empty value', () => {
    expect(ctrl('')).toBeNull();
  });
});

describe('passwordMatchValidator', () => {
  const group = (password: string, confirm: string) =>
    new FormGroup(
      {
        password: new FormControl(password),
        confirm: new FormControl(confirm),
      },
      { validators: passwordMatchValidator }
    );

  it('returns null when passwords match', () => {
    const g = group('secret123', 'secret123');
    expect(g.errors).toBeNull();
  });

  it('returns passwordMismatch when passwords differ', () => {
    const g = group('secret123', 'different');
    expect(g.errors).toEqual({ passwordMismatch: true });
  });

  it('returns passwordMismatch when one is empty', () => {
    const g = group('secret123', '');
    expect(g.errors).toEqual({ passwordMismatch: true });
  });
});

describe('Registration FormGroup', () => {
  const buildForm = () =>
    new FormGroup(
      {
        email:    new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(8), noRepeatValidator]),
        confirm:  new FormControl('', Validators.required),
      },
      { validators: passwordMatchValidator }
    );

  it('is invalid when empty', () => {
    expect(buildForm().invalid).toBe(true);
  });

  it('is invalid with a bad email', () => {
    const f = buildForm();
    f.setValue({ email: 'not-an-email', password: 'ValidPass1!', confirm: 'ValidPass1!' });
    expect(f.get('email')?.errors?.['email']).toBeTruthy();
  });

  it('is invalid when password is too short', () => {
    const f = buildForm();
    f.setValue({ email: 'a@b.com', password: 'short', confirm: 'short' });
    expect(f.get('password')?.errors?.['minlength']).toBeTruthy();
  });

  it('is invalid when passwords do not match', () => {
    const f = buildForm();
    f.setValue({ email: 'a@b.com', password: 'LongEnough1', confirm: 'Different1' });
    expect(f.errors?.['passwordMismatch']).toBeTruthy();
  });

  it('is valid with correct values', () => {
    const f = buildForm();
    f.setValue({ email: 'user@example.com', password: 'ValidPass1!', confirm: 'ValidPass1!' });
    expect(f.valid).toBe(true);
  });
});
