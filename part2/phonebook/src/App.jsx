import { useState } from 'react'
import Persons from './components/persons'
import Form from './components/form'

const App = () => {
  const [persons, setPersons] = useState([
    {
      name: 'Arto Hellas', 
      id: 0,
      number: '123-456-7890'
    },
    {
      name: 'Barrington Hendricks', 
      id: 1,
      number: '123-456-7890'
    },
    {
      name: 'Carti', 
      id: 2,
      number: '123-456-7890'
    }
  ]) 

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
        id: persons.length,
        number: newNumber,
      }
      setPersons(persons.concat(personObject));
      setNewName('')
      setNewNumber('')
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
        <div>
          filter shown with
          <input value = {newFilter} onChange = {handleFilterChange}/>
        </div>
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