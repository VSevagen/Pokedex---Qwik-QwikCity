import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from './pokeball.css?inline';

interface PokeballLoading {
  bottom?: boolean;
  className?: string;
}

export default component$(({bottom = false, className}: PokeballLoading) => {
  useStylesScoped$(styles)
  return (
    <div class={`wrapper ${className} ${bottom ? "bottom-poke" : ""}`}>
      <div class="pokeball">
      </div>
    </div>
  )
});