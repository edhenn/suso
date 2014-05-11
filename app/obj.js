/*jslint undef: true, newcap: true, nomen: true, regexp: true, plusplus: true, bitwise: true, maxerr: 50, indent: 4 */

var jsobj = {};

(function (jsobj) {
	"use strict";

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
			subscribers[eventName].push({ subscriber: this, callback: func });
			return obj;
		};

		// off allows an object to remove itself from list of events
		obj.off = function (eventName) {
			var i, found;
			// make sure there is a list of subscribers for this eventName
			if (subscribers[eventName] === undefined) {
				return;
			}
			// check all subscribers to this eventName for the calling object
			for (i = 0; i < subscribers[eventName].length; i = i + 1) {
				if (subscribers[eventName][i].subscriber === this) {
					found = i;
					break;
				}
			}
			// found the calling object as a subscriber, remove it from the array
			if (found !== undefined) {
				subscribers[eventName].splice(found, 1);
			}
			return obj;
		};

		// trigger all functions subscribed to the eventName. pass in the object doing the triggering.
		obj.trigger = function (eventName) {
			var i, sub;
			if (subscribers[eventName] === undefined) {
				return;
			}
			if (arguments !== undefined) {
				Array.prototype.splice.call(arguments, 0, 1);
			}
			for (i = 0; i < subscribers[eventName].length; i = i + 1) {
				sub = subscribers[eventName][i];
				if (sub.callback !== undefined && sub.subscriber !== undefined) {
					sub.callback.apply(this, arguments);
				}
			}
			return obj;
		};

		return obj;
	};
}(jsobj));