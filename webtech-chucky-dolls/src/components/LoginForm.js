import { useState } from "react"
import { useDispatch } from 'react-redux'
import { loginUser } from "../actions/actions"

function LoginForm ({setToken}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    async function mama(){
      let ceva = await dispatch(loginUser(username,password))
      if (ceva.value.token)
      {
        console.log(ceva.value.token)
        setToken(ceva.value.token)
      }
      
     

    }



    
      return (
        <div>
          Username:
          <input type='text' onChange={(evt) => setUsername(evt.target.value)} />
          <br></br>
          Password:
          <input type='password' onChange={(evt) => setPassword(evt.target.value)} />
          <br></br>
          <input type='button' value='Login' onClick={() => mama()} />
        </div>
      )
    
    

}

export default LoginForm