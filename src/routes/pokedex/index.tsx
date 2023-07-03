import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import Pokecard from "~/components/pokemon/pokecard";
import styles from './pokedex.css?inline';

export const fetchPokemon = routeLoader$(async () => {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const pokemon = await res.json();
  return pokemon;
});

export default component$(() => {
  useStylesScoped$(styles);
  const data = fetchPokemon();
  return (
  <div class="pokedex">
    {data.value.results.map((item: any, key: number) => (
      <Pokecard {...item} number={key}/>
    ))}
  </div>
)});