import { useEffect, useState } from "react"



function HaveTeam({teamid})
{

    const [teamPart, setTeamPart] = useState('')
    const [projects, setProjects] = useState('')

    const [projectName, setProjectName] = useState('')
    const [projectDescription, setProjectDescription] = useState('')

    const [grade, setGrade] = useState('')
    const [evaluatProjId, setEvaluatProjId] = useState('')
    const [giveGrade, setGiveGrade] = useState('')

    const SERVER = 'http://localhost:8080'

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
       
    },[])
    useEffect(()=>{
        displayProjects();
    },[projects])

    useEffect(()=>{
console.log(giveGrade)
    },[giveGrade])




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
             someText += value.projectName + " - "+ value.description +" "+ value.finalGrade;
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
        
        console.log(Object.entries(await data).length)

        const project = Math.floor(Math.random() * Object.entries(data).length) + 1;

        console.log("cplm " + Object.entries(data))
        console.log(Object.entries(data)[project-1][1].id)
        console.log(Object.entries(data)[project-1][1].projectName)
        console.log(Object.entries(data)[project-1][1].description) 
        const projId=Object.entries(data)[project-1][1].id;
        console.log("Proj id: " + projId)
        setEvaluatProjId(projId)

        const grade1=Object.entries(data)[project-1][1].grade1
        const grade2=Object.entries(data)[project-1][1].grade2
        const grade3=Object.entries(data)[project-1][1].grade3
        const grade4=Object.entries(data)[project-1][1].grade4
        const grade5=Object.entries(data)[project-1][1].grade5

        console.log("Grades: " + grade1 +" "+ grade2 +" "+ grade3 +" "+ grade4 +" "+ grade5)
        let ggrade=""
        if (grade1==null)
        ggrade="grade1"
        else if (grade2==null)
        ggrade="grade2"
        else if (grade3==null)
        ggrade="grade3"
        else if (grade4==null)
        ggrade="grade4"
        else
        ggrade="grade5"
        console.log(ggrade)
        setGiveGrade(ggrade)

       let projEval=document.getElementById("proiectDeEvaluat");
       projEval.innerHTML=`Vei avea de evaluat: <b>
       ${Object.entries(data)[project-1][1].projectName}</b><br></br>
       Description: <br></br>
       ${Object.entries(data)[project-1][1].description}
       <br></br>
       `;

       let butonGrade=document.getElementById("butonGrade")
       butonGrade.style.display='block'
       let textGrade=document.getElementById("textGrade")
       textGrade.style.display='block'

        
      }
    
      async function setDbGrade(grade,evaluatProjId,giveGrade)
      {
        console.log("Give grade: " + giveGrade)
        console.log("grade: " + grade)
        console.log("evaluatProjId: " + evaluatProjId)

        let config=""
        if (giveGrade==="grade1")
        {
          config = {method: "PUT", 
          headers: {"Content-Type":"application/json"}, 
          body: JSON.stringify({grade1:grade})}
        }else if (giveGrade==="grade2")
        {
          config = {method: "PUT", 
          headers: {"Content-Type":"application/json"}, 
          body: JSON.stringify({grade2:grade})}
        }else if (giveGrade==="grade3")
        {
          config = {method: "PUT", 
          headers: {"Content-Type":"application/json"}, 
          body: JSON.stringify({grade3:grade})}
        } else if (giveGrade==="grade4")
        {
          config = {method: "PUT", 
          headers: {"Content-Type":"application/json"}, 
          body: JSON.stringify({grade4:grade})}
        }else if (giveGrade==="grade5")
        {
          config = {method: "PUT", 
          headers: {"Content-Type":"application/json"}, 
          body: JSON.stringify({grade5:grade})}
        }
        const configh=config;
        console.log(configh)

        const result = await fetch(`${SERVER}/admin/projects/${evaluatProjId}`,configh)
        const data = await result.json();
        console.log(data)
        
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
        <input id='butonGrade' type="button" value="Give grade" onClick={function () {setDbGrade(grade,evaluatProjId,giveGrade)} } />
        </div>
        
    )
}

export default HaveTeam