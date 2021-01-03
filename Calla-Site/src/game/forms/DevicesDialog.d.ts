import type { SelectBoxTag } from "./SelectBoxTag";
import { FormDialog, FormDialogEvents } from "./FormDialog";
import { TypedEvent } from "kudzu/events/EventBase";
interface DevicesDialogEvents extends FormDialogEvents {
    audioInputChanged: TypedEvent<"audioInputChanged">;
    audioOutputChanged: TypedEvent<"audioOutputChanged">;
    videoInputChanged: TypedEvent<"videoInputChanged">;
}
export declare class DevicesDialog extends FormDialog<DevicesDialogEvents> {
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
export {};
