import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const handleForm = (event) => {
        event.preventDefault()
        const content = event.target.content.value
        console.log(`attempting to create new anecdote: ${content}`)
        event.target.content.value = ''
        dispatch(createAnecdote(content))
    }

    return (
    <>
        <h2>create new</h2>
        <form onSubmit={handleForm}>
            <div>
                <input name = 'content' type = 'text'/>
            </div>
            <button type = 'submit'>create</button>
        </form>
    </>
    )
    
}

export default AnecdoteForm