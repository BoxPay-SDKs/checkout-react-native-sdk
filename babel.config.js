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
            'process.env.TEST_API_URL': JSON.stringify(process.env.TEST_API_URL),
            'process.env.PROD_API_URL': JSON.stringify(process.env.PROD_API_URL),
            'process.env.ROUTE': JSON.stringify(process.env.ROUTE),
          },
        ]
      ],
    },
    {
      include: /\/node_modules\//,
      presets: ['module:@react-native/babel-preset'],
    },
  ],
  externals: [
    'react',
    'react-native',
    'react/jsx-runtime'
  ],
};
