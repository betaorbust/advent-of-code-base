// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	eslint.configs.recommended,
	// Switch this to configs.strict or fall back to
	// configs.recommended based on typescript proficiency
	tseslint.configs.strictTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		rules: {
			// Love this rule but it obfuscates squigglies when things are
			// actually going wrong for other reasons.
			'@typescript-eslint/no-unsafe-call': 'off',

			// Love this rule but it obfuscates squigglies when things are
			// actually going wrong for other reasons.
			'@typescript-eslint/no-unsafe-assignment': 'off',

			// typof new String('foo') === 'object' 😬
			'no-new-wrappers': 'error',
			camelcase: [
				'error',
				{
					properties: 'never',
					ignoreDestructuring: false,
					ignoreImports: false,
					ignoreGlobals: false,
				},
			],
			'@typescript-eslint/no-shadow': 'error',
			'@typescript-eslint/restrict-template-expressions': [
				'error',
				{
					allow: [{ name: ['Error', 'URL', 'URLSearchParams'], from: 'lib' }],
					allowAny: true,
					allowBoolean: true,
					allowNullish: true,
					allowNumber: true,
					allowRegExp: true,
				},
			],
			'@typescript-eslint/no-unnecessary-condition': [
				'error',
				{ allowConstantLoopConditions: true },
			],
		},
	},
);
