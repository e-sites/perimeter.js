Perimeter.js
====
<blockquote>
	<p>Creates an invisible perimeter around a target element and monitors mouse breaches.</p>
</blockquote>

More info, documentation and examples @ http://github.e-sites.nl/perimeter.js/

##Use cases
<ul>
	<li>Showing some sort of tooltip / popover when hovering near a certain element, like a hint or a tip</li>
	<li>Lazy load a script when the perimeter of the target element is breached (AFAIK Google does this when a user moves it's mouse towards the red 'compose' button).</li>
	<li>Fetch data via AJAX and do something with it when a users navigates towards a certain element</li>
</ul>

##Specs
<ul>
	<li>Lightweight; (~0.6kb minified / gzipped)</li>
	<li>No dependencies; just plug it in and you're good to go</li>
	<li>Built-in debugger to actually see where the perimeter is located (boundary.js)</li>
	<li>Fully documented</li>
	<li>Unit-tests available (when 0.2.0 lands)</li>
</ul>

##Getting started
First and foremost, download the script and include it as follows:

```html
<script src="perimeter.min.js"></script>
```

Second, just call the <code>Perimeter</code> constructor function and pass the corresponding options.

```js
new Perimeter({
    target: 'square',
    outline: 20,
    onBreach: function () {
        // Breach!
    }
});
```

<strong>UPDATE:</strong> as from 0.2.0 is also possible to pass DOM elements as target (instead of only a string). This will 

```js
var items = document.querySelectorAll('.selector'),
    i = items.length;

while (i--) {
   Perimeter({
       target: items[i],
       outline: 100
   });
}
```

In case you're working with <code>perimeter.debug.js</code> you'll need to add a bit of CSS to actually see the boundary:

```css
.boundary {
    position:absolute;
    border:1px dotted;
    background:#E4FECB;
    background:rgba(127,255,0,0.2);
    margin:0;
    padding:0;
    z-index:-1;
}
```

###Options
<table class="table table-bordered table-striped bs-table">
	<colgroup>
		<col class="col-lg-1">
		<col class="col-lg-1">
		<col class="col-lg-1">
		<col class="col-lg-7">
	</colgroup>
	<thead>
	<tr>
		<th>Property</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	</thead>
	<tbody>
		<tr>
			<td>
				<code>target</code>
			</td>
			<td><code>{String}</code></td>
			<td>
				The ID of the target element
			</td>
		</tr>
		<tr>
			<td>
				<code>monitor</code>
			</td>
			<td><code>{HTMLElement}</code></td>
			<td>
				Element where the <code>mousemove</code> event will be bound to and therefore acts as monitor for breaches.
			</td>
		</tr>
		<tr>
			<td>
				<code>outline</code>
			</td>
			<td><code>{Number|Array}</code></td>
			<td>
				Outline around the target element. This can either be an array with top/right/bottom/left dimensions or just one number which acts as shorthand for all directions.
			</td>
		</tr>
		<tr>
			<td>
				<code>debug</code>
			</td>
			<td><code>{Boolean}</code></td>
			<td>
				When debugging in a local environment you can pass the <code>debug</code> option. This will create a division that will be positioned absolutely to the <code>body</code> and basically shows where the perimeter is located. By default, the debug functionality is excluded from <code>perimeter.js</code>. So, please make sure that you include <code>perimeter.debug.js</code>.
			</td>
		</tr>
		<tr>
			<td>
				<code>onBreach</code>
			</td>
			<td><code>{Function}</code></td>
			<td>
				Callback function that will be invoked when the monitor detects a breach.
			</td>
		</tr>
		<tr>
			<td>
				<code>onLeave</code>
			</td>
			<td><code>{Function}</code></td>
			<td>
				Callback function that will be invoked when the mouse cursor leaves the perimeter.
			</td>
		</tr>
	</tbody>
</table>

##Browser support
Tested in the latest (stable) versions of Google Chrome, Mozilla Firefox, Opera and Safari. As for Internet Explorer; I have tested in IE8+ but it should work in IE7 as well (though, it might be quirky).

##Road map
<p>When I have some spare time I will try to accomplish the following:</p>
<ul>
	<li>Performance measurements</li>
	<li>More documentation / examples</li>
	<li>Unit testing</li>
</ul>

##License
Copyright (C) 2013 e-sites, <a href="http://www.e-sites.nl/">http://e-sites.nl/</a> Licensed under the MIT license.
