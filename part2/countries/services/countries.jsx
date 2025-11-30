import axios from 'axios'
const baseUrl = '../db.json'
const webUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = () => {
    return axios.get(`${baseUrl}`)
}

const getCountry = (country) => {
    return axios.get(`${webUrl}/name/${country}`)
}

export default {
    getAll: getAll,
    getCountry: getCountry,
}