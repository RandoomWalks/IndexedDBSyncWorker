const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node',
    entry: './src/server/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist/server'),
        filename: 'server.js'
    },
    externals: [nodeExternals()], // Avoid bundling node_modules
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.server.json' // Specific TS config for server side
                    }
                },
                exclude: [/node_modules/, /src\/client/, /src\/client\/worker/, /\.test\.tsx?$/, /tests/, /__tests__/, /__mocks__/]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
};
