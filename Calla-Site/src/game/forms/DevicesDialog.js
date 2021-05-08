import { onInput } from "kudzu/html/evts";
import { SelectBox } from "./SelectBoxTag";
import { FormDialog } from "./FormDialog";
import { TypedEvent } from "kudzu/events/EventBase";
import { Label, Select } from "kudzu/html/tags";
import { htmlFor, id } from "kudzu/html/attrs";
const audioInputChangedEvt = new TypedEvent("audioInputChanged"), audioOutputChangedEvt = new TypedEvent("audioOutputChanged"), videoInputChangedEvt = new TypedEvent("videoInputChanged");
export class DevicesDialog extends FormDialog {
    constructor() {
        super("devices", "Devices");
        this.content.append(Label(htmlFor("videoInputDevices"), "Video Input:"), Select(id("videoInputDevices")), Label(htmlFor("audioInputDevices"), "Audio Input:"), Select(id("audioInputDevices")), Label(htmlFor("audioOutputDevices"), "Audio Output:"), Select(id("audioOutputDevices")));
        this.videoInputSelect = SelectBox("videoInputDevices", "No video input", d => d.deviceId, d => d.label, onInput(() => this.dispatchEvent(videoInputChangedEvt)));
        this.audioInputSelect = SelectBox("audioInputDevices", "No audio input", d => d.deviceId, d => d.label, onInput(() => this.dispatchEvent(audioInputChangedEvt)));
        this.audioOutputSelect = SelectBox("audioOutputDevices", "No audio output", d => d.deviceId, d => d.label, onInput(() => this.dispatchEvent(audioOutputChangedEvt)));
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
//# sourceMappingURL=DevicesDialog.js.map