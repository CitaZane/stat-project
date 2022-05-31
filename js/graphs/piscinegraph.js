/* -------------------------------------------------------------------------- */
/*                             script construction                            */
/* -------------------------------------------------------------------------- */
// 1) GRAPH - display and clear
// 2) GRAPH STATS - display and clear
// 3) GRAPH (piscine) SWITCH
// 4) helper fn-s

let piscineLabelVisible = true //when bars too close hide labels
let currentPiscine = "js" // varibale for piscine switch

/* -------------------------------------------------------------------------- */
/*                                    graph                                   */
/* -------------------------------------------------------------------------- */
const displayPiscineGraph = () =>{
    const graphType = "piscine" //define graph type
    const graphData = userData.piscineData[currentPiscine]

    // calculate bar height based on max tries in exercise (y axis)
    let maxTriesIndex = findMaxTries(graphData)
    const maxBarHeight = Math.round(graphData[maxTriesIndex].timesTried + 2)

    // calculate bar offset based on exercise count (x axis)
    let barOffset = calcBarOffset(graphType, graphData.length)
    // Turn label on/off-visible only on hower if space too small
    piscineLabelVisible = (barOffset >12)? true: false;
    const graph = document.querySelector("#piscine-graph");

    // draw stat bars 
    graphData.forEach((exercise,index) => {
        drawGraphBar(graph, graphType,exercise.timesTried, exercise.exercise, maxBarHeight,barOffset, index)
    });
}
/* --------------------- remove all elements from graph --------------------- */
const clearPiscineGraph = () => {
    clearGraph("piscine")
}

/* -------------------------------------------------------------------------- */
/*                                 graph stats                                */
/* -------------------------------------------------------------------------- */
/* --------------- entry point for populating graph top stats --------------- */
const displayPiscineGraphStats = (type ="js") =>{
    const graphData = userData.piscineData[type]

    let maxTriesIndex = findMaxTries(graphData)
    let minTriesIndex = findMinTries(graphData)

    let statCount = document.querySelector("#piscine-stat-total")
    let statMax = document.querySelector("#piscine-stat-max")
    let statMaxTitle = document.querySelector("#piscine-stat-max-title")
    let statMin = document.querySelector("#piscine-stat-min")
    let statMinTitle = document.querySelector("#piscine-stat-min-title")

    statCount.innerText = calcTotalTries(graphData)
    statMax.innerText = graphData[maxTriesIndex].timesTried
    statMin.innerText = graphData[minTriesIndex].timesTried
    statMaxTitle.innerText = cleanTitle(graphData[maxTriesIndex].exercise)
    statMinTitle.innerText = cleanTitle(graphData[minTriesIndex].exercise)
}
/* ---------------- replace graph top stats with boilerplate ---------------- */
const clearPiscineGraphStats = () =>{
    const temp = " --/-- "
    let statCount = document.querySelector("#piscine-stat-total")
    let statMax = document.querySelector("#piscine-stat-max")
    let statMaxTitle = document.querySelector("#piscine-stat-max-title")
    let statMin = document.querySelector("#piscine-stat-min")
    let statMinTitle = document.querySelector("#piscine-stat-min-title")

    statCount.innerText = temp
    statMax.innerText = temp
    statMin.innerText = temp
    statMaxTitle.innerText = temp
    statMinTitle.innerText = temp
}
/* -------------------------------------------------------------------------- */
/*                           graph (piscine switch)                           */
/* -------------------------------------------------------------------------- */
const changePiscineGraph = (piscineType)=>{
    if(piscineType == currentPiscine) return;
    /* ----------------- adjust title active class to highlight ----------------- */
    let currentTitle = document.querySelector(`#piscine-${currentPiscine}`)
    currentTitle.classList.remove("active")
    let activeTitle = document.querySelector(`#piscine-${piscineType}`)
    activeTitle.classList.add("active")
    /* -------------------------- change global status -------------------------- */
    currentPiscine = piscineType
    /* ------------------------- redraw graphs and stats ------------------------ */
    clearPiscineGraph()
    clearPiscineGraphStats()
    displayPiscineGraph(piscineType)
    displayPiscineGraphStats(piscineType)
}

/* -------------------------------------------------------------------------- */
/*                                   helpers                                  */
/* -------------------------------------------------------------------------- */
/* ----------------------- find max times tried index ----------------------- */
const findMaxTries = (set)=> {
    let max = 0
    let index = 0
    set.forEach((exercise, i) => {
        if (exercise.timesTried > max){
             max = exercise.timesTried
             index = i
        }
    });
    return index
}
/* ----------------------- find min times tried index ----------------------- */
const findMinTries = (set)=> {
    let min = 9999999
    let index = 0
    set.forEach((exercise, i) => {
        if (exercise.timesTried < min){
             min = exercise.timesTried
             index = i
        }
    });
    return index
}

const calcTotalTries = (set)=>{
    return set.reduce((sum, current) => sum + current.timesTried, 0 )
}