import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import UserService from '../services/users'
import BlogService from '../services/blogs'
import { beforeEach, test, vi } from 'vitest'

vi.mock('../services/users')
/*
    whenever any file tries to import ../services/users give them a mock INSTEAD
    all the functions of userService now become functions that i can directly control the output of
    
*/
vi.mock('../services/blogs')
describe('<Blog />', () => {
    const blog = {
        title: 'test-title',
        author: 'test-author',
        url: 'test-url',
        likes: 12,
        user: {
            id: 'test-user-id'
        }
    }

    beforeEach(() => {
        UserService.getUser.mockResolvedValue({
            data: {
                name: 'Test User',
                username: 'testuser'
            }
        })
        BlogService.put.mockResolvedValue({
            data: {
                title: 'test-title',
                author: 'test-author',
                url: 'test-url',
                likes: 12,
                user: {
                    id: 'test-user-id'
                }
            }
        })
        const dummy = (() => {})
        console.log('Rendering component')
        render(
            <Blog
                blog = {blog}
                loggedUser = 'not-testuser'
                onDelete = {dummy}
            />
        )
    })

    test('component is fetched', async () => {
        const blogComponent = await screen.findByText('test-title', {exact: false})
        expect(blogComponent).toBeDefined()
    })
    
    test('likes and URL are not visible prior to click', async () => {
        const invisible = [blog.url, 'likes']
        // check url,likes that should be invisible
        for (const s of invisible) {
            const component = await screen.findByText(s, {exact: false})
            expect(component).not.toBeVisible()
        }
    })

    test('author and title are visible prior to click', async () => {
        const visible = [blog.title, blog.author]

        // check author, title that should be invisible
        for (const s of visible) {
            const component = await screen.findByText(s, {exact: false})
            expect(component).toBeVisible()
        }
    })
    
    test('likes, URL, author, title are visible after click', async () => {
        // simulate button click
        const u = userEvent.setup()
        const button = await screen.findByText('show', {exact: false})
        await u.click(button)

        const visible = [blog.url, 'likes', blog.author, blog.title]
        // check url, likes that should be invisible
        for (const s of visible) {
            const component = await screen.findByText(s, {exact: false})
            expect(component).toBeVisible()
        }
    })

    test('like button is clicked twice, event handler is called twice', async () => {
        const u = userEvent.setup()
        // track the mockcalls before clicking the like button
        const showButton = await screen.findByText('show', {exact: false})
        await u.click(showButton)

        const likeButton = await screen.findByRole('button', { name: 'like' })

        await u.click(likeButton)
        await u.click(likeButton)

        // check that two calls are made
        expect(BlogService.put.mock.calls).toHaveLength(2)
    })
})
