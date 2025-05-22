<script setup lang="ts">
import PokemonDescription from '../components/PokemonDescription.vue'
</script>

<template>
    <PokemonDescription :pokemonName="$route.params.name" />
</template>

<style scoped></style>
