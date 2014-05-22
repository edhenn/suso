/*global jsobj */
/*jslint plusplus: true */

(function (jsobj) {
	"use strict";

	function Grid() {
		var blocks = [],	// 9 blocks of 9 cells each
			vrows = [],		// 9 vertical rows of 9 cells each
			hrows = [],		// 9 horizontal rows of 9 cells each
			rules,
			i,
			newCell,
			allgroups,
			gridState = 'init',
			solvedThisRound = 0,
			solvedTotal = 0,
			me = this;

		function cellUpdated() {
			solvedThisRound++;
			// only fire a grid update once the grid is ready - not during seeding
			if (gridState === 'ready') {
				me.trigger("update", newCell);
			}
		}

		// *** CREATE GRID OBJECT ***

		// create 9 blocks, vrows, hrows
		for (i = 0; i < 9; i++) {
			blocks.push(new jsobj.CellGroup('block', i, me));
			vrows.push(new jsobj.CellGroup('col', i, me));
			hrows.push(new jsobj.CellGroup('row', i, me));
		}

		// create 81 cells each tied to correct block, vrow, hrow
		for (i = 0; i < 81; i++) {
			newCell = new jsobj.Cell(this);
			newCell.setRowH(hrows[Math.floor(i / 9)]);		// every 9 consecutive cells make an hrow
			newCell.setRowV(vrows[i % 9]);					// every 9th cell belongs to the same vrow
			newCell.setBlock(blocks[Math.floor(i / 3) % 3 + Math.floor(i / 27) * 3]);	// every 3rd set of 3 consecutive cells up to 9 make a block
			newCell.on("update", cellUpdated);
		}

		gridState = 'unseeded';

		this.state = function () {
			return gridState;
		};

		this.rows = hrows;
		this.cols = vrows;

		this.vRow = function (index) {
			return vrows[index];
		};

		this.hRow = function (index) {
			return hrows[index];
		};

		this.block = function (index) {
			return blocks[index];
		};

		this.allGroups = function () {
			if (allgroups === undefined) {
				allgroups = hrows.concat(vrows).concat(blocks);
			}
			return allgroups;
		};

		this.addSeeds = function (seeds) {
			var row, col, seed;

			for (row = 0; row < seeds.length; row++) {
				for (col = 0; col < seeds[row].length; col++) {
					seed = seeds[row][col];
					if (seed !== undefined && typeof seed === 'number') {
						hrows[row].cells()[col].setValue(seed);
					}
				}
			}

			gridState = 'ready';
			return this;
		};

		this.solve = function () {
			var rule;

			if (solvedTotal > 0) {
				return;
			}

			// add rules to list - just a default rule for now, allow user to pass in rules later
			rules = [ jsobj.ruleLastInGroup ];

			// continually run all rules in the list until a full run causes no solutions.
			while (solvedThisRound > 0) {
				solvedTotal += solvedThisRound;
				solvedThisRound = 0;
				for (rule = 0; rule < rules.length; rule++) {
					rules[rule](me);
				}
			}

			gridState = (solvedTotal === 81 ? 'complete' : 'incomplete');
			return this;
		};
	}

	jsobj.Grid = function () {
		return jsobj.EventAware(new Grid());
	};
}(jsobj));