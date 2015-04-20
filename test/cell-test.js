/*global suso, describe, it, xit, expect, beforeEach */
/*jslint plusplus: true */

(function () {
	"use strict";

	describe("Cell object", function () {
		it("exists in suso namespace", function () {
			expect(suso.Cell).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof suso.Cell).toBe("function");
		});
	});

	describe("Event-Aware Cell object members", function () {
		var x = new suso.Cell();

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

		it(".col member is a function", function () {
			expect(typeof x.col).toBe("function");
		});

		it(".block member is a function", function () {
			expect(typeof x.block).toBe("function");
		});

		it(".setHouse member is a function", function () {
			expect(typeof x.setHouse).toBe("function");
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

		it(".possibleFlags member is a function", function () {
			expect(typeof x.possibleFlags).toBe("function");
		});

		it(".grid member is a function", function () {
			expect(typeof x.grid).toBe("function");
		});

		it(".coords member is a function", function () {
			expect(typeof x.coords).toBe("function");
		});

		it(".removePossible is a function", function () {
			expect(typeof x.removePossible).toBe("function");
		});

		it(".possibles is a member", function () {
			expect(x.possibles).toBeDefined();
		});

		it(".isSeed is a member", function () {
			expect(x.isSeed).toBeDefined();
		});

		it(".isSeed is a function", function () {
			expect(typeof x.isSeed).toBe("function");
		});

		it(".release is a member", function () {
			expect(x.release).toBeDefined();
		});

		it(".release is a function", function () {
			expect(typeof x.release).toBe("function");
		});

		it("has 18 non-prototype members", function () {
			var members = 0, prop;

			for (prop in x) {
				if (x.hasOwnProperty(prop) && prop !== "prototype") {
					members++;
				}
			}
			expect(members).toBe(18);
		});
	});

	describe("Cell.value and setValue functions", function () {
		var x = new suso.Cell({ state: function (x) { return x; }});

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
			y = new suso.Cell({ state: function (x) { return x; }});
			y.on("update", function () {
				z = this;
			});
			y.setValue(4);
			expect(z).toBe(y);
		});
	});

	describe("Cell.setHouse function", function () {
		var x = new suso.Cell();

		it("throws an error when called if house.type() is not row, col, or block", function () {
			var badHouse = { type: function () { return "wrong"; }};

			expect(function () { x.setHouse(badHouse); })
				.toThrow(new Error("invalid house"));
		});
	});

	describe("Cell.row and setHouse(row) functions", function () {
		var x = new suso.Cell();

		it(".row returns undefined before a value is set", function () {
			expect(x.row()).not.toBeDefined();
		});

		it(".row returns correct object after .setHouse(row) is called", function () {
			var row = new suso.House("row");
			x.setHouse(row);
			expect(x.row()).toBe(row);
		});

		it(".setHouse(row) throws an error when called if .row is already defined", function () {
			expect(function () { x.setHouse(new suso.House("row")); })
				.toThrow(new Error("Attempt to set row on a Cell that already has a row."));
		});
	});

	describe("Cell.col and setHouse(col) functions", function () {
		var x = new suso.Cell();

		it(".col returns undefined before a value is set", function () {
			expect(x.col()).not.toBeDefined();
		});

		it(".col returns correct object after .setHouse(col) is called", function () {
			var col = new suso.House("col");
			x.setHouse(col);
			expect(x.col()).toBe(col);
		});

		it(".setHouse(col) throws an error when called if .col is already defined", function () {
			expect(function () { x.setHouse(new suso.House("col")); })
				.toThrow(new Error("Attempt to set col on a Cell that already has a col."));
		});
	});

	describe("Cell.block and setHouse(block) functions", function () {
		var x = new suso.Cell();

		it(".block returns undefined before a value is set", function () {
			expect(x.block()).not.toBeDefined();
		});

		it(".block returns correct object after .setHouse(block) is called", function () {
			var block = new suso.House("block");
			x.setHouse(block);
			expect(x.block()).toBe(block);
		});

		it(".setHouse(block) throws an error when called if .block is already defined", function () {
			expect(function () { x.setHouse(new suso.House("block")); })
				.toThrow(new Error("Attempt to set block on a Cell that already has a block."));
		});
	});

	describe("Cell.possibleValues function", function () {
		var x = new suso.Cell({ state: function (x) { return x; }});

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
			var y = new suso.Cell({ state: function (x) { return x; }}),
				z = new suso.Cell(),
				row = new suso.House("row"),
				poss;

			y.setHouse(row);
			z.setHouse(row);
			y.setValue(4);
			poss = z.possibleValues();
			expect(poss.length).toBe(8);
			expect(poss[2]).toBe(3);
			expect(poss[3]).toBe(5);
		});

		it("returns array with setValue missing from other cells in col", function () {
			var y = new suso.Cell({ state: function (x) { return x; }}),
				z = new suso.Cell(),
				row = new suso.House("col"),
				poss;

			y.setHouse(row);
			z.setHouse(row);
			y.setValue(4);
			poss = z.possibleValues();
			expect(poss.length).toBe(8);
			expect(poss[2]).toBe(3);
			expect(poss[3]).toBe(5);
		});

		it("returns array with setValue missing from other cells in block", function () {
			var y = new suso.Cell({ state: function (x) { return x; }}),
				z = new suso.Cell(),
				row = new suso.House("block"),
				poss;

			y.setHouse(row);
			z.setHouse(row);
			y.setValue(4);
			poss = z.possibleValues();
			expect(poss.length).toBe(8);
			expect(poss[2]).toBe(3);
			expect(poss[3]).toBe(5);
		});

		it("cumulatively removes all set values from all row and block siblings", function () {
			var a = new suso.Cell({ state: function (x) { return x; }}),
				b = new suso.Cell({ state: function (x) { return x; }}),
				c = new suso.Cell({ state: function (x) { return x; }}),
				z = new suso.Cell(),
				row = new suso.House("row"),
				col = new suso.House("col"),
				block = new suso.House("block"),
				poss;

			z.setHouse(row);
			z.setHouse(col);
			z.setHouse(block);
			a.setHouse(row);
			b.setHouse(col);
			c.setHouse(block);
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
				return "ready";
			}
			row = new suso.House("row");
			for (i = 0; i < 9; i++) {
				cells.push(new suso.Cell({ state: stateStub }));
				cells[i].setHouse(row);
			}
			for (i = 0; i < 8; i++) {
				cells[i].setValue(i + 1);
			}
			expect(cells[8].value()).toBe(9);
		});
	});

	describe("Cell.possibleFlags function", function () {
		var x = new suso.Cell({ state: function (x) { return x; }});

		it("starts as 9 binary flags all set", function () {
			var poss = x.possibleFlags();
			expect(poss).toBe(Math.pow(2, 9) - 1);
		});

		it("returns 0 once .setValue is called", function () {
			var poss;
			x.setValue(4);
			poss = x.possibleFlags();
			expect(poss).toBe(0);
		});

		it("returns flags with setValue missing from other cells in row", function () {
			var y = new suso.Cell({ state: function (x) { return x; }}),
				z = new suso.Cell(),
				row = new suso.House("row"),
				poss;

			y.setHouse(row);
			z.setHouse(row);
			y.setValue(4);
			poss = z.possibleFlags();
			expect(poss).toBe((Math.pow(2, 9) - 1) - Math.pow(2, 5));	// 111011111
		});

		it("returns array with setValue missing from other cells in col", function () {
			var y = new suso.Cell({ state: function (x) { return x; }}),
				z = new suso.Cell(),
				row = new suso.House("col"),
				poss;

			y.setHouse(row);
			z.setHouse(row);
			y.setValue(4);
			poss = z.possibleFlags();
			expect(poss).toBe((Math.pow(2, 9) - 1) - Math.pow(2, 5));	// 111011111
		});

		it("returns array with setValue missing from other cells in block", function () {
			var y = new suso.Cell({ state: function (x) { return x; }}),
				z = new suso.Cell(),
				row = new suso.House("block"),
				poss;

			y.setHouse(row);
			z.setHouse(row);
			y.setValue(4);
			poss = z.possibleFlags();
			expect(poss).toBe((Math.pow(2, 9) - 1) - Math.pow(2, 5));	// 111011111
		});

		it("cumulatively removes all set values from all row and block siblings", function () {
			var a = new suso.Cell({ state: function (x) { return x; }}),
				b = new suso.Cell({ state: function (x) { return x; }}),
				c = new suso.Cell({ state: function (x) { return x; }}),
				z = new suso.Cell(),
				row = new suso.House("row"),
				col = new suso.House("col"),
				block = new suso.House("block"),
				poss;

			z.setHouse(row);
			z.setHouse(col);
			z.setHouse(block);
			a.setHouse(row);
			b.setHouse(col);
			c.setHouse(block);
			a.setValue(1);
			b.setValue(2);
			c.setValue(3);
			poss = z.possibleFlags();
			expect(poss).toBe((Math.pow(2, 6) - 1));	// 000111111
		});
	});

	describe("Cell coords function", function () {
		var r = new suso.House("row", 4, {}),
			c = new suso.House("col", 8, {}),
			x = new suso.Cell({});

		it("returns empty array before row and col are set", function () {
			expect(x.coords().length).toBe(0);
		});

		it("returns array of 2 numbers once row and col are set", function () {
			x.setHouse(r);
			x.setHouse(c);
			expect(x.coords().length).toBe(2);
		});

		it("returns [ row, col ] numbers once row and col are set", function () {
			expect(x.coords()[0]).toBe(4);
			expect(x.coords()[1]).toBe(8);
		});
	});

	describe("Cell seed function", function () {
		it("returns true when cell value is set during grid seeding", function () {
			var cel = new suso.Cell({ state: function () { return "unseeded"; }});

			cel.setValue(1);
			expect(cel.isSeed()).toBe(true);
		});

		it("returns false when cell value is set after grid already seeded", function () {
			var cel = new suso.Cell({ state: function () { return "ready"; }});

			cel.setValue(1);
			expect(cel.isSeed()).toBe(false);
		});
	});
}());
