import type { DocumentHead } from "@builder.io/qwik-city";
import {
  component$,
  useStylesScoped$,
  useSignal,
  useResource$,
  Resource,
  useStore,
  useVisibleTask$
} from "@builder.io/qwik";
import Pokecard from "~/components/pokemon/pokecard";
import PokeballLoading from "~/components/pokemon/pokeballLoading";
import PokemonType from "~/components/pokemon/pokemonType";
import Evolution from "~/components/pokemon/evolution";
import Weakness from "~/components/pokemon/weakness";
import Pagination from "~/components/pokemon/pagination";
import Searchbar, { isMobile } from "~/components/pokemon/searchbar";
import Error from "~/components/pokemon/error";
import styles from './pokedex.css?inline';
import Left from "~/media/left.png?jsx";
import Right from "~/media/right.png?jsx";

export default component$(() => {
  useStylesScoped$(styles);

  const offset = useSignal(0);
  const limit = useSignal(16);
  const initialType = useSignal('https://pokeapi.co/api/v2/type/12/');
  const errorSignal = useSignal(false);
  const initialPokemon = useSignal(1);
  const evoSprites = useStore({
    initialEvo: "https://pokeapi.co/api/v2/evolution-chain/1/",
    baseForm: "bulbasaur",
    firstEvo: "ivysaur",
    secondEvo: "venusaur"
  },
  {deep: true});

  useVisibleTask$( async () => {
    if(await isMobile()) {
      limit.value = 10;
    }
  })
  
  const fetchPokemon = useResource$(async ({ track }) => {
    const signal = track(() => offset.value);
    const limitSignal = track(() => limit.value);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limitSignal}&offset=${signal}`);
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

  const fetchEvolutionChain = useResource$(async ({ track }) => {
    const evoSignal = track(() => evoSprites.initialEvo)
    const baseFormSpriteSignal = track(() => evoSprites.baseForm);
    const firstSpriteSignal = track(() => evoSprites.firstEvo);
    const secondSpriteSignal = track(() => evoSprites.secondEvo);
    let baseFormSprite;
    let firstSprite;
    let secondSprite;

    const evolutionRes = await fetch(evoSignal);
    const evolution = await evolutionRes.json();

    if(baseFormSpriteSignal) {
      const baseFormSpriteRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${baseFormSpriteSignal}`);
      baseFormSprite = await baseFormSpriteRes.json();
    }

    if(firstSpriteSignal) {
      const firstSpriteRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${firstSpriteSignal}`);
      firstSprite = await firstSpriteRes.json();
    }

    if(secondSpriteSignal) {
      const secondSpriteRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${secondSpriteSignal}`);
      secondSprite = await secondSpriteRes.json();
    }

    return ({
      evolution: evolution,
      baseForm: baseFormSprite,
      firstSprite: firstSprite,
      secondSprite: secondSprite
    });
  })

  const determineStatLabel = (label: string) => {
    switch(label) {
      case "hp":
        return "HP";
      case "attack":
        return "ATK";
      case "defense":
        return "DEF";
      case "special-attack":
        return "SpA";
      case "special-defense":
        return "SpD";
      case "speed":
        return "SPD";
      default:
        return label;
    }
  }

  const determineStatClass = (label: string) => {
    switch(label) {
      case "hp":
        return "stats-hp";
      case "attack":
        return "stats-attack";
      case "defense":
        return "stats-defense";
      case "special-attack":
        return "stats-spa";
      case "special-defense":
        return "stats-spd";
      case "speed":
        return "stats-speed";
      default:
        return label;
    }
  }


  return (
    <div class="main">
      <div>
        <Resource 
          value={fetchPokemon}
          onPending={() => {
            const emptyCards = [...Array(16).keys()];
            return (
              <>
                <Searchbar initialPokemon={initialPokemon}/>
                <div class="pokedex">
                  {emptyCards.map((index: number) => (
                    <div key={index} class="empty-card animated-background"></div>
                  ))}
                </div>
              </>
            )
          }}
          onResolved={(item) => {
            return (
              <>
                <Searchbar initialPokemon={initialPokemon} errorSignal={errorSignal}/>
                <div class="pokedex">
                  {item.results.map((item: any, key: number) => (
                    <Pokecard key={key} {...item} number={offset.value + key}/>
                  ))}
                </div>
              </>
            )
          }}
        />
        <div class="pagination_wrapper">
        <Resource 
            value={fetchPokemon}
            onResolved={(item) => {
              const totalPages = Math.ceil(item.count/12);
              const pages = [... new Array(totalPages)].map((_, key) => key + 1);
              return <Pagination pages={pages} offset={offset} totalPages={totalPages}/>
            }}
          />
        </div>
      </div>
      <div>
          <Resource 
            value={fetchFirstPokemon}
            onRejected={() => <div class="pokemon_main_loading"><p>Pokemon not found</p></div>}
            onPending={() => <div class="pokemon_main_loading"><PokeballLoading cssClass="evolution-loading-override" /></div>}
            onResolved={(item) => {
              initialType.value = item.pokemon.types[0].type.url;
              evoSprites.initialEvo = item.description.evolution_chain.url;
              const pokemonGenera = item.description.genera.find((language: any) => language.language.name === "en");
              const pokedexEntry = item.description.flavor_text_entries.find((language: any) => language.language.name === "en");

              return (
                <section class="pokemon_main">
                  {errorSignal.value ? <Error /> :
                  <>
                    <div class="pokemon_main-pokemon-container">
                      <img class="pokemon_main-pokemon" width="200" height="200" src={item.pokemon.sprites.front_default}/>
                    </div>
                    <p class="pokemon_main-name">{item.pokemon.name.charAt(0).toUpperCase() + item.pokemon.name.slice(1)}</p>
                    <p class="pokemon_main-genera">{pokemonGenera.genus}</p>
                    <PokemonType item={item.pokemon}/>
                    <p class="pokemon_main-desc">POKEDEX ENTRY</p>
                    <p class="pokemon_main-flavor">{pokedexEntry.flavor_text || item.description.flavor_text_entries[0].flavor_text}</p>
                    <p class="pokemon_main-desc">ABILITIES</p>
                    <ul class="pokemon_main-ability-container">
                      {item.pokemon.abilities.map((ability: any) => 
                        <li class="pokemon_main-ability">{ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)}</li>
                      )}
                    </ul>
                    <div class="pokemon_main-first-stats">
                      <section>
                        <p class="pokemon_main-desc">HEIGHT</p>
                        <p class="pokemon_main-weight">{item.pokemon.height/10}m</p>
                      </section>
                      <section>
                        <p class="pokemon_main-desc">WEIGHT</p>
                        <p class="pokemon_main-weight">{item.pokemon.weight/10}Kg</p>
                      </section>
                    </div>
                    <div class="pokemon_main-first-stats">
                      <section class="weakness_section">
                        <p class="pokemon_main-desc">WEAKNESS</p>
                        <Resource
                          value={fetchFirstDamage}
                          onPending={() => <div class="evolution-loading"><PokeballLoading cssClass="evolution-loading-override" /></div>}
                          onResolved={(item) => {
                            return (
                              <Weakness item={item}/>
                            )
                          }}
                        />
                      </section>
                      <section>
                        <p class="pokemon_main-desc">BASE EXP</p>
                        <p class="pokemon_main-weight">{item.pokemon.base_experience}</p>
                      </section>
                    </div>
                    <p class="pokemon_main-desc">STATS</p>
                    <ul class="pokemon_main-real-stats">
                      {item.pokemon.stats.map((stats: any) =>
                        <li class="stats">
                          <span class={`stats-name ${determineStatClass(stats.stat.name)}`}>{determineStatLabel(stats.stat.name)}</span>
                          <span class="stats-value">{stats.base_stat}</span>
                        </li>
                      )}
                    </ul>
                    <p class="pokemon_main-desc">EVOLUTION</p>
                    <Resource
                      value={fetchEvolutionChain}
                      onPending={() => <div class="evolution-loading"><PokeballLoading cssClass="evolution-loading-override" /></div>}
                      onResolved={(item) =>
                      {
                        evoSprites.baseForm = item?.evolution?.chain?.species?.name;
                        evoSprites.firstEvo = item?.evolution.chain?.evolves_to?.[0]?.species?.name;
                        evoSprites.secondEvo = item?.evolution?.chain?.evolves_to?.[0]?.evolves_to?.[0]?.species?.name;
                        return <Evolution item={item} />
                      }
                    }
                    />
                    {initialPokemon.value !== 1 ?
                      <button
                        class="prev_button"
                        onClick$={() => {
                          initialPokemon.value -= 1;
                        }}
                      >
                        <Left />
                      </button>
                      :
                      <></>
                    }
                    <button
                      class="next_button"
                      onClick$={() => {
                        initialPokemon.value += 1;
                      }}
                    >
                      <Right />
                    </button>
                  </>
                }
                </section>
              )
            }}
          />
      </div>
    </div>
)}
);

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
