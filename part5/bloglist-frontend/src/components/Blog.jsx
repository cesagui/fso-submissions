import { useState, useEffect } from 'react'
import Toggleable from './Toggleable'
import UserService from '../services/users'

const Blog = ({ blog }) => {
    const [user, setUser] = useState(null) // used to store the user associated with user
    const [visible, setVisible] = useState(false) // related to visibility

    
    useEffect(() => { // used to fetch the user data upon first render
        UserService.getUser(blog.user.id)
            .then(response => setUser(response.data))
    }, [blog.user.id]) // effect is ran whenever blog.user.id changes

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const handleLike = () => {
        console.log('like!')
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
            {blog.title} {blog.author}  
            <span>
                <button style = {hideWhenVisible} onClick = {toggleVisibility}>show</button>
                <button style = {showWhenVisible} onClick = {toggleVisibility}>hide</button>
            </span>
            <div style = {showWhenVisible}>
                <p>{blog.url}</p>
                <p>likes {blog.likes} <button onClick = {handleLike}>like</button></p>
                <p>{user.name}</p>
            </div>
        </div> 
    )
} 

export default Blog