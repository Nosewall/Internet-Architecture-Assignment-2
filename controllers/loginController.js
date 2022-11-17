const pokeUser = require('../models/PokeUser')

const register = async (req, res) => {
    const { username, password } = req.body
    const user = await userModel.create({ username, password })
    res.send(user)
}



module.exports = {
    register,
}