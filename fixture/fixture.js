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

	// diabolical 3
	/*
	grid.addSeeds([
		[  , 8, 4, 3,  , 2, 5, 6,  ],
		[  ,  ,  , 8, 6, 9,  ,  ,  ],
		[  ,  ,  ,  ,  ,  ,  ,  ,  ],
		[  , 2, 9,  ,  ,  , 7, 5,  ],
		[  ,  , 8,  ,  ,  , 2,  ,  ],
		[  , 3, 6,  ,  ,  , 9, 8,  ],
		[  ,  ,  ,  ,  ,  ,  ,  ,  ],
		[  ,  ,  , 4, 9, 1,  ,  ,  ],
		[  , 5, 2, 6,  , 7, 1, 9,  ],
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

	// 5-way #1
	/*
	grid.addSeeds([
		[ 2, 5,  ,  ,  ,  , 1,  ,  ],
		[  ,  , 6, 1, 2, 3,  ,  ,  ],
		[  , 1,  ,  , 6,  , 9, 4,  ],
		[  , 6,  ,  ,  , 5, 7,  ,  ],
		[  ,  , 4,  , 7,  ,  ,  ,  ],
		[  ,  ,  , 4, 8, 1,  ,  , 9],
		[ 6,  ,  ,  ,  , 2, 4, 3,  ],
		[ 3,  , 2,  , 9,  , 5,  ,  ],
		[ 4,  ,  ,  , 5,  , 2,  ,  ]
	]);
	*/

	// evil http://www.websudoku.com/?level=4&set_id=357851504
	/*
	grid.addSeeds([
		[  ,  ,  ,  , 7, 1,  ,  ,  ],
		[ 8,  ,  ,  ,  , 9,  , 4,  ],
		[ 4, 9,  ,  , 8,  , 6,  ,  ],
		[  ,  , 2,  ,  ,  , 5,  ,  ],
		[  , 3,  ,  , 9,  ,  , 6,  ],
		[  ,  , 5,  ,  ,  , 3,  ,  ],
		[  ,  , 7,  , 4,  ,  , 2, 6],
		[  , 6,  , 3,  ,  ,  ,  , 1],
		[  ,  ,  , 9, 6,  ,  ,  ,  ]
	]);
	*/

	// evil http://www.websudoku.com/?level=4&set_id=8745440277
	/*
	grid.addSeeds([
		[  , 8,  ,  , 3,  ,  , 4, 5],
		[  ,  ,  ,  ,  ,  , 1, 2,  ],
		[  ,  ,  , 5,  ,  ,  ,  , 9],
		[  ,  , 1,  , 2,  ,  ,  , 8],
		[  ,  ,  , 1, 5, 4,  ,  ,  ],
		[ 9,  ,  ,  , 7,  , 4,  ,  ],
		[ 6,  ,  ,  ,  , 8,  ,  ,  ],
		[  , 7, 2,  ,  ,  ,  ,  ,  ],
		[ 5, 3,  ,  , 1,  ,  , 7,  ]
	]);
	*/

	// evil http://www.websudoku.com/?level=4&set_id=8224374645
	/*
	grid.addSeeds([
		[  ,  , 4,  ,  , 6, 9, 2,  ],
		[  ,  ,  ,  ,  ,  ,  ,  ,  ],
		[  , 1,  , 5, 9,  ,  , 8,  ],
		[  ,  , 2,  , 7, 9,  , 4,  ],
		[  ,  , 1,  ,  ,  , 7,  ,  ],
		[  , 8,  , 2, 1,  , 6,  ,  ],
		[  , 6,  ,  , 4, 3,  , 5,  ],
		[  ,  ,  ,  ,  ,  ,  ,  ,  ],
		[  , 4, 8, 9,  ,  , 3,  ,  ]
	]);
	*/

	// diabolical - sunday enterprise 3/22/15
	/*
	grid.addSeeds([
		[  ,  ,  , 5,  ,  , 7, 1,  ],
		[  , 7, 4, 9,  ,  ,  ,  ,  ],
		[  , 3,  ,  ,  ,  , 9,  , 8],
		[  ,  ,  ,  ,  ,  , 4, 2,  ],
		[ 5,  ,  ,  , 3,  ,  ,  , 6],
		[  , 2, 1,  ,  ,  ,  ,  ,  ],
		[ 2,  , 3,  ,  ,  ,  , 8,  ],
		[  ,  ,  ,  ,  , 2, 6, 9,  ],
		[  , 8, 9,  ,  , 7,  ,  ,  ]
	]);
	*/

	// evil - 1sudoku.net - n° 524146 - Evil
	// http://1sudoku.net/play/sudoku-free-online/sudoku-evil/
	// not completely solved with pairs & triples rules
	grid.addSeeds([
		[  ,  ,  ,  , 5,  ,  ,  ,  ],
		[  , 3,  , 2, 8, 6,  , 1,  ],
		[  ,  , 5, 7,  , 4, 2,  ,  ],
		[  , 4, 6,  ,  ,  , 8, 2,  ],
		[ 8, 7,  ,  ,  ,  ,  , 5, 3],
		[  , 2, 1,  ,  ,  , 6, 7,  ],
		[  ,  , 2, 1,  , 8, 7,  ,  ],
		[  , 9,  , 4, 2, 5,  , 6,  ],
		[  ,  ,  ,  , 6,  ,  ,  ,  ]
	]);

	// "worlds hardest sudoku" http://www.telegraph.co.uk/news/science/science-news/9359579/Worlds-hardest-sudoku-can-you-crack-it.html
	// not a single number filled in by base ruleset (last-in-group, restricted-possible, pairs)
	// requires guessing and checking several levels deep - we are not designed for that.
	/*
	grid.addSeeds([
		[ 8,  ,  ,  ,  ,  ,  ,  ,  ],
		[  ,  , 3, 6,  ,  ,  ,  ,  ],
		[  , 7,  ,  , 9,  , 2,  ,  ],
		[  , 5,  ,  ,  , 7,  ,  ,  ],
		[  ,  ,  ,  , 4, 5, 7,  ,  ],
		[  ,  ,  , 1,  ,  ,  , 3,  ],
		[  ,  , 1,  ,  ,  ,  , 6, 8],
		[  ,  , 8, 5,  ,  ,  , 1,  ],
		[  , 9,  ,  ,  ,  , 4,  ,  ]
	]);
	*/

	grid.solve();
	//jsobj.rules.lastInGroup(grid);
	disp = new jsobj.views.StaticGrid(grid);
	rept = new jsobj.views.Report(grid);

}());
