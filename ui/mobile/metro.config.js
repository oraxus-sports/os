const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const libFolder = path.resolve(projectRoot, '..', 'lib');

// Extend Expo's default Metro config to include the shared `lib` folder
const config = getDefaultConfig(projectRoot);
config.watchFolders = config.watchFolders || [];
config.watchFolders.push(libFolder);

config.resolver = config.resolver || {};
// Ensure Metro resolves modules from the mobile node_modules by default.
config.resolver.extraNodeModules = new Proxy({}, {
  get: (_, name) => path.join(projectRoot, 'node_modules', name),
});

module.exports = config;
