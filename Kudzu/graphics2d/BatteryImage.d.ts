import { CanvasImage } from "./CanvasImage";
export declare class BatteryImage extends CanvasImage<void> {
    private battery;
    private lastChargeDirection;
    private lastLevel;
    private chargeDirection;
    private level;
    constructor();
    protected onRedraw(): boolean;
    private readBattery;
}
