const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Modify the config to support SVG files
config.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer',
);

// Modify the asset and source extensions
// First, keep track of the original asset extensions, but filter out svg
config.resolver.assetExts = config.resolver.assetExts.filter(
  ext => ext !== 'svg',
);
// Then add svg to the source extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

config.resolver.unstable_conditionNames = [
  'browser',
  'require',
  'react-native',
];

// Apply NativeWind configuration
module.exports = withNativeWind(config, { input: './global.css' });
