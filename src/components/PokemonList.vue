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
} = storeToRefs(pokemonStore)

const {
  fetchPokemonList,
  setPage,
  setCumulatedWeight
} = pokemonStore

const filters = ref({
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});
const representatives = ref([
  { name: 'Amy Elsner', image: 'amyelsner.png' },
  { name: 'Anna Fali', image: 'annafali.png' },
  { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
  { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
  { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
  { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
  { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
  { name: 'Onyama Limba', image: 'onyamalimba.png' },
  { name: 'Stephen Shaw', image: 'stephenshaw.png' },
  { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);

const handlePageChange = (event) => setPage(event.page, event.rows)

const onValueChange = (value) => setCumulatedWeight(value)
const loading = ref(true);
onMounted(() => {
  fetchPokemonList()
  loading.value = false;
});
</script>

<template>
  <div class="card">
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
        <Column header="Types">
          <template #body="slotProps">
            <div v-if="slotProps.data.infos" class="flex flex-row gap-2">
              <Tag v-for="type in slotProps.data.infos.types" :key="type.type.name" :value="type.type.name" />
            </div>
          </template>
          <!--template #filter="{ filterModel, filterCallback }">
            <MultiSelect v-model="filterModel.value" @change="filterCallback()" :options="representatives"
              optionLabel="name" placeholder="Any" style="min-width: 14rem" :maxSelectedLabels="1">
              <template #option="slotProps">
                <div class="flex items-center gap-2">
                  <img :alt="slotProps.option.name"
                    :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.option.image}`"
                    style="width: 32px" />
                  <span>{{ slotProps.option.name }}</span>
                </div>
              </template>
            </MultiSelect>
          </template-->
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
</template>


<style scoped></style>