/*global jsobj, describe, xdescribe, it, xit, expect, beforeEach */
/*jslint plusplus: true */

(function () {
	"use strict";

	describe("rule-restricted-possible-value member", function () {
		it("exists in jsobj namespace", function () {
			expect(jsobj.rules.restrictedPossibleValue).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof jsobj.rules.restrictedPossibleValue).toBe("function");
		});
	});

	describe("rule-restricted-possible-value function", function () {
		function listSolved(grid) {
			var solved = [], row, cell, rowCells;
			for (row = 0; row < 9; row++) {
				rowCells = grid.hRow(row).cells();
				for (cell = 0; cell < 9; cell++) {
					if (rowCells[cell].value() !== undefined) {
						solved.push(rowCells[cell]);
					}
				}
			}
			return solved;
		}

		function countPossibles(grid) {
			var allrows, row, cells, cell, posscount = 0;

			for (row = 0; row < grid.rows.length; row++) {
				cells = grid.rows[row].cells();
				for (cell = 0; cell < cells.length; cell++) {
					posscount += cells[cell].possibleValues().length;
				}
			}
			return posscount;
		}

		it("does nothing to an empty grid", function () {
			var grid = new jsobj.Grid().addSeeds([]);

			jsobj.rules.restrictedPossibleValue(grid);

			expect(listSolved(grid).length).toBe(0);
			expect(countPossibles(grid)).toBe(9 * 9 * 9);
		});

		it("removes possible values from elswhere in block when restricted to a row", function () {
			var grid = new jsobj.Grid(), solved, possible, poss70, poss71, poss72;

			grid.hRow(6).cells()[4].setValue(9);							//    012 345 678
			grid.hRow(8).cells()[2].setValue(1);
			grid.hRow(8).cells()[3].setValue(2);		                    // 0  --- --- ---
			grid.hRow(8).cells()[5].setValue(3);                            // 1  --- --- ---
			grid.hRow(8).cells()[6].setValue(4);                            // 2  --- --- ---
			grid.hRow(8).cells()[7].setValue(5);
			grid.hRow(8).cells()[8].setValue(6);                            // 3  --- --- ---
														                    // 4  --- --- ---
			solved = listSolved(grid).length;                               // 5  --- --- ---
			possible = countPossibles(grid);
			poss70 = grid.rows[7].cells()[0].possibleValues().length;       // 6  --- -9- ---
			poss71 = grid.rows[7].cells()[1].possibleValues().length;       // 7  ~~~ --- ---
			poss72 = grid.rows[7].cells()[2].possibleValues().length;       // 8  --1 2-3 456

			jsobj.rules.restrictedPossibleValue(grid);

			expect(listSolved(grid).length).toBe(solved);
			expect(countPossibles(grid)).toBe(possible - 3);
			expect(grid.rows[7].cells()[0].possibleValues().length).toBe(poss70 - 1);
			expect(grid.rows[7].cells()[1].possibleValues().length).toBe(poss71 - 1);
			expect(grid.rows[7].cells()[2].possibleValues().length).toBe(poss72 - 1);
		});
	});
}());