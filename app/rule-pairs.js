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
			allGroups = grid.allGroups(),
			groupnum,
			group,
			cellnum,
			cell,
			twoValueCells,
			pairs,
			pairindex,
			pairnum;

		// Iterate through each row, column, and block looking for pairs
		for (groupnum = 0; groupnum < allGroups.length; groupnum++) {
			console.log('pairs - find group ' + groupnum);
			group = allGroups[groupnum];
			pairs = {};
			// find all cells with only 2 possible values
			for (cellnum = 0; cellnum < 9; cellnum++) {
				console.log('pairs - find group ' + groupnum + ', cell ' + cellnum);
				cell = group.cells()[cellnum];
				console.log('cell ' + cell.coords());
				if (cell.value() === undefined && cell.possibleValues().length === 2) {
					pairindex = cell.possibleValues().join('');
					if (pairs[pairindex] === undefined) {
						pairs[pairindex] = [];
					}
					pairs[pairindex].push(cell);
				}
			}
			// look through the found cells for ones that are pairs (two cells with the same two possible values)
			for (twoValueCells in pairs) {
				console.log('pairs - visit pair ' + twoValueCells);
				if (pairs.hasOwnProperty(twoValueCells) && pairs[twoValueCells].length === 2) {
					// delete those possible values from other cells in the group
					for (cellnum = 0; cellnum < 9; cellnum++) {
						console.log('pairs - pair ' + twoValueCells + ' - visit cell ' + cellnum);
						cell = group.cells()[cellnum];
						if (cell !== pairs[twoValueCells][0] && cell !== pairs[twoValueCells][1]) {
							cell.removePossible(twoValueCells.split('')[0]);
							cell.removePossible(twoValueCells.split('')[1]);
							progress = true;
						}
					}
				}
			}
		}

		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(jsobj));