/*global jsobj, describe, it, expect, beforeEach */
/*jslint plusplus: true */

(function () {
	"use strict";

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
}());