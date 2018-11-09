module.exports = {
    readme: 'README.me',
    includes: './',
    exclude: [
        '**/node_modules/**',
        '**/build/**',
        '**/dist/**',
        '**/assets/**',
        '**/*.config.js',
        '**/*.html'
    ],
    exludeExternals: true,
    excludeNotExported: true,
};