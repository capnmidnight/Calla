import { TextImage } from "./TextImage";
export declare class ClockImage extends TextImage {
    constructor();
    private _fps;
    get fps(): number;
    set fps(v: number);
    private lastLen;
    protected update(): void;
}
