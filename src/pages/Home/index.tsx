import { Box, Button, Typography } from '@mui/material'
import gsap from 'gsap'
import { useCallback, useEffect, useRef, useState } from 'react'
import { GlyphsList } from '../../assets/glyphsList'

import IndexCircle from '../../components/IndexCircle'

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
    timeline.delay(1)
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
      if (isNaN(+nextLabel)) {
        setSelectedIdx(0)
        tl.current.play('0')
        return
      }
      setSelectedIdx(+nextLabel)
      tl.current.pause(nextLabel)
    }
  }, [tl])

  return (
    <Box
      onClick={handleClick}
      position="relative"
      padding="20px"
      height={'100vh'}
      display="flex"
      flexDirection={'column'}
      justifyContent="center"
      sx={{ pointerEvent: selectedIdx ? 'none' : 'auto' }}
    >
      <Box position="absolute" top={20} right={20}>
        <Typography fontWeight={800} fontSize={{ xs: 30, sm: 40 }}>
          無 ない NULL
        </Typography>
        <IndexCircle selectedIdx={selectedIdx} />

        <Button
          variant="text"
          sx={{
            fontWeight: 900,
            underline: 'none',
            color: '#ff0000',
            zIndex: 1301,
            float: 'right',
            mt: '10px'
          }}
          onClick={(e) => {
            e.preventDefault()
            wrappedNavigate('/characters')
          }}
        >
          List of all
        </Button>
      </Box>
      <Box
        margin="auto auto"
        max-height="80vh"
        width="80vw"
        sx={{
          maxWidth: window.innerHeight * 0.8,
          position: 'relative',
          aspectRatio: '1 / 1',
          transform: 'translateY(-5vh)'
        }}
        id="carousel"
      >
        {GlyphsList.map((Item, idx) => (
          <Box
            id={idx + ''}
            position="absolute"
            top={'50%'}
            left={0}
            key={idx}
            width="100%"
            height={'100%'}
            sx={{
              transform: {
                xs: 'translateY(-60%)',
                sm: 'translateY(-50%)',
                '& svg': { fill: '#ff0000' }
              }
            }}
          >
            <Item />
          </Box>
        ))}
        <Box
          width="100%"
          bottom={0}
          position="absolute"
          sx={{ transform: 'translateY(100%)' }}
        >
          {
            <Box
              width="100%"
              display="flex"
              justifyContent="space-between"
              sx={{
                fontSize: { xs: 16, sm: 24 },
                fontWeight: '700'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '5px',
                  flexDirection: 'column'
                }}
              >
                <span>Click anywhere to</span>
                {selectedIdx === undefined ? (
                  <span>FREEZE</span>
                ) : (
                  <span> UNFREEZE</span>
                )}
              </Box>
              {selectedIdx !== undefined && (
                <Button
                  sx={{
                    padding: 0,
                    width: 'max-content',
                    color: '#ff0000',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '5px',
                    whiteSpace: 'nowrap',
                    flexDirection: 'column',
                    fontSize: { xs: 16, sm: 24 }
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    wrappedNavigate('/characters/' + selectedIdx)
                  }}
                >
                  SEE DETAILS
                  <br />
                  <svg
                    viewBox="0 0 296.75 200"
                    width="40px"
                    style={{ marginTop: -10, fill: '#ff0000' }}
                  >
                    <polygon points="296.75,149.188 215,98.875 215,132.375 0,132.375 0,165.375 215,165.375 215,197.875 " />
                  </svg>
                </Button>
              )}
            </Box>
          }
        </Box>
      </Box>
      <Typography
        fontWeight={900}
        fontSize={{ xs: 25, sm: 40, lg: 90 }}
        position="absolute"
        bottom={{ xs: 'unset', sm: '50%' }}
        top={{ xs: 90, sm: 'unset' }}
        left={{ xs: -10, sm: 20 }}
        sx={{
          letterSpacing: { xs: '-2px', sm: 'auto' },
          transform: { xs: 'translateX(50%)', sm: 'translateY(50%)' },
          writingMode: { xs: 'vertical-rl', sm: 'vertical-rl' },
          textOrientation: 'mixed',
          whiteSpace: 'noWrap'
        }}
      >
        IVC17
      </Typography>
      <Typography
        fontWeight={800}
        fontSize={{ xs: 16, sm: 30 }}
        position="absolute"
        bottom={{ xs: 60, sm: '50%' }}
        right={{ xs: '50%', sm: 20 }}
        sx={{
          transform: { xs: 'translateX(50%)', sm: 'translateY(50%)' },
          writingMode: { xs: 'horizontal-tb', sm: 'vertical-rl' },
          textOrientation: 'mixed',
          whiteSpace: 'noWrap'
        }}
      >
        For practice purpose only
      </Typography>
    </Box>
  )
}

export default withTransition(Home)
