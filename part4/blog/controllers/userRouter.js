const bcrypt = require('bcryptjs')
const userRouter = require('express').Router()
const User = require('../models/user')

const MIN_PASSWORD_LENGTH = 3

userRouter.post('/', async(request, response) => {
    const {username, name, password} = request.body

    if (password.length < MIN_PASSWORD_LENGTH){
        response.status(400).json({error: 'invalid password length'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })
    
    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users)
})

module.exports = userRouter