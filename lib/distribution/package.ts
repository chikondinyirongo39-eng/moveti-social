import type { DistributionRelease } from './types'

export function buildDistributionPackage(release: DistributionRelease) {
  return {
    schema: 'MOVETI-DISTRIBUTION-V1',
    generatedAt: new Date().toISOString(),
    release: {
      title: release.title,
      artistName: release.artistName,
      genre: release.genre,
      releaseDate: release.releaseDate,
      copyright: release.copyright,
      explicit: release.explicit,
      artworkUrl: release.artworkUrl,
      audioFileName: release.audioFileName,
      identifiers: {
        isrc: release.isrc || null,
        upc: release.upc || null
      }
    },
    delivery: release.platforms.map(platform => ({
      platform,
      status: 'queued'
    }))
  }
}
