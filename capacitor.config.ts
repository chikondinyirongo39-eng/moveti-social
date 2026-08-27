import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.moveti.app',
  appName: 'MOVETI',
  webDir: '.next',
  server: {
    url: 'https://fluffy-capybara-6v4gq7qprp7phxx7w-3000.app.github.dev',
    cleartext: false,
    androidScheme: 'https',
  },
};

export default config;
