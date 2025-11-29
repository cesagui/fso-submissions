import { useState, useEffect } from 'react'
import axios from 'axios'
import Persons from './components/persons'
import Form from './components/form'
import Filter from './components/filter'

const App = () => {
  const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }

  useEffect(hook, [])
  
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // check if the person exists in our persons object already
    if(persons.some(person => person.name == newName)){
      alert (`${newName} is already added to the phonebook`);
    } else {
      const personObject = {
        name: newName,
        id: persons.length + 1,
        number: newNumber,
      }
      setPersons(persons.concat(personObject));
      setNewName('')
      setNewNumber('')

      axios.
        post('http://localhost:3001/persons', personObject)
        .then(response => {
          console.log(response)
          console.log('HI!')
        })
    }

  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        filter = {newFilter}
        onFilterChange = {handleFilterChange}
      />
      <h2>Add a new</h2>
      
      <Form
        onSubmit = {handleFormSubmit}
        onNameChange = {handleNameChange}
        onNumberChange = {handleNumberChange}
        name = {newName}
        number = {newNumber}
      />
      <h2>Numbers</h2>
      <Persons persons = {persons} filter = {newFilter}/>
    </div>
  )
}

export default App