import { forwardRef, useCallback, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Fade from '@mui/material/Fade'
import { TransitionProps } from '@mui/material/transitions'

const ALERTED_CACHE = 'idify.sgement.alert'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

export function SegementAlert() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    if (
      localStorage.getItem(ALERTED_CACHE) !== '1' &&
      sessionStorage.getItem(ALERTED_CACHE) !== '1'
    ) {
      sessionStorage.setItem(ALERTED_CACHE, '1')
      timer = setTimeout(() => {
        timer = undefined
        setOpen(true)
      }, 500)
    }
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [])
  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])
  return (
    <Dialog open={open} TransitionComponent={Transition} onClose={handleClose}>
      <DialogTitle>Removing photo backgound</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Idify will remove the image background in the background, and the
          progress will be displayed in the upper right corner. This process may
          take a little time, so please be patient. Before proceeding, you can
          select the photo size and crop it. We can move on to the next step
          once the process is complete.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose()
            localStorage.setItem(ALERTED_CACHE, '1')
          }}
        >
          Don't show agin
        </Button>
        <Button onClick={handleClose} autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SegementAlert
