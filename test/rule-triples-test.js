/*global suso, describe, it, expect */
/*jslint plusplus: true */

(function () {
	"use strict";

	describe("rule-triples member", function () {
		it("exists in suso namespace", function () {
			expect(suso.rules.triples).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof suso.rules.triples).toBe("function");
		});
	});

	describe("rule-triples function", function () {
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

		it("does nothing to an empty grid", function () {
			var grid = new suso.Grid();

			suso.rules.triples(grid);

			expect(listSolved(grid).length).toBe(0);
		});

		it("returns false when it does nothing", function () {
			var grid = new suso.Grid(), result = null;

			result = suso.rules.triples(grid);

			expect(result).toBe(false);
		});

		it("removes possible values from a row when three cells in row have same triplet of possible values", function () {
			var grid = new suso.Grid(),
				progress;								//    012 345 678

			grid.row(0).cells()[2].setValue(7);			// 0  --7 234 ---	<- this row should not have 1,5,9 in last 2 cells
			grid.row(0).cells()[3].setValue(2);			// 1  6-- --- ---
			grid.row(0).cells()[4].setValue(3);			// 2  8-- --- ---
			grid.row(0).cells()[5].setValue(4);
			grid.row(1).cells()[0].setValue(6);			// 3  -6- --- -51
			grid.row(2).cells()[0].setValue(8);			// 4  -8- --- ---
			grid.row(3).cells()[1].setValue(6);			// 5  --- --- ---
			grid.row(3).cells()[7].setValue(5);
			grid.row(3).cells()[8].setValue(1);			// 6  --- --- 6--
			grid.row(4).cells()[1].setValue(8);			// 7  --- --- 8--
			grid.row(6).cells()[6].setValue(6);			// 8  --- --- ---
			grid.row(7).cells()[6].setValue(8);

			progress = suso.rules.triples(grid);

			expect(progress).toBe(true);
			expect(grid.row(0).cells()[0].possibleValues()).toEqual([1, 5, 9]);
			expect(grid.row(0).cells()[1].possibleValues()).toEqual([1, 5, 9]);
			expect(grid.row(0).cells()[6].possibleValues()).toEqual([1, 5, 9]);
			expect(grid.row(0).cells()[7].possibleValues()).toEqual([6, 8]);
			expect(grid.row(0).cells()[8].possibleValues()).toEqual([6, 8]);
		});

		it("removes possible values from a row when three cells in row share same triplet of possible values in three pairs", function () {
			var grid = new suso.Grid(),
				progress;								//    012 345 678

			grid.row(0).cells()[2].setValue(7);			// 0  --7 234 ---	<- this row should not have 1,5,9 in last 2 cells
			grid.row(0).cells()[3].setValue(2);			// 1  6-- --- ---
			grid.row(0).cells()[4].setValue(3);			// 2  8-- --- ---
			grid.row(0).cells()[5].setValue(4);
			grid.row(1).cells()[0].setValue(6);			// 3  -6- --- -51
			grid.row(2).cells()[0].setValue(8);			// 4  -8- --- ---
			grid.row(3).cells()[1].setValue(6);			// 5  15- --- 9--
			grid.row(3).cells()[7].setValue(5);
			grid.row(3).cells()[8].setValue(1);			// 6  --- --- 6--
			grid.row(4).cells()[1].setValue(8);			// 7  --- --- 8--
			grid.row(5).cells()[0].setValue(1);			// 8  --- --- ---
			grid.row(5).cells()[1].setValue(5);
			grid.row(5).cells()[6].setValue(9);
			grid.row(6).cells()[6].setValue(6);
			grid.row(7).cells()[6].setValue(8);

			progress = suso.rules.triples(grid);

			expect(progress).toBe(true);
			expect(grid.row(0).cells()[0].possibleValues()).toEqual([5, 9]);
			expect(grid.row(0).cells()[1].possibleValues()).toEqual([1, 9]);
			expect(grid.row(0).cells()[6].possibleValues()).toEqual([1, 5]);
			expect(grid.row(0).cells()[7].possibleValues()).toEqual([6, 8]);
			expect(grid.row(0).cells()[8].possibleValues()).toEqual([6, 8]);
		});
	});
}());
