import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)
	const [blogs, setBlogs] = useState([])

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
			console.log('wrong login credentials')
		}
	}

	const handleLogout = (event) => {
		event.preventDefault()
		console.log('attempting logout')
		setUser(null)
		window.localStorage.setItem(
			'loggedBlogappUser', ''
		)
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
			<h2>blogs</h2>
			<p>{user.name} logged in <button onClick = {handleLogout}>Logout</button></p>
			{blogs.map(blog =>
				<Blog key={blog.id} blog={blog} />
			)}
		</div>
	)

	return (
		<div>
			{!user && loginForm()}
			{user && blogDisplay()}
		</div>
	)
}

export default App