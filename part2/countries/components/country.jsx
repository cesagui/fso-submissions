import { useState,useEffect } from "react"
import CountryService from "../services/countries"

const Country = ({name}) => {
    const [countryData, setCountryData] = useState(null)
    
    useEffect(() => {
        CountryService.getCountry(name)
        .then(response => {
            setCountryData(response.data)
        })
    }, [name])

    if (!countryData){
        return (
            <div>
                Loading...
            </div>
        )
    }
    return (
        <div>
            <h1>{countryData.name.official}</h1>
            <p>Area: {countryData.area}</p>
            <p>Capital: {countryData.capital}</p>
            <h1>
                Languages:
            </h1>
            <ul>
                {
                    Object.values(countryData.languages).map((language) => 
                        <li key = {language} >
                            {language}
                        </li>
                    )
                }
            </ul>
            
            <img src = {countryData.flags.png} width="100"></img>
        </div>
    )
}

export default Country