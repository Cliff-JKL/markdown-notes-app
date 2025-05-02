//@type {import('postcss-load-config').Config}
const postcssPresetEnv = require('postcss-preset-env');

const config = {
    plugins: [
    //   require('autoprefixer'),
    //   require('postcss-nested')
    /* other plugins */
		/* remove autoprefixer if you had it here, it's part of postcss-preset-env */
		postcssPresetEnv({
			/* pluginOptions */
			features: {},
		}),
    ],
  };
  
  module.exports = config;
  