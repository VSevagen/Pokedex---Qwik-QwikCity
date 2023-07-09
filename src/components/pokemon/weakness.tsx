import { component$ } from "@builder.io/qwik";
import Dark from '/Dark_Type_Icon.png';
import Electric from '/Electric_Type_Icon.png';
import Fairy from '/Fairy_Type_Icon.png';
import Fighting from '/Fighting_Type_Icon.png';
import Ground from '/Ground_Type_Icon.png';
import Ice from '/Ice_Type_Icon.png';
import Normal from '/Normal_Type_Icon.png';
import Poison from '/Poison_Type_Icon.png';
import Psychic from '/Psychic_Type_Icon.png';
import Rock from '/Rock_Type_Icon.png';
import Steel from '/Steel_Type_Icon.png';
import Water from '/Water_Type_Icon.png';
import Bug from '/Bug_icon.png';
import Fire from '/Fire_icon.png';
import Flying from '/Flying_icon.png';
import Grass from '/Grass_Icon.png';

import {
  weakness_container,
  weakness_item
} from "./style.css";


enum POKEMON_TYPE {
  GRASS = Grass as any,
  WATER = Water as any,
  GROUND = Ground as any,
  FIRE = Fire as any,
  POISON = Poison as any,
  FAIRY = Fairy as any,
  FLYING = Flying as any,
  NORMAL = Normal as any,
  ELECTRIC = Electric as any,
  BUG = Bug as any,
  STEEL = Steel as any,
  PSYCHIC = Psychic as any,
  ICE = Ice as any,
  ROCK = Rock as any,
  DARK = Dark as any,
  FIGHTING = Fighting as any
}

export default component$(({item}: any) => {

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
          <img width="20" height="20" src={determineTypeClass(type.name)}/>
        </li>
      )}
    </ul>
  );
});