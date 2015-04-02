/*global jsobj */
/*jslint plusplus: true */

(function (jsobj) {
	"use strict";

	if (jsobj.rules === undefined) {
		jsobj.rules = {};
	}

	// Pairs rule removes possible values from cells.
	// It looks in rows, columns, and blocks for any 2 cells containing the same two possible remaining values.
	// The two values can be removed from all other cells in that group.
	jsobj.rules.pairs = function (grid) {
		var progress = false,
			allGroups = grid.allGroups(),	// rows, cols, blocks
			groupnum,
			group,
			cellnum,
			cell,
			pairs,
			pairindex,
			removal1,
			removal2;

		// Iterate through each row, column, and block looking for pairs ("naked pairs")
		for (groupnum = 0; groupnum < allGroups.length; groupnum++) {
			group = allGroups[groupnum];
			pairs = {};
			// find all cells with only 2 possible values
			for (cellnum = 0; cellnum < 9; cellnum++) {
				cell = group.cells()[cellnum];
				if (cell.value() === undefined && cell.possibleValues().length === 2) {
					pairindex = cell.possibleValues().join('');
					if (pairs[pairindex] === undefined) {
						pairs[pairindex] = [];
					}
					pairs[pairindex].push(cell);
				}
			}
			// look through the found cells for ones that are pairs (two cells with the same two possible values)
			pairs.where(function (paircells) {
				return paircells.length === 2;
			}).each(function (paircell, pairIdx) {
				var groupProgress = false;
				// delete those possible values from other cells in the group
				group.cells().each(function (cell) {
					var possVals = pairIdx.split('');
					if (cell !== paircell[0] && cell !== paircell[1]) {
						removal1 = cell.removePossible(parseInt(possVals[0], 10));
						removal2 = cell.removePossible(parseInt(possVals[1], 10));
						groupProgress = groupProgress || removal1 || removal2;
					}
				});
				if (groupProgress) {
					progress = true;
					grid.trigger('report', group,
						'pairs rule - remove possible vals ' + pairIdx + ' from ' + group.name());
				}
			});
		}

		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(jsobj));