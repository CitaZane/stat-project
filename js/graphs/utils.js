/* -------------------------------------------------------------------------- */
/*          functions reused for drawing and creating graph elements          */
/* -------------------------------------------------------------------------- */
const graphHeight = 260
const barWidth = 5
const ns = 'http://www.w3.org/2000/svg' //namespace for svg

/* ----------- draw single graph element representing one project ----------- */
/* ---------------- create svg elements -> display on screen ---------------- */
/* ------------ count -> represents number (points or xp or tries) ---------- */
/* --------------- title -> represents project or exercise name ------------- */
/* - graph type used as attribute on wrapper to target right title on hover - */

const drawGraphBar = async(graph,graphType, count, title, maxBarHeight, barOffset,index)=>{
    // calculate bar height(y axis)
    let height = Math.round(graphHeight / (maxBarHeight / count))
    // calculate bar position on x axis
    let offsetInPx = ((barOffset+ barWidth)*index)+ (barWidth/2)

    // create all elements that represent single instance
    let wrapper = await createBarWrapper(title, graphType)
    let background = await createBackroundBar(offsetInPx)
    let bar = await createBar(offsetInPx, height)
    let label = await createBarLabel(offsetInPx, count, graphType)
    let anim = await createBarAnimation(graph, height)

    // add elements to DOM
    addChildElement(graph,wrapper)
    .then(()=> {
        // add listeners for hower effect on group
        wrapper.addEventListener("mouseover", activateProject)
        wrapper.addEventListener("mouseout", deactivateProject)
        wrapper.appendChild(background)
        addChildElement(wrapper, bar)
        .then(()=>{
            bar.appendChild(anim)
        })
        wrapper.appendChild(label)
        if (!xpLabelVisible && graphType=="point"){
            label.classList.add("hide")
        }
        if (!piscineLabelVisible && graphType=="piscine"){
            label.classList.add("hide")
        }
    })
}

/* ------------------------------- clear graph ------------------------------ */
/* --------------------- remove all elements from graph --------------------- */
const clearGraph = (graphType) => {
    const graph = document.querySelector(`#${graphType}-graph`)
     while (graph.lastChild) {
        graph.removeChild(graph.lastChild);
    }
}


/* -------------------------------------------------------------------------- */
/*               handlers for hovering functionality over graph               */
/* -------------------------------------------------------------------------- */
/* --- handle hover on project to add accernts and display name of project -- */
const activateProject =(event)=>{
    // select correct element based on "graph-type' attribute on  <g> element
    let graphType = event.target.parentElement.getAttribute("graph-type")
    // title id can be found based on graph type
    let title = document.querySelector(`#${graphType}-graph-info`)
    // display project name from bar attribute "project-title"
    title.innerHTML = event.target.parentElement.getAttribute("project-title")
    title.style.opacity = 1

    // add active classes to group itself and all nested elements
    let group = event.target.parentElement
    let childs = group.childNodes
    childs[1].classList.add("active") //bar

    if (graphType=="point"){
        if (!xpLabelVisible)childs[2].classList.add("show")          
    }else if (graphType="piscine"){
        if (!piscineLabelVisible)childs[2].classList.add("show")
    }
    childs[2].classList.add("active")//label
}
const deactivateProject =(event)=>{
     let graphType = event.target.parentElement.getAttribute("graph-type")
    let title = document.querySelector(`#${graphType}-graph-info`)
    title.style.opacity = 0
    let group = event.target.parentElement
    let childs = group.childNodes
    childs[1].classList.remove("active")
    childs[2].classList.remove("active")
    if (graphType=="point"){
        if (!xpLabelVisible)childs[2].classList.remove("show")          
    }else if (graphType="piscine"){
        if (!piscineLabelVisible)childs[2].classList.remove("show")
    }
}

/* -------------------------------------------------------------------------- */
/*                function for creating svg elements for graph                */
/* -------------------------------------------------------------------------- */

const createBarWrapper = async(title, graphType) =>{
    let wrapper = document.createElementNS(ns,'g')
    // project-title important to show it on hover
    wrapper.setAttribute("project-title", cleanTitle(title))
    // graph type for targeting correct graph title
    wrapper.setAttribute("graph-type", graphType)
    return wrapper
}

const createBackroundBar = async(barOffset) =>{
    let backgroundBar = document.createElementNS(ns,'line')

    backgroundBar.setAttribute("x1", barOffset)
    backgroundBar.setAttribute("x2", barOffset)
    backgroundBar.setAttribute("y1", 0)
    backgroundBar.setAttribute("y2", graphHeight)
    backgroundBar.classList.add("graph-bar-background")

    return backgroundBar
}

const createBar = async(barOffset, height) =>{
    let bar = document.createElementNS(ns,'line')

    bar.setAttribute("x1", barOffset)
    bar.setAttribute("x2", barOffset)
    bar.setAttribute("y1", graphHeight-height)
    bar.setAttribute("y2", graphHeight)
    bar.classList.add("graph-bar")

    return bar
}

const createBarLabel = async(barOffset, score, graphType) =>{
    let offsetX = (graphType == "point")? 0 : barWidth;
    let offsetY = (graphType == "point")? 70 : 20;
    let offsetOrigin = (graphType == "point")? 60 :0 ;
    let label = document.createElementNS(ns,'text')

    label.setAttribute("x", barOffset-offsetX)
    label.setAttribute("y", graphHeight+offsetY)
    label.style.transformOrigin= barOffset + "px " + (graphHeight + offsetOrigin) + "px";
    if(graphType == "point")label.setAttribute("transform", "rotate(-90)")
    label.classList.add("graph-bar-label")
    label.textContent = (graphType == "point")? formatXp(score): score;
    
    return label
}

const createBarAnimation = async(graph,height) =>{
    let anim = document.createElementNS(ns,'animate')

    anim.setAttribute("attributeName", "y1")
    anim.setAttribute("from", graphHeight)
    anim.setAttribute("to", graphHeight-height)
    anim.setAttribute("dur", "2s")
    anim.setAttribute("fill", "freeze")
    anim.setAttribute("begin", graph.getCurrentTime() + "s")

    return anim
}
/* -------------------------------------------------------------------------- */
/*                                   helpers                                  */
/* -------------------------------------------------------------------------- */
 const cleanTitle = (base)=> {
    //  replace "-" with " " and uppercase
    let result = base.replace(/-/g, " ");
    return result.toUpperCase()
 }
//  format xp to be more readable to kb
 const formatXp = (score) => {
    return (parseFloat(score)/1000).toFixed(2)
}
/* ------------------------------ async append ------------------------------ */
const addChildElement = async (parent, child)=>{
    parent.appendChild(child)
}
const calcBarOffset=(graphType, barCount)=>{
    let graphRect = document.querySelector(`#${graphType}-graph`).getBoundingClientRect()  
    return Math.round(((graphRect.width - barWidth) /  barCount )-barWidth)
}

let calcGraphWidth= (graph) => {
    return graph.getBoundingClientRect().width
}