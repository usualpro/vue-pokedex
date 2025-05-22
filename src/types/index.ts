export type BasePokemonType = {
  name: string;
  url: string;
  infos: FetchPokemonDetailType;
};

export type FetchPokemonListType = {
  pokemon_species: BasePokemonType[];
};

export type FetchPokemonDetailType = {
  types: [
    {
      slot: number;
      type: {
        name: string;
        url: string;
      };
    }
  ];
  abilities: { ability: { name: string } }[];
  sprites: {
    front_default: string;
  };
  id: number;
  height: number;
  weight: number;
};

export type PokemonStoreType = {
  currentPage: number;
  rowsPerPage: number;
  cumulatedWeight: number;
} & FetchPokemonListType;
