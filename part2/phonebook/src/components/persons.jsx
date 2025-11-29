const Persons = ({persons, filter, handleDelete}) => {
    const filteredPersons = persons.filter(person =>
        person.name.toLowerCase().startsWith(filter.toLowerCase())
    )
    return (
        <div>
            {filteredPersons.map(person => <PersonEntry key = {person.id} person = {person} onClick = {() => {handleDelete(person.id)}}/>)}
        </div>   
    )
}   

const PersonEntry = ({person, onClick}) => {
  return(
    <div> {person.name} | {person.number} <button onClick = {onClick}>delete</button></div>
  )
}

export default Persons