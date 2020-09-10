import { isFunction } from "../calla/typeChecks";
/**
 * A setter functor for HTML element events.
 **/
export class HtmlEvt {
    /**
     * Creates a new setter functor for an HTML element event.
     * @param {string} name - the name of the event to attach to.
     * @param {Function} callback - the callback function to use with the event handler.
     * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
     */
    constructor(name, callback, opts) {
        if (!isFunction(callback)) {
            throw new Error("A function instance is required for this parameter");
        }

        this.name = name;
        this.callback = callback;
        this.opts = opts;
        Object.freeze(this);
    }

    /**
     * Add the encapsulate callback as an event listener to the give HTMLElement
     * @param {HTMLElement} elem
     */
    add(elem) {
        elem.addEventListener(this.name, this.callback, this.opts);
    }

    /**
     * Remove the encapsulate callback as an event listener from the give HTMLElement
     * @param {HTMLElement} elem
     */
    remove(elem) {
        elem.removeEventListener(this.name, this.callback);
    }
}



/**
 * The abort event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onAbort(callback, opts) { return new HtmlEvt("abort", callback, opts); }

/**
 * The afterprint event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onAfterPrint(callback, opts) { return new HtmlEvt("afterprint", callback, opts); }

/**
 * The animationcancel event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onAnimationCancel(callback, opts) { return new HtmlEvt("animationcancel", callback, opts); }

/**
 * The animationend event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onAnimationEnd(callback, opts) { return new HtmlEvt("animationend", callback, opts); }

/**
 * The animationiteration event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onAnimationIteration(callback, opts) { return new HtmlEvt("animationiteration", callback, opts); }

/**
 * The animationstart event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onAnimationStart(callback, opts) { return new HtmlEvt("animationstart", callback, opts); }

/**
 * The appinstalled event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onAppInstalled(callback, opts) { return new HtmlEvt("appinstalled", callback, opts); }

/**
 * The audioprocess event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function _onAudioProcess(callback, opts) { return new HtmlEvt("audioprocess", callback, opts); }

/**
 * The audioend event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onAudioEnd(callback, opts) { return new HtmlEvt("audioend", callback, opts); }

/**
 * The audiostart event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onAudioStart(callback, opts) { return new HtmlEvt("audiostart", callback, opts); }

/**
 * The auxclick event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onAuxClick(callback, opts) { return new HtmlEvt("auxclick", callback, opts); }

/**
 * The beforeinput event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onBeforeInput(callback, opts) { return new HtmlEvt("beforeinput", callback, opts); }

/**
 * The beforeprint event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onBeforePrint(callback, opts) { return new HtmlEvt("beforeprint", callback, opts); }

/**
 * The beforeunload event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onBeforeUnload(callback, opts) { return new HtmlEvt("beforeunload", callback, opts); }

/**
 * The blocked event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onBlocked(callback, opts) { return new HtmlEvt("blocked", callback, opts); }

/**
 * The blur event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onBlur(callback, opts) { return new HtmlEvt("blur", callback, opts); }

/**
 * The boundary event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onBoundary(callback, opts) { return new HtmlEvt("boundary", callback, opts); }

/**
 * The canplay event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onCanPlay(callback, opts) { return new HtmlEvt("canplay", callback, opts); }

/**
 * The canplaythrough event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onCanPlayThrough(callback, opts) { return new HtmlEvt("canplaythrough", callback, opts); }

/**
 * The change event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onChange(callback, opts) { return new HtmlEvt("change", callback, opts); }

/**
 * The chargingchange event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onChargingChange(callback, opts) { return new HtmlEvt("chargingchange", callback, opts); }

/**
 * The chargingtimechange event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onChargingTimeChange(callback, opts) { return new HtmlEvt("chargingtimechange", callback, opts); }

/**
 * The checking event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onChecking(callback, opts) { return new HtmlEvt("checking", callback, opts); }

/**
 * The click event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onClick(callback, opts) { return new HtmlEvt("click", callback, opts); }

/**
 * The close event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onClose(callback, opts) { return new HtmlEvt("close", callback, opts); }

/**
 * The complete event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onComplete(callback, opts) { return new HtmlEvt("complete", callback, opts); }

/**
 * The compositionend event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onCompositionEnd(callback, opts) { return new HtmlEvt("compositionend", callback, opts); }

/**
 * The compositionstart event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onCompositionStart(callback, opts) { return new HtmlEvt("compositionstart", callback, opts); }

/**
 * The compositionupdate event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onCompositionUpdate(callback, opts) { return new HtmlEvt("compositionupdate", callback, opts); }

/**
 * The contextmenu event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onContextMenu(callback, opts) { return new HtmlEvt("contextmenu", callback, opts); }

/**
 * The copy event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onCopy(callback, opts) { return new HtmlEvt("copy", callback, opts); }

/**
 * The cut event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onCut(callback, opts) { return new HtmlEvt("cut", callback, opts); }

/**
 * The dblclick event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onDblClick(callback, opts) { return new HtmlEvt("dblclick", callback, opts); }

/**
 * The devicechange event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onDeviceChange(callback, opts) { return new HtmlEvt("devicechange", callback, opts); }

/**
 * The devicemotion event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onDeviceMotion(callback, opts) { return new HtmlEvt("devicemotion", callback, opts); }

/**
 * The deviceorientation event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onDeviceOrientation(callback, opts) { return new HtmlEvt("deviceorientation", callback, opts); }

/**
 * The dischargingtimechange event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onDischargingTimeChange(callback, opts) { return new HtmlEvt("dischargingtimechange", callback, opts); }

/**
 * The downloading event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onDownloading(callback, opts) { return new HtmlEvt("downloading", callback, opts); }

/**
 * The drag event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onDrag(callback, opts) { return new HtmlEvt("drag", callback, opts); }

/**
 * The dragend event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onDragEnd(callback, opts) { return new HtmlEvt("dragend", callback, opts); }

/**
 * The dragenter event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onDragEnter(callback, opts) { return new HtmlEvt("dragenter", callback, opts); }

/**
 * The dragleave event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onDragLeave(callback, opts) { return new HtmlEvt("dragleave", callback, opts); }

/**
 * The dragover event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onDragOver(callback, opts) { return new HtmlEvt("dragover", callback, opts); }

/**
 * The dragstart event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onDragStart(callback, opts) { return new HtmlEvt("dragstart", callback, opts); }

/**
 * The drop event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onDrop(callback, opts) { return new HtmlEvt("drop", callback, opts); }

/**
 * The durationchange event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onDurationChange(callback, opts) { return new HtmlEvt("durationchange", callback, opts); }

/**
 * The emptied event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onEmptied(callback, opts) { return new HtmlEvt("emptied", callback, opts); }

/**
 * The end event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onEnd(callback, opts) { return new HtmlEvt("end", callback, opts); }

/**
 * The ended event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onEnded(callback, opts) { return new HtmlEvt("ended", callback, opts); }

/**
 * The error event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onError(callback, opts) { return new HtmlEvt("error", callback, opts); }

/**
 * The focus event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onFocus(callback, opts) { return new HtmlEvt("focus", callback, opts); }

/**
 * The focusin event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onFocusIn(callback, opts) { return new HtmlEvt("focusin", callback, opts); }

/**
 * The focusout event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onFocusOut(callback, opts) { return new HtmlEvt("focusout", callback, opts); }

/**
 * The fullscreenchange event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onFullScreenChange(callback, opts) { return new HtmlEvt("fullscreenchange", callback, opts); }

/**
 * The fullscreenerror event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onFullScreenError(callback, opts) { return new HtmlEvt("fullscreenerror", callback, opts); }

/**
 * The gamepadconnected event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onGamepadConnected(callback, opts) { return new HtmlEvt("gamepadconnected", callback, opts); }

/**
 * The gamepaddisconnected event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onGamepadDisconnected(callback, opts) { return new HtmlEvt("gamepaddisconnected", callback, opts); }

/**
 * The gotpointercapture event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onGotPointerCapture(callback, opts) { return new HtmlEvt("gotpointercapture", callback, opts); }

/**
 * The hashchange event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onHashChange(callback, opts) { return new HtmlEvt("hashchange", callback, opts); }

/**
 * The lostpointercapture event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onLostPointerCapture(callback, opts) { return new HtmlEvt("lostpointercapture", callback, opts); }

/**
 * The input event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onInput(callback, opts) { return new HtmlEvt("input", callback, opts); }

/**
 * The invalid event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onInvalid(callback, opts) { return new HtmlEvt("invalid", callback, opts); }

/**
 * The keydown event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onKeyDown(callback, opts) { return new HtmlEvt("keydown", callback, opts); }

/**
 * The keypress event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onKeyPress(callback, opts) { return new HtmlEvt("keypress", callback, opts); }

/**
 * The keyup event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onKeyUp(callback, opts) { return new HtmlEvt("keyup", callback, opts); }

/**
 * The languagechange event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onLanguageChange(callback, opts) { return new HtmlEvt("languagechange", callback, opts); }

/**
 * The levelchange event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onLevelChange(callback, opts) { return new HtmlEvt("levelchange", callback, opts); }

/**
 * The load event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onLoad(callback, opts) { return new HtmlEvt("load", callback, opts); }

/**
 * The loadeddata event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onLoadedData(callback, opts) { return new HtmlEvt("loadeddata", callback, opts); }

/**
 * The loadedmetadata event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onLoadedMetadata(callback, opts) { return new HtmlEvt("loadedmetadata", callback, opts); }

/**
 * The loadend event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onLoadEnd(callback, opts) { return new HtmlEvt("loadend", callback, opts); }

/**
 * The loadstart event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onLoadStart(callback, opts) { return new HtmlEvt("loadstart", callback, opts); }

/**
 * The mark event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onMark(callback, opts) { return new HtmlEvt("mark", callback, opts); }

/**
 * The message event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onMessage(callback, opts) { return new HtmlEvt("message", callback, opts); }

/**
 * The messageerror event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onMessageError(callback, opts) { return new HtmlEvt("messageerror", callback, opts); }

/**
 * The mousedown event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onMouseDown(callback, opts) { return new HtmlEvt("mousedown", callback, opts); }

/**
 * The mouseenter event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onMouseEnter(callback, opts) { return new HtmlEvt("mouseenter", callback, opts); }

/**
 * The mouseleave event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onMouseLeave(callback, opts) { return new HtmlEvt("mouseleave", callback, opts); }

/**
 * The mousemove event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onMouseMove(callback, opts) { return new HtmlEvt("mousemove", callback, opts); }

/**
 * The mouseout event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onMouseOut(callback, opts) { return new HtmlEvt("mouseout", callback, opts); }

/**
 * The mouseover event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onMouseOver(callback, opts) { return new HtmlEvt("mouseover", callback, opts); }

/**
 * The mouseup event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onMouseUp(callback, opts) { return new HtmlEvt("mouseup", callback, opts); }

/**
 * The nomatch event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onNoMatch(callback, opts) { return new HtmlEvt("nomatch", callback, opts); }

/**
 * The notificationclick event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onNotificationClick(callback, opts) { return new HtmlEvt("notificationclick", callback, opts); }

/**
 * The noupdate event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onNoUpdate(callback, opts) { return new HtmlEvt("noupdate", callback, opts); }

/**
 * The obsolete event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onObsolete(callback, opts) { return new HtmlEvt("obsolete", callback, opts); }

/**
 * The offline event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onOffline(callback, opts) { return new HtmlEvt("offline", callback, opts); }

/**
 * The online event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onOnline(callback, opts) { return new HtmlEvt("online", callback, opts); }

/**
 * The open event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onOpen(callback, opts) { return new HtmlEvt("open", callback, opts); }

/**
 * The orientationchange event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onOrientationChange(callback, opts) { return new HtmlEvt("orientationchange", callback, opts); }

/**
 * The pagehide event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onPageHide(callback, opts) { return new HtmlEvt("pagehide", callback, opts); }

/**
 * The pageshow event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onPageShow(callback, opts) { return new HtmlEvt("pageshow", callback, opts); }

/**
 * The paste event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onPaste(callback, opts) { return new HtmlEvt("paste", callback, opts); }

/**
 * The pause event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onPause(callback, opts) { return new HtmlEvt("pause", callback, opts); }

/**
 * The pointercancel event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onPointerCancel(callback, opts) { return new HtmlEvt("pointercancel", callback, opts); }

/**
 * The pointerdown event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onPointerDown(callback, opts) { return new HtmlEvt("pointerdown", callback, opts); }

/**
 * The pointerenter event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onPointerEnter(callback, opts) { return new HtmlEvt("pointerenter", callback, opts); }

/**
 * The pointerleave event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onPointerLeave(callback, opts) { return new HtmlEvt("pointerleave", callback, opts); }

/**
 * The pointerlockchange event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onPointerLockChange(callback, opts) { return new HtmlEvt("pointerlockchange", callback, opts); }

/**
 * The pointerlockerror event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onPointerLockError(callback, opts) { return new HtmlEvt("pointerlockerror", callback, opts); }

/**
 * The pointermove event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onPointerMove(callback, opts) { return new HtmlEvt("pointermove", callback, opts); }

/**
 * The pointerout event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onPointerOut(callback, opts) { return new HtmlEvt("pointerout", callback, opts); }

/**
 * The pointerover event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onPointerOver(callback, opts) { return new HtmlEvt("pointerover", callback, opts); }

/**
 * The pointerup event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onPointerUp(callback, opts) { return new HtmlEvt("pointerup", callback, opts); }

/**
 * The play event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onPlay(callback, opts) { return new HtmlEvt("play", callback, opts); }

/**
 * The playing event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onPlaying(callback, opts) { return new HtmlEvt("playing", callback, opts); }

/**
 * The popstate event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onPopstate(callback, opts) { return new HtmlEvt("popstate", callback, opts); }

/**
 * The progress event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onProgress(callback, opts) { return new HtmlEvt("progress", callback, opts); }

/**
 * The push event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onPush(callback, opts) { return new HtmlEvt("push", callback, opts); }

/**
 * The pushsubscriptionchange event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onPushSubscriptionChange(callback, opts) { return new HtmlEvt("pushsubscriptionchange", callback, opts); }

/**
 * The ratechange event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onRatechange(callback, opts) { return new HtmlEvt("ratechange", callback, opts); }

/**
 * The readystatechange event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onReadystatechange(callback, opts) { return new HtmlEvt("readystatechange", callback, opts); }

/**
 * The reset event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onReset(callback, opts) { return new HtmlEvt("reset", callback, opts); }

/**
 * The resize event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onResize(callback, opts) { return new HtmlEvt("resize", callback, opts); }

/**
 * The resourcetimingbufferfull event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onResourceTimingBufferFull(callback, opts) { return new HtmlEvt("resourcetimingbufferfull", callback, opts); }

/**
 * The result event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onResult(callback, opts) { return new HtmlEvt("result", callback, opts); }

/**
 * The resume event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onResume(callback, opts) { return new HtmlEvt("resume", callback, opts); }

/**
 * The scroll event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onScroll(callback, opts) { return new HtmlEvt("scroll", callback, opts); }

/**
 * The seeked event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onSeeked(callback, opts) { return new HtmlEvt("seeked", callback, opts); }

/**
 * The seeking event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onSeeking(callback, opts) { return new HtmlEvt("seeking", callback, opts); }

/**
 * The select event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onSelect(callback, opts) { return new HtmlEvt("select", callback, opts); }

/**
 * The selectstart event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onSelectStart(callback, opts) { return new HtmlEvt("selectstart", callback, opts); }

/**
 * The selectionchange event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onSelectionChange(callback, opts) { return new HtmlEvt("selectionchange", callback, opts); }

/**
 * The show event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onShow(callback, opts) { return new HtmlEvt("show", callback, opts); }

/**
 * The slotchange event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onSlotChange(callback, opts) { return new HtmlEvt("slotchange", callback, opts); }

/**
 * The soundend event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onSoundEnd(callback, opts) { return new HtmlEvt("soundend", callback, opts); }

/**
 * The soundstart event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onSoundStart(callback, opts) { return new HtmlEvt("soundstart", callback, opts); }

/**
 * The speechend event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onSpeechEnd(callback, opts) { return new HtmlEvt("speechend", callback, opts); }

/**
 * The speechstart event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onSpeechStart(callback, opts) { return new HtmlEvt("speechstart", callback, opts); }

/**
 * The stalled event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onStalled(callback, opts) { return new HtmlEvt("stalled", callback, opts); }

/**
 * The start event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onStart(callback, opts) { return new HtmlEvt("start", callback, opts); }

/**
 * The storage event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onStorage(callback, opts) { return new HtmlEvt("storage", callback, opts); }

/**
 * The submit event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onSubmit(callback, opts) { return new HtmlEvt("submit", callback, opts); }

/**
 * The success event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onSuccess(callback, opts) { return new HtmlEvt("success", callback, opts); }

/**
 * The suspend event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onSuspend(callback, opts) { return new HtmlEvt("suspend", callback, opts); }

/**
 * The SVGAbort event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onSVGAbort(callback, opts) { return new HtmlEvt("SVGAbort", callback, opts); }

/**
 * The SVGError event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onSVGError(callback, opts) { return new HtmlEvt("SVGError", callback, opts); }

/**
 * The SVGLoad event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onSVGLoad(callback, opts) { return new HtmlEvt("SVGLoad", callback, opts); }

/**
 * The SVGResize event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onSVGResize(callback, opts) { return new HtmlEvt("SVGResize", callback, opts); }

/**
 * The SVGScroll event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onSVGScroll(callback, opts) { return new HtmlEvt("SVGScroll", callback, opts); }

/**
 * The SVGUnload event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onSVGUnload(callback, opts) { return new HtmlEvt("SVGUnload", callback, opts); }

/**
 * The SVGZoom event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onSVGZoom(callback, opts) { return new HtmlEvt("SVGZoom", callback, opts); }

/**
 * The timeout event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onTimeout(callback, opts) { return new HtmlEvt("timeout", callback, opts); }

/**
 * The timeupdate event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onTimeUpdate(callback, opts) { return new HtmlEvt("timeupdate", callback, opts); }

/**
 * The touchcancel event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onTouchCancel(callback, opts) { return new HtmlEvt("touchcancel", callback, opts); }

/**
 * The touchend event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onTouchEnd(callback, opts) { return new HtmlEvt("touchend", callback, opts); }

/**
 * The touchmove event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onTouchMove(callback, opts) { return new HtmlEvt("touchmove", callback, opts); }

/**
 * The touchstart event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onTouchStart(callback, opts) { return new HtmlEvt("touchstart", callback, opts); }

/**
 * The transitionend event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onTransitionEnd(callback, opts) { return new HtmlEvt("transitionend", callback, opts); }

/**
 * The unload event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onUnload(callback, opts) { return new HtmlEvt("unload", callback, opts); }

/**
 * The updateready event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onUpdateReady(callback, opts) { return new HtmlEvt("updateready", callback, opts); }

/**
 * The upgradeneeded event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onUpgradeNeeded(callback, opts) { return new HtmlEvt("upgradeneeded", callback, opts); }

/**
 * The userproximity event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onUserProximity(callback, opts) { return new HtmlEvt("userproximity", callback, opts); }

/**
 * The voiceschanged event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onVoicesChanged(callback, opts) { return new HtmlEvt("voiceschanged", callback, opts); }

/**
 * The versionchange event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onVersionChange(callback, opts) { return new HtmlEvt("versionchange", callback, opts); }

/**
 * The visibilitychange event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onVisibilityChange(callback, opts) { return new HtmlEvt("visibilitychange", callback, opts); }

/**
 * The volumechange event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onVolumeChange(callback, opts) { return new HtmlEvt("volumechange", callback, opts); }

/**
 * The waiting event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onWaiting(callback, opts) { return new HtmlEvt("waiting", callback, opts); }

/**
 * The wheel event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
export function onWheel(callback, opts) { return new HtmlEvt("wheel", callback, opts); }

/**
 * @callback onUserGestureTestCallback
 * @returns {boolean}
 */


const gestures = [
    "change",
    "click",
    "contextmenu",
    "dblclick",
    "mouseup",
    "pointerup",
    "reset",
    "submit",
    "touchend"
];
/**
 * This is not an event handler that you can add to an element. It's a global event that
 * waits for the user to perform some sort of interaction with the website.
 * @param {Function} callback
 * @param {onUserGestureTestCallback} test
  */
export function onUserGesture(callback, test) {
    test = test || (() => true);
    const check = async (evt) => {
        let testResult = test();
        if (testResult instanceof Promise) {
            testResult = await testResult;
        }

        if (evt.isTrusted && testResult) {
            for (let gesture of gestures) {
                window.removeEventListener(gesture, check);
            }

            callback();
        }
    }

    for (let gesture of gestures) {
        window.addEventListener(gesture, check);
    }
}