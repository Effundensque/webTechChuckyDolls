const SERVER = 'http://localhost:8080'
let mama = ''
export function GetLoggedIn () {
  const requestOptions = {method: 'GET',
  headers:
  {
    "auth": mama
  }
}
  return {
    type: 'GET_LOGGED_IN',
    payload: async () => {
      const response = await fetch(`${SERVER}/api/whologgedin`,requestOptions)
      const data = await response.json()
      return data
    }
  }
}


export function loginUser (username,password) {
  const requestOptions = {method: 'post',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ username: username, password: password})}
  return {
    type: 'LOGIN_USER',
    payload: async () => {
      
      const response = await fetch(`${SERVER}/login`, requestOptions)
      const data = await response.json()
      mama=data.token;
      return data
    }
  }
  }