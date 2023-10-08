if (import.meta.env.DEV) {
  window.gtag = () => {}
  import('eruda').then(({ default: eruda }) => {
    eruda.init()
  })
}
