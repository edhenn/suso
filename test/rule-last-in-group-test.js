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
			var grid = new jsobj.Grid(), solved;		// --- --- -5-
														// --- --- ---
			grid.hRow(0).cells()[7].setValue(5);		// --- --- ---
			grid.hRow(3).cells()[8].setValue(5);
			grid.hRow(6).cells()[0].setValue(5);		// --- --- --5
			grid.hRow(7).cells()[3].setValue(5);		// --- --- ---
														// --- --- ---
			jsobj.ruleLastInGroup(grid);
														// 5-- --- ---
			solved = listSolved(grid);					// --- 5-- ---
			expect(solved.length).toBe(5);				// --- --- X--
			expect(solved[4].rowH().name()).toBe('row 8');
			expect(solved[4].rowV().name()).toBe('col 6');
			expect(solved[4].value()).toBe(5);
		});
	});
}());