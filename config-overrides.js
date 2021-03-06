const { injectBabelPlugin } = require('react-app-rewired');

module.exports = function override(config, env) {
  config = injectBabelPlugin(['import', { libraryName: 'antd', libraryDirectory: 'es', style: false }], config);

  return config;
};
