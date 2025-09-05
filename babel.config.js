const { version } = require('./package.json');

module.exports = {
  presets: ['module:react-native-builder-bob/babel-preset'],
  plugins: [
    [
      'transform-define',
      {
        'process.env.SDK_VERSION': JSON.stringify(version),
      },
    ],
  ],
};