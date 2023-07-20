import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./index.css?inline";
import Image from '/avatar.png';

export default component$(() => {
  useStylesScoped$(styles);
  return (
    <div class="error-modal">
      <img width="100" height="100" src={Image} alt="error text"/>
      <p class="failed-text">Failed to fetch pokemon</p>
    </div>
  );
})