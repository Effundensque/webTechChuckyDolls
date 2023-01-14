import { useEffect, useState } from "react"



function HaveTeam({teamid})
{

    const [teamPart, setTeamPart] = useState('')
    const [projects, setProjects] = useState('')

    const [projectName, setProjectName] = useState('')
    const [projectDescription, setProjectDescription] = useState('')
    const [grade, setGrade] = useState('')

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
        let butonGrade=document.getElementById("butonGrade")
        butonGrade.style.display='none'
        let textGrade=document.getElementById("textGrade")
        textGrade.style.display='none'
       
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


      async function evaluateProject()
      {
        const requestOptions = {method: 'GET',headers:{auth:teamid}}
        const response = await fetch(`${SERVER}/admin/projectsTeamEvaluate`,requestOptions)
        const data = await response.json()
        console.log(data)
       console.log(Object.entries(data).length)
       const project = Math.floor(Math.random() * Object.entries(data).length) + 1;
       console.log(Object.entries(data)[project-1][1].projectName)
       console.log(Object.entries(data)[project-1][1].description)
       let projEval=document.getElementById("proiectDeEvaluat");
       
       projEval.innerHTML=`Vei avea de evaluat: <br></br>
       ${Object.entries(data)[project-1][1].projectName}
       <br></br>
       Description: <br></br>
       ${Object.entries(data)[project-1][1].description}
       <br></br>
       
       `;
       let butonGrade=document.getElementById("butonGrade")
       butonGrade.style.display='block'
       let textGrade=document.getElementById("textGrade")
       textGrade.style.display='block'
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
        <input type="button" value="Verifica proiectul selectat pentru tine." onClick={()=>evaluateProject()} />
        <div id='proiectDeEvaluat'></div>
        <input  id='textGrade'  type='text' placeholder='Grade:' onChange={function (evt) {setGrade(evt.target.value)}} />
        <input id='butonGrade' type="button" value="Give grade" onClick={function (){console.log(grade)}} />
        </div>
        
    )
}

export default HaveTeam