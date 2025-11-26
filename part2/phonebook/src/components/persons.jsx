const Persons = ({persons, filter}) => {
    const filteredPersons = persons.filter(person =>
        person.name.toLowerCase().startsWith(filter.toLowerCase())
    )
    return (
        <div>
            {filteredPersons.map(person => <PersonEntry key = {person.id} person = {person}/>)}
        </div>   
    )
}   

const PersonEntry = ({person}) => {
  return(
    <div> {person.name} | {person.number}</div>
  )
}

export default Persons