export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonStat {
  base_stat: number;
  stat: { name: string };
}

export interface PokemonType {
  type: { name: string };
}

export interface PokemonAbility {
  ability: { name: string; url: string };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonMove {
  move: { name: string; url: string };
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  sprites: {
    other: {
      'official-artwork': {
        front_default: string | null;
      };
    };
  };
}
