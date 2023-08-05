import { component$, useStylesScoped$ } from "@builder.io/qwik";
import Left from "~/media/left.png?jsx";
import Right from "~/media/right.png?jsx";
import styles from './index.css?inline';

import { isMobile } from "./searchbar";

interface Pagination {
  pages: any;
  offset: any;
  totalPages: number;
}

export default component$(({pages, offset, totalPages}: Pagination) => {
  useStylesScoped$(styles);

  return (
    <div class="pagination_container">
      <select class="pagination_select" name="pages" onChange$={(event: any) => offset.value = (event.target.value - 1) * 16}>
        {pages.map((item: any, index: number) => <option key={index} value={item} selected={item === (offset.value/16) + 1 ? true : false}>{item.toString()}</option>)}
      </select>
      <p class="pagination_current"> of {totalPages} pages</p>
      { offset.value > 0 &&
        <button onClick$={async () => {
          if(await isMobile()) {
            window.scrollTo({ top: 0, behavior: "smooth"})
          }
          offset.value-=16;
        }}>
          <Left />
        </button>
      }
      <button onClick$={async () => {
        if(await isMobile()) {
          window.scrollTo({ top: 0, behavior: "smooth"})
        }
        offset.value+=16;
      }}>
        <Right />
      </button>
    </div>
  )
});