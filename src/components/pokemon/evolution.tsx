import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from './index.css?inline';

export default component$(({item}: any) => {
  useStylesScoped$(styles);
  return (
    <div class="pokemon_main-evolution">
      <img width="96" height="96" src={item.baseForm.sprites.front_default}/>
      {item?.evolution?.chain?.evolves_to?.[0]?.evolution_details?.[0]?.min_level ?
        <p class="evolution_levelup">Lvl {item?.evolution?.chain?.evolves_to?.[0]?.evolution_details?.[0]?.min_level}</p>
        :
        <p class="evolution_levelup">Lvl</p>
      }
      <img width="96" height="96" src={item?.firstSprite?.sprites?.front_default}/>
      {item?.evolution?.chain?.evolves_to?.[0].evolves_to?.[0]?.evolution_details?.[0]?.min_level ? 
        <p class="evolution_levelup">Lvl {item?.evolution?.chain?.evolves_to?.[0].evolves_to?.[0]?.evolution_details?.[0]?.min_level}</p>
        :
        item?.secondSprite?.sprites?.front_default ?
        <p class="evolution_levelup">Lvl</p>
        :
        <></>
      }
      {item?.secondSprite?.sprites?.front_default ? 
        <img width="96" height="96" src={item?.secondSprite?.sprites?.front_default}/> 
        :
        <></>
      }
    </div>
  )
});