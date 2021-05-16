import { TextImage } from "./TextImage";
export declare class ClockImage extends TextImage {
    constructor();
    fps: number;
    private lastLen;
    protected update(): void;
}
