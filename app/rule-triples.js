/*global jsobj */
/*jslint plusplus: true, bitwise: true, continue: true */

(function (jsobj) {
	"use strict";

	if (jsobj.rules === undefined) {
		jsobj.rules = {};
	}

	// counts number of bits set in flags
	function countBits(flags) {
		var bits = 0;

		if (typeof flags !== 'number') {
			return null;
		}

		if (flags <= 0) {
			return 0;
		}

		while (flags > 0) {
			bits += (flags & 1);
			flags = flags >> 1;
		}

		return bits;
	}

	function flagNumbers(flags) {
		var i, nums = [];

		if (typeof flags !== 'number') {
			return null;
		}

		if (flags <= 0) {
			return nums;
		}

		for (i = 9; i > 0; i--) {
			if ((flags & 1) === 1) {
				nums.push(i);
			}
			flags = flags >> 1;
		}

		return nums;
	}

	// Triples rule removes possible values from cells.
	// It looks in rows, columns, and blocks for any 3 cells containing the same three possible remaining values between them.
	// The three values can be removed from all other cells in that group.
	jsobj.rules.triples = function (grid) {
		var progress = false,
			allGroups = grid.allGroups(),	// rows, cols, blocks
			twoOrThreePossibles,
			pairs,
			countPossibles,
			tripletFlags,
			tripletNums,
			numIndex,
			result;

		// Iterate through each row, column, and block looking for triples
		allGroups.each(function (group) {
			twoOrThreePossibles = [];
			pairs = [];
			// first, find all pairs of cells in group that share 2 or 3 possible values
			group.cells().where(function (cell) {
				return cell.value() === undefined;
			}).each(function (cell) {
				countPossibles = countBits(cell.possibleFlags());
				if (countPossibles === 2 || countPossibles === 3) {
					// make pairs with all other found cells that share a possible value
					twoOrThreePossibles.each(function (twoOrThree) {
						if (twoOrThree.possibleFlags() & cell.possibleFlags() > 0) {
							pairs.push([twoOrThree, cell]);
						}
					});
					twoOrThreePossibles.push(cell);
				}
			});
			// now for each pair, find any triplets that share exactly 3 possible values
			pairs.each(function (pair) {
				// test triples with each other candidate cell that had 2 or 3 possible values
				twoOrThreePossibles.each(function (cell) {
					if (cell === pair[0] || cell === pair[1]) {
						return;
					}

					tripletFlags = pair[0].possibleFlags() |
						pair[1].possibleFlags() |
						cell.possibleFlags();

					if (countBits(tripletFlags) !== 3) {
						return;
					}

					// remove triplet possible values from all other cells in group
					tripletNums = flagNumbers(tripletFlags);
					group.cells().each(function (targetCell) {
						if (targetCell === pair[0] || targetCell === pair[1] || targetCell === cell) {
							return;
						}
						for (numIndex = 0; numIndex < 3; numIndex++) {
							result = result | targetCell.removePossible(tripletNums[numIndex]);
						}
					});

					if (result) {
						result = false;
						progress = true;
						grid.trigger('report', group, 'triplet ' + tripletNums +
							' in ' + group.name() + ' - remove other possibles');
					}
				});
			});
		});

		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(jsobj));