/*global suso, document */
/*jslint plusplus: true */

(function (suso) {
	"use strict";

	if (suso.views === undefined) {
		suso.views = {};
	}

	suso.views.InputGrid = function (grid, ctrl) {
		var gridtag,
			gridbody,
			gridrow = "<div class='row'><span class='cell'>{0}</span><span class='cell'>{1}</span><span class='cell'>{2}</span>" +
				"<span class='cell'>{3}</span><span class='cell'>{4}</span><span class='cell'>{5}</span>" +
				"<span class='cell'>{6}</span><span class='cell'>{7}</span><span class='cell'>{8}</span></div>",
			row,
			col,
			styletag,
			styles = ".grid { display: table; border-top: solid 2px black; border-left: solid 2px black; }\n" +
				".row { display: table-row; border-bottom: solid 1px grey; }\n" +
				".row:nth-of-type(3n+0) .cell { border-bottom: solid 2px black; }\n" +
				".cell { width: 39px; height: 40px; display: table-cell; border-style: solid; border-color: grey; border-width: 0 1px 1px 0;" +
				"  text-align: center; vertical-align: middle; font-family: serif; }\n" +
				".cell:nth-of-type(3n+0) { border-right: solid 2px black; }\n" +
				".poss { font-size: 12px; line-height: 10px }\n" +
				".value { font-size: 22px; font-weight: bold; }\n" +
				".seed { color: tomato; }\n" +
				"#solve { margin: 30px 0; padding: 6px 12px; font-size: 14px; font-weight: 400; " +		// button styles
				"  border: solid 1px #ccc; border-radius: 4px; background-color: #fff; }\n" +			// borrowed from
				"#solve:focus { color: #333; background-color: #e6e6e6; border-color: #8c8c8c; }\n" +	// bootstrap
				"#solve:hover { color: #333; background-color: #e6e6e6; border-color: #adadad; }\n",
			steps = [],
			solvebtn;

		function repl(match, id) {
			var cell = grid.hRow(row).cells()[id],
				val = cell.value(),
				seed = cell.isSeed();

			if (val) {
				return "<span class='value" + (seed ? " seed" : "") + "'>" + val.toString() + "</span>";
			}
			return "<span class='poss'>" + cell.possibleValues().join(" ") + "</span>";
		}

		function display() {
			gridbody = "";
			for (row = 0; row < 9; row++) {
				gridbody += gridrow.replace(/\{([0-9])\}/g, repl);
				gridbody += "\n";
			}

			// display and refresh both just replace the entire display node with freshly generated results
			gridtag.innerHTML = gridbody;
		}

		function seedGrid() {
			var seeds = [], seedRow, val;
			for (row = 0; row < 9; row++) {
				seedRow = [];
				for (col = 0; col < 9; col++) {
					val = document.getElementById("c" + row.toString() + col.toString()).value;
					seedRow.push(val === "" ? null : parseInt(val, 10));
				}
				seeds.push(seedRow);
			}
			grid.addSeeds(seeds);
		}

		function solveClicked() {
			var solveBtn = document.getElementById("solve");
			solveBtn.removeEventListener("click", solveClicked);
			ctrl.removeChild(solveBtn);
			seedGrid();
			display();
			grid.solve();
		}

		function initialDisplay() {
			gridbody = "";
			for (row = 0; row < 9; row++) {
				gridbody += "<div class='row'>";
				for (col = 0; col < 9; col++) {
					gridbody += "<input id='c" + row.toString() + col.toString() + "'" +
						" class='cell seed value' maxlength='1'" +
						(row === 0 && col === 0 ? " autofocus" : "") +
						"/>";
				}
				gridbody += "</div>";
			}
			gridtag.innerHTML = gridbody;
		}

		this.createStep = function () {
			steps[steps.length] = gridtag.innerHTML;
			return steps.length - 1;
		};

		this.renderStep = function (step) {
			gridtag.innerHTML = steps[step];
		};

		this.grid = grid;
		this.ctrl = ctrl;

		if (ctrl === undefined) {
			ctrl = document.createElement("div");
			ctrl.setAttribute("id", "Grid-Display");
			document.body.appendChild(ctrl);
		}
		// append styles
		styletag = document.createElement("style");
		ctrl.appendChild(styletag);
		styletag.innerHTML = styles;
		// append grid
		gridtag = document.createElement("div");
		gridtag.setAttribute("class", "grid");
		ctrl.appendChild(gridtag);
		// append controls
		solvebtn = document.createElement("input");
		solvebtn.setAttribute("id", "solve");
		solvebtn.setAttribute("type", "button");
		solvebtn.setAttribute("value", "Solve!");
		ctrl.appendChild(solvebtn);
		solvebtn.addEventListener("click", solveClicked);

		grid.on("update", display);
		grid.on("report", display);

		return initialDisplay();
	};
}(suso));
