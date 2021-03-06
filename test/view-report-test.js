/*global suso, describe, it, expect, document */
/*jslint plusplus: true */
/* eslint no-unused-vars: 0 */

(function () {
	"use strict";

	describe("Report view", function () {
		var grid = new suso.Grid(),
			ctrl,
			disp;

		it("when called without a ctrl, returns result wrapped in div with id Report-Display", function () {
			disp = new suso.views.Report({ grid: grid });
			expect(document.body.innerHTML.indexOf("<div id=\"Report-Display\">")).toBeGreaterThan(-1);
		});

		it("when called with a ctrl, returns a div with class report-container", function () {
			ctrl = document.createElement("div");
			disp = new suso.views.Report({ grid: grid, ctrl: ctrl });
			expect(ctrl.innerHTML.indexOf("<div class=\"report-container\">")).toBeGreaterThan(-1);
		});

		it("creates a div to conatin reports", function () {
			ctrl = document.createElement("div");
			disp = new suso.views.Report({ grid: grid, ctrl: ctrl });
			expect(ctrl.innerHTML.indexOf("<div class=\"report-container\"><span id=\"report-title\" class=\"title\">Report</span></div>")).toBeGreaterThan(-1);
		});

		it("creates divs inside container for each report", function () {
			ctrl = document.createElement("div");
			disp = new suso.views.Report({ grid: grid, ctrl: ctrl });
			grid.addSeeds([[1]]);
			expect(ctrl.innerHTML.indexOf("<div class=\"report-container\"><span id=\"report-title\" class=\"title\">Report</span><div class=\"report\"")).toBeGreaterThan(-1);
		});

		it("creates Report-Display element if no dom element passed in", function () {
			document.body.innerHTML = "";
			disp = new suso.views.Report({ grid: grid });
			expect(document.body.innerHTML.match(/<div id=['"]Report-Display['"]>/g).length).toBe(1);
		});
	});
}());
