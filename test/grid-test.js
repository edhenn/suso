/*global suso, describe, it, expect, beforeEach */
/*jslint plusplus: true */

(function () {
	"use strict";

	function listSolved(grid) {
		var solved = [], row, cell, rowCells;
		for (row = 0; row < 9; row++) {
			rowCells = grid.hRow(row).cells();
			for (cell = 0; cell < 9; cell++) {
				if (rowCells[cell].value() !== undefined) {
					solved.push(rowCells[cell]);
				}
			}
		}
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

		it(".vRow member is a function", function () {
			expect(typeof x.vRow).toBe("function");
		});

		it(".hRow member is a function", function () {
			expect(typeof x.hRow).toBe("function");
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

}());
