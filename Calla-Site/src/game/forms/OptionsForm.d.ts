import { CanvasTypes } from "kudzu/html/canvas";
import { IInputBinding } from "../Settings";
import type { User } from "../User";
import { FormDialog, FormDialogEvents } from "./FormDialog";
import type { LabeledInputTag } from "./LabeledInputTag";
import type { SelectBoxTag } from "./SelectBoxTag";
export declare class OptionsFormAvatarURLChangedEvent extends Event {
    constructor();
}
export declare class OptionsFormGamepadChangedEvent extends Event {
    constructor();
}
export declare class OptionsFormSelectAvatarEvent extends Event {
    constructor();
}
export declare class OptionsFormFontSizeChangedEvent extends Event {
    constructor();
}
export declare class OptionsFormInputBindingChangedEvent extends Event {
    constructor();
}
export declare class OptionsFormAudioPropertiesChangedEvent extends Event {
    constructor();
}
export declare class OptionsFormToggleDrawHearingEvent extends Event {
    constructor();
}
export declare class OptionsFormToggleVideoEvent extends Event {
    constructor();
}
export declare class OptionsFormGamepadButtonUpEvent extends Event {
    button: number;
    constructor();
}
export declare class OptionsFormGamepadAxisMaxedEvent extends Event {
    axis: number;
    constructor();
}
interface OptionsFormEvents extends FormDialogEvents {
    avatarURLChanged: OptionsFormAvatarURLChangedEvent;
    gamepadChanged: OptionsFormGamepadChangedEvent;
    selectAvatar: OptionsFormSelectAvatarEvent;
    fontSizeChanged: OptionsFormFontSizeChangedEvent;
    inputBindingChanged: OptionsFormInputBindingChangedEvent;
    audioPropertiesChanged: OptionsFormAudioPropertiesChangedEvent;
    toggleDrawHearing: OptionsFormToggleDrawHearingEvent;
    toggleVideo: OptionsFormToggleVideoEvent;
    gamepadButtonUp: OptionsFormGamepadButtonUpEvent;
    gamepadAxisMaxed: OptionsFormGamepadAxisMaxedEvent;
}
export declare class OptionsForm extends FormDialog<OptionsFormEvents> implements IInputBinding {
    _drawHearing: boolean;
    private _inputBinding;
    private _pad;
    avatarURLInput: HTMLInputElement;
    clearAvatarURLButton: HTMLButtonElement;
    useVideoAvatarButton: HTMLButtonElement;
    avatarPreview: HTMLCanvasElement;
    fontSizeInput: LabeledInputTag;
    drawHearingCheck: LabeledInputTag;
    audioMinInput: LabeledInputTag;
    audioMaxInput: LabeledInputTag;
    audioRolloffInput: LabeledInputTag;
    gpSelect: SelectBoxTag<Gamepad>;
    keyButtonUpInput: LabeledInputTag;
    keyButtonDownInput: LabeledInputTag;
    keyButtonLeftInput: LabeledInputTag;
    keyButtonRightInput: LabeledInputTag;
    keyButtonEmoteInput: LabeledInputTag;
    keyButtonToggleAudioInput: LabeledInputTag;
    keyButtonZoomOutInput: LabeledInputTag;
    keyButtonZoomInInput: LabeledInputTag;
    gpAxisLeftRightInput: LabeledInputTag;
    gpAxisUpDownInput: LabeledInputTag;
    gpButtonUpInput: LabeledInputTag;
    gpButtonDownInput: LabeledInputTag;
    gpButtonLeftInput: LabeledInputTag;
    gpButtonRightInput: LabeledInputTag;
    gpButtonEmoteInput: LabeledInputTag;
    gpButtonToggleAudioInput: LabeledInputTag;
    gpButtonZoomOutInput: LabeledInputTag;
    gpButtonZoomInInput: LabeledInputTag;
    user: User;
    private _avatarG;
    constructor();
    update(): void;
    get avatarURL(): string;
    set avatarURL(v: string);
    setAvatarVideo(v: CanvasTypes): void;
    get inputBinding(): IInputBinding;
    set inputBinding(value: IInputBinding);
    get gamepads(): Gamepad[];
    set gamepads(values: Gamepad[]);
    get currentGamepadIndex(): number;
    get currentGamepad(): Gamepad;
    get gamepadIndex(): number;
    set gamepadIndex(value: number);
    get drawHearing(): boolean;
    set drawHearing(value: boolean);
    get audioDistanceMin(): number;
    set audioDistanceMin(value: number);
    get audioDistanceMax(): number;
    set audioDistanceMax(value: number);
    get audioRolloff(): number;
    set audioRolloff(value: number);
    get fontSize(): number;
    set fontSize(value: number);
    get keyButtonUp(): string;
    set keyButtonUp(v: string);
    get keyButtonDown(): string;
    set keyButtonDown(v: string);
    get keyButtonLeft(): string;
    set keyButtonLeft(v: string);
    get keyButtonRight(): string;
    set keyButtonRight(v: string);
    get keyButtonEmote(): string;
    set keyButtonEmote(v: string);
    get keyButtonToggleAudio(): string;
    set keyButtonToggleAudio(v: string);
    get keyButtonZoomOut(): string;
    set keyButtonZoomOut(v: string);
    get keyButtonZoomIn(): string;
    set keyButtonZoomIn(v: string);
    private getInteger;
    get gpAxisLeftRight(): number;
    set gpAxisLeftRight(v: number);
    get gpAxisUpDown(): number;
    set gpAxisUpDown(v: number);
    get gpButtonUp(): number;
    set gpButtonUp(v: number);
    get gpButtonDown(): number;
    set gpButtonDown(v: number);
    get gpButtonLeft(): number;
    set gpButtonLeft(v: number);
    get gpButtonRight(): number;
    set gpButtonRight(v: number);
    get gpButtonEmote(): number;
    set gpButtonEmote(v: number);
    get gpButtonToggleAudio(): number;
    set gpButtonToggleAudio(v: number);
    get gpButtonZoomOut(): number;
    set gpButtonZoomOut(v: number);
    get gpButtonZoomIn(): number;
    set gpButtonZoomIn(v: number);
}
export {};
