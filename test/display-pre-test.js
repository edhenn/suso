/*global jsobj, describe, it, expect, beforeEach */
/*jslint plusplus: true */

(function () {
	"use strict";

	describe("displayPre function", function () {
		var grid = new jsobj.Grid(),
			disp = jsobj.displayPre(grid);

		it("returns result wrapped in <pre> tags", function () {
			expect(disp.substring(0, 6)).toBe('<pre>\n');
		});

		it("returns all dashes for an empty grid, formatted correctly", function () {
			expect(disp).toBe('<pre>\n' +
				'--- --- ---\n' +
				'--- --- ---\n' +
				'--- --- ---\n' +
				'\n' +
				'--- --- ---\n' +
				'--- --- ---\n' +
				'--- --- ---\n' +
				'\n' +
				'--- --- ---\n' +
				'--- --- ---\n' +
				'--- --- ---\n' +
				'</pre>');
		});

		it("returns full grid, formatted correctly", function () {
			grid.addSeeds([
				[1, 2, 3, 4, 5, 6, 7, 8, 9],
				[4, 5, 6, 7, 8, 9, 1, 2, 3],
				[7, 8, 9, 1, 2, 3, 4, 5, 6],
				[2, 3, 4, 5, 6, 7, 8, 9, 1],
				[5, 6, 7, 8, 9, 1, 2, 3, 4],
				[8, 9, 1, 2, 3, 4, 5, 6, 7],
				[3, 4, 5, 6, 7, 8, 9, 1, 2],
				[6, 7, 8, 9, 1, 2, 3, 4, 5],
				[9, 1, 2, 3, 4, 5, 6, 7, 8]
			]);

			expect(jsobj.displayPre(grid)).toBe('<pre>\n' +
				'123 456 789\n' +
				'456 789 123\n' +
				'789 123 456\n' +
				'\n' +
				'234 567 891\n' +
				'567 891 234\n' +
				'891 234 567\n' +
				'\n' +
				'345 678 912\n' +
				'678 912 345\n' +
				'912 345 678\n' +
				'</pre>');
		});
	});
}());