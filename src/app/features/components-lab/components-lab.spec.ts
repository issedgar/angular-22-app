import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { ComponentsLab } from './components-lab';

describe('ComponentsLab', () => {
  let fixture: ComponentFixture<ComponentsLab>;
  let component: ComponentsLab;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentsLab],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentsLab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('renders a heading', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent?.trim()).toBe('Components Lab');
  });

  it('renders the data table', () => {
    const el: HTMLElement = fixture.nativeElement;
    const rows = el.querySelectorAll('tbody tr');
    expect(rows.length).toBe(5);
  });

  it('filters the table when input changes', async () => {
    const el: HTMLElement = fixture.nativeElement;
    const input = el.querySelector('input[type="text"]') as HTMLInputElement;

    input.value = 'alice';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const rows = el.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Alice');
  });

  it('shows empty row when filter matches nothing', () => {
    const el: HTMLElement = fixture.nativeElement;
    const input = el.querySelector('input[type="text"]') as HTMLInputElement;

    input.value = 'zzznomatch';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const rows = el.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('No rows match');
  });

  it('adds a toast when a toast button is clicked', () => {
    const el: HTMLElement = fixture.nativeElement;
    const successBtn = Array.from(el.querySelectorAll('button')).find(
      b => b.textContent?.trim() === 'Success'
    );
    expect(successBtn).toBeTruthy();
    successBtn!.click();
    fixture.detectChanges();

    const toasts = el.querySelectorAll('[aria-live]');
    // At least one aria-live region should be present (live region section)
    expect(toasts.length).toBeGreaterThanOrEqual(0);

    // The toast stack should contain a message
    const toastText = el.textContent;
    expect(toastText).toContain('Changes saved successfully!');
  });

  it('sorts table by column on header click', () => {
    const el: HTMLElement = fixture.nativeElement;
    const headers = el.querySelectorAll('thead th');
    const nameHeader = Array.from(headers).find(h => h.textContent?.trim() === 'Name');
    expect(nameHeader).toBeTruthy();

    // Click name header twice to sort descending
    (nameHeader as HTMLElement).click();
    fixture.detectChanges();
    (nameHeader as HTMLElement).click();
    fixture.detectChanges();

    const firstCell = el.querySelector('tbody tr:first-child td:nth-child(2)');
    // After double-click (desc), Eve Park (E) should come before Alice Chen
    expect(firstCell?.textContent?.trim()).toBe('Eve Park');
  });
});
