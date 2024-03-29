import { progressCallback } from "../tasks/progressCallback";
import { IElementAppliable } from "./tags";
declare type EventListenerOpts = boolean | AddEventListenerOptions;
export declare function makeEnterKeyEventHandler(callback: (evt: KeyboardEvent) => void): (ev: Event) => void;
export declare function makeProgress(element: HTMLInputElement): progressCallback;
/**
 * A setter functor for HTML element events.
 **/
export declare class HtmlEvt implements IElementAppliable {
    name: string;
    callback: EventListenerOrEventListenerObject;
    opts?: EventListenerOpts;
    /**
     * Creates a new setter functor for an HTML element event.
     * @param name - the name of the event to attach to.
     * @param callback - the callback function to use with the event handler.
     * @param opts - additional attach options.
     */
    constructor(name: string, callback: EventListenerOrEventListenerObject, opts?: EventListenerOpts);
    applyToElement(elem: HTMLElement): void;
    /**
     * Add the encapsulate callback as an event listener to the give HTMLElement
     */
    add(elem: HTMLElement): void;
    /**
     * Remove the encapsulate callback as an event listener from the give HTMLElement
     */
    remove(elem: HTMLElement): void;
}
export declare function onAbort(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onAfterPrint(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onAnimationCancel(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onAnimationEnd(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onAnimationIteration(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onAnimationStart(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onAppInstalled(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function _onAudioProcess(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onAudioEnd(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onAudioStart(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onAuxClick(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onBeforeInput(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onBeforePrint(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onBeforeUnload(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onBlocked(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onBlur(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onBoundary(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onCanPlay(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onCanPlayThrough(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onChargingChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onChargingTimeChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onChecking(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onClick(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onClose(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onComplete(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onCompositionEnd(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onCompositionStart(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onCompositionUpdate(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onContextMenu(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onCopy(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onCut(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onDblClick(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onDeviceChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onDeviceMotion(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onDeviceOrientation(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onDischargingTimeChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onDownloading(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onDrag(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onDragEnd(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onDragEnter(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onDragLeave(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onDragOver(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onDragStart(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onDrop(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onDurationChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onEmptied(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onEnd(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onEnded(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onError(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onFocus(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onFocusIn(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onFocusOut(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onFullScreenChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onFullScreenError(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onGamepadConnected(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onGamepadDisconnected(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onGotPointerCapture(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onHashChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onLostPointerCapture(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onInput(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onInvalid(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onKeyDown(callback: (evt: KeyboardEvent) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onKeyPress(callback: (evt: KeyboardEvent) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onKeyUp(callback: (evt: KeyboardEvent) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onEnterKeyPressed(callback: (evt: KeyboardEvent) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onLanguageChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onLevelChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onLoad(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onLoadedData(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onLoadedMetadata(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onLoadEnd(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onLoadStart(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onMark(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onMessage(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onMessageError(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onMouseDown(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onMouseEnter(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onMouseLeave(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onMouseMove(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onMouseOut(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onMouseOver(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onMouseUp(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onNoMatch(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onNotificationClick(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onNoUpdate(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onObsolete(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onOffline(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onOnline(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onOpen(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onOrientationChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onPageHide(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onPageShow(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onPaste(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onPause(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onPointerCancel(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onPointerDown(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onPointerEnter(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onPointerLeave(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onPointerLockChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onPointerLockError(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onPointerMove(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onPointerOut(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onPointerOver(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onPointerUp(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onPlay(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onPlaying(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onPopstate(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onProgress(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onPush(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onPushSubscriptionChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onRatechange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onReadystatechange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onReset(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onResize(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onResourceTimingBufferFull(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onResult(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onResume(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onScroll(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onSeeked(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onSeeking(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onSelect(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onSelectStart(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onSelectionChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onShow(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onSlotChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onSoundEnd(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onSoundStart(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onSpeechEnd(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onSpeechStart(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onStalled(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onStart(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onStorage(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onSubmit(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onSuccess(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onSuspend(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onSVGAbort(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onSVGError(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onSVGLoad(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onSVGResize(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onSVGScroll(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onSVGUnload(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onSVGZoom(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onTimeout(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onTimeUpdate(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onTouchCancel(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onTouchEnd(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onTouchMove(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onTouchStart(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onTransitionEnd(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onUnload(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onUpdateReady(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onUpgradeNeeded(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onUserProximity(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onVoicesChanged(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onVersionChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onVisibilityChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onVolumeChange(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onWaiting(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export declare function onWheel(callback: (evt: Event) => void, opts?: EventListenerOpts): HtmlEvt;
export {};
