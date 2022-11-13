import { Box, Button, debounce, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { GlyphsList } from '../../assets/glyphsList'
import { withTransition } from '../../components/WithTransition'
import { useTransition } from '../../context/TransitionContext'
import ReactDOMServer from 'react-dom/server'
import textBgURL from '../../assets/img/textbg2.png'

import { ReactComponent as Outline } from '../../assets/svg/ivc17.svg'

import useTexture from '../../hooks/useTexture'
import {
  Clock,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  PlaneGeometry,
  Vector3
} from 'three'
import useFont from '../../hooks/useFont'
import IndexCircle from 'components/IndexCircle'
import useBreakpoint from 'hooks/useBreakpoints'
import { useMaterial } from 'context/MaterialContext'
const color = '#ffffff'

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
)
const scene = new THREE.Scene()

const defaultExtrusion = 5

const fillMaterial = new THREE.MeshPhysicalMaterial({
  color: '#F3FBFB',
  opacity: 0
})
const stokeMaterial = new THREE.LineBasicMaterial({
  color: '#ffffff'
})
const hdrEquirect = new RGBELoader().load(
  '/royal_esplanade_1k.hdr',
  function () {
    hdrEquirect.mapping = THREE.EquirectangularReflectionMapping
    // scene.background = hdrEquirect
  }
)

const renderSVG = (
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
    const randomPoints = []

    for (let i = 0; i < 4; i++) {
      randomPoints.push(
        new THREE.Vector3(
          (i - 4.5) * 50,
          THREE.MathUtils.randFloat(-10, 10),
          THREE.MathUtils.randFloat(-10, 10)
        )
      )
    }

    const randomSpline = new THREE.CatmullRomCurve3(randomPoints)

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

function SingleGlyph() {
  const wrapper = useRef<HTMLDivElement>(null)
  const glyphMesh = useRef<THREE.Group>()
  const { wrappedNavigate } = useTransition()
  const { id } = useParams()
  const font = useFont('VOID EMPTY')
  const font4 = useFont('NOTHING NULL')
  const font2 = useFont('VOID EMPTY')
  const font3 = useFont('VOID EMPTY')

  const { glassMaterial, matcapMaterial, frameMaterial } = useMaterial()
  const [material, setMaterial] = useState(glassMaterial)

  const isDownSm = useBreakpoint('sm')
  const textbg = useTexture(textBgURL)

  const glyph = useMemo(() => {
    const El = id && GlyphsList[+id] ? GlyphsList[+id] : undefined
    return El ? <El /> : undefined
  }, [id])

  //setup
  useEffect(() => {
    if (!wrapper.current) return
    const canvas = wrapper.current.querySelector('canvas')
    if (canvas) return
    scene.background = new THREE.Color(0xffffff)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    wrapper.current.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight('#ffffff')
    const pointLight = new THREE.PointLight('#ffffff', 2, 800)
    pointLight.lookAt(new Vector3(0, 0, 0))
    const controls = new OrbitControls(camera, renderer.domElement)

    scene.add(ambientLight, pointLight)
    camera.position.z = -250
    camera.position.x = 0
    camera.position.y = 0
    controls.enablePan = true

    // controls.minPolarAngle = 1.5507750139181867 // 1.5 * Math.PI / 12;
    // controls.maxPolarAngle = 1.5507750139181867 // 1.5 * Math.PI / 3;

    // controls.minAzimuthAngle = 2.841592653589793
    // controls.maxAzimuthAngle = 3.541592653589793

    controls.enableDamping = true
    // controls.autoRotate = true

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    })

    const { object } = renderSVG(0, ReactDOMServer.renderToString(<Outline />))
    object.position.set(0, 0, 200)
    scene.add(object)
    object.scale.set(-1.5, -1.5, 1.5)

    const animate = () => {
      renderer.render(scene, camera)
      controls.update()
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  useEffect(() => {
    if (font && font2 && font3 && font4) {
      // font.position.set(0, 250, 900)
      // scene.add(font)
      // font2.position.set(0, -280, 900)
      // scene.add(font2)
      // font3.position.set(0, 0, 900)
      // scene.add(font3)
      // font4.position.set(0, 150, 900)
      // scene.add(font4)
    }
  }, [font, font2, font3, font4])

  useEffect(() => {
    if (isDownSm) {
      camera.zoom = 0.5
    } else {
      camera.zoom = 1
    }
  }, [isDownSm])

  useEffect(() => {
    if (textbg && frameMaterial) {
      const plane = new PlaneGeometry(400, 400, 1)

      material.transparent = true
      const mesh = new Mesh(plane, frameMaterial)
      // let imgRatio = textbg.image.width / textbg.image.height
      // let planeRatio = plane.parameters.width / plane.parameters.height
      // textbg.wrapS = THREE.RepeatWrapping // THREE.ClampToEdgeWrapping;
      // textbg.repeat.x = planeRatio / imgRatio
      // textbg.offset.x = -0.5 * (planeRatio / imgRatio - 1)
      plane.scale(-1, 1, 1)
      mesh.position.set(0, 0, -10)
      scene.add(mesh)
    }
  }, [frameMaterial, material, textbg])

  useEffect(() => {
    if (!glyph) return
    if (glyphMesh.current) {
      scene.remove(glyphMesh.current)
    }
    const g = ReactDOMServer.renderToString(glyph)
    const { object } = renderSVG(0.1, g)
    scene.add(object)
    camera.lookAt(0, 0, 0)
    object.scale.set(-1.5, -1.5, 1.5)
    object.position.set(20, 40, 0)
    glyphMesh.current = object

    const animate = () => {
      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      scene.remove(object)
    }
  }, [glyph])

  const handleMaterial = useMemo(() => {
    return debounce(() => {
      if (material === matcapMaterial) {
        setMaterial(glassMaterial)
        glyphMesh.current?.children.forEach((item: any) => {
          if ('material' in item) {
            item.material = glassMaterial
          }
        })
      } else {
        setMaterial(matcapMaterial)
        glyphMesh.current?.children.forEach((item: any) => {
          if ('material' in item) {
            item.material = matcapMaterial
          }
        })
      }
    })
  }, [glassMaterial, matcapMaterial, material])

  useEffect(() => {
    glyphMesh.current?.children.forEach((item: any) => {
      if ('material' in item) {
        item.material = new MeshBasicMaterial({ color: 'black' })
      }
    })
  }, [glassMaterial])

  useEffect(() => {
    // setTimeout(handleMaterial, 3000)
  }, [handleMaterial])

  return (
    <Box
      height="100vh"
      width="100vw"
      ref={wrapper}
      position="relative"
      sx={{ '& canvas': { width: '100vw', height: '100vh', zIndex: -1 } }}
    >
      <Box position="fixed" top={20} right={20}>
        <Typography fontWeight={800} fontSize={{ xs: 30, sm: 40 }}>
          無 ない NULL
        </Typography>
        <IndexCircle selectedIdx={id ? +id : undefined} />
      </Box>
      <Box position="fixed" top={{ xs: 90, sm: 150 }} left={20}>
        <Button
          sx={{
            padding: 0,
            color: '#000',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            whiteSpace: 'nowrap',

            fontSize: { xs: 16, sm: 24 }
          }}
          onClick={() => {
            wrappedNavigate('/')
          }}
        >
          <svg
            viewBox="0 0 296.75 200"
            width="40px"
            style={{ marginTop: -10, transform: 'scaleX(-1)' }}
          >
            <polygon points="296.75,149.188 215,98.875 215,132.375 0,132.375 0,165.375 215,165.375 215,197.875 " />
          </svg>
          BACK
        </Button>
      </Box>
      <Box
        left={'50%'}
        bottom={{ xs: 40, md: 100 }}
        position="fixed"
        sx={{
          transform: 'translateX(-50%)',
          '& svg': {
            height: 100,
            width: 100,
            fill: '#ff0000'
          }
        }}
      >
        {glyph}
        {/* <Button
          sx={{
            fontWeight: 700,
            color: '#ff0000',
            fontSize: 30
          }}
          onClick={handleMaterial}
        >
          CHANGE MATERIAL
        </Button> */}
        {/*<Button
          sx={{
            fontWeight: 700,
            color: '#ff0000',
            fontSize: 30
          }}
          onClick={() => {
            setMaterial(glassMaterial)
          }}
        >
          GLASS MATERIAL
        </Button> */}
      </Box>
    </Box>
  )
}

export default withTransition(SingleGlyph)
