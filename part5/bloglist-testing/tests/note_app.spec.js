const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, showBlog, hideBlog, getBlogLikes, likeBlog, deleteBlog, logOut } = require('./helper')
const { before } = require('node:test')


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
            await createBlog(page, 'test-title', 'test-author', 'test-url')
        })

        test('blog can be created', async ({page}) => {
            await expect(page.getByText('test-title test-author')).toBeVisible()
        })

        test('blog can be liked', async ({page}) => {
            await showBlog(page, 'test-title', 'test-author')
            await expect(page.getByText('test-url')).toBeVisible() // tests that show/hide works

            const beforeLikes = await getBlogLikes(page, 'test-title', 'test-author')
            expect(beforeLikes).toEqual(0)

            await likeBlog(page, 'test-title', 'test-author')
            await likeBlog(page, 'test-title', 'test-author')

            const afterLikes = await getBlogLikes(page, 'test-title', 'test-author')
            expect(afterLikes).toEqual(2)
            
            // await hideBlog(page, 'test-title', 'test-author')
        })

        test('blog can be deleted', async ({page}) => {
            await showBlog(page, 'test-title', 'test-author')
            await deleteBlog(page, 'test-title', 'test-author')
            const locator = page.getByText('test-title test-author').locator('..')
            await expect(locator).toHaveCount(0)
        })
    })

    describe('multiple users', async () => {
        beforeEach(async ({page, request}) => {
            await request.post('http://localhost:3003/api/users/', {
                data : {
                    name: 'TESTER-TWO',
                    username: 'test-user-two',
                    password: 'test-password-two'
                }
            })
            await page.goto('http://localhost:5173')
        })
        test('only original user will see delete button', async ({page}) => {
            // login with user 1
            await loginWith(page, 'test-user', 'test-password')
            // create a blog
            await createBlog(page, 'test-title', 'test-author', 'test-url')
            // show the blog
            await showBlog(page, 'test-title', 'test-author')
            // check for the button
            await expect(page.getByText('i can be deleted!!!')).toBeVisible()
            // logout
            await logOut(page)
            // login with user 2
            await loginWith(page, 'test-user-two', 'test-password-two')
            // show the blog
            await showBlog(page, 'test-title', 'test-author')
            // check that the blog won't see the button
            const locator = page.getByText('i can be deleted!!!')
            await expect(locator).not.toBeVisible()
        })
    })
})
