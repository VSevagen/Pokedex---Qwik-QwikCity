import { style } from 'styled-vanilla-extract/qwik';

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