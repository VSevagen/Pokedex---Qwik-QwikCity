import { component$, useStylesScoped$, useSignal, useResource$, Resource, useStore } from "@builder.io/qwik";
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
  const evoSprites = useStore({
    initialEvo: "https://pokeapi.co/api/v2/evolution-chain/1/",
    baseForm: "bulbasaur",
    firstEvo: "ivysaur",
    secondEvo: "venusaur"
  },
  {deep: true});
  
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
              evoSprites.initialEvo = item.description.evolution_chain.url;
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
                  <p>Evolution</p>
                  <Resource
                    value={fetchEvolutionChain}
                    onResolved={(item) => {
                      evoSprites.baseForm = item.evolution.chain.species.name;
                      evoSprites.firstEvo = item.evolution.chain?.evolves_to?.[0]?.species?.name;
                      evoSprites.secondEvo = item?.evolution?.chain?.evolves_to?.[0].evolves_to?.[0]?.species?.name;
                      return (
                        <>
                          <img width="96" height="96" src={item.baseForm.sprites.front_default}/>
                          <img width="96" height="96" src={item?.firstSprite?.sprites?.front_default}/>
                          <p>{item?.evolution?.chain?.evolves_to?.[0]?.species?.name}</p>
                          {item?.secondSprite?.sprites?.front_default ? <img width="96" height="96" src={item?.secondSprite?.sprites?.front_default}/> : <></>}
                          <p>{item?.evolution?.chain?.evolves_to?.[0].evolves_to?.[0]?.species?.name}</p>
                        </>
                      )
                    }}
                  />
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