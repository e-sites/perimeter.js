/* global Perimeter */

(function (Perimeter, doc) {

	'use strict';

	/**
	 * Boundary constructor
	 *
	 * @param  {Object} Perimeter object
	 * @return {Object} Boundary object
	 * @constructor
	 */
	Perimeter.prototype.Boundary = function (perimeter) {

		/**
		 * Boundary division element
		 * 
		 * @type {HTMLDivElement}
		 */
		this.elem = null;

		/**
		 * Recalculates rectangle offset and dimensions based on new outline
		 * 
		 * @return {Object} newRect
		 * @private
		 */
		function _recalculateRect(target, outline) {
			var rects = perimeter.rects || perimeter.getClientRect( target ),
				newRect = {};

			newRect.width = rects.width + (outline[1] + outline[3]);
			newRect.height = rects.height + (outline[0] + outline[2]);
			newRect.top = (rects.top - outline[0]);
			newRect.left = (rects.left - outline[3]);

			return newRect;
		}

		/**
		 * Creates the division and injects it into the DOM
		 * 
		 * @return {[type]} [description]
		 */
		this.create = function () {
			this.elem = doc.createElement('div');
			this.elem.className = 'boundary';

			this.reflow( perimeter.target, perimeter.outline );

			doc.body.appendChild( this.elem );

			return this;
		};

		/**
		 * Repositions the boundary element
		 * 
		 * @param  {Object} target  [description]
		 * @param  {Number} outline [description]
		 * @return {Object}
		 */
		this.reflow = function (target, outline) {
			var box = target || perimeter.target,
				rect;

			outline = perimeter.formatOutline( outline || perimeter.outline );
			rect = _recalculateRect( box, outline );

			this.elem.style.top = rect.top + 'px';
			this.elem.style.left = rect.left + 'px';
			this.elem.style.width = rect.width + 'px';
			this.elem.style.height = rect.height + 'px';

			return this;
		};

		return this.create();
	};

}(Perimeter, document));