const fs = require('node:fs');
const path = require('node:path');

// Make sure ./src is there
try {
	fs.mkdirSync('./src');
} catch {
	// do nothing
}

const lastDir =
	fs
		.readdirSync('./src', { withFileTypes: true })
		.filter((f) => f.isDirectory() && /^\d\d$/.test(f.name))
		.map((f) => f.name)
		.sort()
		.reverse()[0] || '0';

const today = Number.parseInt(lastDir, 10) + 1;
const nextDir = today.toString().padStart(2, '0');

const dirPath = path.join('./src', nextDir);
fs.mkdirSync(dirPath);

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

fs.writeFileSync(path.join(dirPath, 'all.test.ts'), test);
fs.writeFileSync(path.join(dirPath, 'part1.ts'), part1);
fs.writeFileSync(path.join(dirPath, 'part2.ts'), part2);
fs.writeFileSync(path.join(dirPath, 'solution.ts'), solution);
fs.writeFileSync(path.join(dirPath, 'prompt.md'), prompt);
