const defaultUser = "CitaZane" //default user for search -> author
let resizeTimerId //timer for resize event hadling
/* -------------------------------------------------------------------------- */
/*                             user data structure                            */
/* -------------------------------------------------------------------------- */
const userData = {// data representing user
    username: "",
    id:0,
    totalXP: 0,
    level: 0,
    topSkills:[],
    projectData:[], 
    piscineData:{},
}
/* -------------------------------- topSkills ------------------------------- */
//Holds top 3 skills for user in array in descending order
// each skill represented as object
// {title: string, amount: int}

/* ------------------------------- projectData ------------------------------ */
// Holds data about all finished projects in Div-1 (base) module in asc order
// each project represented as object / similar to original structure from api
// {amount: int, createdAt: string, object :{name: string}}

/* ------------------------------- piscineData ------------------------------ */
// holds data about different piscines
// each piscine holds array with finished exercises in asc order + times tried
// {go: [{exercise: string, timesTried: int}, ...], js:[...]} 


/* -------------------------------------------------------------------------- */
/*                               main entrypoint                              */
/* -------------------------------------------------------------------------- */
/* ------------- main function for fetching and displaying data ------------- */
/* ------------------------------ after search ------------------------------ */
const searchForm = document.querySelector("#searchForm")
searchForm.addEventListener("submit", async(event) => {
    let resp = await getUsername(event) //get user identification
    if (resp instanceof Error){
        alert("User not found. Check if the username is spelled correctly")
        return
    }
    // clear data from previous search
    clearContent() 
    activateLoading()
    userData.username = resp.login
    userData.id = resp.id
    // request  base data about user from API
    // save in user data model
    userData.projectData = await getProjectData(userData.username)
    userData.totalXP = await calculateTotalXP(userData.projectData) 
    userData.level = await calculateLevel(userData.totalXP)
    userData.piscineData = await getPiscineStats(userData.id)
    let skillData = await getSkillData(userData.id)
    userData.topSkills = pickHighestSkills(skillData)
    console.log(userData)
    // display graphs and statisrtics
    displayContent()
    deactivateLoading()
    // clear search field
    document.querySelector("#username").value = ""
    // add resize event listener for dynamic graph adjustment
    window.addEventListener("resize", handleWindowResize)
})


/* ------------- initialize search for default useron page load ------------- */
window.addEventListener('load', function() {
    document.querySelector("#username").value = defaultUser
    document.querySelector(".search-btn").click()
})


 /* -------------------------------------------------------------------------- */
 /*             wrapper function for all display element functions             */
 /* -------------------------------------------------------------------------- */
const displayContent = () =>{
    displayUsername()
    displayXP()
    displayLevel()
    displaySkills()
    displayPointGraph()
    displayPointGraphStats()
    displayLevelGraph()
    displayLevelGraphStats()
    displayPiscineGraph()
    displayPiscineGraphStats()
}
 /* -------------------------------------------------------------------------- */
 /*             wrapper function for all clear element functions               */
 /* -------------------------------------------------------------------------- */
const clearContent = () =>{
    clearUsername()
    clearXP()
    clearLevel()
    clearSkills()
    clearPointGraph()
    clearPointGraphStats()
    clearLevelGraph()
    clearLevelGraphStats()
    clearPiscineGraph()
    clearPiscineGraphStats()
}


/* -------------------------------------------------------------------------- */
/*                               handle resize                                */
/* -------------------------------------------------------------------------- */
const handleWindowResize = () =>{
    clearTimeout(resizeTimerId);
    resizeTimerId = setTimeout(resizeGraphs, 200)
}
const resizeGraphs= () =>{
    clearPointGraph()
    clearPiscineGraph()
    clearLevelGraph()
    displayPointGraph()
    displayPiscineGraph()
    displayLevelGraph()
}

/* -------------------------------------------------------------------------- */
/*                           hadle loading animation                          */
/* -------------------------------------------------------------------------- */
const activateLoading=()=>{
let loaders = document.getElementsByClassName("loader")
for (i=0; i<loaders.length; i++){
    loaders[i].setAttribute("visibility", "visible")
}
}
const deactivateLoading=()=>{
    let loaders = document.getElementsByClassName("loader")
    for (i=0; i<loaders.length; i++){
        loaders[i].setAttribute("visibility", "hidden")
    }
}


/* -------------------------------------------------------------------------- */
/*                    helpers for xp and level calculation                    */
/* -------------------------------------------------------------------------- */
const calculateTotalXP = async (xp)=>{
    return xp.reduce((sum, current) => sum + current.amount, 0 )
}

/* -------------- level calculation thanks to Olari & Kanguste -------------- */
// Calculates what level this amount of XP would be at
const calculateLevel = async (xp)=>{
    let level = 0
    while (levelNeededXP(++level) < xp) {}
    return level-1
}
// Returns the amount of XP needed for any given level
function levelNeededXP(level) {
    return Math.round(level * (176 + 3 * level * (47 + 11 * level)))
}