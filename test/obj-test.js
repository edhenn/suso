/*global describe, it, test, expect, beforeEach */
/*jslint plusplus: true */

(function () {
	"use strict";

	describe("test namespace", function () {
		it("is defined", function () {
			expect(test).toBeDefined();
		});

		it("has an EventAware function", function () {
			expect(test.EventAware).toBeDefined();
			expect(typeof test.EventAware).toBe("function");
		});
	});

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

	describe("subscribed event", function () {
		var timesCalled, watched, notWatched;

		beforeEach(function () {
			timesCalled = 0;
			watched = new test.EventAware();

			watched.on("blink", function () {
				timesCalled++;
			});
		});

		it("executes callback function when a subscribed event is fired", function () {
			watched.trigger("blink");
			expect(timesCalled).toBe(1);
		});

		it("does not execute callback function when a non-subscribed event is fired", function () {
			watched.trigger("blonk");
			expect(timesCalled).toBe(0);
		});

		it("does not execute callback function when a subscribed event is subsequently unsubscribed", function () {
			watched.off("blink");
			watched.trigger("blink");
			expect(timesCalled).toBe(0);
		});
	});
}());