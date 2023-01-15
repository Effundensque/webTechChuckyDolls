import { useState, useEffect, Component } from "react"
import HaveTeam from "./HaveTeam";


function AfterLogin ({key,setSeed,token, userName, userId})
{
    const reset = () => {
        setSeed(Math.random());
    }
    const [teams, setTeams] = useState("");
    const SERVER = 'http://localhost:8080'
    const [teamSelected, setTeamSelected] = useState('')
    const [createTeamName, setCreateTeamName] = useState('')
    const [createTeamId, setCreateTeamId] = useState('')
    const [iHaveTeam, setIhaveTeam] = useState('')
 
    function refreshPage() {
         reset();
      }

    useEffect(()=>{
        getTeams();
      },[1])

    async function getTeamIdLoggedInUser()
    {
        const requestOptions = {method: 'GET',
        headers:
        {
          "auth": token
        }
        }
        
        const response1 = await fetch(`${SERVER}/api/whologgedinIDTeam`,requestOptions)
    const data1 = await response1.json()
   
    console.log("Am echipa? " + data1.message)
        if (data1.message)
        {
            setIhaveTeam(data1.message)
        }
    }

    useEffect(()=>{
        getTeamIdLoggedInUser()
    },[2])

    

    // useEffect(()=>{
    //     displayTeams();
    //   },[teams])

    useEffect(()=>{
        setTeamUser(userId, createTeamId)
    },[createTeamId])

    async function getTeams(){
        const requestOptions = {method: 'GET'}
        const response = await fetch(`${SERVER}/admin/teams`,requestOptions)
        const data = await response.json()
        setTeams(data)
        console.log("teams updated")
        
      }

      async function setTeamUser(userid,teamid)
      {
        const requestOptions = {method: 'PUT',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
        teamId:teamid
        })}
    console.log(requestOptions)
        const response = await fetch(`${SERVER}/admin/users/${userid}`,requestOptions)
        const data = await response.json()
        console.log(data)
      }



      async function createDbTeam(teamname)
      {
        const requestOptions = {method: 'POST',
        headers:{
            "Content-Type": "application/json"
        },
    body: JSON.stringify({
        teamName:teamname
    })}
    const response = await fetch(`${SERVER}/admin/teams`,requestOptions)
        const data = await response.json()
        console.log("LALALALLAL " + data)
        setCreateTeamId(await data)
        
        
      }



    function displayTeams ()
    {
        let divTeams = document.getElementById("displTeamsDiv");
        let someText=`<ul className="list-group">`;
        Object.entries(teams).forEach(([key, value]) => {
            someText+=`<li className="list-group-item">`
             someText += value.teamName;
             someText+=`</li>`

        })
        someText+=`</ul>`
        divTeams.innerHTML=someText
    }

    async function createTeam()
    {
        console.log(createTeamName);
        let isTeam = false;
        let teamSelectedId=-1;
        Object.entries(teams).forEach(([key, value]) => {
            if (value.teamName===createTeamName)
            {
                isTeam=true;
                teamSelectedId=value.id;
            }
            

        })
        if (isTeam === true)
        {
            let errorTeamDiv= document.getElementById("errorTeamExists")
            errorTeamDiv.style.color="red";
            errorTeamDiv.innerHTML="Team already exists!"
        }
        else
        {
            
            await createDbTeam(createTeamName)
            await getTeams()
            refreshPage();
        }
    }
    function selectTeam(teamSelected)
    {
        let teamSelectedId=-1;
        Object.entries(teams).forEach(([key, value]) => {
            if (value.teamName===teamSelected)
            {
                teamSelectedId=value.id;
            }
        })
                console.log(teamSelected + " cu id: " + teamSelectedId)
                console.log("Esti logat cu contul: " + userName + " cu id-ul: " + userId)
                setTeamUser(userId,teamSelectedId)
                refreshPage();

    }

    

    const [seed1, setSeed1] =useState(1)

    if (iHaveTeam!=='')
    {
        return(
            <HaveTeam key={seed1} setseed={setSeed1} teamid={iHaveTeam}/>
        )
        
    }else
    {
        return(
            <div>
                <input className="btn btn-dark mb-3" value="Logout" type="button" onClick={()=>{window.location.reload()}}></input>

                <div className="row">
                    <h5>Select a team from: </h5>
                    {
                    Object.entries(teams).map((e)=>(

                        <ul className="list-group">
                        <li className="list-group-item list-group-item-action" onClick={() => selectTeam(e[1].teamName)} key={e[1].id}>{e[1].teamName } </li>
                        </ul>
                         ))
                    }
                </div>
                <div className="row">
                <h5>Or create a new team: </h5><div id='errorTeamExists'></div>
                    <div className="col-3">
                    <input className="form-control" type='text' placeholder='Name of the team' onChange={(evt) => setCreateTeamName(evt.target.value)} />
                    
                    </div>
                    <div className="col-1"><input className="btn btn-primary" type='button' value='Create' onClick={() => createTeam(createTeamName)} /></div>
                    
                    
                    
                    
                </div>
            </div>
        )
    }
    

}


export default AfterLogin;