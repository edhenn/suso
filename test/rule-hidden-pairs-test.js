/*global suso, describe, it, expect, beforeEach */
/*jslint plusplus: true */

(function () {
	"use strict";

	describe("rule-hidden-pairs member", function () {
		it("exists in suso namespace", function () {
			expect(suso.rules.hiddenpairs).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof suso.rules.hiddenpairs).toBe("function");
		});
	});

	describe("rule-hidden-pairs function", function () {
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

			suso.rules.hiddenpairs(grid);

			expect(listSolved(grid).length).toBe(0);
		});

		it("returns false when it does nothing", function () {
			var grid = new suso.Grid(), result = null;

			result = suso.rules.hiddenpairs(grid);

			expect(result).toBe(false);
		});

		it("removes extraneous possible values from hidden pair in a row", function () {
			var grid = new suso.Grid(),
				progress;								//    012 345 678

			grid.row(1).cells()[8].setValue(4);			// 0  --- --- ---
			grid.row(2).cells()[8].setValue(5);			// 1  --- --- --4
			grid.row(4).cells()[0].setValue(1);			// 2  --- --- --5
			grid.row(4).cells()[1].setValue(2);
			grid.row(4).cells()[5].setValue(6);			// 3  --- --- ---
			grid.row(4).cells()[6].setValue(7);			// 4  12- --6 78- <- hidden pair 4,5 clears poss vals 3,9 from cells 4,5
			grid.row(4).cells()[7].setValue(8);			// 5  --- --- ---
			grid.row(6).cells()[2].setValue(4);
			grid.row(7).cells()[2].setValue(5);			// 6  --4 --- ---
														// 7  --5 --- ---
			progress = suso.rules.hiddenpairs(grid);	// 8  --- --- ---
			expect(progress).toBe(true);
			expect(grid.row(4).cells()[2].possibleValues()).toEqual([3, 9]);
			expect(grid.row(4).cells()[3].possibleValues()).toEqual([4, 5]);
			expect(grid.row(4).cells()[4].possibleValues()).toEqual([4, 5]);
			expect(grid.row(4).cells()[8].possibleValues()).toEqual([3, 9]);
		});

		it("does nothing when 2 different pairs of possible values exist in a group", function () {
			var grid = new suso.Grid(),
				progress;								//    012 345 678

			grid.row(0).cells()[0].setValue(1);			// 0  123 --- ---
			grid.row(0).cells()[1].setValue(2);			// 1  --- --- ---  <-- cells 0,1,2 should have 5/6, 4/6, 4/5 as poss values.  no pairs.
			grid.row(0).cells()[2].setValue(3);			// 2  789 --- ---
			grid.row(2).cells()[0].setValue(7);
			grid.row(2).cells()[1].setValue(8);			// 3  456 --- ---
			grid.row(2).cells()[2].setValue(9);			// 4  --- --- ---
			grid.row(3).cells()[0].setValue(4);			// 5  --- --- ---
			grid.row(3).cells()[1].setValue(5);
			grid.row(3).cells()[2].setValue(6);			// 6  --- --- ---
														// 7  --- --- ---
			progress = suso.rules.pairs(grid);			// 8  --- --- ---

			expect(progress).toBe(false);
			expect(grid.row(1).cells()[0].possibleValues()).toEqual([5, 6]);
			expect(grid.row(1).cells()[1].possibleValues()).toEqual([4, 6]);
			expect(grid.row(1).cells()[2].possibleValues()).toEqual([4, 5]);
		});
	});

	describe("generalized hidden sets logic", function () {
		var house, cells = [], gridStub = {
			st: "init",
			state: function () { return this.st; },
			allGroups: function () { return [ house ]; }
		};

		function possvalCount() {
			var possvals = 0;
			cells.forEach(function (cell) {
				possvals += cell.possibleValues().length;
			});
			return possvals;
		}

		beforeEach(function () {
			var i, cell;

			cells = [];
			house = new suso.House("row", 0, gridStub);

			for (i = 0; i < 9; i++) {
				cell = new suso.Cell(gridStub);
				cells.push(cell);
				house.addCell(cell);
			}
		});

		it("does nothing when no hidden sets exist & no cells solved", function () {
			var progress;

			progress = suso.rules.hiddenpairs(gridStub);

			expect(progress).toBe(false);
			expect(possvalCount()).toBe(9 * 9);
		});

		it("does nothing when all cells are solved", function () {
			var progress;

			cells.forEach(function (cell, idx) {
				cell.setValue(idx + 1);
			});

			progress = suso.rules.hiddenpairs(gridStub);

			expect(progress).toBe(false);
			expect(possvalCount()).toBe(0);
		});
	});
}());
