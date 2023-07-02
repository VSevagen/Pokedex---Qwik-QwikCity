import { style, styled } from 'styled-vanilla-extract/qwik';

export const pokecard = style({
  width: "300px",
  height: "210px",
  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
  color: "black",
  textAlign: "center",
  margin: "15px",
  borderRadius: "20px"
});

export const poketype = style({
  color: "black",
  listStyle: "none",
})

export const poketype_grass = style({
  color: "white",
  listStyle: "none",
  backgroundColor: "green",
})

export const poketype_ground = style({
  color: "white",
  listStyle: "none",
  backgroundColor: "brown",
})

export const poketype_fire = style({
  color: "white",
  listStyle: "none",
  backgroundColor: "red",
})

export const poketype_poison = style({
  color: "white",
  listStyle: "none",
  backgroundColor: "purple",
})

export const poketype_fairy = style({
  color: "white",
  listStyle: "none",
  backgroundColor: "pink",
})

export const poketype_flying = style({
  color: "white",
  listStyle: "none",
  backgroundColor: "yellow",
})

export const poketype_water = style({
  color: "white",
  listStyle: "none",
  backgroundColor: "blue",
})

export const poketype_normal = style({
  color: "white",
  listStyle: "none",
  backgroundColor: "brown",
})

export const poketype_container = style({
  padding: "0px"
})

export const sprite = style({
  width: "100px",
  height: "100px"
})

export const pokemon_index = style({
  marginTop: "0px",
  fontSize: "10px",
  fontWeight: "bold",
  color: "grey"
});
export const pokemon_name = style({});