import { useEffect, useMemo } from 'react'
import { IntlProvider } from 'react-intl'
import Box from '@mui/material/Box'
import locales from './locales'
import Pages, { Welcome } from './pages'
import { useAppStore } from './stores'

export function App() {
  const [locale, messages] = useMemo(() => {
    return (
      [navigator.language, ...(navigator.languages || [])].reduce(
        (acc, lang): any => {
          if (acc) {
            return acc
          }
          if (locales[lang]) {
            return [lang, locales[lang]]
          }
          if (locales[lang.split('-')[0]]) {
            return [lang.split('-')[0], locales[lang.split('-')[0]]]
          }
          return acc
        },
        null
      ) || ['en', locales.en]
    )
  }, [])
  useEffect(() => {
    useAppStore.getState().initiate()
  }, [])
  return (
    <IntlProvider messages={messages} locale={locale} defaultLocale="en">
      <Box className="absolute inset-0 overflow-hidden">
        <Welcome />
        <Pages />
      </Box>
    </IntlProvider>
  )
}

export default App
