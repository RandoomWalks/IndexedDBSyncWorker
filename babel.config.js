// module.exports = {
//     presets: [
//         ['@babel/preset-env', { targets: { node: 'current' }, modules: 'auto' }]
//     ],
// };

module.exports = {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' }, modules: 'auto' }],
        '@babel/preset-typescript' // Include if you decide to use Babel for TypeScript
    ],
    plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['@babel/plugin-transform-runtime']
    ]
};
