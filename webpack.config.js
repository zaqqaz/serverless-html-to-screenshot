const path = require('path');
const slsw = require('serverless-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { IgnorePlugin } = require('webpack');

const entries = {};

Object.keys(slsw.lib.entries).forEach(
    key => (entries[key] = ['./source-map-install.js', slsw.lib.entries[key]])
);

module.exports = {
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    plugins: [
        new IgnorePlugin(/vertx/),
        new IgnorePlugin(/bufferutil/),
        new IgnorePlugin(/utf-8-validate/),
        new CopyWebpackPlugin([
            'chrome/headless_shell.tar.gz',
            'chrome/cloudformation-template-create-stack.json',
        ])
    ],
    entry: entries,
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        alias: {
            htmlToScreenshot: path.resolve(__dirname, './'),
        },
    },
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js',
    },
    target: 'node',
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: 'ts-loader' },
        ],
    },
};
