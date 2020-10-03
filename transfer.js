const width = window.innerWidth
const height = window.innerHeight
const size = Math.min(width, height)
const center = [
  size * 0.5,
  size * 0.5
]
const strokeWidth = 2
const r = strokeWidth
const margin = 32
const rows = Math.floor((size - (margin * 2)) / (r*2))
const side = ((size - margin - r) - (margin + r)) + Math.PI * r
const lines = []
const animations = []
const groupBy = 5
const startX = margin + r
const endX = size - margin - r
const offset = (endX - startX) * 0.1
const duration = 1000
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
canvas.width = size
canvas.height = size
canvas.style.position = 'absolute'
// canvas.style.zIndex = 2
document.body.appendChild(canvas)
// ctx.globalCompositeOperation = 'xor'
ctx.rect(margin, margin, size - 2 * margin, size - 2 * margin)
// ctx.fillStyle = 'rgba(0, 0, 60, 0.75)'
ctx.fillStyle = 'grey'
ctx.fill()
ctx.globalCompositeOperation = 'destination-out'
const c = Math.floor(rows / (groupBy * 5))
const gap = (size - 2 * margin) / c
const s = gap * 0.75
// function drawMotif(x, y, w, h) {
//   ctx.beginPath();
//   ctx.arc(x + w * 0.5, 
//           y + h * 0.5, 
//           w * 0.5, 
//           -Math.PI * 0.5,
//            Math.PI * 0.5
//           )
//   ctx.arc(x + w * 0.5, 
//           y + h * 0.5, 
//           w * 0.5, 
//           Math.PI * 0.5, 
//           -Math.PI * 0.5
//           )
//   ctx.closePath();
//   ctx.stroke()
//   // ctx.fillRect(x, y, w, h)
// }

// ctx.drawImage(img, 0, 0)
function drawMotif(x, y, w, h) {
  ctx.drawImage(img, x, y, w, h)
}

// ctx.strokeStyle = '#d45956'
ctx.lineWidth = 10
for(let i = 1; i < c; i++) {
  for(let j = 1; j < c; j++) {
    drawMotif(
      margin + j * gap - s * 0.5 + (i % 2 ? -s/4 : s/4), 
      margin + i * gap - s * 0.5, 
      s, s
    )
  }
}
