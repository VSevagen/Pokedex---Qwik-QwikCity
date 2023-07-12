import { component$ } from "@builder.io/qwik";
import {
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
  poketype_container
} from "./style.css";

interface Pokemon {
  item: any;
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

export default component$(({item}: Pokemon) => {

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
    <ul class={poketype_container}>
      {item.types.map((type:any) => <li class={determineTypeClass(type.type.name)}>{type.type.name.toUpperCase()}</li>)}
    </ul>
  );
});