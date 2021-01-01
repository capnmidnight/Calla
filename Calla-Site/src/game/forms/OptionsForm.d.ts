import { FormDialog } from "./FormDialog";
export declare class OptionsForm extends FormDialog {
    constructor();
    update(): void;
    get avatarURL(): any;
    set avatarURL(v: any);
    setAvatarVideo(v: any): void;
    get inputBinding(): any;
    set inputBinding(value: any);
    get gamepads(): any;
    set gamepads(values: any);
    get currentGamepadIndex(): any;
    get currentGamepad(): Gamepad;
    get gamepadIndex(): any;
    set gamepadIndex(value: any);
    get drawHearing(): any;
    set drawHearing(value: any);
    get audioDistanceMin(): number;
    set audioDistanceMin(value: number);
    get audioDistanceMax(): number;
    set audioDistanceMax(value: number);
    get audioRolloff(): number;
    set audioRolloff(value: number);
    get fontSize(): number;
    set fontSize(value: number);
}
