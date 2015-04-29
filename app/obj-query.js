/*global suso */

(function (suso) {
	"use strict";

	suso.filter = function (obj, fn) {
		var index, result = {};

		if (obj === undefined || typeof obj !== "object") {
			throw new Error("Filter object not specified");
		}

		if (fn === undefined || typeof fn !== "function") {
			throw new Error("Filter function not specified");
		}

		for (index in obj) {
			if (obj.hasOwnProperty(index)) {
				if (fn(obj[index], index)) {
					result[index] = obj[index];
				}
			}
		}

		return result;
	};

	suso.forEach = function (obj, fn) {
		var index, eachResult, result = {};

		if (obj === undefined || typeof obj !== "object") {
			throw new Error("ForEach object not specified");
		}

		if (fn === undefined || typeof fn !== "function") {
			throw new Error("ForEach function not specified");
		}

		for (index in obj) {
			if (obj.hasOwnProperty(index)) {
				eachResult = fn(obj[index], index);
				result[index] = (eachResult || obj[index]);
			}
		}

		return result;
	};

	suso.sets = function (arr, size, val) {
		var result = [], subsets;

		if (arr === undefined || arr === null || typeof arr !== "object" || !(arr instanceof Array)) {
			throw new Error("arr parameter is not an array");
		}

		if (size === undefined || size === null || typeof size !== "number") {
			throw new Error("size parameter is not a valid number");
		}

		// val becomes identity function if not passed in
		if (val === undefined) { val = function (el) { return el; }; }

		if (typeof val !== "function") {
			throw new Error("val parameter is not a function");
		}

		if (size === 0) {
			return result;
		}

		if (size === 1) {
			return arr;
		}

		// recursive exit condition == pairs
		if (size === 2) {
			arr.forEach(function (el, idx) {
				arr.filter(function (otherEl, otherIdx) {
					return otherIdx > idx;
				}).forEach(function (otherEl) {
					result.push([el, otherEl]);
				});
			});

			return result;
		}

		// recursively call for > 2 elements
		subsets = suso.sets(arr, size - 1);
		arr.forEach(function (el) {
			subsets.forEach(function (subset) {
				if (subset[0] > el) {
					result.push([el].concat(subset));
				}
			});
		});

		return result;
	};
}(suso));
