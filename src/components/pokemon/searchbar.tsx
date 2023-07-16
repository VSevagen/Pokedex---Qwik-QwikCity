import { component$, $, useSignal, useStylesScoped$} from "@builder.io/qwik";
import Pokeball from "/pokeball.png"
import styles from "./index.css?inline";

const fetchPokemonByName = $(async (name?: string) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const pokemon = await res.json();
  return pokemon;
});

interface SearchBar {
  initialPokemon: any;
}

export default component$(({initialPokemon}: SearchBar) => {
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
            const data = await fetchPokemonByName(searchTerm.value?.toLowerCase());
            initialPokemon.value = data.id;
          }}
        >
          <img width="30"  height="30" src={Pokeball} alt="pokeball image"/>
        </button>
      </section>
    </>
  );
})