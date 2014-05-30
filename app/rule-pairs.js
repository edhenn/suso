/*global jsobj */
/*jslint plusplus: true */

(function (jsobj) {
	"use strict";

	if (jsobj.rules === undefined) {
		jsobj.rules = {};
	}

	// Pairs rule removes possible values from cells.
	// It looks in rows, columns, and blocks for any 2 cells containing the same two possible remaining values.
	// The two values can be removed from all other cells in that group.
	jsobj.rules.pairs = function (grid) {
		var progress = false,
			allGroups = grid.allGroups(),
			groupnum,
			group
			pairs;

		// Iterate through each row, column, and block looking for pairs
		for (groupnum = 0; groupnum < allGroups.length; groupnum++) {
			pairs = {};

		}

		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(jsobj));