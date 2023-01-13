import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch , useSelector } from 'react-redux';
import '../style/App.css';
import LoginForm from './LoginForm'
import AfterLogin from './AfterLogin';

function App() {
  const [token, setToken] = useState('')
  const [user_name, setUser_Name] = useState('')
  const [user_id, setUser_ID] = useState(1)
  const dispatch = useDispatch()
  const SERVER = 'http://localhost:8080'
  
  async function callApi(){
    const requestOptions = {method: 'GET',
    headers:
    {
      "auth": token
    }
    }
    const response1 = await fetch(`${SERVER}/api/whologgedinID`,requestOptions)
    const data1 = await response1.json()
    const response = await fetch(`${SERVER}/api/whologgedin`,requestOptions)
    const data = await response.json()
    
    console.log(data)
    console.log(data1)
    setUser_Name(data.message)
    setUser_ID(data1.message)
    
  }

  useEffect(()=>{
    callApi();
  },[token])

  useEffect(()=>{
    console.log( "User: " + user_name)
  },[user_name])


  

  if (token!=='')
  {
    return (<AfterLogin userName={user_name} userId={user_id}/>)

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
