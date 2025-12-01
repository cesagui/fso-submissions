import axios from 'axios'

const apiKey = import.meta.env.VITE_WEATHER_KEY;

const getWeatherInfo = (lat, long) => {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`)
}

export default {
    getWeatherInfo: getWeatherInfo,
}