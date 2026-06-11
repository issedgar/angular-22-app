import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { PokemonService } from './pokemon.service';

describe('PokemonService', () => {
  let svc: PokemonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    svc = TestBed.inject(PokemonService);
  });

  describe('listUrl', () => {
    it('builds URL with correct limit and offset', () => {
      expect(svc.listUrl(20, 0)).toBe('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
      expect(svc.listUrl(20, 40)).toBe('https://pokeapi.co/api/v2/pokemon?limit=20&offset=40');
    });
  });

  describe('detailUrl', () => {
    it('lowercases the name', () => {
      expect(svc.detailUrl('Pikachu')).toBe('https://pokeapi.co/api/v2/pokemon/pikachu');
    });

    it('trims whitespace', () => {
      expect(svc.detailUrl('  bulbasaur  ')).toBe('https://pokeapi.co/api/v2/pokemon/bulbasaur');
    });

    it('handles all-caps input', () => {
      expect(svc.detailUrl('CHARMANDER')).toBe('https://pokeapi.co/api/v2/pokemon/charmander');
    });
  });

  describe('typeColor', () => {
    it('returns known type colors', () => {
      expect(svc.typeColor('fire')).toBe('#F08030');
      expect(svc.typeColor('water')).toBe('#6890F0');
      expect(svc.typeColor('grass')).toBe('#78C850');
    });

    it('falls back to gray for unknown types', () => {
      expect(svc.typeColor('unknown')).toBe('#6b7280');
      expect(svc.typeColor('')).toBe('#6b7280');
    });
  });

  describe('statLabel', () => {
    it('returns abbreviated stat labels', () => {
      expect(svc.statLabel('hp')).toBe('HP');
      expect(svc.statLabel('attack')).toBe('ATK');
      expect(svc.statLabel('special-attack')).toBe('SpA');
      expect(svc.statLabel('speed')).toBe('SPE');
    });

    it('returns stat name itself for unknown stats', () => {
      expect(svc.statLabel('unknown-stat')).toBe('unknown-stat');
    });
  });

  describe('statPercent', () => {
    it('returns 100 for max HP (255)', () => {
      expect(svc.statPercent(255, 'hp')).toBe(100);
    });

    it('calculates correct percentage', () => {
      expect(svc.statPercent(100, 'hp')).toBe(39); // 100/255 ≈ 39%
    });

    it('caps at 100 for values above max', () => {
      expect(svc.statPercent(300, 'hp')).toBe(100);
    });
  });

  describe('extractId', () => {
    it('extracts numeric ID from PokeAPI URL', () => {
      expect(svc.extractId('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
      expect(svc.extractId('https://pokeapi.co/api/v2/pokemon/1/')).toBe(1);
    });

    it('returns 0 for malformed URL', () => {
      expect(svc.extractId('https://example.com/')).toBe(0);
    });
  });

  describe('capitalize', () => {
    it('capitalizes first letter of each word', () => {
      expect(svc.capitalize('pikachu')).toBe('Pikachu');
    });

    it('replaces hyphens with spaces and capitalizes', () => {
      expect(svc.capitalize('mr-mime')).toBe('Mr Mime');
    });
  });
});
