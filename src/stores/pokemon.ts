import { defineStore } from "pinia";
import { alovaInstance } from "../services";
import type {
  BasePokemonType,
  FetchPokemonDetailType,
  FetchPokemonListType,
  PokemonStoreType,
} from "../types";
import { arrayRange } from "../utils";

// Define the Pokemon store
export const usePokemonStore = defineStore("pokemon", {
  // Initialize the state
  state: (): PokemonStoreType => ({
    pokemon_species: [],
    currentPage: 0,
    rowsPerPage: 5,
    cumulatedWeight: 0,
  }),

  // Computed properties for derived state
  getters: {
    // Extract unique Pokemon types from all species
    pokemonTypes: (state): string[] => {
      if (state.pokemon_species.every((pokemon) => pokemon.infos)) {
        const types = state.pokemon_species.flatMap((pokemon) => pokemon.types);
        return [...new Set(types)];
      }
      return [];
    },

    // Calculate the total number of pages based on rows per page
    totalPages: (state): number =>
      Math.ceil(state.pokemon_species.length / state.rowsPerPage),
  },

  // Actions for state manipulation and async operations
  actions: {
    // Calculate and update the cumulative weight of displayed Pokemon
    setCumulatedWeight(pokemonSpecies: BasePokemonType[]): void {
      const weights = arrayRange({
        page: this.currentPage,
        limit: this.rowsPerPage,
        dataToDisplay: pokemonSpecies,
      }).map((pokemon) => pokemon.infos?.weight ?? 0);

      this.cumulatedWeight = weights.reduce((sum, weight) => sum + weight, 0);
    },

    // Update the current page and rows per page with boundary checks
    setPage(page: number, rows: number): void {
      if (page >= 0 && page < this.totalPages && rows > 0) {
        this.currentPage = page;
        this.rowsPerPage = rows;
      }
    },

    // Fetch detailed information for a single Pokemon by name
    async fetchPokemonDetail(pokemonName: string): Promise<void> {
      try {
        const { types, id, height, weight, sprites, abilities } =
          await alovaInstance.Get<FetchPokemonDetailType>(
            `/pokemon/${pokemonName}`
          );

        const index = this.pokemon_species.findIndex(
          (p) => p.name === pokemonName
        );
        if (index !== -1) {
          this.pokemon_species[index] = {
            ...this.pokemon_species[index],
            types: types.map((t) => t.type.name),
            infos: { id, height, weight, sprites, abilities },
          };
        }
      } catch (error) {
        throw new Error(`Failed to fetch details for ${pokemonName}: ${error}`);
      }
    },

    // Fetch details for all Pokemon in the current species list
    async fetchPageDetails(): Promise<void> {
      const promises = this.pokemon_species.map((pokemon) =>
        this.fetchPokemonDetail(pokemon.name)
      );
      await Promise.all(promises);
    },

    // Fetch the initial Pokemon list and their details
    async fetchPokemonList(): Promise<void> {
      try {
        const { pokemon_species } =
          await alovaInstance.Get<FetchPokemonListType>("/generation/1");

        this.pokemon_species = [...pokemon_species];
        await this.fetchPageDetails();
        this.setCumulatedWeight(this.pokemon_species);
      } catch (error) {
        throw new Error(`Failed to fetch Pokemon list: ${error}`);
      }
    },
  },
});
