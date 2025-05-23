<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import Button from "primevue/button";
import DataView from "primevue/dataview";
import Skeleton from "primevue/skeleton";
import Column from "primevue/Column";
import DataTable from "primevue/dataTable";
import { FilterMatchMode } from "@primevue/core/api";
import Tag from "primevue/tag";
import InputText from "primevue/inputText";
import MultiSelect from "primevue/multiSelect";
import { RouterLink } from "vue-router";
import PokemonListItem from "./PokemonListItem.vue";
import { usePokemonStore } from "../stores/pokemon.ts";

// Define component props with TypeScript
defineProps<{ msg: string }>();

// Initialize the Pokemon store and extract reactive references
const pokemonStore = usePokemonStore();
const {
  pokemon_species: pokemonSpecies,
  page,
  cumulatedWeight,
  pokemonTypes,
} = storeToRefs(pokemonStore);
const { fetchPokemonList, setPage, setCumulatedWeight } = pokemonStore;

// Define filters for the DataTable with initial values
const filters = ref({
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  types: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Track loading state for the Pokémon data
const loading = ref(true);

// Handle pagination changes
const handlePageChange = (event) => setPage(event.page, event.rows);

// Update cumulative weight when the displayed Pokemon change
const updateCumulatedWeight = (value) => setCumulatedWeight(value);

// Fetch Pokemon data on component mount
onMounted(async () => {
  await fetchPokemonList();
  loading.value = false;
});
</script>
<template>
  <div class="card p-4 bg-white">
    <!-- DataTable for displaying Pokemon with filtering and pagination -->
    <DataTable filterDisplay="row" v-model:filters="filters" :value="pokemonSpecies" paginator :rows="5"
      @page="handlePageChange" @value-change="updateCumulatedWeight" :loading="loading"
      :rowsPerPageOptions="[5, 10, 20, 50, 100, pokemonSpecies.length]">

      <!-- Empty state message -->
      <template #empty>No pokemon found.</template>

      <!-- Loading state message -->
      <template #loading>Loading pokemon. Please wait.</template>

      <!-- Column: Pokémon ID -->
      <Column header="ID" sortable field="infos.id">
        <template #body="slotProps">
          <p v-if="slotProps.data.infos">{{ slotProps.data.infos.id }}</p>
        </template>
      </Column>

      <!-- Column: Pokémon Name with Filter -->
      <Column field="name" header="Name" sortable>
        <template #body="{ data }">{{ data.name }}</template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" placeholder="Search by name" @input="filterCallback()" />
        </template>
      </Column>

      <!-- Column: Pokémon Image -->
      <Column header="Image">
        <template #body="slotProps">
          <img v-if="slotProps.data.infos" :src="`${slotProps.data.infos.sprites.front_default}`"
            :alt="slotProps.data.name" class="w-24 object-contain rounded" />
        </template>
      </Column>

      <!-- Column: Pokemon Types with Filter -->
      <Column header="Types" field="types" sortable>
        <template #body="{ data }">
          <div v-if="data.types" class="flex flex-row gap-2">
            <Tag v-for="type in data.types" :key="type" :value="type" />
          </div>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect v-model="filterModel.value" @change="filterCallback()" :options="pokemonTypes"
            placeholder="Select types" :maxSelectedLabels="1">
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>

      <!-- Column: Pokemon Abilities -->
      <Column header="Abilities">
        <template #body="slotProps">
          <div v-if="slotProps.data.infos" class="flex flex-row gap-2">
            <Tag v-for="ability in slotProps.data.infos.abilities" :key="ability.ability.name"
              :value="ability.ability.name" />
          </div>
        </template>
      </Column>

      <!-- Column: Pokemon Height -->
      <Column header="Height" field="infos.height" sortable>
        <template #body="slotProps">
          <span v-if="slotProps.data.infos">{{ slotProps.data.infos.height }}</span>
        </template>
      </Column>

      <!-- Column: Pokemon Weight -->
      <Column header="Weight" field="infos.weight" sortable>
        <template #body="slotProps">
          <span v-if="slotProps.data.infos">{{ slotProps.data.infos.weight }}</span>
        </template>
      </Column>

      <!-- Footer: Display cumulative weight -->
      <template #footer>cumulatedWeight: {{ cumulatedWeight }}kg </template>
    </DataTable>
  </div>
</template>

<style scoped></style>
