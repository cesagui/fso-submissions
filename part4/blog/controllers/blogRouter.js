const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
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


// blogRouter.post('/', (request, response) => {
//   const blog = new Blog(request.body)

//   blog.save().then((result) => {
//     response.status(201).json(result)
//   })
// })

blogRouter.post('/', async (request, response) => {
	const blog = new Blog(request.body)
	const savedBlog = await blog.save()
	response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async(request, response) => {
	await Blog.findByIdAndDelete(request.params.id)
	response.status(204).end()
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