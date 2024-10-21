module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es6: true,
        'vue/setup-compiler-macros': true
    },
    extends: ['plugin:vue/vue3-recommended', 'plugin:vue/vue3-essential', 'eslint:recommended'],
    overrides: [
        {
            files: ['*.vue'],
            rules: {
                indent: 'off'
            }
        }
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    rules: {
        'key-spacing': ['error', { afterColon: true }],
        'vue/one-component-per-file': 'off',
        'comma-dangle': ['error', 'never'],
        'vue/no-v-html': 'off',
        'no-console': process.env.VITE_NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.VITE_NODE_ENV === 'production' ? 'warn' : 'off',
        'vue/no-unused-components': 'off',
        'no-var': 'error',
        'comma-spacing': ['error', { after: true }],
        'array-bracket-spacing': ['error', 'always'],
        quotes: ['error', 'single'],
        'vue/html-closing-bracket-newline': 'error',
        'vue/html-closing-bracket-spacing': 'error',
        'vue/html-self-closing': 'error',
        'vue/multiline-html-element-content-newline': 'error',
        'vue/array-bracket-spacing': ['error', 'always'],
        'vue/arrow-spacing': 'error',
        'vue/no-setup-props-destructure': 'off',
        'vue/max-attributes-per-line': [
            'error',
            {
                singleline: 2,
                multiline: {
                    max: 1,
                    allowFirstLine: false
                }
            }
        ],
        'vue/html-indent': [
            'error',
            4,
            {
                attribute: 1,
                baseIndent: 1,
                closeBracket: 0,
                alignAttributesVertically: true,
                ignores: []
            }
        ],
        'vue/script-indent': [
            'error',
            4,
            {
                baseIndent: 1,
                switchCase: 1
            }
        ],
        'vue/require-default-prop': 'off',
        semi: ['error', 'never'],
        'object-curly-spacing': ['error', 'always'],
        'vue/attributes-order': 'error',
        'vue/order-in-components': [
            'error',
            {
                order: [
                    'el',
                    'name',
                    'key',
                    'parent',
                    'functional',
                    'mixins',
                    ['props', 'propsData'],
                    ['components', 'directives', 'filters'],
                    ['delimiters', 'comments'],
                    'extends',
                    ['provide', 'inject'],
                    'ROUTER_GUARDS',
                    'layout',
                    'middleware',
                    'validate',
                    'scrollToTop',
                    'transition',
                    'loading',
                    'inheritAttrs',
                    'model',
                    'emits',
                    'setup',
                    'asyncData',
                    'data',
                    'fetch',
                    'head',
                    'computed',
                    'watch',
                    'watchQuery',
                    'methods',
                    ['template', 'render'],
                    'LIFECYCLE_HOOKS',
                    'renderError'
                ]
            }
        ]
    }
};
