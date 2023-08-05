import { component$, useResource$, Resource, useStylesScoped$ } from "@builder.io/qwik";
import {
        sprite_container,
        pokemon_index,
        pokemon_name
} from "./style.css";
import PokeballLoading from "./pokeballLoading";
import Error from "./error";
import PokemonType from "./pokemonType";
import styles from './index.css?inline';
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

export default component$(({name, url, number}: Pokemon) => {
  useStylesScoped$(styles)
  const fetchPokemonSprite = useResource$( async ({ track }) => {
    const signal = track(() => url)
    const data = await fetch(signal);
    const sprite = await data.json();
    return ({sprites: sprite?.sprites?.front_default, types: sprite.types})
  })

  return (
    <div class="pokecard">
      <Resource
        value={fetchPokemonSprite}
        onRejected={() => <Error classOverride="pokecard-failed" />}
        onPending={() => <div class="pokecard-loading"><PokeballLoading /></div>}
        onResolved={(item) => {
          return (
            <>
            <section class={sprite_container}><img width="100" height="100" src={item.sprites}/></section>
            <p class={pokemon_index}>Nº{number + 1}</p>
            <p class={pokemon_name}>{name.charAt(0).toUpperCase() + name.slice(1)}</p>
            <PokemonType item={item}/>
            </>
          )
        }}
      />
    </div>
  );
});
