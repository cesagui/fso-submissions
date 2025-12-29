import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Toggleable from './components/Toggleable'

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
        blogService.getAll().then(blogs => {
            blogs.sort((a, b) => b.likes - a.likes)
            setBlogs(blogs)
        }
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
            setTimeout(() => {
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
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        } catch (error) {
            console.log('Error:', error)
            setMessage('Error creating blog')
            setError(true)
            setTimeout(() => {
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

    const handleDeleteBlog = (id) => {
        setBlogs(blogs.filter(blog => blog.id !== id))
    }

    const loginForm = () => {
        return (
            <Toggleable buttonLabel="log-in">
                <LoginForm
                    handleSubmit={handleLogin}
                    handleUserChange={({ target }) => setUsername(target.value)}
                    handlePasswordChange={({ target }) => setPassword(target.value)}
                    username={username}
                    password={password}
                />
            </Toggleable>
        )
    }

    const blogDisplay = () => (
        <div>
            <Toggleable buttonLabel="new blog">
                <BlogForm
                    handleSubmit={handleNewBlog}
                    handleAuthorChange={({ target }) => setBlogAuthor(target.value)}
                    handleTitleChange={({ target }) => setBlogTitle(target.value)}
                    handleUrlChange={({ target }) => setBlogUrl(target.value)}
                    title={blogTitle}
                    author={blogAuthor}
                    url={blogUrl}
                />
            </Toggleable>
            <h2>blogs</h2>
            <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} loggedUser={user.username} onDelete={handleDeleteBlog} />
            )}
        </div>
    )

    return (
        <div>
            <Notification message={message} isError={isError} />
            {!user && loginForm()}
            {user && blogDisplay()}
        </div>
    )
}

export default App