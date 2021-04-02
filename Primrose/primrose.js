import { documentReady } from "kudzu/events/documentReady";
import { TypedEvent, TypedEventBase } from "kudzu/events/EventBase";
import { makeFont } from "kudzu/graphics2d/fonts";
import { Point } from "kudzu/graphics2d/Point";
import { Rectangle } from "kudzu/graphics2d/Rectangle";
import { Size } from "kudzu/graphics2d/Size";
import { createUtilityCanvas, isHTMLCanvas, setContextSize } from "kudzu/html/canvas";
import { border, display, height, overflow, padding, styles, width } from "kudzu/html/css";
import { isApple, isFirefox } from "kudzu/html/flags";
import { Canvas, elementClearChildren } from "kudzu/html/tags";
import { isDefined, isFunction, isString } from "kudzu/typeChecks";
import { multiLineInput, multiLineOutput, singleLineInput, singleLineOutput } from "./controlTypes";
import { Cursor } from "./Cursor";
import { grammars, JavaScript } from "./grammars";
import { FinalTokenType } from "./Grammars/Token";
import { BackgroundLayer } from "./Layers/BackgroundLayer";
import { ForegroundLayer } from "./Layers/ForegroundLayer";
import { MacOS, Windows } from "./os";
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
        this.tx = 0;
        this.ty = 0;
        this.vibX = 0;
        this.vibY = 0;
        this.pressed = false;
        this.dragging = false;
        this.scrolling = false;
        this.lastScrollDX = null;
        this.lastScrollDY = null;
        this.canRender = false;
        this._value = "";
        this._padding = 0;
        this._theme = DefaultTheme;
        this._tabWidth = 2;
        this.canv = null;
        this.resized = false;
        this._hovered = false;
        this._focused = false;
        this._fontSize = null;
        this._fontFamily = null;
        this._scaleFactor = 2;
        this.tabString = "  ";
        this._readOnly = false;
        this._wordWrap = false;
        this.historyIndex = -1;
        this._multiLine = false;
        this.tabPressed = false;
        this.lineCount = 1;
        this.lineCountWidth = 0;
        this._element = null;
        this._language = JavaScript;
        this._showScrollBars = false;
        this._showLineNumbers = false;
        this.controlType = singleLineOutput;
        this.maxVerticalScroll = 0;
        this.lastCharacterHeight = null;
        this.lastCharacterWidth = null;
        this.lastFrontCursor = null;
        this.lastGridBounds = null;
        this.lastBackCursor = null;
        this.lastThemeName = null;
        this.lastPadding = null;
        this.lastFocused = null;
        this.lastScrollX = null;
        this.lastScrollY = null;
        this.lastFont = null;
        this.lastText = null;
        this.history = new Array();
        this.tokens = new Array();
        this.rows = [Row.emptyRow(0, 0, 0)];
        this.scroll = new Point();
        this.pointer = new Point();
        this.character = new Rectangle();
        this.bottomRightGutter = new Size();
        this.gridBounds = new Rectangle();
        this.tokenBack = new Cursor();
        this.tokenFront = new Cursor();
        this.backCursor = new Cursor();
        this.frontCursor = new Cursor();
        this.os = isApple ? MacOS : Windows;
        this.outEvt = new TypedEvent("out");
        this.overEvt = new TypedEvent("over");
        this.blurEvt = new TypedEvent("blur");
        this.focusEvt = new TypedEvent("focus");
        this.changeEvt = new TypedEvent("change");
        this.updateEvt = new TypedEvent("update");
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
                    const minCursor = Cursor.min(this.frontCursor, this.backCursor), maxCursor = Cursor.max(this.frontCursor, this.backCursor);
                    minCursor.up(this.rows);
                    maxCursor.copy(minCursor);
                    this.scrollIntoView(this.frontCursor);
                }],
            ["CursorDown", () => {
                    const minCursor = Cursor.min(this.frontCursor, this.backCursor), maxCursor = Cursor.max(this.frontCursor, this.backCursor);
                    maxCursor.down(this.rows);
                    minCursor.copy(maxCursor);
                    this.scrollIntoView(this.frontCursor);
                }],
            ["CursorLeft", () => {
                    const minCursor = Cursor.min(this.frontCursor, this.backCursor), maxCursor = Cursor.max(this.frontCursor, this.backCursor);
                    if (minCursor.i === maxCursor.i) {
                        minCursor.left(this.rows);
                    }
                    maxCursor.copy(minCursor);
                    this.scrollIntoView(this.frontCursor);
                }],
            ["CursorRight", () => {
                    const minCursor = Cursor.min(this.frontCursor, this.backCursor), maxCursor = Cursor.max(this.frontCursor, this.backCursor);
                    if (minCursor.i === maxCursor.i) {
                        maxCursor.right(this.rows);
                    }
                    minCursor.copy(maxCursor);
                    this.scrollIntoView(this.frontCursor);
                }],
            ["CursorPageUp", () => {
                    const minCursor = Cursor.min(this.frontCursor, this.backCursor), maxCursor = Cursor.max(this.frontCursor, this.backCursor);
                    minCursor.incY(this.rows, -this.gridBounds.height);
                    maxCursor.copy(minCursor);
                    this.scrollIntoView(this.frontCursor);
                }],
            ["CursorPageDown", () => {
                    const minCursor = Cursor.min(this.frontCursor, this.backCursor), maxCursor = Cursor.max(this.frontCursor, this.backCursor);
                    maxCursor.incY(this.rows, this.gridBounds.height);
                    minCursor.copy(maxCursor);
                    this.scrollIntoView(this.frontCursor);
                }],
            ["CursorSkipLeft", () => {
                    const minCursor = Cursor.min(this.frontCursor, this.backCursor), maxCursor = Cursor.max(this.frontCursor, this.backCursor);
                    if (minCursor.i === maxCursor.i) {
                        minCursor.skipLeft(this.rows);
                    }
                    maxCursor.copy(minCursor);
                    this.scrollIntoView(this.frontCursor);
                }],
            ["CursorSkipRight", () => {
                    const minCursor = Cursor.min(this.frontCursor, this.backCursor), maxCursor = Cursor.max(this.frontCursor, this.backCursor);
                    if (minCursor.i === maxCursor.i) {
                        maxCursor.skipRight(this.rows);
                    }
                    minCursor.copy(maxCursor);
                    this.scrollIntoView(this.frontCursor);
                }],
            ["CursorHome", () => {
                    this.frontCursor.home();
                    this.backCursor.copy(this.frontCursor);
                    this.scrollIntoView(this.frontCursor);
                }],
            ["CursorEnd", () => {
                    this.frontCursor.end(this.rows);
                    this.backCursor.copy(this.frontCursor);
                    this.scrollIntoView(this.frontCursor);
                }],
            ["CursorFullHome", () => {
                    this.frontCursor.fullHome();
                    this.backCursor.copy(this.frontCursor);
                    this.scrollIntoView(this.frontCursor);
                }],
            ["CursorFullEnd", () => {
                    this.frontCursor.fullEnd(this.rows);
                    this.backCursor.copy(this.frontCursor);
                    this.scrollIntoView(this.frontCursor);
                }],
            ["SelectDown", () => {
                    this.backCursor.down(this.rows);
                    this.scrollIntoView(this.frontCursor);
                }],
            ["SelectLeft", () => {
                    this.backCursor.left(this.rows);
                    this.scrollIntoView(this.backCursor);
                }],
            ["SelectRight", () => {
                    this.backCursor.right(this.rows);
                    this.scrollIntoView(this.backCursor);
                }],
            ["SelectUp", () => {
                    this.backCursor.up(this.rows);
                    this.scrollIntoView(this.backCursor);
                }],
            ["SelectPageDown", () => {
                    this.backCursor.incY(this.rows, this.gridBounds.height);
                    this.scrollIntoView(this.backCursor);
                }],
            ["SelectPageUp", () => {
                    this.backCursor.incY(this.rows, -this.gridBounds.height);
                    this.scrollIntoView(this.backCursor);
                }],
            ["SelectSkipLeft", () => {
                    this.backCursor.skipLeft(this.rows);
                    this.scrollIntoView(this.backCursor);
                }],
            ["SelectSkipRight", () => {
                    this.backCursor.skipRight(this.rows);
                    this.scrollIntoView(this.backCursor);
                }],
            ["SelectHome", () => {
                    this.backCursor.home();
                    this.scrollIntoView(this.backCursor);
                }],
            ["SelectEnd", () => {
                    this.backCursor.end(this.rows);
                    this.scrollIntoView(this.backCursor);
                }],
            ["SelectFullHome", () => {
                    this.backCursor.fullHome();
                    this.scrollIntoView(this.backCursor);
                }],
            ["SelectFullEnd", () => {
                    this.backCursor.fullEnd(this.rows);
                    this.scrollIntoView(this.backCursor);
                }],
            ["SelectAll", () => {
                    this.frontCursor.fullHome();
                    this.backCursor.fullEnd(this.rows);
                    this.render();
                }],
            ["ScrollDown", () => {
                    if (this.scroll.y < this.rows.length - this.gridBounds.height) {
                        this.scrollBy(0, 1);
                    }
                }],
            ["ScrollUp", () => {
                    if (this.scroll.y > 0) {
                        this.scrollBy(0, -1);
                    }
                }],
            ["DeleteLetterLeft", () => {
                    if (this.frontCursor.i === this.backCursor.i) {
                        this.backCursor.left(this.rows);
                    }
                    this.setSelectedText("");
                }],
            ["DeleteLetterRight", () => {
                    if (this.frontCursor.i === this.backCursor.i) {
                        this.backCursor.right(this.rows);
                    }
                    this.setSelectedText("");
                }],
            ["DeleteWordLeft", () => {
                    if (this.frontCursor.i === this.backCursor.i) {
                        this.frontCursor.skipLeft(this.rows);
                    }
                    this.setSelectedText("");
                }],
            ["DeleteWordRight", () => {
                    if (this.frontCursor.i === this.backCursor.i) {
                        this.backCursor.skipRight(this.rows);
                    }
                    this.setSelectedText("");
                }],
            ["DeleteLine", () => {
                    if (this.frontCursor.i === this.backCursor.i) {
                        this.frontCursor.home();
                        this.backCursor.end(this.rows);
                        this.backCursor.right(this.rows);
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
                    const row = this.rows[this.frontCursor.y], toDelete = Math.min(this.frontCursor.x, this.tabWidth);
                    for (let i = 0; i < this.frontCursor.x; ++i) {
                        if (row.text[i] !== ' ') {
                            // can only remove tabs at the beginning of a row
                            return;
                        }
                    }
                    this.backCursor.copy(this.frontCursor);
                    this.backCursor.incX(this.rows, -toDelete);
                    this.setSelectedText("");
                }]
        ]);
        this.keyPressCommands = new Map([
            ["AppendNewline", () => {
                    if (this.multiLine) {
                        let indent = "";
                        const row = this.rows[this.frontCursor.y].tokens;
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
                        const row = this.rows[this.frontCursor.y].tokens;
                        if (row.length > 0
                            && row[0].type === "whitespace") {
                            indent = row[0].value;
                        }
                        this.frontCursor.home();
                        this.backCursor.copy(this.frontCursor);
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
            this.pointer.set(evt.offsetX, evt.offsetY);
        };
        const readMouseOverEvent = pointerOver;
        const readMouseOutEvent = pointerOut;
        const readMouseDownEvent = this.mouseLikePointerDown(setMousePointer);
        const readMouseUpEvent = this.mouseLikePointerUp.bind(this);
        const readMouseMoveEvent = this.mouseLikePointerMove(setMousePointer);
        //<<<<<<<<<< MOUSE EVENT HANDLERS <<<<<<<<<<
        //>>>>>>>>>> TOUCH EVENT HANDLERS >>>>>>>>>>
        const vibrate = (len) => {
            this.longPress.cancel();
            if (len > 0) {
                this.vibX = (Math.random() - 0.5) * 10;
                this.vibY = (Math.random() - 0.5) * 10;
                setTimeout(() => vibrate(len - 10), 10);
            }
            else {
                this.vibX = 0;
                this.vibY = 0;
            }
            this.render();
        };
        this.longPress = new TimedEvent(1000);
        this.longPress.addEventListener("tick", () => {
            this.startSelecting();
            this.backCursor.copy(this.frontCursor);
            this.frontCursor.skipLeft(this.rows);
            this.backCursor.skipRight(this.rows);
            this.render();
            navigator.vibrate(20);
            vibrate(320);
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
            if (isHTMLCanvas(this.canv)) {
                const cb = this.canv.getBoundingClientRect();
                this.pointer.set(touch.clientX - cb.left, touch.clientY - cb.top);
            }
        };
        const readTouchStartEvent = withPrimaryTouch(this.touchLikePointerDown(setTouchPointer));
        const readTouchMoveEvent = withPrimaryTouch(this.touchLikePointerMove(setTouchPointer));
        const readTouchUpEvent = this.touchLikePointerUp.bind(this);
        const readTouchEndEvent = withPrimaryTouch(readTouchUpEvent);
        //<<<<<<<<<< TOUCH EVENT HANDLERS <<<<<<<<<<
        //>>>>>>>>>> UV POINTER EVENT HANDLERS >>>>>>>>>>
        const setUVPointer = (evt) => {
            this.pointer.set(evt.uv.x * this.width, (1 - evt.uv.y) * this.height);
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
            this.canv = createUtilityCanvas(options.width, options.height);
        }
        else if (isHTMLCanvas(options.element)) {
            this._element = this.canv = options.element;
            elementClearChildren(this.canv);
        }
        else {
            this._element = options.element;
            elementClearChildren(this.element);
            this.canv = Canvas(styles(width("100%"), height("100%")));
            this.element.appendChild(this.canv);
            this.element.removeAttribute("tabindex");
            styles(display("block"), padding("none"), border("2px inset #c0c0c0"), overflow("unset"))
                .apply(this.element.style);
        }
        if (isHTMLCanvas(this.canv)
            && this.canv.parentElement !== null
            && currentTabIndex === -1) {
            const tabbableElements = Array.from(document.querySelectorAll("[tabindex]"));
            for (let tabbableElement of tabbableElements) {
                currentTabIndex = Math.max(currentTabIndex, tabbableElement.tabIndex);
            }
            ++currentTabIndex;
        }
        if (isHTMLCanvas(this.canv)
            && this.isInDocument) {
            this.canv.tabIndex = currentTabIndex;
            this.canv.style.touchAction = "none";
            this.canv.addEventListener("focus", () => this.focus());
            this.canv.addEventListener("blur", () => this.blur());
            this.canv.addEventListener("mouseover", readMouseOverEvent);
            this.canv.addEventListener("mouseout", readMouseOutEvent);
            this.canv.addEventListener("mousedown", readMouseDownEvent);
            this.canv.addEventListener("mouseup", readMouseUpEvent);
            this.canv.addEventListener("mousemove", readMouseMoveEvent);
            this.canv.addEventListener("touchstart", readTouchStartEvent);
            this.canv.addEventListener("touchend", readTouchEndEvent);
            this.canv.addEventListener("touchmove", readTouchMoveEvent);
        }
        //<<<<<<<<<< SETUP CANVAS <<<<<<<<<<
        //>>>>>>>>>> SETUP BUFFERS >>>>>>>>>>
        this.context = this.canv.getContext("2d");
        this.fg = new ForegroundLayer(createUtilityCanvas(this.canv.width, this.canv.height));
        this.bg = new BackgroundLayer(createUtilityCanvas(this.canv.width, this.canv.height));
        this.tg = createUtilityCanvas(this.canv.width, this.canv.height);
        this.tgfx = this.tg.getContext("2d");
        this.context.imageSmoothingEnabled
            = this.tgfx.imageSmoothingEnabled
                = true;
        this.context.textBaseline
            = this.tgfx.textBaseline
                = "top";
        this.tgfx.textAlign = "right";
        //<<<<<<<<<< SETUP BUFFERS <<<<<<<<<<
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
        Object.seal(this);
        if (!isString(options.language)) {
            this.language = options.language;
        }
        this.readOnly = options.readOnly;
        this.multiLine = options.multiLine;
        this.wordWrap = options.wordWrap;
        this.showScrollBars = options.scrollBars;
        this.showLineNumbers = options.lineNumbers;
        this.padding = options.padding;
        this.fontSize = options.fontSize;
        this.fontFamily = options.fontFamily;
        this.scaleFactor = options.scaleFactor;
        this.value = currentValue;
        //<<<<<<<<<< INITIALIZE STATE <<<<<<<<<<
        this.doRender();
        // This is done last so that controls that have errored 
        // out during their setup don't get added to the control
        // manager.
        Primrose.add(this.element, this);
        this.canRender = true;
    }
    render() {
        if (this.canRender) {
            requestAnimationFrame(() => this.doRender());
        }
    }
    startSelecting() {
        this.dragging = true;
        this.moveCursor(this.frontCursor);
    }
    pointerDown() {
        this.focus();
        this.pressed = true;
    }
    pointerMove() {
        if (this.dragging) {
            this.moveCursor(this.backCursor);
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
            this.tx = this.pointer.x;
            this.ty = this.pointer.y;
            this.pointerDown();
            this.longPress.start();
        };
    }
    touchLikePointerUp() {
        if (this.longPress.cancel() && !this.dragging) {
            this.startSelecting();
        }
        this.mouseLikePointerUp();
        this.lastScrollDX = null;
        this.lastScrollDY = null;
    }
    touchLikePointerMove(setPointer) {
        return (evt) => {
            setPointer(evt);
            if (this.longPress.isRunning) {
                const dx = this.pointer.x - this.tx, dy = this.pointer.y - this.ty, lenSq = dx * dx + dy * dy;
                if (lenSq > 25) {
                    this.longPress.cancel();
                }
            }
            if (!this.longPress.isRunning) {
                this.pointerMove();
            }
        };
    }
    refreshBuffers() {
        this.resized = true;
        this.fg.setSize(this.canv.width, this.canv.height, this.scaleFactor);
        this.bg.setSize(this.canv.width, this.canv.height, this.scaleFactor);
        setContextSize(this.tgfx, this.canv.width, this.canv.height);
        this.refreshAllTokens();
    }
    moveCursor(cursor) {
        this.pointer.toCell(this.character, this.scroll, this.gridBounds);
        const gx = this.pointer.x - this.scroll.x, gy = this.pointer.y - this.scroll.y, onBottom = gy >= this.gridBounds.height, onLeft = gx < 0, onRight = this.pointer.x >= this.gridBounds.width;
        if (!this.scrolling && !onBottom && !onLeft && !onRight) {
            cursor.setXY(this.rows, this.pointer.x, this.pointer.y);
            this.backCursor.copy(cursor);
        }
        else if (this.scrolling || onRight && !onBottom) {
            this.scrolling = true;
            const scrollHeight = this.rows.length - this.gridBounds.height;
            if (gy >= 0 && scrollHeight >= 0) {
                const sy = gy * scrollHeight / this.gridBounds.height;
                this.scrollTo(this.scroll.x, sy);
            }
        }
        else if (onBottom && !onLeft) {
            let maxWidth = 0;
            for (let dy = 0; dy < this.rows.length; ++dy) {
                maxWidth = Math.max(maxWidth, this.rows[dy].stringLength);
            }
            const scrollWidth = maxWidth - this.gridBounds.width;
            if (gx >= 0 && scrollWidth >= 0) {
                const sx = gx * scrollWidth / this.gridBounds.width;
                this.scrollTo(sx, this.scroll.y);
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
        if (this.lastScrollDX !== null
            && this.lastScrollDY !== null) {
            let dx = (this.lastScrollDX - this.pointer.x) / this.character.width, dy = (this.lastScrollDY - this.pointer.y) / this.character.height;
            this.scrollBy(dx, dy);
        }
        this.lastScrollDX = this.pointer.x;
        this.lastScrollDY = this.pointer.y;
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
            this.bottomRightGutter.set(0, 0);
        }
        else if (this.wordWrap) {
            this.bottomRightGutter.set(vScrollWidth, 0);
        }
        else {
            this.bottomRightGutter.set(vScrollWidth, 1);
        }
    }
    //>>>>>>>>>> RENDERING >>>>>>>>>>
    fillRect(gfx, fill, x, y, w, h) {
        gfx.fillStyle = fill;
        gfx.fillRect(x * this.character.width, y * this.character.height, w * this.character.width + 1, h * this.character.height + 1);
    }
    strokeRect(gfx, stroke, x, y, w, h) {
        gfx.strokeStyle = stroke;
        gfx.strokeRect(x * this.character.width, y * this.character.height, w * this.character.width + 1, h * this.character.height + 1);
    }
    renderCanvasTrim() {
        this.tgfx.clearRect(0, 0, this.canv.width, this.canv.height);
        this.tgfx.save();
        this.tgfx.scale(this.scaleFactor, this.scaleFactor);
        this.tgfx.translate(this.padding, this.padding);
        if (this.showLineNumbers) {
            this.fillRect(this.tgfx, this.theme.selectedBackColor ||
                DefaultTheme.selectedBackColor, 0, 0, this.gridBounds.x, this.width - this.padding * 2);
            this.strokeRect(this.tgfx, this.theme.regular.foreColor ||
                DefaultTheme.regular.foreColor, 0, 0, this.gridBounds.x, this.height - this.padding * 2);
        }
        let maxRowWidth = 2;
        this.tgfx.save();
        {
            this.tgfx.translate((this.lineCountWidth - 0.5) * this.character.width, -this.scroll.y * this.character.height);
            let lastLineNumber = -1;
            const minY = this.scroll.y | 0, maxY = minY + this.gridBounds.height;
            this.tokenFront.setXY(this.rows, 0, minY);
            this.tokenBack.copy(this.tokenFront);
            for (let y = minY; y <= maxY && y < this.rows.length; ++y) {
                const row = this.rows[y];
                maxRowWidth = Math.max(maxRowWidth, row.stringLength);
                if (this.showLineNumbers) {
                    // draw the left gutter
                    if (row.lineNumber > lastLineNumber) {
                        lastLineNumber = row.lineNumber;
                        this.tgfx.font = makeFont({
                            fontFamily: this.fontFamily,
                            fontSize: this.fontSize,
                            fontWeight: "bold"
                        });
                        this.tgfx.fillStyle = this.theme.regular.foreColor;
                        this.tgfx.fillText((row.lineNumber + 1).toFixed(0), 0, y * this.character.height);
                    }
                }
            }
        }
        this.tgfx.restore();
        // draw the scrollbars
        if (this.showScrollBars) {
            this.tgfx.fillStyle = this.theme.selectedBackColor ||
                DefaultTheme.selectedBackColor;
            // horizontal
            if (!this.wordWrap && maxRowWidth > this.gridBounds.width) {
                const drawWidth = this.gridBounds.width * this.character.width - this.padding, scrollX = (this.scroll.x * drawWidth) / maxRowWidth + this.gridBounds.x * this.character.width, scrollBarWidth = drawWidth * (this.gridBounds.width / maxRowWidth), by = this.height - this.character.height - this.padding, bw = Math.max(this.character.width, scrollBarWidth);
                this.tgfx.fillRect(scrollX, by, bw, this.character.height);
                this.tgfx.strokeRect(scrollX, by, bw, this.character.height);
            }
            //vertical
            if (this.rows.length > this.gridBounds.height) {
                const drawHeight = this.gridBounds.height * this.character.height, scrollY = (this.scroll.y * drawHeight) / this.rows.length, scrollBarHeight = drawHeight * (this.gridBounds.height / this.rows.length), bx = this.width - vScrollWidth * this.character.width - 2 * this.padding, bw = vScrollWidth * this.character.width, bh = Math.max(this.character.height, scrollBarHeight);
                this.tgfx.fillRect(bx, scrollY, bw, bh);
                this.tgfx.strokeRect(bx, scrollY, bw, bh);
            }
        }
        this.tgfx.restore();
        if (!this.focused) {
            this.tgfx.fillStyle = this.theme.unfocused || DefaultTheme.unfocused;
            this.tgfx.fillRect(0, 0, this.canv.width, this.canv.height);
        }
    }
    doRender() {
        if (this.theme) {
            const textChanged = this.lastText !== this.value, focusChanged = this.focused !== this.lastFocused, fontChanged = this.context.font !== this.lastFont, paddingChanged = this.padding !== this.lastPadding, themeChanged = this.theme.name !== this.lastThemeName, boundsChanged = this.gridBounds.toString() !== this.lastGridBounds, characterWidthChanged = this.character.width !== this.lastCharacterWidth, characterHeightChanged = this.character.height !== this.lastCharacterHeight, cursorChanged = this.frontCursor.i !== this.lastFrontCursor
                || this.backCursor.i !== this.lastBackCursor, scrollChanged = this.scroll.x !== this.lastScrollX
                || this.scroll.y !== this.lastScrollY, layoutChanged = this.resized
                || boundsChanged
                || textChanged
                || characterWidthChanged
                || characterHeightChanged
                || paddingChanged
                || scrollChanged
                || themeChanged, backgroundChanged = layoutChanged
                || cursorChanged, foregroundChanged = layoutChanged
                || fontChanged, trimChanged = layoutChanged
                || focusChanged;
            const minCursor = Cursor.min(this.frontCursor, this.backCursor), maxCursor = Cursor.max(this.frontCursor, this.backCursor);
            if (backgroundChanged) {
                this.bg.render(this.theme, minCursor, maxCursor, this.gridBounds, this.scroll, this.character, this.padding, this.focused, this.rows, this.fontFamily, this.fontSize);
            }
            if (foregroundChanged) {
                this.fg.render(this.theme, minCursor, maxCursor, this.gridBounds, this.scroll, this.character, this.padding, this.focused, this.rows, this.fontFamily, this.fontSize);
            }
            if (trimChanged) {
                this.renderCanvasTrim();
            }
            this.context.clearRect(0, 0, this.canv.width, this.canv.height);
            this.context.save();
            this.context.translate(this.vibX, this.vibY);
            this.context.drawImage(this.bg.canvas, 0, 0);
            this.context.drawImage(this.fg.canvas, 0, 0);
            this.context.drawImage(this.tg, 0, 0);
            this.context.restore();
            this.lastGridBounds = this.gridBounds.toString();
            this.lastText = this.value;
            this.lastCharacterWidth = this.character.width;
            this.lastCharacterHeight = this.character.height;
            this.lastPadding = this.padding;
            this.lastFrontCursor = this.frontCursor.i;
            this.lastBackCursor = this.backCursor.i;
            this.lastFocused = this.focused;
            this.lastFont = this.context.font;
            this.lastThemeName = this.theme.name;
            this.lastScrollX = this.scroll.x;
            this.lastScrollY = this.scroll.y;
            this.resized = false;
            this.dispatchEvent(this.updateEvt);
        }
    }
    //<<<<<<<<<< RENDERING <<<<<<<<<<
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
        if (this.frontCursor.i !== this.backCursor.i || txt.length > 0) {
            const minCursor = Cursor.min(this.frontCursor, this.backCursor), maxCursor = Cursor.max(this.frontCursor, this.backCursor), startRow = this.rows[minCursor.y], endRow = this.rows[maxCursor.y], unchangedLeft = this.value.substring(0, startRow.startStringIndex), unchangedRight = this.value.substring(endRow.endStringIndex), changedStartSubStringIndex = minCursor.i - startRow.startStringIndex, changedLeft = startRow.substring(0, changedStartSubStringIndex), changedEndSubStringIndex = maxCursor.i - endRow.startStringIndex, changedRight = endRow.substring(changedEndSubStringIndex), changedText = changedLeft + txt + changedRight;
            this.value = unchangedLeft + changedText + unchangedRight;
            this.pushUndo();
            this.refreshAllTokens();
            this.frontCursor.setI(this.rows, minCursor.i + txt.length);
            this.backCursor.copy(this.frontCursor);
            this.scrollIntoView(this.frontCursor);
            this.dispatchEvent(this.changeEvt);
        }
    }
    refreshAllTokens() {
        this.refreshTokens(0, this.rows.length - 1, this.value);
    }
    refreshTokens(startY, endY, txt) {
        // Guessing at where to retokenize
        if (startY < 0) {
            startY = 0;
        }
        if (endY >= this.rows.length) {
            endY = this.rows.length - 1;
        }
        while (startY > 0
            && this.rows[startY].lineNumber === this.rows[startY - 1].lineNumber) {
            --startY;
            txt = this.rows[startY].text + txt;
        }
        while (endY < this.rows.length - 1
            && this.rows[endY].lineNumber === this.rows[endY + 1].lineNumber) {
            ++endY;
            txt += this.rows[endY].text;
        }
        const newTokens = this.language.tokenize(txt), startRow = this.rows[startY], startTokenIndex = startRow.startTokenIndex, startLineNumber = startRow.lineNumber, startStringIndex = startRow.startStringIndex, endRow = this.rows[endY], endTokenIndex = endRow.endTokenIndex, tokenRemoveCount = endTokenIndex - startTokenIndex, oldTokens = this.tokens.splice(startTokenIndex, tokenRemoveCount, ...newTokens);
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
        const x = Math.floor(this.lineCountWidth + this.padding / this.character.width), y = Math.floor(this.padding / this.character.height), w = Math.floor((this.width - 2 * this.padding) / this.character.width) - x - this.bottomRightGutter.width, h = Math.floor((this.height - 2 * this.padding) / this.character.height) - y - this.bottomRightGutter.height;
        this.gridBounds.set(x, y, w, h);
        // Perform the layout
        const tokenQueue = newTokens.map(t => t.clone()), rowRemoveCount = endY - startY + 1, newRows = [];
        let currentString = "", currentTokens = [], currentStringIndex = startStringIndex, currentTokenIndex = startTokenIndex, currentLineNumber = startLineNumber;
        for (let i = 0; i < tokenQueue.length; ++i) {
            const t = tokenQueue[i], widthLeft = this.gridBounds.width - currentString.length, wrap = this.wordWrap && t.type !== FinalTokenType.newLines && t.length > widthLeft, breakLine = t.type === FinalTokenType.newLines || wrap;
            if (wrap) {
                const split = t.length > this.gridBounds.width
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
        this.rows.splice(startY, rowRemoveCount, ...newRows);
        // renumber rows
        for (let y = startY + newRows.length; y < this.rows.length; ++y) {
            const row = this.rows[y];
            row.lineNumber = currentLineNumber;
            row.startStringIndex = currentStringIndex;
            row.startTokenIndex += currentTokenIndex;
            currentStringIndex += row.stringLength;
            currentTokenIndex += row.numTokens;
            if (row.tokens.length > 0) {
                const lastToken = row.tokens[row.tokens.length - 1];
                if (lastToken.type === FinalTokenType.newLines) {
                    ++currentLineNumber;
                }
            }
        }
        // provide editing room at the end of the buffer
        if (this.rows.length === 0) {
            this.rows.push(Row.emptyRow(0, 0, 0));
        }
        else {
            const lastRow = this.rows[this.rows.length - 1];
            if (lastRow.text.endsWith('\n')) {
                this.rows.push(Row.emptyRow(lastRow.endStringIndex, lastRow.endTokenIndex, lastRow.lineNumber + 1));
            }
        }
        this.maxVerticalScroll = Math.max(0, this.rows.length - this.gridBounds.height);
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
        const toHigh = this.scroll.y < 0 || this.maxVerticalScroll === 0, toLow = this.scroll.y > this.maxVerticalScroll;
        if (toHigh) {
            this.scroll.y = 0;
        }
        else if (toLow) {
            this.scroll.y = this.maxVerticalScroll;
        }
        this.render();
        return toHigh || toLow;
    }
    scrollIntoView(currentCursor) {
        const dx = this.minDelta(currentCursor.x, this.scroll.x, this.scroll.x + this.gridBounds.width), dy = this.minDelta(currentCursor.y, this.scroll.y, this.scroll.y + this.gridBounds.height);
        this.scrollBy(dx, dy);
    }
    pushUndo() {
        if (this.historyIndex < this.history.length - 1) {
            this.history.splice(this.historyIndex + 1);
        }
        this.history.push({
            value: this.value,
            frontCursor: this.frontCursor.i,
            backCursor: this.backCursor.i
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
            this.frontCursor.setI(this.rows, curFrame.frontCursor);
            this.backCursor.setI(this.rows, curFrame.backCursor);
        }
    }
    /// <summary>
    /// Removes focus from the control.
    /// </summary>
    blur() {
        if (this.focused) {
            this._focused = false;
            this.dispatchEvent(this.blurEvt);
            this.render();
        }
    }
    /// <summary>
    /// Sets the control to be the focused control. If all controls in the app have been properly registered with the Event Manager, then any other, currently focused control will first get `blur`red.
    /// </summary>
    focus() {
        if (!this.focused) {
            this._focused = true;
            this.dispatchEvent(this.focusEvt);
            this.render();
        }
    }
    /// <summary>
    /// </summary>
    resize() {
        if (isHTMLCanvas(this.canv)) {
            if (!this.isInDocument) {
                console.warn("Can't automatically resize a canvas that is not in the DOM tree");
            }
            else if (setContextSize(this.context, this.canv.clientWidth, this.canv.clientHeight, this.scaleFactor)) {
                this.refreshBuffers();
            }
        }
    }
    /// <summary>
    /// Sets the scale-independent width and height of the editor control.
    /// </summary>
    setSize(w, h) {
        if (setContextSize(this.context, w, h, this.scaleFactor)) {
            this.refreshBuffers();
        }
    }
    /// <summary>
    /// Move the scroll window to a new location. Values get clamped to the text contents of the editor.
    /// </summary>
    scrollTo(x, y) {
        if (!this.wordWrap) {
            this.scroll.x = x;
        }
        this.scroll.y = y;
        return this.clampScroll();
    }
    /// <summary>
    /// Move the scroll window by a given amount to a new location. The final location of the scroll window gets clamped to the text contents of the editor.
    /// </summary>
    scrollBy(dx, dy) {
        return this.scrollTo(this.scroll.x + dx, this.scroll.y + dy);
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
    //>>>>>>>>>> CLIPBOARD EVENT HANDLERS >>>>>>>>>>
    copySelectedText(evt) {
        if (this.focused && this.frontCursor.i !== this.backCursor.i) {
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
    //<<<<<<<<<< CLIPBOARD EVENT HANDLERS <<<<<<<<<<
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
        return isHTMLCanvas(this.canv)
            && document.body.contains(this.canv);
    }
    /// <summary>
    /// The canvas to which the editor is rendering text. If the `options.element` value was set to a canvas, that canvas will be returned. Otherwise, the canvas will be the canvas that Primrose created for the control. If `OffscreenCanvas` is not available, the canvas will be an `HTMLCanvasElement`.
    /// </summary>
    get canvas() {
        return this.canv;
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
            if (f) {
                this.focus();
            }
            else {
                this.blur();
            }
        }
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
    /// A synonymn for `value`
    /// </summary>
    get text() {
        return this.value;
    }
    set text(txt) {
        this.value = txt;
    }
    /// <summary>
    /// The range of text that is currently selected by the cursor. If no text is selected, reading `selectedText` returns the empty string (`""`) and writing to it inserts text at the current cursor location. 
    /// If text is selected, reading `selectedText` returns the text between the front and back cursors, writing to it overwrites the selected text, inserting the provided value.
    /// </summary>
    get selectedText() {
        const minCursor = Cursor.min(this.frontCursor, this.backCursor), maxCursor = Cursor.max(this.frontCursor, this.backCursor);
        return this.value.substring(minCursor.i, maxCursor.i);
    }
    set selectedText(txt) {
        this.setSelectedText(txt);
    }
    /// <summary>
    /// The string index at which the front cursor is located. NOTE: the "front cursor" is the main cursor, but does not necessarily represent the beginning of the selction range. The selection range runs from the minimum of front and back cursors, to the maximum.
    /// </summary>
    get selectionStart() {
        return this.frontCursor.i;
    }
    set selectionStart(i) {
        i = i | 0;
        if (i !== this.frontCursor.i) {
            this.frontCursor.setI(this.rows, i);
            this.render();
        }
    }
    /// <summary>
    /// The string index at which the back cursor is located. NOTE: the "back cursor" is the selection range cursor, but does not necessarily represent the end of the selction range. The selection range runs from the minimum of front and back cursors, to the maximum.
    /// </summary>
    get selectionEnd() {
        return this.backCursor.i;
    }
    set selectionEnd(i) {
        i = i | 0;
        if (i !== this.backCursor.i) {
            this.backCursor.setI(this.rows, i);
            this.render();
        }
    }
    /// <summary>
    /// If the back cursor is behind the front cursor, this value returns `"backward"`. Otherwise, `"forward"` is returned.
    /// </summary>
    get selectionDirection() {
        return this.frontCursor.i <= this.backCursor.i
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
        s = Math.max(1, s || 0);
        if (s !== this.fontSize) {
            this._fontSize = s;
            this.refreshFont();
        }
    }
    get fontFamily() {
        return this._fontFamily;
    }
    set fontFamily(v) {
        if (v !== this.fontFamily) {
            this._fontFamily = v;
            this.refreshFont();
        }
    }
    refreshFont() {
        this.context.font = makeFont({
            fontFamily: this.fontFamily,
            fontSize: this.fontSize
        });
        this.character.height = this.fontSize;
        // measure 100 letter M's, then divide by 100, to get the width of an M
        // to two decimal places on systems that return integer values from
        // measureText.
        this.character.width = this.context.measureText("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM")
            .width /
            100;
        this.refreshAllTokens();
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
        if (s !== this.scaleFactor) {
            const lastWidth = this.width, lastHeight = this.height;
            this._scaleFactor = s;
            this.setSize(lastWidth, lastHeight);
        }
    }
    /// <summary>
    /// The scale-independent width of the editor control.
    /// </summary>
    get width() {
        return this.canv.width / this.scaleFactor;
    }
    set width(w) {
        this.setSize(w, this.height);
    }
    /// <summary>
    /// The scale-independent height of the editor control.
    /// </summary>
    get height() {
        return this.canv.height / this.scaleFactor;
    }
    set height(h) {
        this.setSize(this.width, h);
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