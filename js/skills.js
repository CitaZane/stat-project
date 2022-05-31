/* ----------------------- Name references for skills ----------------------- */
const skillNames = {
    algo:"Elementary algorithms",
    ["back-end"]:"Back-end",
    css:"CSS",
    docker:"Docker",
    ["front-end"]:"Front-end",
    game:"Game programming",
    go:"Go",
    html:"HTML",
    js:"JS",
    sql:"SQL",
    stats:"Statistics",
    ["sys-admin"]:"System administration"
}


/* ------------------- based on all skills pick top three ------------------- */
const pickHighestSkills = (allSkills) =>{
    const topSkills = [];
    Object.keys(allSkills).sort((a, b) => allSkills[b] - allSkills[a]).forEach((skill, index) =>
   {
      if(index < 3){
          let top = {title:skillNames[skill], amount :allSkills[skill] }
          topSkills.push(top)
      }
   });
   return topSkills
}

/* -------------------------------------------------------------------------- */
/*                               display skills                               */
/* -------------------------------------------------------------------------- */
const displaySkills = () => {
    
    userData.topSkills.forEach((skill, index)=> {
        // for each skill target title element and change inner text
        let title = document.getElementById(`skill-${index+1}-title`)
        title.innerText = skill.title
        // change skill % amount in label
        let label = document.querySelector(`#skill-${index+1}-label`)
        label.innerHTML = `    ${skill.amount}%`
        // change skill bar length based on %(label)
        let skillBar = document.getElementById(`skill-bar-${index+1}`)
        let barWidth = Math.round(skillBar.firstElementChild.getAttribute("x2")/100* skill.amount)
        // animate akill bar to grow from 0 in 2 sec
        let animateElem = skillBar.lastElementChild.firstElementChild
        animateElem.setAttribute("to", barWidth)
        animateElem.setAttribute("begin", skillBar.getCurrentTime() + "s")
    });
}
/* -------------------------------------------------------------------------- */
/*                                clear skills                                */
/* -------------------------------------------------------------------------- */
const clearSkills = () => {
    const temp = " --/-- "
    // replace values with temp string
    let titles = document.getElementsByClassName("skill-title")
    for(i=0; i<titles.length;i++){
        titles[i].innerText = temp
    }
    let labels = document.getElementsByClassName("skill-label")
    for(i=0; i<labels.length;i++){
        labels[i].innerText = temp
    }
}
