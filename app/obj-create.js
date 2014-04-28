// Crockford Object.create -- http://javascript.crockford.com/prototypal.html
(function () {
	"use strict";

	if (typeof Object.create !== 'function') {
		Object.create = function (o) {
			function F() {}
			F.prototype = o;
			return new F();
		};
	}
}());