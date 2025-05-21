<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePokemonStore } from "../stores/pokemon.ts"
import Button from "primevue/button"


defineProps<{ msg: string }>()


const pokemonStore = usePokemonStore()

const {
  displayedPokemonSpecies,
  totalPages,
  page,
  detailsCollection,
  cumulatedWeight
} = storeToRefs(pokemonStore)

const {
  fetchPokemonList,
  fetchPokemonDetail,
  fetchPageDetails,
  setPage
} = pokemonStore

onMounted(() => {
  fetchPokemonList()
});

</script>

<template>
  <h1>{{ msg }}</h1>
  <h2>{{ totalPages }} pages</h2>
  <h2>current page: {{ page }} </h2>

  cumulatedWeight:{{ cumulatedWeight }}

  <ul id="list">
    <li v-for="pokemon in displayedPokemonSpecies" :key="pokemon.name">
      <button @click="fetchPokemonDetail(pokemon.name)">{{ pokemon.name }}</button>
      <template v-if="detailsCollection[pokemon.name]">
        <div>id: {{ detailsCollection[pokemon.name].id }}</div>
        <div>types:
          <div>
            <pre>{{ JSON.stringify(detailsCollection[pokemon.name].types), null, 2 }}</pre>
          </div>
          <div>
            height: {{ detailsCollection[pokemon.name].height }}
          </div>
          <div>
            weight: {{ detailsCollection[pokemon.name].weight }}
          </div>
          <img :src="detailsCollection[pokemon.name].sprites.front_default" />
          abilities:
          <div>
            <pre>{{ JSON.stringify(detailsCollection[pokemon.name].abilities), null, 2 }}</pre>
          </div>
        </div>
      </template>
    </li>
  </ul>
  <Button :disabled="page === 0" @click="setPage(page - 1)">PrevPage</Button>
  <Button :disabled="page === totalPages - 1" @click="setPage(page + 1)">NextPage</Button>
</template>

<style scoped></style>
