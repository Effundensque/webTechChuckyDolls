import { useState, useEffect } from "react"

function AfterLogin ()
{
    const [teams, setTeams] = useState("");
    const SERVER = 'http://localhost:8080'
    const [teamSelected, setTeamSelected] = useState('')
    const [createTeamName, setCreateTeamName] = useState('')

    useEffect(()=>{
        getTeams();
      },[1])

    useEffect(()=>{
        displayTeams();
      },[teams])

    async function getTeams(){
        const requestOptions = {method: 'GET'}
        const response = await fetch(`${SERVER}/admin/teams`,requestOptions)
        const data = await response.json()
        setTeams(data)
        
      }



    function displayTeams ()
    {
        let divTeams = document.getElementById("displTeamsDiv");
        let someText=`<ul>`;
        Object.entries(teams).forEach(([key, value]) => {
            someText+=`<li>`
             someText += value.teamName;
             someText+=`</li>`

        })
        someText+=`</ul>`
        divTeams.innerHTML=someText
    }

    function createTeam()
    {
        console.log(createTeamName);
    }
    function selectTeam()
    {
        let isTeam = false;
        let teamSelectedId=-1;
        Object.entries(teams).forEach(([key, value]) => {
            if (value.teamName===teamSelected)
            {
                isTeam=true;
                teamSelectedId=value.id;
            }
            

        })
        if (isTeam===false)
            {
                let errorTeamDiv= document.getElementById("errorTeam")
                errorTeamDiv.style.color="red";
                errorTeamDiv.innerHTML="No such team!"
            }
            else
            {
                let errorTeamDiv= document.getElementById("errorTeam")
                errorTeamDiv.innerHTML=''
                
                console.log(teamSelected + " cu id: " + teamSelectedId)
            }
    }

    return(
        <div>
            <div>Teams: <br></br></div>
            <div id = 'displTeamsDiv'></div>

            <br></br>
            <div>
                <div id='selectTeamDiv'>
                Choose your team: <div id='errorTeam'></div> <br></br> 
                <input type='text' placeholder='type the name of the team' onChange={(evt) => setTeamSelected(evt.target.value)} />
                <input type='button' value='Select Team' onClick={() => selectTeam(teamSelected)} />
                </div>
                <br></br>
                <div id='createTeamDiv'>
                Create a new team: <br></br>
                <input type='text' placeholder='type the name of the team' onChange={(evt) => setCreateTeamName(evt.target.value)} />
                <input type='button' value='Create' onClick={() => createTeam(createTeamName)} />
                </div>
            </div>
        </div>
    )

}


export default AfterLogin;