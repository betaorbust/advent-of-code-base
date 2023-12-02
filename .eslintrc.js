module.exports = {
	extends: ['@betaorbust/eslint-config/profiles/node'],
	parserOptions: { tsconfigRootDir: __dirname },
	rules: {
		'no-console': 'off',
		'unicorn/no-array-reduce': 'off',
		'unicorn/prefer-switch': 'off',
		'unicorn/no-array-callback-reference': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'jest/no-commented-out-tests': 'off',
	},
};
