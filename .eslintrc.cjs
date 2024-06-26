module.exports = {
    root: true,
    env: {browser: true, es2020: true, jest: true, node: true},
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh', 'prettier'],
    rules: {
        'prettier/prettier': ['error'],
        '@typescript-eslint/no-unused-vars': ['error'],
        'react-refresh/only-export-components': [
            'warn',
            {allowConstantExport: true},
        ],
    },
};
