import { component$, useStylesScoped$ } from "@builder.io/qwik";
import Left from "~/media/left.png?jsx";
import Right from "~/media/right.png?jsx";
import styles from './index.css?inline';

interface Pagination {
  pages: any;
  offset: any;
  totalPages: number;
}

export default component$(({pages, offset, totalPages}: Pagination) => {
  useStylesScoped$(styles);
  return (
    <div class="pagination_container">
      <select class="pagination_select" name="pages" onChange$={(event: any) => offset.value = (event.target.value - 1) * 12}>
        {pages.map((item: any) => <option value={item} selected={item === (offset.value/12) + 1 ? true : false}>{item.toString()}</option>)}
      </select>
      <p class="pagination_current"> of {totalPages} pages</p>
      <button onClick$={() => offset.value-=12}>
        <Left />
      </button>
      <button onClick$={() => offset.value+=12}>
        <Right />
      </button>
    </div>
  )
});