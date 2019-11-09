import axios from 'axios'
import config from '../config'

const getAxiosConfig = () => {
  let token = null
  if (JSON.parse(localStorage.getItem('x-authentication'))) {
    token = JSON.parse(localStorage.getItem('x-authentication'))['token']
  }
  return {
    baseURL: `${config.apiUrl}/v1`,
    headers: {
      'x-authentication': token
    }
  }
}

export const genericGetRequestToApi = url => {
  // console.log('genericGetRequestToApi', url)
  return axios
    .get(url, getAxiosConfig())
    .then(res => {
      // console.log('Get Request Successful', res)
      return res
    })
    .catch(err => {
      console.log('Get Request Error', err)
      return err.response ? err.response : err
    })
}

export const genericPutRequestToApi = (url, payload, config = null) => {
  // console.log('genericPutRequestToApi', url, payload, config)
  let updatedConfig = getAxiosConfig()
  if (config) {
    Object.assign(updatedConfig, config)
  }
  // console.log(updatedConfig)
  return axios
    .put(url, payload, updatedConfig)
    .then(res => {
      console.log('Put Request Successful', res)
      return res
    })
    .catch(err => {
      console.log('Put Request Error', err)
      return err.response ? err.response : err
    })
}

export const genericPostRequestToApi = (url, payload = null, config = null) => {
  console.log('genericPostRequestToApi', url, payload)
  let updatedConfig = getAxiosConfig()
  if (config) {
    Object.assign(updatedConfig, config)
  }
  return axios
    .post(url, payload, updatedConfig)
    .then(res => {
      console.log('Post Request Successful', res)
      return res
    })
    .catch(err => {
      console.log('Post Request Error', err)
      return err.response ? err.response : err
    })
}

export const genericDeleteRequestToApi = url => {
  console.log('genericDeleteRequestToApi', url)
  return axios
    .delete(url, getAxiosConfig())
    .then(res => {
      console.log('Delete Request Successful', res)
      return res
    })
    .catch(err => {
      console.log('Delete Request Error', err.response)
      return err.response ? err.response : err
    })
}
