<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePokemonStore } from "../stores/pokemon.ts"

defineProps<{ msg: string }>()


const pokemonStore = usePokemonStore()

const { pokemon_species, displayedPokemonSpecies, totalPages, page } = storeToRefs(pokemonStore)

const { fetchPokemonList, setPage } = pokemonStore

onMounted(() => {
  fetchPokemonList()
});

</script>

<template>
  <h1>{{ msg }}</h1>
  <h2>{{ totalPages }} pages</h2>
  <h2>current page: {{ page }} </h2>
  <pre>{{ JSON.stringify(displayedPokemonSpecies, null, 2) }}</pre>
  <button @click="setPage(page - 1)">PrevPage</button> <button @click="setPage(page + 1)">NextPage</button>
</template>

<style scoped></style>
