const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, showBlog, hideBlog, getBlogLikes, likeBlog, deleteBlog, logOut , getRanks} = require('./helper')
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
            await createBlog(page, 'test-title-one', 'test-author-one', 'test-url')
        })

        test('blog can be created', async ({page}) => {
            await expect(page.getByText('test-title-one test-author-one')).toBeVisible()
        })

        test('blog can be liked', async ({page}) => {
            await showBlog(page, 'test-title-one', 'test-author-one')
            await expect(page.getByText('test-url')).toBeVisible() // tests that show/hide works

            const beforeLikes = await getBlogLikes(page, 'test-title-one', 'test-author-one')
            expect(beforeLikes).toEqual(0)

            await likeBlog(page, 'test-title-one', 'test-author-one')
            await likeBlog(page, 'test-title-one', 'test-author-one')

            const afterLikes = await getBlogLikes(page, 'test-title-one', 'test-author-one')
            expect(afterLikes).toEqual(2)
            
            // await hideBlog(page, 'test-title', 'test-author')
        })

        test('blog can be deleted', async ({page}) => {
            await showBlog(page, 'test-title-one', 'test-author-one')
            await deleteBlog(page, 'test-title-one', 'test-author-one')
            const locator = page.getByText('test-title-one test-author-one').locator('..')
            await expect(locator).toHaveCount(0)
        })

        test('blogs are ranked by like count', async ({page}) => {
            // create two more blogs
            await createBlog(page, 'test-title-two', 'test-author-two', 'test-url')
            await createBlog(page, 'test-title-three', 'test-author-three', 'test-url')
            // like the first blog once
            await showBlog(page, 'test-title-one', 'test-author-one')
            await likeBlog(page, 'test-title-one', 'test-author-one')
            await hideBlog(page, 'test-title-one', 'test-author-one')
            // like the second blog twice
            await showBlog(page, 'test-title-two', 'test-author-two')
            await likeBlog(page, 'test-title-two', 'test-author-two')
            await likeBlog(page, 'test-title-two', 'test-author-two')
            await hideBlog(page, 'test-title-two', 'test-author-two')
            // like the third blog three times
            await showBlog(page, 'test-title-three', 'test-author-three')
            await likeBlog(page, 'test-title-three', 'test-author-three')
            await likeBlog(page, 'test-title-three', 'test-author-three')
            await likeBlog(page, 'test-title-three', 'test-author-three')
            await hideBlog(page, 'test-title-three', 'test-author-three')
            // retrieve the rankings of each 'title author' pair
            // getRanks(page, [strings])
            // expect getRanks to return [3, 2, 1]
            const titles = ['test-title-one', 'test-title-two', 'test-title-three']
            const ranks = await getRanks(page, titles)
            expect(ranks).toEqual([3, 2, 1])
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
