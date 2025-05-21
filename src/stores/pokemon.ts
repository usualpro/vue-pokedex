import { defineStore } from "pinia";
import { alovaInstance } from "../services";

type PokemonCallResultType = {
  pokemon_species: {
    name: string;
    url: string;
  }[];
};

type PokemonStoreType = {
  limit: number;
  page: number;
} & PokemonCallResultType;

export const usePokemonStore = defineStore("pokemon", {
  state: (): PokemonStoreType => ({ pokemon_species: [], limit: 5, page: 0 }),
  getters: {
    displayedPokemonSpecies: (state) => {
      const start = state.page * state.limit;
      const end = start + state.limit;
      return state.pokemon_species.slice(start, end);
    },
    totalPages: (state) =>
      Math.ceil(state.pokemon_species.length / state.limit),
  },
  actions: {
    async fetchPokemonList() {
      try {
        const { pokemon_species } =
          await alovaInstance.Get<PokemonCallResultType>(`/generation/1`);
        this.pokemon_species = [...pokemon_species];
      } catch (err) {
        throw new Error(`${err}`);
      }
    },
    setPage(page: number) {
      this.page = page;
    },
  },
});
