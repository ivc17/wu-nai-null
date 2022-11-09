import { Box, Typography } from '@mui/material'
import gsap from 'gsap'
import { useCallback, useEffect, useRef, useState } from 'react'
import { GlyphsList } from '../../assets/glyphsList'

import { withTransition } from '../../components/WithTransition'
import { useTransition } from '../../context/TransitionContext'

function Home() {
  const [selectedIdx, setSelectedIdx] = useState<number | undefined>(undefined)
  const tl = useRef<gsap.core.Timeline>()
  const { wrappedNavigate } = useTransition()

  useEffect(() => {
    if (tl.current) return
    const timeline = gsap.timeline({ repeat: -1 })
    GlyphsList.forEach((el, index) => {
      timeline.fromTo(
        `#carousel>div:nth-of-type(${index + 1})`,
        {
          display: 'none'
        },
        {
          display: 'block',
          duration: 0.07
        }
      )
      timeline.addLabel(index + '')
      timeline.to(`#carousel>div:nth-of-type(${index + 1})`, {
        display: 'none',
        duration: 0.07
      })
    })
    tl.current = timeline
    timeline.delay(1.5)
    timeline.play()
  }, [tl])

  const handleClick = useCallback(() => {
    if (!tl.current) return
    const paused = tl.current.paused()
    if (paused) {
      setSelectedIdx(undefined)
      tl.current.paused(false)
    } else {
      const nextLabel = tl.current.nextLabel()
      setSelectedIdx(+nextLabel)
      tl.current.pause(nextLabel)
    }
  }, [tl])

  return (
    <Box onClick={handleClick}>
      {selectedIdx !== undefined && GlyphsList[selectedIdx] && (
        <Typography fontSize={50}>{selectedIdx}</Typography>
      )}
      <Box
        margin="0 auto"
        height="80vw"
        width="80vw"
        sx={{ position: 'relative' }}
        id="carousel"
      >
        {GlyphsList.map((Item, idx) => (
          <Box
            id={idx + ''}
            position="absolute"
            top={0}
            left={0}
            key={idx}
            width="100%"
            height={'100%'}
          >
            <Item />
          </Box>
        ))}
      </Box>
      <button
        onClick={() => {
          wrappedNavigate('/test')
        }}
      >
        click
      </button>
    </Box>
  )
}

export default withTransition(Home)
