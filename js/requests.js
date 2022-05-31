
/* -------------------------------------------------------------------------- */
/*                             request boilerplate                            */
/* -------------------------------------------------------------------------- */
let dataRequest = async(data) => {
    try {
        const res = await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: data
        })
        return res.json()
    } catch (error) {
        console.log("Error in API request")
        return error
    }
}

/* -------------------------------------------------------------------------- */
/*                                  requests                                  */
/* -------------------------------------------------------------------------- */

/* ----------- get username + id from api to check if user exists ----------- */
const getUsername = async (event)=> {
    event.preventDefault();
    // get value from form
    const user = document.querySelector("#username").value
    // construct query and make request
    let query = await queries.getUsername(user)
    let response = await dataRequest(query)
    // check for empty response
    if (!response.data.user.length) return new Error("User Not Found!")
    return response.data.user[0]
}


/* ----------- first request id for projects already done by user ----------- */
/* -------------- based on project ids reqest more information -------------- */
/* ---------------- return array of all project transactions ---------------- */
const getProjectData = async(username)=> {
    // construct query and make request for project ids
    let query = await queries.getFinishedProjectIds(username)
    let response = await dataRequest(query)

    // ccatch empty response
    if (!response.data.user.length) return new Error("Something went wrong!")
    let projectData = []

    // loop over finished project ids to get additional data from api
    for (let i = 0; i <  response.data.user[0].progresses.length; i++){
        let projectId = response.data.user[0].progresses[i].objectId

        let xpQuery = await queries.getProjectXP(username, projectId)
        let res = await dataRequest(xpQuery)

        res.data.user[0].transactions[0].createdAt = response.data.user[0].progresses[i].createdAt
        projectData.push(res.data.user[0].transactions[0])
    }
    return projectData
}
/* ------------------------- get all skills from api ------------------------ */
const getSkillData = async (userId)=>{
    let offset = 0 //offset for request limit
    const skills = {}
    while (true){
        // construct query and make request
        let query = await queries.getSkills(userId, offset)
        let response = await dataRequest(query) 
        offset+=response.data.transaction.length
        // break loop if no data in response(we already have all data)
        if(response.data.transaction.length == 0)break
        // save each skill as name:amount 
        response.data.transaction.forEach(skill => {
            let type = skill.type.split("_")[1]
            skills[type] = skill.amount
        });
    }
    return skills
}

/* -------------- request data about piscines based on user id -------------- */
const getPiscineStats = async (userId)=>{
    let offset = 0
    const piscines = {js:[],go:[]}
    while (true){
        // construct query for js piscine and make request
        let query = await queries.getJsPiscineStats(userId, offset)
        let response = await dataRequest(query) 
        offset+=response.data.result.length

        // catch empty response from api
        if(response.data.result.length == 0)break

        // for each piscine transaction check if exercise not registered yet
        response.data.result.forEach(exercise => {
            // if not save in exercise array with default value 1
            if(piscines.js.length == 0 || piscines.js[piscines.js.length -1].exercise != exercise.object.name){
                let entry = {exercise: exercise.object.name, timesTried:1}
                piscines.js.push(entry)
            }else{
                 // if exercise already registered, increase value by 1
                piscines.js[piscines.js.length -1].timesTried ++
            }
        });
    }
    // repeat for other piscines -> go
    offset = 0
    while (true){
        let query = await queries.getGoPiscineStats(userId, offset)
        let response = await dataRequest(query) 
        offset+=response.data.result.length
        if(response.data.result.length == 0)break
        response.data.result.forEach(exercise => {
            if(piscines.go.length == 0 || piscines.go[piscines.go.length -1].exercise != exercise.object.name){
                let entry = {exercise: exercise.object.name, timesTried:1}
                piscines.go.push(entry)
            }else{
                piscines.go[piscines.go.length -1].timesTried ++
            }
        });
    }
    return piscines
}


/* --------------------------------- helper --------------------------------- */
const compareDates = (first,last)=>{
    let date1 = new Date(first)
    let date2 = new Date(last)
    return date1.getTime()>date2.getTime()
}
