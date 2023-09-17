if (import.meta.env.DEV) {
  window.gtag = () => {}
  if (typeof new URLSearchParams(location.search).get('debug') === 'string') {
    import('eruda').then(({ default: eruda }) => {
      eruda.init()
    })
  }
}
