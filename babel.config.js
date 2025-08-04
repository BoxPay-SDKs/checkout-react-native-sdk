const { version } = require('./package.json');

module.exports = {
  overrides: [
    {
      exclude: /\/node_modules\//,
      presets: ['module:react-native-builder-bob/babel-preset'],
      plugins: [
        [
          'transform-define',
          {
            'process.env.SDK_VERSION': JSON.stringify(version),
          },
        ],
        [
          'module:react-native-dotenv',
          {
            moduleName: '@env',
            path: '.env',
            blacklist: null,
            whitelist: null,
            safe: false,
            allowUndefined: true,
          },
        ],
      ],
    },
    {
      include: /\/node_modules\//,
      presets: ['module:@react-native/babel-preset'],
    },
  ],
};
