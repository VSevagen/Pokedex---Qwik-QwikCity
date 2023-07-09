import { component$, useStylesScoped$, useSignal, useResource$, Resource, useStore } from "@builder.io/qwik";
import Pokecard from "~/components/pokemon/pokecard";
import PokemonType from "~/components/pokemon/pokemonType";
import Weakness from "~/components/pokemon/weakness";
import styles from './pokedex.css?inline';
import Left from "~/media/left.png?jsx";
import Right from "~/media/right.png?jsx";

export default component$(() => {
  useStylesScoped$(styles);

  const offset = useSignal(0);
  const initialType = useSignal('https://pokeapi.co/api/v2/type/12/');
  const initialPokemon = useSignal(1);
  const evoSprites = useStore({
    initialEvo: "https://pokeapi.co/api/v2/evolution-chain/1/",
    baseForm: "bulbasaur",
    firstEvo: "ivysaur",
    secondEvo: "venusaur"
  },
  {deep: true});
  
  const fetchPokemon = useResource$(async ({ track }) => {
    const signal = track(() => offset.value);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=16&offset=${signal}`);
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
              evoSprites.initialEvo = item.description.evolution_chain.url;
              const pokemonGenera = item.description.genera.find((language: any) => language.language.name === "en");
              return (
                <section class="pokemon_main">
                  <div class="pokemon_main-pokemon-container">
                    <img class="pokemon_main-pokemon" width="200" height="200" src={item.pokemon.sprites.front_default}/>
                  </div>
                  <p class="pokemon_main-name">{item.pokemon.name.charAt(0).toUpperCase() + item.pokemon.name.slice(1)}</p>
                  <p class="pokemon_main-genera">{pokemonGenera.genus}</p>
                  <PokemonType item={item.pokemon}/>
                  <p class="pokemon_main-desc">POKEDEX ENTRY</p>
                  <p class="pokemon_main-flavor">{item.description.flavor_text_entries[0].flavor_text}</p>
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
                    onResolved={(item) => {
                      evoSprites.baseForm = item.evolution.chain.species.name;
                      evoSprites.firstEvo = item.evolution.chain?.evolves_to?.[0]?.species?.name;
                      evoSprites.secondEvo = item?.evolution?.chain?.evolves_to?.[0].evolves_to?.[0]?.species?.name;
                      return (
                        <div class="pokemon_main-evolution">
                          <img width="96" height="96" src={item.baseForm.sprites.front_default}/>
                          {item?.evolution?.chain?.evolves_to?.[0]?.evolution_details?.[0]?.min_level ?
                            <p class="evolution_levelup">Lvl {item?.evolution?.chain?.evolves_to?.[0]?.evolution_details?.[0]?.min_level}</p>
                            :
                            <p class="evolution_levelup">Lvl</p>
                          }
                          <img width="96" height="96" src={item?.firstSprite?.sprites?.front_default}/>
                          {item?.evolution?.chain?.evolves_to?.[0].evolves_to?.[0]?.evolution_details?.[0]?.min_level ? 
                            <p class="evolution_levelup">Lvl {item?.evolution?.chain?.evolves_to?.[0].evolves_to?.[0]?.evolution_details?.[0]?.min_level}</p>
                            :
                            item?.secondSprite?.sprites?.front_default ?
                            <p class="evolution_levelup">Lvl</p>
                            :
                            <></>
                          }
                          {item?.secondSprite?.sprites?.front_default ? 
                            <img width="96" height="96" src={item?.secondSprite?.sprites?.front_default}/> 
                            :
                            <></>
                          }
                        </div>
                      )
                    }}
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
                </section>
              )
            }}
          />
      </div>
    </div>
)}
);