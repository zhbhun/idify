declare interface Window {
  gtag: (
    action: 'js' | 'config' | 'event',
    name: string,
    params: Record<string, number | string | boolean>
  ) => void
}
