import { computed, effect, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

/**
 * Pure signal tests — no TestBed needed.
 * These test Angular primitives directly using Vitest.
 */
describe('Angular Signals', () => {
  describe('signal()', () => {
    it('holds an initial value', () => {
      const count = signal(0);
      expect(count()).toBe(0);
    });

    it('.set() replaces the value', () => {
      const count = signal(5);
      count.set(10);
      expect(count()).toBe(10);
    });

    it('.update() transforms the current value', () => {
      const count = signal(3);
      count.update(n => n * 2);
      expect(count()).toBe(6);
    });

    it('stores any value type', () => {
      const user = signal({ name: 'Alice', age: 30 });
      expect(user().name).toBe('Alice');
      user.set({ name: 'Bob', age: 25 });
      expect(user().name).toBe('Bob');
    });
  });

  describe('computed()', () => {
    it('derives value from a source signal', () => {
      const price = signal(100);
      const withTax = computed(() => price() * 1.21);
      expect(withTax()).toBeCloseTo(121);
    });

    it('updates when dependency changes', () => {
      const base = signal(10);
      const doubled = computed(() => base() * 2);
      expect(doubled()).toBe(20);
      base.set(15);
      expect(doubled()).toBe(30);
    });

    it('chains multiple computeds', () => {
      const x = signal(2);
      const y = computed(() => x() + 1);
      const z = computed(() => y() * y());
      expect(z()).toBe(9);
      x.set(4);
      expect(z()).toBe(25);
    });

    it('can derive from multiple signals', () => {
      const a = signal(3);
      const b = signal(4);
      const hyp = computed(() => Math.sqrt(a() ** 2 + b() ** 2));
      expect(hyp()).toBe(5);
    });
  });

  describe('effect()', () => {
    it('runs once immediately and on each change', () => {
      TestBed.runInInjectionContext(() => {
        const counter = signal(0);
        const calls: number[] = [];

        TestBed.runInInjectionContext(() => {
          effect(() => { calls.push(counter()); });
        });

        TestBed.flushEffects();
        expect(calls).toEqual([0]);

        counter.set(1);
        TestBed.flushEffects();
        expect(calls).toEqual([0, 1]);

        counter.set(5);
        TestBed.flushEffects();
        expect(calls).toEqual([0, 1, 5]);
      });
    });
  });
});

describe('Signal patterns', () => {
  it('grade() pattern — derived from score signal', () => {
    const score = signal(0);
    const grade = computed(() => {
      const s = score();
      if (s >= 90) return 'A';
      if (s >= 80) return 'B';
      if (s >= 70) return 'C';
      return 'D';
    });

    expect(grade()).toBe('D');
    score.set(75);
    expect(grade()).toBe('C');
    score.set(85);
    expect(grade()).toBe('B');
    score.set(95);
    expect(grade()).toBe('A');
  });

  it('toggle signal pattern', () => {
    const open = signal(false);
    const toggle = () => open.update(v => !v);

    expect(open()).toBe(false);
    toggle();
    expect(open()).toBe(true);
    toggle();
    expect(open()).toBe(false);
  });

  it('list signal: add, remove, filter', () => {
    const items = signal<string[]>([]);

    items.update(list => [...list, 'Angular']);
    items.update(list => [...list, 'React']);
    items.update(list => [...list, 'Vue']);
    expect(items()).toHaveLength(3);

    items.update(list => list.filter(i => i !== 'React'));
    expect(items()).toEqual(['Angular', 'Vue']);
  });
});
