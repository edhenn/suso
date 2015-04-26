/*global suso, describe, it, expect, beforeEach */
/*jslint plusplus: true */

(function () {
	"use strict";

	function listSolved(grid) {
		var solved = [];
		grid.rows.forEach(function (row) {
			row.cells().forEach(function (cell) {
				if (cell.value() !== undefined) {
					solved.push(cell);
				}
			});
		});
		return solved;
	}

	describe("Grid object", function () {
		it("exists in suso namespace", function () {
			expect(suso.Grid).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof suso.Grid).toBe("function");
		});
	});

	describe("Grid object members", function () {
		var x = new suso.Grid();

		it(".col member is a function", function () {
			expect(typeof x.col).toBe("function");
		});

		it(".row member is a function", function () {
			expect(typeof x.row).toBe("function");
		});

		it(".block member is a function", function () {
			expect(typeof x.block).toBe("function");
		});

		it(".allGroups member is a function", function () {
			expect(typeof x.allGroups).toBe("function");
		});

		it(".on member is a function", function () {
			expect(typeof x.on).toBe("function");
		});

		it(".off member is a function", function () {
			expect(typeof x.off).toBe("function");
		});

		it(".trigger member is a function", function () {
			expect(typeof x.trigger).toBe("function");
		});

		it(".state member is a function", function () {
			expect(typeof x.state).toBe("function");
		});

		it(".addSeeds member is a function", function () {
			expect(typeof x.addSeeds).toBe("function");
		});

		it(".solve member is a function", function () {
			expect(typeof x.solve).toBe("function");
		});

		it("has a .rows member", function () {
			expect(x.rows).toBeDefined();
		});

		it("has a .cols member", function () {
			expect(x.cols).toBeDefined();
		});

		it("has a .seedSolved member", function () {
			expect(x.seedSolved).toBeDefined();
		});

		it("has 13 non-prototype members", function () {
			var members = 0, prop;

			for (prop in x) {
				if (x.hasOwnProperty(prop) && prop !== "prototype") {
					members++;
				}
			}
			expect(members).toBe(13);
		});
	});

	describe("allGroups member", function () {
		var x = new suso.Grid(), allgroups, rows = 0, cols = 0, blocks = 0, i;

		it("combines rows, cols, blocks", function () {
			allgroups = x.allGroups();
			for (i = 0; i < allgroups.length; i++) {
				switch (allgroups[i].type()) {
				case "block":
					blocks++;
					break;
				case "row":
					rows++;
					break;
				case "col":
					cols++;
					break;
				}
			}
			expect(i).toBe(27);
			expect(blocks).toBe(9);
			expect(rows).toBe(9);
			expect(cols).toBe(9);
		});
	});

	describe("Grid seeding", function () {
		var x;

		beforeEach(function () {
			x = new suso.Grid();
		});

		it("sets up empty grid when no seeds sent", function () {
			expect(listSolved(x).length).toBe(0);
		});

		it("sets up empty grid when seeded with empty array", function () {
			x.addSeeds([]);
			expect(listSolved(x).length).toBe(0);
		});

		it("sets up empty grid when seeded with array of undefineds", function () {
			var z;
			x.addSeeds([[z, z, z, z, z, z, z], [z, z, z, z, z, z, z], [z, z, z], [z, z, z, z, z, z], [z, z, z, z, z]]);
			expect(listSolved(x).length).toBe(0);
		});

		it("seeds grid when seeds are sent", function () {
			var z;
			x.addSeeds([ [1], [z, 2], [z, z, 3], [z, z, z, 4], [z, z, z, z, 5], [z, z, z, z, z, 6],
				[z, z, z, z, z, z, 7], [z, z, z, z, z, z, z, 8], [z, z, z, z, z, z, z, z, 9] ]);
			expect(listSolved(x).length).toBe(9);
		});

		it("does not solve cells with one possible value when seeding", function () {
			x.addSeeds([ [1, 2, 3, 4, 5, 6, 7, 8] ]);
			expect(listSolved(x).length).toBe(8);
		});

		it("ignores seeds if seeding is already complete", function () {
			var empty, oneSeed, twoSeeds, twoSeedReturn;

			empty = listSolved(x).length;
			x.addSeeds([[1]]);
			oneSeed = listSolved(x).length;
			twoSeedReturn = x.addSeeds([[], [1]]);
			twoSeeds = listSolved(x).length;

			expect(empty).toBe(0);
			expect(oneSeed).toBe(1);
			expect(twoSeeds).toBe(1);
			expect(twoSeedReturn).toBe(x);
		});
	});

	describe("Grid solve function", function () {
		var x;

		beforeEach(function () {
			x = new suso.Grid();
		});

		it("sets grid state to incomplete if no cells solved or seeded", function () {
			x.solve();
			expect(x.state()).toBe("incomplete");
		});

		it("sets grid state to complete if all cells seeded", function () {
			x.addSeeds([
				[1, 2, 3, 4, 5, 6, 7, 8, 9],
				[4, 5, 6, 7, 8, 9, 1, 2, 3],
				[7, 8, 9, 1, 2, 3, 4, 5, 6],
				[2, 3, 4, 5, 6, 7, 8, 9, 1],
				[5, 6, 7, 8, 9, 1, 2, 3, 4],
				[8, 9, 1, 2, 3, 4, 5, 6, 7],
				[3, 4, 5, 6, 7, 8, 9, 1, 2],
				[6, 7, 8, 9, 1, 2, 3, 4, 5],
				[9, 1, 2, 3, 4, 5, 6, 7, 8]
			]);
			x.solve();
			expect(x.state()).toBe("complete");
		});

		it("solves for cells with one remaining possible value after seeding ", function () {
			x.addSeeds([
				[1, 2, 3,  ,  , 6, 7, 8,  ],
				[ ,  ,  ,  ,  ,  ,  ,  , 4],
				[ ,  ,  ,  ,  ,  ,  ,  , 5],
				[ ,  ,  ,  ,  ,  ,  ,  ,  ],
				[ ,  ,  ,  ,  ,  ,  ,  ,  ],
				[ ,  ,  ,  ,  ,  ,  ,  ,  ],
				[ ,  ,  ,  ,  ,  ,  ,  ,  ],
				[ ,  ,  ,  ,  ,  ,  ,  ,  ],
				[ ,  ,  ,  ,  ,  ,  ,  ,  ]
			]);
			x.solve();
			expect(x.rows[0].cells()[8].value()).toBe(9);
		});
	});

	describe("house access methods: ", function () {
		var grid = new suso.Grid();

		it(".col() returns expected column object", function () {
			var cols = [],
				i;
			for (i = 0; i < 9; i++) {
				cols.push(grid.col(i));
			}
			expect(cols[0].name()).toBe('col 0');
			expect(cols[1].name()).toBe('col 1');
			expect(cols[2].name()).toBe('col 2');
			expect(cols[3].name()).toBe('col 3');
			expect(cols[4].name()).toBe('col 4');
			expect(cols[5].name()).toBe('col 5');
			expect(cols[6].name()).toBe('col 6');
			expect(cols[7].name()).toBe('col 7');
			expect(cols[8].name()).toBe('col 8');
		});

		it(".row() returns expected row object", function () {
			var rows = [],
				i;
			for (i = 0; i < 9; i++) {
				rows.push(grid.row(i));
			}
			expect(rows[0].name()).toBe('row 0');
			expect(rows[1].name()).toBe('row 1');
			expect(rows[2].name()).toBe('row 2');
			expect(rows[3].name()).toBe('row 3');
			expect(rows[4].name()).toBe('row 4');
			expect(rows[5].name()).toBe('row 5');
			expect(rows[6].name()).toBe('row 6');
			expect(rows[7].name()).toBe('row 7');
			expect(rows[8].name()).toBe('row 8');
		});

		it(".block() returns expected block object", function () {
			var blocks = [],
				i;
			for (i = 0; i < 9; i++) {
				blocks.push(grid.block(i));
			}
			expect(blocks[0].name()).toBe('block 0');
			expect(blocks[1].name()).toBe('block 1');
			expect(blocks[2].name()).toBe('block 2');
			expect(blocks[3].name()).toBe('block 3');
			expect(blocks[4].name()).toBe('block 4');
			expect(blocks[5].name()).toBe('block 5');
			expect(blocks[6].name()).toBe('block 6');
			expect(blocks[7].name()).toBe('block 7');
			expect(blocks[8].name()).toBe('block 8');
		});
	});
}());
