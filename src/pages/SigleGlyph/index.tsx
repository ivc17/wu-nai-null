import { Box } from '@mui/material'

import { withTransition } from '../../components/WithTransition'
import { useTransition } from '../../context/TransitionContext'

function SingleGlyph() {
  const { wrappedNavigate } = useTransition()
  return (
    <Box height="500px" width="100vw" sx={{ background: 'blue' }}>
      134uhkdgjm
      <button
        onClick={() => {
          wrappedNavigate('/')
        }}
      >
        click
      </button>
    </Box>
  )
}

export default withTransition(SingleGlyph)
