import { FormDialog } from "./FormDialog";
export declare class DevicesDialog extends FormDialog {
    constructor();
    get audioInputDevices(): any;
    set audioInputDevices(values: any);
    get currentAudioInputDevice(): any;
    set currentAudioInputDevice(value: any);
    get audioOutputDevices(): any;
    set audioOutputDevices(values: any);
    get currentAudioOutputDevice(): any;
    set currentAudioOutputDevice(value: any);
    get videoInputDevices(): any;
    set videoInputDevices(values: any);
    get currentVideoInputDevice(): any;
    set currentVideoInputDevice(value: any);
}
