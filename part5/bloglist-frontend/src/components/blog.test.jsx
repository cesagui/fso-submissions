import { screen, render } from '@testing-library/react'
import Blog from './Blog'
import UserService from '../services/users'
import { vi } from 'vitest'

vi.mock('../services/users')
/*
    whenever any file tries to import ../services/users give them a mock INSTEAD
    all the functions of userService now become functions that i can directly control the output of
    
*/

test('base test', async () =>{
    console.log('Test starting')
    const blog = {
        title: 'test-title',
        author: 'test-author',
        url: 'test-url',
        likes: 12,
        user: {
            id: 'test-user-id'
        }
    }

    UserService.getUser.mockResolvedValue({
        data: {
            name: 'Test User',
            username: 'testuser'
        }
    })
    
    // we are telling our mock userService object to return the data whenever getUser is called
    const dummy = (() => {})

    console.log('Rendering component')
    render(
        <Blog
            blog = {blog}
            loggedUser = 'not-testuser'
            onDelete = {dummy}
        />)
    
    console.log('Waiting for text')
    const blogComponent = await screen.findByText('test-title', {exact: false})
    console.log('Text found')
    expect(blogComponent).toBeDefined()
    
    const invisible = [blog.url, 'likes']
    const visible = [blog.title, blog.author]

    // check url,likes that should be invisible
    for (const s of invisible) {
        const component = await screen.findByText(s, {exact: false})
        expect(component).not.toBeVisible()
    }
    // check author, title that should be invisible
    for (const s of visible) {
        const component = await screen.findByText(s, {exact: false})
        expect(component).toBeVisible()
    }
})