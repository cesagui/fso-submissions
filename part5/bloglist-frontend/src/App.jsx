import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
	// login-form associated states
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)

	// blog-form associated states
	const [blogTitle, setBlogTitle] = useState('')
	const [blogAuthor, setBlogAuthor] = useState('')
	const [blogUrl, setBlogUrl] = useState('')

	// blog display assoc. states
	const [blogs, setBlogs] = useState([])

	// notification states
	const [message, setMessage] = useState(null)
	const [isError, setError] = useState(false)

	// handle fetching of blogs from blogService
	useEffect(() => {
		blogService.getAll().then(blogs =>
			setBlogs(blogs)
		)
	}, [])

	// handle first loading of the page
	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			blogService.setToken(user.token)
		}
	}, [])

	const handleLogin = async (event) => {
		event.preventDefault()
		console.log('attempting login with: ', username, password)
		try {
			const user = await loginService.login({ username, password })
			window.localStorage.setItem(
				'loggedBlogappUser', JSON.stringify(user)
			)
			setUser(user)
			setUsername('')
			setPassword('')
		} catch {
			setMessage('wrong username or password')
			setError(true)
			setTimeout(()=>{
				setMessage(null)
				setError(false)
			}, 5000)
		}
	}

	const handleNewBlog = async (event) => {
		event.preventDefault()
		console.log('we want to create a new blog')

		const blogObject = {
			title: blogTitle,
			author: blogAuthor,
			url: blogUrl,
		}
		try {
			const returnedBlog = await blogService.create(blogObject)
			setBlogs(blogs.concat(returnedBlog))
			setBlogTitle('')
			setBlogAuthor('')
			setBlogUrl('')
			setMessage(`A new blog ${returnedBlog.title} by ${returnedBlog.author} has been added`)
			setError(false)
			setTimeout(()=>{
				setMessage(null)
			}, 5000)
		} catch (error) {
			console.log('Error:', error)
			setMessage('Error creating blog')
			setError(true)
			setTimeout(()=>{
				setMessage(null)
				setError(false)
			}, 5000)
		}
	}

	const handleLogout = (event) => {
		event.preventDefault()
		setUser(null)
		window.localStorage.removeItem(
			'loggedBlogappUser'
		)
		setMessage('successfully logged out')
		setError(false)
		setTimeout(() => {
			setMessage(null)
			setError(false)
		}, 5000)
	}

	const loginForm = () => (
		<div>
			<h2>log in to application</h2>
			<form onSubmit={handleLogin}>
				<div>
					<label>
						username
						<input
							type="text"
							value={username}
							onChange={({ target }) => setUsername(target.value)}
						/>
					</label>
				</div>
				<div>
					<label>
						password
						<input
							type="password"
							value={password}
							onChange={({ target }) => setPassword(target.value)}
						/>
					</label>
				</div>
				<button type="submit">login</button>
			</form>
		</div>

	)

	const blogDisplay = () => (
		<div>
			<form onSubmit = {handleNewBlog}>
				<h2>create new blog</h2>
				<div>
					<label>
						title:
						<input
							type="text" 
							value={blogTitle}
							onChange={({ target }) => setBlogTitle(target.value)}
						/>
					</label>
				</div>
				<div>
					<label>
						author:
						<input
							type="text" 
							value={blogAuthor}
							onChange={({ target }) => setBlogAuthor(target.value)}
						/>
					</label>
				</div>
				<div>
					<label>
						url:
						<input
							type="text" 
							value={blogUrl}
							onChange={({ target }) => setBlogUrl(target.value)}
						/>
					</label>
				</div>
				<button type="submit">create</button>

			</form>
			<h2>blogs</h2>
			<p>{user.name} logged in <button onClick = {handleLogout}>Logout</button></p>
			{blogs.map(blog =>
				<Blog key={blog.id} blog={blog} />
			)}
		</div>
	)

	return (
		<div>
			<Notification message = {message} isError = {isError}/>
			{!user && loginForm()}
			{user && blogDisplay()}
		</div>
	)
}

export default App