import { component$, $, useSignal, useStylesScoped$ } from "@builder.io/qwik";
import Pokeball from "~/media/pokeball.png?jsx"
import styles from "./index.css?inline";

export const isMobile = $(() => {
  if(window && typeof window !== "undefined") {
    return window.visualViewport !== null && window.visualViewport.width <= 992;
  }
})

export const fetchPokemonByName = $(async (name?: string, errorSignal?: any) => {
  try {
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
  const searchTerm = useSignal('');
  useStylesScoped$(styles);
  return (
    <>
      <section class="search-wrapper">
        <input
          class="search-bar"
          type="text"
          placeholder="Search your pokemon"
          onChange$={(event) => {
            searchTerm.value = event.target.value;
          }}
        />
        <div class="button-wrapper">
          <button
            onClick$={() => {
              // TO REWORK. HANDLE THROUGH CONTEXT
              if(localStorage?.getItem('theme') === "dark") {
                localStorage?.setItem('theme', 'light');
                document.documentElement.className = localStorage.theme
              } else {
                localStorage?.setItem('theme', 'dark');
                document.documentElement.className = localStorage.theme
              }
            }}
          >
            Toggle theme
          </button>
          <button
            class="submit-button"
            onClick$={ async () => {
              const data = await fetchPokemonByName(searchTerm.value?.toLowerCase(), errorSignal);
              await isMobile() && window.scrollTo({ top: 100, behavior: "smooth"})
              initialPokemon.value = data.id;
              errorSignal.value = false;
            }}
          >
            <Pokeball class="pokeball-search-button" />
          </button>
        </div>
      </section>
    </>
  );
})