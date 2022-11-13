import { Box, keyframes } from '@mui/material'

const animateCircle = keyframes`
0%{
stroke-dashoffset:-100;
transform: rotate(0deg)
};
100%{
  stroke-dashoffset:0;
  transform: rotate(360deg)
};`

export default function IndexCircle({ selectedIdx }: { selectedIdx?: number }) {
  return (
    <Box
      sx={{
        position: 'relative',
        // border: '3px solid #ff0000',
        // borderWidth: { xs: '2px', sm: '3px' },
        // borderRadius: '50%',
        height: { xs: 60, sm: 85 },
        width: { xs: 60, sm: 85 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 900,
        fontSize: { xs: 24, sm: 34 },
        marginLeft: 'auto',
        '& svg.animateCircle circle': {
          transformOrigin: 'center center',
          animation: `${animateCircle} 0.8s linear forwards infinite`
        }
      }}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        stroke="#ff0000"
        style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        <circle cx="20" cy="20" r="19" />
      </svg>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        stroke="#ff0000"
        className={selectedIdx ? 'animateCircle' : ''}
        style={{
          opacity: selectedIdx ? 1 : 0,
          height: '90%',
          width: '90%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <circle cx="20" cy="20" r="19" strokeDasharray={150} />
      </svg>
      {selectedIdx || selectedIdx === 0 ? selectedIdx + '' : 'NaN'}
    </Box>
  )
}
