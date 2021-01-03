export interface IOpenable {
    isOpen(): boolean;
    setOpen(v: boolean, displayType?: string): void;
    toggleOpen(displayType?: string): void;
    show(): void;
    hide(displayType?: string): void;
}
export declare function isOpenable(obj: any): obj is IOpenable;
export declare function isOpen(target: IOpenable | HTMLElement): boolean;
/**
 * Sets the element's style's display property to "none"
 * when `v` is false, or `displayType` when `v` is true.
 * @memberof Element
 * @param {boolean} v
 * @param {string} [displayType=""]
 */
export declare function setOpen(target: IOpenable | HTMLElement, v: boolean, displayType?: string): void;
export declare function toggleOpen(target: IOpenable | HTMLElement, displayType?: string): void;
export declare function show(target: IOpenable | HTMLElement, displayType?: string): void;
export declare function hide(target: IOpenable | HTMLElement, displayType?: string): void;
export interface ILabelable {
    updateLabel(open: boolean, enabledText: string, disabledText: string, bothText: string): void;
    accessKey: string;
}
export declare function isLabelable(obj: any): obj is ILabelable;
export declare function updateLabel(target: ILabelable | HTMLElement, open: boolean, enabledText: string, disabledText: string, bothText?: string): void;
export interface ILockable {
    setLocked(v: boolean): void;
}
export declare function isLockable(obj: any): obj is ILockable;
export declare function setLocked(target: ILockable | HTMLElement, value: boolean): void;
