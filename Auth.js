require('dotenv').config()
require("crypto").randomBytes(64).toString("hex");
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const bcrypt = require("bcrypt")
const pokeUser = require('./models/PokeUser')
const app = express()
const mongoose = require('mongoose')
const { Schema } = mongoose;
const {
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonBadRequestMissingAfter,
  PokemonDbError,
  PokemonNotFoundError,
  PokemonDuplicateError,
  PokemonNoSuchRouteError
} = require("./errors.js")

app.use(express.json())

const auth = (req, res, next) => {
  const token = req.header('auth-token')
  if (!token) {
    throw new PokemonBadRequest("No Authorization Token was submitted")
  }
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET) // nothing happens if token is valid
    next()
  } catch (err) {
    throw new PokemonBadRequest("Invalid token provided")
  }
}

const database = module.exports = () => {
    try {
        mongoose.connect(process.env.MONG_URI).then(() =>{
            app.listen(process.env.PORT, () => {
                console.log("Connected to Poke-base and looking for Poke Users on port " + process.env.PORT)
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

app.post('/api/v1/register', asyncWrapper(async (req, res) => {
  const { username, password, email } = req.body
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const userWithHashedPassword = { ...req.body, password: hashedPassword }

  const user = await pokeUser.create(userWithHashedPassword)
  res.send(user)
}))

app.post('/api/v1/login', asyncWrapper(async (req, res) => {
  const { username, password } = req.body
  const user = await pokeModel.findOne({ username })
  if (!user) {
    throw new PokemonBadRequest("User not found")
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    throw new PokemonBadRequest("Password is incorrect")
  }

  // Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
  console.log(token)
  res.header('auth-token', token)

  res.send(user)
}))

app.post('logout', auth, asyncWrapper(async (req, res) => {
  const { username, password } = req.body;
  const user = await pokeUser.findOne({ username })
  if (!user) {
    throw new PokemonBadRequest("User not found")
  }
}))

app.use(auth) // Boom! All routes below this line are protected


const GenerateJWTToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: '30m'
  })
}

const saveTokenToLocalStorage = (token) => {
  localStorage.setItem('token', token)
}

const getTokenFromLocalStorage = () => {
  return localStorage.getItem('token')
}
