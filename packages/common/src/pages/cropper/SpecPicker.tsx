import { useEffect, useState } from 'react'
import FaceIcon from '@mui/icons-material/Face'
import Face2Icon from '@mui/icons-material/Face2'
import Face3Icon from '@mui/icons-material/Face3'
import Face4Icon from '@mui/icons-material/Face4'
import Face5Icon from '@mui/icons-material/Face5'
import Face6Icon from '@mui/icons-material/Face6'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Slide from '@mui/material/Slide'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useSelectedSpec, useSpecStore } from '../../stores'
import { ID_PHOTO_GOUPS, ID_PHOTO_SPECS } from '../../config'
import { IDPhotoSpec } from '../../types'
import classNames from 'classnames'

const SPEC_ICONS = [
  <FaceIcon />,
  <Face2Icon />,
  <Face3Icon />,
  <Face4Icon />,
  <Face5Icon />,
  <Face6Icon />,
]

export interface SpecListPaneProps {
  show: boolean
  active: string
  specs: IDPhotoSpec[]
  onActiveChange(spec: IDPhotoSpec): void
}

export function SpecListPane({
  show,
  active,
  specs,
  onActiveChange,
}: SpecListPaneProps) {
  const [inited, setInited] = useState(show)
  useEffect(() => {
    if (show) {
      setInited(true)
    }
  }, [show])
  if (!inited) {
    return null
  }
  return (
    <List
      className={classNames('h-full overflow-y-auto', {
        hidden: !show,
      })}
      sx={{
        '&::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-button': {
          display: 'none',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#666',
          borderRadius: '8px',
          border: '2px solid #666',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#888',
          borderColor: '#888',
        },
        '::-webkit-scrollbar-corner': {
          display: 'none',
        },
      }}
    >
      {specs.map((spec, index) => {
        const { name, title, resolution, dimension } = spec
        return (
          <ListItemButton
            key={name}
            selected={name === active}
            onClick={() => {
              onActiveChange(spec)
            }}
          >
            <ListItemIcon>{SPEC_ICONS[index % SPEC_ICONS.length]}</ListItemIcon>
            <ListItemText
              primary={title}
              secondary={`${resolution.width}*${resolution.height}px | ${dimension.width}*${dimension.height}${dimension.unit}`}
            />
          </ListItemButton>
        )
      })}
    </List>
  )
}

export interface SpecPickerProps {
  value: IDPhotoSpec
  onClose?(): void
  onPick?(value: IDPhotoSpec): void
}

export function SpecPicker({ value, onClose, onPick }: SpecPickerProps) {
  const [group, setGroup] = useSpecStore((state) => [
    state.group,
    state.setGroup,
  ])
  const [spec, setSepc] = useSelectedSpec()
  return (
    <ClickAwayListener
      onClickAway={() => {
        onClose?.()
      }}
    >
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
        onClick={onClose}
      >
        <Slide direction="up" in>
          <Box className="absolute z-10 bottom-0 left-0 w-full">
            <Card
              className="w-full rounded-t-2xl sm:mx-auto sm:w-[400px]"
              elevation={0}
              onClick={(event) => {
                event.stopPropagation()
              }}
            >
              <Tabs
                value={group}
                variant="scrollable"
                scrollButtons={false}
                onChange={(e, newValue) => {
                  setGroup(newValue)
                }}
              >
                {ID_PHOTO_GOUPS.map((item) => {
                  return (
                    <Tab key={item.name} label={item.title} value={item.name} />
                  )
                })}
              </Tabs>
              <Box className="h-[500px]">
                {ID_PHOTO_GOUPS.map((item) => {
                  return (
                    <SpecListPane
                      key={item.name}
                      show={item.name === group}
                      active={spec.name}
                      specs={item.specs}
                      onActiveChange={setSepc}
                    />
                  )
                })}
              </Box>
            </Card>
          </Box>
        </Slide>
      </Backdrop>
    </ClickAwayListener>
  )
}

export default SpecPicker
