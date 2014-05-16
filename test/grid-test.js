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

		it("has an .on member", function () {
			expect(x.on).toBeDefined();
		});

		it("has an .off member", function () {
			expect(x.off).toBeDefined();
		});

		it("has an .trigger member", function () {
			expect(x.trigger).toBeDefined();
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

		it(".on member is a function", function () {
			expect(typeof x.on).toBe('function');
		});

		it(".off member is a function", function () {
			expect(typeof x.off).toBe('function');
		});

		it(".trigger member is a function", function () {
			expect(typeof x.trigger).toBe('function');
		});

		it("has 7 non-prototype members", function () {
			var members = 0, prop;

			for (prop in x) {
				if (x.hasOwnProperty(prop) && prop !== 'prototype') {
					members++;
				}
			}
			expect(members).toBe(7);
		});
	});

	describe("allGroups member", function () {
		var x = new jsobj.Grid(), allgroups, rows = 0, cols = 0, blocks = 0, i;

		it("combines rows, cols, blocks", function () {
			allgroups = x.allGroups();
			for (i = 0; i < allgroups.length; i++) {
				switch (allgroups[i].name().substring(0, 3)) {
				case 'blo':
					blocks++;
					break;
				case 'row':
					rows++;
					break;
				case 'col':
					cols++;
					break;
				}
			}
			expect(i).toBe(27);
			expect(blocks).toBe(9);
			expect(rows).toBe(9);
			expect(cols).toBe(9);
		});
	});
}());