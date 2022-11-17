import { Box, Button, Typography } from '@mui/material'
import { GlyphsList } from 'assets/glyphsList'
import { useTransition } from 'context/TransitionContext'
import { Link } from 'react-router-dom'
import { withTransition } from '../../components/WithTransition'

function All() {
  const { wrappedNavigate } = useTransition()
  return (
    <Box height={'100vh'} overflow="auto" width="100vw" padding="150px 40px">
      <Box position="fixed" top={{ xs: 90, sm: 150 }} left={20}>
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
            wrappedNavigate('/')
          }}
        >
          <svg
            viewBox="0 0 296.75 200"
            width="40px"
            style={{ marginTop: -10, transform: 'scaleX(-1)', fill: '#ff0000' }}
          >
            <polygon points="296.75,149.188 215,98.875 215,132.375 0,132.375 0,165.375 215,165.375 215,197.875 " />
          </svg>
          BACK to Home
        </Button>
      </Box>
      <Typography
        sx={{ fontSize: { xs: 30, sm: 60 }, fontWeight: 900, margin: '20px' }}
      >
        List of all Glyphs
      </Typography>
      <Box
        display="grid"
        sx={{
          '& svg': {
            fill: 'red',
            '& :hover': {
              fill: '#0000ff'
            }
          },
          gridTemplateColumns: '25% 25% 25% 25%'
        }}
      >
        {GlyphsList.map((Item, idx) => {
          return (
            <Link to={'/characters/' + idx} key={idx}>
              <Item />
            </Link>
          )
        })}
      </Box>
    </Box>
  )
}

export default withTransition(All)
