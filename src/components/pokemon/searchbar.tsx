import {
  component$,
  useSignal,
  useStylesScoped$,
  useContext,
  $
} from "@builder.io/qwik";
import Pokeball from "~/media/pokeball.png?jsx";
import Light from "~/media/light.png?jsx";
import Moon from "~/media/moon.png?jsx";
import styles from "./index.css?inline";
import { ThemeContext } from "~/root";

export const isMobile = $(() => {
  if(window && typeof window !== "undefined") {
    return window.visualViewport !== null && window.visualViewport.width <= 992;
  }
})

export const scrollToElement = $((element: Element) => {
  if(element && typeof element !== "undefined") {
    element.scrollIntoView({ behavior: "smooth" });
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
  const theme = useContext(ThemeContext);
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
            class="submit-button"
            onClick$={ async () => {
              const data = await fetchPokemonByName(searchTerm.value?.toLowerCase(), errorSignal);
              if(await isMobile()) {
                const pokecard = document?.getElementsByClassName('pokemon_main')?.[0];
                scrollToElement(pokecard);
              }
              initialPokemon.value = data.id;
              errorSignal.value = false;
            }}
          >
            <Pokeball class="pokeball-search-button" />
          </button>
          <div class={`theme ${theme.value === 'dark' ? "theme-dark" : ""}`}>
            <div
              class={`theme-button ${theme.value === 'dark' ? "theme-button-dark" : ""}`}
              onClick$={() => {
                if(theme.value === 'dark') {
                  theme.value = 'light';
                } else {
                  theme.value = 'dark';
                }
              }}
            >
              { theme.value === 'dark' ? <Moon class="theme-icon"/> : <Light class="theme-icon" />}
            </div>
          </div>
        </div>
      </section>
    </>
  );
})