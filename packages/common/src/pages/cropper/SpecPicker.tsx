import classNames from 'classnames'
import { useSnackbar } from 'notistack'
import { ReactNode, useEffect, useState } from 'react'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import DeleteOutline from '@mui/icons-material/DeleteOutline'
import EditOutlined from '@mui/icons-material/EditOutlined'
import FaceIcon from '@mui/icons-material/Face'
import Face2Icon from '@mui/icons-material/Face2'
import Face3Icon from '@mui/icons-material/Face3'
import Face4Icon from '@mui/icons-material/Face4'
import Face5Icon from '@mui/icons-material/Face5'
import Face6Icon from '@mui/icons-material/Face6'
import SaveOutlined from '@mui/icons-material/SaveOutlined'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import ListSubheader from '@mui/material/ListSubheader'
import Slide from '@mui/material/Slide'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TextField from '@mui/material/TextField'
import { useSelectedSpec, useSpecStore } from '../../stores'
import { ID_PHOTO_GOUPS, ID_PHOTO_SPECS } from '../../config'
import { IDPhotoSpec } from '../../types'

const SPEC_ICONS = [
  <FaceIcon />,
  <Face2Icon />,
  <Face3Icon />,
  <Face4Icon />,
  <Face5Icon />,
  <Face6Icon />,
]

export interface SpecListPaneProps {
  subheader?: ReactNode
  show: boolean
  active: string
  specs: IDPhotoSpec[]
  onActiveChange(spec: IDPhotoSpec): void
  onEdit?(spec: IDPhotoSpec): void
}

export function SpecListPane({
  subheader,
  show,
  active,
  specs,
  onActiveChange,
  onEdit,
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
      subheader={subheader}
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
            {spec.type === 'custom' ? (
              <ListItemSecondaryAction
                onClick={(event) => {
                  event.stopPropagation()
                  onEdit?.(spec)
                }}
              >
                <IconButton edge="end">
                  <EditOutlined />
                </IconButton>
              </ListItemSecondaryAction>
            ) : null}
          </ListItemButton>
        )
      })}
    </List>
  )
}

export interface CustomSpecListPaneProps
  extends Omit<SpecListPaneProps, 'specs'> {}

export function CustomSpecListPane(props: CustomSpecListPaneProps) {
  const { enqueueSnackbar } = useSnackbar()
  const [customs, addCustom, updateCustom, removeCustom] = useSpecStore(
    (state) => [
      state.customs,
      state.addCustom,
      state.updateCustom,
      state.removeCustom,
    ]
  )
  const [customOpen, setCustomOpen] = useState(false)
  const [editingCustom, setEditingCustom] = useState<IDPhotoSpec | null>(null)
  const [form, setForm] = useState<{
    name: string
    width?: number
    height?: number
    dpi?: number
  }>({
    name: '',
    width: 300,
    height: 300,
    dpi: 300,
  })
  return (
    <>
      <SpecListPane
        {...props}
        subheader={
          <ListSubheader
            sx={{
              textAlign: 'center',
            }}
          >
            <Button
              variant="text"
              startIcon={<AddCircleOutlineRoundedIcon />}
              onClick={() => {
                setCustomOpen(true)
                setEditingCustom(null)
                setForm({ name: '', width: 300, height: 300, dpi: 300 })
              }}
            >
              Add new specification
            </Button>
          </ListSubheader>
        }
        specs={customs}
        onEdit={(spec) => {
          setCustomOpen(true)
          setEditingCustom(spec)
          setForm({
            name: spec.title,
            width: spec.resolution.width,
            height: spec.resolution.height,
            dpi: spec.resolution.dpi,
          })
        }}
      />
      {customOpen ? (
        <Backdrop
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={customOpen}
          onClick={() => {
            setCustomOpen(false)
          }}
        >
          <Slide direction="up" in={customOpen}>
            <Card
              className="absolute left-0 bottom-0 w-full rounded-t-3xl sm:left-1/2 sm:mx-auto sm:w-[400px] sm:-translate-x-1/2"
              variant="outlined"
              onClick={(event) => {
                event.stopPropagation()
              }}
            >
              <CardHeader
                sx={{
                  paddingBottom: 0,
                }}
                subheader="Custom specification"
                action={
                  <IconButton
                    onClick={() => {
                      setCustomOpen(false)
                    }}
                  >
                    <CloseOutlined />
                  </IconButton>
                }
              />
              <CardContent
                sx={{
                  paddingTop: 0,
                }}
              >
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  margin="normal"
                  variant="standard"
                  value={form.name}
                  onChange={(event) => {
                    setForm((prevForm) => ({
                      ...prevForm,
                      name: event.target.value,
                    }))
                  }}
                />
                <TextField
                  fullWidth
                  label="Width"
                  name="width"
                  margin="normal"
                  type="number"
                  variant="standard"
                  value={form.width}
                  onChange={(event) => {
                    setForm((prevForm) => ({
                      ...prevForm,
                      width: event.target.value,
                    }))
                  }}
                />
                <TextField
                  fullWidth
                  label="Height"
                  name="height"
                  margin="normal"
                  type="number"
                  variant="standard"
                  value={form.height}
                  onChange={(event) => {
                    setForm((prevForm) => ({
                      ...prevForm,
                      height: event.target.value,
                    }))
                  }}
                />
                <TextField
                  fullWidth
                  label="DPI"
                  name="dpi"
                  margin="normal"
                  type="number"
                  variant="standard"
                  value={form.dpi}
                  onChange={(event) => {
                    setForm((prevForm) => ({
                      ...prevForm,
                      dpi: event.target.value,
                    }))
                  }}
                />
                <Button
                  sx={{
                    marginTop: '20px',
                    borderRadius: '20px',
                  }}
                  disableElevation
                  fullWidth
                  size="large"
                  startIcon={<SaveOutlined />}
                  variant="contained"
                  onClick={() => {
                    if (!form.name || !form.name.trim()) {
                      enqueueSnackbar('Name can not be empty!')
                      return
                    }
                    if (!form.width) {
                      enqueueSnackbar('Width can not be empty!')
                      return
                    }
                    if (form.width < 0) {
                      enqueueSnackbar('Width must be larger than 0!')
                      return
                    }
                    if (!form.height) {
                      enqueueSnackbar('Height can not be empty!')
                      return
                    }
                    if (form.height < 0) {
                      enqueueSnackbar('Height must be larger than 0!')
                      return
                    }
                    if (!form.dpi) {
                      enqueueSnackbar('DPI can not be empty!')
                      return
                    }
                    if (form.dpi < 0) {
                      enqueueSnackbar('DPI must be larger than 0!')
                      return
                    }
                    if (editingCustom) {
                      updateCustom({
                        ...editingCustom,
                        title: form.name,
                        resolution: {
                          dpi: form.dpi,
                          width: form.width,
                          height: form.height,
                        },
                        dimension: {
                          width: Math.round((form.width / form.dpi) * 25.4),
                          height: Math.round((form.height / form.dpi) * 25.4),
                          unit: 'mm',
                        },
                      })
                    } else {
                      addCustom({
                        name: useSpecStore.getState().getNextName(),
                        type: 'custom',
                        title: form.name,
                        country: 'Any Country (Generic)',
                        resolution: {
                          dpi: form.dpi,
                          width: form.width,
                          height: form.height,
                        },
                        dimension: {
                          width: Math.round((form.width / form.dpi) * 25.4),
                          height: Math.round((form.height / form.dpi) * 25.4),
                          unit: 'mm',
                        },
                        color: '#fff',
                      })
                    }
                    setCustomOpen(false)
                  }}
                >
                  Save
                </Button>
                {editingCustom ? (
                  <Button
                    sx={{
                      marginTop: '10px',
                      borderRadius: '20px',
                    }}
                    color="error"
                    disableElevation
                    fullWidth
                    size="large"
                    startIcon={<DeleteOutline />}
                    variant="contained"
                    onClick={() => {
                      if (editingCustom) {
                        removeCustom(editingCustom)
                      }
                      setCustomOpen(false)
                    }}
                  >
                    Delete
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          </Slide>
        </Backdrop>
      ) : null}
    </>
  )
}

export interface SpecPickerProps {
  value: IDPhotoSpec
  onClose?(): void
}

export function SpecPicker({ value, onClose }: SpecPickerProps) {
  const [group, setGroup] = useState(ID_PHOTO_GOUPS[0].name)
  const [spec, setSepc] = useSelectedSpec()
  useEffect(() => {
    const { spec, customs } = useSpecStore.getState()
    let groupName = ''
    if (customs.some((item) => item.name === spec)) {
      groupName = 'custom'
    } else {
      groupName =
        ID_PHOTO_GOUPS.find((group) => {
          return group.specs.some((item) => item.name === spec)
        })?.name || ''
    }
    if (groupName) {
      setGroup(groupName)
    }
  }, [])
  return (
    <Backdrop
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open
      onClick={onClose}
    >
      <Slide direction="up" in>
        <Box className="absolute z-10 bottom-0 left-0 w-full">
          <Card
            className="w-full rounded-t-3xl sm:mx-auto sm:w-[400px]"
            variant="outlined"
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
              <Tab key="custom" label="Custom" value="custom" />
            </Tabs>
            <Box className="h-[400px]">
              {ID_PHOTO_GOUPS.map((item) => {
                return (
                  <SpecListPane
                    key={item.name}
                    show={item.name === group}
                    active={spec.name}
                    specs={item.specs}
                    onActiveChange={(spec) => {
                      setSepc(spec)
                      onClose?.()
                    }}
                  />
                )
              })}
              <CustomSpecListPane
                key="custom"
                show={group === 'custom'}
                active={spec.name}
                onActiveChange={(spec) => {
                  setSepc(spec)
                  onClose?.()
                }}
              />
            </Box>
          </Card>
        </Box>
      </Slide>
    </Backdrop>
  )
}

export default SpecPicker
