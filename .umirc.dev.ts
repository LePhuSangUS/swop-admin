import { IConfig } from 'umi-types';
import { version } from './package.json';
import preval from 'preval.macro';

// ref: https://umijs.org/config/
const config: IConfig = {
  outputPath: './dist/local',
  define: {
    ENV: 'local',
    VERSION: version || 'v1.0.0',
    LAST_UPDATE: preval`module.exports = new Date().toLocaleString();`,
    BASE_API_URL: 'http://api.swop.localhost',
    WS_URL: 'ws://chat.swop.localhost/ws',
    GOOGLE_MAPS_KEY: 'AIzaSyBgc-UdIEl4gjR5d_KbuJ5yN9Kn9EMHNLw',
    REMOVALAI_API_TOKEN: '612d8f6c461886.97180130',
  },
};

export default config;
