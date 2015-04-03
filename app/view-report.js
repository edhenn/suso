/*global jsobj, document, alert */
/*jslint plusplus: true */

(function (jsobj) {
	"use strict";

	if (jsobj.views === undefined) {
		jsobj.views = {};
	}

	jsobj.views.Report = function (grid, ctrl) {
		var reportContainer,
			styletag,
			styles = '.report-container { border: solid 2px blue; margin-top: 1em; width: 100%; }\n' +
				'.report { border-top: solid 1px grey; margin: 2px }\n',
			ready = false;	// ready indicates the report is complete and can start displaying history

		function remember() {
			var step;

			if (!ready) {
				return;
			}

			if (this.id.indexOf("step") === 0) {
				step = parseInt(this.id.substring(4), 10);
			}

			if (isNaN(step)) {
				return;
			}

			grid.renderStep(step);
		}

		function display(reportArg, note) {
			var report, step;

			// create a grid step-point to remember its state later
			if (grid.hasOwnProperty("createStep")) {
				step = grid.createStep();
			}

			// add a node to report container for every call to display
			report = document.createElement('div');
			report.setAttribute('class', 'report');
			if (step !== undefined) {
				report.setAttribute('id', 'step' + step);
				report.addEventListener('click', remember);
			}
			reportContainer.appendChild(report);
			if (typeof reportArg === "string") {
				report.innerHTML = reportArg;
			} else if (typeof reportArg === "object" && reportArg.hasOwnProperty("coords")) {	// Cell
				report.innerHTML = "cell action: " +
					reportArg.coords() +
					(reportArg.value() === undefined ? "" : (" = " + reportArg.value().toString())) +
					(note === undefined ? "" : (" -- " + note));
			} else if (typeof reportArg === "object" && reportArg.hasOwnProperty("state")) {	// Grid
				report.innerHTML = note;
				if (reportArg.state() === "complete" || reportArg.state() === "incomplete") {
					ready = true;
				}
			} else {
				report.innerHTML = note;
			}
		}

		this.grid = grid;
		this.ctrl = ctrl;

		// set grid step awareness

		if (ctrl === undefined) {
			ctrl = document.createElement('div');
			ctrl.setAttribute('id', 'Report-Display');
			document.body.appendChild(ctrl);
		}
		// append styles
		styletag = document.createElement('style');
		ctrl.appendChild(styletag);
		styletag.innerHTML = styles;
		// append report container
		reportContainer = document.createElement('div');
		reportContainer.setAttribute('class', 'report-container');
		ctrl.appendChild(reportContainer);
		reportContainer.innerHTML = "<h1>Report</h1>";

		grid.on("report", display);

		//return display("grid initialized");
	};
}(jsobj));