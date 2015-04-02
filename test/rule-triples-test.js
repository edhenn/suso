/*global jsobj, describe, it, xit, expect, beforeEach */
/*jslint plusplus: true */

(function () {
	"use strict";

	describe("rule-triples member", function () {
		it("exists in jsobj namespace", function () {
			expect(jsobj.rules.triples).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof jsobj.rules.triples).toBe("function");
		});
	});

	describe("rule-triples function", function () {
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

		function arraysAreEqual(a, b) {

		}

		it("does nothing to an empty grid", function () {
			var grid = new jsobj.Grid(), result = null;

			result = jsobj.rules.triples(grid);

			expect(listSolved(grid).length).toBe(0);
		});

		it("returns false when it does nothing", function () {
			var grid = new jsobj.Grid(), result = null;

			result = jsobj.rules.triples(grid);

			expect(result).toBe(false);
		});

		it("removes possible values from a row when three cells in row have same triplet of possible values", function () {
			var grid = new jsobj.Grid(),
				progress, solved, poss;						//    012 345 678

			grid.hRow(0).cells()[2].setValue(7);			// 0  --7 234 ---	<- this row should not have 1,5,9 in last 2 cells
			grid.hRow(0).cells()[3].setValue(2);			// 1  6-- --- ---
			grid.hRow(0).cells()[4].setValue(3);			// 2  8-- --- ---
			grid.hRow(0).cells()[5].setValue(4);
			grid.hRow(1).cells()[0].setValue(6);			// 3  -6- --- -51
			grid.hRow(2).cells()[0].setValue(8);			// 4  -8- --- ---
			grid.hRow(3).cells()[1].setValue(6);			// 5  --- --- ---
			grid.hRow(3).cells()[7].setValue(5);
			grid.hRow(3).cells()[8].setValue(1);			// 6  --- --- 6--
			grid.hRow(4).cells()[1].setValue(8);			// 7  --- --- 8--
			grid.hRow(6).cells()[6].setValue(6);			// 8  --- --- ---
			grid.hRow(7).cells()[6].setValue(8);

			progress = jsobj.rules.triples(grid);

			expect(progress).toBe(true);
			expect(grid.hRow(0).cells()[0].possibleValues()).toEqual([1, 5, 9]);
			expect(grid.hRow(0).cells()[1].possibleValues()).toEqual([1, 5, 9]);
			expect(grid.hRow(0).cells()[6].possibleValues()).toEqual([1, 5, 9]);
			expect(grid.hRow(0).cells()[7].possibleValues()).toEqual([6, 8]);
			expect(grid.hRow(0).cells()[8].possibleValues()).toEqual([6, 8]);
		});

		it("removes possible values from a row when three cells in row share same triplet of possible values in three pairs", function () {
			var grid = new jsobj.Grid(),
				progress, solved, poss;						//    012 345 678

			grid.hRow(0).cells()[2].setValue(7);			// 0  --7 234 ---	<- this row should not have 1,5,9 in last 2 cells
			grid.hRow(0).cells()[3].setValue(2);			// 1  6-- --- ---
			grid.hRow(0).cells()[4].setValue(3);			// 2  8-- --- ---
			grid.hRow(0).cells()[5].setValue(4);
			grid.hRow(1).cells()[0].setValue(6);			// 3  -6- --- -51
			grid.hRow(2).cells()[0].setValue(8);			// 4  -8- --- ---
			grid.hRow(3).cells()[1].setValue(6);			// 5  15- --- 9--
			grid.hRow(3).cells()[7].setValue(5);
			grid.hRow(3).cells()[8].setValue(1);			// 6  --- --- 6--
			grid.hRow(4).cells()[1].setValue(8);			// 7  --- --- 8--
			grid.hRow(5).cells()[0].setValue(1);			// 8  --- --- ---
			grid.hRow(5).cells()[1].setValue(5);
			grid.hRow(5).cells()[6].setValue(9);
			grid.hRow(6).cells()[6].setValue(6);
			grid.hRow(7).cells()[6].setValue(8);

			progress = jsobj.rules.triples(grid);

			expect(progress).toBe(true);
			expect(grid.hRow(0).cells()[0].possibleValues()).toEqual([5, 9]);
			expect(grid.hRow(0).cells()[1].possibleValues()).toEqual([1, 9]);
			expect(grid.hRow(0).cells()[6].possibleValues()).toEqual([1, 5]);
			expect(grid.hRow(0).cells()[7].possibleValues()).toEqual([6, 8]);
			expect(grid.hRow(0).cells()[8].possibleValues()).toEqual([6, 8]);
		});
	});
}());