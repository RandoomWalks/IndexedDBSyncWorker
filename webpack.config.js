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
        main: './src/main.ts', // Main thread entry point
        dbWorker: './src/worker/dbWorker.ts' // Web worker entry point
    },
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js', // Outputs main.bundle.js and dbWorker.bundle.js
        globalObject: 'self' // Webpack config for web workers
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.json' // Default TS config for main threads
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.worker\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.worker.json' // Specific TS config for web workers
                    }
                }
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
                { from: "src/index.html", to: "index.html" },
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