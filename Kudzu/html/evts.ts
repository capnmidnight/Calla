import { isFunction, isHTMLElement } from "../typeChecks";

type EventListenerOpts = boolean | AddEventListenerOptions;

export function makeEnterKeyEventHandler(callback: (evt: KeyboardEvent) => void) {
    return (ev: Event) => {
        const evt = ev as KeyboardEvent;
        if (!evt.shiftKey
            && !evt.ctrlKey
            && !evt.altKey
            && !evt.metaKey
            && evt.key === "Enter") {
            callback(evt);
        }
    };
}

/**
 * A setter functor for HTML element events.
 **/
export class HtmlEvt {
    opts?: EventListenerOpts;

    /**
     * Creates a new setter functor for an HTML element event.
     * @param name - the name of the event to attach to.
     * @param callback - the callback function to use with the event handler.
     * @param opts - additional attach options.
     */
    constructor(public name: string, public callback: EventListenerOrEventListenerObject, opts?: EventListenerOpts) {
        if (!isFunction(callback)) {
            throw new Error("A function instance is required for this parameter");
        }

        this.opts = opts;
        Object.freeze(this);
    }

    apply(elem: HTMLElement | CSSStyleDeclaration) {
        if (isHTMLElement(elem)) {
            this.add(elem);
        }
    }

    /**
     * Add the encapsulate callback as an event listener to the give HTMLElement
     */
    add(elem: HTMLElement) {
        elem.addEventListener(this.name, this.callback, this.opts);
    }

    /**
     * Remove the encapsulate callback as an event listener from the give HTMLElement
     */
    remove(elem: HTMLElement) {
        elem.removeEventListener(this.name, this.callback);
    }
}


export function onAbort(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("abort", callback, opts); }
export function onAfterPrint(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("afterprint", callback, opts); }
export function onAnimationCancel(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("animationcancel", callback, opts); }
export function onAnimationEnd(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("animationend", callback, opts); }
export function onAnimationIteration(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("animationiteration", callback, opts); }
export function onAnimationStart(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("animationstart", callback, opts); }
export function onAppInstalled(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("appinstalled", callback, opts); }
export function _onAudioProcess(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("audioprocess", callback, opts); }
export function onAudioEnd(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("audioend", callback, opts); }
export function onAudioStart(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("audiostart", callback, opts); }
export function onAuxClick(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("auxclick", callback, opts); }
export function onBeforeInput(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("beforeinput", callback, opts); }
export function onBeforePrint(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("beforeprint", callback, opts); }
export function onBeforeUnload(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("beforeunload", callback, opts); }
export function onBlocked(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("blocked", callback, opts); }
export function onBlur(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("blur", callback, opts); }
export function onBoundary(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("boundary", callback, opts); }
export function onCanPlay(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("canplay", callback, opts); }
export function onCanPlayThrough(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("canplaythrough", callback, opts); }
export function onChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("change", callback, opts); }
export function onChargingChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("chargingchange", callback, opts); }
export function onChargingTimeChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("chargingtimechange", callback, opts); }
export function onChecking(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("checking", callback, opts); }
export function onClick(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("click", callback, opts); }
export function onClose(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("close", callback, opts); }
export function onComplete(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("complete", callback, opts); }
export function onCompositionEnd(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("compositionend", callback, opts); }
export function onCompositionStart(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("compositionstart", callback, opts); }
export function onCompositionUpdate(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("compositionupdate", callback, opts); }
export function onContextMenu(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("contextmenu", callback, opts); }
export function onCopy(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("copy", callback, opts); }
export function onCut(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("cut", callback, opts); }
export function onDblClick(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("dblclick", callback, opts); }
export function onDeviceChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("devicechange", callback, opts); }
export function onDeviceMotion(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("devicemotion", callback, opts); }
export function onDeviceOrientation(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("deviceorientation", callback, opts); }
export function onDischargingTimeChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("dischargingtimechange", callback, opts); }
export function onDownloading(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("downloading", callback, opts); }
export function onDrag(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("drag", callback, opts); }
export function onDragEnd(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("dragend", callback, opts); }
export function onDragEnter(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("dragenter", callback, opts); }
export function onDragLeave(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("dragleave", callback, opts); }
export function onDragOver(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("dragover", callback, opts); }
export function onDragStart(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("dragstart", callback, opts); }
export function onDrop(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("drop", callback, opts); }
export function onDurationChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("durationchange", callback, opts); }
export function onEmptied(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("emptied", callback, opts); }
export function onEnd(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("end", callback, opts); }
export function onEnded(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("ended", callback, opts); }
export function onError(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("error", callback, opts); }
export function onFocus(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("focus", callback, opts); }
export function onFocusIn(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("focusin", callback, opts); }
export function onFocusOut(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("focusout", callback, opts); }
export function onFullScreenChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("fullscreenchange", callback, opts); }
export function onFullScreenError(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("fullscreenerror", callback, opts); }
export function onGamepadConnected(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("gamepadconnected", callback, opts); }
export function onGamepadDisconnected(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("gamepaddisconnected", callback, opts); }
export function onGotPointerCapture(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("gotpointercapture", callback, opts); }
export function onHashChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("hashchange", callback, opts); }
export function onLostPointerCapture(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("lostpointercapture", callback, opts); }
export function onInput(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("input", callback, opts); }
export function onInvalid(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("invalid", callback, opts); }
export function onKeyDown(callback: (evt: KeyboardEvent) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("keydown", (evt: Event) => callback(evt as KeyboardEvent), opts); }
export function onKeyPress(callback: (evt: KeyboardEvent) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("keypress", (evt: Event) => callback(evt as KeyboardEvent), opts); }
export function onKeyUp(callback: (evt: KeyboardEvent) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("keyup", (evt: Event) => callback(evt as KeyboardEvent), opts); }
export function onEnterKeyPressed(callback: (evt: KeyboardEvent) => void, opts?: EventListenerOpts): HtmlEvt {
    return onKeyUp((evt) => {
        if (evt.key === "Enter") {
            callback(evt);
        }
    }, opts);
}
export function onLanguageChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("languagechange", callback, opts); }
export function onLevelChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("levelchange", callback, opts); }
export function onLoad(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("load", callback, opts); }
export function onLoadedData(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("loadeddata", callback, opts); }
export function onLoadedMetadata(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("loadedmetadata", callback, opts); }
export function onLoadEnd(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("loadend", callback, opts); }
export function onLoadStart(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("loadstart", callback, opts); }
export function onMark(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("mark", callback, opts); }
export function onMessage(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("message", callback, opts); }
export function onMessageError(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("messageerror", callback, opts); }
export function onMouseDown(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("mousedown", callback, opts); }
export function onMouseEnter(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("mouseenter", callback, opts); }
export function onMouseLeave(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("mouseleave", callback, opts); }
export function onMouseMove(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("mousemove", callback, opts); }
export function onMouseOut(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("mouseout", callback, opts); }
export function onMouseOver(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("mouseover", callback, opts); }
export function onMouseUp(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("mouseup", callback, opts); }
export function onNoMatch(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("nomatch", callback, opts); }
export function onNotificationClick(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("notificationclick", callback, opts); }
export function onNoUpdate(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("noupdate", callback, opts); }
export function onObsolete(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("obsolete", callback, opts); }
export function onOffline(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("offline", callback, opts); }
export function onOnline(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("online", callback, opts); }
export function onOpen(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("open", callback, opts); }
export function onOrientationChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("orientationchange", callback, opts); }
export function onPageHide(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("pagehide", callback, opts); }
export function onPageShow(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("pageshow", callback, opts); }
export function onPaste(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("paste", callback, opts); }
export function onPause(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("pause", callback, opts); }
export function onPointerCancel(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("pointercancel", callback, opts); }
export function onPointerDown(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("pointerdown", callback, opts); }
export function onPointerEnter(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("pointerenter", callback, opts); }
export function onPointerLeave(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("pointerleave", callback, opts); }
export function onPointerLockChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("pointerlockchange", callback, opts); }
export function onPointerLockError(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("pointerlockerror", callback, opts); }
export function onPointerMove(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("pointermove", callback, opts); }
export function onPointerOut(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("pointerout", callback, opts); }
export function onPointerOver(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("pointerover", callback, opts); }
export function onPointerUp(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("pointerup", callback, opts); }
export function onPlay(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("play", callback, opts); }
export function onPlaying(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("playing", callback, opts); }
export function onPopstate(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("popstate", callback, opts); }
export function onProgress(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("progress", callback, opts); }
export function onPush(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("push", callback, opts); }
export function onPushSubscriptionChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("pushsubscriptionchange", callback, opts); }
export function onRatechange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("ratechange", callback, opts); }
export function onReadystatechange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("readystatechange", callback, opts); }
export function onReset(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("reset", callback, opts); }
export function onResize(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("resize", callback, opts); }
export function onResourceTimingBufferFull(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("resourcetimingbufferfull", callback, opts); }
export function onResult(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("result", callback, opts); }
export function onResume(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("resume", callback, opts); }
export function onScroll(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("scroll", callback, opts); }
export function onSeeked(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("seeked", callback, opts); }
export function onSeeking(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("seeking", callback, opts); }
export function onSelect(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("select", callback, opts); }
export function onSelectStart(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("selectstart", callback, opts); }
export function onSelectionChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("selectionchange", callback, opts); }
export function onShow(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("show", callback, opts); }
export function onSlotChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("slotchange", callback, opts); }
export function onSoundEnd(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("soundend", callback, opts); }
export function onSoundStart(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("soundstart", callback, opts); }
export function onSpeechEnd(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("speechend", callback, opts); }
export function onSpeechStart(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("speechstart", callback, opts); }
export function onStalled(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("stalled", callback, opts); }
export function onStart(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("start", callback, opts); }
export function onStorage(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("storage", callback, opts); }
export function onSubmit(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("submit", callback, opts); }
export function onSuccess(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("success", callback, opts); }
export function onSuspend(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("suspend", callback, opts); }
export function onSVGAbort(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("SVGAbort", callback, opts); }
export function onSVGError(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("SVGError", callback, opts); }
export function onSVGLoad(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("SVGLoad", callback, opts); }
export function onSVGResize(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("SVGResize", callback, opts); }
export function onSVGScroll(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("SVGScroll", callback, opts); }
export function onSVGUnload(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("SVGUnload", callback, opts); }
export function onSVGZoom(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("SVGZoom", callback, opts); }
export function onTimeout(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("timeout", callback, opts); }
export function onTimeUpdate(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("timeupdate", callback, opts); }
export function onTouchCancel(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("touchcancel", callback, opts); }
export function onTouchEnd(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("touchend", callback, opts); }
export function onTouchMove(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("touchmove", callback, opts); }
export function onTouchStart(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("touchstart", callback, opts); }
export function onTransitionEnd(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("transitionend", callback, opts); }
export function onUnload(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("unload", callback, opts); }
export function onUpdateReady(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("updateready", callback, opts); }
export function onUpgradeNeeded(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("upgradeneeded", callback, opts); }
export function onUserProximity(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("userproximity", callback, opts); }
export function onVoicesChanged(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("voiceschanged", callback, opts); }
export function onVersionChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("versionchange", callback, opts); }
export function onVisibilityChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("visibilitychange", callback, opts); }
export function onVolumeChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("volumechange", callback, opts); }
export function onWaiting(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("waiting", callback, opts); }
export function onWheel(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt { return new HtmlEvt("wheel", callback, opts); }