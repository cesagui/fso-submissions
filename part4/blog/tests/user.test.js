const bcrypt = require('bcryptjs')
const User = require('../models/user')
const assert = require('node:assert')
const helper = require('./test_helper')
const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('when there is only one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('myTestPassword', 10)
        const user = new User({username: 'root', passwordHash})

        await user.save()
    })

    test('creation succeeds with fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = ({
            username: 'cesagui',
            name: 'Cesar Aguirre',
            password: 'iLoveCodingInJavaScript'
        })

        await api
            .post('/api/user')
            .set('Authorization', `${requestToken}`)
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with short password length', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = ({
            username: 'cesagui',
            name: 'Cesar Aguirre',
            password: 'JS'
        })

        await api
            .post('/api/user')
            .send(newUser)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

        const usernames = usersAtEnd.map(user => user.username)
        assert(!usernames.includes(newUser.username))
    })

    test('creation fails with short username length', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = ({
            username: 'ca',
            name: 'Cesar Aguirre',
            password: 'ILoveJS'
        })

        await api
            .post('/api/user')
            .send(newUser)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

        const usernames = usersAtEnd.map(user => user.username)
        assert(!usernames.includes(newUser.username))
    })
})

describe('blog adds a random user', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('myTestPassword', 10)
        const user = new User({username: 'root', passwordHash})

        await user.save()
    })

    test.only('creating new blog with defined id associates the ID', async () => {
        const allUsers = await helper.usersInDb();
        const newBlog = {
            title: 'Why FullStackOpen is so Awesome',
            author: 'Cesar A',
            url: 'mywebsite.com',
            likes: '42',
            user: allUsers[0]._id // should fetch the root ID
        }
        
    })
})
after(async () => {
    await mongoose.connection.close()
})