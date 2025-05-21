import { defineStore } from "pinia";
import { alovaInstance } from "../services";
import type {
  FetchPokemonDetailType,
  FetchPokemonListType,
  PokemonStoreType,
} from "../types";
import { arrayRange } from "../utils";

export const usePokemonStore = defineStore("pokemon", {
  state: (): PokemonStoreType => ({
    pokemon_species: [],
    limit: 5,
    page: 0,
    detailsCollection: {},
  }),
  getters: {
    displayedPokemonSpecies: (state) =>
      arrayRange({
        page: state.page,
        limit: state.limit,
        dataToDisplay: state.pokemon_species,
      }),
    cumulatedWeight: (state): number => {
      const displayedPokemonSpecies = arrayRange({
        page: state.page,
        limit: state.limit,
        dataToDisplay: state.pokemon_species,
      });

      const displayedPokemonNames = displayedPokemonSpecies.map(
        (pokemon) => pokemon.name
      );

      const allDisplayedWeight = displayedPokemonNames.map((pokemonName) => {
        if (!state.detailsCollection[pokemonName]) return 0;
        return state.detailsCollection[pokemonName].weight;
      });

      const totalWeight = allDisplayedWeight.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );

      return totalWeight;
    },
    totalPages: (state): number =>
      Math.ceil(state.pokemon_species.length / state.limit),
  },
  actions: {
    async fetchPokemonList(): Promise<void> {
      try {
        const { pokemon_species } =
          await alovaInstance.Get<FetchPokemonListType>(`/generation/1`);
        this.pokemon_species = [...pokemon_species];
        await this.fetchPageDetails();
      } catch (err) {
        throw new Error(`${err}`);
      }
    },
    async fetchPokemonDetail(pokemonName: string): Promise<void> {
      try {
        const { types, id, height, weight, sprites, abilities } =
          await alovaInstance.Get<FetchPokemonDetailType>(
            `/pokemon/${pokemonName}`
          );
        this.detailsCollection[pokemonName] = {
          types,
          id,
          height,
          weight,
          sprites,
          abilities,
        };
      } catch (err) {
        throw new Error(`${err}`);
      }
    },
    async fetchPageDetails(): Promise<void> {
      const promises = this.displayedPokemonSpecies.map(
        (pokemon: { name: string }) =>
          !this.detailsCollection[pokemon.name]
            ? this.fetchPokemonDetail(pokemon.name)
            : Promise.resolve()
      );
      await Promise.all(promises);
    },
    async setPage(page: number): Promise<void> {
      if (page >= 0 && page < this.totalPages) {
        this.page = page;
        return await this.fetchPageDetails();
      }
    },
  },
});
