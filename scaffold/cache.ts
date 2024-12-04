import fs from 'node:fs';
import { getConfig } from './get-config.ts';

const { debugLogger } = await getConfig();
/**
 * A very basic file-based cache that takes a key and value and stores it as JSON in a file
 */
export class FileCache<T = unknown> {
	private cachePath: string;
	private memoryCache: Record<string, T>;
	constructor(cachePath: string) {
		this.cachePath = cachePath;
		try {
			this.memoryCache = JSON.parse(
				fs.readFileSync(this.cachePath, 'utf-8'),
			) as Record<string, T>;
		} catch {
			this.memoryCache = {};
			fs.writeFileSync(
				this.cachePath,
				JSON.stringify(this.memoryCache, null, '\t'),
			);
		}
	}

	get(key: string) {
		debugLogger(`Cache ${key in this.memoryCache ? 'hit' : 'miss'} for ${key}`);
		return this.memoryCache[key];
	}

	set(key: string, value: T) {
		this.memoryCache[key] = value;
		fs.writeFileSync(
			this.cachePath,
			JSON.stringify(this.memoryCache, null, '\t'),
		);
		debugLogger(`Cache set for ${key}`);
	}
	delete(key: string) {
		// Just... kinda gotta be a dynamic delete
		// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
		delete this.memoryCache[key];
		fs.writeFileSync(
			this.cachePath,
			JSON.stringify(this.memoryCache, null, '\t'),
		);
		debugLogger(`Cache deleted for ${key}`);
	}
}
