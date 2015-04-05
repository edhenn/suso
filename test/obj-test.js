/*global suso, describe, it, expect, beforeEach */
/*jslint plusplus: true */

(function () {
	"use strict";

	describe("suso namespace", function () {
		it("is defined", function () {
			expect(suso).toBeDefined();
		});

		it("has an EventAware function", function () {
			expect(suso.EventAware).toBeDefined();
			expect(typeof suso.EventAware).toBe("function");
		});
	});

	describe("Object.where member", function () {
		var emptyObj = {}, sourceObj = { a: 3, b: 4 };

		it("exists on the prototype", function () {
			expect(emptyObj.where).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof emptyObj.where).toBe("function");
		});

		it("throws an exception when no function is passed", function () {
			expect(function () { emptyObj.where(); }).toThrow(new Error("Where function not specified"));
		});

		it("throws an exception when non-function is passed", function () {
			expect(function () { emptyObj.where(0); }).toThrow(new Error("Where function not specified"));
		});

		it("returns object with all properties when function always returns true", function () {
			var result;

			result = sourceObj.where(function () { return true; });

			expect(result).toEqual(sourceObj);
		});

		it("returns object with no properties when function always returns false", function () {
			var result;

			result = sourceObj.where(function () { return false; });

			expect(result).toEqual(emptyObj);
		});

		it("returns object with expected properties when function filters by value", function () {
			var result;

			result = sourceObj.where(function (el) { return el === 3; });

			expect(result).toEqual({ a: 3 });
		});

		it("returns object with expected properties when function filters by index", function () {
			var result;

			result = sourceObj.where(function (el, idx) { return idx === "b"; });

			expect(result).toEqual({ b: 4 });
		});
	});

	describe("Object.each member", function () {
		var emptyObj = {}, fullObj = { a: 1, b: 2, c: 3 };

		it("exists on the prototype", function () {
			expect(emptyObj.each).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof emptyObj.each).toBe("function");
		});

		it("throws an exception when no function is passed", function () {
			expect(function () { emptyObj.each(); }).toThrow(new Error("Each function not specified"));
		});

		it("throws an exception when non-function is passed", function () {
			expect(function () { emptyObj.each(0); }).toThrow(new Error("Each function not specified"));
		});

		it("calls function for each property of object", function () {
			var count = 0;

			fullObj.each(function () { count++; });

			expect(count).toBe(3);
		});

		it("returns copy of source obj when no value returned from passed function", function () {
			var result, count = 0;

			result = fullObj.each(function (el) { count++; });

			expect(result).toEqual(fullObj);	// it's a new object with the same properties.
			expect(result).not.toBe(fullObj);	// it's not the same object.
		});

		it("returns mapped properties when value is returned from passed function", function () {
			var result;

			result = fullObj.each(function (el) { return el * 2; });

			expect(result).toEqual({ a: 2, b: 4, c: 6 });
		});
	});

	describe("EventAware object", function () {
		var x = suso.EventAware({});

		it("has a .on function", function () {
			expect(typeof x.on).toBe("function");
		});

		it("has a .off function", function () {
			expect(typeof x.off).toBe("function");
		});

		it("has a .trigger function", function () {
			expect(typeof x.trigger).toBe("function");
		});
	});

	describe("subscribed event", function () {
		var timesCalled, watched;

		beforeEach(function () {
			timesCalled = 0;
			watched = suso.EventAware({});

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

		it(".off only unsubscribes specified event", function () {
			var blonkCalled = 0;
			watched.on("blonk", function () {
				blonkCalled++;
			});
			watched
				.trigger("blink")
				.trigger("blonk")
				.off("blonk")
				.trigger("blink")
				.trigger("blonk");
			expect(timesCalled).toBe(2);
			expect(blonkCalled).toBe(1);
		});
	});

	describe("EventAware-derived object", function () {
		var derived, timesCalled;

		beforeEach(function () {
			timesCalled = 0;
			derived = suso.EventAware({});

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
			watched = suso.EventAware({});
			watched.on("blink", function () {
				watchedCalled++;
			});

			notWatchedCalled = 0;
			notWatched = suso.EventAware({});
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
			watched = suso.EventAware({});
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
