/*global jsobj */
/*jslint plusplus: true */

(function (jsobj) {
	"use strict";

	function Grid(seeds) {
		var blocks = [],	// 9 blocks of 9 cells each
			vrows = [],		// 9 vertical rows of 9 cells each
			hrows = [],		// 9 horizontal rows of 9 cells each
			i,
			newCell,
			cellnums = "created cells: ",
			allgroups,
			gridState = 'init',
			that = this;

		function cellUpdated(cell) {
			// only fire a grid update once the grid is ready - not during seeding
			if (gridState === 'ready') {
				that.trigger("update", cell);
			}
		}

		function newCellGroup(type, num) {
			var newGroup = new jsobj.CellGroup(type, num, that);
			newGroup.on("update", cellUpdated);
			return newGroup;
		}

		// *** CREATE GRID OBJECT ***

		// create 9 blocks, vrows, hrows
		for (i = 0; i < 9; i++) {
			blocks.push(newCellGroup('block', i));
			vrows.push(newCellGroup('col', i));
			hrows.push(newCellGroup('row', i));
		}

		// create 81 cells each tied to correct block, vrow, hrow
		for (i = 0; i < 81; i++) {
			newCell = new jsobj.Cell(this);
			newCell.setRowH(hrows[Math.floor(i / 9)]);		// every 9 consecutive cells make an hrow
			newCell.setRowV(vrows[i % 9]);					// every 9th cell belongs to the same vrow
			newCell.setBlock(blocks[Math.floor(i / 3) % 3 + Math.floor(i / 27) * 3]);	// every 3rd set of 3 consecutive cells up to 9 make a block
			cellnums += newCell.id().toString() + ',';
		}

		gridState = 'unseeded';

		this.state = function () {
			return gridState;
		};

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
		};
	}

	jsobj.Grid = function (seeds) {
		return jsobj.EventAware(new Grid(seeds));
	};
}(jsobj));