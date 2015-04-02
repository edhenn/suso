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
			houseNum,
			house,
			houseCells,
			possnum,
			possval,
			intersects,
			blocks,
			rows,
			cols,
			cellnum,
			cell,
			intersectCell,
			rowOrCol,
			progress = false;

		// iterate every house's remaining values (row, col, block)
		// looking for values that are restricted to one intersecting house
		// (row or col w/ val in one block only; block w/ val in one row or col only)
		// to remove the value from other cells in the intersecting house.
		for (houseNum = 0; houseNum < houses.length; houseNum++) {
			house = houses[houseNum];
			// iterate remaining possible values in this house
			for (possnum = 0; possnum < house.possibleValues().length; possnum++) {
				houseCells = house.cells();
				possval = house.possibleValues()[possnum];
				intersects = [[], []];	// [blocks, empty] for rows/cols; [rows, cols] for blocks
				// iterate cells in house, looking for possible value restricted to one intersecting house
				for (cellnum = 0; cellnum < houseCells.length; cellnum++) {
					cell = houseCells[cellnum];
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
				}
				// if possible value is in only one intersecting house, remove it from other cells of the intersecting house.
				if (house.type() === 'block') {
					for (rowOrCol = 0; rowOrCol < 2; rowOrCol++) {
						if (intersects[rowOrCol].length === 1) {
							for (cellnum = 0; cellnum < 9; cellnum++) {
								intersectCell = intersects[rowOrCol][0].cells()[cellnum];
								if (intersectCell.block() !== house && intersectCell.possibles[possval] !== undefined) {
									progress = intersectCell.removePossible(possval);
								}
							}
						}
					}
				} else {
					if (intersects[0].length === 1) {
						for (cellnum = 0; cellnum < 9; cellnum++) {
							intersectCell = intersects[0][0].cells()[cellnum];
							if (intersectCell.row() !== house && intersectCell.col() !== house &&
									intersectCell.possibles[possval] !== undefined) {
								progress = intersectCell.removePossible(possval);
							}
						}
					}
				}
			}
		}

		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(jsobj));