<template>
    <PokemonDescription :pokemonName="$route.params.name" />
</template>

<script setup lang="ts">
import PokemonDescription from '../components/PokemonDescription.vue'
</script>
