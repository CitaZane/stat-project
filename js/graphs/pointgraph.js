/* -------------------------------------------------------------------------- */
/*                             script construction                            */
/* -------------------------------------------------------------------------- */
// 1) GRAPH - display and clear
// 2) GRAPH STATS - display and clear
// 3) helper fn-s
let xpLabelVisible = true

/* -------------------------------------------------------------------------- */
/*                                    graph                                   */
/* -------------------------------------------------------------------------- */
/* --------------------- entry point for creating graph --------------------- */
const displayPointGraph = () =>{
    const graphType = "point" //define graph type
    const graphData = userData.projectData

     // calculate bar height based on max xp (y axis)
    let maxXpIndex = findHighestScore(graphData)
    const maxBarHeight = Math.round(graphData[maxXpIndex].amount +1000)

    // calculate bar offset based on project (x axis)
    let barOffset = calcBarOffset(graphType, graphData.length)

    // Turn label on/off-visible only on hower if space too small
    xpLabelVisible = (barOffset >12)? true: false;
    const graph = document.querySelector("#point-graph");
    /* ----------------------------- draw graph bars ---------------------------- */
    graphData.forEach((project,index) => {
        drawGraphBar(graph, graphType,project.amount, project.object.name, maxBarHeight,barOffset, index)
    });
}
/* --------------------- remove all elements from graph --------------------- */
const clearPointGraph = () => {
    clearGraph("point")
}
/* -------------------------------------------------------------------------- */
/*                                 graph stats                                */
/* -------------------------------------------------------------------------- */
/* --------------- entry point for populating graph top stats --------------- */
const displayPointGraphStats = () =>{
    let maxXpIndex = findHighestScore(userData.projectData)
    let minXpIndex = findLowestScore(userData.projectData)

    let statCount = document.querySelector("#point-stat-total")
    let statMax = document.querySelector("#point-stat-max")
    let statMaxTitle = document.querySelector("#point-stat-max-title")
    let statMin = document.querySelector("#point-stat-min")
    let statMinTitle = document.querySelector("#point-stat-min-title")

    statCount.innerText = userData.projectData.length
    statMax.innerText = formatXp(userData.projectData[maxXpIndex].amount)
    statMin.innerText = formatXp(userData.projectData[minXpIndex].amount)
    statMaxTitle.innerText = cleanTitle(userData.projectData[maxXpIndex].object.name)
    statMinTitle.innerText = cleanTitle(userData.projectData[minXpIndex].object.name)
}
/* ---------------- replace graph top stats with boilerplate ---------------- */
const clearPointGraphStats = () =>{
    const temp = " --/-- "
    let statCount = document.querySelector("#point-stat-total")
    let statMax = document.querySelector("#point-stat-max")
    let statMaxTitle = document.querySelector("#point-stat-max-title")
    let statMin = document.querySelector("#point-stat-min")
    let statMinTitle = document.querySelector("#point-stat-min-title")

    statCount.innerText = temp
    statMax.innerText = temp
    statMin.innerText = temp
    statMaxTitle.innerText = temp
    statMinTitle.innerText = temp
}

/* -------------------------------------------------------------------------- */
/*                                   helpers                                  */
/* -------------------------------------------------------------------------- */

/* ------------------------ find highest score index ------------------------ */
const findHighestScore = (set)=> {
    let highScore = 0
    let index = 0
    set.forEach((project, i) => {
        if (project.amount > highScore){
             highScore = project.amount
             index = i
        }
    });
    return index
}
/* ------------------------- find lowest score index ------------------------ */
const findLowestScore = (set)=> {
    let lowScore = 9999999
    let index = 0
    set.forEach((project, i) => {
        if (project.amount < lowScore){
             lowScore = project.amount
             index = i
        }
    });
    return index
}

