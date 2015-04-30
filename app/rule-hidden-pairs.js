/*global suso */
/*jslint plusplus: true, continue: true, bitwise: true */
/*eslint no-loop-func: 0*/

(function (suso) {
	"use strict";

	// Hidden Pairs rule removes possible values from cells.
	// It looks in rows, columns, and blocks for any 2 cells containing the only instances of two possible remaining values,
	// and removes any other possible values from those 2 cells.
	suso.rules.hiddenpairs = function (grid) {
		var progress = false,
			cellsByVal,
			safeFlags,
			targetFlags,
			flagValue;

		// Iterate through each row, column, and block looking for Hidden Pairs
		grid.allGroups().filter(function (group) {
			return group.possibleValues().length > 2;
		}).forEach(function (group) {
			cellsByVal = {};
			group.cells().filter(function (cell) {
				return cell.value() === undefined;
			}).forEach(function (cell) {
				// index unsolved cells in group by which possible values they contain
				cell.possibleValues().forEach(function (possVal) {
					if (cellsByVal[possVal] === undefined) {
						cellsByVal[possVal] = [];
					}
					cellsByVal[possVal].push(cell);
				});
			});
			// filter down to possible values existing in exactly 2 cells
			cellsByVal = suso.filter(cellsByVal, function (el) {
				return el.length === 2;
			});
			// for each possible value with 2 cells, check all others for a matching set of cells
			suso.sets(cellsByVal, 2).forEach(function (set) {
				if (cellsByVal[set[0]][0] === cellsByVal[set[1]][0] && cellsByVal[set[0]][1] === cellsByVal[set[1]][1]) {
					safeFlags = Math.pow(2, 9 - parseInt(set[0], 10)) | Math.pow(2, 9 - parseInt(set[1], 10));	// flags for poss vals to keep
					cellsByVal[set[0]].forEach(function (targetCell) {
						// remove all other possible values from the cell pair
						targetFlags = targetCell.possibleFlags() ^ safeFlags;	// remaining flags can be removed
						flagValue = 9;
						while (targetFlags > 0) {
							if ((targetFlags & 1) > 0) {
								if (targetCell.removePossible(flagValue)) {
									grid.trigger("report", targetCell, "hidden pairs - remove possible " + flagValue);
									progress = true;
								}
							}
							flagValue--;
							targetFlags = targetFlags >> 1;
						}
					});
				}
			});

		});

		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(suso));
