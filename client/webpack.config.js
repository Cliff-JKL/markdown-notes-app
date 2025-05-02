const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');

const PROD_MODE = process.env.WEBPACK_DEV_SERVER === 'true' ? true : false;
const DEV_MODE = process.env.NODE_ENV !== 'production';

function IS_PROD_MODE(plugin, argv) {
  console.log(argv.mode);
  return argv.mode === 'production' ? plugin : () => {};
}

module.exports = (env, argv) => {
//   const devMode = argv.mode !== 'production';

  return {
    entry: {
      main: path.resolve(__dirname, './src/index.tsx'),
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    // TODO: source maps
    // devtool: devMode ? 'source-map' : 'hidden-source-map',
    devtool: 'inline-source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, './src/index.html'),
      }),
      IS_PROD_MODE(new CleanWebpackPlugin(), argv),
      IS_PROD_MODE(new MiniCssExtractPlugin(), argv),
    ],
    module: {
      rules: [
        // JS
        {
          // test: /\.(js|ts)x?/i,
          test: /\.js(x?)/i,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
          exclude: /node_modules/,
        },
        // TS
        {
          test: /\.ts(x?)/i,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
            'ts-loader',
          ],
          exclude: /node_modules/,
        },
        // CSS
        {
          test: /\.(s*)css$/i,
          use: [
            argv.mode === 'production'
              ? MiniCssExtractPlugin.loader
              : 'style-loader', // style-loader inserts css into pages
            'css-loader', // returns css with imports and urls
            'postcss-loader', // postcss converts modern CSS into something browser understandable
            'sass-loader', // scss to css
          ],
        },
        // static files
        {
          test: /\.(jpe?g|png|gif|svg|eot|ttf|woff2?)$/i,
          type: 'asset',
        },
      ],
    },
    devServer: {
      port: 9000,
      compress: true,
      hot: true,
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      historyApiFallback: { index: '/' },
      // TODO: rewrite dist files
      // devMiddleware: {
      //     writeToDisk: true
      // }
      // historyApiFallback: { index: '/' },
    },
  };
};
