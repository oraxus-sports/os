module.exports = function(api) {
  api.cache(true);
  return {
    // `nativewind/babel` (react-native-css-interop) exports a preset-like object,
    // so include it in `presets`. `expo-router/babel` is a plugin and belongs
    // in `plugins`.
    // Temporarily omit `nativewind/babel` to avoid optional worklets plugin
    // resolution issues during bundling. Add it back if you rely on nativewind.
    presets: ['babel-preset-expo'],
    // Remove `expo-router/babel` from plugins as recommended by expo-router.
    plugins: [],
  };
};
