<template>
  <!-- DataTable for displaying Pokemon with filtering and pagination -->
  <DataTable scrollable :scrollHeight="pokemonTableScrollHeight" filterDisplay="row" v-model:filters="filters"
    :value="pokemonSpecies" :loading="loading" paginator :rows="10" @page="handlePageChange"
    @value-change="updateCumulatedWeight" @rowSelect="onRowSelect" selectionMode="single"
    :rowsPerPageOptions="[10, 20, 50, 100, pokemonSpecies.length]">

    <!-- Empty state message -->
    <template #empty>No pokemon found.</template>

    <!-- Loading state message -->
    <template #loading>Loading pokemon. Please wait.</template>

    <template #header>
      <div class="flex gap-2 items-center justify-center" v-if="generations.length">
        <h1 class="text-center whitespace-nowrap" data-testid="appTitle">Pokemons of the</h1>
        <Select v-model="selectedGeneration" @change="handleGenerationChange" :options="generations" optionLabel="name"
          placeholder="Select a generation" />
      </div>
    </template>

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
          <Tag v-for="type in data.types" :key="type" :value="type"
            :style="`--p-tag-primary-background: ${getPokemonTypeColor(type).backgroundColor}; --p-tag-primary-color:${getPokemonTypeColor(type).color};`" />
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
          <Tag
            :style="`--p-tag-primary-background: ${getAbilityColor(ability.ability.name).backgroundColor}; --p-tag-primary-color:${getPokemonTypeColor(ability.ability.name).color};`"
            v-for="ability in slotProps.data.infos.abilities" :key="ability.ability.name"
            :value="ability.ability.name" />
        </div>
      </template>
    </Column>

    <!-- Column: Pokemon Height -->
    <Column header="Height (m)" field="infos.height" sortable>
      <template #body="slotProps">
        <span v-if="slotProps.data.infos">{{ slotProps.data.infos.height / 10 }}</span>
      </template>
    </Column>

    <!-- Column: Pokemon Weight -->
    <Column header="Weight (kg)" field="infos.weight" sortable>
      <template #body="slotProps">
        <span v-if="slotProps.data.infos">{{ slotProps.data.infos.weight }}</span>
      </template>
    </Column>

    <!-- Footer: Display cumulative weight -->
    <template #footer>Total weight of Pokemon displayed: {{ cumulatedWeight }}kg </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { storeToRefs } from "pinia"
import Column from "primevue/column"
import Select, { type SelectChangeEvent } from 'primevue/select';
import DataTable, { type DataTablePageEvent } from "primevue/datatable"
import { FilterMatchMode } from "@primevue/core/api"
import Tag from "primevue/tag"
import InputText from "primevue/inputtext"
import MultiSelect from "primevue/multiselect"
import { useRouter } from 'vue-router'
import { getPokemonTypeColor, getAbilityColor } from "../utils/"
import { usePokemonStore } from "../stores/pokemon.ts"
import type { BasePokemonType } from "../types/index.ts"

// Initialize the Pokemon store and extract reactive references
const pokemonStore = usePokemonStore()
const {
  pokemon_species: pokemonSpecies,
  selectedGeneration,
  cumulatedWeight,
  pokemonTypes,
  generations,
} = storeToRefs(pokemonStore)

const { fetchPokemonList, fetchGenerations, setPage, setCumulatedWeight, setSelectedGeneration } = pokemonStore

// Define filters for the DataTable with initial values
const filters = ref({
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  types: { value: null, matchMode: FilterMatchMode.CONTAINS },
  abilities: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

// Track loading state for the Pokemon data
const loading = ref(false)

//@todo retrieve the current height of the requested dom elements
const pokemonTableScrollHeight = `calc(100vh - ${(49 + 58 + 67) / 16}rem)` //footerHeight + paginatorHeight + filterHeight

// Handle pagination changes
const handlePageChange = (event: DataTablePageEvent) => setPage(event.page, event.rows)

// Update cumulative weight when the displayed Pokemon change
const updateCumulatedWeight = (value: BasePokemonType[]) => setCumulatedWeight(value)

// Router instance for navigation
const router = useRouter()

// Handle row selection and redirect to Pokemon detail page
const onRowSelect = (row: { data: { name: string } }) => router.push({ name: "PokemonDetail", params: { name: row.data.name } })

const handleGenerationChange = async (generation: SelectChangeEvent) => {
  loading.value = true
  setSelectedGeneration(generation.value)
  try {
    await fetchPokemonList()
    loading.value = false
  } catch (error) {
    console.error("Failed to fetch Pokémon list:", error);
    loading.value = false
  }
}

const handleOnMounted = async () => {
  loading.value = true
  try {
    const generations = await fetchGenerations()
    setSelectedGeneration(generations[0])
    await fetchPokemonList()
    loading.value = false
  } catch (error) {
    console.error("Failed to fetch Pokémon list:", error);
    loading.value = false
  }

}

// Fetch Pokemon data on component mount
onMounted(handleOnMounted)  
</script>