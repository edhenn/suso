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
			candidateCells,
			setSizes = [2];

		// Iterate through each house to find "naked sets":
		// N cells sharing exactly N possible values.
		setSizes.forEach(function (setSize) {
			allGroups.filter(function (group) {
				return group.possibleValues().length > setSize;	// ignore houses with <= N possible values
			}).forEach(function (group) {
				// find all unsolved cells with up to N possible values
				candidateCells = group.cells().filter(function (cell) {
					return cell.value() === undefined && cell.possibleValues().length <= setSize;
				});
				// get all N-size subsets of those cells
				suso.sets(candidateCells, setSize).forEach(function (set) {
					var possVals = [], setProgress = false;
					set.forEach(function (setCell) {
						possVals = suso.union(possVals, setCell.possibleValues());
					});
					if (possVals.length !== setSize) {
						return;
					}
					// found a set of N cells containing N possible values.
					// those possible values can be removed from other cells in the house
					group.cells().filter(function (cell) {
						return set.indexOf(cell) === -1;	// return the other cells
					}).forEach(function (otherCell) {
						possVals.forEach(function (possVal) {
							if (otherCell.removePossible(possVal)) {
								setProgress = true;
							}
						});
					});
					if (setProgress) {
						progress = true;
						grid.trigger("report", group, "naked sets rule (" + setSize.toString() +
							") - remove possible vals " + possVals + " from " + group.name());
					}
				});
			});
		});
		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(suso));
