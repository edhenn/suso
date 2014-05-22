/*global jsobj, document */
/*jslint plusplus: true */

(function () {
	'use strict';

	var grid = new jsobj.Grid(),
		disp;

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
		[  , 7,  , 1,  ,  ,  ,  ,  ],
	]);
	*/


	// diabolical 1	-- NOT solved with rules last-in-group and restricted-possible-value
	grid.addSeeds([
		[ 7,  ,  ,  , 9, 6,  ,  ,  ],
		[ 8, 9,  ,  ,  , 5, 7,  ,  ],
		[  , 6,  ,  ,  ,  ,  ,  , 2],
		[ 1,  ,  ,  ,  ,  ,  ,  ,  ],
		[  ,  , 4, 1,  , 7, 5,  ,  ],
		[  ,  ,  ,  ,  ,  ,  ,  , 6],
		[ 9,  ,  ,  ,  ,  ,  , 2,  ],
		[  ,  , 8, 9,  ,  ,  , 5, 1],
		[  ,  ,  , 2, 3,  ,  ,  , 8],
	]);

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
		[  ,  ,  , 4,  ,  , 5,  , 8],
	]);
	*/

	disp = new jsobj.DisplayPre(grid);
	grid.solve();

}());
