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

	suso.sets = function (source, size, val) {
		var result = [], subsets, arr;

		if (source === undefined || source === null || typeof source !== "object") {
			throw new Error("source parameter is not an object or array");
		}

		if (source instanceof Array) {
			arr = source;
		} else {
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
			arr = Object.keys(source);			// use above polyfill on older browsers
		}

		if (size === undefined || size === null || typeof size !== "number") {
			throw new Error("size parameter is not a valid number");
		}

		// val becomes identity function if not passed in
		if (val === undefined) { val = function (el) { return el; }; }

		if (typeof val !== "function") {
			throw new Error("val parameter is not a function");
		}

		if (size === 0 || size > arr.length) {
			return result;
		}

		if (size === 1 || size === arr.length) {
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
				if (val(subset[0]) > val(el)) {		// create combinations, not permutations
					result.push([el].concat(subset));
				}
			});
		});

		return result;
	};
}(suso));
