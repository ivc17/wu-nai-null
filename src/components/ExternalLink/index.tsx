import { Link, SxProps, Theme } from '@mui/material'
import { HTMLProps, useCallback } from 'react'

export default function ExternalLink({
  target = '_blank',
  href,
  rel = 'noopener noreferrer',
  style,
  sx,
  className,
  children,
  underline,
  showIcon
}: Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> & {
  href: string
  style?: React.CSSProperties
  sx?: SxProps<Theme>
  underline?: 'always' | 'hover' | 'none'
  className?: string
  showIcon?: boolean
}) {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (target === '_blank' || event.ctrlKey || event.metaKey) {
      } else {
        event.preventDefault()
        window.location.href = href
      }
    },
    [href, target]
  )
  return (
    <Link
      className={className}
      target={target}
      rel={rel}
      href={href}
      onClick={handleClick}
      style={style}
      underline={underline ?? 'none'}
      sx={{
        color: (theme) => theme.palette.text.primary,
        textDecorationColor: (theme) => theme.palette.text.primary,
        '&:hover, :active': {
          textShadow: '0 0 5px #ff000020'
        },
        ...sx
      }}
    >
      {children}
    </Link>
  )
}
