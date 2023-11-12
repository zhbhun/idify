let pendingRegionRequest: Promise<string> | null

export function getRegion(): Promise<string> {
  if (pendingRegionRequest) {
    return pendingRegionRequest
  }
  const region = localStorage.getItem('region')
  if (region) {
    return Promise.resolve(region)
  }
  pendingRegionRequest = fetch('https://api.country.is')
    .then((res) => res.json())
    .then((data) => {
      const region = data.country
      if (region) {
        localStorage.setItem('region', region)
      }
      return region
    })
  return pendingRegionRequest
}
