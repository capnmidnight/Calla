export function isFunction(obj) {
    return typeof obj === "function"
        || obj instanceof Function;
}

export class HtmlEvt {
    constructor(name, callback, opts) {
        if (!isFunction(callback)) {
            throw new Error("A function instance is required for this parameter");
        }

        this.add = (elem) => {
            elem.addEventListener(name, callback, opts);
        };

        this.remove = (elem) => {
            elem.removeEventListener(name, callback);
        };

        Object.freeze(this);
    }
}


export function onAbort(callback) { return new HtmlEvt("abort", callback); }
export function onAfterPrint(callback) { return new HtmlEvt("afterprint", callback); }
export function onAnimationCancel(callback) { return new HtmlEvt("animationcancel", callback); }
export function onAnimationEnd(callback) { return new HtmlEvt("animationend", callback); }
export function onAnimationIteration(callback) { return new HtmlEvt("animationiteration", callback); }
export function onAnimationStart(callback) { return new HtmlEvt("animationstart", callback); }
export function onAppInstalled(callback) { return new HtmlEvt("appinstalled", callback); }
export function _onAudioProcess(callback) { return new HtmlEvt("audioprocess", callback); }
export function onAudioEnd(callback) { return new HtmlEvt("audioend", callback); }
export function onAudioStart(callback) { return new HtmlEvt("audiostart", callback); }
export function onAuxClick(callback) { return new HtmlEvt("auxclick", callback); }
export function onBeforeInput(callback) { return new HtmlEvt("beforeinput", callback); }
export function onBeforePrint(callback) { return new HtmlEvt("beforeprint", callback); }
export function onBeforeUnload(callback) { return new HtmlEvt("beforeunload", callback); }
export function onBlocked(callback) { return new HtmlEvt("blocked", callback); }
export function onBlur(callback) { return new HtmlEvt("blur", callback); }
export function onBoundary(callback) { return new HtmlEvt("boundary", callback); }
export function onCanPlay(callback) { return new HtmlEvt("canplay", callback); }
export function onCanPlayThrough(callback) { return new HtmlEvt("canplaythrough", callback); }
export function onChange(callback) { return new HtmlEvt("change", callback); }
export function onChargingChange(callback) { return new HtmlEvt("chargingchange", callback); }
export function onChargingTimeChange(callback) { return new HtmlEvt("chargingtimechange", callback); }
export function onChecking(callback) { return new HtmlEvt("checking", callback); }
export function onClick(callback) { return new HtmlEvt("click", callback); }
export function onClose(callback) { return new HtmlEvt("close", callback); }
export function onComplete(callback) { return new HtmlEvt("complete", callback); }
export function onCompositionEnd(callback) { return new HtmlEvt("compositionend", callback); }
export function onCompositionStart(callback) { return new HtmlEvt("compositionstart", callback); }
export function onCompositionUpdate(callback) { return new HtmlEvt("compositionupdate", callback); }
export function onContextMenu(callback) { return new HtmlEvt("contextmenu", callback); }
export function onCopy(callback) { return new HtmlEvt("copy", callback); }
export function onCut(callback) { return new HtmlEvt("cut", callback); }
export function onDblClick(callback) { return new HtmlEvt("dblclick", callback); }
export function onDeviceChange(callback) { return new HtmlEvt("devicechange", callback); }
export function onDeviceMotion(callback) { return new HtmlEvt("devicemotion", callback); }
export function onDeviceOrientation(callback) { return new HtmlEvt("deviceorientation", callback); }
export function onDischargingTimeChange(callback) { return new HtmlEvt("dischargingtimechange", callback); }
export function onDownloading(callback) { return new HtmlEvt("downloading", callback); }
export function onDrag(callback) { return new HtmlEvt("drag", callback); }
export function onDragEnd(callback) { return new HtmlEvt("dragend", callback); }
export function onDragEnter(callback) { return new HtmlEvt("dragenter", callback); }
export function onDragLeave(callback) { return new HtmlEvt("dragleave", callback); }
export function onDragOver(callback) { return new HtmlEvt("dragover", callback); }
export function onDragStart(callback) { return new HtmlEvt("dragstart", callback); }
export function onDrop(callback) { return new HtmlEvt("drop", callback); }
export function onDurationChange(callback) { return new HtmlEvt("durationchange", callback); }
export function onEmptied(callback) { return new HtmlEvt("emptied", callback); }
export function onEnd(callback) { return new HtmlEvt("end", callback); }
export function onEnded(callback) { return new HtmlEvt("ended", callback); }
export function onError(callback) { return new HtmlEvt("error", callback); }
export function onFocus(callback) { return new HtmlEvt("focus", callback); }
export function onFocusIn(callback) { return new HtmlEvt("focusin", callback); }
export function onFocusOut(callback) { return new HtmlEvt("focusout", callback); }
export function onFullScreenChange(callback) { return new HtmlEvt("fullscreenchange", callback); }
export function onFullScreenError(callback) { return new HtmlEvt("fullscreenerror", callback); }
export function onGamepadConnected(callback) { return new HtmlEvt("gamepadconnected", callback); }
export function onGamepadDisconnected(callback) { return new HtmlEvt("gamepaddisconnected", callback); }
export function onGotPointerCapture(callback) { return new HtmlEvt("gotpointercapture", callback); }
export function onHashChange(callback) { return new HtmlEvt("hashchange", callback); }
export function onLostPointerCapture(callback) { return new HtmlEvt("lostpointercapture", callback); }
export function onInput(callback) { return new HtmlEvt("input", callback); }
export function onInvalid(callback) { return new HtmlEvt("invalid", callback); }
export function onKeyDown(callback) { return new HtmlEvt("keydown", callback); }
export function onKeyPress(callback) { return new HtmlEvt("keypress", callback); }
export function onKeyUp(callback) { return new HtmlEvt("keyup", callback); }
export function onLanguageChange(callback) { return new HtmlEvt("languagechange", callback); }
export function onLevelChange(callback) { return new HtmlEvt("levelchange", callback); }
export function onLoad(callback) { return new HtmlEvt("load", callback); }
export function onLoadedData(callback) { return new HtmlEvt("loadeddata", callback); }
export function onLoadedMetadata(callback) { return new HtmlEvt("loadedmetadata", callback); }
export function onLoadEnd(callback) { return new HtmlEvt("loadend", callback); }
export function onLoadStart(callback) { return new HtmlEvt("loadstart", callback); }
export function onMark(callback) { return new HtmlEvt("mark", callback); }
export function onMessage(callback) { return new HtmlEvt("message", callback); }
export function onMessageError(callback) { return new HtmlEvt("messageerror", callback); }
export function onMouseDown(callback) { return new HtmlEvt("mousedown", callback); }
export function onMouseEnter(callback) { return new HtmlEvt("mouseenter", callback); }
export function onMouseLeave(callback) { return new HtmlEvt("mouseleave", callback); }
export function onMouseMove(callback) { return new HtmlEvt("mousemove", callback); }
export function onMouseOut(callback) { return new HtmlEvt("mouseout", callback); }
export function onMouseOver(callback) { return new HtmlEvt("mouseover", callback); }
export function onMouseUp(callback) { return new HtmlEvt("mouseup", callback); }
export function onNoMatch(callback) { return new HtmlEvt("nomatch", callback); }
export function onNotificationClick(callback) { return new HtmlEvt("notificationclick", callback); }
export function onNoUpdate(callback) { return new HtmlEvt("noupdate", callback); }
export function onObsolete(callback) { return new HtmlEvt("obsolete", callback); }
export function onOffline(callback) { return new HtmlEvt("offline", callback); }
export function onOnline(callback) { return new HtmlEvt("online", callback); }
export function onOpen(callback) { return new HtmlEvt("open", callback); }
export function onOrientationChange(callback) { return new HtmlEvt("orientationchange", callback); }
export function onPageHide(callback) { return new HtmlEvt("pagehide", callback); }
export function onPageShow(callback) { return new HtmlEvt("pageshow", callback); }
export function onPaste(callback) { return new HtmlEvt("paste", callback); }
export function onPause(callback) { return new HtmlEvt("pause", callback); }
export function onPointerCancel(callback) { return new HtmlEvt("pointercancel", callback); }
export function onPointerDown(callback) { return new HtmlEvt("pointerdown", callback); }
export function onPointerEnter(callback) { return new HtmlEvt("pointerenter", callback); }
export function onPointerLeave(callback) { return new HtmlEvt("pointerleave", callback); }
export function onPointerLockChange(callback) { return new HtmlEvt("pointerlockchange", callback); }
export function onPointerLockError(callback) { return new HtmlEvt("pointerlockerror", callback); }
export function onPointerMove(callback) { return new HtmlEvt("pointermove", callback); }
export function onPointerOut(callback) { return new HtmlEvt("pointerout", callback); }
export function onPointerOver(callback) { return new HtmlEvt("pointerover", callback); }
export function onPointerUp(callback) { return new HtmlEvt("pointerup", callback); }
export function onPlay(callback) { return new HtmlEvt("play", callback); }
export function onPlaying(callback) { return new HtmlEvt("playing", callback); }
export function onPopstate(callback) { return new HtmlEvt("popstate", callback); }
export function onProgress(callback) { return new HtmlEvt("progress", callback); }
export function onPush(callback) { return new HtmlEvt("push", callback); }
export function onPushSubscriptionChange(callback) { return new HtmlEvt("pushsubscriptionchange", callback); }
export function onRatechange(callback) { return new HtmlEvt("ratechange", callback); }
export function onReadystatechange(callback) { return new HtmlEvt("readystatechange", callback); }
export function onReset(callback) { return new HtmlEvt("reset", callback); }
export function onResize(callback) { return new HtmlEvt("resize", callback); }
export function onResourceTimingBufferFull(callback) { return new HtmlEvt("resourcetimingbufferfull", callback); }
export function onResult(callback) { return new HtmlEvt("result", callback); }
export function onResume(callback) { return new HtmlEvt("resume", callback); }
export function onScroll(callback) { return new HtmlEvt("scroll", callback); }
export function onSeeked(callback) { return new HtmlEvt("seeked", callback); }
export function onSeeking(callback) { return new HtmlEvt("seeking", callback); }
export function onSelect(callback) { return new HtmlEvt("select", callback); }
export function onSelectStart(callback) { return new HtmlEvt("selectstart", callback); }
export function onSelectionChange(callback) { return new HtmlEvt("selectionchange", callback); }
export function onShow(callback) { return new HtmlEvt("show", callback); }
export function onSlotChange(callback) { return new HtmlEvt("slotchange", callback); }
export function onSoundEnd(callback) { return new HtmlEvt("soundend", callback); }
export function onSoundStart(callback) { return new HtmlEvt("soundstart", callback); }
export function onSpeechEnd(callback) { return new HtmlEvt("speechend", callback); }
export function onSpeechStart(callback) { return new HtmlEvt("speechstart", callback); }
export function onStalled(callback) { return new HtmlEvt("stalled", callback); }
export function onStart(callback) { return new HtmlEvt("start", callback); }
export function onStorage(callback) { return new HtmlEvt("storage", callback); }
export function onSubmit(callback) { return new HtmlEvt("submit", callback); }
export function onSuccess(callback) { return new HtmlEvt("success", callback); }
export function onSuspend(callback) { return new HtmlEvt("suspend", callback); }
export function onSVGAbort(callback) { return new HtmlEvt("SVGAbort", callback); }
export function onSVGError(callback) { return new HtmlEvt("SVGError", callback); }
export function onSVGLoad(callback) { return new HtmlEvt("SVGLoad", callback); }
export function onSVGResize(callback) { return new HtmlEvt("SVGResize", callback); }
export function onSVGScroll(callback) { return new HtmlEvt("SVGScroll", callback); }
export function onSVGUnload(callback) { return new HtmlEvt("SVGUnload", callback); }
export function onSVGZoom(callback) { return new HtmlEvt("SVGZoom", callback); }
export function onTimeout(callback) { return new HtmlEvt("timeout", callback); }
export function onTimeUpdate(callback) { return new HtmlEvt("timeupdate", callback); }
export function onTouchCancel(callback) { return new HtmlEvt("touchcancel", callback); }
export function onTouchEnd(callback) { return new HtmlEvt("touchend", callback); }
export function onTouchMove(callback) { return new HtmlEvt("touchmove", callback); }
export function onTouchStart(callback) { return new HtmlEvt("touchstart", callback); }
export function onTransitionEnd(callback) { return new HtmlEvt("transitionend", callback); }
export function onUnload(callback) { return new HtmlEvt("unload", callback); }
export function onUpdateReady(callback) { return new HtmlEvt("updateready", callback); }
export function onUpgradeNeeded(callback) { return new HtmlEvt("upgradeneeded", callback); }
export function onUserProximity(callback) { return new HtmlEvt("userproximity", callback); }
export function onVoicesChanged(callback) { return new HtmlEvt("voiceschanged", callback); }
export function onVersionChange(callback) { return new HtmlEvt("versionchange", callback); }
export function onVisibilityChange(callback) { return new HtmlEvt("visibilitychange", callback); }
export function onVolumeChange(callback) { return new HtmlEvt("volumechange", callback); }
export function onWaiting(callback) { return new HtmlEvt("waiting", callback); }
export function onWheel(callback) { return new HtmlEvt("wheel", callback); }