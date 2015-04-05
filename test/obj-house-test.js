/*global suso, describe, it, expect, beforeEach */
/*jslint plusplus: true */

(function () {
	"use strict";


	function stateStub() {
		return "ready";
	}

	describe("House object", function () {
		it("exists in suso namespace", function () {
			expect(suso.House).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof suso.House).toBe("function");
		});
	});

	describe("House object members", function () {
		var x = new suso.House("row", 1, {});

		it(".addCell member is a function", function () {
			expect(typeof x.addCell).toBe("function");
		});

		it(".cells member is a function", function () {
			expect(typeof x.cells).toBe("function");
		});

		it(".name member is a function", function () {
			expect(typeof x.name).toBe("function");
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

		it(".grid member is a function", function () {
			expect(typeof x.grid).toBe("function");
		});

		it(".type member is a function", function () {
			expect(typeof x.type).toBe("function");
		});

		it(".num member is a function", function () {
			expect(typeof x.num).toBe("function");
		});

		it(".possibleValues member is a function", function () {
			expect(typeof x.possibleValues).toBe("function");
		});

		it("has a .possibles member", function () {
			expect(typeof x.possibles).toBeDefined();
		});

		it("has 11 non-prototype members", function () {
			var members = 0, prop;

			for (prop in x) {
				if (x.hasOwnProperty(prop) && prop !== "prototype") {
					members++;
				}
			}
			expect(members).toBe(11);
		});
	});

	describe("House constructor", function () {
		it("sets .name from type and num", function () {
			var x = new suso.House("row", 1, {});
			expect(x.name()).toBe("row 1");
		});

		it("sets .type", function () {
			var x = new suso.House("block", 5, {});
			expect(x.type()).toBe("block");
		});

		it("sets .grid", function () {
			var g = {},
				x = new suso.House("col", 3, g);
			expect(x.grid()).toBe(g);
		});
	});

	describe("House .addCell function", function () {
		var grid = { state: stateStub },
			x = new suso.House("col", 3, grid),
			a = new suso.Cell(grid),
			b = new suso.Cell(grid),
			cells;

		x.addCell(a).addCell(b);

		it("adds cell to .cells() array", function () {
			cells = x.cells();
			expect(cells.length).toBe(2);
			expect(cells[0]).toBe(a);
			expect(cells[1]).toBe(b);
		});
	});

	describe("House update event", function () {
		var grid = { state: stateStub };

		it("subscribes to cell update and responds with House update", function () {
			var x = new suso.House("col", 3, grid),
				a = new suso.Cell(grid),
				b = new suso.Cell(grid),
				cells,
				houseUpdateCalls = 0;

			x.addCell(a).addCell(b);
			x.on("update", function () {
				houseUpdateCalls++;
			});
			x.cells()[0].setValue(1);
			x.cells()[1].setValue(2);
			expect(houseUpdateCalls).toBe(2);
		});

		it("passes solved cell with House update event", function () {
			var x = new suso.House("col", 3, grid),
				a = new suso.Cell(grid),
				b = new suso.Cell(grid),
				cells,
				updatedCells = [];

			x.addCell(a).addCell(b);
			x.on("update", function (c) {
				updatedCells.push(c);
			});
			x.cells()[0].setValue(1);
			x.cells()[1].setValue(2);
			expect(updatedCells.length).toBe(2);
			expect(updatedCells[0]).toBe(a);
			expect(updatedCells[1]).toBe(b);
		});
	});

}());
