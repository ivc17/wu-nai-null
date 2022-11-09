import { Box, keyframes, useTheme } from '@mui/material'
import React from 'react'
import { GlyphsList } from '../../assets/glyphsList'
import { lgCount, smCount, xlCount } from '../../context/TransitionContext'

const disappear = keyframes`
  0% {
    transform: rotateY(180deg)
  };
  100% {
    transform: rotateY(0deg)
  }
`

const appear = keyframes`
  0% {
    transform: rotateY(0deg)
  };
  100% {
    transform: rotateY(180deg)
  }
`

export default function Transition({
  isAppearTransition,
  repeatCount,
  interval
}: {
  isAppearTransition: boolean
  repeatCount: any[]
  interval: number
}) {
  const theme = useTheme()

  return (
    <Box
      id="transition"
      width="100vw"
      height="100vh"
      zIndex={theme.zIndex.modal + 1}
      display="grid"
      overflow="hidden"
      position="fixed"
      top={0}
      left={0}
      gridTemplateColumns={{
        xs: `repeat(auto-fill, ${100 / smCount}%)`,
        sm: `repeat(auto-fill, ${100 / lgCount}%)`,
        xl: `repeat(auto-fill, ${100 / xlCount}%)`
      }}
      sx={{
        pointerEvents: 'none',
        // background: theme.palette.background.default,
        '& svg': {
          height: 'max-content'
        }
      }}
    >
      {repeatCount.map((i) => {
        return (
          <React.Fragment key={'' + i}>
            {GlyphsList.map((Item, j) => {
              const delay = isAppearTransition ? 0.2 : 0
              const formattedI = isAppearTransition
                ? repeatCount.length - 1 - i
                : i

              const formattedj = isAppearTransition
                ? GlyphsList.length - 1 - j
                : j
              return (
                <Box
                  key={'' + i + j}
                  sx={{
                    background: '#ffffff',
                    height: 'max-content',
                    opacity: 1,
                    perspective: 1000,
                    backfaceVisibility: 'hidden',
                    transformSstyle: 'preserve-3d',
                    transform: isAppearTransition
                      ? 'rotateY(0deg)'
                      : 'rotateY(180deg)',
                    animation: `${
                      isAppearTransition ? appear : disappear
                    } 0.1s forwards`,
                    animationDelay:
                      (formattedI + 1) * GlyphsList.length * interval +
                      formattedj * interval +
                      delay +
                      's'
                  }}
                >
                  <Item />
                </Box>
              )
            })}
          </React.Fragment>
        )
      })}
    </Box>
  )
}
