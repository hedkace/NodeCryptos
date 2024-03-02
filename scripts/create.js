

//Canvas Init
const artwork = document.querySelector('#artwork')
const artworkCtx = artwork.getContext('2d')
//Flags
let brushActive = true
let dropperActive = false
let gridActive = true
let dragging = false
let rtDragging = false
//Canvas Dimentional Vars and Data Array
let highlight //Array of tile coordinates that mouse is currently in
const dims = 24 //width and height of canvas in pixels
const tileScale = artwork.width / dims //Width and height of canvas "pixels" in actual pixels
let data = [] //2d array of pixel colors
for (let col = 0; col < dims; col++) {
  data.push([])
  for (let row = 0; row < dims; row++) {
    data[col].push(null)
  }
}

//Init Draw Becasue Otherwise Everything Breaks
let draw = function () {
  //Step 1: Clear
  artworkCtx.clearRect(0, 0, artwork.width, artwork.height)

  //Step 2: Draw Picture
  for (let col = 0; col < dims; col++) {
    for (let row = 0; row < dims; row++) {
      if (data[col][row] == null) continue
      artworkCtx.fillStyle = data[col][row]
      artworkCtx.fillRect((col * tileScale), (row * tileScale), tileScale, tileScale)
    }
  }

  //Step 3: Draw Grid
  if (gridActive) {
    artworkCtx.strokeStyle = '#919191'
    artworkCtx.lineWidth = 1
    for (let col = 1; col < 24; col++) {
      artworkCtx.beginPath()
      artworkCtx.moveTo(col * tileScale, 0)
      artworkCtx.lineTo(col * tileScale, artwork.width)
      artworkCtx.stroke()
    }
    for (let row = 1; row < 24; row++) {
      artworkCtx.beginPath()
      artworkCtx.moveTo(0, row * tileScale)
      artworkCtx.lineTo(artwork.height, row * tileScale)
      artworkCtx.stroke()
    }
  }

  //Step 4: Highlight Current Tile 
  if (highlight) {
    artworkCtx.strokeStyle = pickr.getColor().toHEXA().toString()
    artworkCtx.lineWidth = 3
    artworkCtx.strokeRect((highlight[0] * tileScale), (highlight[1] * tileScale), tileScale, tileScale)
  }
}

//Picker Init
const pickr = Pickr.create({
  el: '#pickr',
  theme: 'monolith',
  swatches: [
    '#FFFFFF00'
  ],
  showAlways: true,
  inline: true,
  components: {
    preview: true,
    opacity: true,
    hue: true,
    interaction: {
      hex: false,
      rgba: false,
      hsla: false,
      hsva: false,
      cmyk: false,
      input: true,
      clear: false,
      save: true
    }
  },
  default: '#000000'
})
pickr.swatches = 0
pickr.on('save', e => {
  pickr.swatches++
  if (pickr.swatches >= 16) {
    pickr.removeSwatch(0)
  }
  pickr.addSwatch(pickr.getColor().toRGBA().toString())
})

//Switch Listeners
const trashSwitch = document.querySelector('#body #container #sidebar #switches #delete')
trashSwitch.addEventListener('dblclick', e => { e.preventDefault(); clearData() })
const gridSwitch = document.querySelector('#body #container #sidebar #switches #toggle-grid')
gridSwitch.addEventListener('click', () => { gridActive = !gridActive; draw() })
const dropperSwitch = document.querySelector('#body #container #sidebar #switches #dropper')
dropperSwitch.addEventListener('click', () => {
  if (dropperActive) {
    dropperActive = false
    dropperSwitch.style.color = '#FFFFFF'
  }
  else {
    dropperActive = true
    dropperSwitch.style.color = 'rgb(42, 253, 253)'
  }
})
document.addEventListener('keydown', e => {
  if (e.key == 'Escape') {
    dropperActive = false
    dropperSwitch.style.color = '#FFFFFF'
  }
})

//Button Listeners
const saveBtn = document.querySelector('#body #container #sidebar #buttons #save')
saveBtn.addEventListener('click', e => { save() })
const mintBtn = document.querySelector('#body #container #sidebar #buttons #mint')
mintBtn.addEventListener('click', e => { submit() })

//Canvas Listeners
artwork.addEventListener('mousedown', e => {
  if (e.button == 0) dragging = true
  else if (e.button == 2) rtDragging = true

})
artwork.addEventListener('mouseup', e => {
  dragging = false
  rtDragging = false
})
artwork.addEventListener('mousemove', e => {
  highlight = [(Math.floor(e.offsetX / tileScale)), (Math.floor(e.offsetY / tileScale))]
  if (dragging) data[Math.floor(e.offsetX / tileScale)][Math.floor(e.offsetY / tileScale)] = pickr.getColor().toHEXA().toString()
  else if (rtDragging) data[Math.floor(e.offsetX / tileScale)][Math.floor(e.offsetY / tileScale)] = null
  requestAnimationFrame(draw)
})
artwork.addEventListener('mouseleave', e => {
  dragging = false
  highlight = null
  requestAnimationFrame(draw)
})
artwork.addEventListener('click', e => {
  if (dropperActive) {
    pickr.setColor(data[Math.floor(e.offsetX / tileScale)][Math.floor(e.offsetY / tileScale)], true)
    dropperActive = false
    dropperSwitch.style.color = '#FFFFFF'
  }
  else data[Math.floor(e.offsetX / tileScale)][Math.floor(e.offsetY / tileScale)] = pickr.getColor().toHEXA().toString()
  requestAnimationFrame(draw)
})
artwork.addEventListener('contextmenu', e => {
  e.preventDefault()
  data[Math.floor(e.offsetX / tileScale)][Math.floor(e.offsetY / tileScale)] = null
  requestAnimationFrame(draw)
})

function clearData() {
  for (let col = 0; col < dims; col++) {
    for (let row = 0; row < dims; row++) {
      data[col][row] = null
    }
  }
  draw()
}

function download() {
  gridActive = false
  draw()
  window.open(artwork.toDataURL('image/png'))
    var a  = document.createElement('a');
    a.href = artwork.toDataURL('png');
    a.download = 'image.png';
    a.click()
}

function submit(){
  let gridState = gridActive
  gridActive = false
  draw()
  let name = prompt('Enter the name of your cryptoCOMET')
  $.ajax ({
    url: '/submit',
    type: "POST",
    data: JSON.stringify({"name": name, "dat": data , "png": artwork.toDataURL('image/png')}),
    dataType: "json",
    contentType: "application/json; charset=utf-8"
  })
  clearData()
  save()
  gridActive = gridState
  draw()
}

function save(){
  $.ajax({
    url: '/artwork',
    type: "POST",
    data: JSON.stringify({ data: data }),
    dataType: "json",
    contentType: "application/json; charset=utf-8"
  }).then(result => {
    console.log('Saved')
  })
}

//Initial Draw to Canvas
$.get('/artwork').then((result) => {
  if(result == null) return
  data = result
  draw()
})

draw()