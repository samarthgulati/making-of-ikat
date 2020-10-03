const count = 10
let points = []
const polyline = document.createElementNS(NS, 'path')
polyline.setAttribute('stroke', 'grey')
polyline.setAttribute('fill', 'none')
polyline.setAttribute('stroke-width', '10')
polyline.setAttribute('stroke-linecap', 'round')
polyline.setAttribute('stroke-linejoin', 'round')
svg.appendChild(polyline)
let movingtrail = false
window.onmousemove = trail 
window.ontouchmove = trail 
const pos = svg.getBoundingClientRect()
function trail(e) {
  const x = e.pageX - pos.x 
  const y = e.pageY - pos.y 
  if(!movingtrail) {
    movingtrail = true
    points = [...Array(count)].map(_ => ([x, y]))
  }
  points.push([x, y])
  points.shift()
  // console.log(e.pageX, e.pageY)
  
}
function polylineFromPoints(points) {
  const top = []
  const bottom = []
  const startR = 20
  const endR = 5
  const step = (startR - endR)/points.length
  for(let i = 0; i < points.length - 1; i++) {
    const r = startR - step * i
    const curr = points[i]
    const next = points[i + 1]
    const num = (next[1] - curr[1])
    const den = (next[0] - curr[0])
    if(num !== 0) {
      const slope = num / den
      const perp = -den/num
      const theta = Math.atan(perp)
      top.push([
        curr[0] + r * Math.cos(theta),
        curr[1] + r * Math.sin(theta)
      ])
      bottom.push([
        curr[0] - r * Math.cos(theta),
        curr[1] - r * Math.sin(theta)
      ])
    }
  }
  var d = `M${bottom[0][0]},${bottom[0][1]}
  A ${endR} ${endR} 0 0 0 ${top[0][0]},${top[0][1]}
  L ${top.join(' L ')}
  A ${startR} ${startR} 0 0 0 ${bottom[bottom.length - 1][0]},${bottom[bottom.length - 1][1]}
  L ${bottom.reverse().join(' L ')}
  Z`
  console.log(d)
  return d
}
// https://codepen.io/francoisromain/pen/dzoZZj

// The smoothing ratio
const smoothing = 0.2

// Properties of a line 
// I:  - pointA (array) [x,y]: coordinates
//     - pointB (array) [x,y]: coordinates
// O:  - (object) { length: l, angle: a }: properties of the line
const line = (pointA, pointB) => {
  const lengthX = pointB[0] - pointA[0]
  const lengthY = pointB[1] - pointA[1]
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  }
}

// Position of a control point 
// I:  - current (array) [x, y]: current point coordinates
//     - previous (array) [x, y]: previous point coordinates
//     - next (array) [x, y]: next point coordinates
//     - reverse (boolean, optional): sets the direction
// O:  - (array) [x,y]: a tuple of coordinates
const controlPoint = (current, previous, next, reverse) => {

  // When 'current' is the first or last point of the array
  // 'previous' or 'next' don't exist.
  // Replace with 'current'
  const p = previous || current
  const n = next || current

  // Properties of the opposed-line
  const o = line(p, n)

  // If is end-control-point, add PI to the angle to go backward
  const angle = o.angle + (reverse ? Math.PI : 0)
  const length = o.length * smoothing

  // The control point position is relative to the current point
  const x = current[0] + Math.cos(angle) * length
  const y = current[1] + Math.sin(angle) * length
  return [x, y]
}

// Create the bezier curve command 
// I:  - point (array) [x,y]: current point coordinates
//     - i (integer): index of 'point' in the array 'a'
//     - a (array): complete array of points coordinates
// O:  - (string) 'C x2,y2 x1,y1 x,y': SVG cubic bezier C command
const bezierCommand = (point, i, a) => {

  // start control point
  const cps = controlPoint(a[i - 1], a[i - 2], point)

  // end control point
  const cpe = controlPoint(point, a[i - 1], a[i + 1], true)
  return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`
}

// Render the svg <path> element 
// I:  - points (array): points coordinates
//     - command (function)
//       I:  - point (array) [x,y]: current point coordinates
//           - i (integer): index of 'point' in the array 'a'
//           - a (array): complete array of points coordinates
//       O:  - (string) a svg path command
// O:  - (string): a Svg <path> element
const svgPath = (points, command) => {
  // build the d attributes by looping over the points
  const d = points.reduce((acc, point, i, a) => i === 0
    ? `M ${point[0]},${point[1]}`
    : `${acc} ${command(point, i, a)}`
  , '')
  return d
}
function render() {
  requestAnimationFrame(render)
  // polyline.setAttribute('d', polylineFromPoints(points))
  polyline.setAttribute('d', svgPath(points, bezierCommand))
  // polyline.setAttribute('points', points)
}
render()