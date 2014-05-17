/*global jsobj */
/*jslint plusplus: true */

(function (jsobj) {
	"use strict";

	jsobj.displayPre = function (grid, ctrl) {
		var row,
			pre = '<pre>\n{0}</pre>',
			prebody = '',
			prerow = '{0}{1}{2} {3}{4}{5} {6}{7}{8}';

		function repl(match, id) {
			var val = grid.hRow(row).cells()[id].value();
			return val === undefined ? '-' : val.toString();
		}

		for (row = 0; row < 9; row++) {
			if (row % 3 === 0) {
				prebody += '\n';
			}
			prebody += prerow.replace(/\{([0-9])\}/, repl);
			prebody += '\n';
		}

		if (ctrl === undefined) {
			return pre.replace('{0}', prebody);
		}
	};
}(jsobj));