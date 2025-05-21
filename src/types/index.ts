type BasePokemonType = {
  name: string;
  url: string;
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

export type PokemonsDetailsCollectionType = {
  [key: string]: FetchPokemonDetailType;
};

export type PokemonStoreType = {
  limit: number;
  page: number;
  detailsCollection: PokemonsDetailsCollectionType;
} & FetchPokemonListType;
