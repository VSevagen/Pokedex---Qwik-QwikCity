import { component$, useStylesScoped$, useSignal, useResource$, Resource, useTask$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import Pokecard from "~/components/pokemon/pokecard";
import styles from './pokedex.css?inline';
import Left from "~/media/left.png?jsx";
import Right from "~/media/right.png?jsx";
import Bottom from "~/media/bottom.png?jsx";

export default component$(() => {
  useStylesScoped$(styles);

  const offset = useSignal(0);
  
  const fetchPokemon = useResource$(async ({ track }) => {
    const signal = track(() => offset.value);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=12&offset=${signal}`);
    const pokemon = await res.json();
    return pokemon;
  })

  return (
    <>
      <Resource 
        value={fetchPokemon}
        onResolved={(item) => {
          return (
            <div class="pokedex">
              {item.results.map((item: any, key: number) => (
                <Pokecard key={key} {...item} number={offset.value + key}/>
              ))}
            </div>
          )}}
      />
      <div class="pagination_wrapper">
      <Resource 
          value={fetchPokemon}
          onResolved={(item) => {
            const totalPages = Math.ceil(item.count/12);
            const pages = [... new Array(totalPages)].map((_, key) => key + 1);
            return (
              <div class="pagination_container">
                <select class="pagination_select" name="pages" onChange$={(event: any) => offset.value = (event.target.value - 1) * 12}>
                  {pages.map((item) => <option value={item} selected={item === (offset.value/12) + 1 ? true : false}>{item.toString()}</option>)}
                </select>
                <p class="pagination_current"> of {totalPages} pages</p>
                <button onClick$={() => offset.value-=12}>
                  <Left />
                </button>
                <button onClick$={() => offset.value+=12}>
                  <Right />
                </button>
              </div>
            )
          }}
        />
      </div>
    </>
)}
);