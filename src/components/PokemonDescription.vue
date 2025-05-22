<template>
    <RouterLink to="/">Home</RouterLink>
    <template v-if="detailsCollection[pokemonName]">
        <h1>Pokemon: {{ pokemonName }}</h1>
        <pre>{{ JSON.stringify(detailsCollection[pokemonName], null, 2) }}</pre>
    </template>
</template>

<style scoped></style>

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
    pokemon_species
} = storeToRefs(pokemonStore)

const {
    fetchPokemonDetail,
} = pokemonStore

onMounted(() => {
    //console.log(detailsCollection[props.pokemonName])
    fetchPokemonDetail(props.pokemonName)
});

</script>
