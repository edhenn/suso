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

	describe("Grid object members", function () {
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

		it("has an .allGroups member", function () {
			expect(x.allGroups).toBeDefined();
		});

		it(".vRow member is a function", function () {
			expect(typeof x.vRow).toBe('function');
		});

		it(".hRow member is a function", function () {
			expect(typeof x.hRow).toBe('function');
		});

		it(".block member is a function", function () {
			expect(typeof x.block).toBe('function');
		});

		it(".allGroups member is a function", function () {
			expect(typeof x.allGroups).toBe('function');
		});

		it("has 4 non-prototype members", function () {
			var members = 0, prop;

			for (prop in x) {
				if (x.hasOwnProperty(prop) && prop !== 'prototype') {
					members++;
				}
			}
			expect(members).toBe(4);
		});
	});
}());