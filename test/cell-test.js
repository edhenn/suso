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

	describe("Cell.value function", function () {
		var x = new jsobj.Cell();

		it("is a member", function () {
			expect(x.value).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof x.value).toBe("function");
		});

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

		it("is a member", function () {
			expect(x.setValue).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof x.setValue).toBe("function");
		});

		it("sets Cell.value when currently undefined", function () {
			expect(x.value()).not.toBeDefined();
			x.setValue(6);
			expect(x.value()).toBe(6);
		});

		xit("throws an error when called if Cell.value already defined", function () {
			expect(x.setValue(7)).toThrow();
		});
	});
}());