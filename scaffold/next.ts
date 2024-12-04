import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path, { join } from 'node:path';
import { getInput, getProblem } from './aoc-lib.ts';

const rootDir = path.resolve(import.meta.dirname, '../');

function getDayAndPart() {
	const dayToPath = (day: number) => day.toString().padStart(2, '0');

	const lastExistingDay = Number.parseInt(
		readdirSync(rootDir, { withFileTypes: true })
			.filter((f) => f.isDirectory() && /^\d\d$/.test(f.name))
			.map((f) => f.name)
			.sort()
			.reverse()[0] || '0',
		10,
	);
	// If we don't have any day folders, we're at the beginning
	if (lastExistingDay === 0) {
		return { day: 1, part: 1, dir: dayToPath(1) };
	}
	const dayDir = path.resolve(rootDir, dayToPath(lastExistingDay));
	const part2Exists = readdirSync(dayDir).includes('part2.ts');
	// If we have a part 2 already, we want to start the next day
	if (part2Exists) {
		return {
			day: lastExistingDay + 1,
			part: 1,
			dir: dayToPath(lastExistingDay + 1),
		};
	}
	// Otherwise we want to start part 2
	return {
		day: lastExistingDay,
		part: 2,
		dir: dayToPath(lastExistingDay),
	};
}

const { day, part, dir } = getDayAndPart();

// If we're starting a new day, we need to create the directory
if (part === 1) {
	mkdirSync(dir);
}

const test1 = (dayNum: number) => `import { part1 } from './part1.ts';

const testCasesPt1: [Parameters<typeof part1>[0], ReturnType<typeof part1>][] =
	[[\`some input\`, \`some output\`]];

describe('Day ${dayNum}, part 1', () => {
	test.each(testCasesPt1)('Input:\n%s\nOutput:\n%s', (input, expected) => {
		expect(part1(input)).toBe(expected);
	});
});
`;

const test2 = (dayNum: number) => `import { part2 } from './part2.ts';

const testCasesPt2: [Parameters<typeof part2>[0], ReturnType<typeof part2>][] =
	[[\`some input\`, \`some output\`]];

describe('Day ${dayNum}, part 2', () => {
	test.each(testCasesPt2)('Input:\n%s\nOutput:\n%s', (input, expected) => {
		expect(part2(input)).toBe(expected);
	});
});
`;

const part1 = `/**
 Part 1
*/
export const part1 = (input: string) => {
	return 'not implemented';
};`;
const part2 = `/**
 Part 2
*/
export const part2 = (input: string) => {
	return 'not implemented';
};`;
const solution1 = (
	dayNum: number,
	input: string,
) => `import { part1 } from './part1.ts';

const input = \`${input.replaceAll(/\$\{/g, '\\${').replaceAll(/`/g, '\\`')}\`;

console.log('Day ${dayNum} Part 1:', part1(input));

`;

const solution2 = (
	solutionPart1: string,
) => `import { part2 } from './part2.ts';
${solutionPart1}
console.log('Part 2:', part2(input));
`;

const problem1 = (problem: string) => `${problem}
`;

const problem2 = (problemPt1: string, problemPt2: string) => `${problemPt1}

${problemPt2}
`;

if (part === 1) {
	const input = await getInput(day);
	const problemStatement1 = await getProblem(day, 1);
	writeFileSync(join(dir, 'solution.ts'), solution1(day, input));
	writeFileSync(join(dir, 'part1.ts'), part1);
	writeFileSync(join(dir, 'part1.test.ts'), test1(day));
	writeFileSync(join(dir, 'problem.md'), problem1(problemStatement1));
} else {
	const solution1Path = join(dir, 'solution.ts');
	const problemStatement1Path = join(dir, 'problem.md');
	const solutionPart1 = readFileSync(solution1Path, 'utf-8');
	const problemStatement1 = readFileSync(problemStatement1Path, 'utf-8');
	const problemStatement2 = await getProblem(day, 2);
	writeFileSync(join(dir, 'solution.ts'), solution2(solutionPart1));
	writeFileSync(join(dir, 'part2.ts'), part2);
	writeFileSync(join(dir, 'part2.test.ts'), test2(day));
	writeFileSync(
		join(dir, 'problem.md'),
		problem2(problemStatement1, problemStatement2),
	);
}

execSync(
	`prettier --write --log-level warn "${dir}/*.{js,ts,jsx,tsx,mdx,vue,json,json5,yaml,md,html,less,sass,css,gql}"`,
	{
		cwd: rootDir,
		stdio: 'inherit',
	},
);
