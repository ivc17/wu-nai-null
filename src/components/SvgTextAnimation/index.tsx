import { useEffect, useState } from 'react'
import useBreakpoint from '../../hooks/useBreakpoints'

export default function SvgTextAnimation() {
  const [fontSize, setFontSize] = useState(18)

  const isDownLg = useBreakpoint('lg')
  const isDownSm = useBreakpoint('sm')

  useEffect(() => {
    let fontSize = 18
    if (isDownLg) {
      fontSize = 30
    } else {
      fontSize = 40
    }
    if (isDownSm) {
      fontSize = 18
    }
    setFontSize(fontSize)
    return
  }, [isDownLg, isDownSm])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        height: '90vh',
        width: '90vw',
        position: 'absolute',
        bottom: isDownSm ? 15 : 20,
        left: isDownSm ? 8 : 20
      }}
    >
      <path
        id="p"
        d={`m ${fontSize / 2} ${fontSize} V ${
          window.innerHeight * 0.9 - fontSize / 2
        }  H ${window.innerWidth - fontSize} `}
        fill="none"
        // stroke="red"
      />
      <text
        className="notThereYet"
        width="100%"
        style={{ transform: 'translate3d(0,0,0)' }}
        xlinkHref="#p"
      >
        <textPath
          style={{
            fontSize: fontSize,
            fontWeight: 900
          }}
          alignment-baseline="center"
          xlinkHref="#p"
        >
          <animate
            attributeName="startOffset"
            values="-100;100;"
            dur="10s"
            repeatCount="indefinite"
          />
          {Array.from(Array(10).keys()).map(() => (
            <>
              Void&nbsp;&nbsp;Empty&nbsp;&nbsp;虛空&nbsp;&nbsp;bô&nbsp;&nbsp;Nothing&nbsp;&nbsp;沒有&nbsp;&nbsp;NONE&nbsp;&nbsp;なし&nbsp;&nbsp;不&nbsp;&nbsp;
            </>
          ))}
        </textPath>
      </text>
    </svg>
  )
}
