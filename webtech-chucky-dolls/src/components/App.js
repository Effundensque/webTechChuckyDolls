import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch , useSelector } from 'react-redux';
import '../style/App.css';
import LoginForm from './LoginForm'
import AfterLogin from './AfterLogin';

function App() {
  const [token, setToken] = useState('')
  const [user_name, setUser_Name] = useState('')
  const dispatch = useDispatch()
  const SERVER = 'http://localhost:8080'
  
  async function callApi(){
    const requestOptions = {method: 'GET',
    headers:
    {
      "auth": token
    }
    }
    const response = await fetch(`${SERVER}/api/whologgedin`,requestOptions)
    const data = await response.json()
    setUser_Name(data.message)
    
  }

  useEffect(()=>{
    callApi();
  },[token])

  useEffect(()=>{
    console.log(user_name)
  },[user_name])


  

  if (token!=='')
  {
    return (<AfterLogin />)

  }
  else
  {
    return (
      <div>
        {/* <input type='button' value='Who is it?' onClick={() => dispatch(GetLoggedIn())} /> */}
        <LoginForm setToken={setToken} />
       
      </div>
  
  );
  }
  
}

export default App;
