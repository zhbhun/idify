let pendingRegionRequest: Promise<string> | null

export function getRegion(): Promise<string> {
  if (pendingRegionRequest) {
    return pendingRegionRequest
  }
  pendingRegionRequest = fetch('https://api.country.is')
    .then((res) => res.json())
    .then((data) => data.country)
  return pendingRegionRequest
}
