/*global jsobj, describe, it, expect, beforeEach */
/*jslint */

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
					members = members + 1;
				}
			}
			expect(members).toBe(8);
		});
	});

	describe("Cell.value function", function () {
		var x = new jsobj.Cell();

		it("returns undefined before a value is set", function () {
			expect(x.value()).not.toBeDefined();
		});

		it("returns value after a value is set", function () {
			x.setValue(5);
			expect(x.value()).toBe(5);
		});
	});

	describe("Cell.setValue function", function () {
		var x = new jsobj.Cell();

		it("sets Cell.value when currently undefined", function () {
			expect(x.value()).not.toBeDefined();
			x.setValue(6);
			expect(x.value()).toBe(6);
		});

		it("throws an error when called if Cell.value is already defined", function () {
			expect(function () { x.setValue(7); }).toThrow(new Error("Attempt to set value on a Cell that already has a value."));
		});
	});

	describe("Cell.rowH", function () {
	});

}());