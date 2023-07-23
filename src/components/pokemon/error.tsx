import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./index.css?inline";
import Image from '/avatar.png';

interface ErrorProps {
  classOverride?: string;
}

export default component$(({ classOverride }: ErrorProps) => {
  useStylesScoped$(styles);
  return (
    <div class={`error-modal ${classOverride}`}>
      <img width="100" height="100" src={Image} alt="error text"/>
      <p class="failed-text">Failed to fetch pokemon</p>
    </div>
  );
})