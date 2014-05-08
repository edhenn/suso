/*global jsobj, describe, it, expect, beforeEach */
/*jslint plusplus: true */

//var jsobj = {};

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

	describe("Cell object members", function () {
		var x = new jsobj.Cell();

		it("has a .value member", function () {
			expect(x.value).toBeDefined();
		});

		it("has a .setValue member", function () {
			expect(x.setValue).toBeDefined();
		});

		it("has a .rowH member member", function () {
			expect(x.rowH).toBeDefined();
		});

		it("has a .setRowH member member", function () {
			expect(x.setRowH).toBeDefined();
		});

		it("has a .rowV member member", function () {
			expect(x.rowV).toBeDefined();
		});

		it("has a .setRowV member member", function () {
			expect(x.setRowV).toBeDefined();
		});

		it("has a .block member member", function () {
			expect(x.block).toBeDefined();
		});

		it("has a .setBlock member member", function () {
			expect(x.setBlock).toBeDefined();
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
			var rowH = {};
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
			var rowV = {};
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
			var block = {};
			x.setBlock(block);
			expect(x.block()).toBe(block);
		});

		it(".setBlock throws an error when called if .block is already defined", function () {
			expect(function () { x.setBlock({}); })
				.toThrow(new Error("Attempt to set block on a Cell that already has a block."));
		});
	});
}());