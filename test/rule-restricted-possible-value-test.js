/*global suso, describe, it, expect */
/*jslint plusplus: true */
/*eslint no-multi-spaces: 0*/

(function () {
	"use strict";

	describe("rule-restricted-possible-value member", function () {
		it("exists in suso namespace", function () {
			expect(suso.rules.restrictedPossibleValue).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof suso.rules.restrictedPossibleValue).toBe("function");
		});
	});

	describe("rule-restricted-possible-value function", function () {
		function listSolved(grid) {
			var solved = [], row, cell, rowCells;
			for (row = 0; row < 9; row++) {
				rowCells = grid.row(row).cells();
				for (cell = 0; cell < 9; cell++) {
					if (rowCells[cell].value() !== undefined) {
						solved.push(rowCells[cell]);
					}
				}
			}
			return solved;
		}

		function countPossibles(grid) {
			var row, cells, cell, posscount = 0;

			for (row = 0; row < grid.rows.length; row++) {
				cells = grid.rows[row].cells();
				for (cell = 0; cell < cells.length; cell++) {
					posscount += cells[cell].possibleValues().length;
				}
			}
			return posscount;
		}

		it("does nothing to an empty grid", function () {
			var grid = new suso.Grid().addSeeds([]);

			suso.rules.restrictedPossibleValue(grid);

			expect(listSolved(grid).length).toBe(0);
			expect(countPossibles(grid)).toBe(9 * 9 * 9);
		});

		it("returns false when it does nothing", function () {
			var grid = new suso.Grid().addSeeds([]), result;

			result = suso.rules.restrictedPossibleValue(grid);

			expect(result).toBe(false);
		});

		it("removes possible values from elswhere in block when restricted to a row in that block", function () {
			var grid = new suso.Grid(), solved, possible, poss70, poss71, poss72, result;

			grid.row(6).cells()[4].setValue(9);								//    012 345 678
			grid.row(8).cells()[2].setValue(1);
			grid.row(8).cells()[3].setValue(2);								// 0  --- --- ---
			grid.row(8).cells()[5].setValue(3);								// 1  --- --- ---
			grid.row(8).cells()[6].setValue(4);								// 2  --- --- ---
			grid.row(8).cells()[7].setValue(5);
			grid.row(8).cells()[8].setValue(6);								// 3  --- --- ---
																			// 4  --- --- ---
			solved = listSolved(grid).length;                               // 5  --- --- ---
			possible = countPossibles(grid);
			poss70 = grid.rows[7].cells()[0].possibleValues().length;		// 6  --- -9- ---
			poss71 = grid.rows[7].cells()[1].possibleValues().length;		// 7  ~~~ --- ---
			poss72 = grid.rows[7].cells()[2].possibleValues().length;		// 8  --1 2-3 456

			result = suso.rules.restrictedPossibleValue(grid);

			expect(result).toBe(true);
			expect(listSolved(grid).length).toBe(solved);
			expect(countPossibles(grid)).toBe(possible - 3);
			expect(grid.rows[7].cells()[0].possibleValues().length).toBe(poss70 - 1);
			expect(grid.rows[7].cells()[1].possibleValues().length).toBe(poss71 - 1);
			expect(grid.rows[7].cells()[2].possibleValues().length).toBe(poss72 - 1);
			// value 9 is removed from row 7 first three cells
			expect(grid.rows[7].cells()[0].possibleValues()).toEqual([2, 3, 4, 5, 6, 7, 8]);
			expect(grid.rows[7].cells()[1].possibleValues()).toEqual([2, 3, 4, 5, 6, 7, 8]);
			expect(grid.rows[7].cells()[2].possibleValues()).toEqual([2, 3, 4, 5, 6, 7, 8]);
		});

		it("removes possible values from elswhere in block when restricted to a col in that block", function () {
			var grid = new suso.Grid(), solved, possible, poss65, poss75, poss85, result;

			grid.row(1).cells()[3].setValue(9);								//    012 345 678
			grid.row(3).cells()[3].setValue(1);
			grid.row(3).cells()[4].setValue(2);								// 0  --- --- ---
			grid.row(4).cells()[4].setValue(3);								// 1  --- 9-- ---
			grid.row(4).cells()[5].setValue(4);								// 2  --- --- ---
			grid.row(5).cells()[3].setValue(5);
			grid.row(5).cells()[4].setValue(6);								// 3  --- 12- ---
																			// 4  --- -34 ---
			solved = listSolved(grid).length;                               // 5  --- 56- ---
			possible = countPossibles(grid);
			poss65 = grid.rows[6].cells()[5].possibleValues().length;       // 6  --- --~ ---
			poss75 = grid.rows[7].cells()[5].possibleValues().length;       // 7  --- --~ ---
			poss85 = grid.rows[8].cells()[5].possibleValues().length;       // 8  --- --~ ---

			result = suso.rules.restrictedPossibleValue(grid);

			expect(result).toBe(true);
			expect(listSolved(grid).length).toBe(solved);
			expect(countPossibles(grid)).toBe(possible - 3);
			expect(grid.rows[6].cells()[5].possibleValues().length).toBe(poss65 - 1);
			expect(grid.rows[7].cells()[5].possibleValues().length).toBe(poss75 - 1);
			expect(grid.rows[8].cells()[5].possibleValues().length).toBe(poss85 - 1);
			// value 9 is removed from col 5 last three cells
			expect(grid.rows[6].cells()[5].possibleValues()).toEqual([1, 2, 3, 5, 6, 7, 8]);
			expect(grid.rows[7].cells()[5].possibleValues()).toEqual([1, 2, 3, 5, 6, 7, 8]);
			expect(grid.rows[8].cells()[5].possibleValues()).toEqual([1, 2, 3, 5, 6, 7, 8]);
		});

		it("removes possible values from elswhere in row when restricted to a block in that row", function () {
			var grid = new suso.Grid(), solved, possible,
				poss03, poss04, poss05, poss06, poss07, poss08, result;

			grid.row(1).cells()[0].setValue(2);								//    012 345 678
			grid.row(1).cells()[2].setValue(8);
			grid.row(2).cells()[0].setValue(4);								// 0  *-* ~~~ ~~~
			grid.row(2).cells()[1].setValue(6);								// 1  2-8 --- ---
			grid.row(2).cells()[2].setValue(9);								// 2  469 --- ---
			grid.row(4).cells()[0].setValue(5);
			grid.row(4).cells()[2].setValue(7);								// 3  --- --- ---
			grid.row(8).cells()[0].setValue(7);								// 4  5-7 --- ---
			grid.row(8).cells()[1].setValue(1);								// 5  --- --- ---
			grid.row(8).cells()[2].setValue(3);
																			// 6  --- --- ---
			solved = listSolved(grid).length;                               // 7  --- --- ---
			possible = countPossibles(grid);								// 8  713 --- ---
			poss03 = grid.rows[0].cells()[3].possibleValues().length;
			poss04 = grid.rows[0].cells()[4].possibleValues().length;
			poss05 = grid.rows[0].cells()[5].possibleValues().length;
			poss06 = grid.rows[0].cells()[6].possibleValues().length;
			poss07 = grid.rows[0].cells()[7].possibleValues().length;
			poss08 = grid.rows[0].cells()[8].possibleValues().length;

			result = suso.rules.restrictedPossibleValue(grid);
			expect(result).toBe(true);
			expect(listSolved(grid).length).toBe(solved);
			expect(countPossibles(grid)).toBe(possible - 6);
			expect(grid.rows[0].cells()[3].possibleValues().length).toBe(poss03 - 1);
			expect(grid.rows[0].cells()[4].possibleValues().length).toBe(poss04 - 1);
			expect(grid.rows[0].cells()[5].possibleValues().length).toBe(poss05 - 1);
			expect(grid.rows[0].cells()[6].possibleValues().length).toBe(poss06 - 1);
			expect(grid.rows[0].cells()[7].possibleValues().length).toBe(poss07 - 1);
			expect(grid.rows[0].cells()[8].possibleValues().length).toBe(poss08 - 1);
			// value 1 is removed from row 1 last six cells
			expect(grid.rows[0].cells()[5].possibleValues()).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
			expect(grid.rows[0].cells()[3].possibleValues()).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
			expect(grid.rows[0].cells()[4].possibleValues()).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
			expect(grid.rows[0].cells()[5].possibleValues()).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
			expect(grid.rows[0].cells()[6].possibleValues()).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
			expect(grid.rows[0].cells()[7].possibleValues()).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
			expect(grid.rows[0].cells()[8].possibleValues()).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
		});
	});
}());
