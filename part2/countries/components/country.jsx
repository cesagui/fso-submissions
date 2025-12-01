import { useState,useEffect } from "react"
import CountryService from "../services/countries"
import WeatherService from "../services/weather"
import weather from "../services/weather"

const Country = ({name}) => {
    const [countryData, setCountryData] = useState(null)
    const [weatherData, setWeatherData] = useState(null)
    
    useEffect(() => {
        CountryService.getCountry(name)
        .then(response => {
            setCountryData(response.data)
            
        })
        
    }, [name])

    // separate effect when countrydata changes
    useEffect(() => {
        if (countryData){
            const [lat, long] = countryData.capitalInfo.latlng

            WeatherService.getWeatherInfo(lat, long)
            .then(response => {
                setWeatherData(response.data)
                console.log(`${weatherData}`)
            })
            
        }
    }, [countryData])

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
            <WeatherDataRender capitalName = {countryData.capital} weatherData = {weatherData}/>
        </div>
    )
}

const WeatherDataRender = ({capitalName, weatherData}) => {
    if (!weatherData) {
        return (
            <div>
                <h2>Weather in {capitalName}</h2>
                Loading weather...
            </div>
        )
    } else {
        const rawTemp = weatherData.main.temp - 273.15
        const temperature = rawTemp.toFixed(2)
        const windSpeed = weatherData.wind.speed
        const iconCode = weatherData.weather[0].icon
        const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
        return (
        <div>
            <h2>Weather in {capitalName}</h2>
            <p>Temperature {temperature} Celsius</p>
            <img src = {iconURL}></img>
            <p>Wind: {windSpeed}</p>
        </div>
    )
    }
    
}

export default Country