var drawingCanvas = document.createElement('canvas')
drawingCanvas.setAttribute('id', 'drawing')
drawingCanvas.width = size
drawingCanvas.height = size
drawingCanvas.style.position = 'absolute'
document.body.appendChild(drawingCanvas)
var dctx = drawingCanvas.getContext('2d')
var drawing = false
drawingCanvas.onmousedown = e => {
  if(!sound) createAudioContext()
  if(!drawing) drawing = true
}

drawingCanvas.onmouseup = e => {
  if(drawing) drawing = false
}
var distance = 0
let posX = 0
let prevPosX = 0 
drawingCanvas.onmousemove = e => {
  if(!drawing) return
  dctx.beginPath()
  dctx.fillStyle = 'blue'
  dctx.arc(e.pageX, e.pageY, 10, 0, Math.PI * 2)
  dctx.fill()
  dctx.closePath()
  
  prevPosX = posX
  posX = e.pageX
  distance += Math.abs(posX - prevPosX)
  distance = distance % 10000
  sound.play(`${Math.floor(distance)}`);
  sound.fade(1, 0, 2000)
}

var sound;
function createAudioContext() {
  sound = new Howl({
    src: ['audio-loop.m4a'],
    sprite: [...Array(10000)].reduce((sprite, _, i) => {
      sprite[i] = [i, 500]
      return sprite
    }, {})
  }); 
}