import { useEffect, useState } from "react"



function HaveTeam({teamid})
{

    const [teamPart, setTeamPart] = useState('')
    const [projects, setProjects] = useState('')

    const [projectName, setProjectName] = useState('')
    const [projectDescription, setProjectDescription] = useState('')

    const SERVER = 'http://localhost:8080'
    var update=1;

    async function setTeamName()
    {
        const requestOptions = {method: 'GET'}
        const response = await fetch(`${SERVER}/admin/teams/${teamid}`,requestOptions)
        const data = await response.json()
        console.log(data.message)
        setTeamPart(data.message)
    }

    useEffect(()=>{
        setTeamName();
        getProjects();
       
    },[1])
    useEffect(()=>{
        displayProjects();
    },[projects])

    async function getProjects(){
        const requestOptions = {method: 'GET',headers:{auth:teamid}}
        const response = await fetch(`${SERVER}/admin/projectsTeam`,requestOptions)
        const data = await response.json()
        console.log(data)
        setProjects(data)
        
      }
    
      function displayProjects()
      {
        let divProjects = document.getElementById("proiects");
        let someText=`<ul>`;
        Object.entries(projects).forEach(([key, value]) => {
            someText+=`<li>`
             someText += value.projectName + " - "+ value.description;
             someText+=`</li>`

        })
        someText+=`</ul>`
        divProjects.innerHTML=someText
      }

      async function addProject(projectname, description)
      {
        const requestOptions = {method: 'POST',headers:{"Content-Type":"application/json"},body:JSON.stringify({teamId:teamid,projectName:projectname, description:description})}
        const response = await fetch(`${SERVER}/admin/projects`,requestOptions)
        const data = await response.json()
        console.log(data)
        getProjects();
      }
    

    return (
        <div> Bun venit! Faci parte din echipa <b>{teamPart}</b><br></br>
        Proiectele echipei: <br></br>

        <div id='proiects'>
        </div>
        --------------
        <br></br>
        <div>
        <input type='text' placeholder='Name of the project' onChange={(evt) => setProjectName(evt.target.value)} />
        <input type='text' placeholder='Project description' onChange={(evt) => setProjectDescription(evt.target.value)} />
        <input type="button" value="Adauga Proiect" onClick={()=>addProject(projectName,projectDescription)} />
        </div>
       <br></br>
        <input type="button" value="Verifica proiectul selectat pentru tine." onClick={()=>{}} />
        
        </div>
        
    )
}

export default HaveTeam