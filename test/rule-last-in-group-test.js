/*global jsobj, describe, it, expect, beforeEach */
/*jslint plusplus: true */

(function () {
	"use strict";

	describe("rule-last-in-group member", function () {
		it("exists in jsobj namespace", function () {
			expect(jsobj.ruleLastInGroup).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof jsobj.ruleLastInGroup).toBe("function");
		});
	});

	describe("rule-last-in-group function", function () {
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

		it("does nothing to an empty grid", function () {
			var grid = new jsobj.Grid();

			jsobj.ruleLastInGroup(grid);

			expect(listSolved(grid).length).toBe(0);
		});

		it("solves for a given value when its 4 neighboring blocks each contain the value", function () {
			var grid = new jsobj.Grid(), solved;			//    012 345 678

			grid.hRow(0).cells()[7].setValue(5);			// 0  --- --- -5-
			grid.hRow(3).cells()[8].setValue(5);			// 1  --- --- ---            
			grid.hRow(6).cells()[0].setValue(5);			// 2  --- --- ---
			grid.hRow(7).cells()[3].setValue(5);
															// 3  --- --- --5
			jsobj.ruleLastInGroup(grid);					// 4  --- --- ---
															// 5  --- --- ---
			solved = listSolved(grid);
			expect(solved.length).toBe(5);					// 6  5-- --- ---
			expect(solved[4].row().name()).toBe('row 8');	// 7  --- 5-- ---
			expect(solved[4].col().name()).toBe('col 6');	// 8  --- --- X--
			expect(solved[4].value()).toBe(5);
		});

		it("solves for a given value when 2 neighbor blocks restrict it to one row with only one space left in the block", function () {
			var grid = new jsobj.Grid(), solved;			//    012 345 678

			grid.hRow(6).cells()[2].setValue(3);			// 0  --- --- ---
			grid.hRow(7).cells()[4].setValue(3);			// 1  --- --- ---
			grid.hRow(8).cells()[6].setValue(1);			// 2  --- --- ---
			grid.hRow(8).cells()[7].setValue(2);
															// 3  --- --- ---
			jsobj.ruleLastInGroup(grid);					// 4  --- --- ---
															// 5  --- --- ---
			solved = listSolved(grid);
			expect(solved.length).toBe(5);					// 6  --3 --- ---
			expect(solved[4].row().name()).toBe('row 8');	// 7  --- -3- ---
			expect(solved[4].col().name()).toBe('col 8');	// 8  --- --- 12X
			expect(solved[4].value()).toBe(3);
		});
	});
}());