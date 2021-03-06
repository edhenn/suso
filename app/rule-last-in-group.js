/*global suso */
/*jslint plusplus: true */

(function (suso) {
	"use strict";

	suso.rules.lastInGroup = function (grid) {
		var allgroups = grid.allGroups(),
			groupx,
			groupcells,
			cellx,
			possvalues,
			possx,
			cellsByVal,
			val,
			progress = false;

		// iterate every row, col, and block (listed in allgroups)
		// looking for remaining values that exist in only one cell of the group
		for (groupx = 0; groupx < allgroups.length; groupx++) {
			cellsByVal = {};
			groupcells = allgroups[groupx].cells();

			// iterate cells in group keeping track of all cells indexed by remaining value they contain
			for (cellx = 0; cellx < groupcells.length; cellx++) {
				possvalues = groupcells[cellx].possibleValues();
				for (possx = 0; possx < possvalues.length; possx++) {
					// keep track of this cell by the possible value it contains
					if (cellsByVal[possvalues[possx]] === undefined) {
						cellsByVal[possvalues[possx]] = [];
					}
					cellsByVal[possvalues[possx]].push(groupcells[cellx]);
				}
			}

			// all cells in this group are now indexed by poss value.
			// find each possible value that is in only one cell, and solve the cell
			for (val in cellsByVal) {
				if (cellsByVal.hasOwnProperty(val) &&
						cellsByVal[val].length === 1 &&
						cellsByVal[val][0].value() === undefined) {
					cellsByVal[val][0].setValue(parseInt(val, 10), "last in group - " + allgroups[groupx].name());
					progress = true;
				}
			}
		}

		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(suso));
