import { isFunction, isHTMLElement } from "../typeChecks";
export function makeEnterKeyEventHandler(callback) {
    return (ev) => {
        const evt = ev;
        if (!evt.shiftKey
            && !evt.ctrlKey
            && !evt.altKey
            && !evt.metaKey
            && evt.key === "Enter") {
            callback(evt);
        }
    };
}
export function makeProgress(element) {
    return (soFar, total) => {
        element.max = total.toFixed(0);
        element.value = soFar.toFixed(0);
    };
}
/**
 * A setter functor for HTML element events.
 **/
export class HtmlEvt {
    name;
    callback;
    opts;
    /**
     * Creates a new setter functor for an HTML element event.
     * @param name - the name of the event to attach to.
     * @param callback - the callback function to use with the event handler.
     * @param opts - additional attach options.
     */
    constructor(name, callback, opts) {
        this.name = name;
        this.callback = callback;
        if (!isFunction(callback)) {
            throw new Error("A function instance is required for this parameter");
        }
        this.opts = opts;
        Object.freeze(this);
    }
    applyToElement(elem) {
        if (isHTMLElement(elem)) {
            this.add(elem);
        }
    }
    /**
     * Add the encapsulate callback as an event listener to the give HTMLElement
     */
    add(elem) {
        elem.addEventListener(this.name, this.callback, this.opts);
    }
    /**
     * Remove the encapsulate callback as an event listener from the give HTMLElement
     */
    remove(elem) {
        elem.removeEventListener(this.name, this.callback);
    }
}
export function onAbort(callback, opts) { return new HtmlEvt("abort", callback, opts); }
export function onAfterPrint(callback, opts) { return new HtmlEvt("afterprint", callback, opts); }
export function onAnimationCancel(callback, opts) { return new HtmlEvt("animationcancel", callback, opts); }
export function onAnimationEnd(callback, opts) { return new HtmlEvt("animationend", callback, opts); }
export function onAnimationIteration(callback, opts) { return new HtmlEvt("animationiteration", callback, opts); }
export function onAnimationStart(callback, opts) { return new HtmlEvt("animationstart", callback, opts); }
export function onAppInstalled(callback, opts) { return new HtmlEvt("appinstalled", callback, opts); }
export function _onAudioProcess(callback, opts) { return new HtmlEvt("audioprocess", callback, opts); }
export function onAudioEnd(callback, opts) { return new HtmlEvt("audioend", callback, opts); }
export function onAudioStart(callback, opts) { return new HtmlEvt("audiostart", callback, opts); }
export function onAuxClick(callback, opts) { return new HtmlEvt("auxclick", callback, opts); }
export function onBeforeInput(callback, opts) { return new HtmlEvt("beforeinput", callback, opts); }
export function onBeforePrint(callback, opts) { return new HtmlEvt("beforeprint", callback, opts); }
export function onBeforeUnload(callback, opts) { return new HtmlEvt("beforeunload", callback, opts); }
export function onBlocked(callback, opts) { return new HtmlEvt("blocked", callback, opts); }
export function onBlur(callback, opts) { return new HtmlEvt("blur", callback, opts); }
export function onBoundary(callback, opts) { return new HtmlEvt("boundary", callback, opts); }
export function onCanPlay(callback, opts) { return new HtmlEvt("canplay", callback, opts); }
export function onCanPlayThrough(callback, opts) { return new HtmlEvt("canplaythrough", callback, opts); }
export function onChange(callback, opts) { return new HtmlEvt("change", callback, opts); }
export function onChargingChange(callback, opts) { return new HtmlEvt("chargingchange", callback, opts); }
export function onChargingTimeChange(callback, opts) { return new HtmlEvt("chargingtimechange", callback, opts); }
export function onChecking(callback, opts) { return new HtmlEvt("checking", callback, opts); }
export function onClick(callback, opts) { return new HtmlEvt("click", callback, opts); }
export function onClose(callback, opts) { return new HtmlEvt("close", callback, opts); }
export function onComplete(callback, opts) { return new HtmlEvt("complete", callback, opts); }
export function onCompositionEnd(callback, opts) { return new HtmlEvt("compositionend", callback, opts); }
export function onCompositionStart(callback, opts) { return new HtmlEvt("compositionstart", callback, opts); }
export function onCompositionUpdate(callback, opts) { return new HtmlEvt("compositionupdate", callback, opts); }
export function onContextMenu(callback, opts) { return new HtmlEvt("contextmenu", callback, opts); }
export function onCopy(callback, opts) { return new HtmlEvt("copy", callback, opts); }
export function onCut(callback, opts) { return new HtmlEvt("cut", callback, opts); }
export function onDblClick(callback, opts) { return new HtmlEvt("dblclick", callback, opts); }
export function onDeviceChange(callback, opts) { return new HtmlEvt("devicechange", callback, opts); }
export function onDeviceMotion(callback, opts) { return new HtmlEvt("devicemotion", callback, opts); }
export function onDeviceOrientation(callback, opts) { return new HtmlEvt("deviceorientation", callback, opts); }
export function onDischargingTimeChange(callback, opts) { return new HtmlEvt("dischargingtimechange", callback, opts); }
export function onDownloading(callback, opts) { return new HtmlEvt("downloading", callback, opts); }
export function onDrag(callback, opts) { return new HtmlEvt("drag", callback, opts); }
export function onDragEnd(callback, opts) { return new HtmlEvt("dragend", callback, opts); }
export function onDragEnter(callback, opts) { return new HtmlEvt("dragenter", callback, opts); }
export function onDragLeave(callback, opts) { return new HtmlEvt("dragleave", callback, opts); }
export function onDragOver(callback, opts) { return new HtmlEvt("dragover", callback, opts); }
export function onDragStart(callback, opts) { return new HtmlEvt("dragstart", callback, opts); }
export function onDrop(callback, opts) { return new HtmlEvt("drop", callback, opts); }
export function onDurationChange(callback, opts) { return new HtmlEvt("durationchange", callback, opts); }
export function onEmptied(callback, opts) { return new HtmlEvt("emptied", callback, opts); }
export function onEnd(callback, opts) { return new HtmlEvt("end", callback, opts); }
export function onEnded(callback, opts) { return new HtmlEvt("ended", callback, opts); }
export function onError(callback, opts) { return new HtmlEvt("error", callback, opts); }
export function onFocus(callback, opts) { return new HtmlEvt("focus", callback, opts); }
export function onFocusIn(callback, opts) { return new HtmlEvt("focusin", callback, opts); }
export function onFocusOut(callback, opts) { return new HtmlEvt("focusout", callback, opts); }
export function onFullScreenChange(callback, opts) { return new HtmlEvt("fullscreenchange", callback, opts); }
export function onFullScreenError(callback, opts) { return new HtmlEvt("fullscreenerror", callback, opts); }
export function onGamepadConnected(callback, opts) { return new HtmlEvt("gamepadconnected", callback, opts); }
export function onGamepadDisconnected(callback, opts) { return new HtmlEvt("gamepaddisconnected", callback, opts); }
export function onGotPointerCapture(callback, opts) { return new HtmlEvt("gotpointercapture", callback, opts); }
export function onHashChange(callback, opts) { return new HtmlEvt("hashchange", callback, opts); }
export function onLostPointerCapture(callback, opts) { return new HtmlEvt("lostpointercapture", callback, opts); }
export function onInput(callback, opts) { return new HtmlEvt("input", callback, opts); }
export function onInvalid(callback, opts) { return new HtmlEvt("invalid", callback, opts); }
export function onKeyDown(callback, opts) { return new HtmlEvt("keydown", (evt) => callback(evt), opts); }
export function onKeyPress(callback, opts) { return new HtmlEvt("keypress", (evt) => callback(evt), opts); }
export function onKeyUp(callback, opts) { return new HtmlEvt("keyup", (evt) => callback(evt), opts); }
export function onEnterKeyPressed(callback, opts) {
    return onKeyUp((evt) => {
        if (evt.key === "Enter") {
            callback(evt);
        }
    }, opts);
}
export function onLanguageChange(callback, opts) { return new HtmlEvt("languagechange", callback, opts); }
export function onLevelChange(callback, opts) { return new HtmlEvt("levelchange", callback, opts); }
export function onLoad(callback, opts) { return new HtmlEvt("load", callback, opts); }
export function onLoadedData(callback, opts) { return new HtmlEvt("loadeddata", callback, opts); }
export function onLoadedMetadata(callback, opts) { return new HtmlEvt("loadedmetadata", callback, opts); }
export function onLoadEnd(callback, opts) { return new HtmlEvt("loadend", callback, opts); }
export function onLoadStart(callback, opts) { return new HtmlEvt("loadstart", callback, opts); }
export function onMark(callback, opts) { return new HtmlEvt("mark", callback, opts); }
export function onMessage(callback, opts) { return new HtmlEvt("message", callback, opts); }
export function onMessageError(callback, opts) { return new HtmlEvt("messageerror", callback, opts); }
export function onMouseDown(callback, opts) { return new HtmlEvt("mousedown", callback, opts); }
export function onMouseEnter(callback, opts) { return new HtmlEvt("mouseenter", callback, opts); }
export function onMouseLeave(callback, opts) { return new HtmlEvt("mouseleave", callback, opts); }
export function onMouseMove(callback, opts) { return new HtmlEvt("mousemove", callback, opts); }
export function onMouseOut(callback, opts) { return new HtmlEvt("mouseout", callback, opts); }
export function onMouseOver(callback, opts) { return new HtmlEvt("mouseover", callback, opts); }
export function onMouseUp(callback, opts) { return new HtmlEvt("mouseup", callback, opts); }
export function onNoMatch(callback, opts) { return new HtmlEvt("nomatch", callback, opts); }
export function onNotificationClick(callback, opts) { return new HtmlEvt("notificationclick", callback, opts); }
export function onNoUpdate(callback, opts) { return new HtmlEvt("noupdate", callback, opts); }
export function onObsolete(callback, opts) { return new HtmlEvt("obsolete", callback, opts); }
export function onOffline(callback, opts) { return new HtmlEvt("offline", callback, opts); }
export function onOnline(callback, opts) { return new HtmlEvt("online", callback, opts); }
export function onOpen(callback, opts) { return new HtmlEvt("open", callback, opts); }
export function onOrientationChange(callback, opts) { return new HtmlEvt("orientationchange", callback, opts); }
export function onPageHide(callback, opts) { return new HtmlEvt("pagehide", callback, opts); }
export function onPageShow(callback, opts) { return new HtmlEvt("pageshow", callback, opts); }
export function onPaste(callback, opts) { return new HtmlEvt("paste", callback, opts); }
export function onPause(callback, opts) { return new HtmlEvt("pause", callback, opts); }
export function onPointerCancel(callback, opts) { return new HtmlEvt("pointercancel", callback, opts); }
export function onPointerDown(callback, opts) { return new HtmlEvt("pointerdown", callback, opts); }
export function onPointerEnter(callback, opts) { return new HtmlEvt("pointerenter", callback, opts); }
export function onPointerLeave(callback, opts) { return new HtmlEvt("pointerleave", callback, opts); }
export function onPointerLockChange(callback, opts) { return new HtmlEvt("pointerlockchange", callback, opts); }
export function onPointerLockError(callback, opts) { return new HtmlEvt("pointerlockerror", callback, opts); }
export function onPointerMove(callback, opts) { return new HtmlEvt("pointermove", callback, opts); }
export function onPointerOut(callback, opts) { return new HtmlEvt("pointerout", callback, opts); }
export function onPointerOver(callback, opts) { return new HtmlEvt("pointerover", callback, opts); }
export function onPointerUp(callback, opts) { return new HtmlEvt("pointerup", callback, opts); }
export function onPlay(callback, opts) { return new HtmlEvt("play", callback, opts); }
export function onPlaying(callback, opts) { return new HtmlEvt("playing", callback, opts); }
export function onPopstate(callback, opts) { return new HtmlEvt("popstate", callback, opts); }
export function onProgress(callback, opts) { return new HtmlEvt("progress", callback, opts); }
export function onPush(callback, opts) { return new HtmlEvt("push", callback, opts); }
export function onPushSubscriptionChange(callback, opts) { return new HtmlEvt("pushsubscriptionchange", callback, opts); }
export function onRatechange(callback, opts) { return new HtmlEvt("ratechange", callback, opts); }
export function onReadystatechange(callback, opts) { return new HtmlEvt("readystatechange", callback, opts); }
export function onReset(callback, opts) { return new HtmlEvt("reset", callback, opts); }
export function onResize(callback, opts) { return new HtmlEvt("resize", callback, opts); }
export function onResourceTimingBufferFull(callback, opts) { return new HtmlEvt("resourcetimingbufferfull", callback, opts); }
export function onResult(callback, opts) { return new HtmlEvt("result", callback, opts); }
export function onResume(callback, opts) { return new HtmlEvt("resume", callback, opts); }
export function onScroll(callback, opts) { return new HtmlEvt("scroll", callback, opts); }
export function onSeeked(callback, opts) { return new HtmlEvt("seeked", callback, opts); }
export function onSeeking(callback, opts) { return new HtmlEvt("seeking", callback, opts); }
export function onSelect(callback, opts) { return new HtmlEvt("select", callback, opts); }
export function onSelectStart(callback, opts) { return new HtmlEvt("selectstart", callback, opts); }
export function onSelectionChange(callback, opts) { return new HtmlEvt("selectionchange", callback, opts); }
export function onShow(callback, opts) { return new HtmlEvt("show", callback, opts); }
export function onSlotChange(callback, opts) { return new HtmlEvt("slotchange", callback, opts); }
export function onSoundEnd(callback, opts) { return new HtmlEvt("soundend", callback, opts); }
export function onSoundStart(callback, opts) { return new HtmlEvt("soundstart", callback, opts); }
export function onSpeechEnd(callback, opts) { return new HtmlEvt("speechend", callback, opts); }
export function onSpeechStart(callback, opts) { return new HtmlEvt("speechstart", callback, opts); }
export function onStalled(callback, opts) { return new HtmlEvt("stalled", callback, opts); }
export function onStart(callback, opts) { return new HtmlEvt("start", callback, opts); }
export function onStorage(callback, opts) { return new HtmlEvt("storage", callback, opts); }
export function onSubmit(callback, opts) { return new HtmlEvt("submit", callback, opts); }
export function onSuccess(callback, opts) { return new HtmlEvt("success", callback, opts); }
export function onSuspend(callback, opts) { return new HtmlEvt("suspend", callback, opts); }
export function onSVGAbort(callback, opts) { return new HtmlEvt("SVGAbort", callback, opts); }
export function onSVGError(callback, opts) { return new HtmlEvt("SVGError", callback, opts); }
export function onSVGLoad(callback, opts) { return new HtmlEvt("SVGLoad", callback, opts); }
export function onSVGResize(callback, opts) { return new HtmlEvt("SVGResize", callback, opts); }
export function onSVGScroll(callback, opts) { return new HtmlEvt("SVGScroll", callback, opts); }
export function onSVGUnload(callback, opts) { return new HtmlEvt("SVGUnload", callback, opts); }
export function onSVGZoom(callback, opts) { return new HtmlEvt("SVGZoom", callback, opts); }
export function onTimeout(callback, opts) { return new HtmlEvt("timeout", callback, opts); }
export function onTimeUpdate(callback, opts) { return new HtmlEvt("timeupdate", callback, opts); }
export function onTouchCancel(callback, opts) { return new HtmlEvt("touchcancel", callback, opts); }
export function onTouchEnd(callback, opts) { return new HtmlEvt("touchend", callback, opts); }
export function onTouchMove(callback, opts) { return new HtmlEvt("touchmove", callback, opts); }
export function onTouchStart(callback, opts) { return new HtmlEvt("touchstart", callback, opts); }
export function onTransitionEnd(callback, opts) { return new HtmlEvt("transitionend", callback, opts); }
export function onUnload(callback, opts) { return new HtmlEvt("unload", callback, opts); }
export function onUpdateReady(callback, opts) { return new HtmlEvt("updateready", callback, opts); }
export function onUpgradeNeeded(callback, opts) { return new HtmlEvt("upgradeneeded", callback, opts); }
export function onUserProximity(callback, opts) { return new HtmlEvt("userproximity", callback, opts); }
export function onVoicesChanged(callback, opts) { return new HtmlEvt("voiceschanged", callback, opts); }
export function onVersionChange(callback, opts) { return new HtmlEvt("versionchange", callback, opts); }
export function onVisibilityChange(callback, opts) { return new HtmlEvt("visibilitychange", callback, opts); }
export function onVolumeChange(callback, opts) { return new HtmlEvt("volumechange", callback, opts); }
export function onWaiting(callback, opts) { return new HtmlEvt("waiting", callback, opts); }
export function onWheel(callback, opts) { return new HtmlEvt("wheel", callback, opts); }
//# sourceMappingURL=evts.js.map