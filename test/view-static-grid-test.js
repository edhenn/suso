/*global suso, describe, it, expect, beforeEach, document, xit */
/*jslint plusplus: true */

(function () {
	"use strict";

	describe("Static-Grid view", function () {
		var grid = new suso.Grid(),
			ctrl,
			disp,
			regex;

		it("returns result wrapped in div.grid tags", function () {
			ctrl = document.createElement("div");
			disp = new suso.views.StaticGrid(grid, ctrl);
			expect(ctrl.innerHTML.indexOf('<div class="grid"><div class="row"><span class="cell"><span class="poss">1</span>') > -1).toBe(true);
		});

		it("returns all possible values for an empty grid", function () {
			ctrl = document.createElement("div");
			disp = new suso.views.StaticGrid(grid, ctrl);
			expect(ctrl.innerHTML.match(/<span class="poss">\d<\/span>/g).length).toBe(9*9*9);
		});

		it("returns seeded grid with values in correct order", function () {
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
			ctrl = document.createElement("div");
			disp = new suso.views.StaticGrid(grid, ctrl);
			regex = new RegExp(
				"1.*2.*3.*4.*5.*6.*7.*8.*9.*\n.*" +
				"4.*5.*6.*7.*8.*9.*1.*2.*3.*\n.*" +
				"7.*8.*9.*1.*2.*3.*4.*5.*6.*\n.*" +
				"2.*3.*4.*5.*6.*7.*8.*9.*1.*\n.*" +
				"5.*6.*7.*8.*9.*1.*2.*3.*4.*\n.*" +
				"8.*9.*1.*2.*3.*4.*5.*6.*7.*\n.*" +
				"3.*4.*5.*6.*7.*8.*9.*1.*2.*\n.*" +
				"6.*7.*8.*9.*1.*2.*3.*4.*5.*\n.*" +
				"9.*1.*2.*3.*4.*5.*6.*7.*8"
				);
			expect(regex.test(ctrl.innerHTML)).toBe(true);
		});
	});
}());