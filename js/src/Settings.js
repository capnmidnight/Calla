const selfs = new Map(),
    KEY = "CallaSettings",
    DEFAULT_SETTINGS = {
        drawHearing: false,
        audioDistanceMin: 1,
        audioDistanceMax: 10,
        audioRolloff: 1,
        fontSize: 12,
        zoom: 1.5,
        userName: "",
        roomName: "calla",
        gamepadIndex: 0
    };

function commit(settings) {
    const self = selfs.get(settings);
    localStorage.setItem(KEY, JSON.stringify(self));
}

function load() {
    const selfStr = localStorage.getItem(KEY);
    if (!!selfStr) {
        return Object.assign(
            {},
            DEFAULT_SETTINGS,
            JSON.parse(selfStr));
    }
}

export class Settings {
    constructor() {
        const self = Object.seal(load() || DEFAULT_SETTINGS);
        selfs.set(this, self);
        if (window.location.hash.length > 0) {
            self.roomName = window.location.hash.substring(1);
        }
        Object.seal(this);
    }

    get drawHearing() {
        return selfs.get(this).drawHearing;
    }

    set drawHearing(value) {
        if (value !== this.drawHearing) {
            selfs.get(this).drawHearing = value;
            commit(this);
        }
    }

    get audioDistanceMin() {
        return selfs.get(this).audioDistanceMin;
    }

    set audioDistanceMin(value) {
        if (value !== this.audioDistanceMin) {
            selfs.get(this).audioDistanceMin = value;
            commit(this);
        }
    }

    get audioDistanceMax() {
        return selfs.get(this).audioDistanceMax;
    }

    set audioDistanceMax(value) {
        if (value !== this.audioDistanceMax) {
            selfs.get(this).audioDistanceMax = value;
            commit(this);
        }
    }

    get audioRolloff() {
        return selfs.get(this).audioRolloff;
    }

    set audioRolloff(value) {
        if (value !== this.audioRolloff) {
            selfs.get(this).audioRolloff = value;
            commit(this);
        }
    }

    get fontSize() {
        return selfs.get(this).fontSize;
    }

    set fontSize(value) {
        if (value !== this.fontSize) {
            selfs.get(this).fontSize = value;
            commit(this);
        }
    }

    get zoom() {
        return selfs.get(this).zoom;
    }

    set zoom(value) {
        if (value !== this.zoom) {
            selfs.get(this).zoom = value;
            commit(this);
        }
    }

    get userName() {
        return selfs.get(this).userName;
    }

    set userName(value) {
        if (value !== this.userName) {
            selfs.get(this).userName = value;
            commit(this);
        }
    }

    get roomName() {
        return selfs.get(this).roomName;
    }

    set roomName(value) {
        if (value !== this.roomName) {
            selfs.get(this).roomName = value;
            commit(this);
        }
    }

    get gamepadIndex() {
        return selfs.get(this).gamepadIndex;
    }

    set gamepadIndex(value) {
        if (value !== this.gamepadIndex) {
            selfs.get(this).gamepadIndex = value;
            commit(this);
        }
    }
}