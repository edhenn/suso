/*global suso */
/*jslint undef: true, newcap: true, nomen: true, regexp: true, plusplus: true, bitwise: true, maxerr: 50, indent: 4 */

(function (suso) {
	"use strict";

	// amend suso with an EventAware object with three functions to augment passed in objects with observable methods
	suso.EventAware = function (obj) {
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
		obj.off = function (eventName, func) {
			var funcIndex;

			// make sure there is a list of subscribers for this eventName
			if (subscribers[eventName] === undefined) {
				return obj;
			}
			// make sure the callback is a subscriber
			funcIndex = subscribers[eventName].indexOf(func);
			if (funcIndex === -1) {
				return obj;
			}
			// remove subscribed callback from the array
			subscribers[eventName].splice(funcIndex, 1);

			return obj;
		};

		// trigger all functions subscribed to the eventName.
		obj.trigger = function (eventName) {
			var i, sub, subs = subscribers[eventName];
			if (subs === undefined) {
				return obj;
			}
			Array.prototype.splice.call(arguments, 0, 1);
			for (i = 0; i < subs.length; i = i + 1) {
				sub = subs[i];
				if (sub !== undefined && typeof sub === "function") {
					sub.apply(this, arguments);
				}
			}
			return obj;
		};

		return obj;
	};
}(suso));
