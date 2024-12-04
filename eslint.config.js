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
		},
	},
);
