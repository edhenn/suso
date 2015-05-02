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
			targetFlags,
			flagValue,
			sets = [2, 3, 4];

		// Iterate through each row, column, and block looking for Hidden Sets
		sets.forEach(function (setSize) {
			grid.allGroups().filter(function (group) {
				return group.possibleValues().length > setSize;
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
				// filter down to possible values existing in no more than N cells
				cellsByVal = suso.filter(cellsByVal, function (el) {
					return el.length <= setSize;
				});
				// for each possible value with N cells, check all others for a matching set of cells
				suso.sets(cellsByVal, setSize).forEach(function (set) {
					var allCells = [], safeFlags = 0;
					set.forEach(function (el) {
						allCells = suso.union(allCells, cellsByVal[el]);	// get all cells with this set of possible values
						safeFlags = safeFlags | Math.pow(2, 9 - parseInt(el, 10));
					});
					if (allCells.length === setSize) {
						allCells.forEach(function (targetCell) {
							// remove all other possible values from the cell set
							targetFlags = targetCell.possibleFlags() ^ safeFlags;	// remaining flags can be removed
							flagValue = 9;
							while (targetFlags > 0) {
								if ((targetFlags & 1) > 0) {
									if (targetCell.removePossible(flagValue)) {
										grid.trigger("report", targetCell, "hidden sets (" + setSize.toString() + ") - remove possible " + flagValue);
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
		});

		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(suso));
