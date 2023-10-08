import classNames from 'classnames'
import Box, { BoxProps } from '@mui/material/Box'

export interface TextureBackgroundProps extends BoxProps {}

export function TextureBackground({
  className,
  sx,
  ...props
}: TextureBackgroundProps) {
  return (
    <Box
      {...props}
      className={classNames(
        'absolute inset-0 w-full h-full overflow-hidden',
        className
      )}
      sx={{
        ...sx,
        background: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path d="M1 2V0h1v1H0v1z" fill-opacity=".025"/></svg>')`,
        backgroundSize: '20px 20px',
      }}
    />
  )
}

export default TextureBackground
