# Advent of Code

Crimes against code will be `git commit`ted

But hey, if you want to try it out, go for it.

### Getting Started

Fork this repo, then

```sh
npm install
```

<details>
<summary>If you're trying to fork your own repo on github</summary>
You can't. Instead make a new one, clone, and push up to that.

```sh
YEAR=2024
USER=betaorbust
git clone -b main --single-branch https://github.com/betaorbust/advent-of-code-base advent-of-code-$YEAR
cd advent-of-code-$YEAR
git remote set-url origin https://github.com/$USER/advent-of-code-$YEAR
git remote add upstream https://github.com/betaorbust/advent-of-code-base
git push origin main
git push --all
```

</details>

### Working with the Advent of Code

1. Run `npm run next` to scaffold a directory for the day's work and pull in the Part 1 problem.
   (If this is the first time you're running this, you'll be prompted to set up a session cookie and pick the year.)
   The day's Part 1 problem statement will be pulled into `problem.md`, the Input will be stored in `solution.ts` and a `part1.ts` and `part1.test.ts` file will be scaffolded out for you.
   ```
   /
   ├─ 01/
   │  ├─ part1.ts
   │  ├─ part1.test.ts
   │  ├─ problem.md
   │  ├─ solution.ts
   ```
2. Update your `part1.test.ts` file with whatever test case the problem statement gives you and the expected answer.
3. Run `npm run test:watch ./01` (or whatever day's directory you're on) to start up testing while you work on the solution.
4. Implement the solution in `part1.ts` until you get the ✅ in your test.
5. Run `npm run day 01` to print out the solved puzzle running your code against the Input for the day.
6. Submit your answer on the website 🎉
7. Run `npm run next` to pull down and scaffold out part 2 in the same way.

## Code of Conduct

This project is governed by the contained [Code of Conduct](./CODE_OF_CONDUCT.md).
