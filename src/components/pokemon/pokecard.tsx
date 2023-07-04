import { component$, useSignal, useResource$, Resource, $ } from "@builder.io/qwik";
import {pokecard,
        poketype,
        poketype_grass,
        poketype_water,
        poketype_ground,
        poketype_fire,
        poketype_poison,
        poketype_fairy,
        poketype_flying,
        poketype_normal,
        poketype_electric,
        poketype_bug,
        poketype_steel,
        poketype_psychic,
        poketype_ice,
        poketype_container,
        sprite,
        sprite_container,
        pokemon_index,
        pokemon_name
} from "./style.css";

interface Pokemon {
  name: string;
  number: number;
  url: string;
}

interface PokemonType {
  type: {
    name: string;
  };
}

enum POKEMON_TYPE {
  GRASS = poketype_grass as any,
  WATER = poketype_water as any,
  GROUND = poketype_ground as any,
  FIRE = poketype_fire as any,
  POISON = poketype_poison as any,
  FAIRY = poketype_fairy as any,
  FLYING = poketype_flying as any,
  NORMAL = poketype_normal as any,
  ELECTRIC = poketype_electric as any,
  BUG = poketype_bug as any,
  STEEL = poketype_steel as any,
  PSYCHIC = poketype_psychic as any,
  ICE = poketype_ice as any,
}

export default component$(({name, url, number}: Pokemon) => {

  const fetchPokemonTypes = useResource$( async () => {
    const data = await fetch(url);
    const types = await data.json();
    // return ({types: types.types, sprite: types.sprites.front_default});
    return types.types as Array<PokemonType>;
  })

  const fetchPokemonSprite = useResource$( async () => {
    const data = await fetch(url);
    const sprite = await data.json();
    // return ({types: types.types, sprite: types.sprites.front_default});
    return sprite.sprites.front_default;
  })

  const determineTypeClass = (typeName: string): any => {
    switch(typeName) {
      case "grass":
        return POKEMON_TYPE.GRASS;
      case "water":
        return POKEMON_TYPE.WATER;
      case "ground":
        return POKEMON_TYPE.GROUND;
      case "fire":
        return POKEMON_TYPE.FIRE;
      case "poison":
        return POKEMON_TYPE.POISON;
      case "fairy":
        return POKEMON_TYPE.FAIRY;
      case "flying":
        return POKEMON_TYPE.FLYING;
      case "electric":
        return POKEMON_TYPE.ELECTRIC;
      case "bug":
        return POKEMON_TYPE.BUG;
      case "steel":
        return POKEMON_TYPE.STEEL;
      case "psychic":
        return POKEMON_TYPE.PSYCHIC;
      case "ice":
        return POKEMON_TYPE.ICE;
      default:
        return POKEMON_TYPE.NORMAL
    }
  }

  return (
    <div class={pokecard}>
      <Resource
        value={fetchPokemonSprite}
        onPending={() => <p>Loading...</p>}
        onResolved={(item) => <div class={sprite_container}><img width="100" height="100" src={item}/></div>}
      />
      <p class={pokemon_index}>Nº{number + 1}</p>
      <p class={pokemon_name}>{name}</p>
      <Resource
        value={fetchPokemonTypes}
        onPending={() => <p>Loading...</p>}
        onResolved={(item) => {
          return (
            <ul class={poketype_container}>
              {item.map((type) => <li class={determineTypeClass(type.type.name)}>{type.type.name.toUpperCase()}</li>)}
            </ul>
        )}}
      />
    </div>
  );
});
