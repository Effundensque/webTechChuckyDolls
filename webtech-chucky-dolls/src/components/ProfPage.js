import { useState, useEffect } from "react"


function ProfPage()
{
    const[projects, setProjects] = useState('')
    const SERVER = 'http://localhost:8080'

    useEffect(()=>{
        getAllProjects();
    },[1])

    async function getAllProjects()
    {
        const requestOptions = {method: 'GET'}
        const response = await fetch(`${SERVER}/admin/projects`,requestOptions)
        const data = await response.json()
        console.log(data)
        setProjects(data)
    }

    return(<div>
        {
            Object.entries(projects).map((e)=>(
              <ul className="list-group">
              <li className="list-group-item" key={e[1].id}>
              {e[1].projectName } - Description: {e[1].description}
              <b> - Grade: {e[1].finalGrade} </b>
            </li>
              </ul>
              
              ))
          }
              <input className="btn btn-dark" value="Logout" type="button" onClick={()=>{window.location.reload()}}></input>

        </div>)
}


export default ProfPage