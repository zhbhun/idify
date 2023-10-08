import {
  ConfigValue,
  ConfigContext,
  App as IdifyApp,
  defaultConfig,
} from '@idify/common'

const config: ConfigValue = import.meta.env.DEV
  ? {
      showGithubLink: true,
      segment: {
        publicPath: '/node_modules/@zhbhun/background-removal/dist/',
      },
    }
  : defaultConfig

export default function App() {
  return (
    <ConfigContext.Provider value={config}>
      <IdifyApp />
    </ConfigContext.Provider>
  )
}
