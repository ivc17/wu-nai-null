import { ReactComponent as Icon } from '../../assets/svg/icon.svg'
import TextCarousel from 'components/TextCarousel'
import ExternalLink from 'components/ExternalLink'
import { Box, Typography } from '@mui/material'

export default function Layout() {
  return (
    <>
      <ExternalLink href="https://ivc17.github.io/">
        <Box
          position="fixed"
          top={0}
          alignItems="center"
          display="flex"
          left={20}
          padding={{
            xs: '24px 15px 17px',
            sm: '30px'
          }}
          sx={{
            zIndex: 1301,
            '& svg': {
              height: { xs: 30, sm: 40 },
              width: { xs: 30, sm: 40 }
            },
            background: '#ff0000'
          }}
        >
          <Icon />
        </Box>
      </ExternalLink>
      <Box
        position="fixed"
        bottom={10}
        display="flex"
        width="calc(100% - 40px)"
        justifyContent="space-between"
        overflow="hidden"
        height={{ xs: 30, sm: 40 }}
        left={20}
        zIndex={1301}
      >
        <TextCarousel
          orientation="horizontal"
          duration={60}
          textList={'Void Empty 虛空 bô Nothing 沒有 NONE なし 不 '}
        />
        <Typography fontWeight={800} fontSize={30}></Typography>
      </Box>
    </>
  )
}
