import useMediaQuery from '@mui/material/useMediaQuery'

export function usePC() {
  const pc = useMediaQuery('(min-width:640px)')
  return pc
}

export default usePC
