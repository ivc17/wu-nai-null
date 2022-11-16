import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader"
import * as THREE from 'three'
import { fillMaterial } from "context/MaterialContext"

const stokeMaterial = new THREE.LineBasicMaterial({
  color: 'red'
})

export const renderSVG = (
  extrusion: number,
  svg: string,
  material?: THREE.Material
) => {
  const loader = new SVGLoader()
  const svgData = loader.parse(svg)
  const svgGroup = new THREE.Group()
  const updateMap: any[] = []

  svgGroup.scale.y *= -1
  svgGroup.scale.x *= -1
  svgData.paths.forEach((path) => {
    const shapes = SVGLoader.createShapes(path)
    // const randomPoints = []

    // for (let i = 0; i < 4; i++) {
    //   randomPoints.push(
    //     new THREE.Vector3(
    //       (i - 4.5) * 50,
    //       THREE.MathUtils.randFloat(-10, 10),
    //       THREE.MathUtils.randFloat(-10, 10)
    //     )
    //   )
    // }

    // const randomSpline = new THREE.CatmullRomCurve3(randomPoints)

    shapes.forEach((shape) => {
      const meshGeometry = new THREE.ExtrudeGeometry(shape, {
        depth: extrusion,
        bevelEnabled: extrusion === 0 ? false : true,
        // extrudePath: extrusion === 0 ? undefined : randomSpline,
        bevelThickness: 5,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 3
      })

      const linesGeometry = new THREE.EdgesGeometry(meshGeometry)
      const mesh = new THREE.Mesh(meshGeometry, material ?? fillMaterial)

      if (extrusion === 0) {
        const lines = new THREE.LineSegments(linesGeometry, stokeMaterial)
        updateMap.push({ shape, lines })
        svgGroup.add(lines)
      } else {
        updateMap.push({ shape, mesh })
        svgGroup.add(mesh)
      }
    })
  })

  const box = new THREE.Box3().setFromObject(svgGroup)

  const size = box.getSize(new THREE.Vector3())
  const yOffset = size.y / -2
  const xOffset = size.x / -2

  // Offset all of group's elements, to center them
  svgGroup.children.forEach((item) => {
    item.position.x = xOffset
    item.position.y = yOffset
  })
  svgGroup.position.set(-xOffset / 2, -yOffset, 0)
  // svgGroup.rotateX(-Math.PI / 20)

  return {
    object: svgGroup,
    update(extrusion: number) {
      updateMap.forEach((updateDetails) => {
        const meshGeometry = new THREE.ExtrudeGeometry(updateDetails.shape, {
          depth: extrusion,
          bevelEnabled: false
        })
        const linesGeometry = new THREE.EdgesGeometry(meshGeometry)

        updateDetails.mesh.geometry.dispose()
        updateDetails.lines.geometry.dispose()
        updateDetails.mesh.geometry = meshGeometry
        updateDetails.lines.geometry = linesGeometry
      })
    }
  }
}