const path = require('path')

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  entry: {
    'react-yahl': path.resolve(__dirname, 'src/index.ts'),
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js(x?)$/,
        loader: 'source-map-loader',
      },
    ],
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'react',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'react-dom',
    },
  },
}
