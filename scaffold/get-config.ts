import fs from 'node:fs/promises';
import path from 'node:path';
import { config as dotEnvRunConfig } from 'dotenv';
import 'dotenv/config';
import inquirer from 'inquirer';
import * as z from 'zod';

const noCookieError = `🚨 AOC Session Cookie Missing! 🚨
In Chromium-based browsers like Chrome and Edge you can obtain your cookie by
visiting the site, logging in, opening developer tools (F12), and clicking
Application then expanding Cookies under the Storage section, locating the
adventofcode.com cookie, and copying the "session" cookie value.
`;

const yearConfigSchema = z.object({
	year: z.number().optional(),
});

const rootPath = path.resolve(import.meta.dirname, '../');
const envPath = path.resolve(rootPath, '.env');
const yearConfigPath = path.resolve(rootPath, 'year-config.json');

export async function getConfig() {
	let cookie = process.env['COOKIE'];
	if (!cookie) {
		console.log(noCookieError);

		const { cookie: newCookie } = await inquirer.prompt<{ cookie: string }>([
			{
				type: 'input',
				name: 'cookie',
				message:
					'Enter your Advent of Code session cookie to save it to a .env file',
				validate: (value) =>
					typeof value === 'string' && value.length === 128
						? true
						: 'Cookie values are 128 characters long',
				transformer: (value) => value.trim(),
				required: true,
			},
		] as const);

		const existingEnv = await fs.readFile(envPath, 'utf-8').catch(() => '');
		await fs.writeFile(
			'.env',
			`${existingEnv}\nCOOKIE=${newCookie}\n`,
			'utf-8',
		);
		dotEnvRunConfig();
		cookie = newCookie;
	}

	const { data } = yearConfigSchema.safeParse(
		JSON.parse(await fs.readFile(yearConfigPath, 'utf-8').catch(() => '{}')),
	);

	let year = data?.year;

	if (!year) {
		console.log("No year found in year-config.json. Let's add one!");
		const { year: newYear } = await inquirer.prompt<{ year: number }>([
			{
				type: 'number',
				name: 'year',
				message:
					'What year of Advent of Code puzzles is this repo for? (yyyy format. Example: 2024)',
				required: true,
				validate: (value) =>
					typeof value === 'number' &&
					value >= 2015 &&
					value <= new Date().getFullYear()
						? true
						: 'Year must be a number between 2015 and the current year',
			},
		]);
		await fs.writeFile(
			yearConfigPath,
			JSON.stringify({ year: newYear }, null, '\t'),
			'utf-8',
		);
		year = newYear;
	}

	return {
		cookie,
		clearCache: process.env['CLEAR_CACHE'] === 'true',
		year,
		debugLogger:
			process.env['DEBUG'] === 'true'
				? console.log
				: ((() => {}) as (typeof console)['log']),
	};
}
