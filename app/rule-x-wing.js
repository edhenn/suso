/*global suso */
/*eslint no-loop-func: 0*/

(function (suso) {
	"use strict";

	// X Wing rule removes possible values from cells.
	// It looks for two rows (or columns) with 4 cells arranged in a square (x)
	// containing the only instances in those rows or columns of a possible value.
	// Those values can be removed from the intersecting columns (or rows).
	suso.rules.xwing = function (grid) {
		var progress = false,
			rowsAndCols = grid.rows.concat(grid.cols),
			houseCellsByValue = {};

		// Iterate through rows, then cols
		rowsAndCols.forEach(function (house) {
			// index cells of each house by possible value
			var cellsByVal = {};
			house.cells().forEach(function (cell) {
				cell.possibleValues().forEach(function (poss) {
					if (cellsByVal[poss] === undefined) {
						cellsByVal[poss] = [];
					}
					cellsByVal[poss].push(cell);
				});
			});
			houseCellsByValue[house.num()] = suso.filter(cellsByVal, function (cells) {
				return cells.length === 2;
			});

		});
		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(suso));
