<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import Button from "primevue/button"
import DataView from 'primevue/dataview';
import Skeleton from 'primevue/skeleton';
import Column from 'primevue/Column'
import DataTable from 'primevue/dataTable'
import { FilterMatchMode } from '@primevue/core/api';

import Tag from 'primevue/tag';
import InputText from 'primevue/inputText';
import MultiSelect from 'primevue/multiSelect'

import { RouterLink } from "vue-router";

import PokemonListItem from './PokemonListItem.vue'
import { usePokemonStore } from "../stores/pokemon.ts"



defineProps<{ msg: string }>()


const pokemonStore = usePokemonStore()

const {
  pokemon_species,
  page,
  cumulatedWeight,
  pokemonTypes
} = storeToRefs(pokemonStore)

const {
  fetchPokemonList,
  setPage,
  setCumulatedWeight
} = pokemonStore

const filters = ref({
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  "infos.types": { value: null, matchMode: FilterMatchMode.IN },
});


const handlePageChange = (event) => setPage(event.page, event.rows)

const onValueChange = (value) => setCumulatedWeight(value)

const loading = ref(true);

onMounted(() => {
  fetchPokemonList().then(() => {
    loading.value = false;
  })
});
</script>

<template>
  <div class="card" v-if="loading === false">
    <DataTable filterDisplay="row" v-model:filters="filters" :value="pokemon_species" paginator :rows="5"
      @page="handlePageChange" @value-change="onValueChange"
      :rowsPerPageOptions="[5, 10, 20, 50, 100, pokemon_species.length]">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl font-bold">cumulatedWeight: {{ cumulatedWeight }}kg</span>
        </div>
      </template>
      <template #empty>No pokemon found.</template>
      <template #loading>Loading pokemon. Please wait. </template>

      <template>
        <Column header="ID" sortable field="infos.id">
          <template #body="slotProps">
            <p v-if="slotProps.data.infos">
              {{ slotProps.data.infos.id }}
            </p>
          </template>
        </Column>
        <Column field="name" header="Name" sortable>
          <template #body="{ data }">
            {{ data.name }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" placeholder="Search by name" @input="filterCallback()" />
          </template>
        </Column>
        <Column header="Image">
          <template #body="slotProps">
            <img v-if="slotProps.data.infos" :src="`${slotProps.data.infos.sprites.front_default}`"
              :alt="slotProps.data.name" class="w-24 rounded" />
          </template>
        </Column>
        <Column header="Types" field="infos.types" filterField="infos.types">
          <template #body="slotProps">
            <div v-if="slotProps.data.infos" class="flex flex-row gap-2">
              <Tag v-for="type in slotProps.data.infos.types" :key="type.type.name" :value="type.type.name" />
            </div>
          </template>
          <template #filter="{ filterModel, filterCallback }" v-if="pokemonTypes.length">
            <MultiSelect v-model="filterModel.value" :options="pokemonTypes" @change="filterCallback()"
              :maxSelectedLabels="1">
              <template #option="slotProps">
                <div class="flex items-center gap-2">
                  <span>{{ slotProps.option }}</span>
                </div>
              </template>
            </MultiSelect>
          </template>
        </Column>
        <Column header="Abilities">
          <template #body="slotProps">
            <div v-if="slotProps.data.infos" class="flex flex-row gap-2">
              <Tag v-for="ability in slotProps.data.infos.abilities" :key="ability.ability.name"
                :value="ability.ability.name" />
            </div>
          </template>
        </Column>
        <Column header="Height" field="infos.height" sortable>
          <template #body="slotProps">
            <p v-if="slotProps.data.infos">
              {{ slotProps.data.infos.height }}
            </p>
          </template>
        </Column>

        <Column header="Weight" field="infos.weight" sortable>
          <template #body="slotProps">
            <p v-if="slotProps.data.infos">
              {{ slotProps.data.infos.weight }}
            </p>
          </template>
        </Column>
      </template>


      <template #footer> In total there are {{ pokemon_species.length }} pokemon. </template>


      <!--Column field="category" header="Category"></Column>
      <Column field="rating" header="Reviews">
        <template #body="slotProps">
          <Rating :modelValue="slotProps.data.rating" readonly />
        </template>
      </Column>
      <Column header="Status">
        <template #body="slotProps">
          <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data)" />
        </template>
      </Column>
      <template #footer> In total there are {{ products ? products.length : 0 }} products. </template-->


    </DataTable>
  </div>
  <div v-else>
    loading
  </div>
</template>


<style scoped></style>