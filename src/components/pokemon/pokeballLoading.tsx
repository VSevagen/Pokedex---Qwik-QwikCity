import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from './pokeball.css?inline';

interface PokeballLoading {
  bottom?: boolean;
  cssClass?: string;
}

export default component$(({bottom = false, cssClass}: PokeballLoading) => {
  useStylesScoped$(styles)
  return (
    <div class={`wrapper ${cssClass} ${bottom ? "bottom-poke" : ""}`}>
      <div class="pokeball">
      </div>
    </div>
  )
});