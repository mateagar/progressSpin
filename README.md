What is it?
===========
`progressSpin.js` is a [jQuery][] plugin that dynamically renders a progress spinner. 

Why would I use it?
===================
The traditional approach for displaying a progress spinner is to use an animated .gif. While this is easy to implement (a simple `<img>` tag), there are a few drawbacks:

* the .gif format's one-color transparency precludes anti-aliasing edges
* each variation in size, style, or color requires creating and deploying a new .gif file
* it is not possible to stop and start the animation on demand

`progressSpin.js` solves all of these problems in a lightweight (~2KB) and easy to use jQuery plugin.


Dependencies
============
`progressSpin.js` uses the [jQuery][] library for DOM manipulation, and [Raphaël][] for rendering the progress bar itself. It does not use the new jQuery widget factory, so you can use it with jQuery prior to v1.8. I chose Raphaël because it provides compatibility to legacy browsers, including IE8.

How do I use it?
================

1. Create a `<div>` to hold the progress spinner; give it some dimensions (i.e., set the width and height) — `progressSpin.js` will fill these dimensions with the control.
2. Create a jQuery object for the `<div>`, and invoke the `progressSpin()` method on it to instantiate and return a progress spinner.
3. Call the `start()` method on the progress spinner to display and start animating.

For example:  
```javascript  
var $spinner = $("#spinner").progressSpin();
$spinner.start();

```

Function reference
==================

Options and Defaults
--------------------
Unfortunately, the graphics which Raphaël generates ([VML][] in IE8, and [SVG][] elsewhere) are not completely style-able using CSS, so you need to pass styling cues to `progressSpin` as configuration parameters.  

The `progressSpin()` method optionally takes an options object that you can use to specify styling and some basic dimensions. The overall size of the control is dictated by the dimensions of the `<div>` tag which contains it. You can modify the default options by setting the values on `progressSpin.defaults`. 

* **activeColor**: The color used to highlight the current step in the spinner.
* **fillColor**: The color used to draw inactive steps.
* **cycleTime**: The amount of time (in milliseconds) for one complete rotation of the spinner.
* **tailCount**: The number of steps in the "tail" behind the current step. The tail fades from the active color to the fill color as you move back from the current spinner step.
* **stepWidth**: The width of each step (in pixels).
* **cornerRadius**: The radius of rounding (in pixels) on the corners of each step.
* **knockOutRatio**: Defines the size of the "hole" inside the spinner as a ratio of hole radius to overall radius. Should be a number between 0 (no hole) and 1 (no visible steps).

For example, if you want to a `progressSpin` instance with a white active color, you can set the `activeColor` option on creation:

```javascript  
var $spinnerDiv = $("#spinner");  
var $spinner = $spinner.progressSpin({ activeColor: "white" });
``` 

Alternatively, if you decide you want *all* new instances of `progressSpin` to have no tail, then you can set the `tailCount` default:

```javascript  
$.fn.progressSpin.defaults.tailCount = 0;
```

`progressSpin` Methods
----------------------

###progressSpin(options)###
Creates a new progress spinner and binds it to the `<div>` on which this method is called. If invoked more than once on the same jQuery object, will return a single instance; however, if you create a new jQuery object for the same div, you will end up with more than one spinner.

**parameters**  
*options* (object): Configuration options for the spinner instance. See "Options and Defaults" for details.

**returns**  
The spinner instance.

###getOptions()###
Retrieves the options for the spinner instance.

**parameters**  
(none)

**returns**  
Spinner options for this instance. See "Options and Defaults" for details.

###getVisible()###
Indicates whether the spinner is currently visible. Note: even when hidden, the spinner will still take up space on the page; if you need to hide it completely, you should hide the `<div>` which contains the spinner.

**parameters**  
(none)

**returns**  
A boolean value indicating whether the spinner is currently displayed on the page. 

###getAnimating()###
Indicates whether the spinner is currently animating.

**parameters**  
(none)

**returns**  
A boolean value indicating whether the spinner is currently animating through its steps.

###getCurrentStep()###
Provides the index of the active step in the spinner. Steps correspond to the hour markings on a clock - step 0 is 12:00, step 1 is 1:00, etc.

**parameters**  
(none)

**returns**  
The index of the active step in the spinner.

###setCurrentStep(stepIndex)###
Sets the index of the active step in the spinner. Note: changing the current step while a spinner is animating will stop the current animation, reset all of the step colors, and then restart the animation from the new current step.

**parameters**  
*stepIndex* (integer): The index of the step that you want to make active. Valid values are between 0 and 11, but this method will automatically force any integer into the proper range.

**returns**  
(none)

###start()###
Starts animating the spinner. If the spinner was not previously visible, also unhides it.

**parameters**  
(none)

**returns**  
(none)

###stop(hide)###
Stops the spinner animation. `stop()` is essentially a "pause" function in that the current step is left unchanged, so if you start again, animation will resume where it left off. You can invoke `setCurrentStep()` before calling `start()` if you want to reset to a standard starting point. 

If you invoke this method with no arguments, the spinner will automatically be hidden. 

**parameters**  
*hide* (boolean): Pass `true` to hide the spinner once stopped, or `false` to leave it visible. Note: a hidden spinner still takes up space on the page. 

**returns**  
(none)

###show()###
Displays the spinner steps.

**parameters**  
(none)

**returns**  
(none)

###hide()###
Hides the spinner. If currently animating, the animation will also be stopped.

**parameters**  
(none) 

**returns**  
(none)

###render()###
Creates the steps for the spinner and makes the spinner visible. Automatically invoked the first time you call `start()`, you may find this method useful if you need to change the dimensions of the spinner's host `<div>` or any of the spinner dimensions (i.e., stepWidth, cornerRadius, knockOutRatio). 

Calling this method on a currently animating spinner will stop the animation. 

You can make some other adjustments to spinner options on the fly without having to invoke this method. activeColor and fillColor can be changed even while a spinner is visible and animating, and the results will be visible within 1/12 of the cycleTime. cycleTime and tailCount can be changed at any time, but the changes do not take effect until you stop and restart the spinner.


License
=======
`progressSpin.js` is free to use under the MIT license, which is included at the top of the un-minified version of the source. If you use the un-minified version, please include the license text as provided. 

I wrote this plugin while working for [Intuit][]'s [QuickBase][] team; Intuit is the copyright holder. 


[jQuery]: http://jquery.com/ 
[Raphaël]: http://raphaeljs.com/ 
[VML]: http://en.wikipedia.org/wiki/Vector_Markup_Language
[SVG]: http://en.wikipedia.org/wiki/Scalable_Vector_Graphics
[Raphaël element]: http://raphaeljs.com/reference.html#Element
[Intuit]: http://www.intuit.com/ 
[QuickBase]: http://quickbase.intuit.com/ 
