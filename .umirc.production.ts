import { IConfig } from 'umi-types';
import { version } from './package.json';
import preval from 'preval.macro';

// ref: https://umijs.org/config/
const config: IConfig = {
  chainWebpack: function (config, { webpack }) {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 3,
          automaticNameDelimiter: '.',
          cacheGroups: {
            react: {
              name: 'react',
              priority: 20,
              test: /[\\/]node_modules[\\/](react|react-dom|react-dom-router)[\\/]/,
            },
            antd: {
              name: 'antd',
              priority: 20,
              test: /[\\/]node_modules[\\/](antd|@ant-design\/icons)[\\/]/,
            },
            draftjs: {
              name: 'draftjs',
              priority: 30,
              test: /[\\/]node_modules[\\/](draft-js|react-draft-wysiwyg|draftjs-to-html|draftjs-to-markdown)[\\/]/,
            },
            recharts: {
              name: 'recharts',
              priority: 20,
              test: /[\\/]node_modules[\\/]recharts[\\/]/,
            },
            async: {
              chunks: 'async',
              minChunks: 2,
              name: 'async',
              maxInitialRequests: 1,
              minSize: 0,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      },
    });
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        dva: {
          immer: true,
        },
        antd: true,
        title: 'SWOP Admin',
        dll: process.env.NODE_ENV === 'production',
        pwa: process.env.NODE_ENV === 'production',
        hd: false,
        fastClick: true,
        routes: {
          exclude: [/exclude/],
        },
      },
    ],
  ],
  outputPath: './dist/production',
  define: {
    ENV: 'production',
    VERSION: version || 'v1.0.0',
    LAST_UPDATE: preval`module.exports = new Date().toLocaleString();`,
    BASE_API_URL: 'https://api.swop.company',
    WS_URL: 'wss://chat.swop.company/ws',
    GOOGLE_MAPS_KEY: 'AIzaSyBgc-UdIEl4gjR5d_KbuJ5yN9Kn9EMHNLw',
    REMOVALAI_API_TOKEN: '612d8f6c461886.97180130',
  },
};

export default config;
