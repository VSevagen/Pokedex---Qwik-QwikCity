import { component$, $, useSignal, useStylesScoped$ } from "@builder.io/qwik";
import Pokeball from "~/media/pokeball.png?jsx"
import styles from "./index.css?inline";

const fetchPokemonByName = $(async (name?: string, errorSignal?: any) => {
  try {
    errorSignal.value = false;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const pokemon = await res.json();
    return pokemon;
  } catch (error) {
    // Handle error properly
    errorSignal.value = true;
  }
});

interface SearchBar {
  initialPokemon: any;
  errorSignal?: any;
}

export default component$(({initialPokemon, errorSignal}: SearchBar) => {
  const searchTerm = useSignal<String | null>(null);
  useStylesScoped$(styles);
  return (
    <>
      <section class="search-wrapper">
        <input class="search-bar" type="text" placeholder="Search your pokemon" onChange$={(event) => {
          searchTerm.value = event.target.value;
        }} />
        <button
          class="submit-button"
          onClick$={ async () => {
            const data = await fetchPokemonByName(searchTerm.value?.toLowerCase(), errorSignal);
            initialPokemon.value = data.id;
          }}
        >
          {/* <img class="pokeball-search-button" width="30" height="30" src={Pokeball} alt="pokeball image"/> */}
          <Pokeball class="pokeball-search-button" />
        </button>
      </section>
    </>
  );
})