export const DSP_PLATFORMS = [
  'spotify',
  'apple_music',
  'youtube_music',
  'boomplay',
  'audiomack',
] as const

export type DspPlatform = typeof DSP_PLATFORMS[number]

export type DeliveryStatus =
  | 'queued'
  | 'processing'
  | 'submitted'
  | 'delivered'
  | 'failed'
  | 'not_configured'

export type DistributionRelease = {
  releaseId: string
  title: string
  artistName: string
  genre: string
  releaseDate: string
  copyright: string
  explicit: boolean
  artworkUrl: string
  audioFileName: string
  isrc: string
  upc: string
  platforms: DspPlatform[]
}

export type DeliveryJob = {
  id: string
  releaseId: string
  platform: DspPlatform
  status: DeliveryStatus
  attempts: number
  providerReference?: string
  error?: string
  createdAt: string
  updatedAt: string
}
