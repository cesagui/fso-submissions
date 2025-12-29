import axios from 'axios'
const baseUrl = '/api/users'

const getUser = async (id) => {
    let user = await axios(`${baseUrl}/${id}`)
    return user
}

export default {
    getUser
}