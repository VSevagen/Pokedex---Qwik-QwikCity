import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import Pokecard from "~/components/pokemon/pokecard";

export const fetchPokemon = routeLoader$(async () => {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const pokemon = await res.json();
  return pokemon;
});

export default component$(() => {
  const data = fetchPokemon();
  return (
  <>
    {data.value.results.map((item: any, key: number) => (
      <Pokecard {...item} number={key}/>
    ))}
  </>
)});