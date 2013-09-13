/**
 * All events needed for the demonstrations
 */

(function (window, document, $) {

	'use strict';

	$(document).ready(function () {

		// Example 1
		Perimeter({
			target: 'target1',
			debug: true,
			outline: 50,
			onBreach: function () {
				this.target.innerHTML = 'breach!';		
			},
			onLeave: function () {
				this.target.innerHTML = 'left perimeter';
			}
		});

		// Example 2
		var ex2 = new Perimeter({
			target: 'target2',
			monitor: $('#example-2')[0],
			debug: true,
			outline: 20,
			onBreach: function () {
				this.target.innerHTML = 'breach!';				
			},
			onLeave: function () {
				this.target.innerHTML = '';
			}
		});

		// Example 3
		Perimeter({
			target: 'target3',
			debug: true,
			outline: [50, 600, 50, 0],
			onBreach: function () {
				var self = this;
				if ( self.breaches.length === 1 ) {
					$.getScript('http://cdnjs.cloudflare.com/ajax/libs/file-uploader/3.7.0/fineuploader.min.js', function () {
						self.target.innerHTML = 'Upload your files';
						new qq.FineUploaderBasic({
							request: {
								endpoint: 'assets/upload.php'
							},
							button: self.target
						});
					});
				}
			}
		});

		// Example 4
		Perimeter({
			target: $('#target4')[0],
			debug: true,
			outline: 50,
			onBreach: function () {
				this.target.innerHTML = 'breach!';		
			},
			onLeave: function () {
				this.target.innerHTML = 'left perimeter';
			}
		});

		// Example 5
		Perimeter({
			target: $('#target5')[0],
			debug: true,
			outline: [0, 200, 0],
			onBreach: function () {
				$(this.target).stop().animate({
					'width': this.target.clientWidth*1.5,
					'height': this.target.clientHeight*1.5
				}, 300);
			},
			onLeave: function () {
				$(this.target).stop().animate({
					'width': 100,
					'height': 100
				}, 500);
			}
		});

		// Manually adjust the outline
		$('#custom-outline').on('change', function () {
			ex2.outline = this.value;
			ex2.recalculate();
		});

	});

}(window, window.document, jQuery));