import Button, { ButtonProps } from '@mui/material/Button'

export interface DarkButtonProps extends ButtonProps {}

export function DarkButton(props: DarkButtonProps) {
  return (
    <Button
      {...props}
      sx={{
        ...props.sx,
        color: '#fff',
        backgroundColor: 'rgba(29, 29, 29, .92)',
        borderColor: 'rgba(0,0,0,.67) !important', 
        '&:hover': {
          backgroundColor: 'rgba(50, 50, 50,.92)',
        },
      }}
    />
  )
}

export default DarkButton
