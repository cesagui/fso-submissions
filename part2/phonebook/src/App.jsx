import { useState, useEffect } from 'react'
import Persons from './components/persons'
import Form from './components/form'
import Filter from './components/filter'
import numberService from './services/numbers'

const App = () => {
  const hook = () => {
    console.log('effect')
    numberService
      .getAll()
      .then(response =>{
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
      const newId = persons.length == 0 ? 1 : persons[persons.length - 1].id + 1
      const personObject = {
        name: newName,
        id: newId,
        number: newNumber,
      }
      setPersons(persons.concat(personObject));
      setNewName('')
      setNewNumber('')

      numberService.
        create(personObject)
        .then(response => {
          console.log(response)
        })
    }

  }

  const handleDeleteOf = (id) => {
    console.log(`${id} needs to be deleted`)
    numberService.deletePerson(id)
      .then(response => {
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch(error => {
        console.log('Error deleting from', error)
      })
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
      <Persons 
        persons = {persons}
        filter = {newFilter}
        handleDelete = {handleDeleteOf}
      />
    </div>
  )
}

export default App