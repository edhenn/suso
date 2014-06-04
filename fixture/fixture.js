/*global jsobj, document */
/*jslint plusplus: true */

(function () {
	'use strict';

	var grid = new jsobj.Grid(),
		disp,
		rept;

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

	/*
	// hard 3 - web sudoku -- solved after adding "pairs" rule
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
	*/

	/*
	// evil 4 - websudoku.com -- solved with pairs rule
	grid.addSeeds([
		[  ,  ,  ,  , 2,  , 7,  ,  ],
		[  , 2,  ,  ,  ,  ,  ,  , 6],
		[  , 8,  , 5,  , 9,  ,  ,  ],
		[  ,  , 2,  , 9,  ,  , 6, 1],
		[  ,  , 8, 1,  , 7, 9,  ,  ],
		[ 9, 1,  ,  , 6,  , 8,  ,  ],
		[  ,  ,  , 7,  , 6,  , 1,  ],
		[ 5,  ,  ,  ,  ,  ,  , 7,  ],
		[  ,  , 4,  , 3,  ,  ,  ,  ]
	]);                
	*/

	/*
	// evil 5 - websudoku.com -- 
	grid.addSeeds([
		[ 3,  ,  ,  ,  , 9,  ,  ,  ],
		[  , 5,  ,  , 7,  , 8, 6,  ],
		[  , 6,  ,  ,  ,  ,  , 2, 7],
		[  , 4,  , 9,  , 5,  ,  , 8],
		[  ,  ,  ,  ,  ,  ,  ,  ,  ],
		[ 7,  ,  , 2,  , 6,  , 4,  ],
		[ 4, 2,  ,  ,  ,  ,  , 9,  ],
		[  , 1, 8,  , 9,  ,  , 5,  ],
		[  ,  ,  , 5,  ,  ,  ,  , 1]
	]);                
	*/

	// rule test
	/*
	grid.addSeeds([
		[  ,  ,  , 4, 5, 6, 7, 8, 9],
		[  ,  ,  , 1, 2,  ,  ,  ,  ],
		[  ,  ,  ,  ,  ,  , 1, 2,  ],
		[  , 1,  ,  ,  ,  ,  ,  ,  ],
		[ 2,  ,  ,  ,  ,  ,  ,  ,  ],
		[  ,  ,  ,  ,  ,  ,  ,  ,  ],
		[  ,  , 1,  ,  ,  ,  ,  ,  ],
		[  ,  , 2,  ,  ,  ,  ,  ,  ],
		[  , 3,  ,  ,  ,  ,  ,  ,  ]
	]);
	*/

	//grid.solve();
	jsobj.rules.lastInGroup(grid);
	disp = new jsobj.views.StaticGrid(grid);
	rept = new jsobj.views.Report(grid);

}());
