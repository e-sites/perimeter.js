/**
 * All unit tests
 */

(function (window, document) {

	'use strict';

	var SQUARE_WIDTH = 100,
		SQUARE_HEIGHT = SQUARE_WIDTH;

	window.log = function () {
		if ( typeof window.console === 'object' ) {
			console.log((arguments.length === 1 ? arguments[0] : Array.prototype.slice.call(arguments)));
		}
	};

	function $$(id) {
		return document.getElementById(id);
	}

	module('Fundamentals');

	test('Leaving out mandatory options', function () {
		ok(!Perimeter(), 'Passing no options at all will result in a silent fail');
		ok(!Perimeter({}), 'Passing an empty object will result in a silent fail');
		ok(!Perimeter({target: 'square'}), 'Passing non existing target (string) will result in a silent fail');
		ok(!Perimeter({target: $$('square')}), 'Passing a non existing target (DOM element) will result in a silent fail');
		ok(!Perimeter({target: $$('target1')}), 'Passing an existing target, but no outline, will result in a silent fail');
	});

	module('Debugging');

	test('Check boundary element', function () {
		var outline = 50,
			p = Perimeter({
				debug: true,
				target: 'target1',
				outline: outline
			});
		ok(p.boundary.elem, 'The boundary element is successfully created');
		strictEqual(p.boundary.elem.nodeName.toLowerCase(), 'div', 'The boundary element is a division');
		strictEqual(p.boundary.elem.className, 'boundary', 'The boundary element classname corresponds');
		strictEqual(p.boundary.elem.clientWidth, SQUARE_WIDTH + (outline * 2), 'The width of the boundary corresponds with the given outline');
		strictEqual(p.boundary.elem.clientHeight, SQUARE_HEIGHT + (outline * 2), 'The height of the boundary corresponds with the given outline');
	});

	module('Instance');

	test('Check instance properties', function () {
		var p = Perimeter({
			target: 'target1',
			outline: 50
		});
		ok(!p.alarm, 'The alarm is initially set to false');
		ok(p instanceof Perimeter, 'Constructor properly instantiated');
		ok(p.breaches.length<1, 'There are no breaches detected yet');
		strictEqual(p.target.id, 'target1', 'The target element id matches the given target');
		strictEqual(typeof p.options, 'object', 'The given options are available in the instance');
		strictEqual(typeof p.rects, 'object', 'The ClientRect object is available in the instance');
		strictEqual(p.boundary, null, 'The boundary is not set and therefore null');
	});

	test('Check rectangle dimensions', function () {
		var p = Perimeter({
			target: 'target1',
			outline: 50
		});
		strictEqual(typeof p.rects.top, 'number', 'Top property available');
		strictEqual(typeof p.rects.left, 'number', 'Left property available');
		strictEqual(typeof p.rects.width, 'number', 'Width property available');
		strictEqual(typeof p.rects.height, 'number', 'Height property available');
	});

	test('Perimeter outline', function () {
		var p1 = Perimeter({
			target: 'target1',
			outline: 50
		});
		var p2 = Perimeter({
			target: 'target1',
			outline: ['50']
		});
		strictEqual(Object.prototype.toString.call( p1.outline ), '[object Array]', 'The given outline is properly formatted');
		strictEqual(p1.outline.length, 4, 'The outline array consists of four elements');
	});

	module('callbacks');

	test('Process onBreach callback', function () {
		var p = Perimeter({
			target: 'target1',
			outline: 50,
			onBreach: function () {
				ok(this instanceof Perimeter, 'The `this` context points to the Perimeter instance');
			}
		});
		ok(!p.trigger(''), 'Passing an invalid event or an empty string will not trigger any callback');
		p.trigger('breach');
	});

	test('Process onLeave callback', function () {
		var p = Perimeter({
			target: 'target1',
			outline: 50,
			onLeave: function () {
				ok(this instanceof Perimeter, 'The `this` context points to the Perimeter instance');
			}
		});
		p.trigger('leave');
	});

}(window, window.document));
