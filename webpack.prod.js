module.exports = (env, argv) => {
    const path = require('path');
    const copyWebpackPlugin = require('copy-webpack-plugin');

    const babel_config = {
        loader: 'babel-loader',
        options: {
            "presets": [
                [
                    "env", {
                        "targets": {
                            "browsers": ["last 2 versions", "safari >= 7"]
                        },
                        "modules": false,
                        "loose": true
                    }
                ]
            ]
        }
    };

    const copyDirectories = [
        { from: '../../game', to: 'game' },
        { from: '../../src/html' },
        { from: '../../src/js', to: 'js' },
        { from: '../../src/css', to: 'css' }
    ];

    const config = {
        context: path.join(__dirname, 'src', 'ts'),
        entry: {
            app: [
                "babel-polyfill",
                "webpack/hot/only-dev-server",
                path.join(__dirname, 'src', 'ts', 'index.ts')
            ]
        },
        devServer: {
            host: "0.0.0.0",
            port: 3000
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        plugins: [
            new copyWebpackPlugin(copyDirectories)
        ],
        output: {
            publicPath: "/Pixi-sample-test/",
            path: "dist/"
        },
        module: {
            rules: [{
                test: /\.ts(x?)$/,
                use: [
                    babel_config,
                    {
                        loader: 'ts-loader'
                    }
                ]
            }, {
                test: /\.js$/,
                use: [
                    babel_config,
                ]
            }]
        },
        externals: [
            { "pixi.js": "PIXI" }
        ]
    }
    return config;
}