require('dotenv').config()
require("crypto").randomBytes(64).toString("hex");
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const bcrypt = require("bcrypt")
const Pokemon = require("./models/Pokemon")
const app = express()
const mongoose = require('mongoose')
const { Schema } = mongoose;

const { 
    createPokemon,
    getAllPokemon,
    getAPokemon,
    getPokemonImage,
    patchAPokemon,
    deleteAPokemon,
    upsertAPokemon,
    getSomePokemon,
    pokemonsAdvancedFiltering

} = require('./controllers/pokemonController')

app.use(express.json())



const database = module.exports = () => {
    try {
        mongoose.connect(process.env.MONG_URI).then(() =>{
            app.listen(process.env.PORT, () => {
                console.log("Connected to Poke-base and looking for Poke-pals on port " + process.env.PORT)
            })
        });
    } catch (error) {
        console.log(error)
        console.log("Failed to connect")
    }
};
database();


const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}


app.get('/api/v1/allPokemon', getAllPokemon)

app.get('/api/v1/pokemon/:id', getAPokemon)

app.post('/api/v1/pokemon', createPokemon)

app.get('/api/v1/pokemonImage/:id', getPokemonImage)

app.patch('/api/v1/pokemon/:id', patchAPokemon)

app.put('/api/v1/pokemon/:id', upsertAPokemon)

app.delete('/api/v1/pokemon/:id', deleteAPokemon)

app.get('/api/v1/pokemons', getSomePokemon)

app.get('/api/v1/pokemonAdvanced', pokemonsAdvancedFiltering)

class PokemonBadRequest extends Error {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequest";
  }
}

class InvalidLoginRequest extends Error {
  constructor(message) {
    super(message);
    this.name = "Invalid Login Credentials";
  }
}

class PokemonBadRequestMissingID extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequestMissingID";
  }
}