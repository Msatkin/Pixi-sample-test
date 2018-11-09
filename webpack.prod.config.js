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
        output: {
            filename: "index.js",
            publicPath: "/Pixi-sample-test/",
            path: path.resolve(__dirname, "dist")
        },
        context: path.join(__dirname, 'src', 'ts'),
        entry: {
            app: [
                "babel-polyfill",
                path.join(__dirname, 'src', 'ts', 'index.ts')
            ]
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        plugins: [
            new copyWebpackPlugin(copyDirectories)
        ],
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