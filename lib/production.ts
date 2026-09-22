export const MOVETI_PRODUCTION = {
  appName: 'MOVETI Social',
  appId: 'com.moveti.social',
  production: process.env.NODE_ENV === 'production',
  supabaseConfigured: Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ),
  features: {
    social: true,
    music: true,
    creator: true,
    live: true,
    wallet: true,
    distribution: true
  }
}

export function assertProductionConfiguration() {
  const missing: string[] = []

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    missing.push('NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    missing.push('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
  }

  return {
    ready: missing.length === 0,
    missing
  }
}
