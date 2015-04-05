/*global suso */
/*jslint plusplus: true, continue: true, bitwise: true */

(function (suso) {
	"use strict";

	if (suso.rules === undefined) {
		suso.rules = {};
	}

	// Hidden Pairs rule removes possible values from cells.
	// It looks in rows, columns, and blocks for any 2 cells containing the only instances of two possible remaining values,
	// and removes any other possible values from those 2 cells.
	suso.rules.hiddenpairs = function (grid) {
		var progress = false,
			allGroups = grid.allGroups(),	// rows, cols, blocks
			groupnum,
			group,
			cellsByVal,
			cellIndex,
			cell,
			cellValues,
			possIndex,
			safeFlags,
			targetIdx,
			targetFlags,
			flagValue,
			removed;

		// Iterate through each row, column, and block looking for Hidden Pairs
		for (groupnum = 0; groupnum < allGroups.length; groupnum++) {
			group = allGroups[groupnum];
			cellsByVal = {};
			if (group.possibleValues().length < 3) {
				continue;
			}
			// index cells in group by which possible values they contain
			for (cellIndex = 0; cellIndex < 9; cellIndex++) {
				cell = group.cells()[cellIndex];
				if (cell.value() !== undefined) {
					continue;
				}
				cellValues = cell.possibleValues();
				for (possIndex = 0; possIndex < cellValues.length; possIndex++) {
					if (cellsByVal[cellValues[possIndex]] === undefined) {
						cellsByVal[cellValues[possIndex]] = [];
					}
					cellsByVal[cellValues[possIndex]].push(cell);
				}
			}
			// filter down to possible values existing in exactly 2 cells
			cellsByVal = cellsByVal.where(function (el) {
				return el.length === 2;
			});
			// for each possible value with 2 cells, check all others for a matching set of cells
			cellsByVal.each(function (el, idx) {
				cellsByVal.each(function (otherEl, otherIdx) {
					if (otherIdx > idx && el[0] === otherEl[0] && el[1] === otherEl[1]) {
						safeFlags = Math.pow(2, 9 - idx) | Math.pow(2, 9 - otherIdx);	// flags for poss vals to keep
						for (targetIdx = 0; targetIdx < 2; targetIdx++) {
							// remove all other possible values from the cell pair
							targetFlags = el[targetIdx].possibleFlags() ^ safeFlags;	// remaining flags can be removed
							flagValue = 9;
							while (targetFlags > 0) {
								if ((targetFlags & 1) > 0) {
									if (el[targetIdx].removePossible(flagValue)) {
										grid.trigger('report', el[targetIdx], 'hidden pairs - remove possible ' + flagValue);
										progress = true;
									}
								}
								flagValue--;
								targetFlags = targetFlags >> 1;
							}
						}
					}
				});
			});

		}

		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(suso));