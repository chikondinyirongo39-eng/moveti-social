import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.moveti.social',
  appName: 'MOVETI Social',
  webDir: 'mobile-web',
  server: {
    url: 'https://bookish-zebra-5vxqjpj94rr5c765j-3000.app.github.dev',
    cleartext: false,
    androidScheme: 'https'
  }
}

export default config
