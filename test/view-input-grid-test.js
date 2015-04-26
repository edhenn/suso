/*global suso, describe, it, expect, document */
/*jslint plusplus: true */

(function () {
	"use strict";

	describe("Input-Grid view", function () {
		var grid = new suso.Grid(),
			ctrl,
			disp;

		it("returns result with one div.grid tag", function () {
			ctrl = document.createElement("div");
			disp = new suso.views.InputGrid(grid, ctrl);
			expect(ctrl.innerHTML.match(/<div class="grid">/g).length).toBe(1);
		});

		it("returns result with one style tag", function () {
			ctrl = document.createElement("div");
			disp = new suso.views.InputGrid(grid, ctrl);
			expect(ctrl.innerHTML.match(/<style>/g).length).toBe(1);
		});

		it("returns 9x9 input controls for an empty grid", function () {
			ctrl = document.createElement("div");
			disp = new suso.views.InputGrid(grid, ctrl);
			expect(ctrl.innerHTML.match(/<input id=['"]c\d\d['"] ['"a-z1\/= ]*>/g).length).toBe(9 * 9);
		});

		it("returns 1 input control solve button for an empty grid", function () {
			ctrl = document.createElement("div");
			disp = new suso.views.InputGrid(grid, ctrl);
			expect(ctrl.innerHTML.match(/<input id=['"]solve['"] type=['"]button['"][ a-zA-Z!='"]*>/g).length).toBe(1);
		});

		it("creates Grid-Display element if no dom element passed in", function () {
			document.body.innerHTML = "";
			disp = new suso.views.InputGrid(grid);
			expect(document.body.innerHTML.match(/<div id=['"]Grid-Display['"]>/g).length).toBe(1);
		});

		it("has a createStep function", function () {
			disp = new suso.views.InputGrid(grid);
			expect(disp.createStep).toBeDefined();
			expect(typeof disp.createStep).toBe("function");
		});

		it("has a renderStep function", function () {
			disp = new suso.views.InputGrid(grid);
			expect(disp.renderStep).toBeDefined();
			expect(typeof disp.renderStep).toBe("function");
		});

		it("records and remembers solution steps", function () {
			var stepNum;
			disp = new suso.views.InputGrid(grid);
			stepNum = disp.createStep();
			disp.renderStep(stepNum);

			expect(stepNum).toBe(0);
		});
	});
}());
