/*global suso, describe, it, expect */
/*jslint plusplus: true */
/*eslint max-lines: 1, no-empty-function: 0, no-unused-vars: ["error", { "varsIgnorePattern": "count" }] */

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

		it("ignores inherited properties", function () {
			var obj, result;

			function Obj() { }
			Obj.prototype = sourceObj;
			obj = new Obj();

			result = suso.filter(obj, function () { return true; });

			expect(obj.a).toBe(3);
			expect(obj.b).toBe(4);
			expect(result).toEqual({});
		});
	});

	describe("suso.forEach member", function () {
		var fullObj = { a: 1, b: 2, c: 3 };

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

			result = suso.forEach(fullObj, function () { count++; });

			expect(result).toEqual(fullObj);	// it's a new object with the same properties.
			expect(result).not.toBe(fullObj);	// it's not the same object.
		});

		it("returns mapped properties when value is returned from passed function", function () {
			var result;

			result = suso.forEach(fullObj, function (el) { return el * 2; });

			expect(result).toEqual({ a: 2, b: 4, c: 6 });
		});

		it("ignores inherited properties", function () {
			var obj, count = 0;

			function Obj() { }
			Obj.prototype = fullObj;
			obj = new Obj();
			obj.x = 0;

			suso.forEach(obj, function () { count++; });

			expect(obj.a).toBe(1);
			expect(obj.b).toBe(2);
			expect(obj.c).toBe(3);
			expect(count).toBe(1);
		});
	});

	describe("suso.sets member", function () {
		it("exists on the namespace", function () {
			expect(suso.sets).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof suso.sets).toBe("function");
		});

		it("throws an error if source parameter is null", function () {
			expect(function () { suso.sets(); }).toThrow(new Error("source parameter is not an object or array"));
		});

		it("throws an error if source parameter is not an object or array", function () {
			expect(function () { suso.sets("x"); }).toThrow(new Error("source parameter is not an object or array"));
		});

		it("throws an error if provided with array but no size", function () {
			expect(function () { suso.sets([]); }).toThrow(new Error("size parameter is not a valid number"));
		});

		it("throws an error if provided with object but no size", function () {
			expect(function () { suso.sets({}); }).toThrow(new Error("size parameter is not a valid number"));
		});

		it("throws an error if size parameter is not a number", function () {
			expect(function () { suso.sets([], "two"); }).toThrow(new Error("size parameter is not a valid number"));
		});

		it("throws an error if val parameter is passed a non-function", function () {
			expect(function () { suso.sets([], 1, "x"); }).toThrow(new Error("val parameter is not a function"));
		});

		it("returns empty array when size > array length", function () {
			expect(suso.sets([1, 2, 3], 4)).toEqual([]);
		});

		it("returns empty array when size > object length", function () {
			expect(suso.sets({ 1: "a", 2: "b", 3: "c" }, 4)).toEqual([]);
		});

		it("returns empty array for array & size 0", function () {
			expect(suso.sets([1, 2, 3], 0)).toEqual([]);
		});

		it("returns empty array for object & size 0", function () {
			expect(suso.sets({ 1: "a", 2: "b", 3: "c" }, 0)).toEqual([]);
		});

		it("returns array for array with size 1", function () {
			expect(suso.sets([1, 2, 3], 1)).toEqual([1, 2, 3]);
		});

		it("returns array of keys for object with size 1", function () {
			expect(suso.sets({ 1: "a", 2: "b", 3: "c" }, 1)).toEqual([ "1", "2", "3" ]);
		});

		it("returns array of array when size == length", function () {
			expect(suso.sets([1, 2, 3], 3)).toEqual([ [1, 2, 3] ]);
		});

		it("returns all pairs for array with size 2", function () {
			expect(suso.sets([1, 2, 3], 2)).toEqual([[1, 2], [1, 3], [2, 3]]);
		});

		it("returns all pairs for object with size 2", function () {
			expect(suso.sets({ 1: "a", 2: "b", 3: "c" }, 2)).toEqual([ ["1", "2"], ["1", "3"], ["2", "3"] ]);
		});

		it("returns all pairs for array with size 2 when array > n+1", function () {
			expect(suso.sets([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5], [3, 4], [3, 5], [4, 5]]);
		});

		it("returns all triplets for array with size 3", function () {
			expect(suso.sets([1, 2, 3, 4], 3)).toEqual([[1, 2, 3], [1, 2, 4], [1, 3, 4], [2, 3, 4]]);
		});

		it("returns all triplets for object with size 3", function () {
			expect(suso.sets({ 1: "a", 2: "b", 3: "c", 4: "d" }, 3)).toEqual([ ["1", "2", "3"], ["1", "2", "4"], ["1", "3", "4"], ["2", "3", "4"] ]);
		});

		it("returns all triplets for array with size 3 when array > n + 1", function () {
			expect(suso.sets([1, 2, 3, 4, 5, 6], 3)).toEqual([
				[1, 2, 3], [1, 2, 4], [1, 2, 5], [1, 2, 6],
				[1, 3, 4], [1, 3, 5], [1, 3, 6],
				[1, 4, 5], [1, 4, 6],
				[1, 5, 6],
				[2, 3, 4], [2, 3, 5], [2, 3, 6],
				[2, 4, 5], [2, 4, 6],
				[2, 5, 6],
				[3, 4, 5], [3, 4, 6],
				[3, 5, 6],
				[4, 5, 6]
			]);
		});

		it("returns all quads for array with size 4", function () {
			expect(suso.sets([1, 2, 3, 4, 5], 4)).toEqual([ [1, 2, 3, 4], [1, 2, 3, 5], [1, 2, 4, 5], [1, 3, 4, 5], [2, 3, 4, 5] ]);
		});

		it("returns all quads for object with size 4", function () {
			expect(suso.sets({ 1: "a", 2: "b", 3: "c", 4: "d", 5: "e" }, 4))
				.toEqual([ ["1", "2", "3", "4"], ["1", "2", "3", "5"], ["1", "2", "4", "5"], ["1", "3", "4", "5"], ["2", "3", "4", "5"] ]);
		});

		it("returns all pairs of three objects when a valid obj-comparison function passed in", function () {
			var obj1 = { name: 1 }, obj2 = { name: 2 }, obj3 = { name: 3 },
				arr = [ obj1, obj2, obj3 ];

			expect(suso.sets(arr, 2, function (el) { return el.name; })).toEqual([ [obj1, obj2], [obj1, obj3], [obj2, obj3] ]);
		});
	});

	describe("suso.union member", function () {
		it("exists on the namespace", function () {
			expect(suso.union).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof suso.union).toBe("function");
		});

		it("returns empty array if no params provided", function () {
			expect(suso.union()).toEqual([]);
		});

		it("returns array of 1 element passed in", function () {
			expect(suso.union("x")).toEqual([ "x" ]);
		});

		it("returns array when 1 array passed in", function () {
			expect(suso.union([1, 2, 3])).toEqual([1, 2, 3]);
		});

		it("returns array of 2 unique elements passed in", function () {
			expect(suso.union("x", "y")).toEqual([ "x", "y" ]);
		});

		it("returns union of 2 unique arrays passed in", function () {
			expect(suso.union([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
		});

		it("returns array ignoring duplicate elements", function () {
			expect(suso.union("x", "y", "x")).toEqual([ "x", "y" ]);
		});

		it("returns union of 2 arrays ignoring duplicate elements", function () {
			expect(suso.union([1, 2, 3], [1, 3, 4])).toEqual([1, 2, 3, 4]);
		});

		it("returns union of multiple mixed arrays and elements", function () {
			expect(suso.union(1, [2, 3], [1, 2, 4], 4, 5, 4, [2, 6])).toEqual([1, 2, 3, 4, 5, 6]);
		});
	});

	describe("suso.isOrdinalArray member", function () {

		it("exists in suso namespace", function () {
			expect(suso.isOrdinalArray).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof suso.isOrdinalArray).toBe("function");
		});

		it("returns false if nothing passed", function () {
			expect(suso.isOrdinalArray()).toBe(false);
		});

		it("returns false if non-object passed", function () {
			expect(suso.isOrdinalArray("x")).toBe(false);
		});

		it("returns false if non-array passed", function () {
			expect(suso.isOrdinalArray({})).toBe(false);
		});

		it("returns false if empty array passed", function () {
			expect(suso.isOrdinalArray([])).toBe(false);
		});

		it("returns false if array contains undefined", function () {
			expect(suso.isOrdinalArray([undefined])).toBe(false);
		});

		it("returns false if array contains nulls", function () {
			expect(suso.isOrdinalArray([null])).toBe(false);
		});

		it("returns false if array contains non-number", function () {
			expect(suso.isOrdinalArray([1, "x"])).toBe(false);
		});

		it("returns false if array contains numbers less than 2", function () {
			expect(suso.isOrdinalArray([1, 2, 3])).toBe(false);
		});

		it("returns false if array contains numbers greater than 5", function () {
			expect(suso.isOrdinalArray([2, 4, 6])).toBe(false);
		});

		it("returns true if array contains numbers in range", function () {
			expect(suso.isOrdinalArray([2, 3, 4, 5])).toBe(true);
		});
	});
}());
