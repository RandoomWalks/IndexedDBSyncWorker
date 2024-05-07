// setting up entry points for both the main application and the worker script.

// module: {
//     rules: [
//         {
//             test: /\.worker\.ts$/,
//             use: { loader: 'worker-loader' },
//             exclude: /node_modules/
//         },
//         {
//             test: /\.tsx?$/,
//             use: 'ts-loader',
//             exclude: /node_modules/
//         }
//     ]
// }


// module: {
//     rules: [
//         {
//             test: /\.ts$/,
//             loader: 'ts-loader',
//             options: {
//                 configFile: 'tsconfig.json' // For main threads
//             },
//             exclude: /node_modules/
//         },
//         {
//             test: /\.worker\.ts$/,
//             loader: 'ts-loader',
//             options: {
//                 configFile: 'tsconfig.worker.json' // For web workers
//             }
//         }
//     ]
// }


const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development', // Change to 'production' when ready to deploy,
    stats: 'verbose', // Set stats to 'verbose' to display detailed error messages
    entry: {
        // separating the business logic of your main application from the potentially heavy lifting performed by the web worker.
        // 
        main: './src/client/Main.ts', // Main thread entry point
        dbWorker: './src/client/worker/IndexedDBWorker.ts' // Web worker entry point
    },
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js', // Outputs main.bundle.js and dbWorker.bundle.js
        globalObject: 'self' // Webpack config for web workers, ensuring that the global scope within the workers is correctly referenced.
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/, //  rule for handling .tsx? files, which applies to both .ts and .tsx files 
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.client.json' // Default TS config for main threads
                    }
                },
                exclude: [/node_modules/, /\.test\.tsx?$/, /tests/, /__tests__/, /__mocks__/]
            },
            {
                test: /\.worker\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.clientWorker.json' // Specific TS config for web workers
                    }
                },
                exclude: [/node_modules/, /\.test\.tsx?$/, /tests/, /__tests__/, /__mocks__/]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'], // Add .tsx if using React
    },
    devtool: 'source-map', // Add devtool option here
    plugins: [
        // ... your other plugins
        new CopyPlugin({
            patterns: [
                { from: "src/client/index.html", to: "index.html" },
                // If you have a 'styles.css' in your 'src' directory, include it here:
                // { from: "src/styles.css", to: "styles.css" },
            ],
        }),
    ],
};


// module.exports = {
//     // ... your other webpack config
//     plugins: [
//         // ... your other plugins
//         new CopyPlugin({
//             patterns: [
//                 { from: "src/index.html", to: "index.html" },
//                 // If you have a 'styles.css' in your 'src' directory, include it here:
//                 // { from: "src/styles.css", to: "styles.css" },
//             ],
//         }),
//     ],
// };