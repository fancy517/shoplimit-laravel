export const clearCookie = (name, domain, path) => {
  let date = +new Date()
  document.cookie = name + '=; expires=' + date + '; domain=' + domain + '; path=' + path
}

export const setCookie = (name, value) => {
  sessionStorage.setItem(name, value)
}

export const checkAuthToken = () => {
  const token = getCookie('token')
  if (token === null) {
    return false
  } else {
    return true
  }
}

export const checkAgentProfile = () => {
  const agent = getCookie('agentId')
  if (agent === '') {
    return false
  } else {
    return true
  }
}

export const getCookie = value => {
  return sessionStorage.getItem(value)
}
