/*jslint undef: true, newcap: true, nomen: true, regexp: true, plusplus: true, bitwise: true, maxerr: 50, indent: 4 */

var jsobj = {};

(function (jsobj) {
	"use strict";

	// add bool Array.contains method
	if (Array.prototype.contains === undefined) {
		Array.prototype.contains = function (obj) {
			var item = this.length;
			while (item--) {
				if (this[item] === obj) {
					return true;
				}
			}
			return false;
		};
	}

	// where & each for arrays and objects
	if (Array.prototype.where === undefined) {
		Array.prototype.where = function (fn) {
			var index, result = [];

			if (fn === undefined || typeof fn !== 'function') {
				throw new Error('Where function not specified');
			}

			for (index = 0; index < this.length; index++) {
				if (fn(this[index], index)) {
					result.push(this[index]);
				}
			}

			return result;
		};
	}

	if (Object.prototype.where === undefined) {
		Object.prototype.where = function (fn) {
			var index, result = {};

			if (fn === undefined || typeof fn !== 'function') {
				throw new Error('Where function not specified');
			}

			for (index in this) {
				if (this.hasOwnProperty(index)) {
					if (fn(this[index], index)) {
						result[index] = this[index];
					}
				}
			}

			return result;
		};
	}

	// amend jsobj with an EventAware object with three functions to augment passed in objects with observable methods
	jsobj.EventAware = function (obj) {
		var subscribers = {};

		// .on - registers a callback function to be called when the named event occurs on the object
		obj.on = function (eventName, func) {
			// create a list of subscribers to this event if it doesn't already exist
			if (subscribers[eventName] === undefined) {
				subscribers[eventName] = [];
			}
			// add calling object as a subscriber, along with its function to call on event
			subscribers[eventName].push(func);
			return obj;
		};

		// off allows an object to remove itself from list of events
		obj.off = function (eventName) {
			// make sure there is a list of subscribers for this eventName
			if (subscribers[eventName] === undefined) {
				return;
			}
			// remove subscribers from the array
			subscribers[eventName] = [];
			return obj;
		};

		// trigger all functions subscribed to the eventName.
		obj.trigger = function (eventName) {
			var i, sub, subs = subscribers[eventName];
			if (subs === undefined) {
				return;
			}
			Array.prototype.splice.call(arguments, 0, 1);
			for (i = 0; i < subs.length; i = i + 1) {
				sub = subs[i];
				if (sub !== undefined && typeof sub === 'function') {
					sub.apply(this, arguments);
				}
			}
			return obj;
		};

		return obj;
	};
}(jsobj));