/*global suso */
/*jslint plusplus: true */
/*eslint no-loop-func: 0*/

(function (suso) {
	"use strict";

	// Pairs rule removes possible values from cells.
	// It looks in rows, columns, and blocks for any 2 cells containing the same two possible remaining values.
	// The two values can be removed from all other cells in that group.
	suso.rules.pairs = function (grid) {
		var progress = false,
			allGroups = grid.allGroups(),	// rows, cols, blocks
			pairs,
			pairindex,
			removal1,
			removal2;

		// Iterate through each row, column, and block looking for pairs ("naked pairs")
		allGroups.forEach(function (group) {
			pairs = {};
			// find all cells with only 2 possible values
			group.cells().forEach(function (cell) {
				if (cell.value() === undefined && cell.possibleValues().length === 2) {
					pairindex = cell.possibleValues().join("");
					if (pairs[pairindex] === undefined) {
						pairs[pairindex] = [];
					}
					pairs[pairindex].push(cell);
				}
			});
			// look through the found cells for ones that are pairs (two cells with the same two possible values)
			pairs = suso.filter(pairs, function (paircells) {
				return paircells.length === 2;
			});
			suso.forEach(pairs, function (paircell, pairIdx) {
				var groupProgress = false,
					possVals = pairIdx.split("");
				// delete those possible values from other cells in the group
				group.cells().forEach(function (cel) {
					if (cel !== paircell[0] && cel !== paircell[1]) {
						removal1 = cel.removePossible(parseInt(possVals[0], 10));
						removal2 = cel.removePossible(parseInt(possVals[1], 10));
						groupProgress = groupProgress || removal1 || removal2;
					}
				});
				if (groupProgress) {
					progress = true;
					grid.trigger("report", group,
						"pairs rule - remove possible vals " + possVals + " from " + group.name());
				}
			});
		});

		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(suso));
