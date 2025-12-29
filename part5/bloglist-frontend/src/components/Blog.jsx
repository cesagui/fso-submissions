import { useState, useEffect } from 'react'
import UserService from '../services/users'
import BlogService from '../services/blogs'

const Blog = ({ blog, loggedUser, onDelete }) => {
    const [user, setUser] = useState(null) // used to store the user associated that created this blog
    const [blogObject, setBlog] = useState(blog) // used to store the blogObject
    const [visible, setVisible] = useState(false) // related to visibility

    const [deleteable, setDeletable] = useState(false);

    useEffect(() => { // used to fetch the blog's user data upon first render
        UserService.getUser(blog.user.id)
            .then(response => {
                setUser(response.data)
                setDeletable(response.data.username === loggedUser) // make the component deletable if loggedUser is the same blog's user's username
            })
    }, [blog.user.id]) // effect is ran whenever blog.user.id changes

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const handleLike = async () => {
        console.log('like!')
        blogObject.likes++
        const request = {
            title: blogObject.title,
            author: blogObject.author,
            url: blogObject.url,
            likes: blogObject.likes
        }
        // increment the like property of the currentBlog object
        try{
            const resp = await BlogService.put(blogObject.id, request)
            setBlog(resp)
        } catch {
            console.log('error in handling like')
        }
    }

    const handleDelete = async() => {
        if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}?`)) {
            console.log('attempting delete')
            try {
                await BlogService.del(blogObject.id)
                console.log('delete successful')
                onDelete(blogObject.id)
            } catch {
                console.log('error in handling delete')
            }
        }
    }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const hideWhenVisible = {display : visible ? 'none' : ''}
    const showWhenVisible = {display : visible ? '' : 'none'}
    
    const showWhenDeletable = {display : deleteable ? '' : 'none'}

    if (!user) {
        return null
    }

    return (
        <div style = {blogStyle} >
            {blogObject.title} {blogObject.author}  
            <span>
                <button style = {hideWhenVisible} onClick = {toggleVisibility}>show</button>
                <button style = {showWhenVisible} onClick = {toggleVisibility}>hide</button>
            </span>
            <div style = {showWhenVisible}>
                <p>{blogObject.url}</p>
                <p>likes {blogObject.likes} <button onClick = {handleLike}>like</button></p>
                <p>{user.name}</p>
                <button style = {showWhenDeletable} onClick = {handleDelete}>i can be deleted!!!</button>
            </div>
        </div> 
    )
} 

export default Blog