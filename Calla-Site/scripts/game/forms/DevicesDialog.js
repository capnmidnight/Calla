import { onInput } from "../html/evts.js";
import { SelectBox } from "../html/SelectBoxTag.js";
import { FormDialog } from "./FormDialog.js";

const audioInputChangedEvt = new Event("audioInputChanged"),
    audioOutputChangedEvt = new Event("audioOutputChanged"),
    videoInputChangedEvt = new Event("videoInputChanged");

export class DevicesDialog extends FormDialog {
    constructor() {
        super("devices");

        const _ = (evt) => () => this.dispatchEvent(evt);

        this.videoInputSelect = SelectBox(
            "videoInputDevices",
            "No video input",
            d => d.deviceId,
            d => d.label,
            onInput(_(videoInputChangedEvt)));

        this.audioInputSelect = SelectBox(
            "audioInputDevices",
            "No audio input",
            d => d.deviceId,
            d => d.label,
            onInput(_(audioInputChangedEvt)));

        this.audioOutputSelect = SelectBox(
            "audioOutputDevices",
            "No audio output",
            d => d.deviceId,
            d => d.label,
            onInput(_(audioOutputChangedEvt)));

        this.audioInputDevices = [];
        this.audioOutputDevices = [];
        this.videoInputDevices = [];

        Object.seal(this);
    }

    get audioInputDevices() {
        return this.audioInputSelect.values;
    }

    set audioInputDevices(values) {
        this.audioInputSelect.values = values;
    }

    get currentAudioInputDevice() {
        return this.audioInputSelect.selectedValue;
    }

    set currentAudioInputDevice(value) {
        this.audioInputSelect.selectedValue = value;
    }


    get audioOutputDevices() {
        return this.audioOutputSelect.values;
    }

    set audioOutputDevices(values) {
        this.audioOutputSelect.values = values;
    }

    get currentAudioOutputDevice() {
        return this.audioOutputSelect.selectedValue;
    }

    set currentAudioOutputDevice(value) {
        this.audioOutputSelect.selectedValue = value;
    }


    get videoInputDevices() {
        return this.videoInputSelect.values;
    }

    set videoInputDevices(values) {
        this.videoInputSelect.values = values;
    }

    get currentVideoInputDevice() {
        return this.videoInputSelect.selectedValue;
    }

    set currentVideoInputDevice(value) {
        this.videoInputSelect.selectedValue = value;
    }
}