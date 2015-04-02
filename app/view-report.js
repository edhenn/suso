/*global jsobj, document */
/*jslint plusplus: true */

(function (jsobj) {
	"use strict";

	if (jsobj.views === undefined) {
		jsobj.views = {};
	}

	jsobj.views.Report = function (grid, ctrl) {
		var reportContainer,
			styletag,
			styles = '.report-container { border: solid 2px blue; margin-top: 1em; width: 50%; }\n' +
				'.report { border-top: solid 1px grey; margin: 2px }\n',
			steps = [];

		function display(reportArg, note) {
			// add a node to report container for every call to display
			var report = document.createElement('div');
			report.setAttribute('class', 'report');
			report.setAttribute('id', 'step' + steps.length);
			reportContainer.appendChild(report);
			if (typeof reportArg === "string") {
				report.innerHTML = reportArg;
			} else if (typeof reportArg === "object" && reportArg.hasOwnProperty("coords")) {	// Cell
				report.innerHTML = "cell action: " +
					reportArg.coords() +
					(reportArg.value() === undefined ? "" : (" = " + reportArg.value().toString())) +
					(note === undefined ? "" : (" -- " + note));
			} else {
				report.innerHTML = note;
			}
			steps.push(report);
		}

		this.grid = grid;
		this.ctrl = ctrl;

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