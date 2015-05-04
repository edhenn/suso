/*global suso, document, location */
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
		seeds_solved = [
			[  ,  ,  ,  ,  , 1,  , 8,  ],
			[ 8,  ,  , 5, 3,  ,  ,  ,  ],
			[  ,  , 6,  , 2,  , 4,  ,  ],
			[ 6,  ,  , 3,  , 9,  , 7,  ],
			[  , 3, 8,  ,  ,  , 2, 1,  ],
			[  , 1,  , 8,  , 2,  ,  , 3],
			[  ,  , 9,  , 8,  , 5,  ,  ],
			[  ,  ,  ,  , 7, 3,  ,  , 4],
			[  , 7,  , 1,  ,  ,  ,  ,  ]
		],
		seeds_unsolved = [
			[  ,  ,  ,  , 5,  ,  ,  ,  ],
			[  , 3,  , 2, 8, 6,  , 1,  ],
			[  ,  , 5, 7,  , 4, 2,  ,  ],
			[  , 4, 6,  ,  ,  , 8, 2,  ],
			[ 8, 7,  ,  ,  ,  ,  , 5, 3],
			[  , 2, 1,  ,  ,  , 6, 7,  ],
			[  ,  , 2, 1,  , 8, 7,  ,  ],
			[  , 9,  , 4, 2, 5,  , 6,  ],
			[  ,  ,  ,  , 6,  ,  ,  ,  ]
		],
		buttonDiv = document.getElementById('buttons');

	function showVersion() {
		document.getElementById('version').innerHTML = suso.version;
	}

	function createButton(id, value) {
		var btn = document.createElement("input");

		btn.setAttribute("type", "button");
		btn.setAttribute("class", "seedbtn");
		btn.setAttribute("id", id);
		btn.setAttribute("value", value);

		return btn;
	}

	function seedGrid(seeds) {
		var row, col, ctrl;

		for (row = 0; row < 9; row++) {
			for (col = 0; col < 9; col++) {
				ctrl = document.getElementById('c' + row.toString() + col.toString());
				if (seeds.length > row && seeds[row].length > col && seeds[row][col] !== undefined) {
					ctrl.value = seeds[row][col];
				} else {
					ctrl.value = '';
				}
			}
		}
	}

	function drawResetButton() {
		var resetBtn;

		buttonDiv.innerHTML = "";
		resetBtn = createButton('reset', 'Reset');
		buttonDiv.appendChild(resetBtn);

		resetBtn.addEventListener("click", function () {
			location.reload();
		});
	}

	function drawSeedButtons() {
		var seed_solved, seed_unsolved;

		buttonDiv.innerHTML = "";
		seed_solved = createButton('seed-solved', 'seed complete');
		seed_unsolved = createButton('seed-unsolved', 'seed incomplete');
		buttonDiv.appendChild(seed_solved);
		buttonDiv.appendChild(document.createElement("br"));
		buttonDiv.appendChild(seed_unsolved);

		seed_solved.addEventListener("click", function () {
			if (grid.state() !== 'unseeded') {
				return;
			}
			seedGrid(seeds_solved);
			drawResetButton();
		});

		seed_unsolved.addEventListener("click", function () {
			if (grid.state() !== 'unseeded') {
				return;
			}
			seedGrid(seeds_unsolved);
			drawResetButton();
		});
	}

	showVersion();
	drawSeedButtons();
});
