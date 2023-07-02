import { component$, useSignal, useResource$, Resource, $ } from "@builder.io/qwik";
import { pokecard, poketype, poketype_container, sprite, pokemon_index } from "./style.css";

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

interface PokemonData {
  types: PokemonType;
  sprite: string;
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

  return (
    <div class={pokecard}>
      <Resource
        value={fetchPokemonSprite}
        onPending={() => <p>Loading...</p>}
        onResolved={(item) => <img class={sprite} src={item}/>}
      />
      <p class={pokemon_index}>Nº{number + 1}</p>
      <p>{name}</p>
      <Resource
        value={fetchPokemonTypes}
        onPending={() => <p>Loading...</p>}
        onResolved={(item) => {
          return (
            <ul class={poketype_container}>
              {item.map((type) => <li class={poketype}>{type.type.name}</li>)}
            </ul>
        )}}
      />
    </div>
  );
});
