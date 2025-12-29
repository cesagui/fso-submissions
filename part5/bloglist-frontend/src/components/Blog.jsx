import { useState, useEffect } from 'react'
import UserService from '../services/users'
import BlogService from '../services/blogs'

const Blog = ({ blog }) => {
    const [user, setUser] = useState(null) // used to store the user associated that created this blog
    const [blogObject, setBlog] = useState(blog) // used to store the blogObject
    const [visible, setVisible] = useState(false) // related to visibility

    
    useEffect(() => { // used to fetch the user data upon first render
        UserService.getUser(blog.user.id)
            .then(response => setUser(response.data))
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

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }
    const hideWhenVisible = {display : visible ? 'none' : ''}
    const showWhenVisible = {display : visible ? '' : 'none'}

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
            </div>
        </div> 
    )
} 

export default Blog