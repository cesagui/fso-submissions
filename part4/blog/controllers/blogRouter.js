const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user')
	response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
	const blog = await Blog.findById(request.params.id)
	if (blog) {
		response.json(blog)
	} else {
		response.status(404).end()
	}
})

blogRouter.post('/', async (request, response) => {
	const body = request.body
	// const decodedToken = jwt.verify(request.token, process.env.SECRET)
	// if (!decodedToken.id) {
	// 	return response.status(401).json({ error: 'token invalid'})
	// }
	// let user = await User.findById(decodedToken.id)

	if (!request.user){
		// if no user is defined, get a random user ID
		const allUsers = await User.find({})
		const usersCount = allUsers.length
		
		const randomIndex = Math.floor(Math.random() * usersCount)
		request.user = await User.findById(allUsers[randomIndex]._id)
	}

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: request.user._id
	})

	const savedBlog = await blog.save()

	request.user.blogs = request.user.blogs.concat(savedBlog._id)
	await request.user.save()

	response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async(request, response) => {
	// const decodedToken = jwt.verify(request.token, process.env.SECRET)
	if (!request.user) {
		return response.status(401).json({ error: 'token invalid'})
	}
	// let userid = decodedToken.id

	let blog = await Blog.findById(request.params.id)

	if (blog.user.toString() === request.user.id.toString()){
		await Blog.findByIdAndDelete(request.params.id)
		return response.status(204).end()
	} else {
		return response.status(401).json({ error: `cannot delete other's blogs`})
	}
	
	
})


blogRouter.put('/:id', async(request, response) => {
	const likes = request.body.likes
	const blog = await Blog.findById(request.params.id)
	if (blog) {
		blog.likes = likes
		const savedBlog = await blog.save()
		response.json(savedBlog)
	} else {
		response.status(404).end()
	}
})
module.exports = blogRouter