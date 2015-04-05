/*global suso, document */
/*jslint plusplus: true */

(function (suso) {
	"use strict";

	if (suso.views === undefined) {
		suso.views = {};
	}

	suso.views.Report = function (settings) {	// grid, ctrl, gridView
		var reportContainer,
			styletag,
			styles = ".report-container { border: solid 2px blue; margin-top: 1em; width: 100%; }\n" +
				".report { border-top: solid 1px grey; margin: 2px }\n",
			ready = false,	// ready indicates the report is complete and can start displaying history
			gridView = settings.gridView;

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

			gridView.renderStep(step);
		}

		function display(reportArg, note) {
			var report;

			// add a node to report container for every call to display
			report = document.createElement("div");
			report.setAttribute("class", "report");
			reportContainer.appendChild(report);

			// if supported, create a step-point in grid-view to remember its state later
			if (gridView !== undefined && gridView.hasOwnProperty("createStep")) {
				report.setAttribute("id", "step" + gridView.createStep());
				report.addEventListener("mouseover", remember);
			}

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

		this.grid = settings.grid;
		this.ctrl = settings.ctrl;

		// set grid step awareness

		if (this.ctrl === undefined) {
			this.ctrl = document.createElement("div");
			this.ctrl.setAttribute("id", "Report-Display");
			document.body.appendChild(this.ctrl);
		}
		// append styles
		styletag = document.createElement("style");
		this.ctrl.appendChild(styletag);
		styletag.innerHTML = styles;
		// append report container
		reportContainer = document.createElement("div");
		reportContainer.setAttribute("class", "report-container");
		this.ctrl.appendChild(reportContainer);
		reportContainer.innerHTML = "<h1>Report</h1>";

		this.grid.on("report", display);

		//return display("grid initialized");
	};
}(suso));
