import axios from 'axios'
import config from '../config'

const tokenObject = JSON.parse(localStorage.getItem('x-authentication'))

export const axiosInstance = () => {
  return axios.create({
    baseURL: `${config.apiUrl}/v1`,
    headers: {
      'x-authentication': tokenObject
        ? tokenObject['token']
        : null
    }
  })
}
