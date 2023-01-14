import { useState } from "react"
import { useDispatch } from 'react-redux'
import { loginUser } from "../actions/actions"

function LoginForm ({setToken}) {
  const SERVER = 'http://localhost:8080'
  //Login
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // Register
    const [usernameReg, setUsernameReg] = useState('')
    const [passwordReg, setPasswordReg] = useState('')
    const [nameReg, setNameReg] = useState('') 



    const dispatch = useDispatch()

    async function mama(){
      let ceva = await dispatch(loginUser(username,password))
      if (ceva.value.token)
      {
        console.log(ceva.value.token)
        setToken(ceva.value.token)
      }else
      {
        if (ceva.value.message=="unauthorized")
        {
          let erroReg=document.getElementById("erroLogin")
          erroReg.style.color="red"
                erroReg.innerHTML="Invalid credentials!"
        }else
        {
          let erroReg=document.getElementById("erroLogin")
          erroReg.style.color="red"
                erroReg.innerHTML=`${ceva.value.message}`
        }
      }
      
     

    }

    async function register(usernameReg,passwordReg,nameReg)
    {
      const requestOptions = {method: 'GET'}
        const response = await fetch(`${SERVER}/admin/userss`,requestOptions)
        const data = await response.json()
        console.log(data)
        let valid=true;
        Object.entries(data).forEach(([key, value]) => {
          console.log(data[key].username)
          
          if (usernameReg===data[key].username)
          { 
              valid=false;
          }
      })
      if (valid === false)
      {
        let erroReg=document.getElementById("erroReg")
              erroReg.style.color="red"
              erroReg.innerHTML=" Username already exists!"
      }
      else
      {
        
              const requestOptions = {method: 'POST',headers:{"Content-Type":"application/json"}, 
              body:JSON.stringify({username:usernameReg,password:passwordReg,name:nameReg,role:"PM"})}
              const response = await fetch(`${SERVER}/admin/users`,requestOptions)
              const data = await response.json()
              console.log(data)
              if (data)
              {
                let erroReg=document.getElementById("erroReg")
                erroReg.style.color="green"
                      erroReg.innerHTML="User crated, you can now log in!"
              }
              
      }
    }



    
      return (
        <div>
          <div>
          <h3>Login to an existing account:</h3><div id='erroLogin'></div>
          Username:
          <input type='text' onChange={(evt) => setUsername(evt.target.value)} />
          <br></br>
          Password:
          <input type='password' onChange={(evt) => setPassword(evt.target.value)} />
          <br></br>
          <input type='button' value='Login' onClick={() => mama()} />
          </div>
          <div>
          
          <hr></hr>
          <h3>Register a new account:</h3><div id='erroReg'></div>
          Username:
          <input type='text' onChange={(evt) => setUsernameReg(evt.target.value)} />
          <br></br>
          Password:
          <input type='password' onChange={(evt) => setPasswordReg(evt.target.value)} />
          <br></br>
          Name:
          <input type='text' onChange={(evt) => setNameReg(evt.target.value)} />
          <br></br>
          <input type='button' value='Register' onClick={() => register(usernameReg,passwordReg,nameReg)} />
          </div>
          
        </div>
      )
    
    

}

export default LoginForm