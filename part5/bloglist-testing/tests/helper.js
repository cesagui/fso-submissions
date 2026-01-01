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
    await page.waitForTimeout(500)
    await page.getByRole('button', { name : 'hide' }).click()
}

const showBlog = async (page, title, author) => {
    const parentElement = await page.getByText(`${title} ${author}`)
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

const deleteBlog = async (page, title, author) => {
    const parentElement = await page.getByText(`${title} ${author}`).locator('..')
    page.on('dialog', dialog => dialog.accept());
    await parentElement.getByRole('button', { name : 'i can be deleted!!!'}).click()
    await page.waitForTimeout(500)
}

const logOut = async (page) => {
    await page.getByRole('button', { name : 'Logout'}).click()
}

const generateRanks = (arr) => {
    // returns the elements in rank form
    // create a sorted array of unique elements
    const sortedUnique = [...arr].sort((a ,b) => a - b)

    const rankMap = new Map();
    for (let i = 0; i < sortedUnique.length; i++) {
        // Ranks start from 1
        rankMap.set(sortedUnique[i], i + 1);
    }

    const result = arr.map((element) => rankMap.get(element))
    return result
}

const getRanks = async (page, titleStrings) => {
    /*
        get the inner html of the page
        iterate through each element (each element is a string)
            find at what index the string appears
            
    */

            
    const parentElement = page.getByText(titleStrings[0], { exact: false }).locator('..')
    const returned = []
    console.log(`parentElement: ${parentElement}`)
    const html = await parentElement.innerHTML()
    console.log(html)
    for (const t in titleStrings) {
        const idx = html.indexOf(t)
        returned.push(idx)
    }

    const result = generateRanks(returned)
    return result
}

export {
    loginWith,
    createBlog,
    showBlog,
    hideBlog,
    getBlogLikes,
    likeBlog,
    deleteBlog,
    logOut,
    getRanks
}