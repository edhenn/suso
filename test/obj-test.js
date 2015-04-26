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

	describe("EventAware object", function () {
		var x = new suso.EventAware({});

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

		function timesCalledIncrement() {
			timesCalled++;
		}

		beforeEach(function () {
			timesCalled = 0;
			watched = new suso.EventAware({});

			watched.on("blink", timesCalledIncrement);
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
			watched.off("blink", timesCalledIncrement);
			watched.trigger("blink");
			expect(timesCalled).toBe(0);
		});

		it(".off only unsubscribes specified event", function () {
			var blonkCalled = 0;

			function blonkIncrement() {
				blonkCalled++;
			}

			watched.on("blonk", blonkIncrement);
			watched
				.trigger("blink")
				.trigger("blonk")
				.off("blonk", blonkIncrement)
				.trigger("blink")
				.trigger("blonk");
			expect(timesCalled).toBe(2);
			expect(blonkCalled).toBe(1);
		});
	});

	describe("EventAware-derived object", function () {
		var derived, timesCalled;

		function blinkIncrement() {
			timesCalled++;
		}

		beforeEach(function () {
			timesCalled = 0;
			derived = new suso.EventAware({});

			derived.on("blink", blinkIncrement);
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
			derived.off("blink", blinkIncrement);
			derived.trigger("blink");
			expect(timesCalled).toBe(0);
		});

		it("unsubscribes only the function requested, not all subscribed to same event", function () {
			var anotherSubCalled = 0;

			function anotherSub() {
				anotherSubCalled++;
			}
			derived.on("blink", anotherSub);

			// iterate both timesCalled and anotherSubCalled
			derived.trigger("blink");
			derived.off("blink", anotherSub);
			derived.trigger("blink");

			expect(timesCalled).toBe(2);
			expect(anotherSubCalled).toBe(1);
		});
	});

	describe("multiple event-aware objects", function () {
		var watched, watchedCalled, notWatched, notWatchedCalled;

		beforeEach(function () {
			watchedCalled = 0;
			watched = new suso.EventAware({});
			watched.on("blink", function () {
				watchedCalled++;
			});

			notWatchedCalled = 0;
			notWatched = new suso.EventAware({});
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
			watched = new suso.EventAware({});
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

	describe("off method", function () {
		var watched;

		beforeEach(function () {
			watched = new suso.EventAware({});
		});

		it("ignores calls for unwatched eventname without throwing error", function () {
			var returnVal = watched.off("not-an-event");
			expect(returnVal).toBe(watched);
		});

		it("ignores calls with unregistered callbacks without throwing error", function () {
			var returnVal;

			function aCallback() {
				return true;
			}

			function notACallback() {
				return false;
			}

			watched.on("anEvent", aCallback);
			returnVal = watched.off("anEvent", notACallback);

			expect(returnVal).toBe(watched);
		});
	});
}());
