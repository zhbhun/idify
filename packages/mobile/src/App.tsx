import { Camera, CameraResultType } from '@capacitor/camera'
import { Directory, Filesystem } from '@capacitor/filesystem'
import { SplashScreen } from '@capacitor/splash-screen'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { ConfigValue, ConfigContext, App as IdifyApp } from '@idify/common'
import { useEffect } from 'react'

async function base64FromPath(path: string): Promise<string> {
  const response = await fetch(path)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject('method did not return a string')
      }
    }
    reader.readAsDataURL(blob)
  })
}

const config: ConfigValue = {
  showGithubLink: false,
  getPhoto() {
    return Camera.getPhoto({
      width: 1024,
      resultType: CameraResultType.Uri,
    }).then((photo) => photo.webPath ?? '')
  },
  async savePhoto(photo: Blob) {
    const photoURL = URL.createObjectURL(photo)
    const base64Data = await base64FromPath(photoURL)
    const now = new Date()
    await Filesystem.writeFile({
      path: `idphoto-${now.getFullYear()}-${
        now.getMonth() + 1
      }-${now.getDate()}-${now.getTime()}.png`,
      data: base64Data,
      directory: Directory.Documents,
    })
      .then((result) => {
        console.log(1, result)
      })
      .catch((error) => {
        console.error(2, error)
      })
  },
  haptic() {
    Haptics.vibrate({
      duration: 1,
    })
  },
  segment: {
    publicPath: '/assets/background-removal/',
  },
}

export default function App() {
  useEffect(() => {
    SplashScreen.hide()
  }, [])
  return (
    <ConfigContext.Provider value={config}>
      <IdifyApp />
    </ConfigContext.Provider>
  )
}
