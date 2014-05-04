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
			expect(typeof jsobj.Cell).toBe("object");
		});
	});
}());