/*global suso, describe, it, expect, beforeEach, document */
/*jslint plusplus: true */

(function () {
	"use strict";

	describe("Static-Grid view", function () {
		var grid = new suso.Grid(),
			ctrl,
			disp;

		xit("returns result wrapped in div.grid tags", function () {
			ctrl = document.createElement('div');
			disp = new suso.views.StaticGrid(grid, ctrl);
			expect(ctrl.innerHTML.substring(0, 18)).toBe('<div class="grid">');
		});

		xit("returns all dashes for an empty grid, formatted correctly", function () {
			ctrl = document.createElement('div');
			disp = new suso.views.StaticGrid(grid, ctrl);
			expect(ctrl.innerHTML).toBe('<pre>\n' +
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

		xit("returns full grid, formatted correctly", function () {
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
			ctrl = document.createElement('div');
			disp = new suso.views.StaticGrid(grid, ctrl);
			expect(ctrl.innerHTML).toBe('<pre>\n' +
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