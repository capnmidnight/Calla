import { EventBase } from "../../lib/calla";
export declare class ButtonLayer extends EventBase {
    constructor(targetCanvas: any, zoomMin: any, zoomMax: any);
    get isFullscreen(): boolean;
    set isFullscreen(value: boolean);
    hide(): void;
    show(): void;
    get enabled(): boolean;
    set enabled(v: boolean);
    get audioEnabled(): any;
    set audioEnabled(value: any);
    get videoEnabled(): any;
    set videoEnabled(value: any);
    setEmojiButton(key: any, emoji: any): void;
    get zoom(): number;
    /** @type {number} */
    set zoom(v: number);
}
