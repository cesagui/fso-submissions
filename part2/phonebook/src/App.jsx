import { useState, useEffect } from 'react'
import Persons from './components/persons'
import Form from './components/form'
import Filter from './components/filter'
import numberService from './services/numbers'
import Notification from './components/notification'

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
  const [notification, setNotification] = useState('some notification happened')

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // check if the person exists in our persons object already
    if(persons.some(person => person.name == newName)){
      if (confirm(`${newName} is already in the phonebook, replace the old number with a new one?`)){

        const oldPerson = persons.find(p => p.name == newName)
        console.log(`looking to update ${oldPerson.id}`)
        const newPerson = {...oldPerson, number: newNumber}
        numberService.update(oldPerson.id, newPerson)
        .then(response => {
          setPersons(persons.map(p => p.id == newPerson.id ? newPerson : p))  
          setNewName('')
          setNewNumber('')
          setNotification(`Updated ${newPerson.name}'s number to ${newPerson.number}`)  
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
      }
    } else {
      const newId = persons.length == 0 ? "1" : (parseInt(persons[persons.length - 1].id) + 1).toString()
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
          setNotification(`Added ${personObject.name}`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
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
      <Notification message = {notification}/>
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