/*global jsobj */
/*jslint */

(function (jsobj) {
	"use strict";

	function Row() {
	}

	Row.prototype = new jsobj.EventAware();

	jsobj.Row = function () {
		return new Row();
	};
}(jsobj));