import { documentReady } from "kudzu/events/documentReady";
import { TypedEvent, TypedEventBase } from "kudzu/events/EventBase";
import { createUtilityCanvas, isHTMLCanvas } from "kudzu/html/canvas";
import { border, display, height, overflow, padding, styles, width } from "kudzu/html/css";
import { isApple, isFirefox } from "kudzu/html/flags";
import { Canvas, elementClearChildren } from "kudzu/html/tags";
import { isDefined, isFunction, isString } from "kudzu/typeChecks";
import { multiLineInput, multiLineOutput, singleLineInput, singleLineOutput } from "./controlTypes";
import { Cursor } from "./Cursor";
import { grammars, JavaScript } from "./grammars";
import { FinalTokenType } from "./Grammars/Token";
import { MacOS, Windows } from "./os";
import { PrimroseRenderer } from "./Renderers/PrimroseRenderer";
import { Row } from "./Row";
import { Dark as DefaultTheme } from "./themes";
import { TimedEvent } from "./TimedEvent";
function isPrimroseOption(key) {
    return key === "readOnly"
        || key === "multiLine"
        || key === "wordWrap"
        || key === "scrollBars"
        || key === "lineNumbers"
        || key === "padding"
        || key === "fontSize"
        || key === "fontFamily"
        || key === "language"
        || key === "scaleFactor"
        || key === "element"
        || key === "width"
        || key === "height";
}
//>>>>>>>>>> PRIVATE STATIC FIELDS >>>>>>>>>>
const wheelScrollSpeed = 4, vScrollWidth = 2, scrollScale = isFirefox ? 3 : 100, optionDefaults = Object.freeze({
    readOnly: false,
    multiLine: true,
    wordWrap: true,
    scrollBars: true,
    lineNumbers: true,
    padding: 0,
    fontSize: 16,
    fontFamily: "monospace",
    language: "JavaScript",
    scaleFactor: devicePixelRatio
}), controls = new Array(), elements = new WeakMap(), ready = documentReady
    .then(() => {
    for (const element of Array.from(document.getElementsByTagName("primrose"))) {
        new Primrose({
            element: element
        });
    }
});
export class Primrose extends TypedEventBase {
    constructor(options) {
        super();
        this.longPress = null;
        this.tx = 0;
        this.ty = 0;
        this._value = "";
        this._padding = 0;
        this._theme = DefaultTheme;
        this._tabWidth = 2;
        this._canvas = null;
        this._hovered = false;
        this._focused = false;
        this._fontSize = null;
        this._fontFamily = null;
        this._scaleFactor = null;
        this._readOnly = false;
        this._wordWrap = false;
        this._multiLine = false;
        this.resized = false;
        this._element = null;
        this._language = JavaScript;
        this._showScrollBars = false;
        this._showLineNumbers = false;
        this.pressed = false;
        this.dragging = false;
        this.scrolling = false;
        this.tabPressed = false;
        this.tabString = "  ";
        this.historyIndex = -1;
        this.history = new Array();
        this.tokens = new Array();
        this.os = isApple ? MacOS : Windows;
        this.lineCount = 1;
        this.lineCountWidth = 0;
        this.controlType = singleLineOutput;
        this.lastCharacterHeight = null;
        this.lastCharacterWidth = null;
        this.lastFrontCursor = null;
        this.lastGridBoundsX = null;
        this.lastGridBoundsY = null;
        this.lastGridBoundsWidth = null;
        this.lastGridBoundsHeight = null;
        this.lastBackCursor = null;
        this.lastThemeName = null;
        this.lastPadding = null;
        this.lastFocused = null;
        this.lastScrollX = null;
        this.lastScrollY = null;
        this.lastFont = null;
        this.lastText = null;
        this.outEvt = new TypedEvent("out");
        this.overEvt = new TypedEvent("over");
        this.blurEvt = new TypedEvent("blur");
        this.focusEvt = new TypedEvent("focus");
        this.changeEvt = new TypedEvent("change");
        this.updateEvt = new TypedEvent("update");
        this.keyDownCommands = null;
        this.keyPressCommands = null;
        this.mouse = null;
        this.touch = null;
        //>>>>>>>>>> VALIDATE PARAMETERS >>>>>>>>>>
        options = options || {};
        if (options.element === undefined) {
            options.element = null;
        }
        if (options.element !== null
            && !(options.element instanceof HTMLElement)) {
            throw new Error("element must be null, an instance of HTMLElement, an instance of HTMLCanvaseElement, or an instance of OffscreenCanvas");
        }
        options = Object.assign({}, optionDefaults, options);
        //<<<<<<<<<< VALIDATE PARAMETERS <<<<<<<<<<
        //>>>>>>>>>> KEY EVENT HANDLERS >>>>>>>>>>
        this.keyDownCommands = new Map([
            ["CursorUp", () => {
                    const minCursor = Cursor.min(this.renderer.frontCursor, this.renderer.backCursor), maxCursor = Cursor.max(this.renderer.frontCursor, this.renderer.backCursor);
                    minCursor.up(this.renderer.rows);
                    maxCursor.copy(minCursor);
                    this.scrollIntoView(this.renderer.frontCursor);
                }],
            ["CursorDown", () => {
                    const minCursor = Cursor.min(this.renderer.frontCursor, this.renderer.backCursor), maxCursor = Cursor.max(this.renderer.frontCursor, this.renderer.backCursor);
                    maxCursor.down(this.renderer.rows);
                    minCursor.copy(maxCursor);
                    this.scrollIntoView(this.renderer.frontCursor);
                }],
            ["CursorLeft", () => {
                    const minCursor = Cursor.min(this.renderer.frontCursor, this.renderer.backCursor), maxCursor = Cursor.max(this.renderer.frontCursor, this.renderer.backCursor);
                    if (minCursor.i === maxCursor.i) {
                        minCursor.left(this.renderer.rows);
                    }
                    maxCursor.copy(minCursor);
                    this.scrollIntoView(this.renderer.frontCursor);
                }],
            ["CursorRight", () => {
                    const minCursor = Cursor.min(this.renderer.frontCursor, this.renderer.backCursor), maxCursor = Cursor.max(this.renderer.frontCursor, this.renderer.backCursor);
                    if (minCursor.i === maxCursor.i) {
                        maxCursor.right(this.renderer.rows);
                    }
                    minCursor.copy(maxCursor);
                    this.scrollIntoView(this.renderer.frontCursor);
                }],
            ["CursorPageUp", () => {
                    const minCursor = Cursor.min(this.renderer.frontCursor, this.renderer.backCursor), maxCursor = Cursor.max(this.renderer.frontCursor, this.renderer.backCursor);
                    minCursor.incY(this.renderer.rows, -this.renderer.gridBounds.height);
                    maxCursor.copy(minCursor);
                    this.scrollIntoView(this.renderer.frontCursor);
                }],
            ["CursorPageDown", () => {
                    const minCursor = Cursor.min(this.renderer.frontCursor, this.renderer.backCursor), maxCursor = Cursor.max(this.renderer.frontCursor, this.renderer.backCursor);
                    maxCursor.incY(this.renderer.rows, this.renderer.gridBounds.height);
                    minCursor.copy(maxCursor);
                    this.scrollIntoView(this.renderer.frontCursor);
                }],
            ["CursorSkipLeft", () => {
                    const minCursor = Cursor.min(this.renderer.frontCursor, this.renderer.backCursor), maxCursor = Cursor.max(this.renderer.frontCursor, this.renderer.backCursor);
                    if (minCursor.i === maxCursor.i) {
                        minCursor.skipLeft(this.renderer.rows);
                    }
                    maxCursor.copy(minCursor);
                    this.scrollIntoView(this.renderer.frontCursor);
                }],
            ["CursorSkipRight", () => {
                    const minCursor = Cursor.min(this.renderer.frontCursor, this.renderer.backCursor), maxCursor = Cursor.max(this.renderer.frontCursor, this.renderer.backCursor);
                    if (minCursor.i === maxCursor.i) {
                        maxCursor.skipRight(this.renderer.rows);
                    }
                    minCursor.copy(maxCursor);
                    this.scrollIntoView(this.renderer.frontCursor);
                }],
            ["CursorHome", () => {
                    this.renderer.frontCursor.home();
                    this.renderer.backCursor.copy(this.renderer.frontCursor);
                    this.scrollIntoView(this.renderer.frontCursor);
                }],
            ["CursorEnd", () => {
                    this.renderer.frontCursor.end(this.renderer.rows);
                    this.renderer.backCursor.copy(this.renderer.frontCursor);
                    this.scrollIntoView(this.renderer.frontCursor);
                }],
            ["CursorFullHome", () => {
                    this.renderer.frontCursor.fullHome();
                    this.renderer.backCursor.copy(this.renderer.frontCursor);
                    this.scrollIntoView(this.renderer.frontCursor);
                }],
            ["CursorFullEnd", () => {
                    this.renderer.frontCursor.fullEnd(this.renderer.rows);
                    this.renderer.backCursor.copy(this.renderer.frontCursor);
                    this.scrollIntoView(this.renderer.frontCursor);
                }],
            ["SelectDown", () => {
                    this.renderer.backCursor.down(this.renderer.rows);
                    this.scrollIntoView(this.renderer.frontCursor);
                }],
            ["SelectLeft", () => {
                    this.renderer.backCursor.left(this.renderer.rows);
                    this.scrollIntoView(this.renderer.backCursor);
                }],
            ["SelectRight", () => {
                    this.renderer.backCursor.right(this.renderer.rows);
                    this.scrollIntoView(this.renderer.backCursor);
                }],
            ["SelectUp", () => {
                    this.renderer.backCursor.up(this.renderer.rows);
                    this.scrollIntoView(this.renderer.backCursor);
                }],
            ["SelectPageDown", () => {
                    this.renderer.backCursor.incY(this.renderer.rows, this.renderer.gridBounds.height);
                    this.scrollIntoView(this.renderer.backCursor);
                }],
            ["SelectPageUp", () => {
                    this.renderer.backCursor.incY(this.renderer.rows, -this.renderer.gridBounds.height);
                    this.scrollIntoView(this.renderer.backCursor);
                }],
            ["SelectSkipLeft", () => {
                    this.renderer.backCursor.skipLeft(this.renderer.rows);
                    this.scrollIntoView(this.renderer.backCursor);
                }],
            ["SelectSkipRight", () => {
                    this.renderer.backCursor.skipRight(this.renderer.rows);
                    this.scrollIntoView(this.renderer.backCursor);
                }],
            ["SelectHome", () => {
                    this.renderer.backCursor.home();
                    this.scrollIntoView(this.renderer.backCursor);
                }],
            ["SelectEnd", () => {
                    this.renderer.backCursor.end(this.renderer.rows);
                    this.scrollIntoView(this.renderer.backCursor);
                }],
            ["SelectFullHome", () => {
                    this.renderer.backCursor.fullHome();
                    this.scrollIntoView(this.renderer.backCursor);
                }],
            ["SelectFullEnd", () => {
                    this.renderer.backCursor.fullEnd(this.renderer.rows);
                    this.scrollIntoView(this.renderer.backCursor);
                }],
            ["SelectAll", () => {
                    this.renderer.frontCursor.fullHome();
                    this.renderer.backCursor.fullEnd(this.renderer.rows);
                    this.render();
                }],
            ["ScrollDown", () => {
                    if (this.renderer.scroll.y < this.renderer.rows.length - this.renderer.gridBounds.height) {
                        this.scrollBy(0, 1);
                    }
                }],
            ["ScrollUp", () => {
                    if (this.renderer.scroll.y > 0) {
                        this.scrollBy(0, -1);
                    }
                }],
            ["DeleteLetterLeft", () => {
                    if (this.renderer.frontCursor.i === this.renderer.backCursor.i) {
                        this.renderer.backCursor.left(this.renderer.rows);
                    }
                    this.setSelectedText("");
                }],
            ["DeleteLetterRight", () => {
                    if (this.renderer.frontCursor.i === this.renderer.backCursor.i) {
                        this.renderer.backCursor.right(this.renderer.rows);
                    }
                    this.setSelectedText("");
                }],
            ["DeleteWordLeft", () => {
                    if (this.renderer.frontCursor.i === this.renderer.backCursor.i) {
                        this.renderer.frontCursor.skipLeft(this.renderer.rows);
                    }
                    this.setSelectedText("");
                }],
            ["DeleteWordRight", () => {
                    if (this.renderer.frontCursor.i === this.renderer.backCursor.i) {
                        this.renderer.backCursor.skipRight(this.renderer.rows);
                    }
                    this.setSelectedText("");
                }],
            ["DeleteLine", () => {
                    if (this.renderer.frontCursor.i === this.renderer.backCursor.i) {
                        this.renderer.frontCursor.home();
                        this.renderer.backCursor.end(this.renderer.rows);
                        this.renderer.backCursor.right(this.renderer.rows);
                    }
                    this.setSelectedText("");
                }],
            ["Undo", () => {
                    this.moveInHistory(-1);
                }],
            ["Redo", () => {
                    this.moveInHistory(1);
                }],
            ["InsertTab", () => {
                    this.tabPressed = true;
                    this.setSelectedText(this.tabString);
                }],
            ["RemoveTab", () => {
                    const row = this.renderer.rows[this.renderer.frontCursor.y], toDelete = Math.min(this.renderer.frontCursor.x, this.tabWidth);
                    for (let i = 0; i < this.renderer.frontCursor.x; ++i) {
                        if (row.text[i] !== ' ') {
                            // can only remove tabs at the beginning of a row
                            return;
                        }
                    }
                    this.renderer.backCursor.copy(this.renderer.frontCursor);
                    this.renderer.backCursor.incX(this.renderer.rows, -toDelete);
                    this.setSelectedText("");
                }]
        ]);
        this.keyPressCommands = new Map([
            ["AppendNewline", () => {
                    if (this.multiLine) {
                        let indent = "";
                        const row = this.renderer.rows[this.renderer.frontCursor.y].tokens;
                        if (row.length > 0
                            && row[0].type === "whitespace") {
                            indent = row[0].value;
                        }
                        this.setSelectedText("\n" + indent);
                    }
                    else {
                        this.dispatchEvent(this.changeEvt);
                    }
                }],
            ["PrependNewline", () => {
                    if (this.multiLine) {
                        let indent = "";
                        const row = this.renderer.rows[this.renderer.frontCursor.y].tokens;
                        if (row.length > 0
                            && row[0].type === "whitespace") {
                            indent = row[0].value;
                        }
                        this.renderer.frontCursor.home();
                        this.renderer.backCursor.copy(this.renderer.frontCursor);
                        this.setSelectedText(indent + "\n");
                    }
                    else {
                        this.dispatchEvent(this.changeEvt);
                    }
                }],
            ["Undo", () => {
                    this.moveInHistory(-1);
                }]
        ]);
        //<<<<<<<<<< KEY EVENT HANDLERS <<<<<<<<<<
        //>>>>>>>>>> POINTER EVENT HANDLERS >>>>>>>>>>
        const pointerOver = () => {
            this._hovered = true;
            this.dispatchEvent(this.overEvt);
        };
        const pointerOut = () => {
            this._hovered = false;
            this.dispatchEvent(this.outEvt);
        };
        //>>>>>>>>>> MOUSE EVENT HANDLERS >>>>>>>>>> 
        const setMousePointer = (evt) => {
            this.renderer.pointer.set(evt.offsetX, evt.offsetY);
        };
        const readMouseOverEvent = pointerOver;
        const readMouseOutEvent = pointerOut;
        const readMouseDownEvent = this.mouseLikePointerDown(setMousePointer);
        const readMouseUpEvent = this.mouseLikePointerUp.bind(this);
        const readMouseMoveEvent = this.mouseLikePointerMove(setMousePointer);
        //<<<<<<<<<< MOUSE EVENT HANDLERS <<<<<<<<<<
        //>>>>>>>>>> TOUCH EVENT HANDLERS >>>>>>>>>>
        this.longPress = new TimedEvent(1000);
        this.longPress.addEventListener("tick", () => {
            navigator.vibrate(20);
            this.startSelecting();
            this.renderer.backCursor.copy(this.renderer.frontCursor);
            this.renderer.frontCursor.skipLeft(this.renderer.rows);
            this.renderer.backCursor.skipRight(this.renderer.rows);
            this.render();
        });
        let currentTouchID = null;
        const findTouch = (touches) => {
            for (const touch of Array.from(touches)) {
                if (currentTouchID === null
                    || touch.identifier === currentTouchID) {
                    return touch;
                }
            }
            return null;
        };
        const withPrimaryTouch = (callback) => {
            return (evt) => {
                evt.preventDefault();
                callback(findTouch(evt.touches)
                    || findTouch(evt.changedTouches));
            };
        };
        const setTouchPointer = (touch) => {
            if (isHTMLCanvas(this.canvas)) {
                const cb = this.canvas.getBoundingClientRect();
                this.renderer.pointer.set(touch.clientX - cb.left, touch.clientY - cb.top);
            }
        };
        const readTouchStartEvent = withPrimaryTouch(this.touchLikePointerDown(setTouchPointer));
        const readTouchMoveEvent = withPrimaryTouch(this.touchLikePointerMove(setTouchPointer));
        const readTouchUpEvent = this.touchLikePointerUp.bind(this);
        const readTouchEndEvent = withPrimaryTouch(readTouchUpEvent);
        //<<<<<<<<<< TOUCH EVENT HANDLERS <<<<<<<<<<
        //>>>>>>>>>> UV POINTER EVENT HANDLERS >>>>>>>>>>
        const setUVPointer = (evt) => {
            this.renderer.pointer.set(evt.uv.x * this.width, (1 - evt.uv.y) * this.height);
        };
        this.mouse = {
            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform the hover gestures.
            // </summary>
            readOverEventUV: pointerOver,
            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform the end of the hover gesture.
            // </summary>
            readOutEventUV: pointerOut,
            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform mouse-like behavior for primary-button-down gesture.
            // </summary>
            readDownEventUV: this.mouseLikePointerDown(setUVPointer),
            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform mouse-like behavior for primary-button-up gesture.
            // </summary>
            readUpEventUV: readMouseUpEvent,
            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform mouse-like behavior for move gesture, whether the primary button is pressed or not.
            // </summary>
            readMoveEventUV: this.mouseLikePointerMove(setUVPointer)
        };
        this.touch = {
            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform the end of the hover gesture. This is the same as mouse.readOverEventUV, included for completeness.
            // </summary>
            readOverEventUV: pointerOver,
            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform the end of the hover gesture. This is the same as mouse.readOutEventUV, included for completeness.
            // </summary>
            readOutEventUV: pointerOut,
            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform touch-like behavior for the first finger touching down gesture.
            // </summary>
            readDownEventUV: this.touchLikePointerDown(setUVPointer),
            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform touch-like behavior for the first finger raising up gesture.
            // </summary>
            readMoveEventUV: this.touchLikePointerMove(setUVPointer),
            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform touch-like behavior for the first finger moving gesture.
            // </summary>
            readUpEventUV: readTouchUpEvent
        };
        //<<<<<<<<<< UV POINTER EVENT HANDLERS <<<<<<<<<<
        //<<<<<<<<<< POINTER EVENT HANDLERS <<<<<<<<<<
        //>>>>>>>>>> SETUP CANVAS >>>>>>>>>>
        let currentValue = "", currentTabIndex = -1;
        if (isHTMLCanvas(options.element)) {
            const elem = options.element, width = elem.width, height = elem.height;
            currentTabIndex = elem.tabIndex;
            const optionsStr = elem.dataset.options || "", entries = optionsStr.trim().split(','), optionUser = {};
            for (let entry of entries) {
                entry = entry.trim();
                if (entry.length > 0) {
                    const pairs = entry.split('=');
                    if (pairs.length > 1) {
                        const key = pairs[0].trim(), value = pairs[1].trim(), boolTest = value.toLocaleLowerCase();
                        if (isPrimroseOption(key)) {
                            if (boolTest === "true"
                                || boolTest === "false") {
                                optionUser[key] = boolTest === "true";
                            }
                            else {
                                optionUser[key] = value;
                            }
                        }
                    }
                }
            }
            currentValue = elem.textContent;
            options = Object.assign(options, { width, height }, optionUser);
        }
        if (options.element === null) {
            this._canvas = createUtilityCanvas(options.width, options.height);
        }
        else if (isHTMLCanvas(options.element)) {
            this._element = this._canvas = options.element;
            elementClearChildren(options.element);
        }
        else {
            this._element = options.element;
            elementClearChildren(this.element);
            this._canvas = Canvas(styles(width("100%"), height("100%")));
            this.element.appendChild(this._canvas);
            this.element.removeAttribute("tabindex");
            styles(display("block"), padding("none"), border("2px inset #c0c0c0"), overflow("unset"))
                .apply(this.element.style);
        }
        if (isHTMLCanvas(this.canvas)
            && this.canvas.parentElement !== null
            && currentTabIndex === -1) {
            const tabbableElements = Array.from(document.querySelectorAll("[tabindex]"));
            for (let tabbableElement of tabbableElements) {
                currentTabIndex = Math.max(currentTabIndex, tabbableElement.tabIndex);
            }
            ++currentTabIndex;
        }
        if (isHTMLCanvas(this.canvas)
            && this.isInDocument) {
            this.canvas.tabIndex = currentTabIndex;
            this.canvas.style.touchAction = "none";
            this.canvas.addEventListener("focus", () => this.focus());
            this.canvas.addEventListener("blur", () => this.blur());
            this.canvas.addEventListener("mouseover", readMouseOverEvent);
            this.canvas.addEventListener("mouseout", readMouseOutEvent);
            this.canvas.addEventListener("mousedown", readMouseDownEvent);
            this.canvas.addEventListener("mouseup", readMouseUpEvent);
            this.canvas.addEventListener("mousemove", readMouseMoveEvent);
            this.canvas.addEventListener("touchstart", readTouchStartEvent);
            this.canvas.addEventListener("touchend", readTouchEndEvent);
            this.canvas.addEventListener("touchmove", readTouchMoveEvent);
        }
        //<<<<<<<<<< SETUP CANVAS <<<<<<<<<<
        //>>>>>>>>>> INITIALIZE STATE >>>>>>>>>>
        this.addEventListener("blur", () => {
            if (this.tabPressed) {
                this.tabPressed = false;
                this.focus();
            }
        });
        if (isString(options.language)) {
            options.language = options.language.toLocaleLowerCase();
            if (grammars.has(options.language)) {
                options.language = grammars.get(options.language);
            }
            else {
                options.language = null;
            }
        }
        this.renderer = new PrimroseRenderer(this.canvas);
        Object.seal(this);
        //<<<<<<<<<< INITIALIZE STATE <<<<<<<<<<
        if (!isString(options.language)) {
            this.language = options.language;
        }
        this._scaleFactor = options.scaleFactor;
        this.readOnly = options.readOnly;
        this.multiLine = options.multiLine;
        this.wordWrap = options.wordWrap;
        this.showScrollBars = options.scrollBars;
        this.showLineNumbers = options.lineNumbers;
        this.padding = options.padding;
        this.fontSize = options.fontSize;
        this.fontFamily = options.fontFamily;
        this.value = currentValue;
        this.render();
        // This is done last so that controls that have errored 
        // out during their setup don't get added to the control
        // manager.
        Primrose.add(this.element, this);
    }
    startSelecting() {
        this.dragging = true;
        this.moveCursor(this.renderer.frontCursor);
    }
    pointerDown() {
        this.focus();
        this.pressed = true;
    }
    pointerMove() {
        if (this.dragging) {
            this.moveCursor(this.renderer.backCursor);
        }
        else if (this.pressed) {
            this.dragScroll();
        }
    }
    mouseLikePointerDown(setPointer) {
        return (evt) => {
            setPointer(evt);
            this.pointerDown();
            this.startSelecting();
        };
    }
    mouseLikePointerUp() {
        this.pressed = false;
        this.dragging = false;
        this.scrolling = false;
    }
    mouseLikePointerMove(setPointer) {
        return (evt) => {
            setPointer(evt);
            this.pointerMove();
        };
    }
    touchLikePointerDown(setPointer) {
        return (evt) => {
            setPointer(evt);
            this.tx = this.renderer.pointer.x;
            this.ty = this.renderer.pointer.y;
            this.pointerDown();
            this.longPress.start();
        };
    }
    touchLikePointerUp() {
        if (this.longPress.cancel() && !this.dragging) {
            this.startSelecting();
        }
        this.mouseLikePointerUp();
        this.renderer.lastScrollDX = null;
        this.renderer.lastScrollDY = null;
    }
    touchLikePointerMove(setPointer) {
        return (evt) => {
            setPointer(evt);
            if (this.longPress.isRunning) {
                const dx = this.renderer.pointer.x - this.tx, dy = this.renderer.pointer.y - this.ty, lenSq = dx * dx + dy * dy;
                if (lenSq > 25) {
                    this.longPress.cancel();
                }
            }
            if (!this.longPress.isRunning) {
                this.pointerMove();
            }
        };
    }
    moveCursor(cursor) {
        this.renderer.pointer.toCell(this.renderer.character, this.renderer.scroll, this.renderer.gridBounds);
        const gx = this.renderer.pointer.x - this.renderer.scroll.x, gy = this.renderer.pointer.y - this.renderer.scroll.y, onBottom = gy >= this.renderer.gridBounds.height, onLeft = gx < 0, onRight = this.renderer.pointer.x >= this.renderer.gridBounds.width;
        if (!this.scrolling && !onBottom && !onLeft && !onRight) {
            cursor.setXY(this.renderer.rows, this.renderer.pointer.x, this.renderer.pointer.y);
            this.renderer.backCursor.copy(cursor);
        }
        else if (this.scrolling || onRight && !onBottom) {
            this.scrolling = true;
            const scrollHeight = this.renderer.rows.length - this.renderer.gridBounds.height;
            if (gy >= 0 && scrollHeight >= 0) {
                const sy = gy * scrollHeight / this.renderer.gridBounds.height;
                this.scrollTo(this.renderer.scroll.x, sy);
            }
        }
        else if (onBottom && !onLeft) {
            let maxWidth = 0;
            for (let dy = 0; dy < this.renderer.rows.length; ++dy) {
                maxWidth = Math.max(maxWidth, this.renderer.rows[dy].text.length);
            }
            const scrollWidth = maxWidth - this.renderer.gridBounds.width;
            if (gx >= 0 && scrollWidth >= 0) {
                const sx = gx * scrollWidth / this.renderer.gridBounds.width;
                this.scrollTo(sx, this.renderer.scroll.y);
            }
        }
        else if (onLeft && !onBottom) {
            // clicked in number-line gutter
        }
        else {
            // clicked in the lower-left corner
        }
        this.render();
    }
    dragScroll() {
        if (this.renderer.lastScrollDX !== null
            && this.renderer.lastScrollDY !== null) {
            let dx = (this.renderer.lastScrollDX - this.renderer.pointer.x) / this.renderer.character.width, dy = (this.renderer.lastScrollDY - this.renderer.pointer.y) / this.renderer.character.height;
            this.scrollBy(dx, dy);
        }
        this.renderer.lastScrollDX = this.renderer.pointer.x;
        this.renderer.lastScrollDY = this.renderer.pointer.y;
    }
    refreshControlType() {
        const lastControlType = this.controlType;
        if (this.readOnly && this.multiLine) {
            this.controlType = multiLineOutput;
        }
        else if (this.readOnly && !this.multiLine) {
            this.controlType = singleLineOutput;
        }
        else if (!this.readOnly && this.multiLine) {
            this.controlType = multiLineInput;
        }
        else {
            this.controlType = singleLineInput;
        }
        if (this.controlType !== lastControlType) {
            this.refreshAllTokens();
        }
    }
    refreshGutter() {
        if (!this.showScrollBars) {
            this.renderer.bottomRightGutter.set(0, 0);
        }
        else if (this.wordWrap) {
            this.renderer.bottomRightGutter.set(vScrollWidth, 0);
        }
        else {
            this.renderer.bottomRightGutter.set(vScrollWidth, 1);
        }
    }
    render() {
        this.doRender();
    }
    async doRender() {
        const textChanged = this.lastText !== this.value, focusChanged = this.focused !== this.lastFocused, fontChanged = this.renderer.context.font !== this.lastFont, paddingChanged = this.padding !== this.lastPadding, themeChanged = this.theme.name !== this.lastThemeName, boundsXChanged = this.renderer.gridBounds.x !== this.lastGridBoundsX, boundsYChanged = this.renderer.gridBounds.y !== this.lastGridBoundsY, boundsWidthChanged = this.renderer.gridBounds.width !== this.lastGridBoundsWidth, boundsHeightChanged = this.renderer.gridBounds.height !== this.lastGridBoundsHeight, boundsChanged = boundsXChanged
            || boundsYChanged
            || boundsWidthChanged
            || boundsHeightChanged, characterWidthChanged = this.renderer.character.width !== this.lastCharacterWidth, characterHeightChanged = this.renderer.character.height !== this.lastCharacterHeight, characterSizeChanged = characterWidthChanged
            || characterHeightChanged, cursorChanged = this.renderer.frontCursor.i !== this.lastFrontCursor
            || this.renderer.backCursor.i !== this.lastBackCursor, scrollChanged = this.renderer.scroll.x !== this.lastScrollX
            || this.renderer.scroll.y !== this.lastScrollY, layoutChanged = this.resized
            || boundsChanged
            || textChanged
            || characterSizeChanged
            || paddingChanged
            || scrollChanged
            || themeChanged, backgroundChanged = layoutChanged
            || cursorChanged, foregroundChanged = layoutChanged
            || fontChanged, trimChanged = layoutChanged
            || focusChanged;
        const tasks = new Array();
        if (backgroundChanged) {
            tasks.push(this.renderer.bg.render(this.theme, Cursor.min(this.renderer.frontCursor, this.renderer.backCursor), Cursor.max(this.renderer.frontCursor, this.renderer.backCursor), this.renderer.gridBounds, this.renderer.scroll, this.renderer.character, this.padding, this.focused, this.renderer.rows));
        }
        if (foregroundChanged) {
            tasks.push(this.renderer.fg.render(this.theme, this.renderer.gridBounds, this.renderer.scroll, this.renderer.character, this.padding, this.renderer.rows, this.fontFamily, this.fontSize));
        }
        if (trimChanged) {
            tasks.push(this.renderer.trim.render(this.theme, this.renderer.gridBounds, this.renderer.scroll, this.renderer.character, this.padding, this.focused, this.renderer.rows, this.fontFamily, this.fontSize, this.showLineNumbers, this.lineCountWidth, this.showScrollBars, vScrollWidth, this.wordWrap));
        }
        await Promise.all(tasks);
        await this.renderer.render();
        this.lastGridBoundsX = this.renderer.gridBounds.x;
        this.lastGridBoundsY = this.renderer.gridBounds.y;
        this.lastGridBoundsWidth = this.renderer.gridBounds.width;
        this.lastGridBoundsHeight = this.renderer.gridBounds.height;
        this.lastText = this.value;
        this.lastCharacterWidth = this.renderer.character.width;
        this.lastCharacterHeight = this.renderer.character.height;
        this.lastPadding = this.padding;
        this.lastFrontCursor = this.renderer.frontCursor.i;
        this.lastBackCursor = this.renderer.backCursor.i;
        this.lastFocused = this.focused;
        this.lastFont = this.renderer.context.font;
        this.lastThemeName = this.theme.name;
        this.lastScrollX = this.renderer.scroll.x;
        this.lastScrollY = this.renderer.scroll.y;
        this.resized = false;
        this.dispatchEvent(this.updateEvt);
    }
    setValue(txt, setUndo) {
        txt = txt || "";
        txt = txt.replace(/\r\n/g, "\n");
        if (txt !== this.value) {
            this._value = txt;
            if (setUndo) {
                this.pushUndo();
            }
            this.refreshAllTokens();
            this.dispatchEvent(this.changeEvt);
        }
    }
    setSelectedText(txt) {
        txt = txt || "";
        txt = txt.replace(/\r\n/g, "\n");
        if (this.renderer.frontCursor.i !== this.renderer.backCursor.i || txt.length > 0) {
            const minCursor = Cursor.min(this.renderer.frontCursor, this.renderer.backCursor), maxCursor = Cursor.max(this.renderer.frontCursor, this.renderer.backCursor), startRow = this.renderer.rows[minCursor.y], endRow = this.renderer.rows[maxCursor.y], unchangedLeft = this.value.substring(0, startRow.startStringIndex), unchangedRight = this.value.substring(endRow.endStringIndex), changedStartSubStringIndex = minCursor.i - startRow.startStringIndex, changedLeft = startRow.substring(0, changedStartSubStringIndex), changedEndSubStringIndex = maxCursor.i - endRow.startStringIndex, changedRight = endRow.substring(changedEndSubStringIndex), changedText = changedLeft + txt + changedRight;
            this.value = unchangedLeft + changedText + unchangedRight;
            this.pushUndo();
            this.refreshAllTokens();
            this.renderer.frontCursor.setI(this.renderer.rows, minCursor.i + txt.length);
            this.renderer.backCursor.copy(this.renderer.frontCursor);
            this.scrollIntoView(this.renderer.frontCursor);
            this.dispatchEvent(this.changeEvt);
        }
    }
    refreshAllTokens() {
        this.refreshTokens(0, this.renderer.rows.length - 1, this.value);
    }
    refreshTokens(startY, endY, txt) {
        // Guessing at where to retokenize
        if (startY < 0) {
            startY = 0;
        }
        if (endY >= this.renderer.rows.length) {
            endY = this.renderer.rows.length - 1;
        }
        while (startY > 0
            && this.renderer.rows[startY].lineNumber === this.renderer.rows[startY - 1].lineNumber) {
            --startY;
            txt = this.renderer.rows[startY].text + txt;
        }
        while (endY < this.renderer.rows.length - 1
            && this.renderer.rows[endY].lineNumber === this.renderer.rows[endY + 1].lineNumber) {
            ++endY;
            txt += this.renderer.rows[endY].text;
        }
        const newTokens = this.language.tokenize(txt), startRow = this.renderer.rows[startY], startTokenIndex = startRow.startTokenIndex, startLineNumber = startRow.lineNumber, startStringIndex = startRow.startStringIndex, endRow = this.renderer.rows[endY], endTokenIndex = endRow.endTokenIndex, tokenRemoveCount = endTokenIndex - startTokenIndex, oldTokens = this.tokens.splice(startTokenIndex, tokenRemoveCount, ...newTokens);
        // figure out the width of the line count gutter
        this.lineCountWidth = 0;
        if (this.showLineNumbers) {
            for (let token of oldTokens) {
                if (token.type === FinalTokenType.newLines) {
                    --this.lineCount;
                }
            }
            for (let token of newTokens) {
                if (token.type === FinalTokenType.newLines) {
                    ++this.lineCount;
                }
            }
            this.lineCountWidth = Math.max(1, Math.ceil(Math.log(this.lineCount) / Math.LN10)) + 1;
        }
        // measure the grid
        const x = Math.floor(this.lineCountWidth + this.padding / this.renderer.character.width), y = Math.floor(this.padding / this.renderer.character.height), w = Math.floor((this.width - 2 * this.padding) / this.renderer.character.width) - x - this.renderer.bottomRightGutter.width, h = Math.floor((this.height - 2 * this.padding) / this.renderer.character.height) - y - this.renderer.bottomRightGutter.height;
        this.renderer.gridBounds.set(x, y, w, h);
        // Perform the layout
        const tokenQueue = newTokens.map(t => t.clone()), rowRemoveCount = endY - startY + 1, newRows = [];
        let currentString = "", currentTokens = [], currentStringIndex = startStringIndex, currentTokenIndex = startTokenIndex, currentLineNumber = startLineNumber;
        for (let i = 0; i < tokenQueue.length; ++i) {
            const t = tokenQueue[i], widthLeft = this.renderer.gridBounds.width - currentString.length, wrap = this.wordWrap && t.type !== FinalTokenType.newLines && t.length > widthLeft, breakLine = t.type === FinalTokenType.newLines || wrap;
            if (wrap) {
                const split = t.length > this.renderer.gridBounds.width
                    ? widthLeft
                    : 0;
                tokenQueue.splice(i + 1, 0, t.splitAt(split));
            }
            currentTokens.push(t);
            currentString += t.value;
            if (breakLine
                || i === tokenQueue.length - 1) {
                newRows.push(new Row(currentString, currentTokens, currentStringIndex, currentTokenIndex, currentLineNumber));
                currentStringIndex += currentString.length;
                currentTokenIndex += currentTokens.length;
                currentTokens = [];
                currentString = "";
                if (t.type === FinalTokenType.newLines) {
                    ++currentLineNumber;
                }
            }
        }
        this.renderer.rows.splice(startY, rowRemoveCount, ...newRows);
        // renumber rows
        for (let y = startY + newRows.length; y < this.renderer.rows.length; ++y) {
            const row = this.renderer.rows[y];
            row.lineNumber = currentLineNumber;
            row.startStringIndex = currentStringIndex;
            row.startTokenIndex += currentTokenIndex;
            currentStringIndex += row.text.length;
            currentTokenIndex += row.numTokens;
            if (row.tokens.length > 0) {
                const lastToken = row.tokens[row.tokens.length - 1];
                if (lastToken.type === FinalTokenType.newLines) {
                    ++currentLineNumber;
                }
            }
        }
        // provide editing room at the end of the buffer
        if (this.renderer.rows.length === 0) {
            this.renderer.rows.push(Row.emptyRow(0, 0, 0));
        }
        else {
            const lastRow = this.renderer.rows[this.renderer.rows.length - 1];
            if (lastRow.text.endsWith('\n')) {
                this.renderer.rows.push(Row.emptyRow(lastRow.endStringIndex, lastRow.endTokenIndex, lastRow.lineNumber + 1));
            }
        }
        this.renderer.maxVerticalScroll = Math.max(0, this.renderer.rows.length - this.renderer.gridBounds.height);
        this.render();
    }
    minDelta(v, minV, maxV) {
        const dvMinV = v - minV, dvMaxV = v - maxV + 5;
        let dv = 0;
        if (dvMinV < 0 || dvMaxV >= 0) {
            // compare the absolute values, so we get the smallest change
            // regardless of direction.
            dv = Math.abs(dvMinV) < Math.abs(dvMaxV)
                ? dvMinV
                : dvMaxV;
        }
        return dv;
    }
    clampScroll() {
        const toHigh = this.renderer.scroll.y < 0 || this.renderer.maxVerticalScroll === 0, toLow = this.renderer.scroll.y > this.renderer.maxVerticalScroll;
        if (toHigh) {
            this.renderer.scroll.y = 0;
        }
        else if (toLow) {
            this.renderer.scroll.y = this.renderer.maxVerticalScroll;
        }
        this.render();
        return toHigh || toLow;
    }
    scrollIntoView(currentCursor) {
        const dx = this.minDelta(currentCursor.x, this.renderer.scroll.x, this.renderer.scroll.x + this.renderer.gridBounds.width), dy = this.minDelta(currentCursor.y, this.renderer.scroll.y, this.renderer.scroll.y + this.renderer.gridBounds.height);
        this.scrollBy(dx, dy);
    }
    pushUndo() {
        if (this.historyIndex < this.history.length - 1) {
            this.history.splice(this.historyIndex + 1);
        }
        this.history.push({
            value: this.value,
            frontCursor: this.renderer.frontCursor.i,
            backCursor: this.renderer.backCursor.i
        });
        this.historyIndex = this.history.length - 1;
    }
    moveInHistory(dh) {
        const nextHistoryIndex = this.historyIndex + dh;
        if (0 <= nextHistoryIndex && nextHistoryIndex < this.history.length) {
            const curFrame = this.history[this.historyIndex];
            this.historyIndex = nextHistoryIndex;
            const nextFrame = this.history[this.historyIndex];
            this.setValue(nextFrame.value, false);
            this.renderer.frontCursor.setI(this.renderer.rows, curFrame.frontCursor);
            this.renderer.backCursor.setI(this.renderer.rows, curFrame.backCursor);
        }
    }
    /// <summary>
    /// Move the scroll window to a new location. Values get clamped to the text contents of the editor.
    /// </summary>
    scrollTo(x, y) {
        if (!this.wordWrap) {
            this.renderer.scroll.x = x;
        }
        this.renderer.scroll.y = y;
        return this.clampScroll();
    }
    /// <summary>
    /// Move the scroll window by a given amount to a new location. The final location of the scroll window gets clamped to the text contents of the editor.
    /// </summary>
    scrollBy(dx, dy) {
        return this.scrollTo(this.renderer.scroll.x + dx, this.renderer.scroll.y + dy);
    }
    readKeyDownEvent(evt) {
        const command = this.os.makeCommand(evt);
        const func = this.keyDownCommands.get(command.command);
        if (func) {
            evt.preventDefault();
            func();
        }
    }
    readKeyPressEvent(evt) {
        const command = this.os.makeCommand(evt);
        if (!this.readOnly) {
            evt.preventDefault();
            if (this.keyPressCommands.has(command.command)) {
                this.keyPressCommands.get(command.command)();
            }
            else if (command.type === "printable"
                || command.type === "whitespace") {
                this.setSelectedText(command.text);
            }
            this.clampScroll();
            this.render();
        }
    }
    copySelectedText(evt) {
        if (this.focused && this.renderer.frontCursor.i !== this.renderer.backCursor.i) {
            evt.clipboardData.setData("text/plain", this.selectedText);
            evt.returnValue = false;
            return true;
        }
        return false;
    }
    readCopyEvent(evt) {
        this.copySelectedText(evt);
    }
    readCutEvent(evt) {
        if (this.copySelectedText(evt)
            && !this.readOnly) {
            this.setSelectedText("");
        }
    }
    readPasteEvent(evt) {
        if (this.focused && !this.readOnly) {
            evt.returnValue = false;
            const oldClipboard = window.clipboardData;
            const clipboard = evt.clipboardData || oldClipboard, str = clipboard.getData(oldClipboard ? "Text" : "text/plain");
            if (str) {
                this.setSelectedText(str);
            }
        }
    }
    readWheelEvent(evt) {
        if (this.hovered || this.focused) {
            if (!evt.ctrlKey
                && !evt.altKey
                && !evt.shiftKey
                && !evt.metaKey) {
                const dy = Math.floor(evt.deltaY * wheelScrollSpeed / scrollScale);
                if (!this.scrollBy(0, dy) || this.focused) {
                    evt.preventDefault();
                }
            }
            else if (!evt.ctrlKey
                && !evt.altKey
                && !evt.metaKey) {
                evt.preventDefault();
                this.fontSize += -evt.deltaY / scrollScale;
            }
            this.render();
        }
    }
    /// <summary>
    /// The DOM element that was used to construct the `Primrose` control out of the document tree.If the Control was not constructed from the document tree, this value will be`null`.
    /// </summary>
    get element() { return this._element; }
    /// <summary>
    /// Returns `false` if `element` is null. Returns `true` otherwise.
    /// </summary>
    get isInDocument() {
        return isHTMLCanvas(this.canvas)
            && document.body.contains(this.canvas);
    }
    /// <summary>
    /// The canvas to which the editor is rendering text. If the `options.element` value was set to a canvas, that canvas will be returned. Otherwise, the canvas will be the canvas that Primrose created for the control. If `OffscreenCanvas` is not available, the canvas will be an `HTMLCanvasElement`.
    /// </summary>
    get canvas() {
        return this._canvas;
    }
    /// <summary>
    /// Returns `true` when the control has a pointer hovering over it.
    /// </summary>
    get hovered() {
        return this._hovered;
    }
    /// <summary>
    /// Returns `true` when the control has been selected.Writing to this value will change the focus state of the control.
    /// If the control is already focused and`focused` is set to`true`, or the control is not focused and`focus` is set to`false`, nothing happens.
    /// If the control is focused and`focused` is set to`false`, the control is blurred, just as if `blur()` was called.
    /// If the control is not focused and`focused` is set to`true`, the control is blurred, just as if `focus()` was called.
    /// </summary>
    get focused() {
        return this._focused;
    }
    set focused(f) {
        if (f !== this.focused) {
            this._focused = f;
            if (f) {
                this.dispatchEvent(this.focusEvt);
            }
            else {
                this.dispatchEvent(this.blurEvt);
            }
            this.render();
        }
    }
    /// <summary>
    /// Removes focus from the control.
    /// </summary>
    blur() {
        this.focused = false;
    }
    /// <summary>
    /// Sets the control to be the focused control. If all controls in the app have been properly registered with the Event Manager, then any other, currently focused control will first get `blur`red.
    /// </summary>
    focus() {
        this.focused = true;
    }
    /// <summary>
    /// Indicates whether or not the text in the editor control can be modified.
    /// </summary>
    get readOnly() {
        return this._readOnly;
    }
    set readOnly(r) {
        if (r !== this.readOnly) {
            this._readOnly = r;
            this.refreshControlType();
        }
    }
    get multiLine() {
        return this._multiLine;
    }
    set multiLine(m) {
        if (m !== this.multiLine) {
            if (!m && this.wordWrap) {
                this.wordWrap = false;
            }
            this._multiLine = m;
            this.refreshControlType();
            this.refreshGutter();
        }
    }
    /// <summary>
    /// Indicates whether or not the text in the editor control will be broken across lines when it reaches the right edge of the editor control.
    /// </summary>
    get wordWrap() {
        return this._wordWrap;
    }
    set wordWrap(w) {
        if (w !== this.wordWrap
            && (this.multiLine
                || !w)) {
            this._wordWrap = w;
            this.refreshGutter();
            this.render();
        }
    }
    /// <summary>
    /// The text value contained in the control. NOTE: if the text value was set with Windows-style newline characters (`\r\n`), the newline characters will be normalized to Unix-style newline characters (`\n`).
    /// </summary>
    get value() {
        return this._value;
    }
    set value(txt) {
        this.setValue(txt, true);
    }
    /// <summary>
    /// The range of text that is currently selected by the cursor. If no text is selected, reading `selectedText` returns the empty string (`""`) and writing to it inserts text at the current cursor location. 
    /// If text is selected, reading `selectedText` returns the text between the front and back cursors, writing to it overwrites the selected text, inserting the provided value.
    /// </summary>
    get selectedText() {
        const minCursor = Cursor.min(this.renderer.frontCursor, this.renderer.backCursor), maxCursor = Cursor.max(this.renderer.frontCursor, this.renderer.backCursor);
        return this.value.substring(minCursor.i, maxCursor.i);
    }
    set selectedText(txt) {
        this.setSelectedText(txt);
    }
    /// <summary>
    /// The string index at which the front cursor is located. NOTE: the "front cursor" is the main cursor, but does not necessarily represent the beginning of the selction range. The selection range runs from the minimum of front and back cursors, to the maximum.
    /// </summary>
    get selectionStart() {
        return this.renderer.frontCursor.i;
    }
    set selectionStart(i) {
        i = i | 0;
        if (i !== this.renderer.frontCursor.i) {
            this.renderer.frontCursor.setI(this.renderer.rows, i);
            this.render();
        }
    }
    /// <summary>
    /// The string index at which the back cursor is located. NOTE: the "back cursor" is the selection range cursor, but does not necessarily represent the end of the selction range. The selection range runs from the minimum of front and back cursors, to the maximum.
    /// </summary>
    get selectionEnd() {
        return this.renderer.backCursor.i;
    }
    set selectionEnd(i) {
        i = i | 0;
        if (i !== this.renderer.backCursor.i) {
            this.renderer.backCursor.setI(this.renderer.rows, i);
            this.render();
        }
    }
    /// <summary>
    /// If the back cursor is behind the front cursor, this value returns `"backward"`. Otherwise, `"forward"` is returned.
    /// </summary>
    get selectionDirection() {
        return this.renderer.frontCursor.i <= this.renderer.backCursor.i
            ? "forward"
            : "backward";
    }
    /// <summary>
    /// The number of spaces to insert when the <kbd>Tab</kbd> key is pressed. Changing this value does not convert existing tabs, it only changes future tabs that get inserted.
    /// </summary>
    get tabWidth() {
        return this._tabWidth;
    }
    set tabWidth(tw) {
        this._tabWidth = tw || 2;
        this.tabString = "";
        for (let i = 0; i < this.tabWidth; ++i) {
            this.tabString += " ";
        }
    }
    /// <summary>
    /// A JavaScript object that defines the color and style values for rendering different UI and text elements.
    /// </summary>
    get theme() {
        return this._theme;
    }
    set theme(t) {
        if (t !== this.theme) {
            this._theme = t;
            this.render();
        }
    }
    /// <summary>
    /// Set or get the language pack used to tokenize the control text for syntax highlighting.
    /// </summary>
    get language() {
        return this._language;
    }
    set language(l) {
        if (l !== this.language) {
            this._language = l;
            this.refreshAllTokens();
        }
    }
    /// <summary>
    /// The `Number` of pixels to inset the control rendering from the edge of the canvas. This is useful for texturing objects where the texture edge cannot be precisely controlled. This value is scale-independent.
    /// </summary>
    get padding() {
        return this._padding;
    }
    set padding(p) {
        p = p | 0;
        if (p !== this.padding) {
            this._padding = p;
            this.render();
        }
    }
    /// <summary>
    /// Indicates whether or not line numbers should be rendered on the left side of the control.
    /// </summary>
    get showLineNumbers() {
        return this._showLineNumbers;
    }
    set showLineNumbers(s) {
        if (s !== this.showLineNumbers) {
            this._showLineNumbers = s;
            this.refreshGutter();
        }
    }
    /// <summary>
    /// Indicates whether or not scroll bars should be rendered at the right and bottom in the control. If wordWrap is enabled, the bottom, horizontal scrollbar will not be rendered.
    /// </summary>
    get showScrollBars() {
        return this._showScrollBars;
    }
    set showScrollBars(s) {
        if (s !== this.showScrollBars) {
            this._showScrollBars = s;
            this.refreshGutter();
        }
    }
    /// <summary>
    /// The `Number` of pixels tall to draw characters. This value is scale-independent.
    /// </summary>
    get fontSize() {
        return this._fontSize;
    }
    set fontSize(s) {
        this.setFont(this.fontFamily, s);
    }
    get fontFamily() {
        return this._fontFamily;
    }
    set fontFamily(v) {
        this.setFont(v, this.fontSize);
    }
    setFont(family, size) {
        size = Math.max(1, size || 0);
        if (family !== this.fontFamily
            || size !== this.fontSize) {
            this._fontFamily = family;
            this._fontSize = size;
            this.renderer.setFont(this.fontFamily, this.fontSize)
                .then(() => this.refreshAllTokens());
            this.refreshAllTokens();
        }
    }
    /// <summary>
    /// The value by which pixel values are scaled before being used by the editor control.
    /// With THREE.js, it's best to set this value to 1 and change the width, height, and fontSize manually.
    /// </summary>
    get scaleFactor() {
        return this._scaleFactor;
    }
    set scaleFactor(s) {
        s = Math.max(0.25, Math.min(4, s || 0));
        this.setSize(this.width, this.height, s);
    }
    /// <summary>
    /// The scale-independent width of the editor control.
    /// </summary>
    get width() {
        return this.canvas.width / this.scaleFactor;
    }
    set width(w) {
        this.setSize(w, this.height, this.scaleFactor);
    }
    /// <summary>
    /// The scale-independent height of the editor control.
    /// </summary>
    get height() {
        return this.canvas.height / this.scaleFactor;
    }
    set height(h) {
        this.setSize(this.width, h, this.scaleFactor);
    }
    /// <summary>
    /// </summary>
    resize() {
        if (!isHTMLCanvas(this.canvas)
            || !this.isInDocument) {
            console.warn("Can't automatically resize a canvas that is not in the DOM tree");
        }
        else {
            this.setSize(this.canvas.clientWidth, this.canvas.clientHeight, devicePixelRatio);
        }
    }
    /// <summary>
    /// Sets the scale-independent width and height of the editor control.
    /// </summary>
    setSize(w, h, scaleFactor) {
        this.renderer.setSize(w, h, scaleFactor)
            .then(() => {
            this._scaleFactor = scaleFactor;
            this.resized = true;
            this.refreshAllTokens();
        });
    }
    /// <summary>
    /// Checks for the existence of a control, by the key that the user supplied when calling `Primrose.add()`
    /// </summary>
    static has(key) {
        return elements.has(key);
    }
    /// <summary>
    /// Gets the control associated with the given key.
    /// </summary>
    static get(key) {
        return elements.has(key)
            ? elements.get(key)
            : null;
    }
    /// <summary>
    /// Registers a new Primrose editor control with the Event Manager, to wire-up key, clipboard, and mouse wheel events, and to manage the currently focused element.
    /// The Event Manager maintains the references in a WeakMap, so when the JS Garbage Collector collects the objects, they will be gone.
    /// Multiple objects may be used to register a single control with the Event Manager without causing issue.This is useful for associating the control with closed objects from other systems, such as Three.js Mesh objects being targeted for pointer picking.
    /// If you are working with Three.js, it's recommended to use the Mesh on which you are texturing the canvas as the key when adding the editor to the Event Manager.
    /// </summary>
    static add(key, control) {
        if (key !== null) {
            elements.set(key, control);
        }
        if (controls.indexOf(control) === -1) {
            controls.push(control);
            publicControls = controls.slice();
            control.addEventListener("blur", () => {
                focusedControl = null;
            });
            control.addEventListener("focus", () => {
                // make sure the previous control knows it has 
                // gotten unselected.
                if (focusedControl !== null
                    && (!focusedControl.isInDocument
                        || !control.isInDocument)) {
                    focusedControl.blur();
                }
                focusedControl = control;
            });
            control.addEventListener("over", () => {
                hoveredControl = control;
            });
            control.addEventListener("out", () => {
                hoveredControl = null;
            });
        }
    }
    /// <summary>
    /// The current `Primrose` control that has the mouse hovered over it. In 2D contexts, you probably don't need to check this value, but in WebGL contexts, this is useful for helping Primrose manage events.
    /// If no control is hovered, this returns `null`.
    /// </summary>
    static get hoveredControl() {
        return hoveredControl;
    }
    /// <summary>
    /// The current `Primrose` control that has pointer-focus. It will receive all keyboard and clipboard events. In 2D contexts, you probably don't need to check this value, but in WebGL contexts, this is useful for helping Primrose manage events.
    /// If no control is focused, this returns `null`.
    /// </summary>
    static get focusedControl() {
        return focusedControl;
    }
    /// <summary>
    /// An array of all of the `Primrose` editor controls that Primrose currently knows about.
    /// This array is not mutable and is not the array used by the Event Manager. It is a read-only clone that is created whenever the Event Manager registers or removes a new control
    /// </summary.
    static get editors() {
        return publicControls;
    }
    /// <summary>
    /// A `Promise` that resolves when the document is ready and the Event Manager has finished its initial setup.
    /// </summary>
    static get ready() {
        return ready;
    }
}
let focusedControl = null, hoveredControl = null, publicControls = new Array();
requestAnimationFrame(function update() {
    requestAnimationFrame(update);
    for (let i = controls.length - 1; i >= 0; --i) {
        const control = controls[i];
        if (control.isInDocument) {
            if (elements.has(control.element)) {
                control.resize();
            }
            else {
                controls.splice(i, 1);
                publicControls = controls.slice();
            }
        }
    }
});
function withCurrentControl(funcName) {
    const evtName = funcName
        .match(/read(\w+)Event/)[1]
        .toLocaleLowerCase();
    window.addEventListener(evtName, (evt) => {
        if (isDefined(focusedControl)) {
            const func = focusedControl[funcName];
            if (isFunction(func)) {
                func.call(focusedControl, evt);
            }
        }
    }, { passive: false });
}
withCurrentControl("readKeyDownEvent");
withCurrentControl("readKeyPressEvent");
withCurrentControl("readCopyEvent");
withCurrentControl("readCutEvent");
withCurrentControl("readPasteEvent");
window.addEventListener("wheel", (evt) => {
    const control = focusedControl || hoveredControl;
    if (isDefined(control)) {
        control.readWheelEvent(evt);
    }
}, { passive: false });
//# sourceMappingURL=Primrose.js.map