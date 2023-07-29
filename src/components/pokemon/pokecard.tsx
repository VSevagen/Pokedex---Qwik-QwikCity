import { component$, useResource$, Resource } from "@builder.io/qwik";
import {pokecard,
        sprite_container,
        pokemon_index,
        pokemon_name
} from "./style.css";
import PokeballLoading from "./pokeballLoading";
import Error from "./error";
import PokemonType from "./pokemonType";

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

  const fetchPokemonSprite = useResource$( async ({ track }) => {
    const signal = track(() => url)
    const data = await fetch(signal);
    const sprite = await data.json();
    return ({sprites: sprite?.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.front_default, types: sprite.types})
  })

  return (
    <div class={pokecard}>
      <Resource
        value={fetchPokemonSprite}
        onRejected={() => <Error classOverride="pokecard-failed" />}
        onPending={() => <PokeballLoading />}
        onResolved={(item) => {
          return (
            <>
            <section class={sprite_container}><img width="70" height="70" src={item.sprites}/></section>
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
