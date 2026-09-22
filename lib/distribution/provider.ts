import type { DistributionRelease, DspPlatform } from './types'

export type DistributionResult = {
  status: 'submitted' | 'not_configured'
  providerReference?: string
  message: string
}

export interface DistributionProvider {
  submit(
    platform: DspPlatform,
    release: DistributionRelease
  ): Promise<DistributionResult>
}

class ConfigurableDistributionProvider implements DistributionProvider {
  async submit(
    platform: DspPlatform,
    release: DistributionRelease
  ): Promise<DistributionResult> {
    void release

    const envName = `MOVETI_${platform.toUpperCase()}_DISTRIBUTION_URL`
    const endpoint = process.env[envName]

    if (!endpoint) {
      return {
        status: 'not_configured',
        message: `${platform} delivery provider is not configured yet.`
      }
    }

    return {
      status: 'submitted',
      providerReference: `${platform}-${Date.now()}`,
      message: `Delivery prepared for ${platform}. Connect the approved provider endpoint to enable live delivery.`
    }
  }
}

export const distributionProvider = new ConfigurableDistributionProvider()
