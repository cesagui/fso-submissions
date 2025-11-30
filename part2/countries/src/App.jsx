import Filter from "../components/filter"
import Content from "../components/content"
import CountryService from '../services/countries'
import { useEffect, useState } from 'react'

const App = () => {
  const hook = () => {
    console.log('SOMETHING PLEASE')
      CountryService
        .getAll()
        .then(response => {
            setCountries(response.data)
        })
  }

  useEffect(hook, []);
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('')

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  if (countries.length == 0){
    return (
      <div>Loading...</div>
    )
  } else {
    return (
      <div>
        <Filter
          filter = {filter}
          onFilterChange = {handleFilterChange}
        />
        <Content
          countries = {countries}
          filter = {filter}
        />
      </div>
    )
  }
  
}

export default App