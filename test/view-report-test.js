/*global jsobj, describe, it, expect, beforeEach, document */
/*jslint plusplus: true */

(function () {
	"use strict";

	describe("Report view", function () {
		var grid = new jsobj.Grid(),
			ctrl,
			disp;

		it("when called without a ctrl, returns result wrapped in div with id Report-Display", function () {
			disp = new jsobj.views.Report(grid);
			expect(document.body.innerHTML.indexOf('<div id="Report-Display">')).toBeGreaterThan(-1);
		});

		it("when called with a ctrl, returns a div with class report-container", function () {
			ctrl = document.createElement('div');
			disp = new jsobj.views.Report(grid, ctrl);
			expect(ctrl.innerHTML.indexOf('<div class="report-container">')).toBeGreaterThan(-1);
		});

		it("creates a div to conatin reports", function () {
			ctrl = document.createElement('div');
			disp = new jsobj.views.Report(grid, ctrl);
			expect(ctrl.innerHTML.indexOf('<div class="report-container"><h1>Report</h1></div>')).toBeGreaterThan(-1);
		});

		it("creates divs inside container for each report", function () {
			ctrl = document.createElement('div');
			disp = new jsobj.views.Report(grid, ctrl);
			grid.addSeeds([[1]]);
			expect(ctrl.innerHTML.indexOf('<div class="report-container"><h1>Report</h1><div class="report"')).toBeGreaterThan(-1);
		});
	});
}());