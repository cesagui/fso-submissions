const express = require('express')
const app = express()
app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateID = (max) => {
    return String(Math.trunc(Math.random() * max))
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/phonebook', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const size = Object.keys(persons).length
    const timeStamp = Date.now()
    response.send(`<p>Phonebook has info for ${size} people</p><p>${new Date(timeStamp)}</p>`)
    //response.send(``)
})

app.get('/api/phonebook/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    
    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/phonebook/', (request,response) => {
    const body = request.body

    if (!body.name){
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number){
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = {
        id: generateID(10000),
        name: body.name,
        number: body.number,
    }
    
    persons = persons.concat(person)
    response.json(person)
    
})

app.delete('/api/phonebook/:id',  (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})