import { component$, useStylesScoped$ } from "@builder.io/qwik";
import Dark from '~/media/Dark_Type_Icon.png?jsx';
import Electric from '~/media/Electric_Type_Icon.png?jsx';
import Fairy from '~/media/Fairy_Type_Icon.png?jsx';
import Fighting from '~/media/Fighting_Type_Icon.png?jsx';
import Ground from '~/media/Ground_Type_Icon.png?jsx';
import Ice from '~/media/Ice_Type_Icon.png?jsx';
import Normal from '~/media/Normal_Type_Icon.png?jsx';
import Poison from '~/media/Poison_Type_Icon.png?jsx';
import Psychic from '~/media/Psychic_Type_Icon.png?jsx';
import Rock from '~/media/Rock_Type_Icon.png?jsx';
import Steel from '~/media/Steel_Type_Icon.png?jsx';
import Water from '~/media/Water_Type_Icon.png?jsx';
import Bug from '~/media/Bug_icon.png?jsx';
import Fire from '~/media/Fire_icon.png?jsx';
import Flying from '~/media/Flying_icon.png?jsx';
import Grass from '~/media/Grass_Icon.png?jsx';
import styles from './index.css?inline';

import {
  weakness_container,
  weakness_item,
  weakness_image
} from "./style.css";


enum POKEMON_TYPE {
  GRASS = <Grass class="weakness__image"/> as any,
  WATER = <Water class="weakness__image"/> as any,
  GROUND = <Ground class="weakness__image"/> as any,
  FIRE = <Fire class="weakness__image"/> as any,
  POISON = <Poison class="weakness__image"/> as any,
  FAIRY = <Fairy class="weakness__image"/> as any,
  FLYING = <Flying class="weakness__image"/> as any,
  NORMAL = <Normal class="weakness__image"/> as any,
  ELECTRIC = <Electric class="weakness__image"/> as any,
  BUG = <Bug class="weakness__image"/> as any,
  STEEL = <Steel class="weakness__image"/> as any,
  PSYCHIC = <Psychic class="weakness__image"/> as any,
  ICE = <Ice class="weakness__image"/> as any,
  ROCK = <Rock class="weakness__image"/> as any,
  DARK = <Dark class="weakness__image"/> as any,
  FIGHTING = <Fighting class="weakness__image"/> as any
}

export default component$(({item}: any) => {
  useStylesScoped$(styles)

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
    <ul class={weakness_container}>
      {item.damage_relations.double_damage_from.map((type:any) => 
        <li class={weakness_item}>
          {determineTypeClass(type.name)}
          {/* <Grass class="weakness__image" /> */}
          {/* <img width="20" height="20" src={determineTypeClass(type.name)}/> */}
        </li>
      )}
    </ul>
  );
});