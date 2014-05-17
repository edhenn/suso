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

		});

	});

}());