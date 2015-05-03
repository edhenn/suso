/*global suso */
/*jslint plusplus: true */
/*eslint no-loop-func: 0*/

(function (suso) {
	"use strict";

	// Naked Sets rule removes possible values from cells.
	// It looks in rows, columns, and blocks for any N cells containing the same N possible remaining values.
	// Those values can be removed from all other cells in that house.
	suso.rules.nakedsets = function (grid, ordinals) {
		var progress = false,
			allHouses = grid.allGroups(),	// rows, cols, blocks
			candidateCells,
			setSizes = [2, 3, 4, 5];

		if (suso.isOrdinalArray(ordinals)) {
			setSizes = ordinals;
		}

		// Iterate through each house to find "naked sets":
		// N cells sharing exactly N possible values.
		setSizes.forEach(function (setSize) {
			allHouses.filter(function (house) {
				return house.possibleValues().length > setSize;	// ignore houses with <= N possible values
			}).forEach(function (house) {
				// find all unsolved cells with up to N possible values
				candidateCells = house.cells().filter(function (cell) {
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
					house.cells().filter(function (cell) {
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
						grid.trigger("report", house, "naked sets rule (" + setSize.toString() +
							") - remove possible vals " + possVals + " from " + house.name());
					}
				});
			});
		});
		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(suso));
