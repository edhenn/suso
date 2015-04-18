#suso

Suso is a Sudoku solver written in vanilla Javascript.  It is also a work in progress, written just for fun.

##Design goals

Suso is intented to solve sudoku close to the way I solve them by hand: using a set of logical rules, and eliminating remaining allowed values in each cell.

The internal grid used to represent the puzzle is event-driven, so changes to one cell will update the allowed values in the related houses (row, column, and block).

- [x] Multiple rules available
  - [x] Basic grid rules
  - [x] Last possible value; claimed value; pairs and hidden pairs; triples
  - [ ] Hidden triples; quads; x-wing; y-wing; others...
- [x] Multiple views available
  - [x] Interactive view - user inputs seeds and clicks to solve
  - [x] Pre-seeded view - for entering the seeds at runtime
  - [x] Reporting view showing a history of changes to the grid
- [ ] Allow developer to pass in rules of their own.
- [ ] Flexible use - display everything automatically, or in your own styled grid, or just in memory.  This needs the most work at the moment.
- [x] Solve hard sudoku quickly
- [ ] ~~Solve ridiculous sudoku~~
- [x] Have fun

I don't intend it to solve any sudoku which require guesswork (google "world's hardest sudoku").

##Usage

Include the javascript file in an HTML page.  There are no other dependencies.

```
<script type="text/javascript" src="build/suso.min.js"></script>
```

Interactive view - displays a grid of input boxes and waits for user input before solving:

```
var grid = new suso.Grid(),
    disp = new suso.views.InputGrid(grid);
```

Pre-seeded grid with interactive history report (hovering over steps in report shows associated grid state):

```
var grid = new suso.Grid(),
    disp = new suso.views.StaticGrid(grid),
	rept = new suso.views.Report({ grid: grid, gridView: disp });

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

	grid.solve();
```