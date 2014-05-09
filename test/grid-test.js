/*global jsobj, describe, it, expect, beforeEach */
/*jslint plusplus: true */

(function () {
	"use strict";

	describe("Grid object", function () {
		it("exists in jsobj namespace", function () {
			expect(jsobj.Grid).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof jsobj.Grid).toBe("function");
		});
	});

	describe("Cell object members", function () {
		var x = new jsobj.Grid();

		it("has a .vRow member", function () {
			expect(x.vRow).toBeDefined();
		});

		it("has a .hRow member", function () {
			expect(x.hRow).toBeDefined();
		});

		it("has a .block member", function () {
			expect(x.block).toBeDefined();
		});
	});
}());