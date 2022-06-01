/* -------------------------------------------------------------------------- */
/*              functions for stat manipulation mostly show/hide              */
/* -------------------------------------------------------------------------- */
const temp = " --/-- "
/* -------------------------------------------------------------------------- */
/*                                   display                                  */
/* -------------------------------------------------------------------------- */

/* ------------------------ display current user name ----------------------- */
const displayUsername = () =>{
    let username = document.querySelector(".user-name")
    username.innerHTML = userData.username
}
/* ----------- display current user xp with additional calculation ---------- */
const displayXP = () =>{
    let xp = document.querySelector("#total-xp")
    xp.innerHTML = Math.round(userData.totalXP / 1000)
}
/* ----------------------- display current user level ----------------------- */
const displayLevel = () =>{
    increaseLevel(userData.level,0)
}

/* -------------------------------------------------------------------------- */
/*                                    clear                                   */
/* -------------------------------------------------------------------------- */

const clearUsername = () =>{
    let username = document.querySelector(".user-name")
    username.innerHTML = temp
}
/* ----------- display current user xp with additional calculation ---------- */
const clearXP = () =>{
    let xp = document.querySelector("#total-xp")
    xp.innerHTML = temp
}
/* ----------------------- display current user level ----------------------- */
const clearLevel = () =>{
    let level = document.querySelector("#level")
    level.innerHTML = temp
}

/* -------------------------------------------------------------------------- */
/*                                   helper                                   */
/* -------------------------------------------------------------------------- */

const increaseLevel = (targetLevel, currentLevel=0) => {
  if (currentLevel >=targetLevel)return
  let levelElement = document.querySelector("#level")
  currentLevel ++
  levelElement.innerText = currentLevel
  if (currentLevel ==targetLevel)return
  setTimeout(increaseLevel,50,targetLevel, currentLevel) 
}