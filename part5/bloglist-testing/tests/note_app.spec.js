const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, showBlog, hideBlog, getBlogLikes, likeBlog, } = require('./helper')


describe('Blog app', async () => {
    beforeEach(async ({page, request}) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users/', {
            data : {
                name: 'TESTER',
                username: 'test-user',
                password: 'test-password'
            }
        })
        
        await page.goto('http://localhost:5173')
    })

    test('front page can be opened', async ({page}) => {
        const button = page.getByText('log-in')
        await expect(button).toBeVisible()
    })

    describe('Login', async () => {
        test('user can login', async ({page}) => {
            await loginWith(page, 'test-user', 'test-password')
            await expect(page.getByText('blogs')).toBeVisible()
        })

        test('login fails with wrong password', async ({page}) => {
            await loginWith(page, 'test-user', 'wrong-password')
            
            await expect(page.getByText('wrong username or password')).toBeVisible()
        })
    })

    describe('Once logged in', async () => {
        beforeEach(async ({page}) => {
            await loginWith(page, 'test-user', 'test-password')
        })

        test('blog can be created', async ({page}) => {
            await createBlog(page, 'test-title', 'test-author', 'test-url')
            await expect(page.getByText('test-title test-author')).toBeVisible()
        })

        test('blog can be liked', async ({page}) => {
            await createBlog(page, 'test-title', 'test-author', 'test-url')
            await showBlog(page, 'test-title', 'test-author')
            await expect(page.getByText('test-url')).toBeVisible() // tests that show/hide works

            const beforeLikes = await getBlogLikes(page, 'test-title', 'test-author')
            expect(beforeLikes).toEqual(0)

            await likeBlog(page, 'test-title', 'test-author')
            await likeBlog(page, 'test-title', 'test-author')

            const afterLikes = await getBlogLikes(page, 'test-title', 'test-author')
            expect(afterLikes).toEqual(2)
        })
    })
})
