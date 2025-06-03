import { defineStore } from "pinia";
import { alovaInstance } from "../services";
import type {
  BasePokemonType,
  FetchPokemonDetailType,
  FetchPokemonGenerationType,
  FetchPokemonListType,
  PokemonStoreType,
} from "../types";
import { arrayRange } from "../utils";

// Define the Pokemon store
export const usePokemonStore = defineStore("pokemon", {
  // Initialize the state
  state: (): PokemonStoreType => ({
    pokemon_species: [],
    selectedGeneration: {
      name: "",
    },
    generations: [],
    currentPage: 0,
    rowsPerPage: 5,
    cumulatedWeight: 0,
  }),

  // Computed properties for derived state
  getters: {
    // Extract unique Pokemon types from all species
    pokemonTypes: (state): string[] => {
      const types = state.pokemon_species
        .filter((pokemon) => pokemon.types?.length > 0)
        .flatMap((pokemon) => pokemon.types);
      return [...new Set(types)].sort();
    },

    pokemonAbilities: (state): string[] => {
      if (state.pokemon_species.every((pokemon) => pokemon.infos)) {
        const types = state.pokemon_species.flatMap((pokemon) =>
          pokemon.infos.abilities.map((ability) => ability.ability.name)
        );
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

    setSelectedGeneration(generation: { name: string }) {
      this.selectedGeneration = generation;
    },
    
    async fetchGenerations() {
      try {
        const { results } = await alovaInstance.Get<FetchPokemonGenerationType>(
          `/generation/`
        );
        this.generations = results;
        return results;
      } catch (error) {
        throw new Error(`Failed to fetch details for generation: ${error}`);
      }
    },
    
    // Fetch detailed information for a single Pokemon by name
    async fetchPokemonDetail(pokemonName: string): Promise<void> {
      try {
        const { types, id, height, weight, sprites, abilities } =
          await alovaInstance.Get<FetchPokemonDetailType>(
            `/pokemon/${pokemonName}`
          );

        const infos = {
          id,
          height,
          weight,
          sprites,
          abilities,
        };

        const probableIndexOfThePokemon = this.pokemon_species.findIndex(
          (e) => e.name === pokemonName
        );

        if (probableIndexOfThePokemon === -1) {
          const newPokemonSpecies = {
            name: pokemonName,
            types: types.map((e) => e.type.name),
            infos,
          };
          this.pokemon_species.push(newPokemonSpecies);
        } else {
          this.pokemon_species[probableIndexOfThePokemon].types = types.map(
            (e) => e.type.name
          );
          this.pokemon_species[probableIndexOfThePokemon].infos = infos;
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
          await alovaInstance.Get<FetchPokemonListType>(
            `/generation/${this.selectedGeneration.name}`
          );
        this.pokemon_species = [...pokemon_species];
        await this.fetchPageDetails();
        this.setCumulatedWeight(this.pokemon_species);
      } catch (error) {
        throw new Error(`Failed to fetch Pokemon list: ${error}`);
      }
    },
  },
});
