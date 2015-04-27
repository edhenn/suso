/*global suso */
/*jslint plusplus: true */

(function (suso) {
	"use strict";

	// sometimes called "number claiming" or "omission"
	suso.rules.restrictedPossibleValue = function (grid) {
		var houses = grid.allGroups(),
			intersects,
			blocks,
			rows,
			cols,
			progress = false;

		// iterate every house's remaining values (row, col, block)
		// looking for values that are restricted to one intersecting house
		// (row or col w/ val in one block only; block w/ val in one row or col only)
		// to remove the value from other cells in the intersecting house.
		houses.forEach(function (house) {
			// iterate remaining possible values in this house
			house.possibleValues().forEach(function (possval) {
				intersects = [[], []];	// [blocks, empty] for rows/cols; [rows, cols] for blocks
				// iterate cells in house, looking for possible value restricted to one intersecting house
				house.cells().filter(function (cell) {
					return cell.hasPossible(possval);
				}).forEach(function (cell) {
					if (house.type() === "block") {
						rows = intersects[0];
						cols = intersects[1];
						if (rows.indexOf(cell.row()) === -1) {
							rows.push(cell.row());
						}
						if (cols.indexOf(cell.col()) === -1) {
							cols.push(cell.col());
						}
					} else {
						blocks = intersects[0];
						if (blocks.indexOf(cell.block()) === -1) {
							blocks.push(cell.block());
						}
					}
				});
				// if possible value is in only one intersecting house, remove it from other cells of the intersecting house.
				if (house.type() === "block") {
					intersects.filter(function (rowOrCol) {
						return rowOrCol.length === 1;
					}).forEach(function (rowOrCol) {
						rowOrCol[0].cells().forEach(function (intersectCell) {
							if (intersectCell.block() !== house &&
									intersectCell.hasPossible(possval) &&
									intersectCell.removePossible(possval)) {
								progress = true;
								grid.trigger("report", rowOrCol[0],
									"claimed " + possval.toString() + " in " + house.name() +
									" - remove possibles from intersecting " + rowOrCol[0].name());
							}
						});
					});
				} else {
					if (intersects[0].length === 1) {
						intersects[0][0].cells().forEach(function (intersectCell) {
							if (intersectCell.row() !== house &&
									intersectCell.col() !== house &&
									intersectCell.hasPossible(possval) &&
									intersectCell.removePossible(possval)) {
								progress = true;
								grid.trigger("report", intersects[0][0],
									"claimed " + possval.toString() + " in " + house.name() +
									" - remove possibles from intersecting " + intersects[0][0].name());
							}
						});
					}
				}
			});
		});

		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(suso));
