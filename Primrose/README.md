# PRIMROSE TEXT EDITOR

Primrose is a syntax highlighting text editor that renders into an HTML5 Canvas element. This is particularly useful for texturing 3D objects in WebGL apps.

## Features

* International keyboard support (left-to-right rendering only)
* Wide Unicode character-aware
* Line numbering
* Color theming
* Syntax highlighting for:
  * JavaScript, 
  * HTML, and 
  * BASIC

<hr>

## Liscense

Primrose is free, open source software (MIT) and may readily be used with other FOSS projects.

<hr>

## Contributing

### Conduct

First, please read the [Conduct Policy](CONDUCT.md).

### Contributions

If you think you can be a polite person in accordance with the Conduct Policy, I'd be more than happy to add anyone who asks as a contributor. Just [email me](sean.mcbeth+gh@gmail.com) your profile info and a brief description of what you'd like to work on.

<hr>

## Getting started with Primrose

### In a 2D page
Here is a basic example that creates an editor in a 2D web page.

#### index.html
```html
<html>
   <body>
      <primrose style="width:50em;height:25em"></primrose>
   </body>
   <script type="module" src="node_modules/primrose/src/primrose.js"></script>
</html>
```

### In a 3D WebGL app
Here is [a basic example that creates an editor in a 3D WebGL app](https://github.com/capnmidnight/Primrose/blob/master/demo3d.js), using [Three.js](https://www.threejs.org).

<em>NOTE: While Primrose can manage most input events on its own, in WebGL contexts, it's not able to figure out what the user's pointer is pointing at. Mouse or VR motion controller support requires implementing Raycast-based picking on your own. However, Primrose does offer a simple interface for implementing pointer operations.</em>

<hr>


## API

The documentation here represents the public API. Any properties, methods, functions, or classes not listed here are considered either internal state or deprecated features and may change or be removed at any time.

<hr>

### Primrose

The `Primrose` class extends the [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) class. It is a text editor control that renders to an [HTML5 Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API), using the [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) API.

#### Importing

To get the Primrose class, import it from the package bundle:

```javascript
import { Primrose } from "./node_modules/primrose/primrose.js";
```

There is also a minified version:

```javascript
import { Primrose } from "./node_modules/primrose/primrose.min.js";
```

You can also import without package bundling, which is probably preferred if you intend to build your own bundle:

```javascript
import { Primrose } from "./node_modules/primrose/src/primrose.js";
```

<hr>

#### Constructor

You create a Primrose control in one of two ways. In creating the control, there are a set of options that you can specify. The two ways are:

##### In HTML
Create a `<primrose>` tag in your document before the page has loaded. 

Specify the options as a comma seperated list of key-value pairs, each separated by an equals sign (`=`), on an attribute on the tag named `data-options`. 

###### Example

```html
<primrose data-options="lineNumbers=false;wordWrap=false"></primrose>
```

##### In JavaScript

Create a new instance of the `Primrose` class, passing the options as a JavaScript object

###### Example

```javascript
new Primrose({ lineNumbers: false, wordWrap: false });
```

##### Options
The options object has the following fields:

* **element:([HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)|[HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement)|[OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas))** - *Default: `null`* - a document element or a canvas that represents the `Primrose` control. This can either be:
  * a `<primrose>` tag (which is a generic HTML tag in DOM), in which case the editor Canvas will be inserted into the `<primrose>` tag, or
  * an `HTMLCanvasElement` element or `OffscreeCanvas` object, in which case the editor will take control of the canvas.
  * *`null`*, which instructs Primrose to construct its own Canvas element. If `OffscreenCanvas` is available, that will be used instead of `HTMLCanvasElement`.
* **width:[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** - *Default: `undefined`* - the scale-independent width of the canvas used when `element` is null
* **height:[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** - *Default: `undefined`* - the scale-independent height of the canvas used when `element` is null
* **padding:[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** - *Default: `0`* - the scale-independent amount of inset for rendering the contents from the edge of the canvas. This is useful for texturing objects where the texture edge cannot be precisely controlled.
* **fontSize:[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** - *Default: `16`* - the scale-independent height to draw characters.
* **scaleFactor:[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** - *Default: `window.devicePixelRatio` - A multiplicative factor for how large to scale the `width`, `height`, `fontSize`, and `padding` of the canvas, to improve rendering sharpness on high-resolution displays. With THREE.js, it's best to set this value to 1 and change the width, height, and fontSize manually.
* **readOnly:[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** - *Default: `false`* - indicates whether or not the text editor should allow changes to its value.
* **multiLine:[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** - *Default: `true`* - indicates whether or not the text editor should break long lines onto new lines.
* **scrollBars:[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** - *Default: `true`* - indicates whether or not scroll bars should be rendered at the right and bottom in the control. If wordWrap is enabled, the bottom, horizontal scrollbar will not be rendered.
* **lineNumbers:[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** - *Default: `true`* - indicates whether or not line numbers should be rendered on the left side of the control.
* **language:[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** - *Default: `"JavaScript"`* - A name for the type of syntax highlighting to perform. This value is not case-sensitive. Valid values are:
    * `"basic"` for Basic,
    * `"bas"` for Basic,
    * `"html"` for HTML,
    * `"javascript"` for JavaScript,
    * `"js"` for JavaScript,
    * `"plaintext"` for PlainText,
    * `"txt"` for PlainText
  * and any case-variation thereof.

<hr>

#### Events

The events in Primrose are all of type [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event), having no other properties set on them. The only way to register the events is to call `addEventListener`, i.e. there are no `on###` properties on the object for the event handlers.

* *change:[Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)* - Fires when the text in the control has changed.
* *blur:[Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)* - Fires when the control first loses focus. Calls to `blur()` while the control is not focused will not fire the `blur` event.
* *focus:[Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)* - Fires when the control first gains focus. Calls to `focus()` while the control is focused will not fire the `focus` event.
* *over:[Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)* - Fires when the control is first hovered over by a pointer.
* *out:[Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)* - Fires the first time the controller is no longer hovered over by a pointer.
* *update:[Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)* - Fires when the Primrose control finishes rendering.

<hr>

#### Public Methods

<hr>

##### addEventListener(type:[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), handler:[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)(evt:[Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)))
Add a listener for one of the event types listed above.

###### Example

```javascript
const editor = new Primrose({
    element: document.querySelector("canvas")
});

function onChange(){
    console.log("changed!");
}

editor.addEventListener("change", onChange);
editor.value = "Something"; // 'changed!' printed out to console.
```

###### Parameters

* *name:[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)* - The name of the event to register, one of the event names listed in the [Events](#Events) section above.
* *handler:[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)(evt:[Event](https://developer.mozilla.org/en-US/docs/Web/API/Event))* - A callback function to receive the event. This function will be provided an argument of type [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)

<hr>

##### removeEventListener(type:[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), handler:[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)(evt:[Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)))
Remove an event listener that was added with `addEventListener()`

###### Example

```javascript
const editor = new Primrose({
    element: document.querySelector("canvas")
});

function onChange(){
    console.log("changed!");
}

editor.addEventListener("change", onChange);
editor.value = "Something"; // 'changed!' printed out to console.
editor.removeEventListener("change", onChange);
editor.value = "Something else"; // nothing printed out to console.
```

<hr>

##### blur()

Removes focus from the control.

###### Example

```javascript
const editor = new Primrose({
    element: document.querySelector("canvas")
});

function onBlur(){
    console.log("blurred!");
}

editor.addEventListener("blur", onBlur);
if(!editor.focused){
    editor.focus();
}
editor.blur(); // 'blurred!' printed out to console.
editor.blur(); // nothing printed out to console.
editor.focus();
editor.blur(); // 'blurred!' printed out to console.
```

<hr>

##### focus()
Sets the control to be the focused control. If all controls in the app have been properly registered with the Event Manager, then any other, currently focused control will first get `blur`'d.

###### Example

```javascript
const editor = new Primrose({
    element: document.querySelector("canvas")
});

function onFocus(){
    console.log("focused!");
}

editor.addEventListener("focused", onFocus);
if(editor.focused){
    editor.blur();
}
editor.focus(); // 'focused!' printed out to console.
editor.focus(); // nothing printed out to console.
editor.blur();
editor.focus(); // 'focused!' printed out to console.
```

<hr>

##### scrollTo(x:[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), y:[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number))

Move the scroll window to a new location. Values get clamped to the text contents of the editor.

###### Parameters

* *x* - the horizontal position to which to scroll. If wordWrap is enabled, this has no effect.
* *y* - the vertical position to which to scroll.

###### Return Value
`true` if the scrolling was clamped to the upper or lower bounds of the content, `false` otherwise.

<hr>

##### scrollBy(dx:[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), dy:[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number))

Move the scroll window by a given amount to a new location. The final location of the scroll window gets clamped to the text contents of the editor.

###### Parameters

* *dx* - the horizontal offset by which to scroll. If wordWrap is enabled, this has no effect.
* *dy* - the vertical offset by which to scroll.

###### Return Value
`true` if the scrolling was clamped to the upper or lower bounds of the content, `false` otherwise.

<hr>

##### setSize(width:[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), height:[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number))
Sets the scale-independent width and height of the editor control.

###### Example

```javascript
const editor = new Primrose({
  width: 512,
  height: 512,
  scaleFactor: 2
});

if(editor.width === 512) { /* true */ }
if(editor.canvas.width === 1024) { /* true */}

editor.setSize(1024, 1024);
if(editor.width === 1024) { /* true */ }
if(editor.canvas.width === 2048) { /* true */}
```


###### Parameters

* *width* - the nominal width of the editor canvas. This value is scaled by `scaleFactor` before actually setting the canvas width.
* *height* - the nominal height of the editor canvas. This value is scaled by `scaleFactor` before actually setting the canvas height.

<hr>

##### resize()
If the canvas element used by the editor control is in the document tree, this method forces the editor to check the client bounds of the DOM element and resize the rendering resolution of the canvas accordingly, to maintain rendering sharpness. Normally, this does not need to be called in user-code, as the Event Manager handles resizing.

If the canvas does not need to be resized, then no action occurs.

<hr>


#### Public Properties

##### element:[HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) - read-only
The DOM element that was used to construct the `Primrose` control out of the document tree. If the Control was not constructed from the document tree, this value will be `null`.

<hr>

##### isInDocument:[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) - read-only
Returns `false` if `element` is null. Returns `true` otherwise.

<hr>

##### canvas:([HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement)|[OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)) - read-only
The canvas to which the editor is rendering text. If the `options.element` value was set to a canvas, that canvas will be returned. Otherwise, the canvas will be the canvas that Primrose created for the control. If `OffscreenCanvas` is not available, the canvas will be an `HTMLCanvasElement`.

<hr>

##### hovered:[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) - readOnly
Returns `true` when the control has a pointer hovering over it.

<hr>

##### focused:[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) - read/write
Returns `true` when the control has been selected. Writing to this value will change the focus state of the control. 

If the control is already focused and `focused` is set to `true`, or the control is not focused and `focus` is set to `false`, nothing happens.

If the control is focused and `focused` is set to `false`, the control is blurred, just as if `blur()` was called.

If the control is not focused and `focused` is set to `true`, the control is focused, just as if `focus()` was called.

<hr>

##### readOnly:[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) - read/write
Indicates whether or not the text in the editor control can be modified.

<hr>

##### wordWrap:[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) - read/write
Indicates whether or not the text in the editor control will be broken across lines when it reaches the right edge of the editor control.

<hr>

##### value:[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) - read/write
The text value contained in the control. NOTE: if the text value was set with Windows-style newline characters (`\r\n`), the newline characters will be normalized to Unix-style newline characters (`\n`).

<hr>

##### text:[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) - read/write
A synonymn for `value`

<hr>

##### selectedText:[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) - read/write
The range of text that is currently selected by the cursor. If no text is selected, reading `selectedText` returns the empty string (`""`) and writing to it inserts text at the current cursor location. If text is selected, reading `selectedText` returns the text between the front and back cursors, writing to it overwrites the selected text, inserting the provided value.

<hr>

##### selectionStart:[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) - read/write
The string index at which the front cursor is located. NOTE: the "front cursor" is the main cursor, but does not necessarily represent the beginning of the selction range. The selection range runs from the minimum of front and back cursors, to the maximum.

<hr>

##### selectionEnd:[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) - read/write
The string index at which the back cursor is located. NOTE: the "back cursor" is the selection range cursor, but does not necessarily represent the end of the selction range. The selection range runs from the minimum of front and back cursors, to the maximum.

<hr>

##### selectionDirection:[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) - read-only
If the back cursor is behind the front cursor, this value returns `"backward"`. Otherwise, `"forward"` is returned.

<hr>

##### tabWidth:[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) - read/write
The number of spaces to insert when the <kbd>Tab</kbd> key is pressed. Changing this value does not convert existing tabs, it only changes future tabs that get inserted.

<hr>

##### theme:[Theme](#Theme) - read/write
A JavaScript object that defines the color and style values for rendering different UI and text elements.

<hr>

##### language:[Grammar](#Grammar) - read/write
Set or get the language pack used to tokenize the control text for syntax highlighting.

###### Example

```javascript
import { Primrose, JavaScript, HTML } from "./package/primrose.min.js";

const editor = new Primrose({
    elem: document.querySelector("canvas")
});

if(editor.language === JavaScript) { /* true */ }

editor.language = HTML;

if(editor.language === HTML) { /* true */ }
```

<hr>

##### padding:[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) - read/write
The `Number` of pixels to inset the control rendering from the edge of the canvas. This is useful for texturing objects where the texture edge cannot be precisely controlled. This value is scale-independent.

<hr>

##### showLineNumbers:[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) - read/write
Indicates whether or not line numbers should be rendered on the left side of the control.

<hr>

##### showScrollBars:[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) - read/write
Indicates whether or not scroll bars should be rendered at the right and bottom in the control. If wordWrap is enabled, the bottom, horizontal scrollbar will not be rendered.

<hr>

##### fontSize:[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) - read/write
The `Number` of pixels tall to draw characters. This value is scale-independent.

###### Example

```javascript
const editor = new Primrose({
  element: document.querySelector("canvas")
});

if(editor.fontSize === 16) { /* default value */ }

editor.fontSize = 24;

if(editor.fontSize === 24) { /* true */ }

editor.scaleFactor = 2;

if(editor.fontSize === 24) { /* true */ }
```

<hr>

##### scaleFactor:[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) - read/write
The value by which pixel values are scaled before being used by the editor control.

With THREE.js, it's best to set this value to 1 and change the width, height, and fontSize manually.

###### Example

```javascript
const editor = new Primrose({
  width: 512,
  height: 512,
  scaleFactor: 1
});

if(editor.width === 512) { /* true */ }
if(editor.canvas.width === 512) { /* true */ }

editor.scaleFactor = 2;

if(editor.width === 512) { /* true */ }
if(editor.canvas.width === 1024) { /* true */ }
```

<hr>

##### width:[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) - read/write
The scale-independent width of the editor control.

###### Example

```javascript
const editor = new Primrose({
  width: 512,
  height: 512,
  scaleFactor: 2
});

if(editor.width === 512) { /* true */ }
if(editor.canvas.width === 1024) { /* true */}
```

<hr>

##### height:[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) - read/write
The scale-independent height of the editor control.

###### Example

```javascript
const editor = new Primrose({
  width: 512,
  height: 512,
  scaleFactor: 2
});

if(editor.height === 512) { /* true */ }
if(editor.canvas.height === 1024) { /* true */}
```

<hr>

#### Pointer Event Handlers for WebGL Contexts

In 2D operation, you don't need to manually wire up any events. But in WebGL contexts, you will need to perform your own raycasting in response to user input gestures and tell Primrose how to translate those into pointer actions.

These events require a parameter value that is a Raycast intersection as provided by THREE.js. The intersection has a [Vector2](https://threejs.org/docs/index.html#api/en/math/Vector2) property named `uv` that the event handlers read to determine the location of the pointer within the control. The `uv.x` field is scaled by the control's `width` property, and `1 - uv.y` is scaled by the control's `height` property.

When implementing pointer events with VR Motion Controllers, you must decide if you want mouse-like our touch-like behavior.

##### Mouse-like Behavior
* *mouse.readOverEventUV(evt:[THREE.Raycaster Intersection](https://threejs.org/docs/#api/en/core/Raycaster.intersectObject))* - Read's a THREE.js Raycast intersection to perform the hover gestures.
* *mouse.readOutEventUV(evt:[THREE.Raycaster Intersection](https://threejs.org/docs/#api/en/core/Raycaster.intersectObject))* - Read's a THREE.js Raycast intersection to perform the end of the hover gesture.
* *mouse.readDownEventUV(evt:[THREE.Raycaster Intersection](https://threejs.org/docs/#api/en/core/Raycaster.intersectObject))* - Read's a THREE.js Raycast intersection to perform mouse-like behavior for primary-button-down gesture.
* *mouse.readUpEventUV(evt:[THREE.Raycaster Intersection](https://threejs.org/docs/#api/en/core/Raycaster.intersectObject))* - Read's a THREE.js Raycast intersection to perform mouse-like behavior for primary-button-up gesture.
* *mouse.readMoveEventUV(evt:[THREE.Raycaster Intersection](https://threejs.org/docs/#api/en/core/Raycaster.intersectObject))* - Read's a THREE.js Raycast intersection to perform mouse-like behavior for move gesture, whether the primary button is pressed or not.

##### Touch-like Behavior
* *touch.readOverEventUV(evt:[THREE.Raycaster Intersection](https://threejs.org/docs/#api/en/core/Raycaster.intersectObject))* - Read's a THREE.js Raycast intersection to perform the hover gestures. This is the same as mouse.readOverEventUV, included for completeness.
* *touch.readOutEventUV(evt:[THREE.Raycaster Intersection](https://threejs.org/docs/#api/en/core/Raycaster.intersectObject))* - Read's a THREE.js Raycast intersection to perform the end of the hover gesture. This is the same as mouse.readOutEventUV, included for completeness.
* *touch.readStartEventUV(evt:[THREE.Raycaster Intersection](https://threejs.org/docs/#api/en/core/Raycaster.intersectObject))* - Read's a THREE.js Raycast intersection to perform touch-like behavior for the first finger touching down gesture.
* *touch.readEndEventUV(evt:[THREE.Raycaster Intersection](https://threejs.org/docs/#api/en/core/Raycaster.intersectObject))* - Read's a THREE.js Raycast intersection to perform touch-like behavior for the first finger raising up gesture.
* *touch.readMoveEventUV(evt:[THREE.Raycaster Intersection](https://threejs.org/docs/#api/en/core/Raycaster.intersectObject))* - Read's a THREE.js Raycast intersection to perform touch-like behavior for the first finger moving gesture.


<hr>

#### Static Methods

These are methods that exist on the `Primrose` class itself.

<hr>

##### Primrose.add(key:any, control:[Primrose](#Primrose))
Registers a new Primrose editor control with the Event Manager, to wire-up key, clipboard, and mouse wheel events, and to manage the currently focused element.

The Event Manager maintains the references in a WeakMap, so when the JS Garbage Collector collects the objects, they will be gone.

Multiple objects may be used to register a single control with the Event Manager without causing issue. This is useful for associating the control with closed objects from other systems, such as Three.js Mesh objects being targeted for pointer picking.

If you are working with Three.js, it's recommended to use the Mesh on which you are texturing the canvas as the key when adding the editor to the Event Manager.

###### Example

```javascript
// with an existing canvas
const editor = new Primrose({
  element: document.querySelector("canvas"),
  scaleFactor: devicePixelRatio
});

Primrose.add("myOwnKeyOfAnyKind", editor);
```

###### Parameters
* *key* - an arbitrary object that can be used to retrieve the editor back out again.
* *control* - an instance of the Primrose class.

###### Retrun Value
Undefined

<hr>

##### Primrose.has(key:any):[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
Checks for the existence of a control, by the key that the user supplied when calling `Primrose.add()`

###### Example

```javascript
// with an existing canvas
const editor = new Primrose({
  element: document.querySelector("canvas"),
  scaleFactor: devicePixelRatio
});

const key = new Object();
Primrose.add(key, editor);
Primrose.has(key); // true
Primrose.has("SomeOtherKey"); // false
```

###### Parameters
* *key* - the key that was used to add the control to the Event Manager.

###### Return Value
* `true` if the key maps to a control in the Event Manager.
* `false` if the given key was not used to register a control with the Event Manager.

<hr>

##### Primrose.get(key:any):[Primrose](#Primrose)
Gets the control associated with the given key.

###### Example

```javascript
// with an existing canvas
const editor = new Primrose({
  element: document.querySelector("canvas"),
  scaleFactor: devicePixelRatio
});

const key = new Object();
Primrose.add(key, editor);
const ed1 = Primrose.get(key);
if(editor === ed1) { /* true */ }
if(Primrose.get("anyOtherKey") === null) { /* true */}
```

###### Parameters
* *key* - the key that was used to add the control to the Event Manager.

###### Return Value
* `null` if no control in the Event Manager matches the given key.
* a `Primrose` control, otherwise.

<hr>


#### Static Properties

These are properties on the `Primrose` class itself.

<hr>

##### Primrose.hoveredControl:[Primrose](#Primrose) - read-only
The current `Primrose` control that has the mouse hovered over it. In 2D contexts, you probably don't need to check this value, but in WebGL contexts, this is useful for helping Primrose manage events.

If no control is hovered, this returns `null`.

<hr>

##### Primrose.focusedControl:[Primrose](#Primrose) - read-only
The current `Primrose` control that has pointer-focus. It will receive all keyboard and clipboard events. In 2D contexts, you probably don't need to check this value, but in WebGL contexts, this is useful for helping Primrose manage events.

If no control is focused, this returns `null`.

<hr>

##### Primrose.editors:[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of [Primrose](#Primrose) - read-only
An array of all of the `Primrose` editor controls that Primrose currently knows about.

This array is not mutable and is not the array used by the Event Manager. It is a read-only clone that is created whenever the Event Manager registers or removes a new control

<hr>

##### Primrose.ready:[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) - read-only
A `Promise` that resolves when the document is ready and the Event Manager has finished its initial setup.

<hr>

### Theme

Themes control the rendering of text and UI elements within the [Primrose](#Primrose) control. Themes are JavaScript objects that match the following pattern. All fields are required; there are no optional fields.

#### Example
```javascript
{
    name: "Dark",
    cursorColor: "white",
    lineNumbers: {
        foreColor: "white"
    },
    regular: {
        backColor: "black",
        foreColor: "#c0c0c0",
        currentRowBackColor: "#202020",
        selectedBackColor: "#404040",
        unfocused: "rgba(0, 0, 255, 0.25)"
    },
    strings: {
        foreColor: "#aa9900",
        fontStyle: "italic"
    },
    regexes: {
        foreColor: "#aa0099",
        fontStyle: "italic"
    },
    numbers: {
        foreColor: "green"
    },
    comments: {
        foreColor: "yellow",
        fontStyle: "italic"
    },
    keywords: {
        foreColor: "cyan"
    },
    functions: {
        foreColor: "brown",
        fontWeight: "bold"
    },
    members: {
        foreColor: "green"
    },
    error: {
        foreColor: "red",
        fontStyle: "underline italic"
    }
}
```

### Grammar

Grammars are collections of [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)s that define rules for performing the necessary tokenization to be able to achieve syntax highlighting. The token types roughly correspond to coloring settings in the [Theme](#Theme)s They can be quite difficult to develop. Following the example below, implement each of the token types as necessary for the language you would like to parse.

Each Grammar rule is applied in sequence. In the example below, `regexes` is applied before `stringDelim`, giving priority to matching regular expressions over string literals, and `stringDelim` occurs before `numbers`, so that numbers inside of strings do not erroneously get matched as numbers.

The supported types of tokens are:
* *lineNumbers* - for languages like BASIC that have explicit line-numbering, the `lineNumbers` token type extra
* *startBlockComments* - for languages that have block-delimited commenting, like JavaScripts `/* */`, use this rule to match the beginning of the block comment.
* *endBlockComments* - for languages that have block-delimited commenting, like JavaScripts `/* */`, use this rule to match the end of the block comment.
* *regexes* - for languages that have built-in literal syntax for Regular Expressions.
* *stringDelim* - use this rule to provide a list of tokens that delimit string literals.
* *startLineComments* - for language with line-ending commenting, like JavaScripts `//`, use this rule to match the beginning of the comment. The comment will then run to the first newline character (hence one of the reasons newline get matched first).
* *numbers* - use this rule to match integer and decimal numbers prior to matching any other keywords or identifiers that may contain numbers.
* *keywords* - use this rule to match language keywords, like `for` or `let` in JavaScript.
* *functions* - use this rule to match function expressions.
* *members* - use this rule to match identifiers that are accessed from an object.

Additionally, there are `newlines`, `whitespace`, and `regular`-type tokens. The `newlines` and `whitespace` types are provided by default by the `Grammar` class. The `regular` type is a catch-all type for any text that does not match any previous rule.

<em>NOTE: there is no general-purpose means by which we can gain perfect understanding of every language's syntax. The Grammar system provided by Primrose is meant for a high-level, textual understanding of language and not meant to completely parse and understand the structure of the program.</em>

#### Example
```javascript

export const JavaScript = new Grammar("JavaScript", [
    ["newlines", /(?:\r\n|\r|\n)/],
    ["whitespace", /(?:\s+)/],
    ["startBlockComments", /\/\*/],
    ["endBlockComments", /\*\//],
    ["regexes", /(?:^|,|;|\(|\[|\{)(?:\s*)(\/(?:\\\/|[^\n\/])+\/)/],
    ["stringDelim", /("|'|`)/],
    ["startLineComments", /\/\/.*$/m],
    ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/],
    ["keywords",
        /\b(?:break|case|catch|class|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/
    ],
    ["functions", /(\w+)(?:\s*\()/],
    ["members", /(\w+)\./],
    ["members", /((\w+\.)+)(\w+)/]
]);
```