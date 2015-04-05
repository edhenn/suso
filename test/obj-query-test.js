/*global suso, describe, it, expect, beforeEach */
/*jslint plusplus: true */

(function () {
	"use strict";

	describe("suso.filter member", function () {
		var emptyObj = {}, sourceObj = { a: 3, b: 4 };

		it("exists in suso namespace", function () {
			expect(suso.filter).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof suso.filter).toBe("function");
		});

		it("throws an exception when no object is passed", function () {
			expect(function () { suso.filter(); }).toThrow(new Error("Filter object not specified"));
		});

		it("throws an exception when non-object is passed", function () {
			expect(function () { suso.filter(0); }).toThrow(new Error("Filter object not specified"));
		});

		it("throws an exception when no function is passed", function () {
			expect(function () { suso.filter({}); }).toThrow(new Error("Filter function not specified"));
		});

		it("throws an exception when non-function is passed", function () {
			expect(function () { suso.filter({}, 0); }).toThrow(new Error("Filter function not specified"));
		});

		it("returns object with all properties when function always returns true", function () {
			var result;

			result = suso.filter(sourceObj, function () { return true; });

			expect(result).toEqual(sourceObj);
		});

		it("returns object with no properties when function always returns false", function () {
			var result;

			result = suso.filter(sourceObj, function () { return false; });

			expect(result).toEqual(emptyObj);
		});

		it("returns object with expected properties when function filters by value", function () {
			var result;

			result = suso.filter(sourceObj, function (el) { return el === 3; });

			expect(result).toEqual({ a: 3 });
		});

		it("returns object with expected properties when function filters by index", function () {
			var result;

			result = suso.filter(sourceObj, function (el, idx) { return idx === "b"; });

			expect(result).toEqual({ b: 4 });
		});
	});

	describe("suso.forEach member", function () {
		var emptyObj = {}, fullObj = { a: 1, b: 2, c: 3 };

		it("exists on the suso namespace", function () {
			expect(suso.forEach).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof suso.forEach).toBe("function");
		});

		it("throws an exception when no object is passed", function () {
			expect(function () { suso.forEach(); }).toThrow(new Error("ForEach object not specified"));
		});

		it("throws an exception when non-object is passed", function () {
			expect(function () { suso.forEach(0); }).toThrow(new Error("ForEach object not specified"));
		});

		it("throws an exception when no function is passed", function () {
			expect(function () { suso.forEach({}); }).toThrow(new Error("ForEach function not specified"));
		});

		it("throws an exception when non-function is passed", function () {
			expect(function () { suso.forEach({}, 0); }).toThrow(new Error("ForEach function not specified"));
		});

		it("calls function for each property of object", function () {
			var count = 0;

			suso.forEach(fullObj, function () { count++; });

			expect(count).toBe(3);
		});

		it("returns copy of source obj when no value returned from passed function", function () {
			var result, count = 0;

			result = suso.forEach(fullObj, function (el) { count++; });

			expect(result).toEqual(fullObj);	// it's a new object with the same properties.
			expect(result).not.toBe(fullObj);	// it's not the same object.
		});

		it("returns mapped properties when value is returned from passed function", function () {
			var result;

			result = suso.forEach(fullObj, function (el) { return el * 2; });

			expect(result).toEqual({ a: 2, b: 4, c: 6 });
		});
	});
}());
