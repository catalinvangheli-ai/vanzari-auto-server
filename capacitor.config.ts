import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.carxsell.app',
  appName: 'CarXSell',
  webDir: 'build',
  server: {
    androidScheme: 'https',
  },
};

export default config;