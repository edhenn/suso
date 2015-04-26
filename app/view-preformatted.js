/*global suso, document */
/*jslint plusplus: true */

(function (suso) {
	"use strict";

	if (suso.views === undefined) {
		suso.views = {};
	}

	suso.views.Preformatted = function (grid, ctrl) {
		var pretag,
			prebody,
			prerow = "{0}{1}{2} {3}{4}{5} {6}{7}{8}",
			row,
			steps = [];

		function repl(match, id) {
			var val = grid.row(row).cells()[id].value();
			return val === undefined ? "-" : val.toString();
		}

		function display() {
			prebody = "\n";
			for (row = 0; row < 9; row++) {
				prebody += prerow.replace(/\{([0-9])\}/g, repl);
				prebody += "\n";
				if (row === 2 || row === 5) {
					prebody += "\n";
				}
			}

			// display and refresh both just replace the entire display node with freshly generated results
			pretag.innerHTML = prebody;
		}

		this.createStep = function () {
			steps[steps.length] = pretag.innerHTML;
			return steps.length - 1;
		};

		this.renderStep = function (step) {
			pretag.innerHTML = steps[step];
		};

		this.grid = grid;
		this.ctrl = ctrl;

		if (ctrl === undefined) {
			ctrl = document.createElement("div");
			ctrl.setAttribute("id", "Grid-Display");
			document.body.appendChild(ctrl);
		}
		pretag = document.createElement("pre");
		ctrl.appendChild(pretag);

		grid.on("update", display);

		return display();
	};
}(suso));
