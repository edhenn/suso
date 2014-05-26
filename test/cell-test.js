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

		it(".row member is a function", function () {
			expect(typeof x.row).toBe("function");
		});

		it(".setRow member is a function", function () {
			expect(typeof x.setRow).toBe("function");
		});

		it(".col member is a function", function () {
			expect(typeof x.col).toBe("function");
		});

		it(".setCol member is a function", function () {
			expect(typeof x.setCol).toBe("function");
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

		it(".removePossible is a function", function () {
			expect(typeof x.removePossible).toBe('function');
		});

		it(".possibles is a member", function () {
			expect(x.possibles).toBeDefined;
		});

		it("has 17 non-prototype members", function () {
			var members = 0, prop;

			for (prop in x) {
				if (x.hasOwnProperty(prop) && prop !== 'prototype') {
					members++;
				}
			}
			expect(members).toBe(17);
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

	describe("Cell.row and setRow functions", function () {
		var x = new jsobj.Cell();

		it(".row returns undefined before a value is set", function () {
			expect(x.row()).not.toBeDefined();
		});

		it(".row returns correct object after .setRow is called", function () {
			var row = new jsobj.CellGroup();
			x.setRow(row);
			expect(x.row()).toBe(row);
		});

		it(".setRow throws an error when called if .row is already defined", function () {
			expect(function () { x.setRow({}); })
				.toThrow(new Error("Attempt to set row on a Cell that already has a row."));
		});
	});

	describe("Cell.col and setCol functions", function () {
		var x = new jsobj.Cell();

		it(".col returns undefined before a value is set", function () {
			expect(x.col()).not.toBeDefined();
		});

		it(".col returns correct object after .setCol is called", function () {
			var col = new jsobj.CellGroup();
			x.setCol(col);
			expect(x.col()).toBe(col);
		});

		it(".setCol throws an error when called if .col is already defined", function () {
			expect(function () { x.setCol({}); })
				.toThrow(new Error("Attempt to set col on a Cell that already has a col."));
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

		it("returns array with setValue missing from other cells in row", function () {
			var y = new jsobj.Cell(),
				z = new jsobj.Cell(),
				row = new jsobj.CellGroup(),
				poss;

			y.setRow(row);
			z.setRow(row);
			y.setValue(4);
			poss = z.possibleValues();
			expect(poss.length).toBe(8);
			expect(poss[2]).toBe(3);
			expect(poss[3]).toBe(5);
		});

		it("returns array with setValue missing from other cells in col", function () {
			var y = new jsobj.Cell(),
				z = new jsobj.Cell(),
				row = new jsobj.CellGroup(),
				poss;

			y.setCol(row);
			z.setCol(row);
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
				row = new jsobj.CellGroup(),
				col = new jsobj.CellGroup(),
				block = new jsobj.CellGroup(),
				poss;

			z.setRow(row);
			z.setCol(col);
			z.setBlock(block);
			a.setRow(row);
			b.setCol(col);
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
				cells[i].setRow(row);
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
			x.setRow(r);
			x.setCol(c);
			expect(x.coords().length).toBe(2);
		});

		it("returns [ row, col ] numbers once row and col are set", function () {
			expect(x.coords()[0]).toBe(4);
			expect(x.coords()[1]).toBe(8);
		});
	});
}());