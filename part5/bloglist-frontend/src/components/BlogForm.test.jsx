import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { describe, expect, test, vi } from 'vitest'

describe('<BlogForm />', async () => {
    test('handle submit', async () => {
        const createBlog = vi.fn()
        render(<BlogForm createNewBlog = {createBlog}/>)

        const user = userEvent.setup()
        const createButton = await screen.findByRole('button', { name: 'create' })

        const titleField = await screen.findByLabelText('title:', {exact: false})
        const authorField = await screen.findByLabelText('author:', {exact: false})
        const urlField = await screen.findByLabelText('url:', {exact: false})
        
        // type in params into fields
        await user.type(titleField, 'test-title')
        await user.type(authorField, 'test-author')
        await user.type(urlField, 'test-url')

        await user.click(createButton)
        
        const expectedInput = {
            title: 'test-title',
            author: 'test-author',
            url: 'test-url',
        }
        expect(createBlog.mock.calls).toHaveLength(1) // check that function has only been called once
        expect(createBlog.mock.calls[0][0]).toStrictEqual(expectedInput) // check the function is called as expected

        console.log(createBlog.mock.calls)
    })
})