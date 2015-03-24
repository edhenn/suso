/*global jsobj */
/*jslint plusplus: true, bitwise: true */

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
			bits = bits >> 1;
		}

		return bits;
	}

	// Triples rule removes possible values from cells.
	// It looks in rows, columns, and blocks for any 3 cells containing the same three possible remaining values between them.
	// The three values can be removed from all other cells in that group.
	jsobj.rules.triples = function (grid) {
		var progress = false,
			allGroups = grid.allGroups(),	// rows, cols, blocks
			groupnum,
			group,
			cellnum,
			cell,
			twoValueCells,
			twoOrThreePossibles,
			cellindex,
			pairs,
			countPossibles,
			pairindex,
			pair,
			tripletFlags,
			removal1,
			removal2,
			removal3;

		// Iterate through each row, column, and block looking for triples
		for (groupnum = 0; groupnum < allGroups.length; groupnum++) {
			group = allGroups[groupnum];
			twoOrThreePossibles = [];
			pairs = [];

			// first, find all pairs of cells in group that share 2 or 3 possible values
			for (cellnum = 0; cellnum < 9; cellnum++) {
				cell = group.cells()[cellnum];
				if (cell.value() === undefined) {
					countPossibles = countBits(cell.possibleFlags());
					if (countPossibles === 2 || countPossibles === 3) {
						// make pairs with all other found cells that share a possible value
						for (cellindex = 0; cellindex < twoOrThreePossibles.length; cellindex++) {
							if (twoOrThreePossibles[cellindex].possibleFlags() & cell.possibleFlags() > 0) {
								pairs.push([twoOrThreePossibles[cellindex], cell]);
							}
						}
						twoOrThreePossibles.push(cell);
					}
				}
			}

			// now for each pair, find any triplets that share exactly 3 possible values
			for (pairindex = 0; pairindex < pairs.length; pairindex++) {
				pair = pairs[pairindex];
				// test triples with each other candidate cell that had 2 or 3 possible values
				for (cellindex = 0; cellindex < twoOrThreePossibles.length; cellindex++) {
					cell = twoOrThreePossibles[cellindex];
					if (cell !== pair[0] && cell !== pair[1]) {
						tripletFlags = pair[0].possibleFlags() &
							pair[1].possibleFlags() &
							cell.possibleFlags();
						if (countBits(tripletFlags) === 3) {
							// remove triplet possible values from all other cells in group

						}
					}
				}
			}
/*
			// look through the found cells for ones that are pairs (two cells with the same two possible values)
			for (twoValueCells in pairs) {
				if (pairs.hasOwnProperty(twoValueCells) && pairs[twoValueCells].length === 2) {
					// delete those possible values from other cells in the group
					for (cellnum = 0; cellnum < 9; cellnum++) {
						cell = group.cells()[cellnum];
						if (cell !== pairs[twoValueCells][0] && cell !== pairs[twoValueCells][1]) {
							removal1 = cell.removePossible(parseInt(twoValueCells.split('')[0], 10));
							removal2 = cell.removePossible(parseInt(twoValueCells.split('')[1], 10));
							progress = progress || removal1 || removal2;
						}
					}
				}
			}
*/
		}
		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(jsobj));