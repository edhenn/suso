/*global suso, document */
/*jslint plusplus: true */

document.addEventListener("DOMContentLoaded", function () {
	"use strict";

	var grid = new suso.Grid(),
		grid_div = document.getElementById('gridspot'),
		report_div = document.getElementById('reportspot'),
		disp = new suso.views.InputGrid(grid, grid_div),
		rept = new suso.views.Report({
			grid: grid,
			gridView: disp,
			ctrl: report_div
		}),
		seeds_intermediate = [
			[1, 2, 3, 4, 5, 6, 7, 8, ],
		],
		seeds_diabolical = [];


});
