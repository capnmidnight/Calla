import { CanvasImage } from "./CanvasImage";
export declare class ArtificialHorizon extends CanvasImage<void> {
    private _pitch;
    private _heading;
    constructor();
    get pitch(): number;
    set pitch(v: number);
    get heading(): number;
    set heading(v: number);
    setPitchAndHeading(pitch: number, heading: number): void;
    protected onRedraw(): boolean;
}
