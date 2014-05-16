/*global jsobj */
/*jslint plusplus: true */

(function (jsobj) {
	"use strict";

	jsobj.Grid = function (seeds) {
		var blocks = [],	// 9 blocks of 9 cells each
			vrows = [],		// 9 vertical rows of 9 cells each
			hrows = [],		// 9 horizontal rows of 9 cells each
			i,
			newCell,
			cellnums = "created cells: ",
			allgroups;

		// create 9 blocks, vrows, hrows
		for (i = 0; i < 9; i++) {
			blocks.push(new jsobj.CellGroup('block ' + i.toString()));
			vrows.push(new jsobj.CellGroup('col ' + i.toString()));
			hrows.push(new jsobj.CellGroup('row ' + i.toString()));
		}

		// create 81 cells each tied to correct block, vrow, hrow
		for (i = 0; i < 81; i++) {
			newCell = new jsobj.Cell();
			newCell.setRowH(hrows[Math.floor(i / 9)]);		// every 9 consecutive cells make an hrow
			newCell.setRowV(vrows[i % 9]);					// every 9th cell belongs to the same vrow
			newCell.setBlock(blocks[Math.floor(i / 3) % 3 + Math.floor(i / 27) * 3]);	// every 3rd set of 3 consecutive cells up to 9 make a block
			cellnums += newCell.id().toString() + ',';
		}

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
	};
}(jsobj));