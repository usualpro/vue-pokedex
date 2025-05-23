import type { PokemonColorT } from "../types";

export const arrayRange = <T>({
  page,
  limit,
  dataToDisplay,
}: {
  page: number;
  limit: number;
  dataToDisplay: T[];
}): T[] => {
  const sortedItems = [...dataToDisplay];
  const start = page * limit;
  const end = start + limit;
  return sortedItems.slice(start, end);
};

export const getPokemonTypeColor = (type: string): PokemonColorT => {
  const colors = {
    grass: { backgroundColor: "#4ADE80", color: "#FFFFFF" }, // Plante
    poison: { backgroundColor: "#A78BFA", color: "#FFFFFF" }, // Poison
    fire: { backgroundColor: "#F97316", color: "#FFFFFF" }, // Feu
    water: { backgroundColor: "#3B82F6", color: "#FFFFFF" }, // Eau
    bug: { backgroundColor: "#A3E635", color: "#FFFFFF" }, // Insecte
    normal: { backgroundColor: "#D1D5DB", color: "#000000" }, // Normal
    flying: { backgroundColor: "#7DD3FC", color: "#FFFFFF" }, // Vol
    ground: { backgroundColor: "#CA8A04", color: "#FFFFFF" }, // Sol
    fighting: { backgroundColor: "#DC2626", color: "#FFFFFF" }, // Combat
    psychic: { backgroundColor: "#F472B6", color: "#FFFFFF" }, // Psy
    rock: { backgroundColor: "#92400E", color: "#FFFFFF" }, // Roche
    electric: { backgroundColor: "#FACC15", color: "#000000" }, // Électrique
    fairy: { backgroundColor: "#F9A8D4", color: "#FFFFFF" }, // Fée
    steel: { backgroundColor: "#9CA3AF", color: "#FFFFFF" }, // Acier
    ghost: { backgroundColor: "#7C3AED", color: "#FFFFFF" }, // Spectre
    ice: { backgroundColor: "#60A5FA", color: "#FFFFFF" }, // Glace
    dragon: { backgroundColor: "#4F46E5", color: "#FFFFFF" }, // Dragon
  } as const;
  return (
    colors[type as keyof typeof colors] || {
      backgroundColor: "#E5E7EB",
      color: "#000000",
    }
  );
};

export const getAbilityColor = (ability: string): PokemonColorT => {
  const colors = {
    overgrow: { backgroundColor: "#4ADE80", color: "#FFFFFF" },
    chlorophyll: { backgroundColor: "#A3E635", color: "#FFFFFF" },
    blaze: { backgroundColor: "#F97316", color: "#FFFFFF" },
    "solar-power": { backgroundColor: "#FACC15", color: "#000000" },
    torrent: { backgroundColor: "#3B82F6", color: "#FFFFFF" },
    "rain-dish": { backgroundColor: "#60A5FA", color: "#FFFFFF" },
    "shield-dust": { backgroundColor: "#D1D5DB", color: "#000000" },
    "run-away": { backgroundColor: "#FECACA", color: "#000000" },
    "keen-eye": { backgroundColor: "#7DD3FC", color: "#FFFFFF" },
    "tangled-feet": { backgroundColor: "#FCA5A5", color: "#FFFFFF" },
    "big-pecks": { backgroundColor: "#9CA3AF", color: "#FFFFFF" },
    guts: { backgroundColor: "#DC2626", color: "#FFFFFF" },
    hustle: { backgroundColor: "#EF4444", color: "#FFFFFF" },
    sniper: { backgroundColor: "#6B7280", color: "#FFFFFF" },
    intimidate: { backgroundColor: "#B91C1C", color: "#FFFFFF" },
    "shed-skin": { backgroundColor: "#A78BFA", color: "#FFFFFF" },
    unnerve: { backgroundColor: "#7C3AED", color: "#FFFFFF" },
    "sand-veil": { backgroundColor: "#CA8A04", color: "#FFFFFF" },
    "sand-rush": { backgroundColor: "#D97706", color: "#FFFFFF" },
    "poison-point": { backgroundColor: "#A78BFA", color: "#FFFFFF" },
    rivalry: { backgroundColor: "#F87171", color: "#FFFFFF" },
    "flash-fire": { backgroundColor: "#F97316", color: "#FFFFFF" },
    drought: { backgroundColor: "#FB923C", color: "#FFFFFF" },
    "inner-focus": { backgroundColor: "#F472B6", color: "#FFFFFF" },
    infiltrator: { backgroundColor: "#6D28D9", color: "#FFFFFF" },
    "effect-spore": { backgroundColor: "#4ADE80", color: "#FFFFFF" },
    "dry-skin": { backgroundColor: "#CA8A04", color: "#FFFFFF" },
    damp: { backgroundColor: "#3B82F6", color: "#FFFFFF" },
    "compound-eyes": { backgroundColor: "#A3E635", color: "#FFFFFF" },
    "tinted-lens": { backgroundColor: "#A3E635", color: "#FFFFFF" },
    "arena-trap": { backgroundColor: "#CA8A04", color: "#FFFFFF" },
    "sand-force": { backgroundColor: "#D97706", color: "#FFFFFF" },
    pickup: { backgroundColor: "#D1D5DB", color: "#000000" },
    technician: { backgroundColor: "#9CA3AF", color: "#FFFFFF" },
    "cloud-nine": { backgroundColor: "#7DD3FC", color: "#FFFFFF" },
    "swift-swim": { backgroundColor: "#3B82F6", color: "#FFFFFF" },
    "vital-spirit": { backgroundColor: "#EF4444", color: "#FFFFFF" },
    "anger-point": { backgroundColor: "#B91C1C", color: "#FFFFFF" },
    defiant: { backgroundColor: "#DC2626", color: "#FFFFFF" },
    justified: { backgroundColor: "#DC2626", color: "#FFFFFF" },
    "water-absorb": { backgroundColor: "#3B82F6", color: "#FFFFFF" },
    synchronize: { backgroundColor: "#F472B6", color: "#FFFFFF" },
    "magic-guard": { backgroundColor: "#F9A8D4", color: "#FFFFFF" },
    "no-guard": { backgroundColor: "#9CA3AF", color: "#FFFFFF" },
    steadfast: { backgroundColor: "#DC2626", color: "#FFFFFF" },
    gluttony: { backgroundColor: "#F97316", color: "#FFFFFF" },
    "clear-body": { backgroundColor: "#D1D5DB", color: "#000000" },
    "liquid-ooze": { backgroundColor: "#A78BFA", color: "#FFFFFF" },
    "rock-head": { backgroundColor: "#92400E", color: "#FFFFFF" },
    sturdy: { backgroundColor: "#92400E", color: "#FFFFFF" },
    swarm: { backgroundColor: "#A3E635", color: "#FFFFFF" },
    static: { backgroundColor: "#FACC15", color: "#000000" },
    "lightning-rod": { backgroundColor: "#FACC15", color: "#000000" },
    "sheer-force": { backgroundColor: "#DC2626", color: "#FFFFFF" },
    "cute-charm": { backgroundColor: "#F9A8D4", color: "#FFFFFF" },
    "friend-guard": { backgroundColor: "#F9A8D4", color: "#FFFFFF" },
    unaware: { backgroundColor: "#D1D5DB", color: "#000000" },
    competitive: { backgroundColor: "#EF4444", color: "#FFFFFF" },
    frisk: { backgroundColor: "#6B7280", color: "#FFFFFF" },
    stench: { backgroundColor: "#A78BFA", color: "#FFFFFF" },
    "wonder-skin": { backgroundColor: "#F9A8D4", color: "#FFFFFF" },
    limber: { backgroundColor: "#7DD3FC", color: "#FFFFFF" },
    "flame-body": { backgroundColor: "#F97316", color: "#FFFFFF" },
    oblivious: { backgroundColor: "#D1D5DB", color: "#000000" },
    "own-tempo": { backgroundColor: "#F472B6", color: "#FFFFFF" },
    regenerator: { backgroundColor: "#4ADE80", color: "#FFFFFF" },
    "magnet-pull": { backgroundColor: "#FACC15", color: "#000000" },
    analytic: { backgroundColor: "#6B7280", color: "#FFFFFF" },
    "early-bird": { backgroundColor: "#7DD3FC", color: "#FFFFFF" },
    "thick-fat": { backgroundColor: "#D1D5DB", color: "#000000" },
    hydration: { backgroundColor: "#3B82F6", color: "#FFFFFF" },
    "ice-body": { backgroundColor: "#60A5FA", color: "#FFFFFF" },
    "sticky-hold": { backgroundColor: "#A78BFA", color: "#FFFFFF" },
    "poison-touch": { backgroundColor: "#A78BFA", color: "#FFFFFF" },
    "shell-armor": { backgroundColor: "#92400E", color: "#FFFFFF" },
    "skill-link": { backgroundColor: "#9CA3AF", color: "#FFFFFF" },
    overcoat: { backgroundColor: "#D1D5DB", color: "#000000" },
    levitate: { backgroundColor: "#7C3AED", color: "#FFFFFF" },
    "weak-armor": { backgroundColor: "#92400E", color: "#FFFFFF" },
    insomnia: { backgroundColor: "#6D28D9", color: "#FFFFFF" },
    forewarn: { backgroundColor: "#F472B6", color: "#FFFFFF" },
    "hyper-cutter": { backgroundColor: "#A3E635", color: "#FFFFFF" },
    soundproof: { backgroundColor: "#D1D5DB", color: "#000000" },
    aftermath: { backgroundColor: "#7C3AED", color: "#FFFFFF" },
    harvest: { backgroundColor: "#4ADE80", color: "#FFFFFF" },
    "battle-armor": { backgroundColor: "#92400E", color: "#FFFFFF" },
    "neutralizing-gas": { backgroundColor: "#A78BFA", color: "#FFFFFF" },
    reckless: { backgroundColor: "#EF4444", color: "#FFFFFF" },
    "leaf-guard": { backgroundColor: "#4ADE80", color: "#FFFFFF" },
    scrappy: { backgroundColor: "#DC2626", color: "#FFFFFF" },
    "water-veil": { backgroundColor: "#3B82F6", color: "#FFFFFF" },
    illuminate: { backgroundColor: "#FACC15", color: "#000000" },
    "natural-cure": { backgroundColor: "#4ADE80", color: "#FFFFFF" },
    "mold-breaker": { backgroundColor: "#6B7280", color: "#FFFFFF" },
    moxie: { backgroundColor: "#EF4444", color: "#FFFFFF" },
    rattled: { backgroundColor: "#FECACA", color: "#000000" },
    imposter: { backgroundColor: "#7C3AED", color: "#FFFFFF" },
    adaptability: { backgroundColor: "#D1D5DB", color: "#000000" },
    anticipation: { backgroundColor: "#F472B6", color: "#FFFFFF" },
    trace: { backgroundColor: "#F472B6", color: "#FFFFFF" },
    download: { backgroundColor: "#9CA3AF", color: "#FFFFFF" },
    pressure: { backgroundColor: "#6D28D9", color: "#FFFFFF" },
    "snow-cloak": { backgroundColor: "#60A5FA", color: "#FFFFFF" },
    "marvel-scale": { backgroundColor: "#4F46E5", color: "#FFFFFF" },
    "cursed-body": { backgroundColor: "#7C3AED", color: "#FFFFFF" },
    unburden: { backgroundColor: "#7DD3FC", color: "#FFFFFF" },
    "iron-fist": { backgroundColor: "#DC2626", color: "#FFFFFF" },
    "serene-grace": { backgroundColor: "#F9A8D4", color: "#FFFFFF" },
    healer: { backgroundColor: "#4ADE80", color: "#FFFFFF" },
    filter: { backgroundColor: "#D1D5DB", color: "#000000" },
    "volt-absorb": { backgroundColor: "#FACC15", color: "#000000" },
    "quick-feet": { backgroundColor: "#EF4444", color: "#FFFFFF" },
    immunity: { backgroundColor: "#4ADE80", color: "#FFFFFF" },
    multiscale: { backgroundColor: "#4F46E5", color: "#FFFFFF" },
  } as const;
  return (
    colors[ability.toLowerCase() as keyof typeof colors] || {
      backgroundColor: "#E5E7EB",
      color: "#000000",
    }
  );
};
