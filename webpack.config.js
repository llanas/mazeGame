var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
    mode: "none",
    // devtool: "source-map",
    // Change to your "entry-point".
    entry: {
        index: './src/index',
        test: './src/test'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/assets/',
        library: "[name]"
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.js(x?)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                loader: ['babel-loader', 'ts-loader'],
            }
        ],
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                // Split vendor code to its own chunk(s)
                vendors: {
                  test: /[\\/]node_modules[\\/]/i,
                  chunks: "all"
                },
                // Split code common to all chunks to its own chunk
                commons: {
                  name: "commons",    // The name of the chunk containing all common code
                  chunks: "initial",  // TODO: Document
                  minChunks: 2        // This is the number of modules
                }
              }
        },
        runtimeChunk: {
            name: 'runtime'
        }
    }
};