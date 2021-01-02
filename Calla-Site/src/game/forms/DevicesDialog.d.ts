import type { SelectBoxTag } from "./SelectBoxTag";
import { FormDialog } from "./FormDialog";
export declare class DevicesDialog extends FormDialog {
    videoInputSelect: SelectBoxTag<MediaDeviceInfo>;
    audioInputSelect: SelectBoxTag<MediaDeviceInfo>;
    audioOutputSelect: SelectBoxTag<MediaDeviceInfo>;
    constructor();
    get audioInputDevices(): MediaDeviceInfo[];
    set audioInputDevices(values: MediaDeviceInfo[]);
    get currentAudioInputDevice(): MediaDeviceInfo;
    set currentAudioInputDevice(value: MediaDeviceInfo);
    get audioOutputDevices(): MediaDeviceInfo[];
    set audioOutputDevices(values: MediaDeviceInfo[]);
    get currentAudioOutputDevice(): MediaDeviceInfo;
    set currentAudioOutputDevice(value: MediaDeviceInfo);
    get videoInputDevices(): MediaDeviceInfo[];
    set videoInputDevices(values: MediaDeviceInfo[]);
    get currentVideoInputDevice(): MediaDeviceInfo;
    set currentVideoInputDevice(value: MediaDeviceInfo);
}
