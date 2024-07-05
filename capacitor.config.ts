import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.silkwebhq.devvscapecode',
  appName: 'Devvscape',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-6424707922606590~3309927104',
    },
  },
  server: {
    hostname: 'devvscape.com',
    androidScheme: 'https',
  }
};

export default config;
