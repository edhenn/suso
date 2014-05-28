/*global jsobj, document */
/*jslint plusplus: true */

(function () {
	'use strict';

	var grid = new jsobj.Grid(),
		disp, rept;

	// difficult -- solved with rule last-in-group
	/*
	grid.addSeeds([
		[  ,  ,  ,  ,  , 1,  , 8,  ],
		[ 8,  ,  , 5, 3,  ,  ,  ,  ],
		[  ,  , 6,  , 2,  , 4,  ,  ],
		[ 6,  ,  , 3,  , 9,  , 7,  ],
		[  , 3, 8,  ,  ,  , 2, 1,  ],
		[  , 1,  , 8,  , 2,  ,  , 3],
		[  ,  , 9,  , 8,  , 5,  ,  ],
		[  ,  ,  ,  , 7, 3,  ,  , 4],
		[  , 7,  , 1,  ,  ,  ,  ,  ]
	]);
	*/


	// diabolical 1	-- solved with rules last-in-group and restricted-possible-value
	/*
	grid.addSeeds([
		[ 7,  ,  ,  , 9, 6,  ,  ,  ],
		[ 8, 9,  ,  ,  , 5, 7,  ,  ],
		[  , 6,  ,  ,  ,  ,  ,  , 2],
		[ 1,  ,  ,  ,  ,  ,  ,  ,  ],
		[  ,  , 4, 1,  , 7, 5,  ,  ],
		[  ,  ,  ,  ,  ,  ,  ,  , 6],
		[ 9,  ,  ,  ,  ,  ,  , 2,  ],
		[  ,  , 8, 9,  ,  ,  , 5, 1],
		[  ,  ,  , 2, 3,  ,  ,  , 8]
	]);
	*/

	/*
	// diabolical 2	-- solved with rules last-in-group and restricted-possible-value
	grid.addSeeds([
		[ 9,  , 4,  ,  , 1,  ,  ,  ],
		[  , 2,  ,  ,  , 3, 7, 1,  ],
		[  ,  ,  ,  , 2,  , 9,  ,  ],
		[ 2,  ,  ,  ,  , 6,  ,  , 4],
		[  , 9,  ,  ,  ,  ,  , 6,  ],
		[ 5,  ,  , 2,  ,  ,  ,  , 7],
		[  ,  , 5,  , 6,  ,  ,  ,  ],
		[  , 8, 9, 5,  ,  ,  , 3,  ],
		[  ,  ,  , 4,  ,  , 5,  , 8]
	]);
	*/

	// hard 3 - web sudoku -- not solved with rules last-in-group and restricted-possible-value
	grid.addSeeds([
		[ 8,  , 1, 7,  ,  , 3, 9,  ],
		[  ,  ,  ,  ,  , 2, 4,  ,  ],
		[ 4,  ,  ,  , 9,  ,  , 8,  ],
		[  ,  , 5,  ,  , 8,  ,  ,  ],
		[ 3,  ,  ,  , 6,  ,  ,  , 9],
		[  ,  ,  , 2,  ,  , 8,  ,  ],
		[  , 1,  ,  , 7,  ,  ,  , 5],
		[  ,  , 3, 6,  ,  ,  ,  ,  ],
		[  , 2, 7,  ,  , 9, 6,  , 3]
	]);

	disp = new jsobj.views.StaticGrid(grid);
	rept = new jsobj.views.Report(grid);
	grid.solve();

}());
