/*
 *  Project: Perimeters.js
 *  Creates an invisible perimeter around a target element and monitors mouse breaches.
 *  When a breach is detected the corresponding callback will be invoked.
 *  This gives the opportunity to e.g. lazy-load scripts, show a tooltip or whatnot.
 *  
 *  @author  : Boye Oomens <github@e-sites.nl>
 *  @version : 0.1.0
 *  @license : MIT
 *  @see     : http://github.e-sites.nl/perimeter.js/
 */

(function (window, document, undefined) {

	'use strict';

	var win = window,
		doc = document,
		docElem = doc.documentElement,
		docBody = doc.body,
		instances = [];

	/**
	 * Cross Browser helper for addEventListener.
	 *
	 * @param {HTMLElement} obj The Element to attach event to.
	 * @param {String} evt The event that will trigger the binded function.
	 * @param {Function(event)} fn The function to bind to the element. 
	 * @return {Boolean} true if it was successfuly binded.
	 * @private
	 */
	function _addEventListener(obj, evt, fn) {
		// W3C model
		if ( obj.addEventListener ) {
			obj.addEventListener(evt, fn, false);
			return true;
		}
		// Microsoft model
		else if ( obj.attachEvent ) {
			return obj.attachEvent('on' + evt, fn);
		}
		return false;
	}

	/**
	 * Global Perimeter constructor
	 * 
	 * @param {Object} options
	 * @constructor
	 */
	function Perimeter(options) {

		// We need at least a target element and an outline to work with
		if ( !options.target || !options.outline ) {
			return;
		}

		// Called as function
		if ( !(this instanceof Perimeter) ) {
			return new Perimeter(options);
		}

		/**
		 * Perimeter options
		 * 
		 * @type {Object}
		 */
		this.options = options;

		/**
		 * The amount of perimeter breaches
		 * 
		 * @type {Array}
		 */
		this.breaches = [];

		/**
		 * Whether the perimeter has been breached
		 * 
		 * @type {Boolean}
		 */
		this.alarm = false;

		/**
		 * Outline around the target element
		 * This can either be an array with top/right/bottom/left dimensions
		 * or just one number which acts as shorthand for all directions
		 * 
		 * @type {Number|Array}
		 */
		this.outline = this.formatOutline(options.outline);

		/**
		 * Target element
		 * 
		 * @type {Object}
		 */
		this.target = doc.getElementById(options.target);

		/**
		 * Boundary used for debugging purposes
		 * @type {Object}
		 */
		this.boundary = null;

		/**
		 * Bounding rectangles
		 * 
		 * @type {Object} ClientRect
		 */
		this.rects = this.utils.getClientRect(this.target);

		/**
		 * Breach monitor
		 * @type {Monitor}
		 */
		this.monitor = new this.Monitor(this);

		return this.init(options);
	}

	/**
	 * Small helper to fetch cross-browser scroll values
	 * 
	 * @return {Object} top and left scroll pos
	 */
	Perimeter.prototype.getScrollPos = function () {
		return {
			top: docElem.scrollTop || docBody.scrollTop,
			left: docElem.scrollLeft || docBody.scrollLeft
		};
	};

	/**
	 * Returns the given element dimensions and offset
	 * based on getBoundingClientRect including document scroll offset
	 *
	 * @param {HTMLElement} elem target element
	 * @return {Object}
	 */
	Perimeter.prototype.getClientRect = function (elem) {
		var scrollPos = this.getScrollPos(),
			box;

		if ( typeof elem.getBoundingClientRect === 'undefined' ) {
			throw new Error('Perimeter.js detected that your browser does not support getBoundingClientRect');
		}

		box = elem.getBoundingClientRect();

		return {
			width: box.width || elem.offsetWidth,
			height: box.height || elem.offsetHeight,
			top: (box.top + scrollPos.top - docElem.clientTop),
			left: (box.left + scrollPos.left - docElem.clientLeft)
		};
	};

	/**
	 * When triggered via onresize it will recalculate the clientRect and reflow all existing boundaries
	 * 
	 * @param {Object} obj Perimeter instance
	 * @private
	 */
	Perimeter.prototype.recalculate = function (obj) {
		var inst, i;
		if ( obj instanceof Perimeter ) {
			obj.outline = obj.formatOutline( obj.outline );
			if ( obj.options.debug && obj.boundary ) {
				obj.boundary.reflow();
			}
		} else {
			i = instances.length;
			while (i--) {
				inst = instances[i];
				inst.rects = inst.getClientRect( inst.target );
				if ( inst.options.debug && inst.boundary ) {
					inst.boundary.reflow();
				}
			}
		}
	};

	/**
	 * Triggers the corresponding callback of the given event type
	 * 
	 * @param {String} event event type
	 * @return {Boolean}
	 */
	Perimeter.prototype.trigger = function (event) {
		var events = {
			'breach': this.options.onBreach,
			'leave': this.options.onLeave
		};

		if ( events.hasOwnProperty(event) && (events[event] instanceof Function) ) {
			events[event].apply(this, []);
		}
	};

	/**
	 * Formats the given outline, this can either be a number or an array with numbers
	 * When the numbers are passed as string they will be converted to numbers
	 * Also, 
	 * 
	 * @param  {Array|Number} outline
	 * @return {Array}
	 */
	Perimeter.prototype.formatOutline = function (outline) {
		var arr = [],
			i = 0;

		while (i < 4) {
			if ( !isNaN(outline) ) {
				arr.push( parseInt(outline, 10) );
			} else {
				arr.push( (!outline[i] ? 0 : parseInt(outline[i], 10)) );
			}
			i++;
		}

		return arr;
	};

	/**
	 * Main init method that kickstarts everything
	 * 
	 * @param {Object} options Perimeter options
	 */
	Perimeter.prototype.init = function (options) {

		// Cancel the process when the DOM element can't be found
		if ( !this.target ) {
			return;
		}

		// Keep track of all instances
		instances.push( this );

		// Create and show boundary when debug option is passed
		if ( options.debug && typeof this.Boundary !== 'undefined' ) {
			this.boundary = new this.Boundary( this );
		}

		_addEventListener( options.monitor || doc, 'mousemove', this.monitor.observe );
		_addEventListener(win, 'resize', this.utils.recalculate );
	};

	// Expose Perimeter to global scope
	win.Perimeter = Perimeter;

}(window, window.document));

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