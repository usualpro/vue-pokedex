import { defineStore } from "pinia";
import { alovaInstance } from "../services";
import type {
  BasePokemonType,
  FetchPokemonDetailType,
  FetchPokemonListType,
  PokemonStoreType,
} from "../types";
import { arrayRange } from "../utils";

export const usePokemonStore = defineStore("pokemon", {
  state: (): PokemonStoreType => ({
    pokemon_species: [],
    currentPage: 0,
    rowsPerPage: 5,
    cumulatedWeight: 0,
  }),
  getters: {
    totalPages: (state): number =>
      Math.ceil(state.pokemon_species.length / state.rowsPerPage),
  },
  actions: {
    setCumulatedWeight(pokemonSpecies: BasePokemonType[]): number {
      const allDisplayedWeight = arrayRange({
        page: this.currentPage,
        limit: this.rowsPerPage,
        dataToDisplay: pokemonSpecies,
      }).map((pokemon) => {
        const pokemonInfos = pokemon.infos;
        if (!pokemonInfos) return 0;
        return pokemonInfos.weight;
      });
      const totalWeight = allDisplayedWeight.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      this.cumulatedWeight = totalWeight;
      return totalWeight;
    },
    setPage(page: number, rows: number): void {
      if (page >= 0 && page < this.totalPages) {
        this.currentPage = page;
        this.rowsPerPage = rows;
      }
    },
    async fetchPokemonDetail(pokemonName: string): Promise<void> {
      try {
        const { types, id, height, weight, sprites, abilities } =
          await alovaInstance.Get<FetchPokemonDetailType>(
            `/pokemon/${pokemonName}`
          );
        const t = this.pokemon_species.findIndex((e) => e.name === pokemonName);
        this.pokemon_species[t].infos = {
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
      const promises = this.pokemon_species.map((pokemon: { name: string }) =>
        this.fetchPokemonDetail(pokemon.name)
      );
      await Promise.all(promises);
    },
    async fetchPokemonList(): Promise<void> {
      try {
        const { pokemon_species } =
          await alovaInstance.Get<FetchPokemonListType>(`/generation/1`);
        this.pokemon_species = [...pokemon_species];
        await this.fetchPageDetails();
        this.setCumulatedWeight(this.pokemon_species);
      } catch (err) {
        throw new Error(`${err}`);
      }
    },
  },
});
