/*global jsobj, describe, it, expect, beforeEach */
/*jslint plusplus: true */

(function () {
	"use strict";

	describe("Cell object", function () {
		it("exists in jsobj namespace", function () {
			expect(jsobj.Cell).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof jsobj.Cell).toBe("function");
		});
	});

	describe("Event-Aware Cell object members", function () {
		var x = new jsobj.Cell();

		it(".id member is a function", function () {
			expect(typeof x.id).toBe("function");
		});

		it(".value member is a function", function () {
			expect(typeof x.value).toBe("function");
		});

		it(".setValue is a function", function () {
			expect(typeof x.setValue).toBe("function");
		});

		it(".rowH member is a function", function () {
			expect(typeof x.rowH).toBe("function");
		});

		it(".setRowH member is a function", function () {
			expect(typeof x.setRowH).toBe("function");
		});

		it(".rowV member is a function", function () {
			expect(typeof x.rowV).toBe("function");
		});

		it(".setRowV member is a function", function () {
			expect(typeof x.setRowV).toBe("function");
		});

		it(".block member is a function", function () {
			expect(typeof x.block).toBe("function");
		});

		it(".setBlock member is a function", function () {
			expect(typeof x.setBlock).toBe("function");
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

		it(".possibleValues member is a function", function () {
			expect(typeof x.possibleValues).toBe("function");
		});

		it(".grid member is a function", function () {
			expect(typeof x.grid).toBe("function");
		});

		it(".coords member is a function", function () {
			expect(typeof x.coords).toBe('function');
		});

		it("has 15 non-prototype members", function () {
			var members = 0, prop;

			for (prop in x) {
				if (x.hasOwnProperty(prop) && prop !== 'prototype') {
					members++;
				}
			}
			expect(members).toBe(15);
		});
	});

	describe("Cell.value and setValue functions", function () {
		var x = new jsobj.Cell();

		it(".value returns undefined before a value is set", function () {
			expect(x.value()).not.toBeDefined();
		});

		it(".value returns correct value after .setValue is called", function () {
			x.setValue(5);
			expect(x.value()).toBe(5);
		});

		it(".setValue throws an error when called if Cell.value is already defined", function () {
			expect(function () { x.setValue(7); })
				.toThrow(new Error("Attempt to set value on a Cell that already has a value."));
		});

		it(".setValue triggers an update event", function () {
			var y, z;
			y = new jsobj.Cell();
			y.on("update", function () {
				z = this;
			});
			y.setValue(4);
			expect(z).toBe(y);
		});
	});

	describe("Cell.rowH and setRowH functions", function () {
		var x = new jsobj.Cell();

		it(".rowH returns undefined before a value is set", function () {
			expect(x.rowH()).not.toBeDefined();
		});

		it(".rowH returns correct object after .setRowH is called", function () {
			var rowH = new jsobj.CellGroup();
			x.setRowH(rowH);
			expect(x.rowH()).toBe(rowH);
		});

		it(".setRowH throws an error when called if .rowH is already defined", function () {
			expect(function () { x.setRowH({}); })
				.toThrow(new Error("Attempt to set rowH on a Cell that already has a rowH."));
		});
	});

	describe("Cell.rowV and setRowV functions", function () {
		var x = new jsobj.Cell();

		it(".rowV returns undefined before a value is set", function () {
			expect(x.rowV()).not.toBeDefined();
		});

		it(".rowV returns correct object after .setRowV is called", function () {
			var rowV = new jsobj.CellGroup();
			x.setRowV(rowV);
			expect(x.rowV()).toBe(rowV);
		});

		it(".setRowV throws an error when called if .rowV is already defined", function () {
			expect(function () { x.setRowV({}); })
				.toThrow(new Error("Attempt to set rowV on a Cell that already has a rowV."));
		});
	});

	describe("Cell.block and setBlock functions", function () {
		var x = new jsobj.Cell();

		it(".block returns undefined before a value is set", function () {
			expect(x.block()).not.toBeDefined();
		});

		it(".block returns correct object after .setBlock is called", function () {
			var block = new jsobj.CellGroup();
			x.setBlock(block);
			expect(x.block()).toBe(block);
		});

		it(".setBlock throws an error when called if .block is already defined", function () {
			expect(function () { x.setBlock({}); })
				.toThrow(new Error("Attempt to set block on a Cell that already has a block."));
		});
	});

	describe("Cell.possibleValues function", function () {
		var x = new jsobj.Cell();

		it("starts as an array of 9 numbers", function () {
			var poss = x.possibleValues();
			expect(poss.length).toBe(9);
		});

		it("starts as an array of numbers 1-9 sorted", function () {
			var i, poss = x.possibleValues();
			for (i = 0; i < poss.length; i++) {
				expect(poss[i]).toBe(i + 1);
			}
		});

		it("returns empty array once .setValue is called", function () {
			var poss;
			x.setValue(4);
			poss = x.possibleValues();
			expect(poss.length).toBe(0);
		});

		it("returns array with setValue missing from other cells in rowH", function () {
			var y = new jsobj.Cell(),
				z = new jsobj.Cell(),
				row = new jsobj.CellGroup(),
				poss;

			y.setRowH(row);
			z.setRowH(row);
			y.setValue(4);
			poss = z.possibleValues();
			expect(poss.length).toBe(8);
			expect(poss[2]).toBe(3);
			expect(poss[3]).toBe(5);
		});

		it("returns array with setValue missing from other cells in rowV", function () {
			var y = new jsobj.Cell(),
				z = new jsobj.Cell(),
				row = new jsobj.CellGroup(),
				poss;

			y.setRowV(row);
			z.setRowV(row);
			y.setValue(4);
			poss = z.possibleValues();
			expect(poss.length).toBe(8);
			expect(poss[2]).toBe(3);
			expect(poss[3]).toBe(5);
		});

		it("returns array with setValue missing from other cells in block", function () {
			var y = new jsobj.Cell(),
				z = new jsobj.Cell(),
				row = new jsobj.CellGroup(),
				poss;

			y.setBlock(row);
			z.setBlock(row);
			y.setValue(4);
			poss = z.possibleValues();
			expect(poss.length).toBe(8);
			expect(poss[2]).toBe(3);
			expect(poss[3]).toBe(5);
		});

		it("cumulatively removes all set values from all row and block siblings", function () {
			var a = new jsobj.Cell(),
				b = new jsobj.Cell(),
				c = new jsobj.Cell(),
				z = new jsobj.Cell(),
				rowH = new jsobj.CellGroup(),
				rowV = new jsobj.CellGroup(),
				block = new jsobj.CellGroup(),
				poss;

			z.setRowH(rowH);
			z.setRowV(rowV);
			z.setBlock(block);
			a.setRowH(rowH);
			b.setRowV(rowV);
			c.setBlock(block);
			a.setValue(1);
			b.setValue(2);
			c.setValue(3);
			poss = z.possibleValues();
			expect(poss.length).toBe(6);
			expect(poss[0]).toBe(4);
			expect(poss[1]).toBe(5);
			expect(poss[2]).toBe(6);
		});

		it("sets the value of a cell when one remaining possible value exists", function () {
			var cells = [], row, i;

			function stateStub() {
				return 'ready';
			}
			row = new jsobj.CellGroup();
			for (i = 0; i < 9; i++) {
				cells.push(new jsobj.Cell({ state: stateStub }));
				cells[i].setRowH(row);
			}
			for (i = 0; i < 8; i++) {
				cells[i].setValue(i + 1);
			}
			expect(cells[8].value()).toBe(9);
		});
	});

	describe("Cell coords function", function () {
		var r = new jsobj.CellGroup('row', 4, {}),
			c = new jsobj.CellGroup('col', 8, {}),
			x = new jsobj.Cell({});

		it("returns empty array before row and col are set", function () {
			expect(x.coords().length).toBe(0);
		});

		it("returns array of 2 numbers once row and col are set", function () {
			x.setRowH(r);
			x.setRowV(c);
			expect(x.coords().length).toBe(2);
		});

		it("returns [ row, col ] numbers once row and col are set", function () {
			expect(x.coords()[0]).toBe(4);
			expect(x.coords()[1]).toBe(8);
		});
	});
}());