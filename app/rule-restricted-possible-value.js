/*global jsobj */
/*jslint plusplus: true */

(function (jsobj) {
	"use strict";

	jsobj.ruleRestrictedPossibleValue = function (grid) {
		var rowsAndCols = grid.rows.concat(grid.cols),
			rownum,
			row,
			rowcells,
			blocks,
			possnum,
			possval,
			cellnum,
			blockcellnum,
			blockcell,
			progress = false;

		// iterate every row and col's remaining values
		// looking for values that are restricted to a single row and block
		// to remove the remaining value from other cells in the same block
		for (rownum = 0; rownum < rowsAndCols.length; rownum++) {
			row = rowsAndCols[rownum];
			// iterate remaining possible values in this row
			for (possnum = 0; possnum < row.possibleValues().length; possnum++) {
				rowcells = row.cells();
				possval = row.possibleValues()[possnum];
				blocks = [];
				// iterate cells in row, looking for possible value restricted to one block
				for (cellnum = 0; cellnum < rowcells.length; cellnum++) {
					if (rowcells[cellnum].possibles[possval] !== undefined) {
						if (blocks.length === 0 || blocks[blocks.length - 1] !== rowcells[cellnum].block()) {
							blocks.push(rowcells[cellnum].block());
						}
					}
				}
				// if possible value for row is restricted to one block,
				// it can be removed from all other cells in that block
				if (blocks.length === 1) {
					for (blockcellnum = 0; blockcellnum < 9; blockcellnum++) {
						blockcell = blocks[0].cells()[blockcellnum];
						if (blockcell.row() !== row && blockcell.col() !== row &&
								blockcell.possibles[possval] !== undefined) {
							blockcell.removePossible(possval);
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