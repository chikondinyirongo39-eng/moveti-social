import { NextResponse } from 'next/server'
import { buildDistributionPackage } from '@/lib/distribution/package'
import type { DistributionRelease } from '@/lib/distribution/types'

export async function POST(request: Request) {
  try {
    const release = await request.json() as DistributionRelease

    if (!release.releaseId || !release.title || !release.artistName) {
      return NextResponse.json(
        { error: 'releaseId, title and artistName are required.' },
        { status: 400 }
      )
    }

    if (!Array.isArray(release.platforms) || release.platforms.length === 0) {
      return NextResponse.json(
        { error: 'At least one distribution platform is required.' },
        { status: 400 }
      )
    }

    const distributionPackage = buildDistributionPackage(release)

    return NextResponse.json({
      ok: true,
      package: distributionPackage
    })
  } catch {
    return NextResponse.json(
      { error: 'Unable to prepare distribution package.' },
      { status: 400 }
    )
  }
}
