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

	describe("Array.contains member", function () {
		var arr = [];

		it("exists on the prototype", function () {
			expect(arr.contains).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof arr.contains).toBe('function');
		});

		it("does not find objects in an empty array", function () {
			expect(arr.contains('x')).toBe(false);
		});

		it("does not find type-coerced objects in an array", function () {
			arr.push(1);
			expect(arr.contains('1')).toBe(false);
		});

		it("finds type-equivalent objects in first array position", function () {
			arr.push(1, 2, 3);
			expect(arr.contains(1)).toBe(true);
		});

		it("finds type-equivalent objects in last array position", function () {
			arr.push(1, 2, 3);
			expect(arr.contains(3)).toBe(true);
		});
	});

	describe("Array.where member", function () {
		var arr = [];

		it("exists on the prototype", function () {
			expect(arr.where).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof arr.where).toBe('function');
		});

		it("throws an exception when no function is passed", function () {
			expect(function () { arr.where(); }).toThrow(new Error("Where function not specified"));
		});

		it("throws an exception when non-function is passed", function () {
			expect(function () { arr.where(0); }).toThrow(new Error("Where function not specified"));
		});

		it("returns all elements of array when function returns true", function () {
			var source = [1, 2], result;

			result = source.where(function () { return true; });

			expect(result.length).toBe(2);
			expect(result).toEqual(source);
		});

		it("returns empty array when function returns false", function () {
			var source = [1, 2], result;

			result = source.where(function () { return false; });

			expect(result.length).toBe(0);
			expect(result).toEqual([]);
		});

		it("returns expected array elements when function filters by element", function () {
			var source = [1, 2], result;

			result = source.where(function (el) { return el === 1; });

			expect(result.length).toBe(1);
			expect(result).toEqual([1]);
		});

		it("returns expected array elements when function filters by index", function () {
			var source = [1, 2], result;

			result = source.where(function (el, idx) { return idx === 1; });

			expect(result.length).toBe(1);
			expect(result).toEqual([2]);
		});
	});

	describe("EventAware object", function () {
		var x = jsobj.EventAware({});

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