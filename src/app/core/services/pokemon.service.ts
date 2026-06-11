import { Service, signal } from '@angular/core';

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  speed: 'SPE',
};

// Approximate stat maxima for bar scaling
const MAX_STATS: Record<string, number> = {
  hp: 255,
  attack: 181,
  defense: 230,
  'special-attack': 173,
  'special-defense': 230,
  speed: 180,
};

@Service()
export class PokemonService {
  private static readonly BASE = 'https://pokeapi.co/api/v2/pokemon';

  listUrl(limit: number, offset: number): string {
    return `${PokemonService.BASE}?limit=${limit}&offset=${offset}`;
  }

  detailUrl(name: string): string {
    return `${PokemonService.BASE}/${name.toLowerCase().trim()}`;
  }

  speciesUrl(name: string): string {
    return `https://pokeapi.co/api/v2/pokemon-species/${name.toLowerCase().trim()}`;
  }

  typeColor(typeName: string): string {
    return TYPE_COLORS[typeName] ?? '#6b7280';
  }

  statLabel(statName: string): string {
    return STAT_LABELS[statName] ?? statName;
  }

  statPercent(baseStat: number, statName: string): number {
    const max = MAX_STATS[statName] ?? 255;
    return Math.min(100, Math.round((baseStat / max) * 100));
  }

  statMax(statName: string): number {
    return MAX_STATS[statName] ?? 255;
  }

  extractId(url: string): number {
    const match = /\/pokemon\/(\d+)\/$/.exec(url);
    return match ? +match[1] : 0;
  }

  spriteUrl(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  artworkUrl(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }

  capitalize(name: string): string {
    return name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  readonly selectedName = signal<string | null>(null);

  setSelected(name: string): void {
    this.selectedName.set(name);
  }
}
