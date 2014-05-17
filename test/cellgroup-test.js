/*global jsobj, describe, it, expect, beforeEach */
/*jslint plusplus: true */

(function () {
	"use strict";


	function stateStub() {
		return 'ready';
	}

	describe("CellGroup object", function () {
		it("exists in jsobj namespace", function () {
			expect(jsobj.CellGroup).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof jsobj.CellGroup).toBe("function");
		});
	});

	describe("CellGroup object members", function () {
		var x = new jsobj.CellGroup();

		it(".addCell member is a function", function () {
			expect(typeof x.addCell).toBe('function');
		});

		it(".cells member is a function", function () {
			expect(typeof x.cells).toBe('function');
		});

		it(".name member is a function", function () {
			expect(typeof x.name).toBe('function');
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

		it("has 8 non-prototype members", function () {
			var members = 0, prop;

			for (prop in x) {
				if (x.hasOwnProperty(prop) && prop !== 'prototype') {
					members++;
				}
			}
			expect(members).toBe(8);
		});
	});

	describe("CellGroup constructor", function () {
		it("sets .name from type and num", function () {
			var x = new jsobj.CellGroup('row', 1, {});
			expect(x.name()).toBe('row 1');
		});

		it("sets .type", function () {
			var x = new jsobj.CellGroup('block', 5, {});
			expect(x.type()).toBe('block');
		});

		it("sets .grid", function () {
			var g = {},
				x = new jsobj.CellGroup('col', 3, g);
			expect(x.grid()).toBe(g);
		});
	});

	describe("CellGroup .addCell function", function () {
		var grid = { state: stateStub },
			x = new jsobj.CellGroup('col', 3, grid),
			a = new jsobj.Cell(grid),
			b = new jsobj.Cell(grid),
			cells;

			x.addCell(a).addCell(b);

		it("adds cell to .cells() array", function () {
			cells = x.cells();
			expect(cells.length).toBe(2);
			expect(cells[0]).toBe(a);
			expect(cells[1]).toBe(b);
		});
	});

	describe("CellGroup update event", function () {
		var grid = { state: stateStub };

		it("subscribes to cell update and responds with cellgroup update", function () {
			var x = new jsobj.CellGroup('col', 3, grid),
				a = new jsobj.Cell(grid),
				b = new jsobj.Cell(grid),
				cells,
				cellGroupUpdateCalls = 0;

			x.addCell(a).addCell(b);
			x.on("update", function () {
				cellGroupUpdateCalls++;
			});
			x.cells()[0].setValue(1);
			x.cells()[1].setValue(2);
			expect(cellGroupUpdateCalls).toBe(2);
		});

		it("passes solved cell with cellGroup update event", function () {
			var x = new jsobj.CellGroup('col', 3, grid),
				a = new jsobj.Cell(grid),
				b = new jsobj.Cell(grid),
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