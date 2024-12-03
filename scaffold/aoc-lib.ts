import path from 'node:path';
import { parse } from 'node-html-parser';
import TurndownService from 'turndown';
import * as z from 'zod';
import { FileCache } from './cache.ts';
import { getConfig } from './get-config.ts';

const cachePathBase = path.resolve(
	import.meta.dirname,
	'../.aoc-network-cache.json',
);

console.log({ cachePathBase });

const requestResult = z.object({
	status: z.number(),
	statusText: z.string(),
	body: z.string(),
});
type RequestResult = z.infer<typeof requestResult>;

const cache = new FileCache<unknown>(cachePathBase);

const cachedFetch = async (urlPath: string, options?: RequestInit) => {
	const cacheKey = `${urlPath}::${JSON.stringify(options)}`;
	const { headers, ...otherOptions } = options ?? {};
	const { cookie, debugLogger } = await getConfig();
	debugLogger(
		`Fetching ${urlPath} with options:\n${JSON.stringify(otherOptions, null, 2)}`,
	);

	let response: RequestResult | undefined;
	const cachedValue = cache.get(cacheKey);
	if (cachedValue) {
		try {
			response = await requestResult.parseAsync(cachedValue);
		} catch {
			console.log('Cache was not expected shape. Fetching fresh data.');
		}
	}
	if (response === undefined) {
		debugLogger(`Cache miss for ${urlPath}`);
		const networkResponse = await fetch(urlPath, {
			...otherOptions,
			headers: {
				accept:
					'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
				'accept-language': 'en-US,en;q=0.9',
				priority: 'u=0, i',
				'sec-ch-ua':
					'"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'document',
				'sec-fetch-mode': 'navigate',
				'sec-fetch-site': 'same-origin',
				'sec-fetch-user': '?1',
				'upgrade-insecure-requests': '1',
				cookie: `session=${cookie}`,
				Referer: 'https://adventofcode.com/2024',
				'Referrer-Policy': 'strict-origin-when-cross-origin',
				'user-agent':
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Jacques Favreau (@jacquesfavreau.com)',
				...headers,
			},
		});

		response = {
			status: networkResponse.status,
			statusText: networkResponse.statusText,
			body: await networkResponse.text(),
		};

		if (networkResponse.ok) {
			cache.set(cacheKey, response);
		}
	}

	return {
		...response,
		deleteCachedResponse: () => {
			cache.delete(cacheKey);
		},
	};
};

export async function getProblem(day: number, part: 1 | 2) {
	const { year } = await getConfig();
	const { body, status, deleteCachedResponse } = await cachedFetch(
		`https://adventofcode.com/${year.toString()}/day/${day.toString()}#part-${part.toString()}`,
		{},
	);
	if (status === 404) {
		console.log(
			`Day ${day.toString()} problem statement not found. Maybe it wasn't published yet? 
Got this from the server:
${body}`,
		);
		process.exit(1);
	}
	const root = parse(body);

	// Handle <pre><code>...</code></pre> blocks so we can target <pre> as ```
	root.querySelectorAll('pre > code').forEach((el) => {
		el.replaceWith(el.innerText);
	});

	// AOC puts <em> inside <code> to do bolded code, but markdown doesn't support
	// that, so flip them around if it's the only thing in the <code> block
	root
		.querySelectorAll('code')
		.filter(
			(el) =>
				el.childNodes.length === 1 && el.childNodes[0]?.rawTagName === 'em',
		)
		.forEach((el) => el.replaceWith(`<em><code>${el.innerText}</code></em>`));

	// AOC uses <em> for bold. Replace with <strong> so it converts correctly
	root
		.querySelectorAll('em')
		.forEach((el) =>
			el.classList.contains('star')
				? el.replaceWith(`<strong><em>${el.innerHTML}</em></strong>`)
				: el.replaceWith(`<strong>${el.innerHTML}</strong>`),
		);

	// Headers have --- in them which turns into awkward markdown
	root.querySelectorAll('h2').forEach((el) => {
		const trimmedText = el.innerText.replaceAll(/---/g, '').trim();
		el.innerHTML = trimmedText;
	});

	// Convert to markdown
	const turndownService = new TurndownService({
		bulletListMarker: '-',
	});

	// Convert <code> to `code` instead of ```code```
	// because AOC uses <pre> for code blocks
	turndownService.addRule('code', {
		filter: 'code',
		replacement: function (content) {
			return '`' + content + '`';
		},
	});

	const [part1, part2] = root
		.querySelectorAll('.day-desc')
		.map((el) => turndownService.turndown(el.innerHTML));

	if (part === 1) {
		if (!part1) {
			console.log(
				`Could not find problem statement for part 1 of day ${day.toString()}`,
			);
			process.exit(1);
		}
		return part1;
	}
	if (!part2) {
		console.log(
			`Could not find problem statement for part 2 of day ${day.toString()}. Is part 1 complete?`,
		);
		deleteCachedResponse();
		process.exit(1);
	}
	return part2;
}

export async function getInput(day: number) {
	const { year } = await getConfig();
	const { body: content, status } = await cachedFetch(
		`https://adventofcode.com/${year.toString()}/day/${day.toString()}/input`,
		{},
	);
	if (status === 400) {
		console.log(
			`Could not fetch day ${day.toString()} input. 
Got a 400 (likely unauthenticated) error. Maybe your cookie in the .env file is invalid? Deleting the .env file will prompt you to re-authenticate.

Got this from the server:
${content}`,
		);
		process.exit(1);
	}
	if (status === 404) {
		console.log(`Day ${day.toString()} input not found. Maybe it wasn't published yet?
 Got this from the server:
 ${content}`);
	}

	// They come with an extra newline at the end
	return content.replace(/\n$/, '');
}
