<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import Button from "primevue/button"
import { RouterLink } from "vue-router";

import { usePokemonStore } from "../stores/pokemon.ts"


const props = defineProps<{ pokemonName: string }>()

const pokemonStore = usePokemonStore()

const {
    detailsCollection,
} = storeToRefs(pokemonStore)

const {
    fetchPokemonDetail,
} = pokemonStore

onMounted(() => {
    fetchPokemonDetail(props.pokemonName)
});

</script>

<template>
    <h1>Pokemon: {{ pokemonName }}</h1>
    <RouterLink to="/">Home</RouterLink>
    <pre>{{ JSON.stringify(detailsCollection[pokemonName], null, 2) }}</pre>
</template>

<style scoped></style>
