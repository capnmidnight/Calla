const KEY = "CallaSettings";
const DEFAULT_INPUT_BINDING = Object.freeze({
    keyButtonUp: "ArrowUp",
    keyButtonDown: "ArrowDown",
    keyButtonLeft: "ArrowLeft",
    keyButtonRight: "ArrowRight",
    keyButtonEmote: "e",
    keyButtonToggleAudio: "a",
    keyButtonZoomOut: "[",
    keyButtonZoomIn: "]",
    gpButtonEmote: 0,
    gpButtonToggleAudio: 1,
    gpButtonZoomIn: 6,
    gpButtonZoomOut: 7,
    gpButtonUp: 12,
    gpButtonDown: 13,
    gpButtonLeft: 14,
    gpButtonRight: 15
});
/** @type {WeakMap<Settings, SettingsPrivate>} */
const selfs = new WeakMap();
class SettingsPrivate {
    constructor() {
        this.drawHearing = false;
        this.audioDistanceMin = 1;
        this.audioDistanceMax = 10;
        this.audioRolloff = 1;
        this.fontSize = 12;
        this.transitionSpeed = 1;
        this.zoom = 1.5;
        this.roomName = "calla";
        this.userName = "";
        this.email = "";
        this.avatarEmoji = null;
        /** @type {string} */
        this.avatarURL = null;
        this.gamepadIndex = 0;
        /** @type {string} */
        this.preferredAudioOutputID = null;
        /** @type {string} */
        this.preferredAudioInputID = null;
        /** @type {string} */
        this.preferredVideoInputID = null;
        this.inputBinding = DEFAULT_INPUT_BINDING;
        const selfStr = localStorage.getItem(KEY);
        if (selfStr) {
            Object.assign(this, JSON.parse(selfStr));
        }
        for (var key in DEFAULT_INPUT_BINDING) {
            if (this.inputBinding[key] === undefined) {
                this.inputBinding[key] = DEFAULT_INPUT_BINDING[key];
            }
        }
        Object.seal(this);
    }
    commit() {
        localStorage.setItem(KEY, JSON.stringify(this));
    }
}
export class Settings {
    constructor() {
        const self = new SettingsPrivate();
        selfs.set(this, self);
        if (window.location.hash.length > 0) {
            self.roomName = window.location.hash.substring(1);
        }
        Object.seal(this);
    }
    get preferredAudioOutputID() {
        return selfs.get(this).preferredAudioOutputID;
    }
    set preferredAudioOutputID(value) {
        if (value !== this.preferredAudioOutputID) {
            const self = selfs.get(this);
            self.preferredAudioOutputID = value;
            self.commit();
        }
    }
    get preferredAudioInputID() {
        return selfs.get(this).preferredAudioInputID;
    }
    set preferredAudioInputID(value) {
        if (value !== this.preferredAudioInputID) {
            const self = selfs.get(this);
            self.preferredAudioInputID = value;
            self.commit();
        }
    }
    get preferredVideoInputID() {
        return selfs.get(this).preferredVideoInputID;
    }
    set preferredVideoInputID(value) {
        if (value !== this.preferredVideoInputID) {
            const self = selfs.get(this);
            self.preferredVideoInputID = value;
            self.commit();
        }
    }
    get transitionSpeed() {
        return selfs.get(this).transitionSpeed;
    }
    set transitionSpeed(value) {
        if (value !== this.transitionSpeed) {
            const self = selfs.get(this);
            self.transitionSpeed = value;
            self.commit();
        }
    }
    get drawHearing() {
        return selfs.get(this).drawHearing;
    }
    set drawHearing(value) {
        if (value !== this.drawHearing) {
            const self = selfs.get(this);
            self.drawHearing = value;
            self.commit();
        }
    }
    get audioDistanceMin() {
        return selfs.get(this).audioDistanceMin;
    }
    set audioDistanceMin(value) {
        if (value !== this.audioDistanceMin) {
            const self = selfs.get(this);
            self.audioDistanceMin = value;
            self.commit();
        }
    }
    get audioDistanceMax() {
        return selfs.get(this).audioDistanceMax;
    }
    set audioDistanceMax(value) {
        if (value !== this.audioDistanceMax) {
            const self = selfs.get(this);
            self.audioDistanceMax = value;
            self.commit();
        }
    }
    get audioRolloff() {
        return selfs.get(this).audioRolloff;
    }
    set audioRolloff(value) {
        if (value !== this.audioRolloff) {
            const self = selfs.get(this);
            self.audioRolloff = value;
            self.commit();
        }
    }
    get fontSize() {
        return selfs.get(this).fontSize;
    }
    set fontSize(value) {
        if (value !== this.fontSize) {
            const self = selfs.get(this);
            self.fontSize = value;
            self.commit();
        }
    }
    get zoom() {
        return selfs.get(this).zoom;
    }
    set zoom(value) {
        if (value !== this.zoom) {
            const self = selfs.get(this);
            self.zoom = value;
            self.commit();
        }
    }
    get userName() {
        return selfs.get(this).userName;
    }
    set userName(value) {
        if (value !== this.userName) {
            const self = selfs.get(this);
            self.userName = value;
            self.commit();
        }
    }
    get email() {
        return selfs.get(this).email;
    }
    set email(value) {
        if (value !== this.email) {
            const self = selfs.get(this);
            self.email = value;
            self.commit();
        }
    }
    get avatarEmoji() {
        return selfs.get(this).avatarEmoji;
    }
    set avatarEmoji(value) {
        if (value !== this.avatarEmoji) {
            const self = selfs.get(this);
            self.avatarEmoji = value;
            self.commit();
        }
    }
    get avatarURL() {
        return selfs.get(this).avatarURL;
    }
    set avatarURL(value) {
        if (value !== this.avatarURL) {
            const self = selfs.get(this);
            self.avatarURL = value;
            self.commit();
        }
    }
    get roomName() {
        return selfs.get(this).roomName;
    }
    set roomName(value) {
        if (value !== this.roomName) {
            const self = selfs.get(this);
            self.roomName = value;
            self.commit();
        }
    }
    get gamepadIndex() {
        return selfs.get(this).gamepadIndex;
    }
    set gamepadIndex(value) {
        if (value !== this.gamepadIndex) {
            const self = selfs.get(this);
            self.gamepadIndex = value;
            self.commit();
        }
    }
    get inputBinding() {
        return selfs.get(this).inputBinding;
    }
    set inputBinding(value) {
        if (value !== this.inputBinding) {
            const self = selfs.get(this);
            for (let key in value) {
                self.inputBinding[key] = value[key];
            }
            self.commit();
        }
    }
}
//# sourceMappingURL=Settings.js.map