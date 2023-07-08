import { component$, useStylesScoped$, useSignal, useResource$, Resource, useTask$, useStore, noSerialize } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import Pokecard from "~/components/pokemon/pokecard";
import styles from './pokedex.css?inline';
import Left from "~/media/left.png?jsx";
import Right from "~/media/right.png?jsx";
import Bottom from "~/media/bottom.png?jsx";

export default component$(() => {
  useStylesScoped$(styles);

  const offset = useSignal(0);
  const initialType = useSignal('https://pokeapi.co/api/v2/type/12/');
  const initialPokemon = useSignal(1);
  
  const fetchPokemon = useResource$(async ({ track }) => {
    const signal = track(() => offset.value);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=12&offset=${signal}`);
    const pokemon = await res.json();
    return pokemon;
  })

  const fetchFirstPokemon = useResource$(async ({ track }) => {
    const signal = track(() => initialPokemon.value);

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${signal}`);
    const pokemon = await res.json();

    const descriptionRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${signal}`);
    const description = await descriptionRes.json()

    return ({
      pokemon: pokemon,
      description: description,
    });
  })

  const fetchFirstDamage = useResource$(async ({ track }) => {
    const signal = track(() => initialType.value);
    const damageInfo = await fetch(signal);
    const damage = await damageInfo.json();
    return damage;
  })

  return (
    <>
      <div>
        <Resource 
          value={fetchPokemon}
          onResolved={(item) => {
            return (
              <div class="pokedex">
                {item.results.map((item: any, key: number) => (
                  <Pokecard key={key} {...item} number={offset.value + key}/>
                ))}
              </div>
            )}}
        />
        <div class="pagination_wrapper">
        <Resource 
            value={fetchPokemon}
            onResolved={(item) => {
              const totalPages = Math.ceil(item.count/12);
              const pages = [... new Array(totalPages)].map((_, key) => key + 1);
              return (
                <div class="pagination_container">
                  <select class="pagination_select" name="pages" onChange$={(event: any) => offset.value = (event.target.value - 1) * 12}>
                    {pages.map((item) => <option value={item} selected={item === (offset.value/12) + 1 ? true : false}>{item.toString()}</option>)}
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
            }}
          />
        </div>
      </div>
      <div>
          <Resource 
            value={fetchFirstPokemon}
            onResolved={(item) => {
              initialType.value = item.pokemon.types[0].type.url;
              return (
                <>
                  <p>{item.pokemon.name}</p>
                  <ul>{item.pokemon.types.map((type: any) => <li>{type.type.name}</li>)}</ul>
                  <p>{item.description.flavor_text_entries[0].flavor_text}</p>
                  <p>Abilities</p>
                  <ul>{item.pokemon.abilities.map((ability: any) => <li>{ability.ability.name}</li>)}</ul>
                  <p>Height</p>
                  <p>{item.pokemon.height}</p>
                  <p>Weight</p>
                  <p>{item.pokemon.weight}</p>
                  <p>Base EXP</p>
                  <p>{item.pokemon.base_experience}</p>
                  <p>Weaknesses</p>
                  <Resource
                    value={fetchFirstDamage}
                    onResolved={(item) => {
                      return (
                        <ul>
                          {item.damage_relations.double_damage_from.map((damage: any) => <li>{damage.name}</li>)}
                        </ul>
                      )
                    }}
                  />
                  <p>Stats</p>
                  <ul>
                    {item.pokemon.stats.map((stats: any) =>
                      <li>
                        <span>{stats.stat.name}</span>
                        <span>{stats.base_stat}</span>
                      </li>
                    )}
                  </ul>
                  <button onClick$={() => {
                    initialPokemon.value -= 1;
                  }}
                  >Prev</button>
                  <button onClick$={() => {
                    initialPokemon.value += 1;
                  }}>Next</button>
                </>
              )
            }}
          />
      </div>
    </>
)}
);