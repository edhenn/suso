/*global suso, describe, it, expect, beforeEach, document */
/*jslint plusplus: true */

(function () {
	"use strict";

	describe("Preformatted view", function () {
		var grid = new suso.Grid(),
			ctrl,
			disp;

		it("returns result wrapped in <pre> tags", function () {
			ctrl = document.createElement("div");
			disp = new suso.views.Preformatted(grid, ctrl);
			expect(ctrl.innerHTML.substring(0, 6)).toBe('<pre>\n');
		});

		it("returns all dashes for an empty grid, formatted correctly", function () {
			ctrl = document.createElement("div");
			disp = new suso.views.Preformatted(grid, ctrl);
			expect(ctrl.innerHTML).toBe('<pre>\n' +
				"--- --- ---\n" +
				"--- --- ---\n" +
				"--- --- ---\n" +
				"\n" +
				"--- --- ---\n" +
				"--- --- ---\n" +
				"--- --- ---\n" +
				"\n" +
				"--- --- ---\n" +
				"--- --- ---\n" +
				"--- --- ---\n" +
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
			ctrl = document.createElement("div");
			disp = new suso.views.Preformatted(grid, ctrl);
			expect(ctrl.innerHTML).toBe('<pre>\n' +
				"123 456 789\n" +
				"456 789 123\n" +
				"789 123 456\n" +
				"\n" +
				"234 567 891\n" +
				"567 891 234\n" +
				"891 234 567\n" +
				"\n" +
				"345 678 912\n" +
				"678 912 345\n" +
				"912 345 678\n" +
				'</pre>');
		});

		it("creates Grid-Display element if no dom element passed in", function () {
			document.body.innerHTML = "";
			disp = new suso.views.Preformatted(grid);
			expect(document.body.innerHTML.match(/<div id=['"]Grid-Display['"]>/g).length).toBe(1);
		});

		it("has a createStep function", function () {
			disp = new suso.views.Preformatted(grid);
			expect(disp.createStep).toBeDefined();
			expect(typeof disp.createStep).toBe("function");
		});

		it("has a renderStep function", function () {
			disp = new suso.views.Preformatted(grid);
			expect(disp.renderStep).toBeDefined();
			expect(typeof disp.renderStep).toBe("function");
		});

		it("records and remembers solution steps", function () {
			var stepNum;
			disp = new suso.views.Preformatted(grid);
			stepNum = disp.createStep();
			disp.renderStep(stepNum);

			expect(stepNum).toBe(0);
		});
	});
}());