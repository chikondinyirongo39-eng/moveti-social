import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.moveti.social',
  appName: 'MOVETI Social',
  webDir: 'mobile-web',
  server: {
    url: 'https://moveti-social.vercel.app',
    cleartext: false,
    androidScheme: 'https'
  }
}

export default config
