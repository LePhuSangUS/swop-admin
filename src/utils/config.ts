export default {
  siteName: '',
  copyright: '©2020 SWOP',
  logoPath: require('../assets/images/logo.png'),
  baseURL: BASE_API_URL,
  googleMapApiKey: GOOGLE_MAPS_KEY,
  removalAIApiToken: REMOVALAI_API_TOKEN,
  version: VERSION,
  lastUpdate: LAST_UPDATE,
  fixedHeader: true, // sticky primary layout header
  defaultPageSize: 10,
  defaultPageSizeSmall: 5,

  /* Layout configuration, specify which layout to use for route. */
  layouts: [
    {
      name: 'primary',
      include: [/.*/],
      exclude: [
        /(\/(en|zh))*\/login/,
        /(\/(en|zh))*\/password\/update/,
        /(\/(en|zh))*\/password\/reset/,
      ],
    },
  ],
};
