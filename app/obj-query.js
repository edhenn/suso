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
			if (obj.hasOwnProperty(index) && index !== "where" && index !== "each") {
				if (fn(obj[index], index)) {
					result[index] = obj[index];
				}
			}
		}

		return result;
	};

		// object.each
	suso.forEach = function (obj, fn) {
		var index, eachResult, result = {};

		if (obj === undefined || typeof obj !== "object") {
			throw new Error("ForEach object not specified");
		}

		if (fn === undefined || typeof fn !== "function") {
			throw new Error("ForEach function not specified");
		}

		for (index in obj) {
			if (obj.hasOwnProperty(index) && index !== "where" && index !== "each") {
				eachResult = fn(obj[index], index);
				result[index] = (eachResult || obj[index]);
			}
		}

		return result;
	};
}(suso));
