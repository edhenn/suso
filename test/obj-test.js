/*global describe, it, test, expect */

(function () {
	"use strict";

	describe("EventAware and derived objects", function () {
		var x = new test.EventAware();

		it("has a .on function", function () {
			expect(x.on).toBeDefined();
			expect(typeof x.on).toBe("function");
		});
		
		it("has a .off function", function () {
			expect(x.off).toBeDefined();
			expect(typeof x.off).toBe("function");
		});

		it("has a .trigger function", function () {
			expect(x.trigger).toBeDefined();
			expect(typeof x.trigger).toBe("function");
		});
	});
}());