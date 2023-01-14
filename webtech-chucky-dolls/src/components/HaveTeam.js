import { useEffect, useState } from "react"



function HaveTeam({key, setseed,teamid})
{

  const reset = () => {
    setseed(Math.random());
}

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
    // useEffect(()=>{
    //     displayProjects();
    // },[projects])

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
             someText += value.projectName
             if (value.description)
             someText += " - " + value.description
             if (value.finalGrade)
             someText += " <b>Grade:</b> " + value.finalGrade
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
        console.log("Data: " + data + " type:" + data.type)
        console.log(Object.entries(await data).length)
        if (Object.entries(await data).length<=0)
        {
          let projEval=document.getElementById("proiectDeEvaluat");
          projEval.innerHTML="Nu exista proiect de evaluat"
          let butonGrade=document.getElementById("butonGrade")
         butonGrade.style.display='none'
         let textGrade=document.getElementById("textGrade")
         textGrade.style.display='none'
        }else
        {
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
         projEval.innerHTML=`
          
         <div className="row">
         Vei avea de evaluat: <b>${Object.entries(data)[project-1][1].projectName}</b>
         </div>
         <div className="row">
         Description:  ${Object.entries(data)[project-1][1].description}
         </div>
         `;
  
         let butonGrade=document.getElementById("butonGrade")
         butonGrade.style.display='block'
         let textGrade=document.getElementById("textGrade")
         textGrade.style.display='block'
        }
        
        

        
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
        
      async function deleteProject(projId)
      {
        const requestOptions = {method: 'DELETE',headers:{"Content-Type":"application/json"}}
              const response = await fetch(`${SERVER}/admin/projects/${projId}`,requestOptions)
              const data = await response.json()
              console.log(data)
              reset();
      }


    return (
        <div>
         
        <p className="text-center">Bun venit! Faci parte din echipa <b>{teamPart}</b></p>
        <input className="btn btn-dark mt-3" value="Logout" type="button" onClick={()=>{window.location.reload()}}></input>

        <h5>Proiectele echipei: </h5>
          {
            Object.entries(projects).map((e)=>(
              <ul className="list-group">
              <li className="list-group-item" key={e[1].id}>
              {e[1].projectName } - Description: {e[1].description}
              
              <b> - Grade: {e[1].finalGrade} 
              </b> 
              <> </><input className="btn btn-danger" type='button' value='delete' onClick={() => deleteProject(e[1].id)} />
            </li>
              </ul>
            
              ))
          }
        <div className="row mt-3">
          <div className="col-4">
          <input className="form-control" type='text' placeholder='Name of the project' onChange={(evt) => setProjectName(evt.target.value)} />
          </div>
          <div className="col-4">
          <input className="form-control" type='text' placeholder='Project description' onChange={(evt) => setProjectDescription(evt.target.value)} />
          </div>
          <div className="col-3">
          <input className="btn btn-primary" type="button" value="Adauga Proiect" onClick={()=>addProject(projectName,projectDescription)} />
          </div>
        
        </div>
          <div className="row mt-2">
            <div className="col-2">
            <input className="btn btn-dark" type="button" value="Verifica proiectul selectat pentru tine." onClick={()=>evaluateProject()} />
            </div>
          </div>

        <div className="row">
        <div className="col" id='proiectDeEvaluat'></div>
        </div>
        <div className="row">
          <div className="col-4">
          <input className="form-control"  id='textGrade'  type='text' placeholder='Grade:' onChange={function (evt) {setGrade(evt.target.value)}} />
          </div>
          <div className="col-3"> 
          <input className="btn btn-primary" id='butonGrade' type="button" value="Give grade" onClick={function () {setDbGrade(grade,evaluatProjId,giveGrade)} } />
          </div>
        </div>
        
         </div>
        
    )
}

export default HaveTeam