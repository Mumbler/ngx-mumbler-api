module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './projects/ngx-mumbler-api/tsconfig.lib.json',
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint/eslint-plugin',
        'header'
    ],
    extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint'
    ],
    root: true,
    env: {
        node: true,
        jest: true
    },
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': [
            'error',
            {
                allowExpressions: true,
                allowTypedFunctionExpressions: true,
                allowHigherOrderFunctions: true,
                allowConciseArrowFunctionExpressionsStartingWithVoid: false
            }
        ],
        '@typescript-eslint/array-type': [
            'error',
            { default: 'generic', readonly: 'generic' }
        ],
        '@typescript-eslint/class-literal-property-style': ['error', 'getters'],
        '@typescript-eslint/explicit-member-accessibility': [
            'error',
            { accessibility: 'explicit' }
        ],
        '@typescript-eslint/explicit-module-boundary-types': [
            'error',
            {
                allowTypedFunctionExpressions: true,
                allowHigherOrderFunctions: true,
                allowDirectConstAssertionInArrowFunctions: true,
                shouldTrackReferences: true
            }
        ],
        '@typescript-eslint/member-ordering': [
            'error',
            { default: { order: 'alphabetically', memberTypes: [
                // Index signature
                "signature",

                // Fields
                "public-static-field",
                "protected-static-field",
                "private-static-field",
                "public-decorated-field",
                "protected-decorated-field",
                "private-decorated-field",
                "public-instance-field",
                "protected-instance-field",
                "private-instance-field",
                "public-abstract-field",
                "protected-abstract-field",
                "private-abstract-field",

                // Constructors
                "public-constructor",
                "protected-constructor",
                "private-constructor",

                // Methods
                "public-static-method",
                "protected-static-method",
                "private-static-method",
                "public-abstract-method",
                "protected-abstract-method",
                "private-abstract-method",
                "public-decorated-method",
                "protected-decorated-method",
                "private-decorated-method",
                "public-instance-method",
                "protected-instance-method",
                "private-instance-method",
            ] } }
        ],
        '@typescript-eslint/method-signature-style': ['error', 'property'],
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'default',
                format: ['strictCamelCase', 'UPPER_CASE' ],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid'
            },
            {
                selector: 'property',
                format: ['strictCamelCase'],
                leadingUnderscore: 'allow',
                trailingUnderscore: 'forbid'
            },
            {
                selector: 'parameterProperty',
                format: ['strictCamelCase'],
                leadingUnderscore: 'require',
                trailingUnderscore: 'forbid'
            },
            {
                selector: 'variable',
                format: ['strictCamelCase', 'snake_case', 'UPPER_CASE'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid'
            },
            {
                selector: 'class',
                format: ['StrictPascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid'
            },
            {
                selector: 'parameter',
                format: ['strictCamelCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid'
            },
            {
                selector: 'interface',
                format: ['StrictPascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid'
            },
            {
                selector: 'enum',
                format: ['StrictPascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid'
            },
            {
                selector: 'function',
                format: ['strictCamelCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid'
            },
            {
                selector: 'typeLike',
                format: ['StrictPascalCase']
            },
            {
                selector: 'method',
                modifiers: ['static'],
                format: ['StrictPascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid'
            },
            {
                selector: 'property',
                modifiers: ['static'],
                format: ['StrictPascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid'
            }
        ],
        // note you must disable the base rule as it can report incorrect errors
        'comma-spacing': 'off',
        '@typescript-eslint/comma-spacing': ['error'],
        '@typescript-eslint/default-param-last': ['error'],
        // note you must disable the base rule as it can report incorrect errors
        'func-call-spacing': 'off',
        '@typescript-eslint/func-call-spacing': ['error', 'never'],
        // note you must disable the base rule as it can report incorrect errors
        indent: 'off',
        '@typescript-eslint/indent': ['error', 4],
        // note you must disable the base rule as it can report incorrect errors
        'init-declarations': 'off',
        '@typescript-eslint/init-declarations': ['error', 'always'],
        // note you must disable the base rule as it can report incorrect errors
        'keyword-spacing': 'off',
        '@typescript-eslint/keyword-spacing': [
            'error',
            { before: true, after: true }
        ],
        // note you must disable the base rule as it can report incorrect errors
        'no-array-constructor': 'off',
        '@typescript-eslint/no-array-constructor': ['error'],
        // note you must disable the base rule as it can report incorrect errors
        'no-dupe-class-members': 'off',
        '@typescript-eslint/no-dupe-class-members': ['error'],
        // note you must disable the base rule as it can report incorrect errors
        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': ['error'],
        // note you must disable the base rule as it can report incorrect errors
        'no-extra-parens': 'off',
        '@typescript-eslint/no-extra-parens': ['error'],
        // note you must disable the base rule as it can report incorrect errors
        'no-extra-semi': 'off',
        '@typescript-eslint/no-extra-semi': ['error'],
        // note you must disable the base rule as it can report incorrect errors
        'no-invalid-this': 'off',
        '@typescript-eslint/no-invalid-this': ['off'],
        //'@typescript-eslint/no-magic-numbers': ['error', { ignoreEnums: true, ignoreNumericLiteralTypes: true }],
        // note you must disable the base rule as it can report incorrect errors
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': ['error'],
        // note you must disable the base rule as it can report incorrect errors
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        // note you must disable the base rule as it can report incorrect errors
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        // note you must disable the base rule as it can report incorrect errors
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': ['error'],
        // note you must disable the base rule as it can report incorrect errors
        quotes: 'off',
        '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: false, allowTemplateLiterals: true }],
        // note you must disable the base rule as it can report incorrect errors
        'require-await': 'off',
        '@typescript-eslint/require-await': 'error',
        // note you must disable the base rule as it can report incorrect errors
        semi: 'off',
        '@typescript-eslint/semi': [
            'error',
            'always',
            { omitLastInOneLineBlock: true }
        ],
        // note you must disable the base rule as it can report incorrect errors
        'space-before-function-paren': 'off',
        '@typescript-eslint/space-before-function-paren': [
            'error',
            { anonymous: 'always', named: 'never', asyncArrow: 'always' }
        ],
        '@typescript-eslint/no-base-to-string': [
            'error',
            { ignoredTypeNames: ['RegExp'] }
        ],
        '@typescript-eslint/no-empty-interface': [
            'error',
            { allowSingleExtends: true }
        ],
        '@typescript-eslint/no-explicit-any': [
            'error',
            { fixToUnknown: false, ignoreRestArgs: false }
        ],
        '@typescript-eslint/no-extraneous-class': [
            'error',
            {
                allowConstructorOnly: true,
                allowEmpty: false,
                allowStaticOnly: false,
                allowWithDecorator: true
            }
        ],
        '@typescript-eslint/no-floating-promises': ['error'],
        '@typescript-eslint/no-for-in-array': ['error'],
        '@typescript-eslint/no-implied-eval': ['error'],
        '@typescript-eslint/no-inferrable-types': ['off'],
        // '@typescript-eslint/no-inferrable-types': [
        //     'error',
        //     { ignoreParameters: false, ignoreProperties: false }
        // ],
        '@typescript-eslint/no-misused-new': ['error'],
        '@typescript-eslint/no-misused-promises': [
            'error',
            { checksVoidReturn: true, checksConditionals: true }
        ],
        '@typescript-eslint/no-non-null-assertion': ['error'],
        '@typescript-eslint/no-require-imports': ['error'],
        '@typescript-eslint/no-this-alias': ['error'],
        '@typescript-eslint/no-throw-literal': ['error'],
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': ['error'],
        '@typescript-eslint/no-unnecessary-condition': ['error'],
        '@typescript-eslint/no-unnecessary-type-assertion': ['error'],
        '@typescript-eslint/no-unsafe-assignment': ['error'],
        '@typescript-eslint/no-unsafe-member-access': ['off'],
        '@typescript-eslint/no-unsafe-return': ['error'],
        '@typescript-eslint/no-unused-vars-experimental': ['error'],
        '@typescript-eslint/no-var-requires': ['error'],
        '@typescript-eslint/prefer-as-const': ['error'],
        '@typescript-eslint/prefer-includes': ['error'],
        '@typescript-eslint/prefer-namespace-keyword': ['error'],
        '@typescript-eslint/prefer-readonly': [
            'error',
            { onlyInlineLambdas: true }
        ],
        // '@typescript-eslint/prefer-readonly-parameter-types': ['error'],
        '@typescript-eslint/prefer-reduce-type-parameter': ['error'],
        '@typescript-eslint/prefer-string-starts-ends-with': ['error'],
        '@typescript-eslint/restrict-plus-operands': [
            'error',
            { checkCompoundAssignments: true }
        ],
        '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true, allowBoolean: true }],
        //'@typescript-eslint/strict-boolean-expressions': ['error', { allowNullable: true, allowSafe: true } ],
        '@typescript-eslint/type-annotation-spacing': [
            'error',
            { before: false, after: true }
        ],
        '@typescript-eslint/typedef': [
            'error',
            {
                arrayDestructuring: true,
                arrowParameter: true,
                memberVariableDeclaration: true,
                objectDestructuring: true,
                parameter: true,
                propertyDeclaration: true,
                variableDeclaration: true,
                variableDeclarationIgnoreFunction: true
            }
        ],
        '@typescript-eslint/unified-signatures': ['error'],
        'lines-between-class-members': [
            'error',
            'always',
            { exceptAfterSingleLine: true }
        ],
        'padded-blocks': [
            'error',
            'always',
            { blocks: true, classes: true, switches: true }
        ],
        'padding-line-between-statements': [
            'error',
            { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
            {
                blankLine: 'any',
                prev: ['const', 'let', 'var'],
                next: ['const', 'let', 'var']
            }
        ],
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': ['error', 'always'],
        'computed-property-spacing': ['error', 'always'],
        'no-trailing-spaces': ['error'],
        'space-in-parens': ['error', 'always'],
        'header/header': [2, 'block', [
            '**********************************************',
            '********* Copyright mumbler gmbh 2020 **********',
            '************* All rights reserved **************',
            '***********************************************'
        ]]
    }
};
