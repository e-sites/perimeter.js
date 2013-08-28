/**
 * Monitor that observes the given element and detects mouse breaches
 * 
 * @param {Object} perimeter Perimeter instance
 * @return {Object}
 * @constructor
 */

/* global Perimeter */

(function (Perimeter, window) {

	'use strict';

	Perimeter.prototype.Monitor = function (perimeter) {

		var monitor = this;

		/**
		 * Reference to the event object
		 * 
		 * @type {Object}
		 */
		this.event = null;

		/**
		 * Detects a breach and when the cursor leaves the perimeter
		 * 
		 * @param {String} state either breach or leave
		 */
		this.detect = function (state) {
			var	outline = perimeter.outline,
				posX = this.event.clientX,
				posY = this.event.clientY,
				scrollPos = perimeter.getScrollPos(),
				maxTop = parseInt((perimeter.rects.top - scrollPos.top - outline[0]), 10),
				maxLeft = parseInt((perimeter.rects.left - scrollPos.left - outline[3]), 10);

			switch (state) {
			case 'breach':
				if (
					posY >= maxTop &&
					posY < ((maxTop + perimeter.rects.height) + (outline[0] + outline[2])) &&
					posX >= maxLeft &&
					posX < ((maxLeft + perimeter.rects.width) + (outline[1] + outline[3]))
				) {
					perimeter.breaches.push([posX, posY]);
					perimeter.trigger('breach');
					perimeter.alarm = true;
				}
				break;
			case 'leave':
				if (
					posY < maxTop ||
					posY > (maxTop + perimeter.rects.height + (outline[0] + outline[2])) ||
					posX < maxLeft ||
					posX > (maxLeft + perimeter.rects.width + (outline[1] + outline[3]))
				) {
					perimeter.trigger('leave');
					perimeter.alarm = false;
				}
				break;
			}
		};

		/**
		 * Main observer that invokes the detection
		 * 
		 * @param {Object} e Event object
		 */
		this.observe = function (e) {
			monitor.event = e || window.event;
			perimeter.monitor.detect( perimeter.alarm ? 'leave' : 'breach' );
		};

		return this.event;
	};

}(Perimeter, window));