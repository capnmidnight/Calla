import { onInput } from "kudzu/html/evts";
import { SelectBox } from "./SelectBoxTag";
import type { SelectBoxTag } from "./SelectBoxTag";
import { FormDialog, FormDialogEvents } from "./FormDialog";
import { TypedEvent } from "kudzu/events/EventBase";
import { Label, Select } from "kudzu/html/tags";
import { htmlFor, id } from "kudzu/html/attrs";

const audioInputChangedEvt = new TypedEvent("audioInputChanged"),
    audioOutputChangedEvt = new TypedEvent("audioOutputChanged"),
    videoInputChangedEvt = new TypedEvent("videoInputChanged");

interface DevicesDialogEvents extends FormDialogEvents {
    audioInputChanged: TypedEvent<"audioInputChanged">;
    audioOutputChanged: TypedEvent<"audioOutputChanged">;
    videoInputChanged: TypedEvent<"videoInputChanged">;
}

export class DevicesDialog extends FormDialog<DevicesDialogEvents>{
    videoInputSelect: SelectBoxTag<MediaDeviceInfo>;
    audioInputSelect: SelectBoxTag<MediaDeviceInfo>;
    audioOutputSelect: SelectBoxTag<MediaDeviceInfo>;

    constructor() {
        super("devices", "Devices");

        this.content.append(
            Label(
                htmlFor("videoInputDevices"),
                "Video Input:"),
            Select(id("videoInputDevices")),

            Label(
                htmlFor("audioInputDevices"),
                "Audio Input:"),
            Select(id("audioInputDevices")),

            Label(
                htmlFor("audioOutputDevices"),
                "Audio Output:"),
            Select(id("audioOutputDevices")));

        this.videoInputSelect = SelectBox<MediaDeviceInfo>(
            "videoInputDevices",
            "No video input",
            d => d.deviceId,
            d => d.label,
            onInput(() => this.dispatchEvent(videoInputChangedEvt)));

        this.audioInputSelect = SelectBox<MediaDeviceInfo>(
            "audioInputDevices",
            "No audio input",
            d => d.deviceId,
            d => d.label,
            onInput(() => this.dispatchEvent(audioInputChangedEvt)));

        this.audioOutputSelect = SelectBox<MediaDeviceInfo>(
            "audioOutputDevices",
            "No audio output",
            d => d.deviceId,
            d => d.label,
            onInput(() => this.dispatchEvent(audioOutputChangedEvt)));

        this.audioInputDevices = [];
        this.audioOutputDevices = [];
        this.videoInputDevices = [];

        Object.seal(this);
    }

    get audioInputDevices(): MediaDeviceInfo[] {
        return this.audioInputSelect.values;
    }

    set audioInputDevices(values: MediaDeviceInfo[]) {
        this.audioInputSelect.values = values;
    }

    get currentAudioInputDevice(): MediaDeviceInfo {
        return this.audioInputSelect.selectedValue;
    }

    set currentAudioInputDevice(value: MediaDeviceInfo) {
        this.audioInputSelect.selectedValue = value;
    }


    get audioOutputDevices(): MediaDeviceInfo[] {
        return this.audioOutputSelect.values;
    }

    set audioOutputDevices(values: MediaDeviceInfo[]) {
        this.audioOutputSelect.values = values;
    }

    get currentAudioOutputDevice(): MediaDeviceInfo {
        return this.audioOutputSelect.selectedValue;
    }

    set currentAudioOutputDevice(value: MediaDeviceInfo) {
        this.audioOutputSelect.selectedValue = value;
    }


    get videoInputDevices(): MediaDeviceInfo[] {
        return this.videoInputSelect.values;
    }

    set videoInputDevices(values: MediaDeviceInfo[]) {
        this.videoInputSelect.values = values;
    }

    get currentVideoInputDevice(): MediaDeviceInfo {
        return this.videoInputSelect.selectedValue;
    }

    set currentVideoInputDevice(value: MediaDeviceInfo) {
        this.videoInputSelect.selectedValue = value;
    }
}