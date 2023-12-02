# Advent of Code

Crimes against code will be `git commit`ted

But hey, if you want to try it out, go for it.

### Getting Started

Fork this repo, then

```sh
npm install
```

### Developing

1. Run `npm run new` to scaffold a directory for the day's work
   ```
   src/
   ├─ 01/
   │  ├─ all.test.ts
   │  ├─ part1.ts
   │  ├─ part2.ts
   │  ├─ prompt.md
   │  ├─ solution.ts
   ```
2. Copy the day's prompt into `prompt.md` so you don't have to keep switching between the browser and your editor.
3. Copy the prompt's example input/output into the test array in `all.test.ts`
4. Run `npm run test:watch ./src/01` (or whatever day's directory you're on)
5. Implement the solution in `part1.ts` until you get the ✅ in your test
6. Copy the full input from AoC into the `input` in `solution.ts`
7. Run `npm run day 01` to print out the solved puzzle.
8. Uncomment the Part 2 tests in `all.test.ts` and repeat from #4 for the second part.

## Code of Conduct

This project is governed by the contained [Code of Conduct](./CODE_OF_CONDUCT.md).
