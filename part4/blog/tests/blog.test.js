const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('node:assert')
const helper = require('./test_helper')
const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
	const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
	const promiseArray = blogObjects.map(blog => blog.save())
	await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blog')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

after(async () => {
    await mongoose.connection.close()
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blog')
    assert.strictEqual(response.body.length, 3)
})

test('a single blog post can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
	const blogToView = await blogsAtStart[0]

	const resultBlog = await api
		.get(`/api/blog/${blogToView.id}`)
		.expect(200)
		.expect('Content-Type', /application\/json/)

	assert.deepStrictEqual(resultBlog.body, blogToView)
}) // Note that this test also verifies that the unique identifier is now set to id, as per exercise 4.9

test('a single blog post can be added', async() => {
	const blogToAdd = {
		title : 'FullStackOpen Lesson',
		author : 'University of Helinski',
		url : 'https://fullstackopen.com/en/part4/testing_the_backend#refactoring-the-route-responsible-for-adding-a-note',
		likes : 12,
	}

	await api // test that the note is properly added
		.post('/api/blog/')
		.send(blogToAdd)
		.expect(201)
	
	const blogsAtEnd = await helper.blogsInDb() // ensure that we have added the additional entry into db
	assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

	const titles = blogsAtEnd.map(blog => blog.title) // extract the titles of each blog
	assert(titles.includes('FullStackOpen Lesson'))
})

test('blog with undefined likes will be set to 0', async() => {
	const blogToAdd = {
		title : 'FullStackOpen Lesson',
		author : 'University of Helinski',
		url : 'https://fullstackopen.com/en/part4/testing_the_backend#refactoring-the-route-responsible-for-adding-a-note',
	}

	await api // test that the note is properly added
		.post('/api/blog/')
		.send(blogToAdd)
		.expect(201)
	
	const blogsAtEnd = await helper.blogsInDb()
	const endSize = blogsAtEnd.length
	const likes = blogsAtEnd.map(blog => blog.likes)
	assert.strictEqual(likes[endSize - 1], 0)
})

test.only('blog with undefined title will result in 400 error', async() => {
	const blogToAdd = {
		author : 'University of Helinski',
		url : 'https://fullstackopen.com/en/part4/testing_the_backend#refactoring-the-route-responsible-for-adding-a-note',
	}

	await api
		.post('/api/blog/')
		.send(blogToAdd)
		.expect(400)
	
	const blogsAtEnd = await helper.blogsInDb() // check that no new blogs were added
	assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)	
})

test.only('blog with undefined url will result in 400 error', async() => {
	const blogToAdd = {
		title : 'FullStackOpen Lesson',
		author : 'University of Helinski',
	}

	await api
		.post('/api/blog/')
		.send(blogToAdd)
		.expect(400)
	
	const blogsAtEnd = await helper.blogsInDb() // check that no new blogs were added
	assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)	
})