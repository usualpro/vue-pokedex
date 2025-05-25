<template>
    <template v-if="!loading">
        <Card class="max-w-md overflow-hidden m-auto">
            <template #header>
                <img :alt="results.name" class="m-auto" :src="results.infos.sprites.front_default" />
            </template>
            <template #title>{{ results.name }} #{{ results.infos.id }}</template>
            <template #subtitle>
                <p class="m-0">
                    <span class="font-semibold">Height: </span>{{ results.infos.height / 10 }} m, <span
                        class="font-semibold">Weight: </span>{{ results.infos.weight }} kg
                </p>

            </template>
            <template #content>
                <p>
                    <span class="font-semibold">Type(s): </span>

                    <Badge
                        :style="`--p-badge-primary-background: ${getPokemonTypeColor(type).backgroundColor}; --p-badge-primary-color:${getPokemonTypeColor(type).color};`"
                        :value="type" class="mr-2" v-for="(type, index) in results.types" :key="index" />
                </p>
                <p>
                    <span class="font-semibold">Abilities: </span>
                    <Badge :value="ability.ability.name" class="mr-2"
                        :style="`--p-badge-primary-background: ${getAbilityColor(ability.ability.name).backgroundColor}; --p-badge-primary-color:${getPokemonTypeColor(ability.ability.name).color};`"
                        v-for="(ability, index) in results.infos.abilities" :key="index" />

                </p>
            </template>
            <template #footer>
                <div class="flex gap-4 mt-1">
                    <Button :onClick="handleBack" label="Back to list" class="w-full" />
                </div>
            </template>
        </Card>
    </template>
    <template v-else>
        <Card class="max-w-md overflow-hidden m-auto">
            <template #header>
                <div class="m-auto">
                    <Skeleton shape="circle" size="5rem" class="m-auto"></Skeleton>
                </div>
            </template>
            <template #title>
                <Skeleton class="mb-2"></Skeleton>
            </template>
            <template #subtitle>
                <Skeleton class="mb-2"></Skeleton>
            </template>
            <Skeleton class="mb-2"></Skeleton>
            <template #content>
                <p class="m-0">
                    <Skeleton class="mb-2"></Skeleton>
                </p>
                <p class="m-0">
                    <Skeleton class="mb-2"></Skeleton>
                </p>
                <p>
                    <Skeleton class="mb-2"></Skeleton>
                </p>
            </template>
            <template #footer>
                <Skeleton class="mb-2"></Skeleton>
            </template>
        </Card>
    </template>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Button from "primevue/button"
import Card from 'primevue/card';
import Badge from "primevue/badge"
import Skeleton from "primevue/skeleton"
import { useRouter } from 'vue-router'
import { usePokemonStore } from "../stores/pokemon.ts"
import { getPokemonTypeColor, getAbilityColor } from "../utils/"
import type { BasePokemonType } from '../types/index.ts';

const props = defineProps<{ pokemonName: string | string[] }>()

// Router instance for navigation
const router = useRouter();

const pokemonStore = usePokemonStore()

const loading = ref(false);

const results = ref<BasePokemonType>({
    name: '',
    infos: {
        abilities: [],
        sprites: {
            front_default: ''
        },
        id: 0,
        height: 0,
        weight: 0
    },
    types: []
})

const handleBack = () => router.push({ name: "Home" });

const {
    pokemon_species
} = storeToRefs(pokemonStore)

const {
    fetchPokemonDetail,
} = pokemonStore

const handleOnMounted = async () => {
    loading.value = true
    try {
        await fetchPokemonDetail(props.pokemonName as string)
        const selectedPokemon = pokemon_species.value.find((pokemon) => pokemon.name === props.pokemonName)
        if (selectedPokemon)
            results.value = selectedPokemon
        loading.value = false
    } catch (error) {
        loading.value = false
        handleBack()
    }
}

// Fetch Pokemon data on component mount
onMounted(handleOnMounted);

</script>
