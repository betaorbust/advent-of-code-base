import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Make sure ./src is there
try {
	mkdirSync('./src');
} catch {
	// do nothing
}

const lastDir =
	readdirSync('./src', { withFileTypes: true })
		.filter((f) => f.isDirectory() && /^\d\d$/.test(f.name))
		.map((f) => f.name)
		.sort()
		.reverse()[0] || '0';

const today = Number.parseInt(lastDir, 10) + 1;
const nextDir = today.toString().padStart(2, '0');

const dirPath = join('./src', nextDir);
mkdirSync(dirPath);

const test = `import { part1 } from './part1';
// import { part2 } from './part2';

const testCasesPt1: [Parameters<typeof part1>[0], ReturnType<typeof part1>][] =
	[['some input', 'some output']];

describe('Day ${today}, part 1', () => {
	test.each(testCasesPt1)('Input: %s. Output: %s', (input, expected) => {
		expect(part1(input)).toBe(expected);
	});
});

// const testCasesPt2: [Parameters<typeof part2>[0], ReturnType<typeof part2>][] =
// 	[['some input', 'some output']];

// describe('Day ${today}, part 2', () => {
// 	test.each(testCasesPt2)('Input: %s. Output: %s', (input, expected) => {
// 		expect(part2(input)).toBe(expected);
// 	});
// });
`;

const part1 = `/**
 Part 1
*/
export const part1 = (input: string) => {
	console.log(input);
    return 'not implemented';
};`;
const part2 = `/**
 Part 2
*/
export const part2 = (input: string) => {
	console.log(input);
    return 'not implemented';
};`;
const solution = `import { part1 } from './part1';
import { part2 } from './part2';

const input = \`\`;

console.log('Part 1:', part1(input));
console.log('Part 2:', part2(input));
`;
const prompt = `# Advent of Code Day ${today}

## Part 1

<pre>

</pre>

## Part 2

<pre>

</pre>
`;

writeFileSync(join(dirPath, 'all.test.ts'), test);
writeFileSync(join(dirPath, 'part1.ts'), part1);
writeFileSync(join(dirPath, 'part2.ts'), part2);
writeFileSync(join(dirPath, 'solution.ts'), solution);
writeFileSync(join(dirPath, 'prompt.md'), prompt);
