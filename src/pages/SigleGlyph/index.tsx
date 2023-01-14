import { Box, Button, debounce, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as THREE from 'three'

import { GlyphsList } from '../../assets/glyphsList'
import { withTransition } from '../../components/WithTransition'
import { useTransition } from '../../context/TransitionContext'
import ReactDOMServer from 'react-dom/server'
import textBgURL from '../../assets/img/red.png'
import { ReactComponent as Outline } from '../../assets/svg/ivc17.svg'

import useTexture from '../../hooks/useTexture'
import {
  // Clock,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry
} from 'three'
import useFont from '../../hooks/useFont'
import IndexCircle from 'components/IndexCircle'

import { fillMaterial, useMaterial } from 'context/MaterialContext'
import { renderSVG } from 'utils/renderSvg'
import { useCanvas } from 'context/CanvasContext'

const defaultExtrusion = 2
function SingleGlyph() {
  const wrapper = useRef<HTMLDivElement>(null)
  const glyphMesh = useRef<THREE.Group>()
  const { wrappedNavigate } = useTransition()
  const { id } = useParams()
  const font = useFont('NOTHING NULL')
  const font2 = useFont('VOID EMPTY')
  const font3 = useFont('NOTHING NULL')
  const font4 = useFont('VOID EMPTY')
  const { glassMaterial, matcapMaterial } = useMaterial()
  const { scene, camera, renderer } = useCanvas()
  const [material, setMaterial] = useState(glassMaterial)

  const textbg = useTexture(textBgURL)

  const glyph = useMemo(() => {
    const El = id && GlyphsList[+id] ? GlyphsList[+id] : undefined
    return El ? <El /> : undefined
  }, [id])

  useEffect(() => {
    if (!wrapper.current) return
    const canvas = wrapper.current.querySelector('canvas')
    if (canvas) return
    wrapper.current.appendChild(renderer.domElement)
    const { object } = renderSVG(0, ReactDOMServer.renderToString(<Outline />))
    object.position.set(0, -20, 200)
    scene.add(object)
    object.scale.set(-1.2, -1.2, 1.2)
  }, [renderer.domElement, scene])

  useEffect(() => {
    if (font && font2 && font3 && font4) {
      font.position.set(0, 290, 800)
      scene.add(font)
      font2.position.set(0, -380, 800)
      scene.add(font2)
      font3.position.set(0, 290, -800)
      font3.scale.setX(1)
      scene.add(font3)
      font4.position.set(0, -380, -800)
      font4.scale.setX(1)
      scene.add(font4)
    }
  }, [font, font2, font3, font4, scene])

  useEffect(() => {
    if (textbg) {
      const plane = new PlaneGeometry(200, 100, 1)
      const material = new MeshBasicMaterial({
        map: textbg,
        side: DoubleSide,
        // alphaMap: textbg,
        alphaToCoverage: false
      })
      material.transparent = false
      const mesh = new Mesh(plane, material)
      let imgRatio = textbg.image.width / textbg.image.height
      let planeRatio = plane.parameters.width / plane.parameters.height
      textbg.wrapS = THREE.RepeatWrapping // THREE.ClampToEdgeWrapping;
      textbg.repeat.x = planeRatio / imgRatio
      textbg.offset.x = -0.5 * (planeRatio / imgRatio - 1)
      plane.scale(-1, 1, 1)
      mesh.position.set(0, 0, 100)
      // scene.add(mesh)
    }
  }, [textbg])

  useEffect(() => {
    if (!glyph) return
    if (glyphMesh.current) {
      scene.remove(glyphMesh.current)
    }
    const g = ReactDOMServer.renderToString(glyph)
    const { object } = renderSVG(defaultExtrusion, g)
    scene.add(object)
    camera.lookAt(0, 0, 0)
    object.scale.set(-1.5, -1.5, 1.5)
    object.position.set(20, 40, 0)
    glyphMesh.current = object

    return () => {
      scene.remove(object)
    }
  }, [camera, glyph, scene])

  const handleMaterial = useMemo(() => {
    return debounce(() => {
      if (material === fillMaterial) {
        setMaterial(matcapMaterial)
        glyphMesh.current?.children.forEach((item: any) => {
          if ('material' in item) {
            item.material = matcapMaterial
          }
        })
      } else if (material === matcapMaterial) {
        setMaterial(glassMaterial)
        glyphMesh.current?.children.forEach((item: any) => {
          if ('material' in item) {
            item.material = glassMaterial
          }
        })
      } else {
        setMaterial(fillMaterial)
        glyphMesh.current?.children.forEach((item: any) => {
          if ('material' in item) {
            item.material = fillMaterial
          }
        })
      }
    }, 300)
  }, [glassMaterial, matcapMaterial, material])

  useEffect(() => {
    const id = setTimeout(handleMaterial, 5000)
    return () => clearTimeout(id)
  }, [handleMaterial])

  const nextId = useMemo(() => {
    if (!id) return 0
    const length = GlyphsList.length
    if (+id < length - 1) {
      return +id + 1
    } else if (+id === length) {
      return 0
    }
  }, [id])

  return (
    <Box
      height="100vh"
      width="100vw"
      ref={wrapper}
      position="relative"
      sx={{
        '& canvas': {
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          overflow: 'hidden'
        }
      }}
    >
      <Box position="fixed" top={20} right={20}>
        <Typography fontWeight={800} fontSize={{ xs: 30, sm: 40 }}>
          無 ない NULL
        </Typography>
        <IndexCircle selectedIdx={id ? +id : undefined} />
      </Box>
      <Box position="fixed" top={{ xs: 80, sm: 100 }} left={20}>
        <Button
          sx={{
            padding: 0,
            color: '#ff0000',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            whiteSpace: 'nowrap',

            fontSize: { xs: 12, sm: 18 }
          }}
          onClick={() => {
            wrappedNavigate('/')
          }}
        >
          <svg
            viewBox="0 0 296.75 200"
            width="30px"
            style={{ marginTop: -10, transform: 'scaleX(-1)', fill: '#ff0000' }}
          >
            <polygon points="296.75,149.188 215,98.875 215,132.375 0,132.375 0,165.375 215,165.375 215,197.875 " />
          </svg>
          <span>BACK to Home</span>
        </Button>
      </Box>
      <Box position="fixed" top={{ xs: 150, sm: 200 }} right={20}>
        <Button
          sx={{
            padding: 0,
            color: '#ff0000',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            whiteSpace: 'nowrap',

            fontSize: { xs: 16, sm: 24 }
          }}
          onClick={() => {
            wrappedNavigate('/characters')
          }}
        >
          List of all
        </Button>
      </Box>
      <Box
        position="fixed"
        top={'50%'}
        left={0}
        width="100%"
        display="flex"
        justifyContent={'space-between'}
      >
        <span />
        <Button
          sx={{
            padding: 0,
            color: '#ff0000',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            whiteSpace: 'nowrap',

            fontSize: { xs: 16, sm: 24 }
          }}
          onClick={() => {
            wrappedNavigate('/characters/' + nextId)
          }}
        >
          NEXT
        </Button>
      </Box>
      <Box
        left={'50%'}
        bottom={{ xs: 50, md: 100 }}
        position="fixed"
        sx={{
          transform: 'translateX(-50%)',
          '& svg': {
            height: { xs: 30, sm: 60 },
            width: { xs: 30, sm: 60 },
            fill: 'red'
          }
        }}
        display="grid"
        justifyItems={'center'}
      >
        <Box display="flex" gap={10}>
          <Button
            sx={{
              fontWeight: 700,
              color: '#ff0000',
              fontSize: { xs: 16, sm: 20 },
              whiteSpace: 'nowrap'
            }}
            onClick={handleMaterial}
          >
            CHANGE Material
          </Button>
        </Box>
        <Typography fontSize={12} whiteSpace="nowrap" fontWeight={700}>
          Scroll/Drag/Tap to zoom or move around
        </Typography>
        <Box> {glyph}</Box>
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
