/*global jsobj */
/*jslint */

(function (jsobj) {
	"use strict";

	function Block() {
	}

	Block.prototype = new jsobj.EventAware();

	jsobj.Block = function () {
		return new Block();
	};
}(jsobj));