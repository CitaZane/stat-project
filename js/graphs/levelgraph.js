/* -------------------------------------------------------------------------- */
/*                             script construction                            */
/* -------------------------------------------------------------------------- */
// 1) GRAPH - display and clear
// 2) GRAPH STATS - display and clear
// 3) CALCULATE AND FORMAT DATA
// 4) DRAW SVG ELEMENTS
// 5) CREATE SVG ELEMENT
// 6) ADD LISTENERS FOR HOVER EFFECTS
// 7) helper fn-s

const graphOffset = 60 //offset used for displaying labels in calculations
const labelAproxWidth = 90 //offset used for displaying labels in calculations
/* -------------------------------------------------------------------------- */
/*                                    graph                                   */
/* -------------------------------------------------------------------------- */
const displayLevelGraph = async() => {
    const graphData = userData.projectData
    const graph = document.querySelector(`#level-graph`)

    // find tresholds where user leveled up
    // represented with indexes/ correspond to original project array
    let levelupIdx = await findLevelupIndexes(graphData)
    let firstLevelup = levelupIdx[0]
    let lastLevelup = levelupIdx[levelupIdx.length-1]

    // calculate point distibution on graph
    let graphWidth = calcGraphWidth(graph)
    let heightDistribution =  calcDistribution(graphHeight, levelupIdx.length)
    let daysPassed = calcDayDifference(graphData[firstLevelup].createdAt, graphData[lastLevelup].createdAt)
    let widthDistribution =  calcDistribution(graphWidth- labelAproxWidth, daysPassed)
    if (widthDistribution<= 0) widthDistribution=1

    // draw base for graph(extend x axis)
    drawBase(graph,graphWidth)

    // calculate and format data points
    let points = await calcDataPoints(heightDistribution, widthDistribution, graphData, levelupIdx)

    // draw graph line and points with labels(info)
    drawLevelGraphLine(graph, points)
    drawLevelGraphPoints(points)
}
/* -------------------------- clear data from graph ------------------------- */
const clearLevelGraph = () => {
    let wrapper = document.querySelector("#level-graph-data")
     while (wrapper.lastChild) {
        wrapper.removeChild(wrapper.lastChild);
    }
}

/* -------------------------------------------------------------------------- */
/*                                 graph stats                                */
/* -------------------------------------------------------------------------- */
const displayLevelGraphStats = async() =>{
    let levelupIdx = await findLevelupIndexes(userData.projectData)

    let statCount = document.querySelector("#level-stat-total")
    let statMax = document.querySelector("#level-stat-max")
    let statMin = document.querySelector("#level-stat-min")

    statCount.innerText = userData.level
    statMin.innerText = formatTime(userData.projectData[0].createdAt)
    statMax.innerText = formatTime(userData.projectData[levelupIdx[levelupIdx.length-1]].createdAt)
}
/* ---------------- replace graph top stats with boilerplate ---------------- */
const clearLevelGraphStats = () =>{
    const temp = " --/-- "
    let statCount = document.querySelector("#level-stat-total")
    let statMax = document.querySelector("#level-stat-max")
    let statMin = document.querySelector("#level-stat-min")

    statCount.innerText = temp
    statMax.innerText = temp
    statMin.innerText = temp
}

/* -------------------------------------------------------------------------- */
/*                        calculate and format data                           */
/* -------------------------------------------------------------------------- */
/* -- calculate data points based on height and width distribution in graph - */
const calcDataPoints = async(heightDist, widthDist, graphData, levelupIdx) =>{
    let points = []
    levelupIdx.forEach((index, level )=> {
        // format each data point
        let point = formatLevelPointData(index, level, heightDist, widthDist, graphData)
        points.push(point)
    });
    return points
}
/* ---------------------------- format data point --------------------------- */
const formatLevelPointData = (index,level, heightDist, widthDist, graphData)=>{
    let date = new Date(graphData[index].createdAt);
    // calc x coordinate based on how many days passed since beginning
    let x = calcDayDifference(graphData[0].createdAt, graphData[index].createdAt) * widthDist;
    // calc y based on level
    let y = (level+1)*heightDist
    // represent point as object
    let point = pointDataObject(x,y,date, level+1)
    return point
}

/* ------------ based on xp needed for each level finds projects ------------ */
/* ----------------------- after which level up happen ---------------------- */
/* --- returns array of indexes corresponding to original project data set -- */
/* -------- one project can also can correspond to multiple levelups -------- */
const findLevelupIndexes = async (projectData) => {
    let result = []
    let targetLevel = 1
    let treshold = levelNeededXP(targetLevel)
    let totalXp = 0

    projectData.forEach((project,index) => {
        totalXp += project.amount
        while (totalXp > treshold){
            result.push(index)
            targetLevel ++
            treshold = levelNeededXP(targetLevel)
        }
    });
    return result
}

/* -------------------------------------------------------------------------- */
/*                              draw svg elements                             */
/* -------------------------------------------------------------------------- */
const drawLevelGraphLine=async(graph, points)=>{
/* -------------- create wrapper for elements and progress line ------------- */
    let wrapper = document.querySelector("#level-graph-data")
    let graphLine = await createGraphLine(points)  
    addChildElement(graph, wrapper)
    .then(()=>{
        wrapper.appendChild(graphLine)
    })
}
const drawLevelGraphPoints = (points) => {
    let wrapper = document.querySelector("#level-graph-data")
    points.forEach(point => drawPoint(wrapper,point));
}

const drawPoint = async(parent,point) =>{
    // draw data point and label
    // nested inside wrapper for better correlation between point and label
    let wrapper = await createWrapper()
    let dot = await createPoint(point.x, point.y)
    let label = await createLabel(point)
    // add to DOM
    addChildElement(parent, wrapper)
    .then(()=>{
        wrapper.appendChild(label)
        wrapper.appendChild(dot)
    })
    // add event listeners for hover effect
    dot.addEventListener("mouseover", activatePoint)
    dot.addEventListener("mouseout", deactivatePoint)
}

/* -------------------- extend Y axis and move time stamp ------------------- */
const drawBase = async (graph, graphWidth) => {
     let line = document.querySelector("#level-graph-time-line") 
     let label = document.querySelector("#level-graph-time-label") 
     let animationLabel = await createAxisAnimation(graph, "x", graphWidth - 50, "2s")
     let animationAxis = await createAxisAnimation(graph, "x2", graphWidth - graphOffset, "2s")

     line.appendChild(animationAxis)
     label.appendChild(animationLabel)
}
/* -------------------------------------------------------------------------- */
/*                             create svg elements                            */
/* -------------------------------------------------------------------------- */

/* --------------------------- creating graph line -------------------------- */
const createGraphLine = async(points)=>{
    let line = document.createElementNS(ns,'polyline')
    line.classList.add("level-graph-line")
    line.setAttribute("id", "level-graph-line")
    let convertedPoints = convertPoints(points)
    line.setAttribute("points", convertedPoints)
    return line
}

/* ------------------ create wrapper group for svg elements ----------------- */
const createWrapper = async() =>{
    let wrapper = document.createElementNS(ns,'g')
    return wrapper
}
/* ------------------------ create point svg element ------------------------ */
const createPoint = async(cx,cy) =>{
    let dot = document.createElementNS(ns,'circle')
    dot.setAttribute("cx", cx)
    dot.setAttribute("cy", cy)
    dot.setAttribute("r", 4) // controlls point size in px
    dot.classList.add("level-graph-point")
    return dot
}
const createLabel = async(point)=>{
    let offsetX = 40
    let offsetY = 40
    let x = point.x-offsetX
    let label = document.createElementNS(ns,'text')
    label.setAttribute("x", x)
    label.setAttribute("y", point.y - offsetY)
    label.classList.add("level-graph-label")
    let levelTag = await createSubLabel(`LEVEL ${point.level}`, point.x)
    let timeTag = await createSubLabel(point.time, point.x)
    label.appendChild(levelTag)
    label.appendChild(timeTag)
    return label
}
// for multiline text svg elements used nested <tspan> elements
const createSubLabel = async(text, x)=>{
    let label = document.createElementNS(ns,'tspan')
    label.setAttribute("x", x)
    label.setAttribute("dy", "16px")
    label.textContent = text
    return label
}

// create animation based on atribute amount and duration
const createAxisAnimation = async(graph, attribute, amount, duration) =>{
    let anim = document.createElementNS(ns,'animate')

    anim.setAttribute("attributeName", attribute)
    anim.setAttribute("from", 5)
    anim.setAttribute("to", amount)
    anim.setAttribute("dur", duration)
    anim.setAttribute("fill", "freeze")
    anim.setAttribute("begin", graph.getCurrentTime() + "s")

    return anim
}

/* -------------------------------------------------------------------------- */
/*                    impact elements on hower (listeners)                    */
/* -------------------------------------------------------------------------- */
const activatePoint = (event)=>{
    let points = document.getElementsByClassName("level-graph-point")
    for (var i = 0; i < points.length; i++){
        points[i].setAttribute("opacity", "0.4")
    }
    let line = document.querySelector("#level-graph-line")
    line.classList.add("deactivate")
    let dot = event.target
    dot.classList.add("active")
    let label = event.target.previousElementSibling
    label.classList.add("show")
}
const deactivatePoint = (event)=>{
    let points = document.getElementsByClassName("level-graph-point")
    for (var i = 0; i < points.length; i++){
        points[i].setAttribute("opacity", "1")
    }
    let line = document.querySelector("#level-graph-line")
    line.classList.remove("deactivate")
    let dot = event.target
    dot.classList.remove("active")
    let label = event.target.previousElementSibling
    label.classList.remove("show")
}
/* -------------------------------------------------------------------------- */
/*                                   helpers                                  */
/* -------------------------------------------------------------------------- */
/* ------------ convet point coordinates for adding as attribute ------------ */
const convertPoints = (points) =>{
    let converted = points.map(point=> `${point.x},${point.y}`)
    let result = "0,320 " + converted.join(" ")
    return result
}
/* ---------------------- // date formtting for labels ---------------------- */
const formatTime = (raw)=> {
    let date = new Date(raw)
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
}
/* ------------- creates object representing one point in graph ------------- */
const pointDataObject = (x,y,time,level) =>{
    let formatedTime = `${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()}`
    let refactorY = graphHeight+graphOffset -y
    let obj = {x:x, y:refactorY,level:level, time:formatedTime}
    return obj
}

/* -------------- calculated distribution between two instances ------------- */
const calcDistribution = (total, count)=>{
    return total / count
}
/* ---------- based on two dates calculates time difference in days --------- */
/* -------------- adds offset (5) for ofsseting from 0,0 coordinate ------------- */
const calcDayDifference = (first,last)=>{
    let date1 = new Date(first)
    let date2 = new Date(last)
    let timeDifference = date2.getTime() - date1.getTime()
    let timeInDays = timeDifference / (1000*60*60*24) + 5
    return timeInDays 
}

