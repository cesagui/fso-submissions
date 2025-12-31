const loginWith = async ( page, username, password ) => {
    await page.getByText('log-in').click()
    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill(password)
    await page.getByText('login').click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name : 'new blog' }).click()
    await page.getByLabel('title:').fill(title)
    await page.getByLabel('author:').fill(author)
    await page.getByLabel('url:').fill(url)
    await page.getByRole('button', { name : 'create' }).click()
}

const showBlog = async (page, title, author) => {
    const parentElement = await page.getByText(`${title} ${author}`).locator('..')
    await parentElement.getByRole('button', { name : 'show' }).click()
}

const hideBlog = async (page, title, author) => {
    const parentElement = await page.getByText(`${title} ${author}`).locator('..')
    await parentElement.getByRole('button', { name : 'hide' }).click()
}

const likeBlog = async (page, title, author) => {
    const parentElement = await page.getByText(`${title} ${author}`).locator('..')
    await parentElement.getByRole('button', { name : 'like' }).click()
    await page.waitForTimeout(500)
}

const getBlogLikes = async (page, title, author) => {
    const parentElement = await page.getByText(`${title} ${author}`).locator('..')
    const likesPar = await parentElement.getByText('likes ', {exact: false}).innerText()
    const likesCount = likesPar.match(/likes (\d+)/)[1]
    // console.log(likesCount)
    const val = parseInt(likesCount)
    return val
}

export {
    loginWith,
    createBlog,
    showBlog,
    hideBlog,
    getBlogLikes,
    likeBlog
}