/*global jsobj */
/*jslint plusplus: true */

(function (jsobj) {
	"use strict";

	if (jsobj.rules === undefined) {
		jsobj.rules = {};
	}

	// sometimes called "number claiming" or "omission"
	jsobj.rules.restrictedPossibleValue = function (grid) {
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
		houses.each(function (house) {
			// iterate remaining possible values in this house
			house.possibleValues().each(function (possval) {
				intersects = [[], []];	// [blocks, empty] for rows/cols; [rows, cols] for blocks
				// iterate cells in house, looking for possible value restricted to one intersecting house
				house.cells().each(function (cell) {
					if (cell.possibles[possval] !== undefined) {
						if (house.type() === 'block') {
							rows = intersects[0];
							cols = intersects[1];
							if (!rows.contains(cell.row())) {
								rows.push(cell.row());
							}
							if (!cols.contains(cell.col())) {
								cols.push(cell.col());
							}
						} else {
							blocks = intersects[0];
							if (!blocks.contains(cell.block())) {
								blocks.push(cell.block());
							}
						}
					}
				});
				// if possible value is in only one intersecting house, remove it from other cells of the intersecting house.
				if (house.type() === 'block') {
					intersects.where(function (rowOrCol) {
						return rowOrCol.length === 1;
					}).each(function (rowOrCol) {
						rowOrCol[0].cells().each(function (intersectCell) {
							if (intersectCell.block() !== house && intersectCell.possibles[possval] !== undefined) {
								progress = intersectCell.removePossible(possval);
							}
						});
					});
				} else {
					if (intersects[0].length === 1) {
						intersects[0][0].cells().each(function (intersectCell) {
							if (intersectCell.row() !== house &&
									intersectCell.col() !== house &&
									intersectCell.possibles[possval] !== undefined) {
								progress = intersectCell.removePossible(possval);
							}
						});
					}
				}
			});
		});

		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(jsobj));