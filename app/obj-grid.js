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
			cellsSolved = 0,
			seedSolved = [],
			me = this;

		function cellUpdated() {
			cellsSolved++;
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

		this.seedSolved = seedSolved;

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
			var rule, progress = true, cell, possVal;

			if (gridState === 'complete' || gridState === 'incomplete') {
				return;
			}

			// initial pass to solve for cells with one remaining value after seeding
			for (cell = 0; cell < seedSolved.length; cell++) {
				possVal = seedSolved[cell].possibleValues();
				if (possVal.length === 1) {
					seedSolved[cell].setValue(possVal[0]);
				}
			}

			// add rules to list - just a default rule for now, allow user to pass in rules later
			rules = [ jsobj.ruleLastInGroup, jsobj.ruleRestrictedPossibleValue ];

			// continually run all rules in the list until a full run causes no progress.
			while (progress && cellsSolved !== 81) {
				progress = false;
				for (rule = 0; rule < rules.length && cellsSolved !== 81; rule++) {
					progress = progress || rules[rule](me);
				}
			}

			gridState = (cellsSolved === 81 ? 'complete' : 'incomplete');
			return this;
		};
	}

	jsobj.Grid = function () {
		return jsobj.EventAware(new Grid());
	};
}(jsobj));