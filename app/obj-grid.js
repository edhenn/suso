/*global suso */
/*jslint plusplus: true */

(function (suso) {
	"use strict";

	function Grid() {
		var blocks = [],	// 9 blocks of 9 cells each
			cols = [],		// 9 vertical rows of 9 cells each
			rows = [],		// 9 horizontal rows of 9 cells each
			rules,
			i,
			newCell,
			allgroups,
			gridState = "init",
			cellsSolved = 0,
			seedSolved = [],
			me = this;

		function cellUpdated(cell, note) {
			cellsSolved++;
			// only fire a grid update once the grid is ready - not during seeding
			if (gridState === "ready") {
				me.trigger("update", me);
				me.trigger("report", cell, note);
			}
		}

		function setup() {
			// *** CREATE GRID OBJECT ***

			// create 9 blocks, cols, rows
			for (i = 0; i < 9; i++) {
				blocks.push(new suso.House("block", i, me));
				cols.push(new suso.House("col", i, me));
				rows.push(new suso.House("row", i, me));
			}

			// create 81 cells each tied to correct block, vrow, hrow
			for (i = 0; i < 81; i++) {
				newCell = new suso.Cell(me);
				newCell.on("update", cellUpdated);
				newCell.setHouse(rows[Math.floor(i / 9)]);		// every 9 consecutive cells make an hrow
				newCell.setHouse(cols[i % 9]);					// every 9th cell belongs to the same vrow
				newCell.setHouse(blocks[Math.floor(i / 3) % 3 + Math.floor(i / 27) * 3]);	// every 3rd set of 3 consecutive cells up to 9 make a block
			}

			gridState = "unseeded";
		}

		function release() {
			// *** UNSUBSCRIBE ALL GRID EVENTS ***

			// unsubscribe to cell update events
			rows.forEach(function (row) {
				row.cells().forEach(function (cell) {
					cell.off("update", cellUpdated);
					cell.release();
				});
			});

			// release rules
			rules = [];
		}

		this.seedSolved = seedSolved;

		this.state = function () {
			return gridState;
		};

		this.rows = rows;
		this.cols = cols;

		this.vRow = function (index) {
			return cols[index];
		};

		this.hRow = function (index) {
			return rows[index];
		};

		this.block = function (index) {
			return blocks[index];
		};

		this.allGroups = function () {
			if (allgroups === undefined) {
				allgroups = rows.concat(cols).concat(blocks);
			}
			return allgroups;
		};

		this.addSeeds = function (seeds) {
			var row, col, seed;

			if (gridState !== "unseeded") {
				return this;
			}

			for (row = 0; row < seeds.length; row++) {
				for (col = 0; col < seeds[row].length; col++) {
					seed = seeds[row][col];
					if (seed !== undefined && typeof seed === "number") {
						rows[row].cells()[col].setValue(seed);
					}
				}
			}

			gridState = "ready";
			me.trigger("report", me, "grid seeded");
			return this;
		};

		this.solve = function () {
			var rule, progress = true, cell, possVal;

			if (gridState === "complete" || gridState === "incomplete") {
				return this;
			}

			me.trigger("start", me);

			// initial pass to solve for cells with one remaining value after seeding
			for (cell = 0; cell < seedSolved.length; cell++) {
				possVal = seedSolved[cell].possibleValues();
				if (possVal.length === 1) {
					seedSolved[cell].setValue(possVal[0], "one remaining value after seeding");
				}
			}

			// add rules to list - just a default rule for now, allow user to pass in rules later
			rules = [
				suso.rules.lastInGroup,
				suso.rules.restrictedPossibleValue,
				suso.rules.pairs,
				suso.rules.hiddenpairs,
				suso.rules.triples
			];
			// xwing http://www.learn-sudoku.com/x-wing.html
			// ywing http://www.learn-sudoku.com/xy-wing.html (like a naked triple)

			// continually run all rules in the list until a full run causes no progress.
			while (progress && cellsSolved !== 81) {
				progress = false;
				for (rule = 0; rule < rules.length && cellsSolved !== 81; rule++) {
					progress = progress || rules[rule](me);
				}
			}

			gridState = (cellsSolved === 81 ? "complete" : "incomplete");
			me.trigger("report", me, "grid " + gridState);
			me.trigger("finish", me);

			// release resources
			release();

			return this;
		};

		setup();
	}

	suso.Grid = function () {
		return new suso.EventAware(new Grid());
	};
}(suso));
