let cryptoDiv = document.getElementById('cryptos')
let cryptotab = document.getElementById('ctab')

$.ajax({
  url: '/all',
  type: 'post',
  data: JSON.stringify({ type: 'crypto' }),
  contentType: 'application/json'
}).then(cryptos => {
  for (let crypto of cryptos) {
    let newOne = document.createElement("canvas")
    let newCtx = newOne.getContext('2d')
    let newDiv = document.createElement("div")
    let newName = document.createElement("div")
    let newArtist = document.createElement("div")
    let newGrade = document.createElement("div")
    cryptoDiv.appendChild(newDiv)
    newDiv.appendChild(newOne)
    newOne.height = 24 * 10
    newOne.width = 24 * 10
    for (let row in crypto.dat) {
      for (let col in crypto.dat[row]) {
        newCtx.beginPath()
        newCtx.fillStyle = crypto.dat[row][col] ? crypto.dat[row][col] : "transparent"
        newCtx.fillRect(row * 10, col * 10, 10, 10)
      }
    }
    newDiv.appendChild(newName)
    newDiv.appendChild(newArtist)
    newDiv.appendChild(newGrade)
    newName.innerHTML = crypto.name
    newArtist.innerHTML = crypto.artist
    newGrade.innerHTML = "Grade: " + crypto.grade
    newDiv.style.display = "inline-block"
    newDiv.style.margin = "25px"
  }
})


function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function ctab(){
  cryptoDiv.style.display = 'block'
  usersDiv.style.display = 'none'
  cryptotab.style.borderBottom = '2px solid rgb(0, 119, 255)'
  usertab.style.borderBottom = '2px solid rgba(255, 255, 255, 0)'
}
