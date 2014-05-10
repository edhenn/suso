/*global jsobj, describe, it, expect, beforeEach */
/*jslint plusplus: true */

(function () {
	"use strict";

	describe("jsobj namespace", function () {
		it("is defined", function () {
			expect(jsobj).toBeDefined();
		});

		it("has an EventAware function", function () {
			expect(jsobj.EventAware).toBeDefined();
			expect(typeof jsobj.EventAware).toBe("function");
		});
	});

	describe("EventAware object", function () {
		var x = jsobj.EventAware({});

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
		var timesCalled, watched;

		beforeEach(function () {
			timesCalled = 0;
			watched = jsobj.EventAware({});

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

	describe("EventAware-derived object", function () {
		var derived, timesCalled;

		beforeEach(function () {
			timesCalled = 0;
			derived = jsobj.EventAware({});

			derived.on("blink", function () {
				timesCalled++;
			});
		});

		it("executes callback function when a subscribed event is fired", function () {
			derived.trigger("blink");
			expect(timesCalled).toBe(1);
		});

		it("does not execute callback function when a non-subscribed event is fired", function () {
			derived.trigger("blonk");
			expect(timesCalled).toBe(0);
		});

		it("does not execute callback function when a subscribed event is subsequently unsubscribed", function () {
			derived.off("blink");
			derived.trigger("blink");
			expect(timesCalled).toBe(0);
		});
	});

	describe("multiple event-aware objects", function () {
		var watched, watchedCalled, notWatched, notWatchedCalled;

		beforeEach(function () {
			watchedCalled = 0;
			watched = jsobj.EventAware({});
			watched.on("blink", function () {
				watchedCalled++;
			});

			notWatchedCalled = 0;
			notWatched = jsobj.EventAware({});
		});

		it("executes callback function only on the subscribed object when event is fired", function () {
			watched.trigger("blink");
			notWatched.trigger("blink");
			expect(watchedCalled).toBe(1);
			expect(notWatchedCalled).toBe(0);
		});
	});

	describe("trigger method", function () {
		var watched, triggeredValue;

		beforeEach(function () {
			watched = jsobj.EventAware({});
			triggeredValue = null;
		});

		it("passes one trigger argument to callback", function () {
			watched.on("blink", function (val1) {
				triggeredValue = val1;
			});
			watched.trigger("blink", "blue");
			expect(triggeredValue).toBe("blue");
		});

		it("passes two trigger arguments to callback", function () {
			watched.on("blink", function (val1, val2) {
				triggeredValue = val1 + val2;
			});
			watched.trigger("blink", 2, 3);
			expect(triggeredValue).toBe(5);
		});

		// sets `this` to the triggering object
		it("sets `this` to the triggering object", function () {
			watched.on("blink", function () {
				triggeredValue = this;
			});
			watched.trigger("blink");
			expect(triggeredValue).toBe(watched);
		});
	});
}());