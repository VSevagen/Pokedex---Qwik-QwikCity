import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from './pokeball.css?inline';

interface PokeballLoading {
  bottom?: boolean;
}

export default component$(({bottom = false}: PokeballLoading) => {
  useStylesScoped$(styles)
  return (
    <div class={`wrapper ${bottom ? "bottom-poke" : ""}`}>
      <div class="pokeball">
      </div>
    </div>
  )
});