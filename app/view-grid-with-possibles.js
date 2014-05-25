/*global jsobj, document */
/*jslint plusplus: true */

(function (jsobj) {
	"use strict";

	jsobj.ViewGridWithPossibles = function (grid, ctrl) {
		var gridtag,
			gridbody,
			gridrow = '<div class="row"><span class="cell">{0}</span><span class="cell">{1}</span><span class="cell">{2}</span>' +
				'<span class="cell">{3}</span><span class="cell">{4}</span><span class="cell">{5}</span>' +
				'<span class="cell">{6}</span><span class="cell">{7}</span><span class="cell">{8}</span></div>',
			row,
			styletag,
			styles = '.cell { width: 30px; height: 30px; display: inline-block; border: solid 1px grey; }' +
				'.poss { font-size: 0.5em }' +
				'.value { font-weight: bold }';

		function repl(match, id) {
			var cell = grid.hRow(row).cells()[id],
				val = cell.value(),
				poss;

			if (val) {
				return '<span class="value">' + val.toString() + '</span>';
			}
			return '<span class="poss">' + cell.possibleValues().join(',') + '</span>';
		}

		function display() {
			gridbody = '';
			for (row = 0; row < 9; row++) {
				gridbody += gridrow.replace(/\{([0-9])\}/g, repl);
				gridbody += '\n';
				// if (row === 2 || row === 5) {
					// prebody += '\n';
				// }
			}

			// display and refresh both just replace the entire display node with freshly generated results
			gridtag.innerHTML = gridbody;
		}

		this.grid = grid;
		this.ctrl = ctrl;

		if (ctrl === undefined) {
			ctrl = document.createElement('div');
			ctrl.setAttribute('id', 'Grid-Display');
			document.body.appendChild(ctrl);
		}
		// append styles
		styletag = document.createElement('style');
		ctrl.appendChild(styletag);
		styletag.innerHTML = styles;
		// append grid
		gridtag = document.createElement('div');
		gridtag.setAttribute('class', 'grid');
		ctrl.appendChild(gridtag);

		grid.on("update", display);

		return display();
	};
}(jsobj));