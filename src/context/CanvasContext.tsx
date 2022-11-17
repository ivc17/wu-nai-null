import React, { useContext, useEffect, useMemo } from 'react'
import { Camera, Scene, Vector3, WebGLRenderer } from 'three'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useMaterial } from './MaterialContext'

const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
// renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.5

renderer.outputEncoding = THREE.sRGBEncoding

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
)
const scene = new THREE.Scene()

interface CanvasContextType {
  scene: Scene
  camera: Camera
  renderer: WebGLRenderer
}

export const CanvasContext = React.createContext<CanvasContextType>({
  scene,
  camera,
  renderer
})

export const CanvasProvider = ({ children }: { children: React.ReactNode }) => {
  const { hdrEquirect } = useMaterial()

  //setup
  useEffect(() => {
    scene.background = hdrEquirect

    renderer.setSize(window.innerWidth, window.innerHeight)

    const ambientLight = new THREE.AmbientLight('#3463cc', 0.8)
    const pointLight = new THREE.PointLight('#eefdff', 1, 800)
    pointLight.lookAt(new Vector3(0, 0, 0))
    const controls = new OrbitControls(camera, renderer.domElement)

    scene.add(ambientLight, pointLight)
    camera.position.z = -250
    camera.position.x = 0
    camera.position.y = 0
    controls.enablePan = true

    controls.minDistance = 200
    controls.maxDistance = 800

    controls.minPolarAngle = 1.2507750139181867 // 1.5 * Math.PI / 12;
    controls.maxPolarAngle = 1.9507750139181867 // 1.5 * Math.PI / 3;

    // controls.minAzimuthAngle = 2.541592653589793
    // controls.maxAzimuthAngle = 3.841592653589793

    controls.enableDamping = true
    controls.autoRotate = true
    controls.autoRotateSpeed = -0.3

    // const id = setInterval(() => {
    //   controls.autoRotateSpeed *= -1
    // }, 15000)

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    })

    const animate = () => {
      renderer.render(scene, camera)
      controls.update()
      requestAnimationFrame(animate)
    }
    animate()

    // return () => clearInterval(id)
  }, [hdrEquirect])

  const val = useMemo(() => {
    return { scene, camera, renderer }
  }, [])

  return <CanvasContext.Provider value={val}>{children}</CanvasContext.Provider>
}

export function useCanvas() {
  const context = useContext(CanvasContext)
  return context
}
