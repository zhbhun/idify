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
      <DialogTitle>清除照片背景</DialogTitle>
      <DialogContent>
        <DialogContentText>
        Idify会在后台移除图像背景，右上角显示进度。
        这个过程可能需要一点时间，所以请耐心等待。
        在继续之前，您可以选择照片大小并裁剪它。
        一旦流程完成，我们就可以进行下一步。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose()
            localStorage.setItem(ALERTED_CACHE, '1')
          }}
        >
          不再提示
        </Button>
        <Button onClick={handleClose} autoFocus>
          确定
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SegementAlert
