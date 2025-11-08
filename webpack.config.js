const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/main.ts',
  target: 'node',
  mode: 'production',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      // ✅ add this alias so Webpack can find files outside src/
      '@shared': path.resolve(__dirname, 'shared'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: { minimize: false },
  node: {
    __dirname: false,
    __filename: false,
  },
};
