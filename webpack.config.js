var path = require('path');

module.exports = {
    mode: "development",
    devtool: "source-map",
    // Change to your "entry-point".
    entry: {
        index: './src/index'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/assets/',
        library: '[name]',
        chunkFilename: "[name].js"
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
        runtimeChunk: {
            name: 'runtime'
        }
    }
};