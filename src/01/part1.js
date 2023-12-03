/**
 Part 1
*/
module.exports.part1 = (input) => {
	let total = 0;
	input.split('\n').forEach((line) => {
		if (line.length < 1) return; // Blank lines bad
		const digitsArray = line.match(/\d/g);
		total += parseInt(digitsArray[0] + digitsArray.slice(-1)[0]);
	});
	return total;
};
