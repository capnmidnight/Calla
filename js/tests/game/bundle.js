function isGoodNumber(v) {
    return v !== null
        && v !== undefined
        && (typeof (v) === "number"
            || v instanceof Number)
        && !Number.isNaN(v);
}

function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

function lerp(a, b, p) {
    return (1 - p) * a + p * b;
}

function project(v, min, max) {
    return (v - min) / (max - min);
}

function unproject(v, min, max) {
    return v * (max - min) + min;
}

// A few convenience methods for HTML elements.

Element.prototype.isOpen = function () {
    return this.style.display !== "none";
};

Element.prototype.setOpen = function (v, displayType = "") {
    this.style.display = v
        ? displayType
        : "none";
};

Element.prototype.setOpenWithLabel = function (v, label, enabledText, disabledText, bothText, displayType = "") {
    this.setOpen(v, displayType);
    label.updateLabel(this.isOpen(), enabledText, disabledText, bothText);
};

Element.prototype.updateLabel = function (isOpen, enabledText, disabledText, bothText) {
    bothText = bothText || "";
    if (this.accessKey) {
        bothText += ` <kbd>(ALT+${this.accessKey.toUpperCase()})</kbd>`;
    }
    this.innerHTML = (isOpen ? enabledText : disabledText) + bothText;
};

Element.prototype.toggleOpen = function (displayType = "") {
    this.setOpen(!this.isOpen(), displayType);
};

Element.prototype.toggleOpenWithLabel = function (label, enabledText, disabledText, bothText, displayType = "") {
    this.setOpenWithLabel(!this.isOpen(), label, enabledText, disabledText, bothText, displayType);
};

Element.prototype.show = function (displayType = "") {
    this.setOpen(true, displayType);
};

Element.prototype.hide = function () {
    this.setOpen(false);
};

Element.prototype.setLocked = function (value) {
    if (value) {
        this.lock();
    }
    else {
        this.unlock();
    }
};

Element.prototype.lock = function () {
    this.disabled = "disabled";
};

Element.prototype.unlock = function () {
    this.disabled = "";
};

Element.prototype.blinkBorder = function (times, color) {
    times = (times || 3) * 2;
    color = color || "rgb(255, 127, 127)";

    let state = false;
    const interval = setInterval(() => {
        state = !state;
        this.style.backgroundColor = state ? color : "";
        --times;
        if (times === 0) {
            clearInterval(interval);
        }
    }, 125);
};

HTMLCanvasElement.prototype.resize = function () {
    this.width = this.clientWidth * devicePixelRatio;
    this.height = this.clientHeight * devicePixelRatio;
};

const oldAddEventListener = HTMLInputElement.prototype.addEventListener;

HTMLInputElement.prototype.addEventListener = function (evtName, func, opts) {
    if (evtName === "enter") {
        oldAddEventListener.call(this, "keypress", function (evt) {
            if (evt.key === "Enter") {
                func(evt);
            }
        }, opts);
    }
    else {
        oldAddEventListener.call(this, evtName, func, opts);
    }
};

Response.prototype.xml = async function () {
    const text = await this.text(),
        parser = new DOMParser(),
        xml = parser.parseFromString(text, "text/xml");

    return xml.documentElement;
};

Response.prototype.html = async function () {
    const text = await this.text(),
        parser = new DOMParser(),
        xml = parser.parseFromString(text, "text/html");

    return xml.documentElement;
};

Array.prototype.random = function (defaultValue) {
    const offset = !!defaultValue ? 1 : 0,
        idx = Math.floor(Math.random() * (this.length + offset)) - offset;
    if (idx < 0) {
        return defaultValue;
    }
    else {
        return this[idx];
    }
};

HTMLSelectElement.prototype.setSelectedValue = function (value) {
    this.value = "";

    if (value !== null
        && value !== undefined) {
        value = value.toString();
        for (let option of this.options) {
            if (option.value === value) {
                this.value = value;
                return;
            }
        }
    }
};

Storage.prototype.getInt = function (name, defaultValue) {
    const n = parseFloat(this.getItem(name));
    if (!Number.isInteger(n)) {
        return defaultValue;
    }

    return n;
};

function add(a, b) {
    return evt => {
        a(evt);
        b(evt);
    };
}

Event.clone = function (target, ...objs) {
    for (let obj of objs) {
        for (let key in obj) {
            if (key !== "isTrusted") {
                target[key] = obj[key];
            }
        }
    }

    return target;
};

EventTarget.prototype.once = function (resolveEvt, rejectEvt, timeout) {

    if (timeout === undefined
        && isGoodNumber(rejectEvt)) {
        timeout = rejectEvt;
        rejectEvt = undefined;
    }

    return new Promise((resolve, reject) => {
        const hasResolveEvt = resolveEvt !== undefined && resolveEvt !== null,
            removeResolve = () => {
                if (hasResolveEvt) {
                    this.removeEventListener(resolveEvt, resolve);
                }
            },
            hasRejectEvt = rejectEvt !== undefined && rejectEvt !== null,
            removeReject = () => {
                if (hasRejectEvt) {
                    this.removeEventListener(rejectEvt, reject);
                }
            },
            remove = add(removeResolve, removeReject);

        resolve = add(remove, resolve);
        reject = add(remove, reject);

        if (timeout !== undefined
            && timeout !== null) {
            const timer = setTimeout(reject, timeout),
                cancel = () => clearTimeout(timer);
            resolve = add(cancel, resolve);
            reject = add(cancel, reject);
        }

        if (hasResolveEvt) {   
            this.addEventListener(resolveEvt, resolve);
        }

        if (hasRejectEvt) {
            this.addEventListener(rejectEvt, reject);
        }
    });
};

EventTarget.prototype.until = function (untilEvt, callback, test, repeatTimeout, cancelTimeout) {
    return new Promise((resolve, reject) => {
        let timer = null,
            canceller = null;

        const cleanup = () => {
            if (timer !== null) {
                clearTimeout(timer);
            }

            if (canceller !== null) {
                clearTimeout(canceller);
            }

            this.removeEventListener(untilEvt, success);
        };

        function success(evt) {
            if (test(evt)) {
                cleanup();
                resolve(evt);
            }
        }

        this.addEventListener(untilEvt, success);

        if (cancelTimeout !== undefined) {
            canceller = setTimeout(() => {
                cleanup();
                reject("timeout");
            }, cancelTimeout);
        }

        function repeater() {
            callback();
            timer = setTimeout(repeater, repeatTimeout);
        }

        timer = setTimeout(repeater, 0);
    });
};

function isInSet(set, v) {
    return set.value === v
        || set.alt && set.alt.findIndex(e => e.value === v) >= 0;
}

function isSurfer(v) {
    return isInSet(personSurfing, v)
        || isInSet(manSurfing, v)
        || isInSet(womanSurfing, v)
        || isInSet(personRowing, v)
        || isInSet(manRowing, v)
        || isInSet(womanRowing, v)
        || isInSet(personSwimming, v)
        || isInSet(manSwimming, v)
        || isInSet(womanSwimming, v);
}

const whiteChessKing = { value: "\u{2654}", desc: "White Chess King" };
const whiteChessQueen = { value: "\u{2655}", desc: "White Chess Queen" };
const whiteChessRook = { value: "\u{2656}", desc: "White Chess Rook" };
const whiteChessBishop = { value: "\u{2657}", desc: "White Chess Bishop" };
const whiteChessKnight = { value: "\u{2658}", desc: "White Chess Knight" };
const whiteChessPawn = { value: "\u{2659}", desc: "White Chess Pawn" };
const whiteChessPieces = {
    value: whiteChessKing.value
        + whiteChessQueen.value
        + whiteChessRook.value
        + whiteChessBishop.value
        + whiteChessKnight.value
        + whiteChessPawn.value,
    width: "auto",
    king: whiteChessKing,
    queen: whiteChessQueen,
    rook: whiteChessRook,
    bishop: whiteChessBishop,
    knight: whiteChessKnight,
    pawn: whiteChessPawn,
    desc: "White Chess Pieces",
    alt: [
        whiteChessKing,
        whiteChessQueen,
        whiteChessRook,
        whiteChessBishop,
        whiteChessKnight,
        whiteChessPawn,
    ]
};

const blackChessKing = { value: "\u{265A}", desc: "Black Chess King" };
const blackChessQueen = { value: "\u{265B}", desc: "Black Chess Queen" };
const blackChessRook = { value: "\u{265C}", desc: "Black Chess Rook" };
const blackChessBishop = { value: "\u{265D}", desc: "Black Chess Bishop" };
const blackChessKnight = { value: "\u{265E}", desc: "Black Chess Knight" };
const blackChessPawn = { value: "\u{265F}", desc: "Black Chess Pawn" };
const blackChessPieces = {
    value: blackChessKing.value
        + blackChessQueen.value
        + blackChessRook.value
        + blackChessBishop.value
        + blackChessKnight.value
        + blackChessPawn.value,
    width: "auto",
    king: blackChessKing,
    queen: blackChessQueen,
    rook: blackChessRook,
    bishop: blackChessBishop,
    knight: blackChessKnight,
    pawn: blackChessPawn,
    desc: "Black Chess Pieces",
    alt: [
        blackChessKing,
        blackChessQueen,
        blackChessRook,
        blackChessBishop,
        blackChessKnight,
        blackChessPawn,
    ]
};
const chessPawns = {
    value: whiteChessPawn.value + blackChessPawn.value,
    width: "auto",
    white: whiteChessPawn,
    black: blackChessPawn,
    desc: "Chess Pawns",
    alt: [
        whiteChessPawn,
        blackChessPawn
    ]
};
const chessRooks = {
    value: whiteChessRook.value + blackChessRook.value,
    width: "auto",
    white: whiteChessRook,
    black: blackChessRook,
    desc: "Chess Rooks",
    alt: [
        whiteChessRook,
        blackChessRook
    ]
};
const chessBishops = {
    value: whiteChessBishop.value + blackChessBishop.value,
    width: "auto",
    white: whiteChessBishop,
    black: blackChessBishop,
    desc: "Chess Bishops",
    alt: [
        whiteChessBishop,
        blackChessBishop
    ]
};
const chessKnights = {
    value: whiteChessKnight.value + blackChessKnight.value,
    width: "auto",
    white: whiteChessKnight,
    black: blackChessKnight,
    desc: "Chess Knights",
    alt: [
        whiteChessKnight,
        blackChessKnight
    ]
};
const chessQueens = {
    value: whiteChessQueen.value + blackChessQueen.value,
    width: "auto",
    white: whiteChessQueen,
    black: blackChessQueen,
    desc: "Chess Queens",
    alt: [
        whiteChessQueen,
        blackChessQueen
    ]
};
const chessKings = {
    value: whiteChessKing.value + blackChessKing.value,
    width: "auto",
    white: whiteChessKing,
    black: blackChessKing,
    desc: "Chess Kings",
    alt: [
        whiteChessKing,
        blackChessKing
    ]
};
const chess = [
    whiteChessPieces,
    blackChessPieces,
    chessPawns,
    chessRooks,
    chessBishops,
    chessKnights,
    chessQueens,
    chessKings
];

chess.white = whiteChessPieces;
chess.black = blackChessPieces;
chess.pawns = chessPawns;
chess.rooks = chessRooks;
chess.bishops = chessBishops;
chess.knights = chessKnights;
chess.queens = chessQueens;
chess.kings = chessKings;

const personSurfing = {
    value: "\u{1F3C4}", desc: "person surfing", alt: [
        { value: "\u{1F3C4}\u{1F3FB}", desc: "person surfing: light skin tone" },
        { value: "\u{1F3C4}\u{1F3FC}", desc: "person surfing: medium-light skin tone" },
        { value: "\u{1F3C4}\u{1F3FD}", desc: "person surfing: medium skin tone" },
        { value: "\u{1F3C4}\u{1F3FE}", desc: "person surfing: medium-dark skin tone" },
        { value: "\u{1F3C4}\u{1F3FF}", desc: "person surfing: dark skin tone" },
    ]
};
const manSurfing = {
    value: "\u{1F3C4}\u{200D}\u{2642}\u{FE0F}", desc: "man surfing", alt: [
        { value: "\u{1F3C4}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man surfing: light skin tone" },
        { value: "\u{1F3C4}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man surfing: medium-light skin tone" },
        { value: "\u{1F3C4}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man surfing: medium skin tone" },
        { value: "\u{1F3C4}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man surfing: medium-dark skin tone" },
        { value: "\u{1F3C4}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man surfing: dark skin tone" },
    ]
};
const womanSurfing = {
    value: "\u{1F3C4}\u{200D}\u{2640}\u{FE0F}", desc: "woman surfing", alt: [
        { value: "\u{1F3C4}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman surfing: light skin tone" },
        { value: "\u{1F3C4}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman surfing: medium-light skin tone" },
        { value: "\u{1F3C4}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman surfing: medium skin tone" },
        { value: "\u{1F3C4}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman surfing: medium-dark skin tone" },
        { value: "\u{1F3C4}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman surfing: dark skin tone" },
    ]
};
const personRowing = {
    value: "\u{1F6A3}", desc: "person rowing boat", alt: [
        { value: "\u{1F6A3}\u{1F3FB}", desc: "person rowing boat: light skin tone" },
        { value: "\u{1F6A3}\u{1F3FC}", desc: "person rowing boat: medium-light skin tone" },
        { value: "\u{1F6A3}\u{1F3FD}", desc: "person rowing boat: medium skin tone" },
        { value: "\u{1F6A3}\u{1F3FE}", desc: "person rowing boat: medium-dark skin tone" },
        { value: "\u{1F6A3}\u{1F3FF}", desc: "person rowing boat: dark skin tone" },
    ]
};
const manRowing = {
    value: "\u{1F6A3}\u{200D}\u{2642}\u{FE0F}", desc: "man rowing boat", alt: [
        { value: "\u{1F6A3}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man rowing boat: light skin tone" },
        { value: "\u{1F6A3}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man rowing boat: medium-light skin tone" },
        { value: "\u{1F6A3}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man rowing boat: medium skin tone" },
        { value: "\u{1F6A3}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man rowing boat: medium-dark skin tone" },
        { value: "\u{1F6A3}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man rowing boat: dark skin tone" },
    ]
};
const womanRowing = {
    value: "\u{1F6A3}\u{200D}\u{2640}\u{FE0F}", desc: "woman rowing boat", alt: [
        { value: "\u{1F6A3}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman rowing boat: light skin tone" },
        { value: "\u{1F6A3}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman rowing boat: medium-light skin tone" },
        { value: "\u{1F6A3}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman rowing boat: medium skin tone" },
        { value: "\u{1F6A3}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman rowing boat: medium-dark skin tone" },
        { value: "\u{1F6A3}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman rowing boat: dark skin tone" },
    ]
};
const personSwimming = {
    value: "\u{1F3CA}", desc: "person swimming", alt: [
        { value: "\u{1F3CA}\u{1F3FB}", desc: "person swimming: light skin tone" },
        { value: "\u{1F3CA}\u{1F3FC}", desc: "person swimming: medium-light skin tone" },
        { value: "\u{1F3CA}\u{1F3FD}", desc: "person swimming: medium skin tone" },
        { value: "\u{1F3CA}\u{1F3FE}", desc: "person swimming: medium-dark skin tone" },
        { value: "\u{1F3CA}\u{1F3FF}", desc: "person swimming: dark skin tone" },
    ]
};
const manSwimming = {
    value: "\u{1F3CA}\u{200D}\u{2642}\u{FE0F}", desc: "man swimming", alt: [
        { value: "\u{1F3CA}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man swimming: light skin tone" },
        { value: "\u{1F3CA}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man swimming: medium-light skin tone" },
        { value: "\u{1F3CA}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man swimming: medium skin tone" },
        { value: "\u{1F3CA}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man swimming: medium-dark skin tone" },
        { value: "\u{1F3CA}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man swimming: dark skin tone" },
    ]
};
const womanSwimming = {
    value: "\u{1F3CA}\u{200D}\u{2640}\u{FE0F}", desc: "woman swimming", alt: [
        { value: "\u{1F3CA}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman swimming: light skin tone" },
        { value: "\u{1F3CA}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman swimming: medium-light skin tone" },
        { value: "\u{1F3CA}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman swimming: medium skin tone" },
        { value: "\u{1F3CA}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman swimming: medium-dark skin tone" },
        { value: "\u{1F3CA}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman swimming: dark skin tone" },
    ]
};
const personFrowning = {
    value: "\u{1F64D}", desc: "person frowning", alt: [
        { value: "\u{1F64D}\u{1F3FB}", desc: "person frowning: light skin tone" },
        { value: "\u{1F64D}\u{1F3FC}", desc: "person frowning: medium-light skin tone" },
        { value: "\u{1F64D}\u{1F3FD}", desc: "person frowning: medium skin tone" },
        { value: "\u{1F64D}\u{1F3FE}", desc: "person frowning: medium-dark skin tone" },
        { value: "\u{1F64D}\u{1F3FF}", desc: "person frowning: dark skin tone" },
    ]
};
const manFrowning = {
    value: "\u{1F64D}\u{200D}\u{2642}\u{FE0F}", desc: "man frowning", alt: [
        { value: "\u{1F64D}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man frowning: light skin tone" },
        { value: "\u{1F64D}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man frowning: medium-light skin tone" },
        { value: "\u{1F64D}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man frowning: medium skin tone" },
        { value: "\u{1F64D}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man frowning: medium-dark skin tone" },
        { value: "\u{1F64D}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man frowning: dark skin tone" },
    ]
};
const womanFrowning = {
    value: "\u{1F64D}\u{200D}\u{2640}\u{FE0F}", desc: "woman frowning", alt: [
        { value: "\u{1F64D}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman frowning: light skin tone" },
        { value: "\u{1F64D}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman frowning: medium-light skin tone" },
        { value: "\u{1F64D}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman frowning: medium skin tone" },
        { value: "\u{1F64D}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman frowning: medium-dark skin tone" },
        { value: "\u{1F64D}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman frowning: dark skin tone" },
    ]
};
const personPouting = {
    value: "\u{1F64E}", desc: "person pouting", alt: [
        { value: "\u{1F64E}\u{1F3FB}", desc: "person pouting: light skin tone" },
        { value: "\u{1F64E}\u{1F3FC}", desc: "person pouting: medium-light skin tone" },
        { value: "\u{1F64E}\u{1F3FD}", desc: "person pouting: medium skin tone" },
        { value: "\u{1F64E}\u{1F3FE}", desc: "person pouting: medium-dark skin tone" },
        { value: "\u{1F64E}\u{1F3FF}", desc: "person pouting: dark skin tone" },
    ]
};
const manPouting = {
    value: "\u{1F64E}\u{200D}\u{2642}\u{FE0F}", desc: "man pouting", alt: [
        { value: "\u{1F64E}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man pouting: light skin tone" },
        { value: "\u{1F64E}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man pouting: medium-light skin tone" },
        { value: "\u{1F64E}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man pouting: medium skin tone" },
        { value: "\u{1F64E}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man pouting: medium-dark skin tone" },
        { value: "\u{1F64E}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man pouting: dark skin tone" },
    ]
};
const womanPouting = {
    value: "\u{1F64E}\u{200D}\u{2640}\u{FE0F}", desc: "woman pouting", alt: [
        { value: "\u{1F64E}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman pouting: light skin tone" },
        { value: "\u{1F64E}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman pouting: medium-light skin tone" },
        { value: "\u{1F64E}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman pouting: medium skin tone" },
        { value: "\u{1F64E}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman pouting: medium-dark skin tone" },
        { value: "\u{1F64E}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman pouting: dark skin tone" },
    ]
};
const baby = {
    value: "\u{1F476}", desc: "baby", alt: [
        { value: "\u{1F476}\u{1F3FB}", desc: "baby: light skin tone" },
        { value: "\u{1F476}\u{1F3FC}", desc: "baby: medium-light skin tone" },
        { value: "\u{1F476}\u{1F3FD}", desc: "baby: medium skin tone" },
        { value: "\u{1F476}\u{1F3FE}", desc: "baby: medium-dark skin tone" },
        { value: "\u{1F476}\u{1F3FF}", desc: "baby: dark skin tone" },
    ]
};
const child = {
    value: "\u{1F9D2}", desc: "child", alt: [
        { value: "\u{1F9D2}\u{1F3FB}", desc: "child: light skin tone" },
        { value: "\u{1F9D2}\u{1F3FC}", desc: "child: medium-light skin tone" },
        { value: "\u{1F9D2}\u{1F3FD}", desc: "child: medium skin tone" },
        { value: "\u{1F9D2}\u{1F3FE}", desc: "child: medium-dark skin tone" },
        { value: "\u{1F9D2}\u{1F3FF}", desc: "child: dark skin tone" }
    ]
};
const boy = {
    value: "\u{1F466}", desc: "boy", alt: [
        { value: "\u{1F466}\u{1F3FB}", desc: "boy: light skin tone" },
        { value: "\u{1F466}\u{1F3FC}", desc: "boy: medium-light skin tone" },
        { value: "\u{1F466}\u{1F3FD}", desc: "boy: medium skin tone" },
        { value: "\u{1F466}\u{1F3FE}", desc: "boy: medium-dark skin tone" },
        { value: "\u{1F466}\u{1F3FF}", desc: "boy: dark skin tone" },
    ]
};
const girl = {
    value: "\u{1F467}", desc: "girl", alt: [
        { value: "\u{1F467}\u{1F3FB}", desc: "girl: light skin tone" },
        { value: "\u{1F467}\u{1F3FC}", desc: "girl: medium-light skin tone" },
        { value: "\u{1F467}\u{1F3FD}", desc: "girl: medium skin tone" },
        { value: "\u{1F467}\u{1F3FE}", desc: "girl: medium-dark skin tone" },
        { value: "\u{1F467}\u{1F3FF}", desc: "girl: dark skin tone" },
    ]
};
const person = {
    value: "\u{1F9D1}", desc: "person", alt: [
        { value: "\u{1F9D1}\u{1F3FB}", desc: "person: light skin tone" },
        { value: "\u{1F9D1}\u{1F3FC}", desc: "person: medium-light skin tone" },
        { value: "\u{1F9D1}\u{1F3FD}", desc: "person: medium skin tone" },
        { value: "\u{1F9D1}\u{1F3FE}", desc: "person: medium-dark skin tone" },
        { value: "\u{1F9D1}\u{1F3FF}", desc: "person: dark skin tone" },
    ]
};
const blondPerson = {
    value: "\u{1F471}", desc: "person: blond hair", alt: [
        { value: "\u{1F471}\u{1F3FB}", desc: "person: light skin tone, blond hair" },
        { value: "\u{1F471}\u{1F3FC}", desc: "person: medium-light skin tone, blond hair" },
        { value: "\u{1F471}\u{1F3FD}", desc: "person: medium skin tone, blond hair" },
        { value: "\u{1F471}\u{1F3FE}", desc: "person: medium-dark skin tone, blond hair" },
        { value: "\u{1F471}\u{1F3FF}", desc: "person: dark skin tone, blond hair" },
    ]
};
const olderPerson = {
    value: "\u{1F9D3}", desc: "older person", alt: [
        { value: "\u{1F9D3}\u{1F3FB}", desc: "older person: light skin tone" },
        { value: "\u{1F9D3}\u{1F3FC}", desc: "older person: medium-light skin tone" },
        { value: "\u{1F9D3}\u{1F3FD}", desc: "older person: medium skin tone" },
        { value: "\u{1F9D3}\u{1F3FE}", desc: "older person: medium-dark skin tone" },
        { value: "\u{1F9D3}\u{1F3FF}", desc: "older person: dark skin tone" },
    ]
};
const personGesturingNo = {
    value: "\u{1F645}", desc: "person gesturing NO", alt: [
        { value: "\u{1F645}\u{1F3FB}", desc: "person gesturing NO: light skin tone" },
        { value: "\u{1F645}\u{1F3FC}", desc: "person gesturing NO: medium-light skin tone" },
        { value: "\u{1F645}\u{1F3FD}", desc: "person gesturing NO: medium skin tone" },
        { value: "\u{1F645}\u{1F3FE}", desc: "person gesturing NO: medium-dark skin tone" },
        { value: "\u{1F645}\u{1F3FF}", desc: "person gesturing NO: dark skin tone" },
    ]
};
const manGesturingNo = {
    value: "\u{1F645}\u{200D}\u{2642}\u{FE0F}", desc: "man gesturing NO", alt: [
        { value: "\u{1F645}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man gesturing NO: light skin tone" },
        { value: "\u{1F645}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man gesturing NO: medium-light skin tone" },
        { value: "\u{1F645}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man gesturing NO: medium skin tone" },
        { value: "\u{1F645}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man gesturing NO: medium-dark skin tone" },
        { value: "\u{1F645}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man gesturing NO: dark skin tone" },
    ]
};
const womanGesturingNo = {
    value: "\u{1F645}\u{200D}\u{2640}\u{FE0F}", desc: "woman gesturing NO", alt: [
        { value: "\u{1F645}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman gesturing NO: light skin tone" },
        { value: "\u{1F645}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman gesturing NO: medium-light skin tone" },
        { value: "\u{1F645}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman gesturing NO: medium skin tone" },
        { value: "\u{1F645}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman gesturing NO: medium-dark skin tone" },
        { value: "\u{1F645}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman gesturing NO: dark skin tone" },
    ]
};
const man = {
    value: "\u{1F468}", desc: "man", alt: [
        { value: "\u{1F468}\u{1F3FB}", desc: "man: light skin tone" },
        { value: "\u{1F468}\u{1F3FC}", desc: "man: medium-light skin tone" },
        { value: "\u{1F468}\u{1F3FD}", desc: "man: medium skin tone" },
        { value: "\u{1F468}\u{1F3FE}", desc: "man: medium-dark skin tone" },
        { value: "\u{1F468}\u{1F3FF}", desc: "man: dark skin tone" },
    ]
};
const blondMan = {
    value: "\u{1F471}\u{200D}\u{2642}\u{FE0F}", desc: "man: blond hair", alt: [
        { value: "\u{1F471}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man: light skin tone, blond hair" },
        { value: "\u{1F471}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man: medium-light skin tone, blond hair" },
        { value: "\u{1F471}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man: medium skin tone, blond hair" },
        { value: "\u{1F471}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man: medium-dark skin tone, blond hair" },
        { value: "\u{1F471}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man: dark skin tone, blond hair" },
    ]
};
const redHairedMan = {
    value: "\u{1F468}\u{200D}\u{1F9B0}", desc: "man: red hair", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{1F9B0}", desc: "man: light skin tone, red hair" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{1F9B0}", desc: "man: medium-light skin tone, red hair" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{1F9B0}", desc: "man: medium skin tone, red hair" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{1F9B0}", desc: "man: medium-dark skin tone, red hair" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{1F9B0}", desc: "man: dark skin tone, red hair" },
    ]
};
const curlyHairedMan = {
    value: "\u{1F468}\u{200D}\u{1F9B1}", desc: "man: curly hair", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{1F9B1}", desc: "man: light skin tone, curly hair" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{1F9B1}", desc: "man: medium-light skin tone, curly hair" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{1F9B1}", desc: "man: medium skin tone, curly hair" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{1F9B1}", desc: "man: medium-dark skin tone, curly hair" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{1F9B1}", desc: "man: dark skin tone, curly hair" },
    ]
};
const whiteHairedMan = {
    value: "\u{1F468}\u{200D}\u{1F9B3}", desc: "man: white hair", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{1F9B3}", desc: "man: light skin tone, white hair" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{1F9B3}", desc: "man: medium-light skin tone, white hair" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{1F9B3}", desc: "man: medium skin tone, white hair" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{1F9B3}", desc: "man: medium-dark skin tone, white hair" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{1F9B3}", desc: "man: dark skin tone, white hair" },
    ]
};
const baldMan = {
    value: "\u{1F468}\u{200D}\u{1F9B2}", desc: "man: bald", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{1F9B2}", desc: "man: light skin tone, bald" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{1F9B2}", desc: "man: medium-light skin tone, bald" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{1F9B2}", desc: "man: medium skin tone, bald" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{1F9B2}", desc: "man: medium-dark skin tone, bald" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{1F9B2}", desc: "man: dark skin tone, bald" },
    ]
};
const beardedMan = {
    value: "\u{1F9D4}", desc: "man: beard", alt: [
        { value: "\u{1F9D4}\u{1F3FB}", desc: "man: light skin tone, beard" },
        { value: "\u{1F9D4}\u{1F3FC}", desc: "man: medium-light skin tone, beard" },
        { value: "\u{1F9D4}\u{1F3FD}", desc: "man: medium skin tone, beard" },
        { value: "\u{1F9D4}\u{1F3FE}", desc: "man: medium-dark skin tone, beard" },
        { value: "\u{1F9D4}\u{1F3FF}", desc: "man: dark skin tone, beard" },
    ]
};
const oldMan = {
    value: "\u{1F474}", desc: "old man", alt: [
        { value: "\u{1F474}\u{1F3FB}", desc: "old man: light skin tone" },
        { value: "\u{1F474}\u{1F3FC}", desc: "old man: medium-light skin tone" },
        { value: "\u{1F474}\u{1F3FD}", desc: "old man: medium skin tone" },
        { value: "\u{1F474}\u{1F3FE}", desc: "old man: medium-dark skin tone" },
        { value: "\u{1F474}\u{1F3FF}", desc: "old man: dark skin tone" },
    ]
};
const woman = {
    value: "\u{1F469}", desc: "woman", alt: [
        { value: "\u{1F469}\u{1F3FB}", desc: "woman: light skin tone" },
        { value: "\u{1F469}\u{1F3FC}", desc: "woman: medium-light skin tone" },
        { value: "\u{1F469}\u{1F3FD}", desc: "woman: medium skin tone" },
        { value: "\u{1F469}\u{1F3FE}", desc: "woman: medium-dark skin tone" },
        { value: "\u{1F469}\u{1F3FF}", desc: "woman: dark skin tone" },
    ]
};
const blondWoman = {
    value: "\u{1F471}\u{200D}\u{2640}\u{FE0F}", desc: "woman: blond hair", alt: [
        { value: "\u{1F471}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman: light skin tone, blond hair" },
        { value: "\u{1F471}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman: medium-light skin tone, blond hair" },
        { value: "\u{1F471}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman: medium skin tone, blond hair" },
        { value: "\u{1F471}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman: medium-dark skin tone, blond hair" },
        { value: "\u{1F471}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman: dark skin tone, blond hair" },
    ]
};
const redHairedWoman = {
    value: "\u{1F469}\u{200D}\u{1F9B0}", desc: "woman: red hair", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{1F9B0}", desc: "woman: light skin tone, red hair" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{1F9B0}", desc: "woman: medium-light skin tone, red hair" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{1F9B0}", desc: "woman: medium skin tone, red hair" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{1F9B0}", desc: "woman: medium-dark skin tone, red hair" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{1F9B0}", desc: "woman: dark skin tone, red hair" },
    ]
};
const curlyHairedWoman = {
    value: "\u{1F469}\u{200D}\u{1F9B1}", desc: "woman: curly hair", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{1F9B1}", desc: "woman: light skin tone, curly hair" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{1F9B1}", desc: "woman: medium-light skin tone, curly hair" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{1F9B1}", desc: "woman: medium skin tone, curly hair" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{1F9B1}", desc: "woman: medium-dark skin tone, curly hair" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{1F9B1}", desc: "woman: dark skin tone, curly hair" },
    ]
};
const whiteHairedWoman = {
    value: "\u{1F469}\u{200D}\u{1F9B3}", desc: "woman: white hair", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{1F9B3}", desc: "woman: light skin tone, white hair" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{1F9B3}", desc: "woman: medium-light skin tone, white hair" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{1F9B3}", desc: "woman: medium skin tone, white hair" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{1F9B3}", desc: "woman: medium-dark skin tone, white hair" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{1F9B3}", desc: "woman: dark skin tone, white hair" },
    ]
};
const baldWoman = {
    value: "\u{1F469}\u{200D}\u{1F9B2}", desc: "woman: bald", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{1F9B2}", desc: "woman: light skin tone, bald" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{1F9B2}", desc: "woman: medium-light skin tone, bald" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{1F9B2}", desc: "woman: medium skin tone, bald" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{1F9B2}", desc: "woman: medium-dark skin tone, bald" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{1F9B2}", desc: "woman: dark skin tone, bald" },
    ]
};
const oldWoman = {
    value: "\u{1F475}", desc: "old woman", alt: [
        { value: "\u{1F475}\u{1F3FB}", desc: "old woman: light skin tone" },
        { value: "\u{1F475}\u{1F3FC}", desc: "old woman: medium-light skin tone" },
        { value: "\u{1F475}\u{1F3FD}", desc: "old woman: medium skin tone" },
        { value: "\u{1F475}\u{1F3FE}", desc: "old woman: medium-dark skin tone" },
        { value: "\u{1F475}\u{1F3FF}", desc: "old woman: dark skin tone" }
    ]
};
const personGesturingOK = {
    value: "\u{1F646}", desc: "person gesturing OK", alt: [
        { value: "\u{1F646}\u{1F3FB}", desc: "person gesturing OK: light skin tone" },
        { value: "\u{1F646}\u{1F3FC}", desc: "person gesturing OK: medium-light skin tone" },
        { value: "\u{1F646}\u{1F3FD}", desc: "person gesturing OK: medium skin tone" },
        { value: "\u{1F646}\u{1F3FE}", desc: "person gesturing OK: medium-dark skin tone" },
        { value: "\u{1F646}\u{1F3FF}", desc: "person gesturing OK: dark skin tone" },
    ]
};
const manGesturingOK = {
    value: "\u{1F646}\u{200D}\u{2642}\u{FE0F}", desc: "man gesturing OK", alt: [
        { value: "\u{1F646}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man gesturing OK: light skin tone" },
        { value: "\u{1F646}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man gesturing OK: medium-light skin tone" },
        { value: "\u{1F646}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man gesturing OK: medium skin tone" },
        { value: "\u{1F646}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man gesturing OK: medium-dark skin tone" },
        { value: "\u{1F646}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man gesturing OK: dark skin tone" },
    ]
};
const womanGesturingOK = {
    value: "\u{1F646}\u{200D}\u{2640}\u{FE0F}", desc: "woman gesturing OK", alt: [
        { value: "\u{1F646}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman gesturing OK: light skin tone" },
        { value: "\u{1F646}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman gesturing OK: medium-light skin tone" },
        { value: "\u{1F646}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman gesturing OK: medium skin tone" },
        { value: "\u{1F646}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman gesturing OK: medium-dark skin tone" },
        { value: "\u{1F646}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman gesturing OK: dark skin tone" },
    ]
};
const personTippingHand = {
    value: "\u{1F481}", desc: "person tipping hand", alt: [
        { value: "\u{1F481}\u{1F3FB}", desc: "person tipping hand: light skin tone" },
        { value: "\u{1F481}\u{1F3FC}", desc: "person tipping hand: medium-light skin tone" },
        { value: "\u{1F481}\u{1F3FD}", desc: "person tipping hand: medium skin tone" },
        { value: "\u{1F481}\u{1F3FE}", desc: "person tipping hand: medium-dark skin tone" },
        { value: "\u{1F481}\u{1F3FF}", desc: "person tipping hand: dark skin tone" },
    ]
};
const manTippingHand = {
    value: "\u{1F481}\u{200D}\u{2642}\u{FE0F}", desc: "man tipping hand", alt: [
        { value: "\u{1F481}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man tipping hand: light skin tone" },
        { value: "\u{1F481}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man tipping hand: medium-light skin tone" },
        { value: "\u{1F481}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man tipping hand: medium skin tone" },
        { value: "\u{1F481}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man tipping hand: medium-dark skin tone" },
        { value: "\u{1F481}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man tipping hand: dark skin tone" },
    ]
};
const womanTippingHand = {
    value: "\u{1F481}\u{200D}\u{2640}\u{FE0F}", desc: "woman tipping hand", alt: [
        { value: "\u{1F481}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman tipping hand: light skin tone" },
        { value: "\u{1F481}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman tipping hand: medium-light skin tone" },
        { value: "\u{1F481}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman tipping hand: medium skin tone" },
        { value: "\u{1F481}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman tipping hand: medium-dark skin tone" },
        { value: "\u{1F481}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman tipping hand: dark skin tone" },
    ]
};
const personRaisingHand = {
    value: "\u{1F64B}", desc: "person raising hand", alt: [
        { value: "\u{1F64B}\u{1F3FB}", desc: "person raising hand: light skin tone" },
        { value: "\u{1F64B}\u{1F3FC}", desc: "person raising hand: medium-light skin tone" },
        { value: "\u{1F64B}\u{1F3FD}", desc: "person raising hand: medium skin tone" },
        { value: "\u{1F64B}\u{1F3FE}", desc: "person raising hand: medium-dark skin tone" },
        { value: "\u{1F64B}\u{1F3FF}", desc: "person raising hand: dark skin tone" },
    ]
};
const manRaisingHand = {
    value: "\u{1F64B}\u{200D}\u{2642}\u{FE0F}", desc: "man raising hand", alt: [
        { value: "\u{1F64B}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man raising hand: light skin tone" },
        { value: "\u{1F64B}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man raising hand: medium-light skin tone" },
        { value: "\u{1F64B}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man raising hand: medium skin tone" },
        { value: "\u{1F64B}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man raising hand: medium-dark skin tone" },
        { value: "\u{1F64B}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man raising hand: dark skin tone" },
    ]
};
const womanRaisingHand = {
    value: "\u{1F64B}\u{200D}\u{2640}\u{FE0F}", desc: "woman raising hand", alt: [
        { value: "\u{1F64B}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman raising hand: light skin tone" },
        { value: "\u{1F64B}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman raising hand: medium-light skin tone" },
        { value: "\u{1F64B}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman raising hand: medium skin tone" },
        { value: "\u{1F64B}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman raising hand: medium-dark skin tone" },
        { value: "\u{1F64B}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman raising hand: dark skin tone" },
    ]
};
const deafPerson = {
    value: "\u{1F9CF}", desc: "deaf person", alt: [
        { value: "\u{1F9CF}\u{1F3FB}", desc: "deaf person: light skin tone" },
        { value: "\u{1F9CF}\u{1F3FC}", desc: "deaf person: medium-light skin tone" },
        { value: "\u{1F9CF}\u{1F3FD}", desc: "deaf person: medium skin tone" },
        { value: "\u{1F9CF}\u{1F3FE}", desc: "deaf person: medium-dark skin tone" },
        { value: "\u{1F9CF}\u{1F3FF}", desc: "deaf person: dark skin tone" },
    ]
};
const deafMan = {
    value: "\u{1F9CF}\u{200D}\u{2642}\u{FE0F}", desc: "deaf man", alt: [
        { value: "\u{1F9CF}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "deaf man: light skin tone" },
        { value: "\u{1F9CF}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "deaf man: medium-light skin tone" },
        { value: "\u{1F9CF}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "deaf man: medium skin tone" },
        { value: "\u{1F9CF}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "deaf man: medium-dark skin tone" },
        { value: "\u{1F9CF}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "deaf man: dark skin tone" },
    ]
};
const deafWoman = {
    value: "\u{1F9CF}\u{200D}\u{2640}\u{FE0F}", desc: "deaf woman", alt: [
        { value: "\u{1F9CF}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "deaf woman: light skin tone" },
        { value: "\u{1F9CF}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "deaf woman: medium-light skin tone" },
        { value: "\u{1F9CF}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "deaf woman: medium skin tone" },
        { value: "\u{1F9CF}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "deaf woman: medium-dark skin tone" },
        { value: "\u{1F9CF}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "deaf woman: dark skin tone" },
    ]
};
const personBowing = {
    value: "\u{1F647}", desc: "person bowing", alt: [
        { value: "\u{1F647}\u{1F3FB}", desc: "person bowing: light skin tone" },
        { value: "\u{1F647}\u{1F3FC}", desc: "person bowing: medium-light skin tone" },
        { value: "\u{1F647}\u{1F3FD}", desc: "person bowing: medium skin tone" },
        { value: "\u{1F647}\u{1F3FE}", desc: "person bowing: medium-dark skin tone" },
        { value: "\u{1F647}\u{1F3FF}", desc: "person bowing: dark skin tone" },
    ]
};
const manBowing = {
    value: "\u{1F647}\u{200D}\u{2642}\u{FE0F}", desc: "man bowing", alt: [
        { value: "\u{1F647}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man bowing: light skin tone" },
        { value: "\u{1F647}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man bowing: medium-light skin tone" },
        { value: "\u{1F647}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man bowing: medium skin tone" },
        { value: "\u{1F647}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man bowing: medium-dark skin tone" },
        { value: "\u{1F647}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man bowing: dark skin tone" },
    ]
};
const womanBowing = {
    value: "\u{1F647}\u{200D}\u{2640}\u{FE0F}", desc: "woman bowing", alt: [
        { value: "\u{1F647}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman bowing: light skin tone" },
        { value: "\u{1F647}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman bowing: medium-light skin tone" },
        { value: "\u{1F647}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman bowing: medium skin tone" },
        { value: "\u{1F647}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman bowing: medium-dark skin tone" },
        { value: "\u{1F647}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman bowing: dark skin tone" },
    ]
};
const personFacePalming = {
    value: "\u{1F926}", desc: "person facepalming", alt: [
        { value: "\u{1F926}\u{1F3FB}", desc: "person facepalming: light skin tone" },
        { value: "\u{1F926}\u{1F3FC}", desc: "person facepalming: medium-light skin tone" },
        { value: "\u{1F926}\u{1F3FD}", desc: "person facepalming: medium skin tone" },
        { value: "\u{1F926}\u{1F3FE}", desc: "person facepalming: medium-dark skin tone" },
        { value: "\u{1F926}\u{1F3FF}", desc: "person facepalming: dark skin tone" },
    ]
};
const manFacePalming = {
    value: "\u{1F926}\u{200D}\u{2642}\u{FE0F}", desc: "man facepalming", alt: [
        { value: "\u{1F926}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man facepalming: light skin tone" },
        { value: "\u{1F926}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man facepalming: medium-light skin tone" },
        { value: "\u{1F926}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man facepalming: medium skin tone" },
        { value: "\u{1F926}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man facepalming: medium-dark skin tone" },
        { value: "\u{1F926}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man facepalming: dark skin tone" },
    ]
};
const womanFacePalming = {
    value: "\u{1F926}\u{200D}\u{2640}\u{FE0F}", desc: "woman facepalming", alt: [
        { value: "\u{1F926}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman facepalming: light skin tone" },
        { value: "\u{1F926}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman facepalming: medium-light skin tone" },
        { value: "\u{1F926}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman facepalming: medium skin tone" },
        { value: "\u{1F926}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman facepalming: medium-dark skin tone" },
        { value: "\u{1F926}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman facepalming: dark skin tone" },
    ]
};
const personShrugging = {
    value: "\u{1F937}", desc: "person shrugging", alt: [
        { value: "\u{1F937}\u{1F3FB}", desc: "person shrugging: light skin tone" },
        { value: "\u{1F937}\u{1F3FC}", desc: "person shrugging: medium-light skin tone" },
        { value: "\u{1F937}\u{1F3FD}", desc: "person shrugging: medium skin tone" },
        { value: "\u{1F937}\u{1F3FE}", desc: "person shrugging: medium-dark skin tone" },
        { value: "\u{1F937}\u{1F3FF}", desc: "person shrugging: dark skin tone" },
    ]
};
const manShrugging = {
    value: "\u{1F937}\u{200D}\u{2642}\u{FE0F}", desc: "man shrugging", alt: [
        { value: "\u{1F937}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man shrugging: light skin tone" },
        { value: "\u{1F937}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man shrugging: medium-light skin tone" },
        { value: "\u{1F937}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man shrugging: medium skin tone" },
        { value: "\u{1F937}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man shrugging: medium-dark skin tone" },
        { value: "\u{1F937}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man shrugging: dark skin tone" },
    ]
};
const womanShrugging = {
    value: "\u{1F937}\u{200D}\u{2640}\u{FE0F}", desc: "woman shrugging", alt: [
        { value: "\u{1F937}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman shrugging: light skin tone" },
        { value: "\u{1F937}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman shrugging: medium-light skin tone" },
        { value: "\u{1F937}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman shrugging: medium skin tone" },
        { value: "\u{1F937}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman shrugging: medium-dark skin tone" },
        { value: "\u{1F937}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman shrugging: dark skin tone" },
    ]
};
const gestures = [
    {
        value: "\u{1F64D}", desc: "person frowning", alt: [
            personFrowning,
            manFrowning,
            womanFrowning,
        ]
    },
    {
        value: "\u{1F64E}", desc: "person pouting", alt: [
            personPouting,
            manPouting,
            womanPouting,
        ]
    },
    {
        value: "\u{1F645}", desc: "person gesturing NO", alt: [
            personGesturingNo,
            manGesturingNo,
            womanGesturingNo,
        ]
    },
    {
        value: "\u{1F646}", desc: "person gesturing OK", alt: [
            personGesturingOK,
            manGesturingOK,
            womanGesturingOK,
        ]
    },
    {
        value: "\u{1F481}", desc: "person tipping hand", alt: [
            personTippingHand,
            manTippingHand,
            womanTippingHand,
        ]
    },
    {
        value: "\u{1F64B}", desc: "person raising hand", alt: [
            personRaisingHand,
            manRaisingHand,
            womanRaisingHand,
        ]
    },
    {
        value: "\u{1F9CF}", desc: "deaf person", alt: [
            deafPerson,
            deafMan,
            deafWoman,
        ]
    },
    {
        value: "\u{1F647}", desc: "person bowing", alt: [
            personBowing,
            manBowing,
            womanBowing,
        ]
    },
    {
        value: "\u{1F926}", desc: "person facepalming", alt: [
            personFacePalming,
            manFacePalming,
            womanFacePalming,
        ]
    },
    {
        value: "\u{1F937}", desc: "person shrugging", alt: [
            personShrugging,
            manShrugging,
            womanShrugging,
        ]
    }
];
const manHealthWorker = {
    value: "\u{1F468}\u{200D}\u{2695}\u{FE0F}", desc: "man health worker", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{2695}\u{FE0F}", desc: "man health worker: light skin tone" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{2695}\u{FE0F}", desc: "man health worker: medium-light skin tone" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{2695}\u{FE0F}", desc: "man health worker: medium skin tone" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{2695}\u{FE0F}", desc: "man health worker: medium-dark skin tone" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{2695}\u{FE0F}", desc: "man health worker: dark skin tone" },
    ]
};
const womanHealthWorker = {
    value: "\u{1F469}\u{200D}\u{2695}\u{FE0F}", desc: "woman health worker", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{2695}\u{FE0F}", desc: "woman health worker: light skin tone" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{2695}\u{FE0F}", desc: "woman health worker: medium-light skin tone" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{2695}\u{FE0F}", desc: "woman health worker: medium skin tone" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{2695}\u{FE0F}", desc: "woman health worker: medium-dark skin tone" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{2695}\u{FE0F}", desc: "woman health worker: dark skin tone" },
    ]
};
const manStudent = {
    value: "\u{1F468}\u{200D}\u{1F393}", desc: "man student", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{1F393}", desc: "man student: light skin tone" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{1F393}", desc: "man student: medium-light skin tone" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{1F393}", desc: "man student: medium skin tone" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{1F393}", desc: "man student: medium-dark skin tone" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{1F393}", desc: "man student: dark skin tone" },
    ]
};
const womanStudent = {
    value: "\u{1F469}\u{200D}\u{1F393}", desc: "woman student", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{1F393}", desc: "woman student: light skin tone" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{1F393}", desc: "woman student: medium-light skin tone" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{1F393}", desc: "woman student: medium skin tone" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{1F393}", desc: "woman student: medium-dark skin tone" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{1F393}", desc: "woman student: dark skin tone" },
    ]
};
const manTeacher = {
    value: "\u{1F468}\u{200D}\u{1F3EB}", desc: "man teacher", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{1F3EB}", desc: "man teacher: light skin tone" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{1F3EB}", desc: "man teacher: medium-light skin tone" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{1F3EB}", desc: "man teacher: medium skin tone" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{1F3EB}", desc: "man teacher: medium-dark skin tone" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{1F3EB}", desc: "man teacher: dark skin tone" },
    ]
};
const womanTeacher = {
    value: "\u{1F469}\u{200D}\u{1F3EB}", desc: "woman teacher", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{1F3EB}", desc: "woman teacher: light skin tone" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{1F3EB}", desc: "woman teacher: medium-light skin tone" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{1F3EB}", desc: "woman teacher: medium skin tone" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{1F3EB}", desc: "woman teacher: medium-dark skin tone" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{1F3EB}", desc: "woman teacher: dark skin tone" },
    ]
};
const manJudge = {
    value: "\u{1F468}\u{200D}\u{2696}\u{FE0F}", desc: "man judge", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{2696}\u{FE0F}", desc: "man judge: light skin tone" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{2696}\u{FE0F}", desc: "man judge: medium-light skin tone" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{2696}\u{FE0F}", desc: "man judge: medium skin tone" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{2696}\u{FE0F}", desc: "man judge: medium-dark skin tone" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{2696}\u{FE0F}", desc: "man judge: dark skin tone" },
    ]
};
const womanJudge = {
    value: "\u{1F469}\u{200D}\u{2696}\u{FE0F}", desc: "woman judge", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{2696}\u{FE0F}", desc: "woman judge: light skin tone" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{2696}\u{FE0F}", desc: "woman judge: medium-light skin tone" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{2696}\u{FE0F}", desc: "woman judge: medium skin tone" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{2696}\u{FE0F}", desc: "woman judge: medium-dark skin tone" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{2696}\u{FE0F}", desc: "woman judge: dark skin tone" },
    ]
};
const manFarmer = {
    value: "\u{1F468}\u{200D}\u{1F33E}", desc: "man farmer", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{1F33E}", desc: "man farmer: light skin tone" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{1F33E}", desc: "man farmer: medium-light skin tone" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{1F33E}", desc: "man farmer: medium skin tone" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{1F33E}", desc: "man farmer: medium-dark skin tone" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{1F33E}", desc: "man farmer: dark skin tone" },
    ]
};
const womanFarmer = {
    value: "\u{1F469}\u{200D}\u{1F33E}", desc: "woman farmer", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{1F33E}", desc: "woman farmer: light skin tone" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{1F33E}", desc: "woman farmer: medium-light skin tone" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{1F33E}", desc: "woman farmer: medium skin tone" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{1F33E}", desc: "woman farmer: medium-dark skin tone" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{1F33E}", desc: "woman farmer: dark skin tone" },
    ]
};
const manCook = {
    value: "\u{1F468}\u{200D}\u{1F373}", desc: "man cook", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{1F373}", desc: "man cook: light skin tone" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{1F373}", desc: "man cook: medium-light skin tone" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{1F373}", desc: "man cook: medium skin tone" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{1F373}", desc: "man cook: medium-dark skin tone" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{1F373}", desc: "man cook: dark skin tone" },
    ]
};
const womanCook = {
    value: "\u{1F469}\u{200D}\u{1F373}", desc: "woman cook", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{1F373}", desc: "woman cook: light skin tone" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{1F373}", desc: "woman cook: medium-light skin tone" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{1F373}", desc: "woman cook: medium skin tone" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{1F373}", desc: "woman cook: medium-dark skin tone" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{1F373}", desc: "woman cook: dark skin tone" },
    ]
};
const manMechanic = {
    value: "\u{1F468}\u{200D}\u{1F527}", desc: "man mechanic", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{1F527}", desc: "man mechanic: light skin tone" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{1F527}", desc: "man mechanic: medium-light skin tone" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{1F527}", desc: "man mechanic: medium skin tone" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{1F527}", desc: "man mechanic: medium-dark skin tone" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{1F527}", desc: "man mechanic: dark skin tone" },
    ]
};
const womanMechanic = {
    value: "\u{1F469}\u{200D}\u{1F527}", desc: "woman mechanic", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{1F527}", desc: "woman mechanic: light skin tone" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{1F527}", desc: "woman mechanic: medium-light skin tone" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{1F527}", desc: "woman mechanic: medium skin tone" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{1F527}", desc: "woman mechanic: medium-dark skin tone" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{1F527}", desc: "woman mechanic: dark skin tone" },
    ]
};
const manFactoryWorker = {
    value: "\u{1F468}\u{200D}\u{1F3ED}", desc: "man factory worker", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{1F3ED}", desc: "man factory worker: light skin tone" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{1F3ED}", desc: "man factory worker: medium-light skin tone" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{1F3ED}", desc: "man factory worker: medium skin tone" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{1F3ED}", desc: "man factory worker: medium-dark skin tone" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{1F3ED}", desc: "man factory worker: dark skin tone" },
    ]
};
const womanFactoryWorker = {
    value: "\u{1F469}\u{200D}\u{1F3ED}", desc: "woman factory worker", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{1F3ED}", desc: "woman factory worker: light skin tone" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{1F3ED}", desc: "woman factory worker: medium-light skin tone" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{1F3ED}", desc: "woman factory worker: medium skin tone" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{1F3ED}", desc: "woman factory worker: medium-dark skin tone" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{1F3ED}", desc: "woman factory worker: dark skin tone" },
    ]
};
const manOfficeWorker = {
    value: "\u{1F468}\u{200D}\u{1F4BC}", desc: "man office worker", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{1F4BC}", desc: "man office worker: light skin tone" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{1F4BC}", desc: "man office worker: medium-light skin tone" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{1F4BC}", desc: "man office worker: medium skin tone" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{1F4BC}", desc: "man office worker: medium-dark skin tone" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{1F4BC}", desc: "man office worker: dark skin tone" },
    ]
};
const womanOfficeWorker = {
    value: "\u{1F469}\u{200D}\u{1F4BC}", desc: "woman office worker", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{1F4BC}", desc: "woman office worker: light skin tone" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{1F4BC}", desc: "woman office worker: medium-light skin tone" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{1F4BC}", desc: "woman office worker: medium skin tone" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{1F4BC}", desc: "woman office worker: medium-dark skin tone" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{1F4BC}", desc: "woman office worker: dark skin tone" },
    ]
};
const prince = {
    value: "\u{1F934}", desc: "prince", alt: [
        { value: "\u{1F934}\u{1F3FB}", desc: "prince: light skin tone" },
        { value: "\u{1F934}\u{1F3FC}", desc: "prince: medium-light skin tone" },
        { value: "\u{1F934}\u{1F3FD}", desc: "prince: medium skin tone" },
        { value: "\u{1F934}\u{1F3FE}", desc: "prince: medium-dark skin tone" },
        { value: "\u{1F934}\u{1F3FF}", desc: "prince: dark skin tone" },
    ]
};
const princess = {
    value: "\u{1F478}", desc: "princess", alt: [
        { value: "\u{1F478}\u{1F3FB}", desc: "princess: light skin tone" },
        { value: "\u{1F478}\u{1F3FC}", desc: "princess: medium-light skin tone" },
        { value: "\u{1F478}\u{1F3FD}", desc: "princess: medium skin tone" },
        { value: "\u{1F478}\u{1F3FE}", desc: "princess: medium-dark skin tone" },
        { value: "\u{1F478}\u{1F3FF}", desc: "princess: dark skin tone" },
    ]
};
const constructionWorker = {
    value: "\u{1F477}", desc: "construction worker", alt: [
        { value: "\u{1F477}\u{1F3FB}", desc: "construction worker: light skin tone" },
        { value: "\u{1F477}\u{1F3FC}", desc: "construction worker: medium-light skin tone" },
        { value: "\u{1F477}\u{1F3FD}", desc: "construction worker: medium skin tone" },
        { value: "\u{1F477}\u{1F3FE}", desc: "construction worker: medium-dark skin tone" },
        { value: "\u{1F477}\u{1F3FF}", desc: "construction worker: dark skin tone" },
    ]
};
const manConstructionWorker = {
    value: "\u{1F477}\u{200D}\u{2642}\u{FE0F}", desc: "man construction worker", alt: [
        { value: "\u{1F477}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man construction worker: light skin tone" },
        { value: "\u{1F477}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man construction worker: medium-light skin tone" },
        { value: "\u{1F477}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man construction worker: medium skin tone" },
        { value: "\u{1F477}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man construction worker: medium-dark skin tone" },
        { value: "\u{1F477}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man construction worker: dark skin tone" },
    ]
};
const womanConstructionWorker = {
    value: "\u{1F477}\u{200D}\u{2640}\u{FE0F}", desc: "woman construction worker", alt: [
        { value: "\u{1F477}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman construction worker: light skin tone" },
        { value: "\u{1F477}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman construction worker: medium-light skin tone" },
        { value: "\u{1F477}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman construction worker: medium skin tone" },
        { value: "\u{1F477}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman construction worker: medium-dark skin tone" },
        { value: "\u{1F477}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman construction worker: dark skin tone" },
    ]
};
const guard = {
    value: "\u{1F482}", desc: "guard", alt: [
        { value: "\u{1F482}\u{1F3FB}", desc: "guard: light skin tone" },
        { value: "\u{1F482}\u{1F3FC}", desc: "guard: medium-light skin tone" },
        { value: "\u{1F482}\u{1F3FD}", desc: "guard: medium skin tone" },
        { value: "\u{1F482}\u{1F3FE}", desc: "guard: medium-dark skin tone" },
        { value: "\u{1F482}\u{1F3FF}", desc: "guard: dark skin tone" },
    ]
};
const manGuard = {
    value: "\u{1F482}\u{200D}\u{2642}\u{FE0F}", desc: "man guard", alt: [
        { value: "\u{1F482}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man guard: light skin tone" },
        { value: "\u{1F482}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man guard: medium-light skin tone" },
        { value: "\u{1F482}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man guard: medium skin tone" },
        { value: "\u{1F482}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man guard: medium-dark skin tone" },
        { value: "\u{1F482}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man guard: dark skin tone" },
    ]
};
const womanGuard = {
    value: "\u{1F482}\u{200D}\u{2640}\u{FE0F}", desc: "woman guard", alt: [
        { value: "\u{1F482}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman guard: light skin tone" },
        { value: "\u{1F482}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman guard: medium-light skin tone" },
        { value: "\u{1F482}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman guard: medium skin tone" },
        { value: "\u{1F482}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman guard: medium-dark skin tone" },
        { value: "\u{1F482}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman guard: dark skin tone" },
    ]
};
const spy = {
    value: "\u{1F575}\u{FE0F}", desc: "spy", alt: [
        { value: "\u{1F575}\u{1F3FB}", desc: "spy: light skin tone" },
        { value: "\u{1F575}\u{1F3FC}", desc: "spy: medium-light skin tone" },
        { value: "\u{1F575}\u{1F3FD}", desc: "spy: medium skin tone" },
        { value: "\u{1F575}\u{1F3FE}", desc: "spy: medium-dark skin tone" },
        { value: "\u{1F575}\u{1F3FF}", desc: "spy: dark skin tone" },
    ]
};
const manSpy = {
    value: "\u{1F575}\u{FE0F}\u{200D}\u{2642}\u{FE0F}", desc: "man spy", alt: [
        { value: "\u{1F575}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man spy: light skin tone" },
        { value: "\u{1F575}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man spy: medium-light skin tone" },
        { value: "\u{1F575}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man spy: medium skin tone" },
        { value: "\u{1F575}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man spy: medium-dark skin tone" },
        { value: "\u{1F575}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man spy: dark skin tone" },
    ]
};
const womanSpy = {
    value: "\u{1F575}\u{FE0F}\u{200D}\u{2640}\u{FE0F}", desc: "woman spy", alt: [
        { value: "\u{1F575}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman spy: light skin tone" },
        { value: "\u{1F575}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman spy: medium-light skin tone" },
        { value: "\u{1F575}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman spy: medium skin tone" },
        { value: "\u{1F575}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman spy: medium-dark skin tone" },
        { value: "\u{1F575}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman spy: dark skin tone" },
    ]
};
const manPoliceOfficer = {
    value: "\u{1F46E}\u{200D}\u{2642}\u{FE0F}", desc: "man police officer", alt: [
        { value: "\u{1F46E}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man police officer: light skin tone" },
        { value: "\u{1F46E}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man police officer: medium-light skin tone" },
        { value: "\u{1F46E}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man police officer: medium skin tone" },
        { value: "\u{1F46E}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man police officer: medium-dark skin tone" },
        { value: "\u{1F46E}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man police officer: dark skin tone" },
    ]
};
const womanPoliceOfficer = {
    value: "\u{1F46E}\u{200D}\u{2640}\u{FE0F}", desc: "woman police officer", alt: [
        { value: "\u{1F46E}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman police officer: light skin tone" },
        { value: "\u{1F46E}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman police officer: medium-light skin tone" },
        { value: "\u{1F46E}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman police officer: medium skin tone" },
        { value: "\u{1F46E}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman police officer: medium-dark skin tone" },
        { value: "\u{1F46E}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman police officer: dark skin tone" },
    ]
};
const manFirefighter = {
    value: "\u{1F468}\u{200D}\u{1F692}", desc: "man firefighter", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{1F692}", desc: "man firefighter: light skin tone" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{1F692}", desc: "man firefighter: medium-light skin tone" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{1F692}", desc: "man firefighter: medium skin tone" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{1F692}", desc: "man firefighter: medium-dark skin tone" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{1F692}", desc: "man firefighter: dark skin tone" },
    ]
};
const womanFirefighter = {
    value: "\u{1F469}\u{200D}\u{1F692}", desc: "woman firefighter", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{1F692}", desc: "woman firefighter: light skin tone" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{1F692}", desc: "woman firefighter: medium-light skin tone" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{1F692}", desc: "woman firefighter: medium skin tone" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{1F692}", desc: "woman firefighter: medium-dark skin tone" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{1F692}", desc: "woman firefighter: dark skin tone" },
    ]
};
const manAstronaut = {
    value: "\u{1F468}\u{200D}\u{1F680}", desc: "man astronaut", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{1F680}", desc: "man astronaut: light skin tone" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{1F680}", desc: "man astronaut: medium-light skin tone" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{1F680}", desc: "man astronaut: medium skin tone" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{1F680}", desc: "man astronaut: medium-dark skin tone" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{1F680}", desc: "man astronaut: dark skin tone" },
    ]
};
const womanAstronaut = {
    value: "\u{1F469}\u{200D}\u{1F680}", desc: "woman astronaut", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{1F680}", desc: "woman astronaut: light skin tone" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{1F680}", desc: "woman astronaut: medium-light skin tone" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{1F680}", desc: "woman astronaut: medium skin tone" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{1F680}", desc: "woman astronaut: medium-dark skin tone" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{1F680}", desc: "woman astronaut: dark skin tone" },
    ]
};
const manPilot = {
    value: "\u{1F468}\u{200D}\u{2708}\u{FE0F}", desc: "man pilot", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{2708}\u{FE0F}", desc: "man pilot: light skin tone" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{2708}\u{FE0F}", desc: "man pilot: medium-light skin tone" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{2708}\u{FE0F}", desc: "man pilot: medium skin tone" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{2708}\u{FE0F}", desc: "man pilot: medium-dark skin tone" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{2708}\u{FE0F}", desc: "man pilot: dark skin tone" },
    ]
};
const womanPilot = {
    value: "\u{1F469}\u{200D}\u{2708}\u{FE0F}", desc: "woman pilot", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{2708}\u{FE0F}", desc: "woman pilot: light skin tone" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{2708}\u{FE0F}", desc: "woman pilot: medium-light skin tone" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{2708}\u{FE0F}", desc: "woman pilot: medium skin tone" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{2708}\u{FE0F}", desc: "woman pilot: medium-dark skin tone" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{2708}\u{FE0F}", desc: "woman pilot: dark skin tone" },
    ]
};
const manArtist = {
    value: "\u{1F468}\u{200D}\u{1F3A8}", desc: "man artist", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{1F3A8}", desc: "man artist: light skin tone" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{1F3A8}", desc: "man artist: medium-light skin tone" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{1F3A8}", desc: "man artist: medium skin tone" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{1F3A8}", desc: "man artist: medium-dark skin tone" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{1F3A8}", desc: "man artist: dark skin tone" },
    ]
};
const womanArtist = {
    value: "\u{1F469}\u{200D}\u{1F3A8}", desc: "woman artist", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{1F3A8}", desc: "woman artist: light skin tone" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{1F3A8}", desc: "woman artist: medium-light skin tone" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{1F3A8}", desc: "woman artist: medium skin tone" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{1F3A8}", desc: "woman artist: medium-dark skin tone" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{1F3A8}", desc: "woman artist: dark skin tone" },
    ]
};
const manSinger = {
    value: "\u{1F468}\u{200D}\u{1F3A4}", desc: "man singer", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{1F3A4}", desc: "man singer: light skin tone" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{1F3A4}", desc: "man singer: medium-light skin tone" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{1F3A4}", desc: "man singer: medium skin tone" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{1F3A4}", desc: "man singer: medium-dark skin tone" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{1F3A4}", desc: "man singer: dark skin tone" },
    ]
};
const womanSinger = {
    value: "\u{1F469}\u{200D}\u{1F3A4}", desc: "woman singer", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{1F3A4}", desc: "woman singer: light skin tone" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{1F3A4}", desc: "woman singer: medium-light skin tone" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{1F3A4}", desc: "woman singer: medium skin tone" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{1F3A4}", desc: "woman singer: medium-dark skin tone" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{1F3A4}", desc: "woman singer: dark skin tone" },
    ]
};
const manTechnologist = {
    value: "\u{1F468}\u{200D}\u{1F4BB}", desc: "man technologist", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{1F4BB}", desc: "man technologist: light skin tone" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{1F4BB}", desc: "man technologist: medium-light skin tone" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{1F4BB}", desc: "man technologist: medium skin tone" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{1F4BB}", desc: "man technologist: medium-dark skin tone" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{1F4BB}", desc: "man technologist: dark skin tone" },
    ]
};
const womanTechnologist = {
    value: "\u{1F469}\u{200D}\u{1F4BB}", desc: "woman technologist", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{1F4BB}", desc: "woman technologist: light skin tone" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{1F4BB}", desc: "woman technologist: medium-light skin tone" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{1F4BB}", desc: "woman technologist: medium skin tone" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{1F4BB}", desc: "woman technologist: medium-dark skin tone" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{1F4BB}", desc: "woman technologist: dark skin tone" },
    ]
};
const manScientist = {
    value: "\u{1F468}\u{200D}\u{1F52C}", desc: "man scientist", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{1F52C}", desc: "man scientist: light skin tone" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{1F52C}", desc: "man scientist: medium-light skin tone" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{1F52C}", desc: "man scientist: medium skin tone" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{1F52C}", desc: "man scientist: medium-dark skin tone" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{1F52C}", desc: "man scientist: dark skin tone" },
    ]
};
const womanScientist = {
    value: "\u{1F469}\u{200D}\u{1F52C}", desc: "woman scientist", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{1F52C}", desc: "woman scientist: light skin tone" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{1F52C}", desc: "woman scientist: medium-light skin tone" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{1F52C}", desc: "woman scientist: medium skin tone" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{1F52C}", desc: "woman scientist: medium-dark skin tone" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{1F52C}", desc: "woman scientist: dark skin tone" },
    ]
};
const roles = [
    {
        value: "\u{2695}\u{FE0F}", desc: "health worker", alt: [
            manHealthWorker,
            womanHealthWorker,
        ]
    },
    {
        value: "\u{1F393}", desc: "student", alt: [
            manStudent,
            womanStudent,
        ]
    },
    {
        value: "\u{1F3EB}", desc: "teacher", alt: [
            manTeacher,
            womanTeacher,
        ]
    },
    {
        value: "\u{2696}\u{FE0F}", desc: "judge", alt: [
            manJudge,
            womanJudge,
        ]
    },
    {
        value: "\u{1F33E}", desc: "farmer", alt: [
            manFarmer,
            womanFarmer,
        ]
    },
    {
        value: "\u{1F373}", desc: "cook", alt: [
            manCook,
            womanCook,
        ]
    },
    {
        value: "\u{1F527}", desc: "mechanic", alt: [
            manMechanic,
            womanMechanic,
        ]
    },
    {
        value: "\u{1F3ED}", desc: "factory worker", alt: [
            manFactoryWorker,
            womanFactoryWorker,
        ]
    },
    {
        value: "\u{1F4BC}", desc: "office worker", alt: [
            manOfficeWorker,
            womanOfficeWorker,
        ]
    },
    {
        value: "\u{1F52C}", desc: "scientist", alt: [
            manScientist,
            womanScientist,
        ]
    },
    {
        value: "\u{1F4BB}", desc: "technologist", alt: [
            manTechnologist,
            womanTechnologist,
        ]
    },
    {
        value: "\u{1F3A4}", desc: "singer", alt: [
            manSinger,
            womanSinger,
        ]
    },
    {
        value: "\u{1F3A8}", desc: "artist", alt: [
            manArtist,
            womanArtist,
        ]
    },
    {
        value: "\u{2708}\u{FE0F}", desc: "pilot", alt: [
            manPilot,
            womanPilot,
        ]
    },
    {
        value: "\u{1F680}", desc: "astronaut", alt: [
            manAstronaut,
            womanAstronaut,
        ]
    },
    {
        value: "\u{1F692}", desc: "firefighter", alt: [
            manFirefighter,
            womanFirefighter,
        ]
    },
    {
        value: "\u{1F575}\u{FE0F}", desc: "spy", alt: [
            spy,
            manSpy,
            womanSpy,
        ]
    },
    {
        value: "\u{1F482}", desc: "guard", alt: [
            guard,
            manGuard,
            womanGuard,
        ]
    },
    {
        value: "\u{1F477}", desc: "construction worker", alt: [
            constructionWorker,
            manConstructionWorker,
            womanConstructionWorker,
        ]
    },
    {
        value: "\u{1F934}", desc: "royalty", alt: [
            prince,
            princess,
        ]
    }
];
const personWearingTurban = {
    value: "\u{1F473}", desc: "person wearing turban", alt: [
        { value: "\u{1F473}\u{1F3FB}", desc: "person wearing turban: light skin tone" },
        { value: "\u{1F473}\u{1F3FC}", desc: "person wearing turban: medium-light skin tone" },
        { value: "\u{1F473}\u{1F3FD}", desc: "person wearing turban: medium skin tone" },
        { value: "\u{1F473}\u{1F3FE}", desc: "person wearing turban: medium-dark skin tone" },
        { value: "\u{1F473}\u{1F3FF}", desc: "person wearing turban: dark skin tone" },
    ]
};
const manWearingTurban = {
    value: "\u{1F473}\u{200D}\u{2642}\u{FE0F}", desc: "man wearing turban", alt: [
        { value: "\u{1F473}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man wearing turban: light skin tone" },
        { value: "\u{1F473}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man wearing turban: medium-light skin tone" },
        { value: "\u{1F473}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man wearing turban: medium skin tone" },
        { value: "\u{1F473}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man wearing turban: medium-dark skin tone" },
        { value: "\u{1F473}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man wearing turban: dark skin tone" },
    ]
};
const womanWearingTurban = {
    value: "\u{1F473}\u{200D}\u{2640}\u{FE0F}", desc: "woman wearing turban", alt: [
        { value: "\u{1F473}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman wearing turban: light skin tone" },
        { value: "\u{1F473}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman wearing turban: medium-light skin tone" },
        { value: "\u{1F473}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman wearing turban: medium skin tone" },
        { value: "\u{1F473}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman wearing turban: medium-dark skin tone" },
        { value: "\u{1F473}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman wearing turban: dark skin tone" },
    ]
};
const manWithChineseCap = {
    value: "\u{1F472}", desc: "man with Chinese cap", alt: [
        { value: "\u{1F472}\u{1F3FB}", desc: "man with Chinese cap: light skin tone" },
        { value: "\u{1F472}\u{1F3FC}", desc: "man with Chinese cap: medium-light skin tone" },
        { value: "\u{1F472}\u{1F3FD}", desc: "man with Chinese cap: medium skin tone" },
        { value: "\u{1F472}\u{1F3FE}", desc: "man with Chinese cap: medium-dark skin tone" },
        { value: "\u{1F472}\u{1F3FF}", desc: "man with Chinese cap: dark skin tone" },
    ]
};
const womanWithHeadscarf = {
    value: "\u{1F9D5}", desc: "woman with headscarf", alt: [
        { value: "\u{1F9D5}\u{1F3FB}", desc: "woman with headscarf: light skin tone" },
        { value: "\u{1F9D5}\u{1F3FC}", desc: "woman with headscarf: medium-light skin tone" },
        { value: "\u{1F9D5}\u{1F3FD}", desc: "woman with headscarf: medium skin tone" },
        { value: "\u{1F9D5}\u{1F3FE}", desc: "woman with headscarf: medium-dark skin tone" },
        { value: "\u{1F9D5}\u{1F3FF}", desc: "woman with headscarf: dark skin tone" },
    ]
};
const manInTuxedo = {
    value: "\u{1F935}", desc: "man in tuxedo", alt: [
        { value: "\u{1F935}\u{1F3FB}", desc: "man in tuxedo: light skin tone" },
        { value: "\u{1F935}\u{1F3FC}", desc: "man in tuxedo: medium-light skin tone" },
        { value: "\u{1F935}\u{1F3FD}", desc: "man in tuxedo: medium skin tone" },
        { value: "\u{1F935}\u{1F3FE}", desc: "man in tuxedo: medium-dark skin tone" },
        { value: "\u{1F935}\u{1F3FF}", desc: "man in tuxedo: dark skin tone" },
    ]
};
const brideWithVeil = {
    value: "\u{1F470}", desc: "bride with veil", alt: [
        { value: "\u{1F470}\u{1F3FB}", desc: "bride with veil: light skin tone" },
        { value: "\u{1F470}\u{1F3FC}", desc: "bride with veil: medium-light skin tone" },
        { value: "\u{1F470}\u{1F3FD}", desc: "bride with veil: medium skin tone" },
        { value: "\u{1F470}\u{1F3FE}", desc: "bride with veil: medium-dark skin tone" },
        { value: "\u{1F470}\u{1F3FF}", desc: "bride with veil: dark skin tone" },
    ]
};
const pregnantWoman = {
    value: "\u{1F930}", desc: "pregnant woman", alt: [
        { value: "\u{1F930}\u{1F3FB}", desc: "pregnant woman: light skin tone" },
        { value: "\u{1F930}\u{1F3FC}", desc: "pregnant woman: medium-light skin tone" },
        { value: "\u{1F930}\u{1F3FD}", desc: "pregnant woman: medium skin tone" },
        { value: "\u{1F930}\u{1F3FE}", desc: "pregnant woman: medium-dark skin tone" },
        { value: "\u{1F930}\u{1F3FF}", desc: "pregnant woman: dark skin tone" },
    ]
};
const breastFeeding = {
    value: "\u{1F931}", desc: "breast-feeding", alt: [
        { value: "\u{1F931}\u{1F3FB}", desc: "breast-feeding: light skin tone" },
        { value: "\u{1F931}\u{1F3FC}", desc: "breast-feeding: medium-light skin tone" },
        { value: "\u{1F931}\u{1F3FD}", desc: "breast-feeding: medium skin tone" },
        { value: "\u{1F931}\u{1F3FE}", desc: "breast-feeding: medium-dark skin tone" },
        { value: "\u{1F931}\u{1F3FF}", desc: "breast-feeding: dark skin tone" },
    ]
};
const otherPeople = [
    {
        value: "\u{1F473}", desc: "person wearing turban", alt: [
            personWearingTurban,
            manWearingTurban,
            womanWearingTurban,
        ]
    },
    manWithChineseCap,
    womanWithHeadscarf,
    manInTuxedo,
    brideWithVeil,
    pregnantWoman,
    breastFeeding
];
const babyAngel = {
    value: "\u{1F47C}", desc: "baby angel", alt: [
        { value: "\u{1F47C}\u{1F3FB}", desc: "baby angel: light skin tone" },
        { value: "\u{1F47C}\u{1F3FC}", desc: "baby angel: medium-light skin tone" },
        { value: "\u{1F47C}\u{1F3FD}", desc: "baby angel: medium skin tone" },
        { value: "\u{1F47C}\u{1F3FE}", desc: "baby angel: medium-dark skin tone" },
        { value: "\u{1F47C}\u{1F3FF}", desc: "baby angel: dark skin tone" },
    ]
};
const santaClaus = {
    value: "\u{1F385}", desc: "Santa Claus", alt: [
        { value: "\u{1F385}\u{1F3FB}", desc: "Santa Claus: light skin tone" },
        { value: "\u{1F385}\u{1F3FC}", desc: "Santa Claus: medium-light skin tone" },
        { value: "\u{1F385}\u{1F3FD}", desc: "Santa Claus: medium skin tone" },
        { value: "\u{1F385}\u{1F3FE}", desc: "Santa Claus: medium-dark skin tone" },
        { value: "\u{1F385}\u{1F3FF}", desc: "Santa Claus: dark skin tone" },
    ]
};
const mrsClaus = {
    value: "\u{1F936}", desc: "Mrs. Claus", alt: [
        { value: "\u{1F936}\u{1F3FB}", desc: "Mrs. Claus: light skin tone" },
        { value: "\u{1F936}\u{1F3FC}", desc: "Mrs. Claus: medium-light skin tone" },
        { value: "\u{1F936}\u{1F3FD}", desc: "Mrs. Claus: medium skin tone" },
        { value: "\u{1F936}\u{1F3FE}", desc: "Mrs. Claus: medium-dark skin tone" },
        { value: "\u{1F936}\u{1F3FF}", desc: "Mrs. Claus: dark skin tone" },
    ]
};
const superhero = {
    value: "\u{1F9B8}", desc: "superhero", alt: [
        { value: "\u{1F9B8}\u{1F3FB}", desc: "superhero: light skin tone" },
        { value: "\u{1F9B8}\u{1F3FC}", desc: "superhero: medium-light skin tone" },
        { value: "\u{1F9B8}\u{1F3FD}", desc: "superhero: medium skin tone" },
        { value: "\u{1F9B8}\u{1F3FE}", desc: "superhero: medium-dark skin tone" },
        { value: "\u{1F9B8}\u{1F3FF}", desc: "superhero: dark skin tone" },
    ]
};
const manSuperhero = {
    value: "\u{1F9B8}\u{200D}\u{2642}\u{FE0F}", desc: "man superhero", alt: [
        { value: "\u{1F9B8}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man superhero: light skin tone" },
        { value: "\u{1F9B8}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man superhero: medium-light skin tone" },
        { value: "\u{1F9B8}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man superhero: medium skin tone" },
        { value: "\u{1F9B8}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man superhero: medium-dark skin tone" },
        { value: "\u{1F9B8}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man superhero: dark skin tone" },
    ]
};
const womanSuperhero = {
    value: "\u{1F9B8}\u{200D}\u{2640}\u{FE0F}", desc: "woman superhero", alt: [
        { value: "\u{1F9B8}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman superhero: light skin tone" },
        { value: "\u{1F9B8}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman superhero: medium-light skin tone" },
        { value: "\u{1F9B8}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman superhero: medium skin tone" },
        { value: "\u{1F9B8}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman superhero: medium-dark skin tone" },
        { value: "\u{1F9B8}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman superhero: dark skin tone" },
    ]
};
const supervillain = {
    value: "\u{1F9B9}", desc: "supervillain", alt: [
        { value: "\u{1F9B9}\u{1F3FB}", desc: "supervillain: light skin tone" },
        { value: "\u{1F9B9}\u{1F3FC}", desc: "supervillain: medium-light skin tone" },
        { value: "\u{1F9B9}\u{1F3FD}", desc: "supervillain: medium skin tone" },
        { value: "\u{1F9B9}\u{1F3FE}", desc: "supervillain: medium-dark skin tone" },
        { value: "\u{1F9B9}\u{1F3FF}", desc: "supervillain: dark skin tone" },
    ]
};
const manSupervillain = {
    value: "\u{1F9B9}\u{200D}\u{2642}\u{FE0F}", desc: "man supervillain", alt: [
        { value: "\u{1F9B9}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man supervillain: light skin tone" },
        { value: "\u{1F9B9}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man supervillain: medium-light skin tone" },
        { value: "\u{1F9B9}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man supervillain: medium skin tone" },
        { value: "\u{1F9B9}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man supervillain: medium-dark skin tone" },
        { value: "\u{1F9B9}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man supervillain: dark skin tone" },
    ]
};
const womanSupervillain = {
    value: "\u{1F9B9}\u{200D}\u{2640}\u{FE0F}", desc: "woman supervillain", alt: [
        { value: "\u{1F9B9}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman supervillain: light skin tone" },
        { value: "\u{1F9B9}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman supervillain: medium-light skin tone" },
        { value: "\u{1F9B9}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman supervillain: medium skin tone" },
        { value: "\u{1F9B9}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman supervillain: medium-dark skin tone" },
        { value: "\u{1F9B9}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman supervillain: dark skin tone" },
    ]
};
const mage = {
    value: "\u{1F9D9}", desc: "mage", alt: [
        { value: "\u{1F9D9}\u{1F3FB}", desc: "mage: light skin tone" },
        { value: "\u{1F9D9}\u{1F3FC}", desc: "mage: medium-light skin tone" },
        { value: "\u{1F9D9}\u{1F3FD}", desc: "mage: medium skin tone" },
        { value: "\u{1F9D9}\u{1F3FE}", desc: "mage: medium-dark skin tone" },
        { value: "\u{1F9D9}\u{1F3FF}", desc: "mage: dark skin tone" },
    ]
};
const manMage = {
    value: "\u{1F9D9}\u{200D}\u{2642}\u{FE0F}", desc: "man mage", alt: [
        { value: "\u{1F9D9}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man mage: light skin tone" },
        { value: "\u{1F9D9}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man mage: medium-light skin tone" },
        { value: "\u{1F9D9}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man mage: medium skin tone" },
        { value: "\u{1F9D9}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man mage: medium-dark skin tone" },
        { value: "\u{1F9D9}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man mage: dark skin tone" },
    ]
};
const womanMage = {
    value: "\u{1F9D9}\u{200D}\u{2640}\u{FE0F}", desc: "woman mage", alt: [
        { value: "\u{1F9D9}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman mage: light skin tone" },
        { value: "\u{1F9D9}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman mage: medium-light skin tone" },
        { value: "\u{1F9D9}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman mage: medium skin tone" },
        { value: "\u{1F9D9}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman mage: medium-dark skin tone" },
        { value: "\u{1F9D9}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman mage: dark skin tone" },
    ]
};
const fairy = {
    value: "\u{1F9DA}", desc: "fairy", alt: [
        { value: "\u{1F9DA}\u{1F3FB}", desc: "fairy: light skin tone" },
        { value: "\u{1F9DA}\u{1F3FC}", desc: "fairy: medium-light skin tone" },
        { value: "\u{1F9DA}\u{1F3FD}", desc: "fairy: medium skin tone" },
        { value: "\u{1F9DA}\u{1F3FE}", desc: "fairy: medium-dark skin tone" },
        { value: "\u{1F9DA}\u{1F3FF}", desc: "fairy: dark skin tone" },
    ]
};
const manFairy = {
    value: "\u{1F9DA}\u{200D}\u{2642}\u{FE0F}", desc: "man fairy", alt: [
        { value: "\u{1F9DA}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man fairy: light skin tone" },
        { value: "\u{1F9DA}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man fairy: medium-light skin tone" },
        { value: "\u{1F9DA}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man fairy: medium skin tone" },
        { value: "\u{1F9DA}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man fairy: medium-dark skin tone" },
        { value: "\u{1F9DA}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man fairy: dark skin tone" },
    ]
};
const womanFairy = {
    value: "\u{1F9DA}\u{200D}\u{2640}\u{FE0F}", desc: "woman fairy", alt: [
        { value: "\u{1F9DA}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman fairy: light skin tone" },
        { value: "\u{1F9DA}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman fairy: medium-light skin tone" },
        { value: "\u{1F9DA}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman fairy: medium skin tone" },
        { value: "\u{1F9DA}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman fairy: medium-dark skin tone" },
        { value: "\u{1F9DA}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman fairy: dark skin tone" },
    ]
};
const vampire = {
    value: "\u{1F9DB}", desc: "vampire", alt: [
        { value: "\u{1F9DB}\u{1F3FB}", desc: "vampire: light skin tone" },
        { value: "\u{1F9DB}\u{1F3FC}", desc: "vampire: medium-light skin tone" },
        { value: "\u{1F9DB}\u{1F3FD}", desc: "vampire: medium skin tone" },
        { value: "\u{1F9DB}\u{1F3FE}", desc: "vampire: medium-dark skin tone" },
        { value: "\u{1F9DB}\u{1F3FF}", desc: "vampire: dark skin tone" },
    ]
};
const manVampire = {
    value: "\u{1F9DB}\u{200D}\u{2642}\u{FE0F}", desc: "man vampire", alt: [
        { value: "\u{1F9DB}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man vampire: light skin tone" },
        { value: "\u{1F9DB}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man vampire: medium-light skin tone" },
        { value: "\u{1F9DB}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man vampire: medium skin tone" },
        { value: "\u{1F9DB}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man vampire: medium-dark skin tone" },
        { value: "\u{1F9DB}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man vampire: dark skin tone" },
    ]
};
const womanVampire = {
    value: "\u{1F9DB}\u{200D}\u{2640}\u{FE0F}", desc: "woman vampire", alt: [
        { value: "\u{1F9DB}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman vampire: light skin tone" },
        { value: "\u{1F9DB}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman vampire: medium-light skin tone" },
        { value: "\u{1F9DB}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman vampire: medium skin tone" },
        { value: "\u{1F9DB}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman vampire: medium-dark skin tone" },
        { value: "\u{1F9DB}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman vampire: dark skin tone" },
    ]
};
const merperson = {
    value: "\u{1F9DC}", desc: "merperson", alt: [
        { value: "\u{1F9DC}\u{1F3FB}", desc: "merperson: light skin tone" },
        { value: "\u{1F9DC}\u{1F3FC}", desc: "merperson: medium-light skin tone" },
        { value: "\u{1F9DC}\u{1F3FD}", desc: "merperson: medium skin tone" },
        { value: "\u{1F9DC}\u{1F3FE}", desc: "merperson: medium-dark skin tone" },
        { value: "\u{1F9DC}\u{1F3FF}", desc: "merperson: dark skin tone" },
    ]
};
const merman = {
    value: "\u{1F9DC}\u{200D}\u{2642}\u{FE0F}", desc: "merman", alt: [
        { value: "\u{1F9DC}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "merman: light skin tone" },
        { value: "\u{1F9DC}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "merman: medium-light skin tone" },
        { value: "\u{1F9DC}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "merman: medium skin tone" },
        { value: "\u{1F9DC}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "merman: medium-dark skin tone" },
        { value: "\u{1F9DC}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "merman: dark skin tone" },
    ]
};
const mermaid = {
    value: "\u{1F9DC}\u{200D}\u{2640}\u{FE0F}", desc: "mermaid", alt: [
        { value: "\u{1F9DC}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "mermaid: light skin tone" },
        { value: "\u{1F9DC}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "mermaid: medium-light skin tone" },
        { value: "\u{1F9DC}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "mermaid: medium skin tone" },
        { value: "\u{1F9DC}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "mermaid: medium-dark skin tone" },
        { value: "\u{1F9DC}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "mermaid: dark skin tone" },
    ]
};
const elf = {
    value: "\u{1F9DD}", desc: "elf", alt: [
        { value: "\u{1F9DD}\u{1F3FB}", desc: "elf: light skin tone" },
        { value: "\u{1F9DD}\u{1F3FC}", desc: "elf: medium-light skin tone" },
        { value: "\u{1F9DD}\u{1F3FD}", desc: "elf: medium skin tone" },
        { value: "\u{1F9DD}\u{1F3FE}", desc: "elf: medium-dark skin tone" },
        { value: "\u{1F9DD}\u{1F3FF}", desc: "elf: dark skin tone" },
    ]
};
const manElf = {
    value: "\u{1F9DD}\u{200D}\u{2642}\u{FE0F}", desc: "man elf", alt: [
        { value: "\u{1F9DD}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man elf: light skin tone" },
        { value: "\u{1F9DD}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man elf: medium-light skin tone" },
        { value: "\u{1F9DD}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man elf: medium skin tone" },
        { value: "\u{1F9DD}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man elf: medium-dark skin tone" },
        { value: "\u{1F9DD}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man elf: dark skin tone" },
    ]
};
const womanElf = {
    value: "\u{1F9DD}\u{200D}\u{2640}\u{FE0F}", desc: "woman elf", alt: [
        { value: "\u{1F9DD}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman elf: light skin tone" },
        { value: "\u{1F9DD}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman elf: medium-light skin tone" },
        { value: "\u{1F9DD}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman elf: medium skin tone" },
        { value: "\u{1F9DD}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman elf: medium-dark skin tone" },
        { value: "\u{1F9DD}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman elf: dark skin tone" },
    ]
};
const genie = { value: "\u{1F9DE}", desc: "genie" };
const manGenie = { value: "\u{1F9DE}\u{200D}\u{2642}\u{FE0F}", desc: "man genie" };
const womanGenie = { value: "\u{1F9DE}\u{200D}\u{2640}\u{FE0F}", desc: "woman genie" };
const zombie = { value: "\u{1F9DF}", desc: "zombie" };
const manZombie = { value: "\u{1F9DF}\u{200D}\u{2642}\u{FE0F}", desc: "man zombie" };
const womanZombie = { value: "\u{1F9DF}\u{200D}\u{2640}\u{FE0F}", desc: "woman zombie" };
const fantasy = [
    babyAngel,
    santaClaus,
    mrsClaus,
    {
        value: "\u{1F9B8}", desc: "superhero", alt: [
            superhero,
            manSuperhero,
            womanSuperhero,
        ]
    },
    {
        value: "\u{1F9B9}", desc: "supervillain", alt: [
            supervillain,
            manSupervillain,
            womanSupervillain,
        ]
    },
    {
        value: "\u{1F9D9}", desc: "mage", alt: [
            mage,
            manMage,
            womanMage,
        ]
    },
    {
        value: "\u{1F9DA}", desc: "fairy", alt: [
            fairy,
            manFairy,
            womanFairy,
        ]
    },
    {
        value: "\u{1F9DB}", desc: "vampire", alt: [
            vampire,
            manVampire,
            womanVampire,
        ]
    },
    {
        value: "\u{1F9DC}", desc: "merperson", alt: [
            merperson,
            merman,
            mermaid,
        ]
    },
    {
        value: "\u{1F9DD}", desc: "elf", alt: [
            elf,
            manElf,
            womanElf,
        ]
    },
    {
        value: "\u{1F9DE}", desc: "genie", alt: [
            genie,
            manGenie,
            womanGenie,
        ]
    },
    {
        value: "\u{1F9DF}", desc: "zombie", alt: [
            zombie,
            manZombie,
            womanZombie,
        ]
    }
];

const personGettingMassage = {
    value: "\u{1F486}", desc: "person getting massage", alt: [
        { value: "\u{1F486}\u{1F3FB}", desc: "person getting massage: light skin tone" },
        { value: "\u{1F486}\u{1F3FC}", desc: "person getting massage: medium-light skin tone" },
        { value: "\u{1F486}\u{1F3FD}", desc: "person getting massage: medium skin tone" },
        { value: "\u{1F486}\u{1F3FE}", desc: "person getting massage: medium-dark skin tone" },
        { value: "\u{1F486}\u{1F3FF}", desc: "person getting massage: dark skin tone" },
    ]
};
const manGettingMassage = {
    value: "\u{1F486}\u{200D}\u{2642}\u{FE0F}", desc: "man getting massage", alt: [
        { value: "\u{1F486}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man getting massage: light skin tone" },
        { value: "\u{1F486}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man getting massage: medium-light skin tone" },
        { value: "\u{1F486}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man getting massage: medium skin tone" },
        { value: "\u{1F486}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man getting massage: medium-dark skin tone" },
        { value: "\u{1F486}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man getting massage: dark skin tone" },
    ]
};
const womanGettingMassage = {
    value: "\u{1F486}\u{200D}\u{2640}\u{FE0F}", desc: "woman getting massage", alt: [
        { value: "\u{1F486}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman getting massage: light skin tone" },
        { value: "\u{1F486}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman getting massage: medium-light skin tone" },
        { value: "\u{1F486}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman getting massage: medium skin tone" },
        { value: "\u{1F486}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman getting massage: medium-dark skin tone" },
        { value: "\u{1F486}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman getting massage: dark skin tone" },
    ]
};
const personGettingHaircut = {
    value: "\u{1F487}", desc: "person getting haircut", alt: [
        { value: "\u{1F487}\u{1F3FB}", desc: "person getting haircut: light skin tone" },
        { value: "\u{1F487}\u{1F3FC}", desc: "person getting haircut: medium-light skin tone" },
        { value: "\u{1F487}\u{1F3FD}", desc: "person getting haircut: medium skin tone" },
        { value: "\u{1F487}\u{1F3FE}", desc: "person getting haircut: medium-dark skin tone" },
        { value: "\u{1F487}\u{1F3FF}", desc: "person getting haircut: dark skin tone" },
    ]
};
const manGettingHaircut = {
    value: "\u{1F487}\u{200D}\u{2642}\u{FE0F}", desc: "man getting haircut", alt: [
        { value: "\u{1F487}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man getting haircut: light skin tone" },
        { value: "\u{1F487}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man getting haircut: medium-light skin tone" },
        { value: "\u{1F487}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man getting haircut: medium skin tone" },
        { value: "\u{1F487}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man getting haircut: medium-dark skin tone" },
        { value: "\u{1F487}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man getting haircut: dark skin tone" },
    ]
};
const womanGettingHaircut = {
    value: "\u{1F487}\u{200D}\u{2640}\u{FE0F}", desc: "woman getting haircut", alt: [
        { value: "\u{1F487}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman getting haircut: light skin tone" },
        { value: "\u{1F487}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman getting haircut: medium-light skin tone" },
        { value: "\u{1F487}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman getting haircut: medium skin tone" },
        { value: "\u{1F487}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman getting haircut: medium-dark skin tone" },
        { value: "\u{1F487}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman getting haircut: dark skin tone" },
    ]
};
const personWalking = {
    value: "\u{1F6B6}", desc: "person walking", alt: [
        { value: "\u{1F6B6}\u{1F3FB}", desc: "person walking: light skin tone" },
        { value: "\u{1F6B6}\u{1F3FC}", desc: "person walking: medium-light skin tone" },
        { value: "\u{1F6B6}\u{1F3FD}", desc: "person walking: medium skin tone" },
        { value: "\u{1F6B6}\u{1F3FE}", desc: "person walking: medium-dark skin tone" },
        { value: "\u{1F6B6}\u{1F3FF}", desc: "person walking: dark skin tone" },
    ]
};
const manWalking = {
    value: "\u{1F6B6}\u{200D}\u{2642}\u{FE0F}", desc: "man walking", alt: [
        { value: "\u{1F6B6}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man walking: light skin tone" },
        { value: "\u{1F6B6}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man walking: medium-light skin tone" },
        { value: "\u{1F6B6}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man walking: medium skin tone" },
        { value: "\u{1F6B6}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man walking: medium-dark skin tone" },
        { value: "\u{1F6B6}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man walking: dark skin tone" },
        { value: "\u{1F6B6}\u{200D}\u{2640}\u{FE0F}", desc: "woman walking" },
    ]
};
const womanWalking = {
    value: "\u{1F6B6}\u{200D}\u{2640}", desc: "woman walking", alt: [
        { value: "\u{1F6B6}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman walking: light skin tone" },
        { value: "\u{1F6B6}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman walking: medium-light skin tone" },
        { value: "\u{1F6B6}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman walking: medium skin tone" },
        { value: "\u{1F6B6}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman walking: medium-dark skin tone" },
        { value: "\u{1F6B6}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman walking: dark skin tone" },
    ]
};
const personStanding = {
    value: "\u{1F9CD}", desc: "person standing", alt: [
        { value: "\u{1F9CD}\u{1F3FB}", desc: "person standing: light skin tone" },
        { value: "\u{1F9CD}\u{1F3FC}", desc: "person standing: medium-light skin tone" },
        { value: "\u{1F9CD}\u{1F3FD}", desc: "person standing: medium skin tone" },
        { value: "\u{1F9CD}\u{1F3FE}", desc: "person standing: medium-dark skin tone" },
        { value: "\u{1F9CD}\u{1F3FF}", desc: "person standing: dark skin tone" },
    ]
};
const manStanding = {
    value: "\u{1F9CD}\u{200D}\u{2642}\u{FE0F}", desc: "man standing", alt: [
        { value: "\u{1F9CD}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man standing: light skin tone" },
        { value: "\u{1F9CD}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man standing: medium-light skin tone" },
        { value: "\u{1F9CD}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man standing: medium skin tone" },
        { value: "\u{1F9CD}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man standing: medium-dark skin tone" },
        { value: "\u{1F9CD}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man standing: dark skin tone" },
    ]
};
const womanStanding = {
    value: "\u{1F9CD}\u{200D}\u{2640}\u{FE0F}", desc: "woman standing", alt: [
        { value: "\u{1F9CD}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman standing: light skin tone" },
        { value: "\u{1F9CD}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman standing: medium-light skin tone" },
        { value: "\u{1F9CD}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman standing: medium skin tone" },
        { value: "\u{1F9CD}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman standing: medium-dark skin tone" },
        { value: "\u{1F9CD}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman standing: dark skin tone" },
    ]
};
const personKneeling = {
    value: "\u{1F9CE}", desc: "person kneeling", alt: [
        { value: "\u{1F9CE}\u{1F3FB}", desc: "person kneeling: light skin tone" },
        { value: "\u{1F9CE}\u{1F3FC}", desc: "person kneeling: medium-light skin tone" },
        { value: "\u{1F9CE}\u{1F3FD}", desc: "person kneeling: medium skin tone" },
        { value: "\u{1F9CE}\u{1F3FE}", desc: "person kneeling: medium-dark skin tone" },
        { value: "\u{1F9CE}\u{1F3FF}", desc: "person kneeling: dark skin tone" },
    ]
};
const manKneeling = {
    value: "\u{1F9CE}\u{200D}\u{2642}\u{FE0F}", desc: "man kneeling", alt: [
        { value: "\u{1F9CE}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man kneeling: light skin tone" },
        { value: "\u{1F9CE}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man kneeling: medium-light skin tone" },
        { value: "\u{1F9CE}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man kneeling: medium skin tone" },
        { value: "\u{1F9CE}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man kneeling: medium-dark skin tone" },
        { value: "\u{1F9CE}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man kneeling: dark skin tone" },
    ]
};
const womanKneeling = {
    value: "\u{1F9CE}\u{200D}\u{2640}\u{FE0F}", desc: "woman kneeling", alt: [
        { value: "\u{1F9CE}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman kneeling: light skin tone" },
        { value: "\u{1F9CE}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman kneeling: medium-light skin tone" },
        { value: "\u{1F9CE}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman kneeling: medium skin tone" },
        { value: "\u{1F9CE}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman kneeling: medium-dark skin tone" },
        { value: "\u{1F9CE}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman kneeling: dark skin tone" },
    ]
};
const manWithProbingCane = {
    value: "\u{1F468}\u{200D}\u{1F9AF}", desc: "man with probing cane", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{1F9AF}", desc: "man with probing cane: light skin tone" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{1F9AF}", desc: "man with probing cane: medium-light skin tone" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{1F9AF}", desc: "man with probing cane: medium skin tone" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{1F9AF}", desc: "man with probing cane: medium-dark skin tone" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{1F9AF}", desc: "man with probing cane: dark skin tone" },
    ]
};
const womanWithProbingCane = {
    value: "\u{1F469}\u{200D}\u{1F9AF}", desc: "woman with probing cane", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{1F9AF}", desc: "woman with probing cane: light skin tone" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{1F9AF}", desc: "woman with probing cane: medium-light skin tone" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{1F9AF}", desc: "woman with probing cane: medium skin tone" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{1F9AF}", desc: "woman with probing cane: medium-dark skin tone" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{1F9AF}", desc: "woman with probing cane: dark skin tone" },
    ]
};
const manInMotorizedWheelchair = {
    value: "\u{1F468}\u{200D}\u{1F9BC}", desc: "man in motorized wheelchair", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{1F9BC}", desc: "man in motorized wheelchair: light skin tone" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{1F9BC}", desc: "man in motorized wheelchair: medium-light skin tone" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{1F9BC}", desc: "man in motorized wheelchair: medium skin tone" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{1F9BC}", desc: "man in motorized wheelchair: medium-dark skin tone" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{1F9BC}", desc: "man in motorized wheelchair: dark skin tone" },
    ]
};
const womanInMotorizedWheelchair = {
    value: "\u{1F469}\u{200D}\u{1F9BC}", desc: "woman in motorized wheelchair", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{1F9BC}", desc: "woman in motorized wheelchair: light skin tone" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{1F9BC}", desc: "woman in motorized wheelchair: medium-light skin tone" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{1F9BC}", desc: "woman in motorized wheelchair: medium skin tone" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{1F9BC}", desc: "woman in motorized wheelchair: medium-dark skin tone" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{1F9BC}", desc: "woman in motorized wheelchair: dark skin tone" },
    ]
};
const manInManualWheelchair = {
    value: "\u{1F468}\u{200D}\u{1F9BD}", desc: "man in manual wheelchair", alt: [
        { value: "\u{1F468}\u{1F3FB}\u{200D}\u{1F9BD}", desc: "man in manual wheelchair: light skin tone" },
        { value: "\u{1F468}\u{1F3FC}\u{200D}\u{1F9BD}", desc: "man in manual wheelchair: medium-light skin tone" },
        { value: "\u{1F468}\u{1F3FD}\u{200D}\u{1F9BD}", desc: "man in manual wheelchair: medium skin tone" },
        { value: "\u{1F468}\u{1F3FE}\u{200D}\u{1F9BD}", desc: "man in manual wheelchair: medium-dark skin tone" },
        { value: "\u{1F468}\u{1F3FF}\u{200D}\u{1F9BD}", desc: "man in manual wheelchair: dark skin tone" },
    ]
};
const womanInManualWheelchair = {
    value: "\u{1F469}\u{200D}\u{1F9BD}", desc: "woman in manual wheelchair", alt: [
        { value: "\u{1F469}\u{1F3FB}\u{200D}\u{1F9BD}", desc: "woman in manual wheelchair: light skin tone" },
        { value: "\u{1F469}\u{1F3FC}\u{200D}\u{1F9BD}", desc: "woman in manual wheelchair: medium-light skin tone" },
        { value: "\u{1F469}\u{1F3FD}\u{200D}\u{1F9BD}", desc: "woman in manual wheelchair: medium skin tone" },
        { value: "\u{1F469}\u{1F3FE}\u{200D}\u{1F9BD}", desc: "woman in manual wheelchair: medium-dark skin tone" },
        { value: "\u{1F469}\u{1F3FF}\u{200D}\u{1F9BD}", desc: "woman in manual wheelchair: dark skin tone" },
    ]
};
const personRunning = {
    value: "\u{1F3C3}", desc: "person running", alt: [
        { value: "\u{1F3C3}\u{1F3FB}", desc: "person running: light skin tone" },
        { value: "\u{1F3C3}\u{1F3FC}", desc: "person running: medium-light skin tone" },
        { value: "\u{1F3C3}\u{1F3FD}", desc: "person running: medium skin tone" },
        { value: "\u{1F3C3}\u{1F3FE}", desc: "person running: medium-dark skin tone" },
        { value: "\u{1F3C3}\u{1F3FF}", desc: "person running: dark skin tone" },
    ]
};
const manRunning = {
    value: "\u{1F3C3}\u{200D}\u{2642}\u{FE0F}", desc: "man running", alt: [
        { value: "\u{1F3C3}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man running: light skin tone" },
        { value: "\u{1F3C3}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man running: medium-light skin tone" },
        { value: "\u{1F3C3}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man running: medium skin tone" },
        { value: "\u{1F3C3}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man running: medium-dark skin tone" },
        { value: "\u{1F3C3}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man running: dark skin tone" },
    ]
};
const womanRunning = {
    value: "\u{1F3C3}\u{200D}\u{2640}\u{FE0F}", desc: "woman running", alt: [
        { value: "\u{1F3C3}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman running: light skin tone" },
        { value: "\u{1F3C3}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman running: medium-light skin tone" },
        { value: "\u{1F3C3}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman running: medium skin tone" },
        { value: "\u{1F3C3}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman running: medium-dark skin tone" },
        { value: "\u{1F3C3}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman running: dark skin tone" },
    ]
};
const manDancing = {
    value: "\u{1F57A}", desc: "man dancing", alt: [
        { value: "\u{1F57A}\u{1F3FB}", desc: "man dancing: light skin tone" },
        { value: "\u{1F57A}\u{1F3FC}", desc: "man dancing: medium-light skin tone" },
        { value: "\u{1F57A}\u{1F3FD}", desc: "man dancing: medium skin tone" },
        { value: "\u{1F57A}\u{1F3FE}", desc: "man dancing: medium-dark skin tone" },
        { value: "\u{1F57A}\u{1F3FF}", desc: "man dancing: dark skin tone" },
    ]
};
const womanDancing = {
    value: "\u{1F483}", desc: "woman dancing", alt: [
        { value: "\u{1F483}\u{1F3FB}", desc: "woman dancing: light skin tone" },
        { value: "\u{1F483}\u{1F3FC}", desc: "woman dancing: medium-light skin tone" },
        { value: "\u{1F483}\u{1F3FD}", desc: "woman dancing: medium skin tone" },
        { value: "\u{1F483}\u{1F3FE}", desc: "woman dancing: medium-dark skin tone" },
        { value: "\u{1F483}\u{1F3FF}", desc: "woman dancing: dark skin tone" },
    ]
};
const manInSuitLevitating = {
    value: "\u{1F574}\u{FE0F}", desc: "man in suit levitating", alt: [
        { value: "\u{1F574}\u{1F3FB}", desc: "man in suit levitating: light skin tone" },
        { value: "\u{1F574}\u{1F3FC}", desc: "man in suit levitating: medium-light skin tone" },
        { value: "\u{1F574}\u{1F3FD}", desc: "man in suit levitating: medium skin tone" },
        { value: "\u{1F574}\u{1F3FE}", desc: "man in suit levitating: medium-dark skin tone" },
        { value: "\u{1F574}\u{1F3FF}", desc: "man in suit levitating: dark skin tone" },
    ]
};
const personInSteamyRoom = {
    value: "\u{1F9D6}", desc: "person in steamy room", alt: [
        { value: "\u{1F9D6}\u{1F3FB}", desc: "person in steamy room: light skin tone" },
        { value: "\u{1F9D6}\u{1F3FC}", desc: "person in steamy room: medium-light skin tone" },
        { value: "\u{1F9D6}\u{1F3FD}", desc: "person in steamy room: medium skin tone" },
        { value: "\u{1F9D6}\u{1F3FE}", desc: "person in steamy room: medium-dark skin tone" },
        { value: "\u{1F9D6}\u{1F3FF}", desc: "person in steamy room: dark skin tone" },
    ]
};
const manInSteamyRoom = {
    value: "\u{1F9D6}\u{200D}\u{2642}\u{FE0F}", desc: "man in steamy room", alt: [
        { value: "\u{1F9D6}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man in steamy room: light skin tone" },
        { value: "\u{1F9D6}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man in steamy room: medium-light skin tone" },
        { value: "\u{1F9D6}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man in steamy room: medium skin tone" },
        { value: "\u{1F9D6}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man in steamy room: medium-dark skin tone" },
        { value: "\u{1F9D6}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man in steamy room: dark skin tone" },
    ]
};
const womanInSteamyRoom = {
    value: "\u{1F9D6}\u{200D}\u{2640}\u{FE0F}", desc: "woman in steamy room", alt: [
        { value: "\u{1F9D6}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman in steamy room: light skin tone" },
        { value: "\u{1F9D6}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman in steamy room: medium-light skin tone" },
        { value: "\u{1F9D6}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman in steamy room: medium skin tone" },
        { value: "\u{1F9D6}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman in steamy room: medium-dark skin tone" },
        { value: "\u{1F9D6}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman in steamy room: dark skin tone" },
    ]
};
const activity = [
    {
        value: "\u{1F486}", desc: "person getting massage", alt: [
            personGettingMassage,
            manGettingMassage,
            womanGettingMassage,
        ]
    },
    {
        value: "\u{1F487}", desc: "person getting haircut", alt: [
            personGettingHaircut,
            manGettingHaircut,
            womanGettingHaircut,
        ]
    },
    {
        value: "\u{1F6B6}", desc: "person walking", alt: [
            personWalking,
            manWalking,
            womanWalking,
        ]
    },
    {
        value: "\u{1F9CD}", desc: "person standing", alt: [
            personStanding,
            manStanding,
            womanStanding,
        ]
    },
    {
        value: "\u{1F9CE}", desc: "person kneeling", alt: [
            personKneeling,
            manKneeling,
            womanKneeling,
        ]
    },
    {
        value: "\u{1F9AF}", desc: "probing cane", alt: [
            manWithProbingCane,
            womanWithProbingCane,
        ]
    },
    {
        value: "\u{1F9BC}", desc: "motorized wheelchair", alt: [
            manInMotorizedWheelchair,
            womanInMotorizedWheelchair,
        ]
    },
    {
        value: "\u{1F9BD}", desc: "manual wheelchair", alt: [
            manInManualWheelchair,
            womanInManualWheelchair,
        ]
    },
    {
        value: "\u{1F3C3}", desc: "person running", alt: [
            personRunning,
            manRunning,
            womanRunning,
        ]
    },
    {
        value: "\u{1F57A}", desc: "dancing", alt: [
            manDancing,
            womanDancing,
        ]
    },
    manInSuitLevitating,
    {
        value: "\u{1F9D6}", desc: "person in steamy room", alt: [
            personInSteamyRoom,
            manInSteamyRoom,
            womanInSteamyRoom,
        ]
    },
];

const personClimbing = {
    value: "\u{1F9D7}", desc: "person climbing", alt: [
        { value: "\u{1F9D7}\u{1F3FB}", desc: "person climbing: light skin tone" },
        { value: "\u{1F9D7}\u{1F3FC}", desc: "person climbing: medium-light skin tone" },
        { value: "\u{1F9D7}\u{1F3FD}", desc: "person climbing: medium skin tone" },
        { value: "\u{1F9D7}\u{1F3FE}", desc: "person climbing: medium-dark skin tone" },
        { value: "\u{1F9D7}\u{1F3FF}", desc: "person climbing: dark skin tone" },
    ]
};
const manClimbing = {
    value: "\u{1F9D7}\u{200D}\u{2642}\u{FE0F}", desc: "man climbing", alt: [
        { value: "\u{1F9D7}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man climbing: light skin tone" },
        { value: "\u{1F9D7}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man climbing: medium-light skin tone" },
        { value: "\u{1F9D7}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man climbing: medium skin tone" },
        { value: "\u{1F9D7}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man climbing: medium-dark skin tone" },
        { value: "\u{1F9D7}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man climbing: dark skin tone" },
    ]
};
const womanClimbing = {
    value: "\u{1F9D7}\u{200D}\u{2640}\u{FE0F}", desc: "woman climbing", alt: [
        { value: "\u{1F9D7}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman climbing: light skin tone" },
        { value: "\u{1F9D7}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman climbing: medium-light skin tone" },
        { value: "\u{1F9D7}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman climbing: medium skin tone" },
        { value: "\u{1F9D7}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman climbing: medium-dark skin tone" },
        { value: "\u{1F9D7}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman climbing: dark skin tone" },
    ]
};
const personFencing = { value: "\u{1F93A}", desc: "person fencing" };
const personRacingHorse = {
    value: "\u{1F3C7}", desc: "horse racing", alt: [
        { value: "\u{1F3C7}\u{1F3FB}", desc: "horse racing: light skin tone" },
        { value: "\u{1F3C7}\u{1F3FC}", desc: "horse racing: medium-light skin tone" },
        { value: "\u{1F3C7}\u{1F3FD}", desc: "horse racing: medium skin tone" },
        { value: "\u{1F3C7}\u{1F3FE}", desc: "horse racing: medium-dark skin tone" },
        { value: "\u{1F3C7}\u{1F3FF}", desc: "horse racing: dark skin tone" },
    ]
};
const personSkiing = { value: "\u{26F7}\u{FE0F}", desc: "skier" };
const personSnowboarding = {
    value: "\u{1F3C2}", desc: "snowboarder", alt: [
        { value: "\u{1F3C2}\u{1F3FB}", desc: "snowboarder: light skin tone" },
        { value: "\u{1F3C2}\u{1F3FC}", desc: "snowboarder: medium-light skin tone" },
        { value: "\u{1F3C2}\u{1F3FD}", desc: "snowboarder: medium skin tone" },
        { value: "\u{1F3C2}\u{1F3FE}", desc: "snowboarder: medium-dark skin tone" },
        { value: "\u{1F3C2}\u{1F3FF}", desc: "snowboarder: dark skin tone" },
    ]
};
const personGolfing = {
    value: "\u{1F3CC}\u{FE0F}", desc: "person golfing", alt: [
        { value: "\u{1F3CC}\u{1F3FB}", desc: "person golfing: light skin tone" },
        { value: "\u{1F3CC}\u{1F3FC}", desc: "person golfing: medium-light skin tone" },
        { value: "\u{1F3CC}\u{1F3FD}", desc: "person golfing: medium skin tone" },
        { value: "\u{1F3CC}\u{1F3FE}", desc: "person golfing: medium-dark skin tone" },
        { value: "\u{1F3CC}\u{1F3FF}", desc: "person golfing: dark skin tone" },
    ]
};
const manGolfing = {
    value: "\u{1F3CC}\u{FE0F}\u{200D}\u{2642}\u{FE0F}", desc: "man golfing", alt: [
        { value: "\u{1F3CC}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man golfing: light skin tone" },
        { value: "\u{1F3CC}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man golfing: medium-light skin tone" },
        { value: "\u{1F3CC}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man golfing: medium skin tone" },
        { value: "\u{1F3CC}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man golfing: medium-dark skin tone" },
        { value: "\u{1F3CC}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man golfing: dark skin tone" },
    ]
};
const womanGolfing = {
    value: "\u{1F3CC}\u{FE0F}\u{200D}\u{2640}\u{FE0F}", desc: "woman golfing", alt: [
        { value: "\u{1F3CC}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman golfing: light skin tone" },
        { value: "\u{1F3CC}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman golfing: medium-light skin tone" },
        { value: "\u{1F3CC}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman golfing: medium skin tone" },
        { value: "\u{1F3CC}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman golfing: medium-dark skin tone" },
        { value: "\u{1F3CC}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman golfing: dark skin tone" },
    ]
};
const personBouncingBall = {
    value: "\u{26F9}\u{FE0F}", desc: "person bouncing ball", alt: [
        { value: "\u{26F9}\u{1F3FB}", desc: "person bouncing ball: light skin tone" },
        { value: "\u{26F9}\u{1F3FC}", desc: "person bouncing ball: medium-light skin tone" },
        { value: "\u{26F9}\u{1F3FD}", desc: "person bouncing ball: medium skin tone" },
        { value: "\u{26F9}\u{1F3FE}", desc: "person bouncing ball: medium-dark skin tone" },
        { value: "\u{26F9}\u{1F3FF}", desc: "person bouncing ball: dark skin tone" },
    ]
};
const manBouncingBall = {
    value: "\u{26F9}\u{FE0F}\u{200D}\u{2642}\u{FE0F}", desc: "man bouncing ball", alt: [
        { value: "\u{26F9}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man bouncing ball: light skin tone" },
        { value: "\u{26F9}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man bouncing ball: medium-light skin tone" },
        { value: "\u{26F9}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man bouncing ball: medium skin tone" },
        { value: "\u{26F9}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man bouncing ball: medium-dark skin tone" },
        { value: "\u{26F9}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man bouncing ball: dark skin tone" },
    ]
};
const womanBouncingBall = {
    value: "\u{26F9}\u{FE0F}\u{200D}\u{2640}\u{FE0F}", desc: "woman bouncing ball", alt: [
        { value: "\u{26F9}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman bouncing ball: light skin tone" },
        { value: "\u{26F9}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman bouncing ball: medium-light skin tone" },
        { value: "\u{26F9}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman bouncing ball: medium skin tone" },
        { value: "\u{26F9}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman bouncing ball: medium-dark skin tone" },
        { value: "\u{26F9}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman bouncing ball: dark skin tone" },
    ]
};
const personLiftingWeights = {
    value: "\u{1F3CB}\u{FE0F}", desc: "person lifting weights", alt: [
        { value: "\u{1F3CB}\u{1F3FB}", desc: "person lifting weights: light skin tone" },
        { value: "\u{1F3CB}\u{1F3FC}", desc: "person lifting weights: medium-light skin tone" },
        { value: "\u{1F3CB}\u{1F3FD}", desc: "person lifting weights: medium skin tone" },
        { value: "\u{1F3CB}\u{1F3FE}", desc: "person lifting weights: medium-dark skin tone" },
        { value: "\u{1F3CB}\u{1F3FF}", desc: "person lifting weights: dark skin tone" },
    ]
};
const manLifitingWeights = {
    value: "\u{1F3CB}\u{FE0F}\u{200D}\u{2642}\u{FE0F}", desc: "man lifting weights", alt: [
        { value: "\u{1F3CB}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man lifting weights: light skin tone" },
        { value: "\u{1F3CB}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man lifting weights: medium-light skin tone" },
        { value: "\u{1F3CB}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man lifting weights: medium skin tone" },
        { value: "\u{1F3CB}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man lifting weights: medium-dark skin tone" },
        { value: "\u{1F3CB}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man lifting weights: dark skin tone" },
    ]
};
const womanLiftingWeights = {
    value: "\u{1F3CB}\u{FE0F}\u{200D}\u{2640}\u{FE0F}", desc: "woman lifting weights", alt: [
        { value: "\u{1F3CB}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman lifting weights: light skin tone" },
        { value: "\u{1F3CB}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman lifting weights: medium-light skin tone" },
        { value: "\u{1F3CB}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman lifting weights: medium skin tone" },
        { value: "\u{1F3CB}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman lifting weights: medium-dark skin tone" },
        { value: "\u{1F3CB}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman lifting weights: dark skin tone" },
    ]
};
const personBiking = {
    value: "\u{1F6B4}", desc: "person biking", alt: [
        { value: "\u{1F6B4}\u{1F3FB}", desc: "person biking: light skin tone" },
        { value: "\u{1F6B4}\u{1F3FC}", desc: "person biking: medium-light skin tone" },
        { value: "\u{1F6B4}\u{1F3FD}", desc: "person biking: medium skin tone" },
        { value: "\u{1F6B4}\u{1F3FE}", desc: "person biking: medium-dark skin tone" },
        { value: "\u{1F6B4}\u{1F3FF}", desc: "person biking: dark skin tone" },
    ]
};
const manBiking = {
    value: "\u{1F6B4}\u{200D}\u{2642}\u{FE0F}", desc: "man biking", alt: [
        { value: "\u{1F6B4}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man biking: light skin tone" },
        { value: "\u{1F6B4}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man biking: medium-light skin tone" },
        { value: "\u{1F6B4}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man biking: medium skin tone" },
        { value: "\u{1F6B4}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man biking: medium-dark skin tone" },
        { value: "\u{1F6B4}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man biking: dark skin tone" },
    ]
};
const womanBiking = {
    value: "\u{1F6B4}\u{200D}\u{2640}\u{FE0F}", desc: "woman biking", alt: [
        { value: "\u{1F6B4}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman biking: light skin tone" },
        { value: "\u{1F6B4}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman biking: medium-light skin tone" },
        { value: "\u{1F6B4}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman biking: medium skin tone" },
        { value: "\u{1F6B4}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman biking: medium-dark skin tone" },
        { value: "\u{1F6B4}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman biking: dark skin tone" },
    ]
};
const personMountainBiking = {
    value: "\u{1F6B5}", desc: "person mountain biking", alt: [
        { value: "\u{1F6B5}\u{1F3FB}", desc: "person mountain biking: light skin tone" },
        { value: "\u{1F6B5}\u{1F3FC}", desc: "person mountain biking: medium-light skin tone" },
        { value: "\u{1F6B5}\u{1F3FD}", desc: "person mountain biking: medium skin tone" },
        { value: "\u{1F6B5}\u{1F3FE}", desc: "person mountain biking: medium-dark skin tone" },
        { value: "\u{1F6B5}\u{1F3FF}", desc: "person mountain biking: dark skin tone" },
    ]
};
const manMountainBiking = {
    value: "\u{1F6B5}\u{200D}\u{2642}\u{FE0F}", desc: "man mountain biking", alt: [
        { value: "\u{1F6B5}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man mountain biking: light skin tone" },
        { value: "\u{1F6B5}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man mountain biking: medium-light skin tone" },
        { value: "\u{1F6B5}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man mountain biking: medium skin tone" },
        { value: "\u{1F6B5}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man mountain biking: medium-dark skin tone" },
        { value: "\u{1F6B5}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man mountain biking: dark skin tone" },
    ]
};
const womanMountainBiking = {
    value: "\u{1F6B5}\u{200D}\u{2640}\u{FE0F}", desc: "woman mountain biking", alt: [
        { value: "\u{1F6B5}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman mountain biking: light skin tone" },
        { value: "\u{1F6B5}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman mountain biking: medium-light skin tone" },
        { value: "\u{1F6B5}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman mountain biking: medium skin tone" },
        { value: "\u{1F6B5}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman mountain biking: medium-dark skin tone" },
        { value: "\u{1F6B5}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman mountain biking: dark skin tone" },
    ]
};
const personCartwheeling = {
    value: "\u{1F938}", desc: "person cartwheeling", alt: [
        { value: "\u{1F938}\u{1F3FB}", desc: "person cartwheeling: light skin tone" },
        { value: "\u{1F938}\u{1F3FC}", desc: "person cartwheeling: medium-light skin tone" },
        { value: "\u{1F938}\u{1F3FD}", desc: "person cartwheeling: medium skin tone" },
        { value: "\u{1F938}\u{1F3FE}", desc: "person cartwheeling: medium-dark skin tone" },
        { value: "\u{1F938}\u{1F3FF}", desc: "person cartwheeling: dark skin tone" },
    ]
};
const manCartwheeling = {
    value: "\u{1F938}\u{200D}\u{2642}\u{FE0F}", desc: "man cartwheeling", alt: [
        { value: "\u{1F938}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man cartwheeling: light skin tone" },
        { value: "\u{1F938}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man cartwheeling: medium-light skin tone" },
        { value: "\u{1F938}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man cartwheeling: medium skin tone" },
        { value: "\u{1F938}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man cartwheeling: medium-dark skin tone" },
        { value: "\u{1F938}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man cartwheeling: dark skin tone" },
    ]
};
const womanCartweeling = {
    value: "\u{1F938}\u{200D}\u{2640}\u{FE0F}", desc: "woman cartwheeling", alt: [
        { value: "\u{1F938}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman cartwheeling: light skin tone" },
        { value: "\u{1F938}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman cartwheeling: medium-light skin tone" },
        { value: "\u{1F938}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman cartwheeling: medium skin tone" },
        { value: "\u{1F938}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman cartwheeling: medium-dark skin tone" },
        { value: "\u{1F938}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman cartwheeling: dark skin tone" },
    ]
};
const peopleWrestling = { value: "\u{1F93C}", desc: "people wrestling" };
const menWrestling = { value: "\u{1F93C}\u{200D}\u{2642}\u{FE0F}", desc: "men wrestling" };
const womenWrestling = { value: "\u{1F93C}\u{200D}\u{2640}\u{FE0F}", desc: "women wrestling" };
const personPlayingWaterPolo = {
    value: "\u{1F93D}", desc: "person playing water polo", alt: [
        { value: "\u{1F93D}\u{1F3FB}", desc: "person playing water polo: light skin tone" },
        { value: "\u{1F93D}\u{1F3FC}", desc: "person playing water polo: medium-light skin tone" },
        { value: "\u{1F93D}\u{1F3FD}", desc: "person playing water polo: medium skin tone" },
        { value: "\u{1F93D}\u{1F3FE}", desc: "person playing water polo: medium-dark skin tone" },
        { value: "\u{1F93D}\u{1F3FF}", desc: "person playing water polo: dark skin tone" },
    ]
};
const manPlayingWaterPolo = {
    value: "\u{1F93D}\u{200D}\u{2642}\u{FE0F}", desc: "man playing water polo", alt: [
        { value: "\u{1F93D}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man playing water polo: light skin tone" },
        { value: "\u{1F93D}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man playing water polo: medium-light skin tone" },
        { value: "\u{1F93D}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man playing water polo: medium skin tone" },
        { value: "\u{1F93D}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man playing water polo: medium-dark skin tone" },
        { value: "\u{1F93D}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man playing water polo: dark skin tone" },
    ]
};
const womanPlayingWaterPolo = {
    value: "\u{1F93D}\u{200D}\u{2640}\u{FE0F}", desc: "woman playing water polo", alt: [
        { value: "\u{1F93D}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman playing water polo: light skin tone" },
        { value: "\u{1F93D}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman playing water polo: medium-light skin tone" },
        { value: "\u{1F93D}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman playing water polo: medium skin tone" },
        { value: "\u{1F93D}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman playing water polo: medium-dark skin tone" },
        { value: "\u{1F93D}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman playing water polo: dark skin tone" },
    ]
};
const personPlayingHandball = {
    value: "\u{1F93E}", desc: "person playing handball", alt: [
        { value: "\u{1F93E}\u{1F3FB}", desc: "person playing handball: light skin tone" },
        { value: "\u{1F93E}\u{1F3FC}", desc: "person playing handball: medium-light skin tone" },
        { value: "\u{1F93E}\u{1F3FD}", desc: "person playing handball: medium skin tone" },
        { value: "\u{1F93E}\u{1F3FE}", desc: "person playing handball: medium-dark skin tone" },
        { value: "\u{1F93E}\u{1F3FF}", desc: "person playing handball: dark skin tone" },
    ]
};
const manPlayingHandball = {
    value: "\u{1F93E}\u{200D}\u{2642}\u{FE0F}", desc: "man playing handball", alt: [
        { value: "\u{1F93E}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man playing handball: light skin tone" },
        { value: "\u{1F93E}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man playing handball: medium-light skin tone" },
        { value: "\u{1F93E}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man playing handball: medium skin tone" },
        { value: "\u{1F93E}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man playing handball: medium-dark skin tone" },
        { value: "\u{1F93E}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man playing handball: dark skin tone" },
    ]
};
const womanPlayingHandball = {
    value: "\u{1F93E}\u{200D}\u{2640}\u{FE0F}", desc: "woman playing handball", alt: [
        { value: "\u{1F93E}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman playing handball: light skin tone" },
        { value: "\u{1F93E}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman playing handball: medium-light skin tone" },
        { value: "\u{1F93E}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman playing handball: medium skin tone" },
        { value: "\u{1F93E}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman playing handball: medium-dark skin tone" },
        { value: "\u{1F93E}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman playing handball: dark skin tone" },
    ]
};
const personJuggling = {
    value: "\u{1F939}", desc: "person juggling", alt: [
        { value: "\u{1F939}\u{1F3FB}", desc: "person juggling: light skin tone" },
        { value: "\u{1F939}\u{1F3FC}", desc: "person juggling: medium-light skin tone" },
        { value: "\u{1F939}\u{1F3FD}", desc: "person juggling: medium skin tone" },
        { value: "\u{1F939}\u{1F3FE}", desc: "person juggling: medium-dark skin tone" },
        { value: "\u{1F939}\u{1F3FF}", desc: "person juggling: dark skin tone" },
    ]
};
const manJuggling = {
    value: "\u{1F939}\u{200D}\u{2642}\u{FE0F}", desc: "man juggling", alt: [
        { value: "\u{1F939}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man juggling: light skin tone" },
        { value: "\u{1F939}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man juggling: medium-light skin tone" },
        { value: "\u{1F939}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man juggling: medium skin tone" },
        { value: "\u{1F939}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man juggling: medium-dark skin tone" },
        { value: "\u{1F939}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man juggling: dark skin tone" },
    ]
};
const womanJuggling = {
    value: "\u{1F939}\u{200D}\u{2640}\u{FE0F}", desc: "woman juggling", alt: [
        { value: "\u{1F939}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman juggling: light skin tone" },
        { value: "\u{1F939}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman juggling: medium-light skin tone" },
        { value: "\u{1F939}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman juggling: medium skin tone" },
        { value: "\u{1F939}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman juggling: medium-dark skin tone" },
        { value: "\u{1F939}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman juggling: dark skin tone" },
    ]
};
const sports = [
    {
        value: "\u{1F9D7}", desc: "person climbing", alt: [
            personClimbing,
            manClimbing,
            womanClimbing,
        ]
    },
    personFencing,
    personRacingHorse,
    personSkiing,
    personSnowboarding,
    {
        value: "\u{1F3CC}\u{FE0F}", desc: "person golfing", alt: [
            personGolfing,
            manGolfing,
            womanGolfing,
        ]
    },
    {
        value: "\u{1F3C4}", desc: "person surfing", alt: [
            personSurfing,
            manSurfing,
            womanSurfing,
        ]
    },
    {
        value: "\u{1F6A3}", desc: "person rowing boat", alt: [
            personRowing,
            manRowing,
            womanRowing,
        ]
    },
    {
        value: "\u{1F3CA}", desc: "person swimming", alt: [
            personSwimming,
            manSwimming,
            womanSwimming,
        ]
    },
    {
        value: "\u{26F9}\u{FE0F}", desc: "person bouncing ball", alt: [
            personBouncingBall,
            manBouncingBall,
            womanBouncingBall,
        ]
    },
    {
        value: "\u{1F3CB}\u{FE0F}", desc: "person lifting weights", alt: [
            personLiftingWeights,
            manLifitingWeights,
            womanLiftingWeights,
        ]
    },
    {
        value: "\u{1F6B4}", desc: "person biking", alt: [
            personBiking,
            manBiking,
            womanBiking,
        ]
    },
    {
        value: "\u{1F6B5}", desc: "person mountain biking", alt: [
            personMountainBiking,
            manMountainBiking,
            womanMountainBiking,
        ]
    },
    {
        value: "\u{1F938}", desc: "person cartwheeling", alt: [
            personCartwheeling,
            manCartwheeling,
            womanCartweeling,
        ]
    },
    {
        value: "\u{1F93C}", desc: "people wrestling", alt: [
            peopleWrestling,
            menWrestling,
            womenWrestling,
        ]
    },
    {
        value: "\u{1F93D}", desc: "person playing water polo", alt: [
            personPlayingWaterPolo,
            manPlayingWaterPolo,
            womanPlayingWaterPolo,
        ]
    },
    {
        value: "\u{1F93E}", desc: "person playing handball", alt: [
            personPlayingHandball,
            manPlayingHandball,
            womanPlayingHandball,
        ]
    },
    {
        value: "\u{1F939}", desc: "person juggling", alt: [
            personJuggling,
            manJuggling,
            womanJuggling,
        ]
    }
];
const personInLotusPosition = {
    value: "\u{1F9D8}", desc: "person in lotus position", alt: [
        { value: "\u{1F9D8}\u{1F3FB}", desc: "person in lotus position: light skin tone" },
        { value: "\u{1F9D8}\u{1F3FC}", desc: "person in lotus position: medium-light skin tone" },
        { value: "\u{1F9D8}\u{1F3FD}", desc: "person in lotus position: medium skin tone" },
        { value: "\u{1F9D8}\u{1F3FE}", desc: "person in lotus position: medium-dark skin tone" },
        { value: "\u{1F9D8}\u{1F3FF}", desc: "person in lotus position: dark skin tone" },
    ]
};
const manInLotusPosition = {
    value: "\u{1F9D8}\u{200D}\u{2642}\u{FE0F}", desc: "man in lotus position", alt: [
        { value: "\u{1F9D8}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", desc: "man in lotus position: light skin tone" },
        { value: "\u{1F9D8}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", desc: "man in lotus position: medium-light skin tone" },
        { value: "\u{1F9D8}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", desc: "man in lotus position: medium skin tone" },
        { value: "\u{1F9D8}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", desc: "man in lotus position: medium-dark skin tone" },
        { value: "\u{1F9D8}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", desc: "man in lotus position: dark skin tone" },
    ]
};
const womanInLotusPosition = {
    value: "\u{1F9D8}\u{200D}\u{2640}\u{FE0F}", desc: "woman in lotus position", alt: [
        { value: "\u{1F9D8}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", desc: "woman in lotus position: light skin tone" },
        { value: "\u{1F9D8}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", desc: "woman in lotus position: medium-light skin tone" },
        { value: "\u{1F9D8}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", desc: "woman in lotus position: medium skin tone" },
        { value: "\u{1F9D8}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", desc: "woman in lotus position: medium-dark skin tone" },
        { value: "\u{1F9D8}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", desc: "woman in lotus position: dark skin tone" },
    ]
};
const personTakingBath = {
    value: "\u{1F6C0}", desc: "person taking bath", alt: [
        { value: "\u{1F6C0}\u{1F3FB}", desc: "person taking bath: light skin tone" },
        { value: "\u{1F6C0}\u{1F3FC}", desc: "person taking bath: medium-light skin tone" },
        { value: "\u{1F6C0}\u{1F3FD}", desc: "person taking bath: medium skin tone" },
        { value: "\u{1F6C0}\u{1F3FE}", desc: "person taking bath: medium-dark skin tone" },
        { value: "\u{1F6C0}\u{1F3FF}", desc: "person taking bath: dark skin tone" },
    ]
};
const personInBed = {
    value: "\u{1F6CC}", desc: "person in bed", alt: [
        { value: "\u{1F6CC}\u{1F3FB}", desc: "person in bed: light skin tone" },
        { value: "\u{1F6CC}\u{1F3FC}", desc: "person in bed: medium-light skin tone" },
        { value: "\u{1F6CC}\u{1F3FD}", desc: "person in bed: medium skin tone" },
        { value: "\u{1F6CC}\u{1F3FE}", desc: "person in bed: medium-dark skin tone" },
        { value: "\u{1F6CC}\u{1F3FF}", desc: "person in bed: dark skin tone" },
    ]
};
const personResting = [
    {
        value: "\u{1F9D8}", desc: "person in lotus position", alt: [
            personInLotusPosition,
            manInLotusPosition,
            womanInLotusPosition,
        ]
    },
    personTakingBath,
    personInBed,
];
const people = [
    {
        value: baby.value, desc: "baby", alt: [
            baby,
            babyAngel,
        ]
    },
    {
        value: "\u{1F9D2}", desc: "child", alt: [
            child,
            boy,
            girl,
        ]
    },
    {
        value: "\u{1F9D1}", desc: "person", alt: [
            {
                value: "\u{1F9D1}", desc: "person", alt: [
                    person,
                    blondPerson,
                    olderPerson,
                    personFrowning,
                    personPouting,
                    personGesturingNo,
                    personGesturingOK,
                    personTippingHand,
                    personRaisingHand,
                    deafPerson,
                    personBowing,
                    personFacePalming,
                    personShrugging,
                    spy,
                    guard,
                    constructionWorker,
                    personWearingTurban,
                    superhero,
                    supervillain,
                    mage,
                    fairy,
                    vampire,
                    merperson,
                    elf,
                    genie,
                    zombie,
                    personGettingMassage,
                    personGettingHaircut,
                    personWalking,
                    personStanding,
                    personKneeling,
                    personRunning,
                    personInSteamyRoom,
                    personClimbing,
                    personFencing,
                    personRacingHorse,
                    personSkiing,
                    personSnowboarding,
                    personGolfing,
                    personSurfing,
                    personRowing,
                    personSwimming,
                    personBouncingBall,
                    personLiftingWeights,
                    personBiking,
                    personMountainBiking,
                    personCartwheeling,
                    peopleWrestling,
                    personPlayingWaterPolo,
                    personPlayingHandball,
                    personJuggling,
                    personInLotusPosition,
                    personTakingBath,
                    personInBed,
                ]
            },
            {
                value: "\u{1F468}", desc: "man", alt: [
                    man,
                    blondMan,
                    redHairedMan,
                    curlyHairedMan,
                    whiteHairedMan,
                    baldMan,
                    beardedMan,
                    oldMan,
                    manFrowning,
                    manPouting,
                    manGesturingNo,
                    manGesturingOK,
                    manTippingHand,
                    manRaisingHand,
                    deafMan,
                    manBowing,
                    manFacePalming,
                    manShrugging,
                    manHealthWorker,
                    manStudent,
                    manTeacher,
                    manJudge,
                    manFarmer,
                    manCook,
                    manMechanic,
                    manFactoryWorker,
                    manOfficeWorker,
                    manScientist,
                    manTechnologist,
                    manSinger,
                    manArtist,
                    manPilot,
                    manAstronaut,
                    manFirefighter,
                    manPoliceOfficer,
                    manSpy,
                    manGuard,
                    manConstructionWorker,
                    prince,
                    manWearingTurban,
                    manWithChineseCap,
                    manInTuxedo,
                    santaClaus,
                    manSuperhero,
                    manSupervillain,
                    manMage,
                    manFairy,
                    manVampire,
                    merman,
                    manElf,
                    manGenie,
                    manZombie,
                    manGettingMassage,
                    manGettingHaircut,
                    manWalking,
                    manStanding,
                    manKneeling,
                    manWithProbingCane,
                    manInMotorizedWheelchair,
                    manInManualWheelchair,
                    manRunning,
                    manDancing,
                    manInSuitLevitating,
                    manInSteamyRoom,
                    manClimbing,
                    manGolfing,
                    manSurfing,
                    manRowing,
                    manSwimming,
                    manBouncingBall,
                    manLifitingWeights,
                    manBiking,
                    manMountainBiking,
                    manCartwheeling,
                    menWrestling,
                    manPlayingWaterPolo,
                    manPlayingHandball,
                    manJuggling,
                    manInLotusPosition,
                ]
            },
            {
                value: "\u{1F469}", desc: "woman", alt: [
                    woman,
                    blondWoman,
                    redHairedWoman,
                    curlyHairedWoman,
                    whiteHairedWoman,
                    baldWoman,
                    oldWoman,
                    womanFrowning,
                    womanPouting,
                    womanGesturingNo,
                    womanGesturingOK,
                    womanTippingHand,
                    womanRaisingHand,
                    deafWoman,
                    womanBowing,
                    womanFacePalming,
                    womanShrugging,
                    womanHealthWorker,
                    womanStudent,
                    womanTeacher,
                    womanJudge,
                    womanFarmer,
                    womanCook,
                    womanMechanic,
                    womanFactoryWorker,
                    womanOfficeWorker,
                    womanScientist,
                    womanTechnologist,
                    womanSinger,
                    womanArtist,
                    womanPilot,
                    womanAstronaut,
                    womanFirefighter,
                    womanPoliceOfficer,
                    womanSpy,
                    womanGuard,
                    womanConstructionWorker,
                    princess,
                    womanWearingTurban,
                    womanWithHeadscarf,
                    brideWithVeil,
                    pregnantWoman,
                    breastFeeding,
                    mrsClaus,
                    womanSuperhero,
                    womanSupervillain,
                    womanMage,
                    womanFairy,
                    womanVampire,
                    mermaid,
                    womanElf,
                    womanGenie,
                    womanZombie,
                    womanGettingMassage,
                    womanGettingHaircut,
                    womanWalking,
                    womanStanding,
                    womanKneeling,
                    womanWithProbingCane,
                    womanInMotorizedWheelchair,
                    womanInManualWheelchair,
                    womanRunning,
                    womanDancing,
                    womanInSteamyRoom,
                    womanClimbing,
                    womanGolfing,
                    womanSurfing,
                    womanRowing,
                    womanSwimming,
                    womanBouncingBall,
                    womanLiftingWeights,
                    womanBiking,
                    womanMountainBiking,
                    womanCartweeling,
                    womenWrestling,
                    womanPlayingWaterPolo,
                    womanPlayingHandball,
                    womanJuggling,
                    womanInLotusPosition,
                ]
            },
        ]
    },
    {
        value: "\u{1F9D3}", desc: "older person", alt: [
            olderPerson,
            oldMan,
            oldWoman,
        ]
    },
];

const allPeople = [
    people,
    gestures,
    activity,
    roles,
    fantasy,
    sports,
    personResting,
    otherPeople,
];

function randomPerson() {
    let value = allPeople.random().random(),
        lastValue = null;
    while (!!value.alt && lastValue !== value) {
        lastValue = value;
        if (value.value !== value.alt[0].value) {
            value = value.alt.random(value);
        }
        else {
            value = value.alt.random();
        }
    }
    return value;
}

const ogre = { value: "\u{1F479}", desc: "Ogre" };
const goblin = { value: "\u{1F47A}", desc: "Goblin" };
const ghost = { value: "\u{1F47B}", desc: "Ghost" };
const alien = { value: "\u{1F47D}", desc: "Alien" };
const alienMonster = { value: "\u{1F47E}", desc: "Alien Monster" };
const angryFaceWithHorns = { value: "\u{1F47F}", desc: "Angry Face with Horns" };
const skull = { value: "\u{1F480}", desc: "Skull" };
const pileOfPoo = { value: "\u{1F4A9}", desc: "Pile of Poo" };
const grinningFace = { value: "\u{1F600}", desc: "Grinning Face" };
const beamingFaceWithSmilingEyes = { value: "\u{1F601}", desc: "Beaming Face with Smiling Eyes" };
const faceWithTearsOfJoy = { value: "\u{1F602}", desc: "Face with Tears of Joy" };
const grinningFaceWithBigEyes = { value: "\u{1F603}", desc: "Grinning Face with Big Eyes" };
const grinningFaceWithSmilingEyes = { value: "\u{1F604}", desc: "Grinning Face with Smiling Eyes" };
const grinningFaceWithSweat = { value: "\u{1F605}", desc: "Grinning Face with Sweat" };
const grinningSquitingFace = { value: "\u{1F606}", desc: "Grinning Squinting Face" };
const smillingFaceWithHalo = { value: "\u{1F607}", desc: "Smiling Face with Halo" };
const smilingFaceWithHorns = { value: "\u{1F608}", desc: "Smiling Face with Horns" };
const winkingFace = { value: "\u{1F609}", desc: "Winking Face" };
const smilingFaceWithSmilingEyes = { value: "\u{1F60A}", desc: "Smiling Face with Smiling Eyes" };
const faceSavoringFood = { value: "\u{1F60B}", desc: "Face Savoring Food" };
const relievedFace = { value: "\u{1F60C}", desc: "Relieved Face" };
const smilingFaceWithHeartEyes = { value: "\u{1F60D}", desc: "Smiling Face with Heart-Eyes" };
const smilingFaceWithSunglasses = { value: "\u{1F60E}", desc: "Smiling Face with Sunglasses" };
const smirkingFace = { value: "\u{1F60F}", desc: "Smirking Face" };
const neutralFace = { value: "\u{1F610}", desc: "Neutral Face" };
const expressionlessFace = { value: "\u{1F611}", desc: "Expressionless Face" };
const unamusedFace = { value: "\u{1F612}", desc: "Unamused Face" };
const downcastFaceWithSweat = { value: "\u{1F613}", desc: "Downcast Face with Sweat" };
const pensiveFace = { value: "\u{1F614}", desc: "Pensive Face" };
const confusedFace = { value: "\u{1F615}", desc: "Confused Face" };
const confoundedFace = { value: "\u{1F616}", desc: "Confounded Face" };
const kissingFace = { value: "\u{1F617}", desc: "Kissing Face" };
const faceBlowingAKiss = { value: "\u{1F618}", desc: "Face Blowing a Kiss" };
const kissingFaceWithSmilingEyes = { value: "\u{1F619}", desc: "Kissing Face with Smiling Eyes" };
const kissingFaceWithClosedEyes = { value: "\u{1F61A}", desc: "Kissing Face with Closed Eyes" };
const faceWithTongue = { value: "\u{1F61B}", desc: "Face with Tongue" };
const winkingFaceWithTongue = { value: "\u{1F61C}", desc: "Winking Face with Tongue" };
const squintingFaceWithTongue = { value: "\u{1F61D}", desc: "Squinting Face with Tongue" };
const disappointedFace = { value: "\u{1F61E}", desc: "Disappointed Face" };
const worriedFace = { value: "\u{1F61F}", desc: "Worried Face" };
const angryFace = { value: "\u{1F620}", desc: "Angry Face" };
const poutingFace = { value: "\u{1F621}", desc: "Pouting Face" };
const cryingFace = { value: "\u{1F622}", desc: "Crying Face" };
const perseveringFace = { value: "\u{1F623}", desc: "Persevering Face" };
const faceWithSteamFromNose = { value: "\u{1F624}", desc: "Face with Steam From Nose" };
const sadButRelievedFace = { value: "\u{1F625}", desc: "Sad but Relieved Face" };
const frowningFaceWithOpenMouth = { value: "\u{1F626}", desc: "Frowning Face with Open Mouth" };
const anguishedFace = { value: "\u{1F627}", desc: "Anguished Face" };
const fearfulFace = { value: "\u{1F628}", desc: "Fearful Face" };
const wearyFace = { value: "\u{1F629}", desc: "Weary Face" };
const sleepyFace = { value: "\u{1F62A}", desc: "Sleepy Face" };
const tiredFace = { value: "\u{1F62B}", desc: "Tired Face" };
const grimacingFace = { value: "\u{1F62C}", desc: "Grimacing Face" };
const loudlyCryingFace = { value: "\u{1F62D}", desc: "Loudly Crying Face" };
const faceWithOpenMouth = { value: "\u{1F62E}", desc: "Face with Open Mouth" };
const hushedFace = { value: "\u{1F62F}", desc: "Hushed Face" };
const anxiousFaceWithSweat = { value: "\u{1F630}", desc: "Anxious Face with Sweat" };
const faceScreamingInFear = { value: "\u{1F631}", desc: "Face Screaming in Fear" };
const astonishedFace = { value: "\u{1F632}", desc: "Astonished Face" };
const flushedFace = { value: "\u{1F633}", desc: "Flushed Face" };
const sleepingFace = { value: "\u{1F634}", desc: "Sleeping Face" };
const dizzyFace = { value: "\u{1F635}", desc: "Dizzy Face" };
const faceWithoutMouth = { value: "\u{1F636}", desc: "Face Without Mouth" };
const faceWithMedicalMask = { value: "\u{1F637}", desc: "Face with Medical Mask" };
const grinningCatWithSmilingEyes = { value: "\u{1F638}", desc: "Grinning Cat with Smiling Eyes" };
const catWithTearsOfJoy = { value: "\u{1F639}", desc: "Cat with Tears of Joy" };
const grinningCat = { value: "\u{1F63A}", desc: "Grinning Cat" };
const smilingCatWithHeartEyes = { value: "\u{1F63B}", desc: "Smiling Cat with Heart-Eyes" };
const catWithWrySmile = { value: "\u{1F63C}", desc: "Cat with Wry Smile" };
const kissingCat = { value: "\u{1F63D}", desc: "Kissing Cat" };
const poutingCat = { value: "\u{1F63E}", desc: "Pouting Cat" };
const cryingCat = { value: "\u{1F63F}", desc: "Crying Cat" };
const wearyCat = { value: "\u{1F640}", desc: "Weary Cat" };
const slightlyFrowningFace = { value: "\u{1F641}", desc: "Slightly Frowning Face" };
const slightlySmilingFace = { value: "\u{1F642}", desc: "Slightly Smiling Face" };
const updisdeDownFace = { value: "\u{1F643}", desc: "Upside-Down Face" };
const faceWithRollingEyes = { value: "\u{1F644}", desc: "Face with Rolling Eyes" };
const seeNoEvilMonkey = { value: "\u{1F648}", desc: "See-No-Evil Monkey" };
const hearNoEvilMonkey = { value: "\u{1F649}", desc: "Hear-No-Evil Monkey" };
const speakNoEvilMonkey = { value: "\u{1F64A}", desc: "Speak-No-Evil Monkey" };
const zipperMouthFace = { value: "\u{1F910}", desc: "Zipper-Mouth Face" };
const moneyMouthFace = { value: "\u{1F911}", desc: "Money-Mouth Face" };
const faceWithThermometer = { value: "\u{1F912}", desc: "Face with Thermometer" };
const nerdFace = { value: "\u{1F913}", desc: "Nerd Face" };
const thinkingFace = { value: "\u{1F914}", desc: "Thinking Face" };
const faceWithHeadBandage = { value: "\u{1F915}", desc: "Face with Head-Bandage" };
const robot = { value: "\u{1F916}", desc: "Robot" };
const huggingFace = { value: "\u{1F917}", desc: "Hugging Face" };
const cowboyHatFace = { value: "\u{1F920}", desc: "Cowboy Hat Face" };
const clownFace = { value: "\u{1F921}", desc: "Clown Face" };
const nauseatedFace = { value: "\u{1F922}", desc: "Nauseated Face" };
const rollingOnTheFloorLaughing = { value: "\u{1F923}", desc: "Rolling on the Floor Laughing" };
const droolingFace = { value: "\u{1F924}", desc: "Drooling Face" };
const lyingFace = { value: "\u{1F925}", desc: "Lying Face" };
const sneezingFace = { value: "\u{1F927}", desc: "Sneezing Face" };
const faceWithRaisedEyebrow = { value: "\u{1F928}", desc: "Face with Raised Eyebrow" };
const starStruck = { value: "\u{1F929}", desc: "Star-Struck" };
const zanyFace = { value: "\u{1F92A}", desc: "Zany Face" };
const shushingFace = { value: "\u{1F92B}", desc: "Shushing Face" };
const faceWithSymbolsOnMouth = { value: "\u{1F92C}", desc: "Face with Symbols on Mouth" };
const faceWithHandOverMouth = { value: "\u{1F92D}", desc: "Face with Hand Over Mouth" };
const faceVomitting = { value: "\u{1F92E}", desc: "Face Vomiting" };
const explodingHead = { value: "\u{1F92F}", desc: "Exploding Head" };
const smilingFaceWithHearts = { value: "\u{1F970}", desc: "Smiling Face with Hearts" };
const yawningFace = { value: "\u{1F971}", desc: "Yawning Face" };
const smilingFaceWithTear = { value: "\u{1F972}", desc: "Smiling Face with Tear" };
const partyingFace = { value: "\u{1F973}", desc: "Partying Face" };
const woozyFace = { value: "\u{1F974}", desc: "Woozy Face" };
const hotFace = { value: "\u{1F975}", desc: "Hot Face" };
const coldFace = { value: "\u{1F976}", desc: "Cold Face" };
const disguisedFace = { value: "\u{1F978}", desc: "Disguised Face" };
const pleadingFace = { value: "\u{1F97A}", desc: "Pleading Face" };
const faceWithMonocle = { value: "\u{1F9D0}", desc: "Face with Monocle" };
const skullAndCrossbones = { value: "\u{2620}\u{FE0F}", desc: "Skull and Crossbones" };
const frowningFace = { value: "\u{2639}\u{FE0F}", desc: "Frowning Face" };
const fmilingFace = { value: "\u{263A}\u{FE0F}", desc: "Smiling Face" };
const speakingHead = { value: "\u{1F5E3}\u{FE0F}", desc: "Speaking Head" };
const bust = { value: "\u{1F464}", desc: "Bust in Silhouette" };
const faces = [
    ogre,
    goblin,
    ghost,
    alien,
    alienMonster,
    angryFaceWithHorns,
    skull,
    pileOfPoo,
    grinningFace,
    beamingFaceWithSmilingEyes,
    faceWithTearsOfJoy,
    grinningFaceWithBigEyes,
    grinningFaceWithSmilingEyes,
    grinningFaceWithSweat,
    grinningSquitingFace,
    smillingFaceWithHalo,
    smilingFaceWithHorns,
    winkingFace,
    smilingFaceWithSmilingEyes,
    faceSavoringFood,
    relievedFace,
    smilingFaceWithHeartEyes,
    smilingFaceWithSunglasses,
    smirkingFace,
    neutralFace,
    expressionlessFace,
    unamusedFace,
    downcastFaceWithSweat,
    pensiveFace,
    confusedFace,
    confoundedFace,
    kissingFace,
    faceBlowingAKiss,
    kissingFaceWithSmilingEyes,
    kissingFaceWithClosedEyes,
    faceWithTongue,
    winkingFaceWithTongue,
    squintingFaceWithTongue,
    disappointedFace,
    worriedFace,
    angryFace,
    poutingFace,
    cryingFace,
    perseveringFace,
    faceWithSteamFromNose,
    sadButRelievedFace,
    frowningFaceWithOpenMouth,
    anguishedFace,
    fearfulFace,
    wearyFace,
    sleepyFace,
    tiredFace,
    grimacingFace,
    loudlyCryingFace,
    faceWithOpenMouth,
    hushedFace,
    anxiousFaceWithSweat,
    faceScreamingInFear,
    astonishedFace,
    flushedFace,
    sleepingFace,
    dizzyFace,
    faceWithoutMouth,
    faceWithMedicalMask,
    grinningCatWithSmilingEyes,
    catWithTearsOfJoy,
    grinningCat,
    smilingCatWithHeartEyes,
    catWithWrySmile,
    kissingCat,
    poutingCat,
    cryingCat,
    wearyCat,
    slightlyFrowningFace,
    slightlySmilingFace,
    updisdeDownFace,
    faceWithRollingEyes,
    seeNoEvilMonkey,
    hearNoEvilMonkey,
    speakNoEvilMonkey,
    zipperMouthFace,
    moneyMouthFace,
    faceWithThermometer,
    nerdFace,
    thinkingFace,
    faceWithHeadBandage,
    robot,
    huggingFace,
    cowboyHatFace,
    clownFace,
    nauseatedFace,
    rollingOnTheFloorLaughing,
    droolingFace,
    lyingFace,
    sneezingFace,
    faceWithRaisedEyebrow,
    starStruck,
    zanyFace,
    shushingFace,
    faceWithSymbolsOnMouth,
    faceWithHandOverMouth,
    faceVomitting,
    explodingHead,
    smilingFaceWithHearts,
    yawningFace,
    smilingFaceWithTear,
    partyingFace,
    woozyFace,
    hotFace,
    coldFace,
    disguisedFace,
    pleadingFace,
    faceWithMonocle,
    skullAndCrossbones,
    frowningFace,
    fmilingFace,
    speakingHead,
    bust,
];

const kissMark = { value: "\u{1F48B}", desc: "Kiss Mark" };
const loveLetter = { value: "\u{1F48C}", desc: "Love Letter" };
const beatingHeart = { value: "\u{1F493}", desc: "Beating Heart" };
const brokenHeart = { value: "\u{1F494}", desc: "Broken Heart" };
const twoHearts = { value: "\u{1F495}", desc: "Two Hearts" };
const sparklingHeart = { value: "\u{1F496}", desc: "Sparkling Heart" };
const growingHeart = { value: "\u{1F497}", desc: "Growing Heart" };
const heartWithArrow = { value: "\u{1F498}", desc: "Heart with Arrow" };
const blueHeart = { value: "\u{1F499}", desc: "Blue Heart" };
const greenHeart = { value: "\u{1F49A}", desc: "Green Heart" };
const yellowHeart = { value: "\u{1F49B}", desc: "Yellow Heart" };
const purpleHeart = { value: "\u{1F49C}", desc: "Purple Heart" };
const heartWithRibbon = { value: "\u{1F49D}", desc: "Heart with Ribbon" };
const revolvingHearts = { value: "\u{1F49E}", desc: "Revolving Hearts" };
const heartDecoration = { value: "\u{1F49F}", desc: "Heart Decoration" };
const blackHeart = { value: "\u{1F5A4}", desc: "Black Heart" };
const whiteHeart = { value: "\u{1F90D}", desc: "White Heart" };
const brownHeart = { value: "\u{1F90E}", desc: "Brown Heart" };
const orangeHeart = { value: "\u{1F9E1}", desc: "Orange Heart" };
const heartExclamation = { value: "\u{2763}\u{FE0F}", desc: "Heart Exclamation" };
const redHeart = { value: "\u{2764}\u{FE0F}", desc: "Red Heart" };
const love = [
    kissMark,
    loveLetter,
    beatingHeart,
    brokenHeart,
    twoHearts,
    sparklingHeart,
    growingHeart,
    heartWithArrow,
    blueHeart,
    greenHeart,
    yellowHeart,
    purpleHeart,
    heartWithRibbon,
    revolvingHearts,
    heartDecoration,
    blackHeart,
    whiteHeart,
    brownHeart,
    orangeHeart,
    heartExclamation,
    redHeart,
];

const cartoon = [
    { value: "\u{1F4A2}", desc: "Anger Symbol" },
    { value: "\u{1F4A3}", desc: "Bomb" },
    { value: "\u{1F4A4}", desc: "Zzz" },
    { value: "\u{1F4A5}", desc: "Collision" },
    { value: "\u{1F4A6}", desc: "Sweat Droplets" },
    { value: "\u{1F4A8}", desc: "Dashing Away" },
    { value: "\u{1F4AB}", desc: "Dizzy" },
    { value: "\u{1F4AC}", desc: "Speech Balloon" },
    { value: "\u{1F4AD}", desc: "Thought Balloon" },
    { value: "\u{1F4AF}", desc: "Hundred Points" },
    { value: "\u{1F573}\u{FE0F}", desc: "Hole" },
    { value: "\u{1F5E8}\u{FE0F}", desc: "Left Speech Bubble" },
    { value: "\u{1F5EF}\u{FE0F}", desc: "Right Anger Bubble" },
];

const hands = [
    { value: "\u{1F446}", desc: "Backhand Index Pointing Up" },
    { value: "\u{1F447}", desc: "Backhand Index Pointing Down" },
    { value: "\u{1F448}", desc: "Backhand Index Pointing Left" },
    { value: "\u{1F449}", desc: "Backhand Index Pointing Right" },
    { value: "\u{1F44A}", desc: "Oncoming Fist" },
    { value: "\u{1F44B}", desc: "Waving Hand" },
    { value: "\u{1F44C}", desc: "OK Hand" },
    { value: "\u{1F44D}", desc: "Thumbs Up" },
    { value: "\u{1F44E}", desc: "Thumbs Down" },
    { value: "\u{1F44F}", desc: "Clapping Hands" },
    { value: "\u{1F450}", desc: "Open Hands" },
    { value: "\u{1F485}", desc: "Nail Polish" },
    { value: "\u{1F590}\u{FE0F}", desc: "Hand with Fingers Splayed" },
    { value: "\u{1F595}", desc: "Middle Finger" },
    { value: "\u{1F596}", desc: "Vulcan Salute" },
    { value: "\u{1F64C}", desc: "Raising Hands" },
    { value: "\u{1F64F}", desc: "Folded Hands" },
    { value: "\u{1F90C}", desc: "Pinched Fingers" },
    { value: "\u{1F90F}", desc: "Pinching Hand" },
    { value: "\u{1F918}", desc: "Sign of the Horns" },
    { value: "\u{1F919}", desc: "Call Me Hand" },
    { value: "\u{1F91A}", desc: "Raised Back of Hand" },
    { value: "\u{1F91B}", desc: "Left-Facing Fist" },
    { value: "\u{1F91C}", desc: "Right-Facing Fist" },
    { value: "\u{1F91D}", desc: "Handshake" },
    { value: "\u{1F91E}", desc: "Crossed Fingers" },
    { value: "\u{1F91F}", desc: "Love-You Gesture" },
    { value: "\u{1F932}", desc: "Palms Up Together" },
    { value: "\u{261D}\u{FE0F}", desc: "Index Pointing Up" },
    { value: "\u{270A}", desc: "Raised Fist" },
    { value: "\u{270B}", desc: "Raised Hand" },
    { value: "\u{270C}\u{FE0F}", desc: "Victory Hand" },
    { value: "\u{270D}\u{FE0F}", desc: "Writing Hand" },
];
const bodyParts = [
    { value: "\u{1F440}", desc: "Eyes" },
    { value: "\u{1F441}\u{FE0F}", desc: "Eye" },
    { value: "\u{1F441}\u{FE0F}\u{200D}\u{1F5E8}\u{FE0F}", desc: "Eye in Speech Bubble" },
    { value: "\u{1F442}", desc: "Ear" },
    { value: "\u{1F443}", desc: "Nose" },
    { value: "\u{1F444}", desc: "Mouth" },
    { value: "\u{1F445}", desc: "Tongue" },
    { value: "\u{1F4AA}", desc: "Flexed Biceps" },
    { value: "\u{1F933}", desc: "Selfie" },
    { value: "\u{1F9B4}", desc: "Bone" },
    { value: "\u{1F9B5}", desc: "Leg" },
    { value: "\u{1F9B6}", desc: "Foot" },
    { value: "\u{1F9B7}", desc: "Tooth" },
    { value: "\u{1F9BB}", desc: "Ear with Hearing Aid" },
    { value: "\u{1F9BE}", desc: "Mechanical Arm" },
    { value: "\u{1F9BF}", desc: "Mechanical Leg" },
    { value: "\u{1F9E0}", desc: "Brain" },
    { value: "\u{1FAC0}", desc: "Anatomical Heart" },
    { value: "\u{1FAC1}", desc: "Lungs" },
];
const sex = [
    { value: "\u{200D}\u{2640}\u{FE0F}", desc: "Female" },
    { value: "\u{200D}\u{2642}\u{FE0F}", desc: "Male" },
];
const skinTones = [
    { value: "\u{1F3FB}", desc: "Light Skin Tone" },
    { value: "\u{1F3FC}", desc: "Medium-Light Skin Tone" },
    { value: "\u{1F3FD}", desc: "Medium Skin Tone" },
    { value: "\u{1F3FE}", desc: "Medium-Dark Skin Tone" },
    { value: "\u{1F3FF}", desc: "Dark Skin Tone" },
];
const hairColors = [
    { value: "\u{1F9B0}", desc: "Red Hair" },
    { value: "\u{1F9B1}", desc: "Curly Hair" },
    { value: "\u{1F9B3}", desc: "White Hair" },
    { value: "\u{1F9B2}", desc: "Bald" },
];
const animals = [
    { value: "\u{1F400}", desc: "Rat" },
    { value: "\u{1F401}", desc: "Mouse" },
    { value: "\u{1F402}", desc: "Ox" },
    { value: "\u{1F403}", desc: "Water Buffalo" },
    { value: "\u{1F404}", desc: "Cow" },
    { value: "\u{1F405}", desc: "Tiger" },
    { value: "\u{1F406}", desc: "Leopard" },
    { value: "\u{1F407}", desc: "Rabbit" },
    { value: "\u{1F408}", desc: "Cat" },
    { value: "\u{1F408}\u{200D}\u{2B1B}", desc: "Black Cat" },
    { value: "\u{1F409}", desc: "Dragon" },
    { value: "\u{1F40A}", desc: "Crocodile" },
    { value: "\u{1F40B}", desc: "Whale" },
    { value: "\u{1F40C}", desc: "Snail" },
    { value: "\u{1F40D}", desc: "Snake" },
    { value: "\u{1F40E}", desc: "Horse" },
    { value: "\u{1F40F}", desc: "Ram" },
    { value: "\u{1F410}", desc: "Goat" },
    { value: "\u{1F411}", desc: "Ewe" },
    { value: "\u{1F412}", desc: "Monkey" },
    { value: "\u{1F413}", desc: "Rooster" },
    { value: "\u{1F414}", desc: "Chicken" },
    { value: "\u{1F415}", desc: "Dog" },
    { value: "\u{1F415}\u{200D}\u{1F9BA}", desc: "Service Dog" },
    { value: "\u{1F416}", desc: "Pig" },
    { value: "\u{1F417}", desc: "Boar" },
    { value: "\u{1F418}", desc: "Elephant" },
    { value: "\u{1F419}", desc: "Octopus" },
    { value: "\u{1F41A}", desc: "Spiral Shell" },
    { value: "\u{1F41B}", desc: "Bug" },
    { value: "\u{1F41C}", desc: "Ant" },
    { value: "\u{1F41D}", desc: "Honeybee" },
    { value: "\u{1F41E}", desc: "Lady Beetle" },
    { value: "\u{1F41F}", desc: "Fish" },
    { value: "\u{1F420}", desc: "Tropical Fish" },
    { value: "\u{1F421}", desc: "Blowfish" },
    { value: "\u{1F422}", desc: "Turtle" },
    { value: "\u{1F423}", desc: "Hatching Chick" },
    { value: "\u{1F424}", desc: "Baby Chick" },
    { value: "\u{1F425}", desc: "Front-Facing Baby Chick" },
    { value: "\u{1F426}", desc: "Bird" },
    { value: "\u{1F427}", desc: "Penguin" },
    { value: "\u{1F428}", desc: "Koala" },
    { value: "\u{1F429}", desc: "Poodle" },
    { value: "\u{1F42A}", desc: "Camel" },
    { value: "\u{1F42B}", desc: "Two-Hump Camel" },
    { value: "\u{1F42C}", desc: "Dolphin" },
    { value: "\u{1F42D}", desc: "Mouse Face" },
    { value: "\u{1F42E}", desc: "Cow Face" },
    { value: "\u{1F42F}", desc: "Tiger Face" },
    { value: "\u{1F430}", desc: "Rabbit Face" },
    { value: "\u{1F431}", desc: "Cat Face" },
    { value: "\u{1F432}", desc: "Dragon Face" },
    { value: "\u{1F433}", desc: "Spouting Whale" },
    { value: "\u{1F434}", desc: "Horse Face" },
    { value: "\u{1F435}", desc: "Monkey Face" },
    { value: "\u{1F436}", desc: "Dog Face" },
    { value: "\u{1F437}", desc: "Pig Face" },
    { value: "\u{1F438}", desc: "Frog" },
    { value: "\u{1F439}", desc: "Hamster" },
    { value: "\u{1F43A}", desc: "Wolf" },
    { value: "\u{1F43B}", desc: "Bear" },
    { value: "\u{1F43B}\u{200D}\u{2744}\u{FE0F}", desc: "Polar Bear" },
    { value: "\u{1F43C}", desc: "Panda" },
    { value: "\u{1F43D}", desc: "Pig Nose" },
    { value: "\u{1F43E}", desc: "Paw Prints" },
    { value: "\u{1F43F}\u{FE0F}", desc: "Chipmunk" },
    { value: "\u{1F54A}\u{FE0F}", desc: "Dove" },
    { value: "\u{1F577}\u{FE0F}", desc: "Spider" },
    { value: "\u{1F578}\u{FE0F}", desc: "Spider Web" },
    { value: "\u{1F981}", desc: "Lion" },
    { value: "\u{1F982}", desc: "Scorpion" },
    { value: "\u{1F983}", desc: "Turkey" },
    { value: "\u{1F984}", desc: "Unicorn" },
    { value: "\u{1F985}", desc: "Eagle" },
    { value: "\u{1F986}", desc: "Duck" },
    { value: "\u{1F987}", desc: "Bat" },
    { value: "\u{1F988}", desc: "Shark" },
    { value: "\u{1F989}", desc: "Owl" },
    { value: "\u{1F98A}", desc: "Fox" },
    { value: "\u{1F98B}", desc: "Butterfly" },
    { value: "\u{1F98C}", desc: "Deer" },
    { value: "\u{1F98D}", desc: "Gorilla" },
    { value: "\u{1F98E}", desc: "Lizard" },
    { value: "\u{1F98F}", desc: "Rhinoceros" },
    { value: "\u{1F992}", desc: "Giraffe" },
    { value: "\u{1F993}", desc: "Zebra" },
    { value: "\u{1F994}", desc: "Hedgehog" },
    { value: "\u{1F995}", desc: "Sauropod" },
    { value: "\u{1F996}", desc: "T-Rex" },
    { value: "\u{1F997}", desc: "Cricket" },
    { value: "\u{1F998}", desc: "Kangaroo" },
    { value: "\u{1F999}", desc: "Llama" },
    { value: "\u{1F99A}", desc: "Peacock" },
    { value: "\u{1F99B}", desc: "Hippopotamus" },
    { value: "\u{1F99C}", desc: "Parrot" },
    { value: "\u{1F99D}", desc: "Raccoon" },
    { value: "\u{1F99F}", desc: "Mosquito" },
    { value: "\u{1F9A0}", desc: "Microbe" },
    { value: "\u{1F9A1}", desc: "Badger" },
    { value: "\u{1F9A2}", desc: "Swan" },
    { value: "\u{1F9A3}", desc: "Mammoth" },
    { value: "\u{1F9A4}", desc: "Dodo" },
    { value: "\u{1F9A5}", desc: "Sloth" },
    { value: "\u{1F9A6}", desc: "Otter" },
    { value: "\u{1F9A7}", desc: "Orangutan" },
    { value: "\u{1F9A8}", desc: "Skunk" },
    { value: "\u{1F9A9}", desc: "Flamingo" },
    { value: "\u{1F9AB}", desc: "Beaver" },
    { value: "\u{1F9AC}", desc: "Bison" },
    { value: "\u{1F9AD}", desc: "Seal" },
    { value: "\u{1F9AE}", desc: "Guide Dog" },
    { value: "\u{1FAB0}", desc: "Fly" },
    { value: "\u{1FAB1}", desc: "Worm" },
    { value: "\u{1FAB2}", desc: "Beetle" },
    { value: "\u{1FAB3}", desc: "Cockroach" },
    { value: "\u{1FAB6}", desc: "Feather" },
];
const plants = [
    { value: "\u{1F331}", desc: "Seedling" },
    { value: "\u{1F332}", desc: "Evergreen Tree" },
    { value: "\u{1F333}", desc: "Deciduous Tree" },
    { value: "\u{1F334}", desc: "Palm Tree" },
    { value: "\u{1F335}", desc: "Cactus" },
    { value: "\u{1F337}", desc: "Tulip" },
    { value: "\u{1F338}", desc: "Cherry Blossom" },
    { value: "\u{1F339}", desc: "Rose" },
    { value: "\u{1F33A}", desc: "Hibiscus" },
    { value: "\u{1F33B}", desc: "Sunflower" },
    { value: "\u{1F33C}", desc: "Blossom" },
    { value: "\u{1F33E}", desc: "Sheaf of Rice" },
    { value: "\u{1F33F}", desc: "Herb" },
    { value: "\u{1F340}", desc: "Four Leaf Clover" },
    { value: "\u{1F341}", desc: "Maple Leaf" },
    { value: "\u{1F342}", desc: "Fallen Leaf" },
    { value: "\u{1F343}", desc: "Leaf Fluttering in Wind" },
    { value: "\u{1F3F5}\u{FE0F}", desc: "Rosette" },
    { value: "\u{1F490}", desc: "Bouquet" },
    { value: "\u{1F4AE}", desc: "White Flower" },
    { value: "\u{1F940}", desc: "Wilted Flower" },
    { value: "\u{1FAB4}", desc: "Potted Plant" },
    { value: "\u{2618}\u{FE0F}", desc: "Shamrock" },
];
const food = [
    { value: "\u{1F32D}", desc: "Hot Dog" },
    { value: "\u{1F32E}", desc: "Taco" },
    { value: "\u{1F32F}", desc: "Burrito" },
    { value: "\u{1F330}", desc: "Chestnut" },
    { value: "\u{1F336}\u{FE0F}", desc: "Hot Pepper" },
    { value: "\u{1F33D}", desc: "Ear of Corn" },
    { value: "\u{1F344}", desc: "Mushroom" },
    { value: "\u{1F345}", desc: "Tomato" },
    { value: "\u{1F346}", desc: "Eggplant" },
    { value: "\u{1F347}", desc: "Grapes" },
    { value: "\u{1F348}", desc: "Melon" },
    { value: "\u{1F349}", desc: "Watermelon" },
    { value: "\u{1F34A}", desc: "Tangerine" },
    { value: "\u{1F34B}", desc: "Lemon" },
    { value: "\u{1F34C}", desc: "Banana" },
    { value: "\u{1F34D}", desc: "Pineapple" },
    { value: "\u{1F34E}", desc: "Red Apple" },
    { value: "\u{1F34F}", desc: "Green Apple" },
    { value: "\u{1F350}", desc: "Pear" },
    { value: "\u{1F351}", desc: "Peach" },
    { value: "\u{1F352}", desc: "Cherries" },
    { value: "\u{1F353}", desc: "Strawberry" },
    { value: "\u{1F354}", desc: "Hamburger" },
    { value: "\u{1F355}", desc: "Pizza" },
    { value: "\u{1F356}", desc: "Meat on Bone" },
    { value: "\u{1F357}", desc: "Poultry Leg" },
    { value: "\u{1F358}", desc: "Rice Cracker" },
    { value: "\u{1F359}", desc: "Rice Ball" },
    { value: "\u{1F35A}", desc: "Cooked Rice" },
    { value: "\u{1F35B}", desc: "Curry Rice" },
    { value: "\u{1F35C}", desc: "Steaming Bowl" },
    { value: "\u{1F35D}", desc: "Spaghetti" },
    { value: "\u{1F35E}", desc: "Bread" },
    { value: "\u{1F35F}", desc: "French Fries" },
    { value: "\u{1F360}", desc: "Roasted Sweet Potato" },
    { value: "\u{1F361}", desc: "Dango" },
    { value: "\u{1F362}", desc: "Oden" },
    { value: "\u{1F363}", desc: "Sushi" },
    { value: "\u{1F364}", desc: "Fried Shrimp" },
    { value: "\u{1F365}", desc: "Fish Cake with Swirl" },
    { value: "\u{1F371}", desc: "Bento Box" },
    { value: "\u{1F372}", desc: "Pot of Food" },
    { value: "\u{1F373}", desc: "Cooking" },
    { value: "\u{1F37F}", desc: "Popcorn" },
    { value: "\u{1F950}", desc: "Croissant" },
    { value: "\u{1F951}", desc: "Avocado" },
    { value: "\u{1F952}", desc: "Cucumber" },
    { value: "\u{1F953}", desc: "Bacon" },
    { value: "\u{1F954}", desc: "Potato" },
    { value: "\u{1F955}", desc: "Carrot" },
    { value: "\u{1F956}", desc: "Baguette Bread" },
    { value: "\u{1F957}", desc: "Green Salad" },
    { value: "\u{1F958}", desc: "Shallow Pan of Food" },
    { value: "\u{1F959}", desc: "Stuffed Flatbread" },
    { value: "\u{1F95A}", desc: "Egg" },
    { value: "\u{1F95C}", desc: "Peanuts" },
    { value: "\u{1F95D}", desc: "Kiwi Fruit" },
    { value: "\u{1F95E}", desc: "Pancakes" },
    { value: "\u{1F95F}", desc: "Dumpling" },
    { value: "\u{1F960}", desc: "Fortune Cookie" },
    { value: "\u{1F961}", desc: "Takeout Box" },
    { value: "\u{1F963}", desc: "Bowl with Spoon" },
    { value: "\u{1F965}", desc: "Coconut" },
    { value: "\u{1F966}", desc: "Broccoli" },
    { value: "\u{1F968}", desc: "Pretzel" },
    { value: "\u{1F969}", desc: "Cut of Meat" },
    { value: "\u{1F96A}", desc: "Sandwich" },
    { value: "\u{1F96B}", desc: "Canned Food" },
    { value: "\u{1F96C}", desc: "Leafy Green" },
    { value: "\u{1F96D}", desc: "Mango" },
    { value: "\u{1F96E}", desc: "Moon Cake" },
    { value: "\u{1F96F}", desc: "Bagel" },
    { value: "\u{1F980}", desc: "Crab" },
    { value: "\u{1F990}", desc: "Shrimp" },
    { value: "\u{1F991}", desc: "Squid" },
    { value: "\u{1F99E}", desc: "Lobster" },
    { value: "\u{1F9AA}", desc: "Oyster" },
    { value: "\u{1F9C0}", desc: "Cheese Wedge" },
    { value: "\u{1F9C2}", desc: "Salt" },
    { value: "\u{1F9C4}", desc: "Garlic" },
    { value: "\u{1F9C5}", desc: "Onion" },
    { value: "\u{1F9C6}", desc: "Falafel" },
    { value: "\u{1F9C7}", desc: "Waffle" },
    { value: "\u{1F9C8}", desc: "Butter" },
    { value: "\u{1FAD0}", desc: "Blueberries" },
    { value: "\u{1FAD1}", desc: "Bell Pepper" },
    { value: "\u{1FAD2}", desc: "Olive" },
    { value: "\u{1FAD3}", desc: "Flatbread" },
    { value: "\u{1FAD4}", desc: "Tamale" },
    { value: "\u{1FAD5}", desc: "Fondue" },
];
const sweets = [
    { value: "\u{1F366}", desc: "Soft Ice Cream" },
    { value: "\u{1F367}", desc: "Shaved Ice" },
    { value: "\u{1F368}", desc: "Ice Cream" },
    { value: "\u{1F369}", desc: "Doughnut" },
    { value: "\u{1F36A}", desc: "Cookie" },
    { value: "\u{1F36B}", desc: "Chocolate Bar" },
    { value: "\u{1F36C}", desc: "Candy" },
    { value: "\u{1F36D}", desc: "Lollipop" },
    { value: "\u{1F36E}", desc: "Custard" },
    { value: "\u{1F36F}", desc: "Honey Pot" },
    { value: "\u{1F370}", desc: "Shortcake" },
    { value: "\u{1F382}", desc: "Birthday Cake" },
    { value: "\u{1F967}", desc: "Pie" },
    { value: "\u{1F9C1}", desc: "Cupcake" },
];
const drinks = [
    { value: "\u{1F375}", desc: "Teacup Without Handle" },
    { value: "\u{1F376}", desc: "Sake" },
    { value: "\u{1F377}", desc: "Wine Glass" },
    { value: "\u{1F378}", desc: "Cocktail Glass" },
    { value: "\u{1F379}", desc: "Tropical Drink" },
    { value: "\u{1F37A}", desc: "Beer Mug" },
    { value: "\u{1F37B}", desc: "Clinking Beer Mugs" },
    { value: "\u{1F37C}", desc: "Baby Bottle" },
    { value: "\u{1F37E}", desc: "Bottle with Popping Cork" },
    { value: "\u{1F942}", desc: "Clinking Glasses" },
    { value: "\u{1F943}", desc: "Tumbler Glass" },
    { value: "\u{1F95B}", desc: "Glass of Milk" },
    { value: "\u{1F964}", desc: "Cup with Straw" },
    { value: "\u{1F9C3}", desc: "Beverage Box" },
    { value: "\u{1F9C9}", desc: "Mate" },
    { value: "\u{1F9CA}", desc: "Ice" },
    { value: "\u{1F9CB}", desc: "Bubble Tea" },
    { value: "\u{1FAD6}", desc: "Teapot" },
    { value: "\u{2615}", desc: "Hot Beverage" },
];
const utensils = [
    { value: "\u{1F374}", desc: "Fork and Knife" },
    { value: "\u{1F37D}\u{FE0F}", desc: "Fork and Knife with Plate" },
    { value: "\u{1F3FA}", desc: "Amphora" },
    { value: "\u{1F52A}", desc: "Kitchen Knife" },
    { value: "\u{1F944}", desc: "Spoon" },
    { value: "\u{1F962}", desc: "Chopsticks" },
];
const nations = [
    { value: "\u{1F1E6}\u{1F1E8}", desc: "Flag: Ascension Island" },
    { value: "\u{1F1E6}\u{1F1E9}", desc: "Flag: Andorra" },
    { value: "\u{1F1E6}\u{1F1EA}", desc: "Flag: United Arab Emirates" },
    { value: "\u{1F1E6}\u{1F1EB}", desc: "Flag: Afghanistan" },
    { value: "\u{1F1E6}\u{1F1EC}", desc: "Flag: Antigua & Barbuda" },
    { value: "\u{1F1E6}\u{1F1EE}", desc: "Flag: Anguilla" },
    { value: "\u{1F1E6}\u{1F1F1}", desc: "Flag: Albania" },
    { value: "\u{1F1E6}\u{1F1F2}", desc: "Flag: Armenia" },
    { value: "\u{1F1E6}\u{1F1F4}", desc: "Flag: Angola" },
    { value: "\u{1F1E6}\u{1F1F6}", desc: "Flag: Antarctica" },
    { value: "\u{1F1E6}\u{1F1F7}", desc: "Flag: Argentina" },
    { value: "\u{1F1E6}\u{1F1F8}", desc: "Flag: American Samoa" },
    { value: "\u{1F1E6}\u{1F1F9}", desc: "Flag: Austria" },
    { value: "\u{1F1E6}\u{1F1FA}", desc: "Flag: Australia" },
    { value: "\u{1F1E6}\u{1F1FC}", desc: "Flag: Aruba" },
    { value: "\u{1F1E6}\u{1F1FD}", desc: "Flag: Åland Islands" },
    { value: "\u{1F1E6}\u{1F1FF}", desc: "Flag: Azerbaijan" },
    { value: "\u{1F1E7}\u{1F1E6}", desc: "Flag: Bosnia & Herzegovina" },
    { value: "\u{1F1E7}\u{1F1E7}", desc: "Flag: Barbados" },
    { value: "\u{1F1E7}\u{1F1E9}", desc: "Flag: Bangladesh" },
    { value: "\u{1F1E7}\u{1F1EA}", desc: "Flag: Belgium" },
    { value: "\u{1F1E7}\u{1F1EB}", desc: "Flag: Burkina Faso" },
    { value: "\u{1F1E7}\u{1F1EC}", desc: "Flag: Bulgaria" },
    { value: "\u{1F1E7}\u{1F1ED}", desc: "Flag: Bahrain" },
    { value: "\u{1F1E7}\u{1F1EE}", desc: "Flag: Burundi" },
    { value: "\u{1F1E7}\u{1F1EF}", desc: "Flag: Benin" },
    { value: "\u{1F1E7}\u{1F1F1}", desc: "Flag: St. Barthélemy" },
    { value: "\u{1F1E7}\u{1F1F2}", desc: "Flag: Bermuda" },
    { value: "\u{1F1E7}\u{1F1F3}", desc: "Flag: Brunei" },
    { value: "\u{1F1E7}\u{1F1F4}", desc: "Flag: Bolivia" },
    { value: "\u{1F1E7}\u{1F1F6}", desc: "Flag: Caribbean Netherlands" },
    { value: "\u{1F1E7}\u{1F1F7}", desc: "Flag: Brazil" },
    { value: "\u{1F1E7}\u{1F1F8}", desc: "Flag: Bahamas" },
    { value: "\u{1F1E7}\u{1F1F9}", desc: "Flag: Bhutan" },
    { value: "\u{1F1E7}\u{1F1FB}", desc: "Flag: Bouvet Island" },
    { value: "\u{1F1E7}\u{1F1FC}", desc: "Flag: Botswana" },
    { value: "\u{1F1E7}\u{1F1FE}", desc: "Flag: Belarus" },
    { value: "\u{1F1E7}\u{1F1FF}", desc: "Flag: Belize" },
    { value: "\u{1F1E8}\u{1F1E6}", desc: "Flag: Canada" },
    { value: "\u{1F1E8}\u{1F1E8}", desc: "Flag: Cocos (Keeling) Islands" },
    { value: "\u{1F1E8}\u{1F1E9}", desc: "Flag: Congo - Kinshasa" },
    { value: "\u{1F1E8}\u{1F1EB}", desc: "Flag: Central African Republic" },
    { value: "\u{1F1E8}\u{1F1EC}", desc: "Flag: Congo - Brazzaville" },
    { value: "\u{1F1E8}\u{1F1ED}", desc: "Flag: Switzerland" },
    { value: "\u{1F1E8}\u{1F1EE}", desc: "Flag: Côte d’Ivoire" },
    { value: "\u{1F1E8}\u{1F1F0}", desc: "Flag: Cook Islands" },
    { value: "\u{1F1E8}\u{1F1F1}", desc: "Flag: Chile" },
    { value: "\u{1F1E8}\u{1F1F2}", desc: "Flag: Cameroon" },
    { value: "\u{1F1E8}\u{1F1F3}", desc: "Flag: China" },
    { value: "\u{1F1E8}\u{1F1F4}", desc: "Flag: Colombia" },
    { value: "\u{1F1E8}\u{1F1F5}", desc: "Flag: Clipperton Island" },
    { value: "\u{1F1E8}\u{1F1F7}", desc: "Flag: Costa Rica" },
    { value: "\u{1F1E8}\u{1F1FA}", desc: "Flag: Cuba" },
    { value: "\u{1F1E8}\u{1F1FB}", desc: "Flag: Cape Verde" },
    { value: "\u{1F1E8}\u{1F1FC}", desc: "Flag: Curaçao" },
    { value: "\u{1F1E8}\u{1F1FD}", desc: "Flag: Christmas Island" },
    { value: "\u{1F1E8}\u{1F1FE}", desc: "Flag: Cyprus" },
    { value: "\u{1F1E8}\u{1F1FF}", desc: "Flag: Czechia" },
    { value: "\u{1F1E9}\u{1F1EA}", desc: "Flag: Germany" },
    { value: "\u{1F1E9}\u{1F1EC}", desc: "Flag: Diego Garcia" },
    { value: "\u{1F1E9}\u{1F1EF}", desc: "Flag: Djibouti" },
    { value: "\u{1F1E9}\u{1F1F0}", desc: "Flag: Denmark" },
    { value: "\u{1F1E9}\u{1F1F2}", desc: "Flag: Dominica" },
    { value: "\u{1F1E9}\u{1F1F4}", desc: "Flag: Dominican Republic" },
    { value: "\u{1F1E9}\u{1F1FF}", desc: "Flag: Algeria" },
    { value: "\u{1F1EA}\u{1F1E6}", desc: "Flag: Ceuta & Melilla" },
    { value: "\u{1F1EA}\u{1F1E8}", desc: "Flag: Ecuador" },
    { value: "\u{1F1EA}\u{1F1EA}", desc: "Flag: Estonia" },
    { value: "\u{1F1EA}\u{1F1EC}", desc: "Flag: Egypt" },
    { value: "\u{1F1EA}\u{1F1ED}", desc: "Flag: Western Sahara" },
    { value: "\u{1F1EA}\u{1F1F7}", desc: "Flag: Eritrea" },
    { value: "\u{1F1EA}\u{1F1F8}", desc: "Flag: Spain" },
    { value: "\u{1F1EA}\u{1F1F9}", desc: "Flag: Ethiopia" },
    { value: "\u{1F1EA}\u{1F1FA}", desc: "Flag: European Union" },
    { value: "\u{1F1EB}\u{1F1EE}", desc: "Flag: Finland" },
    { value: "\u{1F1EB}\u{1F1EF}", desc: "Flag: Fiji" },
    { value: "\u{1F1EB}\u{1F1F0}", desc: "Flag: Falkland Islands" },
    { value: "\u{1F1EB}\u{1F1F2}", desc: "Flag: Micronesia" },
    { value: "\u{1F1EB}\u{1F1F4}", desc: "Flag: Faroe Islands" },
    { value: "\u{1F1EB}\u{1F1F7}", desc: "Flag: France" },
    { value: "\u{1F1EC}\u{1F1E6}", desc: "Flag: Gabon" },
    { value: "\u{1F1EC}\u{1F1E7}", desc: "Flag: United Kingdom" },
    { value: "\u{1F1EC}\u{1F1E9}", desc: "Flag: Grenada" },
    { value: "\u{1F1EC}\u{1F1EA}", desc: "Flag: Georgia" },
    { value: "\u{1F1EC}\u{1F1EB}", desc: "Flag: French Guiana" },
    { value: "\u{1F1EC}\u{1F1EC}", desc: "Flag: Guernsey" },
    { value: "\u{1F1EC}\u{1F1ED}", desc: "Flag: Ghana" },
    { value: "\u{1F1EC}\u{1F1EE}", desc: "Flag: Gibraltar" },
    { value: "\u{1F1EC}\u{1F1F1}", desc: "Flag: Greenland" },
    { value: "\u{1F1EC}\u{1F1F2}", desc: "Flag: Gambia" },
    { value: "\u{1F1EC}\u{1F1F3}", desc: "Flag: Guinea" },
    { value: "\u{1F1EC}\u{1F1F5}", desc: "Flag: Guadeloupe" },
    { value: "\u{1F1EC}\u{1F1F6}", desc: "Flag: Equatorial Guinea" },
    { value: "\u{1F1EC}\u{1F1F7}", desc: "Flag: Greece" },
    { value: "\u{1F1EC}\u{1F1F8}", desc: "Flag: South Georgia & South Sandwich Islands" },
    { value: "\u{1F1EC}\u{1F1F9}", desc: "Flag: Guatemala" },
    { value: "\u{1F1EC}\u{1F1FA}", desc: "Flag: Guam" },
    { value: "\u{1F1EC}\u{1F1FC}", desc: "Flag: Guinea-Bissau" },
    { value: "\u{1F1EC}\u{1F1FE}", desc: "Flag: Guyana" },
    { value: "\u{1F1ED}\u{1F1F0}", desc: "Flag: Hong Kong SAR China" },
    { value: "\u{1F1ED}\u{1F1F2}", desc: "Flag: Heard & McDonald Islands" },
    { value: "\u{1F1ED}\u{1F1F3}", desc: "Flag: Honduras" },
    { value: "\u{1F1ED}\u{1F1F7}", desc: "Flag: Croatia" },
    { value: "\u{1F1ED}\u{1F1F9}", desc: "Flag: Haiti" },
    { value: "\u{1F1ED}\u{1F1FA}", desc: "Flag: Hungary" },
    { value: "\u{1F1EE}\u{1F1E8}", desc: "Flag: Canary Islands" },
    { value: "\u{1F1EE}\u{1F1E9}", desc: "Flag: Indonesia" },
    { value: "\u{1F1EE}\u{1F1EA}", desc: "Flag: Ireland" },
    { value: "\u{1F1EE}\u{1F1F1}", desc: "Flag: Israel" },
    { value: "\u{1F1EE}\u{1F1F2}", desc: "Flag: Isle of Man" },
    { value: "\u{1F1EE}\u{1F1F3}", desc: "Flag: India" },
    { value: "\u{1F1EE}\u{1F1F4}", desc: "Flag: British Indian Ocean Territory" },
    { value: "\u{1F1EE}\u{1F1F6}", desc: "Flag: Iraq" },
    { value: "\u{1F1EE}\u{1F1F7}", desc: "Flag: Iran" },
    { value: "\u{1F1EE}\u{1F1F8}", desc: "Flag: Iceland" },
    { value: "\u{1F1EE}\u{1F1F9}", desc: "Flag: Italy" },
    { value: "\u{1F1EF}\u{1F1EA}", desc: "Flag: Jersey" },
    { value: "\u{1F1EF}\u{1F1F2}", desc: "Flag: Jamaica" },
    { value: "\u{1F1EF}\u{1F1F4}", desc: "Flag: Jordan" },
    { value: "\u{1F1EF}\u{1F1F5}", desc: "Flag: Japan" },
    { value: "\u{1F1F0}\u{1F1EA}", desc: "Flag: Kenya" },
    { value: "\u{1F1F0}\u{1F1EC}", desc: "Flag: Kyrgyzstan" },
    { value: "\u{1F1F0}\u{1F1ED}", desc: "Flag: Cambodia" },
    { value: "\u{1F1F0}\u{1F1EE}", desc: "Flag: Kiribati" },
    { value: "\u{1F1F0}\u{1F1F2}", desc: "Flag: Comoros" },
    { value: "\u{1F1F0}\u{1F1F3}", desc: "Flag: St. Kitts & Nevis" },
    { value: "\u{1F1F0}\u{1F1F5}", desc: "Flag: North Korea" },
    { value: "\u{1F1F0}\u{1F1F7}", desc: "Flag: South Korea" },
    { value: "\u{1F1F0}\u{1F1FC}", desc: "Flag: Kuwait" },
    { value: "\u{1F1F0}\u{1F1FE}", desc: "Flag: Cayman Islands" },
    { value: "\u{1F1F0}\u{1F1FF}", desc: "Flag: Kazakhstan" },
    { value: "\u{1F1F1}\u{1F1E6}", desc: "Flag: Laos" },
    { value: "\u{1F1F1}\u{1F1E7}", desc: "Flag: Lebanon" },
    { value: "\u{1F1F1}\u{1F1E8}", desc: "Flag: St. Lucia" },
    { value: "\u{1F1F1}\u{1F1EE}", desc: "Flag: Liechtenstein" },
    { value: "\u{1F1F1}\u{1F1F0}", desc: "Flag: Sri Lanka" },
    { value: "\u{1F1F1}\u{1F1F7}", desc: "Flag: Liberia" },
    { value: "\u{1F1F1}\u{1F1F8}", desc: "Flag: Lesotho" },
    { value: "\u{1F1F1}\u{1F1F9}", desc: "Flag: Lithuania" },
    { value: "\u{1F1F1}\u{1F1FA}", desc: "Flag: Luxembourg" },
    { value: "\u{1F1F1}\u{1F1FB}", desc: "Flag: Latvia" },
    { value: "\u{1F1F1}\u{1F1FE}", desc: "Flag: Libya" },
    { value: "\u{1F1F2}\u{1F1E6}", desc: "Flag: Morocco" },
    { value: "\u{1F1F2}\u{1F1E8}", desc: "Flag: Monaco" },
    { value: "\u{1F1F2}\u{1F1E9}", desc: "Flag: Moldova" },
    { value: "\u{1F1F2}\u{1F1EA}", desc: "Flag: Montenegro" },
    { value: "\u{1F1F2}\u{1F1EB}", desc: "Flag: St. Martin" },
    { value: "\u{1F1F2}\u{1F1EC}", desc: "Flag: Madagascar" },
    { value: "\u{1F1F2}\u{1F1ED}", desc: "Flag: Marshall Islands" },
    { value: "\u{1F1F2}\u{1F1F0}", desc: "Flag: North Macedonia" },
    { value: "\u{1F1F2}\u{1F1F1}", desc: "Flag: Mali" },
    { value: "\u{1F1F2}\u{1F1F2}", desc: "Flag: Myanmar (Burma)" },
    { value: "\u{1F1F2}\u{1F1F3}", desc: "Flag: Mongolia" },
    { value: "\u{1F1F2}\u{1F1F4}", desc: "Flag: Macao Sar China" },
    { value: "\u{1F1F2}\u{1F1F5}", desc: "Flag: Northern Mariana Islands" },
    { value: "\u{1F1F2}\u{1F1F6}", desc: "Flag: Martinique" },
    { value: "\u{1F1F2}\u{1F1F7}", desc: "Flag: Mauritania" },
    { value: "\u{1F1F2}\u{1F1F8}", desc: "Flag: Montserrat" },
    { value: "\u{1F1F2}\u{1F1F9}", desc: "Flag: Malta" },
    { value: "\u{1F1F2}\u{1F1FA}", desc: "Flag: Mauritius" },
    { value: "\u{1F1F2}\u{1F1FB}", desc: "Flag: Maldives" },
    { value: "\u{1F1F2}\u{1F1FC}", desc: "Flag: Malawi" },
    { value: "\u{1F1F2}\u{1F1FD}", desc: "Flag: Mexico" },
    { value: "\u{1F1F2}\u{1F1FE}", desc: "Flag: Malaysia" },
    { value: "\u{1F1F2}\u{1F1FF}", desc: "Flag: Mozambique" },
    { value: "\u{1F1F3}\u{1F1E6}", desc: "Flag: Namibia" },
    { value: "\u{1F1F3}\u{1F1E8}", desc: "Flag: New Caledonia" },
    { value: "\u{1F1F3}\u{1F1EA}", desc: "Flag: Niger" },
    { value: "\u{1F1F3}\u{1F1EB}", desc: "Flag: Norfolk Island" },
    { value: "\u{1F1F3}\u{1F1EC}", desc: "Flag: Nigeria" },
    { value: "\u{1F1F3}\u{1F1EE}", desc: "Flag: Nicaragua" },
    { value: "\u{1F1F3}\u{1F1F1}", desc: "Flag: Netherlands" },
    { value: "\u{1F1F3}\u{1F1F4}", desc: "Flag: Norway" },
    { value: "\u{1F1F3}\u{1F1F5}", desc: "Flag: Nepal" },
    { value: "\u{1F1F3}\u{1F1F7}", desc: "Flag: Nauru" },
    { value: "\u{1F1F3}\u{1F1FA}", desc: "Flag: Niue" },
    { value: "\u{1F1F3}\u{1F1FF}", desc: "Flag: New Zealand" },
    { value: "\u{1F1F4}\u{1F1F2}", desc: "Flag: Oman" },
    { value: "\u{1F1F5}\u{1F1E6}", desc: "Flag: Panama" },
    { value: "\u{1F1F5}\u{1F1EA}", desc: "Flag: Peru" },
    { value: "\u{1F1F5}\u{1F1EB}", desc: "Flag: French Polynesia" },
    { value: "\u{1F1F5}\u{1F1EC}", desc: "Flag: Papua New Guinea" },
    { value: "\u{1F1F5}\u{1F1ED}", desc: "Flag: Philippines" },
    { value: "\u{1F1F5}\u{1F1F0}", desc: "Flag: Pakistan" },
    { value: "\u{1F1F5}\u{1F1F1}", desc: "Flag: Poland" },
    { value: "\u{1F1F5}\u{1F1F2}", desc: "Flag: St. Pierre & Miquelon" },
    { value: "\u{1F1F5}\u{1F1F3}", desc: "Flag: Pitcairn Islands" },
    { value: "\u{1F1F5}\u{1F1F7}", desc: "Flag: Puerto Rico" },
    { value: "\u{1F1F5}\u{1F1F8}", desc: "Flag: Palestinian Territories" },
    { value: "\u{1F1F5}\u{1F1F9}", desc: "Flag: Portugal" },
    { value: "\u{1F1F5}\u{1F1FC}", desc: "Flag: Palau" },
    { value: "\u{1F1F5}\u{1F1FE}", desc: "Flag: Paraguay" },
    { value: "\u{1F1F6}\u{1F1E6}", desc: "Flag: Qatar" },
    { value: "\u{1F1F7}\u{1F1EA}", desc: "Flag: Réunion" },
    { value: "\u{1F1F7}\u{1F1F4}", desc: "Flag: Romania" },
    { value: "\u{1F1F7}\u{1F1F8}", desc: "Flag: Serbia" },
    { value: "\u{1F1F7}\u{1F1FA}", desc: "Flag: Russia" },
    { value: "\u{1F1F7}\u{1F1FC}", desc: "Flag: Rwanda" },
    { value: "\u{1F1F8}\u{1F1E6}", desc: "Flag: Saudi Arabia" },
    { value: "\u{1F1F8}\u{1F1E7}", desc: "Flag: Solomon Islands" },
    { value: "\u{1F1F8}\u{1F1E8}", desc: "Flag: Seychelles" },
    { value: "\u{1F1F8}\u{1F1E9}", desc: "Flag: Sudan" },
    { value: "\u{1F1F8}\u{1F1EA}", desc: "Flag: Sweden" },
    { value: "\u{1F1F8}\u{1F1EC}", desc: "Flag: Singapore" },
    { value: "\u{1F1F8}\u{1F1ED}", desc: "Flag: St. Helena" },
    { value: "\u{1F1F8}\u{1F1EE}", desc: "Flag: Slovenia" },
    { value: "\u{1F1F8}\u{1F1EF}", desc: "Flag: Svalbard & Jan Mayen" },
    { value: "\u{1F1F8}\u{1F1F0}", desc: "Flag: Slovakia" },
    { value: "\u{1F1F8}\u{1F1F1}", desc: "Flag: Sierra Leone" },
    { value: "\u{1F1F8}\u{1F1F2}", desc: "Flag: San Marino" },
    { value: "\u{1F1F8}\u{1F1F3}", desc: "Flag: Senegal" },
    { value: "\u{1F1F8}\u{1F1F4}", desc: "Flag: Somalia" },
    { value: "\u{1F1F8}\u{1F1F7}", desc: "Flag: Suriname" },
    { value: "\u{1F1F8}\u{1F1F8}", desc: "Flag: South Sudan" },
    { value: "\u{1F1F8}\u{1F1F9}", desc: "Flag: São Tomé & Príncipe" },
    { value: "\u{1F1F8}\u{1F1FB}", desc: "Flag: El Salvador" },
    { value: "\u{1F1F8}\u{1F1FD}", desc: "Flag: Sint Maarten" },
    { value: "\u{1F1F8}\u{1F1FE}", desc: "Flag: Syria" },
    { value: "\u{1F1F8}\u{1F1FF}", desc: "Flag: Eswatini" },
    { value: "\u{1F1F9}\u{1F1E6}", desc: "Flag: Tristan Da Cunha" },
    { value: "\u{1F1F9}\u{1F1E8}", desc: "Flag: Turks & Caicos Islands" },
    { value: "\u{1F1F9}\u{1F1E9}", desc: "Flag: Chad" },
    { value: "\u{1F1F9}\u{1F1EB}", desc: "Flag: French Southern Territories" },
    { value: "\u{1F1F9}\u{1F1EC}", desc: "Flag: Togo" },
    { value: "\u{1F1F9}\u{1F1ED}", desc: "Flag: Thailand" },
    { value: "\u{1F1F9}\u{1F1EF}", desc: "Flag: Tajikistan" },
    { value: "\u{1F1F9}\u{1F1F0}", desc: "Flag: Tokelau" },
    { value: "\u{1F1F9}\u{1F1F1}", desc: "Flag: Timor-Leste" },
    { value: "\u{1F1F9}\u{1F1F2}", desc: "Flag: Turkmenistan" },
    { value: "\u{1F1F9}\u{1F1F3}", desc: "Flag: Tunisia" },
    { value: "\u{1F1F9}\u{1F1F4}", desc: "Flag: Tonga" },
    { value: "\u{1F1F9}\u{1F1F7}", desc: "Flag: Turkey" },
    { value: "\u{1F1F9}\u{1F1F9}", desc: "Flag: Trinidad & Tobago" },
    { value: "\u{1F1F9}\u{1F1FB}", desc: "Flag: Tuvalu" },
    { value: "\u{1F1F9}\u{1F1FC}", desc: "Flag: Taiwan" },
    { value: "\u{1F1F9}\u{1F1FF}", desc: "Flag: Tanzania" },
    { value: "\u{1F1FA}\u{1F1E6}", desc: "Flag: Ukraine" },
    { value: "\u{1F1FA}\u{1F1EC}", desc: "Flag: Uganda" },
    { value: "\u{1F1FA}\u{1F1F2}", desc: "Flag: U.S. Outlying Islands" },
    { value: "\u{1F1FA}\u{1F1F3}", desc: "Flag: United Nations" },
    { value: "\u{1F1FA}\u{1F1F8}", desc: "Flag: United States" },
    { value: "\u{1F1FA}\u{1F1FE}", desc: "Flag: Uruguay" },
    { value: "\u{1F1FA}\u{1F1FF}", desc: "Flag: Uzbekistan" },
    { value: "\u{1F1FB}\u{1F1E6}", desc: "Flag: Vatican City" },
    { value: "\u{1F1FB}\u{1F1E8}", desc: "Flag: St. Vincent & Grenadines" },
    { value: "\u{1F1FB}\u{1F1EA}", desc: "Flag: Venezuela" },
    { value: "\u{1F1FB}\u{1F1EC}", desc: "Flag: British Virgin Islands" },
    { value: "\u{1F1FB}\u{1F1EE}", desc: "Flag: U.S. Virgin Islands" },
    { value: "\u{1F1FB}\u{1F1F3}", desc: "Flag: Vietnam" },
    { value: "\u{1F1FB}\u{1F1FA}", desc: "Flag: Vanuatu" },
    { value: "\u{1F1FC}\u{1F1EB}", desc: "Flag: Wallis & Futuna" },
    { value: "\u{1F1FC}\u{1F1F8}", desc: "Flag: Samoa" },
    { value: "\u{1F1FD}\u{1F1F0}", desc: "Flag: Kosovo" },
    { value: "\u{1F1FE}\u{1F1EA}", desc: "Flag: Yemen" },
    { value: "\u{1F1FE}\u{1F1F9}", desc: "Flag: Mayotte" },
    { value: "\u{1F1FF}\u{1F1E6}", desc: "Flag: South Africa" },
    { value: "\u{1F1FF}\u{1F1F2}", desc: "Flag: Zambia" },
    { value: "\u{1F1FF}\u{1F1FC}", desc: "Flag: Zimbabwe" },
];
const flags = [
    { value: "\u{1F38C}", desc: "Crossed Flags" },
    { value: "\u{1F3C1}", desc: "Chequered Flag" },
    { value: "\u{1F3F3}\u{FE0F}", desc: "White Flag" },
    { value: "\u{1F3F3}\u{FE0F}\u{200D}\u{1F308}", desc: "Rainbow Flag" },
    { value: "\u{1F3F3}\u{FE0F}\u{200D}\u{26A7}\u{FE0F}", desc: "Transgender Flag" },
    { value: "\u{1F3F4}", desc: "Black Flag" },
    { value: "\u{1F3F4}\u{200D}\u{2620}\u{FE0F}", desc: "Pirate Flag" },
    { value: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}", desc: "Flag: England" },
    { value: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}", desc: "Flag: Scotland" },
    { value: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}", desc: "Flag: Wales" },
    { value: "\u{1F6A9}", desc: "Triangular Flag" },
];

const motorcycle = { value: "\u{1F3CD}\u{FE0F}", desc: "Motorcycle" };
const racingCar = { value: "\u{1F3CE}\u{FE0F}", desc: "Racing Car" };
const seat = { value: "\u{1F4BA}", desc: "Seat" };
const rocket = { value: "\u{1F680}", desc: "Rocket" };
const helicopter = { value: "\u{1F681}", desc: "Helicopter" };
const locomotive = { value: "\u{1F682}", desc: "Locomotive" };
const railwayCar = { value: "\u{1F683}", desc: "Railway Car" };
const highspeedTrain = { value: "\u{1F684}", desc: "High-Speed Train" };
const bulletTrain = { value: "\u{1F685}", desc: "Bullet Train" };
const train = { value: "\u{1F686}", desc: "Train" };
const metro = { value: "\u{1F687}", desc: "Metro" };
const lightRail = { value: "\u{1F688}", desc: "Light Rail" };
const station = { value: "\u{1F689}", desc: "Station" };
const tram = { value: "\u{1F68A}", desc: "Tram" };
const tramCar = { value: "\u{1F68B}", desc: "Tram Car" };
const bus = { value: "\u{1F68C}", desc: "Bus" };
const oncomingBus = { value: "\u{1F68D}", desc: "Oncoming Bus" };
const trolleyBus = { value: "\u{1F68E}", desc: "Trolleybus" };
const busStop = { value: "\u{1F68F}", desc: "Bus Stop" };
const miniBus = { value: "\u{1F690}", desc: "Minibus" };
const ambulance = { value: "\u{1F691}", desc: "Ambulance" };
const fireEngine = { value: "\u{1F692}", desc: "Fire Engine" };
const taxi = { value: "\u{1F695}", desc: "Taxi" };
const oncomingTaxi = { value: "\u{1F696}", desc: "Oncoming Taxi" };
const automobile = { value: "\u{1F697}", desc: "Automobile" };
const oncomingAutomobile = { value: "\u{1F698}", desc: "Oncoming Automobile" };
const sportUtilityVehicle = { value: "\u{1F699}", desc: "Sport Utility Vehicle" };
const deliveryTruck = { value: "\u{1F69A}", desc: "Delivery Truck" };
const articulatedLorry = { value: "\u{1F69B}", desc: "Articulated Lorry" };
const tractor = { value: "\u{1F69C}", desc: "Tractor" };
const monorail = { value: "\u{1F69D}", desc: "Monorail" };
const mountainRailway = { value: "\u{1F69E}", desc: "Mountain Railway" };
const suspensionRailway = { value: "\u{1F69F}", desc: "Suspension Railway" };
const mountainCableway = { value: "\u{1F6A0}", desc: "Mountain Cableway" };
const aerialTramway = { value: "\u{1F6A1}", desc: "Aerial Tramway" };
const ship = { value: "\u{1F6A2}", desc: "Ship" };
const speedBoat = { value: "\u{1F6A4}", desc: "Speedboat" };
const horizontalTrafficLight = { value: "\u{1F6A5}", desc: "Horizontal Traffic Light" };
const verticalTrafficLight = { value: "\u{1F6A6}", desc: "Vertical Traffic Light" };
const construction = { value: "\u{1F6A7}", desc: "Construction" };
const bicycle = { value: "\u{1F6B2}", desc: "Bicycle" };
const stopSign = { value: "\u{1F6D1}", desc: "Stop Sign" };
const oilDrum = { value: "\u{1F6E2}\u{FE0F}", desc: "Oil Drum" };
const motorway = { value: "\u{1F6E3}\u{FE0F}", desc: "Motorway" };
const railwayTrack = { value: "\u{1F6E4}\u{FE0F}", desc: "Railway Track" };
const motorBoat = { value: "\u{1F6E5}\u{FE0F}", desc: "Motor Boat" };
const smallAirplane = { value: "\u{1F6E9}\u{FE0F}", desc: "Small Airplane" };
const airplaneDeparture = { value: "\u{1F6EB}", desc: "Airplane Departure" };
const airplaneArrival = { value: "\u{1F6EC}", desc: "Airplane Arrival" };
const satellite = { value: "\u{1F6F0}\u{FE0F}", desc: "Satellite" };
const passengerShip = { value: "\u{1F6F3}\u{FE0F}", desc: "Passenger Ship" };
const kickScooter = { value: "\u{1F6F4}", desc: "Kick Scooter" };
const motorScooter = { value: "\u{1F6F5}", desc: "Motor Scooter" };
const canoe = { value: "\u{1F6F6}", desc: "Canoe" };
const flyingSaucer = { value: "\u{1F6F8}", desc: "Flying Saucer" };
const skateboard = { value: "\u{1F6F9}", desc: "Skateboard" };
const autoRickshaw = { value: "\u{1F6FA}", desc: "Auto Rickshaw" };
const pickupTruck = { value: "\u{1F6FB}", desc: "Pickup Truck" };
const rollerSkate = { value: "\u{1F6FC}", desc: "Roller Skate" };
const motorizedWheelchair = { value: "\u{1F9BC}", desc: "Motorized Wheelchair" };
const manualWheelchair = { value: "\u{1F9BD}", desc: "Manual Wheelchair" };
const parachute = { value: "\u{1FA82}", desc: "Parachute" };
const anchor = { value: "\u{2693}", desc: "Anchor" };
const ferry = { value: "\u{26F4}\u{FE0F}", desc: "Ferry" };
const sailboat = { value: "\u{26F5}", desc: "Sailboat" };
const fuelPump = { value: "\u{26FD}", desc: "Fuel Pump" };
const airplane = { value: "\u{2708}\u{FE0F}", desc: "Airplane" };
const vehicles = [
    motorcycle,
    racingCar,
    seat,
    rocket,
    helicopter,
    locomotive,
    railwayCar,
    highspeedTrain,
    bulletTrain,
    train,
    metro,
    lightRail,
    station,
    tram,
    tramCar,
    bus,
    oncomingBus,
    trolleyBus,
    busStop,
    miniBus,
    ambulance,
    fireEngine,
    taxi,
    oncomingTaxi,
    automobile,
    oncomingAutomobile,
    sportUtilityVehicle,
    deliveryTruck,
    articulatedLorry,
    tractor,
    monorail,
    mountainRailway,
    suspensionRailway,
    mountainCableway,
    aerialTramway,
    ship,
    speedBoat,
    horizontalTrafficLight,
    verticalTrafficLight,
    construction,
    bicycle,
    stopSign,
    oilDrum,
    motorway,
    railwayTrack,
    motorBoat,
    smallAirplane,
    airplaneDeparture,
    airplaneArrival,
    satellite,
    passengerShip,
    kickScooter,
    motorScooter,
    canoe,
    flyingSaucer,
    skateboard,
    autoRickshaw,
    pickupTruck,
    rollerSkate,
    motorizedWheelchair,
    manualWheelchair,
    parachute,
    anchor,
    ferry,
    sailboat,
    fuelPump,
    airplane,
];
const bloodTypes = [
    { value: "\u{1F170}", desc: "A Button (Blood Type)" },
    { value: "\u{1F171}", desc: "B Button (Blood Type)" },
    { value: "\u{1F17E}", desc: "O Button (Blood Type)" },
    { value: "\u{1F18E}", desc: "AB Button (Blood Type)" },
];
const regions = [
    { value: "\u{1F1E6}", desc: "Regional Indicator Symbol Letter A" },
    { value: "\u{1F1E7}", desc: "Regional Indicator Symbol Letter B" },
    { value: "\u{1F1E8}", desc: "Regional Indicator Symbol Letter C" },
    { value: "\u{1F1E9}", desc: "Regional Indicator Symbol Letter D" },
    { value: "\u{1F1EA}", desc: "Regional Indicator Symbol Letter E" },
    { value: "\u{1F1EB}", desc: "Regional Indicator Symbol Letter F" },
    { value: "\u{1F1EC}", desc: "Regional Indicator Symbol Letter G" },
    { value: "\u{1F1ED}", desc: "Regional Indicator Symbol Letter H" },
    { value: "\u{1F1EE}", desc: "Regional Indicator Symbol Letter I" },
    { value: "\u{1F1EF}", desc: "Regional Indicator Symbol Letter J" },
    { value: "\u{1F1F0}", desc: "Regional Indicator Symbol Letter K" },
    { value: "\u{1F1F1}", desc: "Regional Indicator Symbol Letter L" },
    { value: "\u{1F1F2}", desc: "Regional Indicator Symbol Letter M" },
    { value: "\u{1F1F3}", desc: "Regional Indicator Symbol Letter N" },
    { value: "\u{1F1F4}", desc: "Regional Indicator Symbol Letter O" },
    { value: "\u{1F1F5}", desc: "Regional Indicator Symbol Letter P" },
    { value: "\u{1F1F6}", desc: "Regional Indicator Symbol Letter Q" },
    { value: "\u{1F1F7}", desc: "Regional Indicator Symbol Letter R" },
    { value: "\u{1F1F8}", desc: "Regional Indicator Symbol Letter S" },
    { value: "\u{1F1F9}", desc: "Regional Indicator Symbol Letter T" },
    { value: "\u{1F1FA}", desc: "Regional Indicator Symbol Letter U" },
    { value: "\u{1F1FB}", desc: "Regional Indicator Symbol Letter V" },
    { value: "\u{1F1FC}", desc: "Regional Indicator Symbol Letter W" },
    { value: "\u{1F1FD}", desc: "Regional Indicator Symbol Letter X" },
    { value: "\u{1F1FE}", desc: "Regional Indicator Symbol Letter Y" },
    { value: "\u{1F1FF}", desc: "Regional Indicator Symbol Letter Z" },
];
const japanese = [
    { value: "\u{1F530}", desc: "Japanese Symbol for Beginner" },
    { value: "\u{1F201}", desc: "Japanese “Here” Button" },
    { value: "\u{1F202}\u{FE0F}", desc: "Japanese “Service Charge” Button" },
    { value: "\u{1F21A}", desc: "Japanese “Free of Charge” Button" },
    { value: "\u{1F22F}", desc: "Japanese “Reserved” Button" },
    { value: "\u{1F232}", desc: "Japanese “Prohibited” Button" },
    { value: "\u{1F233}", desc: "Japanese “Vacancy” Button" },
    { value: "\u{1F234}", desc: "Japanese “Passing Grade” Button" },
    { value: "\u{1F235}", desc: "Japanese “No Vacancy” Button" },
    { value: "\u{1F236}", desc: "Japanese “Not Free of Charge” Button" },
    { value: "\u{1F237}\u{FE0F}", desc: "Japanese “Monthly Amount” Button" },
    { value: "\u{1F238}", desc: "Japanese “Application” Button" },
    { value: "\u{1F239}", desc: "Japanese “Discount” Button" },
    { value: "\u{1F23A}", desc: "Japanese “Open for Business” Button" },
    { value: "\u{1F250}", desc: "Japanese “Bargain” Button" },
    { value: "\u{1F251}", desc: "Japanese “Acceptable” Button" },
    { value: "\u{3297}\u{FE0F}", desc: "Japanese “Congratulations” Button" },
    { value: "\u{3299}\u{FE0F}", desc: "Japanese “Secret” Button" },
];
const time = [
    { value: "\u{1F550}", desc: "One O’Clock" },
    { value: "\u{1F551}", desc: "Two O’Clock" },
    { value: "\u{1F552}", desc: "Three O’Clock" },
    { value: "\u{1F553}", desc: "Four O’Clock" },
    { value: "\u{1F554}", desc: "Five O’Clock" },
    { value: "\u{1F555}", desc: "Six O’Clock" },
    { value: "\u{1F556}", desc: "Seven O’Clock" },
    { value: "\u{1F557}", desc: "Eight O’Clock" },
    { value: "\u{1F558}", desc: "Nine O’Clock" },
    { value: "\u{1F559}", desc: "Ten O’Clock" },
    { value: "\u{1F55A}", desc: "Eleven O’Clock" },
    { value: "\u{1F55B}", desc: "Twelve O’Clock" },
    { value: "\u{1F55C}", desc: "One-Thirty" },
    { value: "\u{1F55D}", desc: "Two-Thirty" },
    { value: "\u{1F55E}", desc: "Three-Thirty" },
    { value: "\u{1F55F}", desc: "Four-Thirty" },
    { value: "\u{1F560}", desc: "Five-Thirty" },
    { value: "\u{1F561}", desc: "Six-Thirty" },
    { value: "\u{1F562}", desc: "Seven-Thirty" },
    { value: "\u{1F563}", desc: "Eight-Thirty" },
    { value: "\u{1F564}", desc: "Nine-Thirty" },
    { value: "\u{1F565}", desc: "Ten-Thirty" },
    { value: "\u{1F566}", desc: "Eleven-Thirty" },
    { value: "\u{1F567}", desc: "Twelve-Thirty" },
];
const clocks = [
    { value: "\u{1F570}\u{FE0F}", desc: "Mantelpiece Clock" },
    { value: "\u{231A}", desc: "Watch" },
    { value: "\u{23F0}", desc: "Alarm Clock" },
    { value: "\u{23F1}\u{FE0F}", desc: "Stopwatch" },
    { value: "\u{23F2}\u{FE0F}", desc: "Timer Clock" },
    { value: "\u{231B}", desc: "Hourglass Done" },
    { value: "\u{23F3}", desc: "Hourglass Not Done" },
];
const arrows = [
    { value: "\u{1F503}\u{FE0F}", desc: "Clockwise Vertical Arrows" },
    { value: "\u{1F504}\u{FE0F}", desc: "Counterclockwise Arrows Button" },
    { value: "\u{2194}\u{FE0F}", desc: "Left-Right Arrow" },
    { value: "\u{2195}\u{FE0F}", desc: "Up-Down Arrow" },
    { value: "\u{2196}\u{FE0F}", desc: "Up-Left Arrow" },
    { value: "\u{2197}\u{FE0F}", desc: "Up-Right Arrow" },
    { value: "\u{2198}\u{FE0F}", desc: "Down-Right Arrow" },
    { value: "\u{2199}\u{FE0F}", desc: "Down-Left Arrow" },
    { value: "\u{21A9}\u{FE0F}", desc: "Right Arrow Curving Left" },
    { value: "\u{21AA}\u{FE0F}", desc: "Left Arrow Curving Right" },
    { value: "\u{27A1}\u{FE0F}", desc: "Right Arrow" },
    { value: "\u{2934}\u{FE0F}", desc: "Right Arrow Curving Up" },
    { value: "\u{2935}\u{FE0F}", desc: "Right Arrow Curving Down" },
    { value: "\u{2B05}\u{FE0F}", desc: "Left Arrow" },
    { value: "\u{2B06}\u{FE0F}", desc: "Up Arrow" },
    { value: "\u{2B07}\u{FE0F}", desc: "Down Arrow" },
];
const shapes = [
    { value: "\u{1F534}", desc: "Red Circle" },
    { value: "\u{1F535}", desc: "Blue Circle" },
    { value: "\u{1F536}", desc: "Large Orange Diamond" },
    { value: "\u{1F537}", desc: "Large Blue Diamond" },
    { value: "\u{1F538}", desc: "Small Orange Diamond" },
    { value: "\u{1F539}", desc: "Small Blue Diamond" },
    { value: "\u{1F53A}", desc: "Red Triangle Pointed Up" },
    { value: "\u{1F53B}", desc: "Red Triangle Pointed Down" },
    { value: "\u{1F7E0}", desc: "Orange Circle" },
    { value: "\u{1F7E1}", desc: "Yellow Circle" },
    { value: "\u{1F7E2}", desc: "Green Circle" },
    { value: "\u{1F7E3}", desc: "Purple Circle" },
    { value: "\u{1F7E4}", desc: "Brown Circle" },
    { value: "\u{2B55}", desc: "Hollow Red Circle" },
    { value: "\u{26AA}", desc: "White Circle" },
    { value: "\u{26AB}", desc: "Black Circle" },
    { value: "\u{1F7E5}", desc: "Red Square" },
    { value: "\u{1F7E6}", desc: "Blue Square" },
    { value: "\u{1F7E7}", desc: "Orange Square" },
    { value: "\u{1F7E8}", desc: "Yellow Square" },
    { value: "\u{1F7E9}", desc: "Green Square" },
    { value: "\u{1F7EA}", desc: "Purple Square" },
    { value: "\u{1F7EB}", desc: "Brown Square" },
    { value: "\u{1F532}", desc: "Black Square Button" },
    { value: "\u{1F533}", desc: "White Square Button" },
    { value: "\u{25AA}\u{FE0F}", desc: "Black Small Square" },
    { value: "\u{25AB}\u{FE0F}", desc: "White Small Square" },
    { value: "\u{25FD}", desc: "White Medium-Small Square" },
    { value: "\u{25FE}", desc: "Black Medium-Small Square" },
    { value: "\u{25FB}\u{FE0F}", desc: "White Medium Square" },
    { value: "\u{25FC}\u{FE0F}", desc: "Black Medium Square" },
    { value: "\u{2B1B}", desc: "Black Large Square" },
    { value: "\u{2B1C}", desc: "White Large Square" },
    { value: "\u{2B50}", desc: "Star" },
    { value: "\u{1F4A0}", desc: "Diamond with a Dot" }
];
const shuffleTracksButton = { value: "\u{1F500}", desc: "Shuffle Tracks Button" };
const repeatButton = { value: "\u{1F501}", desc: "Repeat Button" };
const repeatSingleButton = { value: "\u{1F502}", desc: "Repeat Single Button" };
const upwardsButton = { value: "\u{1F53C}", desc: "Upwards Button" };
const downwardsButton = { value: "\u{1F53D}", desc: "Downwards Button" };
const playButton = { value: "\u{25B6}\u{FE0F}", desc: "Play Button" };
const reverseButton = { value: "\u{25C0}\u{FE0F}", desc: "Reverse Button" };
const ejectButton = { value: "\u{23CF}\u{FE0F}", desc: "Eject Button" };
const fastForwardButton = { value: "\u{23E9}", desc: "Fast-Forward Button" };
const fastReverseButton = { value: "\u{23EA}", desc: "Fast Reverse Button" };
const fastUpButton = { value: "\u{23EB}", desc: "Fast Up Button" };
const fastDownButton = { value: "\u{23EC}", desc: "Fast Down Button" };
const nextTrackButton = { value: "\u{23ED}\u{FE0F}", desc: "Next Track Button" };
const lastTrackButton = { value: "\u{23EE}\u{FE0F}", desc: "Last Track Button" };
const playOrPauseButton = { value: "\u{23EF}\u{FE0F}", desc: "Play or Pause Button" };
const pauseButton = { value: "\u{23F8}\u{FE0F}", desc: "Pause Button" };
const stopButton = { value: "\u{23F9}\u{FE0F}", desc: "Stop Button" };
const recordButton = { value: "\u{23FA}\u{FE0F}", desc: "Record Button" };
const mediaPlayer = [
    shuffleTracksButton,
    repeatButton,
    repeatSingleButton,
    upwardsButton,
    downwardsButton,
    pauseButton,
    reverseButton,
    ejectButton,
    fastForwardButton,
    fastReverseButton,
    fastUpButton,
    fastDownButton,
    nextTrackButton,
    lastTrackButton,
    playOrPauseButton,
    pauseButton,
    stopButton,
    recordButton,
];
const zodiac = [
    { value: "\u{2648}", desc: "Aries" },
    { value: "\u{2649}", desc: "Taurus" },
    { value: "\u{264A}", desc: "Gemini" },
    { value: "\u{264B}", desc: "Cancer" },
    { value: "\u{264C}", desc: "Leo" },
    { value: "\u{264D}", desc: "Virgo" },
    { value: "\u{264E}", desc: "Libra" },
    { value: "\u{264F}", desc: "Scorpio" },
    { value: "\u{2650}", desc: "Sagittarius" },
    { value: "\u{2651}", desc: "Capricorn" },
    { value: "\u{2652}", desc: "Aquarius" },
    { value: "\u{2653}", desc: "Pisces" },
    { value: "\u{26CE}", desc: "Ophiuchus" },
];
const numbers = [
    { value: "\u{30}\u{FE0F}", desc: "Digit Zero" },
    { value: "\u{31}\u{FE0F}", desc: "Digit One" },
    { value: "\u{32}\u{FE0F}", desc: "Digit Two" },
    { value: "\u{33}\u{FE0F}", desc: "Digit Three" },
    { value: "\u{34}\u{FE0F}", desc: "Digit Four" },
    { value: "\u{35}\u{FE0F}", desc: "Digit Five" },
    { value: "\u{36}\u{FE0F}", desc: "Digit Six" },
    { value: "\u{37}\u{FE0F}", desc: "Digit Seven" },
    { value: "\u{38}\u{FE0F}", desc: "Digit Eight" },
    { value: "\u{39}\u{FE0F}", desc: "Digit Nine" },
    { value: "\u{2A}\u{FE0F}", desc: "Asterisk" },
    { value: "\u{23}\u{FE0F}", desc: "Number Sign" },
    { value: "\u{30}\u{FE0F}\u{20E3}", desc: "Keycap Digit Zero" },
    { value: "\u{31}\u{FE0F}\u{20E3}", desc: "Keycap Digit One" },
    { value: "\u{32}\u{FE0F}\u{20E3}", desc: "Keycap Digit Two" },
    { value: "\u{33}\u{FE0F}\u{20E3}", desc: "Keycap Digit Three" },
    { value: "\u{34}\u{FE0F}\u{20E3}", desc: "Keycap Digit Four" },
    { value: "\u{35}\u{FE0F}\u{20E3}", desc: "Keycap Digit Five" },
    { value: "\u{36}\u{FE0F}\u{20E3}", desc: "Keycap Digit Six" },
    { value: "\u{37}\u{FE0F}\u{20E3}", desc: "Keycap Digit Seven" },
    { value: "\u{38}\u{FE0F}\u{20E3}", desc: "Keycap Digit Eight" },
    { value: "\u{39}\u{FE0F}\u{20E3}", desc: "Keycap Digit Nine" },
    { value: "\u{2A}\u{FE0F}\u{20E3}", desc: "Keycap Asterisk" },
    { value: "\u{23}\u{FE0F}\u{20E3}", desc: "Keycap Number Sign" },
    { value: "\u{1F51F}", desc: "Keycap: 10" },
];
const tags = [
    { value: "\u{E0020}", desc: "Tag Space" },
    { value: "\u{E0021}", desc: "Tag Exclamation Mark" },
    { value: "\u{E0022}", desc: "Tag Quotation Mark" },
    { value: "\u{E0023}", desc: "Tag Number Sign" },
    { value: "\u{E0024}", desc: "Tag Dollar Sign" },
    { value: "\u{E0025}", desc: "Tag Percent Sign" },
    { value: "\u{E0026}", desc: "Tag Ampersand" },
    { value: "\u{E0027}", desc: "Tag Apostrophe" },
    { value: "\u{E0028}", desc: "Tag Left Parenthesis" },
    { value: "\u{E0029}", desc: "Tag Right Parenthesis" },
    { value: "\u{E002A}", desc: "Tag Asterisk" },
    { value: "\u{E002B}", desc: "Tag Plus Sign" },
    { value: "\u{E002C}", desc: "Tag Comma" },
    { value: "\u{E002D}", desc: "Tag Hyphen-Minus" },
    { value: "\u{E002E}", desc: "Tag Full Stop" },
    { value: "\u{E002F}", desc: "Tag Solidus" },
    { value: "\u{E0030}", desc: "Tag Digit Zero" },
    { value: "\u{E0031}", desc: "Tag Digit One" },
    { value: "\u{E0032}", desc: "Tag Digit Two" },
    { value: "\u{E0033}", desc: "Tag Digit Three" },
    { value: "\u{E0034}", desc: "Tag Digit Four" },
    { value: "\u{E0035}", desc: "Tag Digit Five" },
    { value: "\u{E0036}", desc: "Tag Digit Six" },
    { value: "\u{E0037}", desc: "Tag Digit Seven" },
    { value: "\u{E0038}", desc: "Tag Digit Eight" },
    { value: "\u{E0039}", desc: "Tag Digit Nine" },
    { value: "\u{E003A}", desc: "Tag Colon" },
    { value: "\u{E003B}", desc: "Tag Semicolon" },
    { value: "\u{E003C}", desc: "Tag Less-Than Sign" },
    { value: "\u{E003D}", desc: "Tag Equals Sign" },
    { value: "\u{E003E}", desc: "Tag Greater-Than Sign" },
    { value: "\u{E003F}", desc: "Tag Question Mark" },
    { value: "\u{E0040}", desc: "Tag Commercial at" },
    { value: "\u{E0041}", desc: "Tag Latin Capital Letter a" },
    { value: "\u{E0042}", desc: "Tag Latin Capital Letter B" },
    { value: "\u{E0043}", desc: "Tag Latin Capital Letter C" },
    { value: "\u{E0044}", desc: "Tag Latin Capital Letter D" },
    { value: "\u{E0045}", desc: "Tag Latin Capital Letter E" },
    { value: "\u{E0046}", desc: "Tag Latin Capital Letter F" },
    { value: "\u{E0047}", desc: "Tag Latin Capital Letter G" },
    { value: "\u{E0048}", desc: "Tag Latin Capital Letter H" },
    { value: "\u{E0049}", desc: "Tag Latin Capital Letter I" },
    { value: "\u{E004A}", desc: "Tag Latin Capital Letter J" },
    { value: "\u{E004B}", desc: "Tag Latin Capital Letter K" },
    { value: "\u{E004C}", desc: "Tag Latin Capital Letter L" },
    { value: "\u{E004D}", desc: "Tag Latin Capital Letter M" },
    { value: "\u{E004E}", desc: "Tag Latin Capital Letter N" },
    { value: "\u{E004F}", desc: "Tag Latin Capital Letter O" },
    { value: "\u{E0050}", desc: "Tag Latin Capital Letter P" },
    { value: "\u{E0051}", desc: "Tag Latin Capital Letter Q" },
    { value: "\u{E0052}", desc: "Tag Latin Capital Letter R" },
    { value: "\u{E0053}", desc: "Tag Latin Capital Letter S" },
    { value: "\u{E0054}", desc: "Tag Latin Capital Letter T" },
    { value: "\u{E0055}", desc: "Tag Latin Capital Letter U" },
    { value: "\u{E0056}", desc: "Tag Latin Capital Letter V" },
    { value: "\u{E0057}", desc: "Tag Latin Capital Letter W" },
    { value: "\u{E0058}", desc: "Tag Latin Capital Letter X" },
    { value: "\u{E0059}", desc: "Tag Latin Capital Letter Y" },
    { value: "\u{E005A}", desc: "Tag Latin Capital Letter Z" },
    { value: "\u{E005B}", desc: "Tag Left Square Bracket" },
    { value: "\u{E005C}", desc: "Tag Reverse Solidus" },
    { value: "\u{E005D}", desc: "Tag Right Square Bracket" },
    { value: "\u{E005E}", desc: "Tag Circumflex Accent" },
    { value: "\u{E005F}", desc: "Tag Low Line" },
    { value: "\u{E0060}", desc: "Tag Grave Accent" },
    { value: "\u{E0061}", desc: "Tag Latin Small Letter a" },
    { value: "\u{E0062}", desc: "Tag Latin Small Letter B" },
    { value: "\u{E0063}", desc: "Tag Latin Small Letter C" },
    { value: "\u{E0064}", desc: "Tag Latin Small Letter D" },
    { value: "\u{E0065}", desc: "Tag Latin Small Letter E" },
    { value: "\u{E0066}", desc: "Tag Latin Small Letter F" },
    { value: "\u{E0067}", desc: "Tag Latin Small Letter G" },
    { value: "\u{E0068}", desc: "Tag Latin Small Letter H" },
    { value: "\u{E0069}", desc: "Tag Latin Small Letter I" },
    { value: "\u{E006A}", desc: "Tag Latin Small Letter J" },
    { value: "\u{E006B}", desc: "Tag Latin Small Letter K" },
    { value: "\u{E006C}", desc: "Tag Latin Small Letter L" },
    { value: "\u{E006D}", desc: "Tag Latin Small Letter M" },
    { value: "\u{E006E}", desc: "Tag Latin Small Letter N" },
    { value: "\u{E006F}", desc: "Tag Latin Small Letter O" },
    { value: "\u{E0070}", desc: "Tag Latin Small Letter P" },
    { value: "\u{E0071}", desc: "Tag Latin Small Letter Q" },
    { value: "\u{E0072}", desc: "Tag Latin Small Letter R" },
    { value: "\u{E0073}", desc: "Tag Latin Small Letter S" },
    { value: "\u{E0074}", desc: "Tag Latin Small Letter T" },
    { value: "\u{E0075}", desc: "Tag Latin Small Letter U" },
    { value: "\u{E0076}", desc: "Tag Latin Small Letter V" },
    { value: "\u{E0077}", desc: "Tag Latin Small Letter W" },
    { value: "\u{E0078}", desc: "Tag Latin Small Letter X" },
    { value: "\u{E0079}", desc: "Tag Latin Small Letter Y" },
    { value: "\u{E007A}", desc: "Tag Latin Small Letter Z" },
    { value: "\u{E007B}", desc: "Tag Left Curly Bracket" },
    { value: "\u{E007C}", desc: "Tag Vertical Line" },
    { value: "\u{E007D}", desc: "Tag Right Curly Bracket" },
    { value: "\u{E007E}", desc: "Tag Tilde" },
    { value: "\u{E007F}", desc: "Cancel Tag" },
];
const math = [
    { value: "\u{2716}\u{FE0F}", desc: "Multiply" },
    { value: "\u{2795}", desc: "Plus" },
    { value: "\u{2796}", desc: "Minus" },
    { value: "\u{2797}", desc: "Divide" },
];
const games = [
    { value: "\u{2660}\u{FE0F}", desc: "Spade Suit" },
    { value: "\u{2663}\u{FE0F}", desc: "Club Suit" },
    { value: "\u{2665}\u{FE0F}", desc: "Heart Suit", color: "red" },
    { value: "\u{2666}\u{FE0F}", desc: "Diamond Suit", color: "red" },
    { value: "\u{1F004}", desc: "Mahjong Red Dragon" },
    { value: "\u{1F0CF}", desc: "Joker" },
    { value: "\u{1F3AF}", desc: "Direct Hit" },
    { value: "\u{1F3B0}", desc: "Slot Machine" },
    { value: "\u{1F3B1}", desc: "Pool 8 Ball" },
    { value: "\u{1F3B2}", desc: "Game Die" },
    { value: "\u{1F3B3}", desc: "Bowling" },
    { value: "\u{1F3B4}", desc: "Flower Playing Cards" },
    { value: "\u{1F9E9}", desc: "Puzzle Piece" },
    { value: "\u{265F}\u{FE0F}", desc: "Chess Pawn" },
    { value: "\u{1FA80}", desc: "Yo-Yo" },
    { value: "\u{1FA81}", desc: "Kite" },
    { value: "\u{1FA83}", desc: "Boomerang" },
    { value: "\u{1FA86}", desc: "Nesting Dolls" },
];
const sportsEquipment = [
    { value: "\u{1F3BD}", desc: "Running Shirt" },
    { value: "\u{1F3BE}", desc: "Tennis" },
    { value: "\u{1F3BF}", desc: "Skis" },
    { value: "\u{1F3C0}", desc: "Basketball" },
    { value: "\u{1F3C5}", desc: "Sports Medal" },
    { value: "\u{1F3C6}", desc: "Trophy" },
    { value: "\u{1F3C8}", desc: "American Football" },
    { value: "\u{1F3C9}", desc: "Rugby Football" },
    { value: "\u{1F3CF}", desc: "Cricket Game" },
    { value: "\u{1F3D0}", desc: "Volleyball" },
    { value: "\u{1F3D1}", desc: "Field Hockey" },
    { value: "\u{1F3D2}", desc: "Ice Hockey" },
    { value: "\u{1F3D3}", desc: "Ping Pong" },
    { value: "\u{1F3F8}", desc: "Badminton" },
    { value: "\u{1F6F7}", desc: "Sled" },
    { value: "\u{1F945}", desc: "Goal Net" },
    { value: "\u{1F947}", desc: "1st Place Medal" },
    { value: "\u{1F948}", desc: "2nd Place Medal" },
    { value: "\u{1F949}", desc: "3rd Place Medal" },
    { value: "\u{1F94A}", desc: "Boxing Glove" },
    { value: "\u{1F94C}", desc: "Curling Stone" },
    { value: "\u{1F94D}", desc: "Lacrosse" },
    { value: "\u{1F94E}", desc: "Softball" },
    { value: "\u{1F94F}", desc: "Flying Disc" },
    { value: "\u{26BD}", desc: "Soccer Ball" },
    { value: "\u{26BE}", desc: "Baseball" },
    { value: "\u{26F8}\u{FE0F}", desc: "Ice Skate" },
];
const clothing = [
    { value: "\u{1F3A9}", desc: "Top Hat" },
    { value: "\u{1F93F}", desc: "Diving Mask" },
    { value: "\u{1F452}", desc: "Woman’s Hat" },
    { value: "\u{1F453}", desc: "Glasses" },
    { value: "\u{1F576}\u{FE0F}", desc: "Sunglasses" },
    { value: "\u{1F454}", desc: "Necktie" },
    { value: "\u{1F455}", desc: "T-Shirt" },
    { value: "\u{1F456}", desc: "Jeans" },
    { value: "\u{1F457}", desc: "Dress" },
    { value: "\u{1F458}", desc: "Kimono" },
    { value: "\u{1F459}", desc: "Bikini" },
    { value: "\u{1F45A}", desc: "Woman’s Clothes" },
    { value: "\u{1F45B}", desc: "Purse" },
    { value: "\u{1F45C}", desc: "Handbag" },
    { value: "\u{1F45D}", desc: "Clutch Bag" },
    { value: "\u{1F45E}", desc: "Man’s Shoe" },
    { value: "\u{1F45F}", desc: "Running Shoe" },
    { value: "\u{1F460}", desc: "High-Heeled Shoe" },
    { value: "\u{1F461}", desc: "Woman’s Sandal" },
    { value: "\u{1F462}", desc: "Woman’s Boot" },
    { value: "\u{1F94B}", desc: "Martial Arts Uniform" },
    { value: "\u{1F97B}", desc: "Sari" },
    { value: "\u{1F97C}", desc: "Lab Coat" },
    { value: "\u{1F97D}", desc: "Goggles" },
    { value: "\u{1F97E}", desc: "Hiking Boot" },
    { value: "\u{1F97F}", desc: "Flat Shoe" },
    { value: "\u{1F9AF}", desc: "White Cane" },
    { value: "\u{1F9BA}", desc: "Safety Vest" },
    { value: "\u{1F9E2}", desc: "Billed Cap" },
    { value: "\u{1F9E3}", desc: "Scarf" },
    { value: "\u{1F9E4}", desc: "Gloves" },
    { value: "\u{1F9E5}", desc: "Coat" },
    { value: "\u{1F9E6}", desc: "Socks" },
    { value: "\u{1F9FF}", desc: "Nazar Amulet" },
    { value: "\u{1FA70}", desc: "Ballet Shoes" },
    { value: "\u{1FA71}", desc: "One-Piece Swimsuit" },
    { value: "\u{1FA72}", desc: "Briefs" },
    { value: "\u{1FA73}", desc: "Shorts" },
    { value: "\u{1FA74}", desc: "Thong Sandal" },
];
const town = [
    { value: "\u{1F3D7}\u{FE0F}", desc: "Building Construction" },
    { value: "\u{1F3D8}\u{FE0F}", desc: "Houses" },
    { value: "\u{1F3D9}\u{FE0F}", desc: "Cityscape" },
    { value: "\u{1F3DA}\u{FE0F}", desc: "Derelict House" },
    { value: "\u{1F3DB}\u{FE0F}", desc: "Classical Building" },
    { value: "\u{1F3DC}\u{FE0F}", desc: "Desert" },
    { value: "\u{1F3DD}\u{FE0F}", desc: "Desert Island" },
    { value: "\u{1F3DE}\u{FE0F}", desc: "National Park" },
    { value: "\u{1F3DF}\u{FE0F}", desc: "Stadium" },
    { value: "\u{1F3E0}", desc: "House" },
    { value: "\u{1F3E1}", desc: "House with Garden" },
    { value: "\u{1F3E2}", desc: "Office Building" },
    { value: "\u{1F3E3}", desc: "Japanese Post Office" },
    { value: "\u{1F3E4}", desc: "Post Office" },
    { value: "\u{1F3E5}", desc: "Hospital" },
    { value: "\u{1F3E6}", desc: "Bank" },
    { value: "\u{1F3E7}", desc: "ATM Sign" },
    { value: "\u{1F3E8}", desc: "Hotel" },
    { value: "\u{1F3E9}", desc: "Love Hotel" },
    { value: "\u{1F3EA}", desc: "Convenience Store" },
    { value: "\u{1F3EB}", desc: "School" },
    { value: "\u{1F3EC}", desc: "Department Store" },
    { value: "\u{1F3ED}", desc: "Factory" },
    { value: "\u{1F309}", desc: "Bridge at Night" },
    { value: "\u{26F2}", desc: "Fountain" },
    { value: "\u{1F6CD}\u{FE0F}", desc: "Shopping Bags" },
    { value: "\u{1F9FE}", desc: "Receipt" },
    { value: "\u{1F6D2}", desc: "Shopping Cart" },
    { value: "\u{1F488}", desc: "Barber Pole" },
    { value: "\u{1F492}", desc: "Wedding" },
    { value: "\u{1F6D6}", desc: "Hut" },
    { value: "\u{1F6D7}", desc: "Elevator" },
    { value: "\u{1F5F3}\u{FE0F}", desc: "Ballot Box with Ballot" }
];
const buttons = [
    { value: "\u{1F191}", desc: "CL Button" },
    { value: "\u{1F192}", desc: "Cool Button" },
    { value: "\u{1F193}", desc: "Free Button" },
    { value: "\u{1F194}", desc: "ID Button" },
    { value: "\u{1F195}", desc: "New Button" },
    { value: "\u{1F196}", desc: "NG Button" },
    { value: "\u{1F197}", desc: "OK Button" },
    { value: "\u{1F198}", desc: "SOS Button" },
    { value: "\u{1F199}", desc: "Up! Button" },
    { value: "\u{1F19A}", desc: "Vs Button" },
    { value: "\u{1F518}", desc: "Radio Button" },
    { value: "\u{1F519}", desc: "Back Arrow" },
    { value: "\u{1F51A}", desc: "End Arrow" },
    { value: "\u{1F51B}", desc: "On! Arrow" },
    { value: "\u{1F51C}", desc: "Soon Arrow" },
    { value: "\u{1F51D}", desc: "Top Arrow" },
    { value: "\u{2611}\u{FE0F}", desc: "Check Box with Check" },
    { value: "\u{1F520}", desc: "Input Latin Uppercase" },
    { value: "\u{1F521}", desc: "Input Latin Lowercase" },
    { value: "\u{1F522}", desc: "Input Numbers" },
    { value: "\u{1F523}", desc: "Input Symbols" },
    { value: "\u{1F524}", desc: "Input Latin Letters" },
];
const music = [
    { value: "\u{1F3BC}", desc: "Musical Score" },
    { value: "\u{1F3B6}", desc: "Musical Notes" },
    { value: "\u{1F3B5}", desc: "Musical Note" },
    { value: "\u{1F3B7}", desc: "Saxophone" },
    { value: "\u{1F3B8}", desc: "Guitar" },
    { value: "\u{1F3B9}", desc: "Musical Keyboard" },
    { value: "\u{1F3BA}", desc: "Trumpet" },
    { value: "\u{1F3BB}", desc: "Violin" },
    { value: "\u{1F941}", desc: "Drum" },
    { value: "\u{1FA95}", desc: "Banjo" },
    { value: "\u{1FA97}", desc: "Accordion" },
    { value: "\u{1FA98}", desc: "Long Drum" },
];
const weather = [
    { value: "\u{1F304}", desc: "Sunrise Over Mountains" },
    { value: "\u{1F305}", desc: "Sunrise" },
    { value: "\u{1F306}", desc: "Cityscape at Dusk" },
    { value: "\u{1F307}", desc: "Sunset" },
    { value: "\u{1F303}", desc: "Night with Stars" },
    { value: "\u{1F302}", desc: "Closed Umbrella" },
    { value: "\u{2602}\u{FE0F}", desc: "Umbrella" },
    { value: "\u{2614}\u{FE0F}", desc: "Umbrella with Rain Drops" },
    { value: "\u{2603}\u{FE0F}", desc: "Snowman" },
    { value: "\u{26C4}", desc: "Snowman Without Snow" },
    { value: "\u{2600}\u{FE0F}", desc: "Sun" },
    { value: "\u{2601}\u{FE0F}", desc: "Cloud" },
    { value: "\u{1F324}\u{FE0F}", desc: "Sun Behind Small Cloud" },
    { value: "\u{26C5}", desc: "Sun Behind Cloud" },
    { value: "\u{1F325}\u{FE0F}", desc: "Sun Behind Large Cloud" },
    { value: "\u{1F326}\u{FE0F}", desc: "Sun Behind Rain Cloud" },
    { value: "\u{1F327}\u{FE0F}", desc: "Cloud with Rain" },
    { value: "\u{1F328}\u{FE0F}", desc: "Cloud with Snow" },
    { value: "\u{1F329}\u{FE0F}", desc: "Cloud with Lightning" },
    { value: "\u{26C8}\u{FE0F}", desc: "Cloud with Lightning and Rain" },
    { value: "\u{2744}\u{FE0F}", desc: "Snowflake" },
    { value: "\u{1F300}", desc: "Cyclone" },
    { value: "\u{1F32A}\u{FE0F}", desc: "Tornado" },
    { value: "\u{1F32C}\u{FE0F}", desc: "Wind Face" },
    { value: "\u{1F30A}", desc: "Water Wave" },
    { value: "\u{1F32B}\u{FE0F}", desc: "Fog" },
    { value: "\u{1F301}", desc: "Foggy" },
    { value: "\u{1F308}", desc: "Rainbow" },
    { value: "\u{1F321}\u{FE0F}", desc: "Thermometer" },
];
const astro = [
    { value: "\u{1F30C}", desc: "Milky Way" },
    { value: "\u{1F30D}", desc: "Globe Showing Europe-Africa" },
    { value: "\u{1F30E}", desc: "Globe Showing Americas" },
    { value: "\u{1F30F}", desc: "Globe Showing Asia-Australia" },
    { value: "\u{1F310}", desc: "Globe with Meridians" },
    { value: "\u{1F311}", desc: "New Moon" },
    { value: "\u{1F312}", desc: "Waxing Crescent Moon" },
    { value: "\u{1F313}", desc: "First Quarter Moon" },
    { value: "\u{1F314}", desc: "Waxing Gibbous Moon" },
    { value: "\u{1F315}", desc: "Full Moon" },
    { value: "\u{1F316}", desc: "Waning Gibbous Moon" },
    { value: "\u{1F317}", desc: "Last Quarter Moon" },
    { value: "\u{1F318}", desc: "Waning Crescent Moon" },
    { value: "\u{1F319}", desc: "Crescent Moon" },
    { value: "\u{1F31A}", desc: "New Moon Face" },
    { value: "\u{1F31B}", desc: "First Quarter Moon Face" },
    { value: "\u{1F31C}", desc: "Last Quarter Moon Face" },
    { value: "\u{1F31D}", desc: "Full Moon Face" },
    { value: "\u{1F31E}", desc: "Sun with Face" },
    { value: "\u{1F31F}", desc: "Glowing Star" },
    { value: "\u{1F320}", desc: "Shooting Star" },
    { value: "\u{2604}\u{FE0F}", desc: "Comet" },
    { value: "\u{1FA90}", desc: "Ringed Planet" },
];
const finance = [
    { value: "\u{1F4B0}", desc: "Money Bag" },
    { value: "\u{1F4B1}", desc: "Currency Exchange" },
    { value: "\u{1F4B2}", desc: "Heavy Dollar Sign" },
    { value: "\u{1F4B3}", desc: "Credit Card" },
    { value: "\u{1F4B4}", desc: "Yen Banknote" },
    { value: "\u{1F4B5}", desc: "Dollar Banknote" },
    { value: "\u{1F4B6}", desc: "Euro Banknote" },
    { value: "\u{1F4B7}", desc: "Pound Banknote" },
    { value: "\u{1F4B8}", desc: "Money with Wings" },
    { value: "\u{1F4B9}", desc: "Chart Increasing with Yen" },
    { value: "\u{1FA99}", desc: "Coin" },
];
const writing = [
    { value: "\u{1F58A}\u{FE0F}", desc: "Pen" },
    { value: "\u{1F58B}\u{FE0F}", desc: "Fountain Pen" },
    { value: "\u{1F58C}\u{FE0F}", desc: "Paintbrush" },
    { value: "\u{1F58D}\u{FE0F}", desc: "Crayon" },
    { value: "\u{270F}\u{FE0F}", desc: "Pencil" },
    { value: "\u{2712}\u{FE0F}", desc: "Black Nib" },
];
const droplet = { value: "\u{1F4A7}", desc: "Droplet" };
const dropOfBlood = { value: "\u{1FA78}", desc: "Drop of Blood" };
const adhesiveBandage = { value: "\u{1FA79}", desc: "Adhesive Bandage" };
const stehoscope = { value: "\u{1FA7A}", desc: "Stethoscope" };
const syringe = { value: "\u{1F489}", desc: "Syringe" };
const pill = { value: "\u{1F48A}", desc: "Pill" };
const micrscope = { value: "\u{1F52C}", desc: "Microscope" };
const testTube = { value: "\u{1F9EA}", desc: "Test Tube" };
const petriDish = { value: "\u{1F9EB}", desc: "Petri Dish" };
const dna = { value: "\u{1F9EC}", desc: "DNA" };
const abacus = { value: "\u{1F9EE}", desc: "Abacus" };
const magnet = { value: "\u{1F9F2}", desc: "Magnet" };
const telescope = { value: "\u{1F52D}", desc: "Telescope" };
const medicalSymbol = { value: "\u{2695}\u{FE0F}", desc: "Medical Symbol" };
const balanceScale = { value: "\u{2696}\u{FE0F}", desc: "Balance Scale" };
const alembic = { value: "\u{2697}\u{FE0F}", desc: "Alembic" };
const gear = { value: "\u{2699}\u{FE0F}", desc: "Gear" };
const atomSymbol = { value: "\u{269B}\u{FE0F}", desc: "Atom Symbol" };
const magnifyingGlassTiltedLeft = { value: "\u{1F50D}", desc: "Magnifying Glass Tilted Left" };
const magnifyingGlassTiltedRight = { value: "\u{1F50E}", desc: "Magnifying Glass Tilted Right" };
const science = [
    droplet,
    dropOfBlood,
    adhesiveBandage,
    stehoscope,
    syringe,
    pill,
    micrscope,
    testTube,
    petriDish,
    dna,
    abacus,
    magnet,
    telescope,
    medicalSymbol,
    balanceScale,
    alembic,
    gear,
    atomSymbol,
    magnifyingGlassTiltedLeft,
    magnifyingGlassTiltedRight,
];
const joystick = { value: "\u{1F579}\u{FE0F}", desc: "Joystick" };
const videoGame = { value: "\u{1F3AE}", desc: "Video Game" };
const lightBulb = { value: "\u{1F4A1}", desc: "Light Bulb" };
const laptop = { value: "\u{1F4BB}", desc: "Laptop" };
const briefcase = { value: "\u{1F4BC}", desc: "Briefcase" };
const computerDisk = { value: "\u{1F4BD}", desc: "Computer Disk" };
const floppyDisk = { value: "\u{1F4BE}", desc: "Floppy Disk" };
const opticalDisk = { value: "\u{1F4BF}", desc: "Optical Disk" };
const dvd = { value: "\u{1F4C0}", desc: "DVD" };
const desktopComputer = { value: "\u{1F5A5}\u{FE0F}", desc: "Desktop Computer" };
const keyboard = { value: "\u{2328}\u{FE0F}", desc: "Keyboard" };
const printer = { value: "\u{1F5A8}\u{FE0F}", desc: "Printer" };
const computerMouse = { value: "\u{1F5B1}\u{FE0F}", desc: "Computer Mouse" };
const trackball = { value: "\u{1F5B2}\u{FE0F}", desc: "Trackball" };
const telephone = { value: "\u{260E}\u{FE0F}", desc: "Telephone" };
const telephoneReceiver = { value: "\u{1F4DE}", desc: "Telephone Receiver" };
const pager = { value: "\u{1F4DF}", desc: "Pager" };
const faxMachine = { value: "\u{1F4E0}", desc: "Fax Machine" };
const satelliteAntenna = { value: "\u{1F4E1}", desc: "Satellite Antenna" };
const loudspeaker = { value: "\u{1F4E2}", desc: "Loudspeaker" };
const megaphone = { value: "\u{1F4E3}", desc: "Megaphone" };
const television = { value: "\u{1F4FA}", desc: "Television" };
const radio = { value: "\u{1F4FB}", desc: "Radio" };
const videocassette = { value: "\u{1F4FC}", desc: "Videocassette" };
const filProjector = { value: "\u{1F4FD}\u{FE0F}", desc: "Film Projector" };
const studioMicrophone = { value: "\u{1F399}\u{FE0F}", desc: "Studio Microphone" };
const levelSlider = { value: "\u{1F39A}\u{FE0F}", desc: "Level Slider" };
const controlKnobs = { value: "\u{1F39B}\u{FE0F}", desc: "Control Knobs" };
const microphone = { value: "\u{1F3A4}", desc: "Microphone" };
const movieCamera = { value: "\u{1F3A5}", desc: "Movie Camera" };
const headphone = { value: "\u{1F3A7}", desc: "Headphone" };
const camera = { value: "\u{1F4F7}", desc: "Camera" };
const cameraWithFlash = { value: "\u{1F4F8}", desc: "Camera with Flash" };
const videoCamera = { value: "\u{1F4F9}", desc: "Video Camera" };
const mobilePhone = { value: "\u{1F4F1}", desc: "Mobile Phone" };
const mobilePhoneOff = { value: "\u{1F4F4}", desc: "Mobile Phone Off" };
const mobilePhoneWithArrow = { value: "\u{1F4F2}", desc: "Mobile Phone with Arrow" };
const lockedWithPen = { value: "\u{1F50F}", desc: "Locked with Pen" };
const lockedWithKey = { value: "\u{1F510}", desc: "Locked with Key" };
const locked = { value: "\u{1F512}", desc: "Locked" };
const unlocked = { value: "\u{1F513}", desc: "Unlocked" };
const bell = { value: "\u{1F514}", desc: "Bell" };
const bellWithSlash = { value: "\u{1F515}", desc: "Bell with Slash" };
const bookmark = { value: "\u{1F516}", desc: "Bookmark" };
const link = { value: "\u{1F517}", desc: "Link" };
const vibrationMode = { value: "\u{1F4F3}", desc: "Vibration Mode" };
const antennaBars = { value: "\u{1F4F6}", desc: "Antenna Bars" };
const dimButton = { value: "\u{1F505}", desc: "Dim Button" };
const brightButton = { value: "\u{1F506}", desc: "Bright Button" };
const mutedSpeaker = { value: "\u{1F507}", desc: "Muted Speaker" };
const speakerLowVolume = { value: "\u{1F508}", desc: "Speaker Low Volume" };
const speakerMediumVolume = { value: "\u{1F509}", desc: "Speaker Medium Volume" };
const speakerHighVolume = { value: "\u{1F50A}", desc: "Speaker High Volume" };
const battery = { value: "\u{1F50B}", desc: "Battery" };
const electricPlug = { value: "\u{1F50C}", desc: "Electric Plug" };
const tech = [
    joystick,
    videoGame,
    lightBulb,
    laptop,
    briefcase,
    computerDisk,
    floppyDisk,
    opticalDisk,
    dvd,
    desktopComputer,
    keyboard,
    printer,
    computerMouse,
    trackball,
    telephone,
    telephoneReceiver,
    pager,
    faxMachine,
    satelliteAntenna,
    loudspeaker,
    megaphone,
    television,
    radio,
    videocassette,
    filProjector,
    studioMicrophone,
    levelSlider,
    controlKnobs,
    microphone,
    movieCamera,
    headphone,
    camera,
    cameraWithFlash,
    videoCamera,
    mobilePhone,
    mobilePhoneOff,
    mobilePhoneWithArrow,
    lockedWithPen,
    lockedWithKey,
    locked,
    unlocked,
    bell,
    bellWithSlash,
    bookmark,
    link,
    vibrationMode,
    antennaBars,
    dimButton,
    brightButton,
    mutedSpeaker,
    speakerLowVolume,
    speakerMediumVolume,
    speakerHighVolume,
    battery,
    electricPlug,
];
const mail = [
    { value: "\u{1F4E4}", desc: "Outbox Tray" },
    { value: "\u{1F4E5}", desc: "Inbox Tray" },
    { value: "\u{1F4E6}", desc: "Package" },
    { value: "\u{1F4E7}", desc: "E-Mail" },
    { value: "\u{1F4E8}", desc: "Incoming Envelope" },
    { value: "\u{1F4E9}", desc: "Envelope with Arrow" },
    { value: "\u{1F4EA}", desc: "Closed Mailbox with Lowered Flag" },
    { value: "\u{1F4EB}", desc: "Closed Mailbox with Raised Flag" },
    { value: "\u{1F4EC}", desc: "Open Mailbox with Raised Flag" },
    { value: "\u{1F4ED}", desc: "Open Mailbox with Lowered Flag" },
    { value: "\u{1F4EE}", desc: "Postbox" },
    { value: "\u{1F4EF}", desc: "Postal Horn" },
];
const celebration = [
    { value: "\u{1FA85}", desc: "Piñata" },
    { value: "\u{1F380}", desc: "Ribbon" },
    { value: "\u{1F381}", desc: "Wrapped Gift" },
    { value: "\u{1F383}", desc: "Jack-O-Lantern" },
    { value: "\u{1F384}", desc: "Christmas Tree" },
    { value: "\u{1F9E8}", desc: "Firecracker" },
    { value: "\u{1F386}", desc: "Fireworks" },
    { value: "\u{1F387}", desc: "Sparkler" },
    { value: "\u{2728}", desc: "Sparkles" },
    { value: "\u{2747}\u{FE0F}", desc: "Sparkle" },
    { value: "\u{1F388}", desc: "Balloon" },
    { value: "\u{1F389}", desc: "Party Popper" },
    { value: "\u{1F38A}", desc: "Confetti Ball" },
    { value: "\u{1F38B}", desc: "Tanabata Tree" },
    { value: "\u{1F38D}", desc: "Pine Decoration" },
    { value: "\u{1F38E}", desc: "Japanese Dolls" },
    { value: "\u{1F38F}", desc: "Carp Streamer" },
    { value: "\u{1F390}", desc: "Wind Chime" },
    { value: "\u{1F391}", desc: "Moon Viewing Ceremony" },
    { value: "\u{1F392}", desc: "Backpack" },
    { value: "\u{1F393}", desc: "Graduation Cap" },
    { value: "\u{1F9E7}", desc: "Red Envelope" },
    { value: "\u{1F3EE}", desc: "Red Paper Lantern" },
    { value: "\u{1F396}\u{FE0F}", desc: "Military Medal" },
];
const tools = [
    { value: "\u{1F3A3}", desc: "Fishing Pole" },
    { value: "\u{1F526}", desc: "Flashlight" },
    { value: "\u{1F527}", desc: "Wrench" },
    { value: "\u{1F528}", desc: "Hammer" },
    { value: "\u{1F529}", desc: "Nut and Bolt" },
    { value: "\u{1F6E0}\u{FE0F}", desc: "Hammer and Wrench" },
    { value: "\u{1F9ED}", desc: "Compass" },
    { value: "\u{1F9EF}", desc: "Fire Extinguisher" },
    { value: "\u{1F9F0}", desc: "Toolbox" },
    { value: "\u{1F9F1}", desc: "Brick" },
    { value: "\u{1FA93}", desc: "Axe" },
    { value: "\u{2692}\u{FE0F}", desc: "Hammer and Pick" },
    { value: "\u{26CF}\u{FE0F}", desc: "Pick" },
    { value: "\u{26D1}\u{FE0F}", desc: "Rescue Worker’s Helmet" },
    { value: "\u{26D3}\u{FE0F}", desc: "Chains" },
    { value: "\u{1F5DC}\u{FE0F}", desc: "Clamp" },
    { value: "\u{1FA9A}", desc: "Carpentry Saw" },
    { value: "\u{1FA9B}", desc: "Screwdriver" },
    { value: "\u{1FA9C}", desc: "Ladder" },
    { value: "\u{1FA9D}", desc: "Hook" },
];
const office = [
    { value: "\u{1F4C1}", desc: "File Folder" },
    { value: "\u{1F4C2}", desc: "Open File Folder" },
    { value: "\u{1F4C3}", desc: "Page with Curl" },
    { value: "\u{1F4C4}", desc: "Page Facing Up" },
    { value: "\u{1F4C5}", desc: "Calendar" },
    { value: "\u{1F4C6}", desc: "Tear-Off Calendar" },
    { value: "\u{1F4C7}", desc: "Card Index" },
    { value: "\u{1F5C2}\u{FE0F}", desc: "Card Index Dividers" },
    { value: "\u{1F5C3}\u{FE0F}", desc: "Card File Box" },
    { value: "\u{1F5C4}\u{FE0F}", desc: "File Cabinet" },
    { value: "\u{1F5D1}\u{FE0F}", desc: "Wastebasket" },
    { value: "\u{1F5D2}\u{FE0F}", desc: "Spiral Notepad" },
    { value: "\u{1F5D3}\u{FE0F}", desc: "Spiral Calendar" },
    { value: "\u{1F4C8}", desc: "Chart Increasing" },
    { value: "\u{1F4C9}", desc: "Chart Decreasing" },
    { value: "\u{1F4CA}", desc: "Bar Chart" },
    { value: "\u{1F4CB}", desc: "Clipboard" },
    { value: "\u{1F4CC}", desc: "Pushpin" },
    { value: "\u{1F4CD}", desc: "Round Pushpin" },
    { value: "\u{1F4CE}", desc: "Paperclip" },
    { value: "\u{1F587}\u{FE0F}", desc: "Linked Paperclips" },
    { value: "\u{1F4CF}", desc: "Straight Ruler" },
    { value: "\u{1F4D0}", desc: "Triangular Ruler" },
    { value: "\u{1F4D1}", desc: "Bookmark Tabs" },
    { value: "\u{1F4D2}", desc: "Ledger" },
    { value: "\u{1F4D3}", desc: "Notebook" },
    { value: "\u{1F4D4}", desc: "Notebook with Decorative Cover" },
    { value: "\u{1F4D5}", desc: "Closed Book" },
    { value: "\u{1F4D6}", desc: "Open Book" },
    { value: "\u{1F4D7}", desc: "Green Book" },
    { value: "\u{1F4D8}", desc: "Blue Book" },
    { value: "\u{1F4D9}", desc: "Orange Book" },
    { value: "\u{1F4DA}", desc: "Books" },
    { value: "\u{1F4DB}", desc: "Name Badge" },
    { value: "\u{1F4DC}", desc: "Scroll" },
    { value: "\u{1F4DD}", desc: "Memo" },
    { value: "\u{2702}\u{FE0F}", desc: "Scissors" },
    { value: "\u{2709}\u{FE0F}", desc: "Envelope" },
];
const signs = [
    { value: "\u{1F3A6}", desc: "Cinema" },
    { value: "\u{1F4F5}", desc: "No Mobile Phones" },
    { value: "\u{1F51E}", desc: "No One Under Eighteen" },
    { value: "\u{1F6AB}", desc: "Prohibited" },
    { value: "\u{1F6AC}", desc: "Cigarette" },
    { value: "\u{1F6AD}", desc: "No Smoking" },
    { value: "\u{1F6AE}", desc: "Litter in Bin Sign" },
    { value: "\u{1F6AF}", desc: "No Littering" },
    { value: "\u{1F6B0}", desc: "Potable Water" },
    { value: "\u{1F6B1}", desc: "Non-Potable Water" },
    { value: "\u{1F6B3}", desc: "No Bicycles" },
    { value: "\u{1F6B7}", desc: "No Pedestrians" },
    { value: "\u{1F6B8}", desc: "Children Crossing" },
    { value: "\u{1F6B9}", desc: "Men’s Room" },
    { value: "\u{1F6BA}", desc: "Women’s Room" },
    { value: "\u{1F6BB}", desc: "Restroom" },
    { value: "\u{1F6BC}", desc: "Baby Symbol" },
    { value: "\u{1F6BE}", desc: "Water Closet" },
    { value: "\u{1F6C2}", desc: "Passport Control" },
    { value: "\u{1F6C3}", desc: "Customs" },
    { value: "\u{1F6C4}", desc: "Baggage Claim" },
    { value: "\u{1F6C5}", desc: "Left Luggage" },
    { value: "\u{1F17F}\u{FE0F}", desc: "Parking Button" },
    { value: "\u{267F}", desc: "Wheelchair Symbol" },
    { value: "\u{2622}\u{FE0F}", desc: "Radioactive" },
    { value: "\u{2623}\u{FE0F}", desc: "Biohazard" },
    { value: "\u{26A0}\u{FE0F}", desc: "Warning" },
    { value: "\u{26A1}", desc: "High Voltage" },
    { value: "\u{26D4}", desc: "No Entry" },
    { value: "\u{267B}\u{FE0F}", desc: "Recycling Symbol" },
    { value: "\u{2640}\u{FE0F}", desc: "Female Sign" },
    { value: "\u{2642}\u{FE0F}", desc: "Male Sign" },
    { value: "\u{26A7}\u{FE0F}", desc: "Transgender Symbol" },
];
const religion = [
    { value: "\u{1F52F}", desc: "Dotted Six-Pointed Star" },
    { value: "\u{2721}\u{FE0F}", desc: "Star of David" },
    { value: "\u{1F549}\u{FE0F}", desc: "Om" },
    { value: "\u{1F54B}", desc: "Kaaba" },
    { value: "\u{1F54C}", desc: "Mosque" },
    { value: "\u{1F54D}", desc: "Synagogue" },
    { value: "\u{1F54E}", desc: "Menorah" },
    { value: "\u{1F6D0}", desc: "Place of Worship" },
    { value: "\u{1F6D5}", desc: "Hindu Temple" },
    { value: "\u{2626}\u{FE0F}", desc: "Orthodox Cross" },
    { value: "\u{271D}\u{FE0F}", desc: "Latin Cross" },
    { value: "\u{262A}\u{FE0F}", desc: "Star and Crescent" },
    { value: "\u{262E}\u{FE0F}", desc: "Peace Symbol" },
    { value: "\u{262F}\u{FE0F}", desc: "Yin Yang" },
    { value: "\u{2638}\u{FE0F}", desc: "Wheel of Dharma" },
    { value: "\u{267E}\u{FE0F}", desc: "Infinity" },
    { value: "\u{1FA94}", desc: "Diya Lamp" },
    { value: "\u{26E9}\u{FE0F}", desc: "Shinto Shrine" },
    { value: "\u{26EA}", desc: "Church" },
    { value: "\u{2734}\u{FE0F}", desc: "Eight-Pointed Star" },
    { value: "\u{1F4FF}", desc: "Prayer Beads" },
];
const household = [
    { value: "\u{1F484}", desc: "Lipstick" },
    { value: "\u{1F48D}", desc: "Ring" },
    { value: "\u{1F48E}", desc: "Gem Stone" },
    { value: "\u{1F4F0}", desc: "Newspaper" },
    { value: "\u{1F511}", desc: "Key" },
    { value: "\u{1F525}", desc: "Fire" },
    { value: "\u{1FAA8}", desc: "Rock" },
    { value: "\u{1FAB5}", desc: "Wood" },
    { value: "\u{1F52B}", desc: "Pistol" },
    { value: "\u{1F56F}\u{FE0F}", desc: "Candle" },
    { value: "\u{1F5BC}\u{FE0F}", desc: "Framed Picture" },
    { value: "\u{1F5DD}\u{FE0F}", desc: "Old Key" },
    { value: "\u{1F5DE}\u{FE0F}", desc: "Rolled-Up Newspaper" },
    { value: "\u{1F5FA}\u{FE0F}", desc: "World Map" },
    { value: "\u{1F6AA}", desc: "Door" },
    { value: "\u{1F6BD}", desc: "Toilet" },
    { value: "\u{1F6BF}", desc: "Shower" },
    { value: "\u{1F6C1}", desc: "Bathtub" },
    { value: "\u{1F6CB}\u{FE0F}", desc: "Couch and Lamp" },
    { value: "\u{1F6CF}\u{FE0F}", desc: "Bed" },
    { value: "\u{1F9F4}", desc: "Lotion Bottle" },
    { value: "\u{1F9F5}", desc: "Thread" },
    { value: "\u{1F9F6}", desc: "Yarn" },
    { value: "\u{1F9F7}", desc: "Safety Pin" },
    { value: "\u{1F9F8}", desc: "Teddy Bear" },
    { value: "\u{1F9F9}", desc: "Broom" },
    { value: "\u{1F9FA}", desc: "Basket" },
    { value: "\u{1F9FB}", desc: "Roll of Paper" },
    { value: "\u{1F9FC}", desc: "Soap" },
    { value: "\u{1F9FD}", desc: "Sponge" },
    { value: "\u{1FA91}", desc: "Chair" },
    { value: "\u{1FA92}", desc: "Razor" },
    { value: "\u{1FA9E}", desc: "Mirror" },
    { value: "\u{1FA9F}", desc: "Window" },
    { value: "\u{1FAA0}", desc: "Plunger" },
    { value: "\u{1FAA1}", desc: "Sewing Needle" },
    { value: "\u{1FAA2}", desc: "Knot" },
    { value: "\u{1FAA3}", desc: "Bucket" },
    { value: "\u{1FAA4}", desc: "Mouse Trap" },
    { value: "\u{1FAA5}", desc: "Toothbrush" },
    { value: "\u{1FAA6}", desc: "Headstone" },
    { value: "\u{1FAA7}", desc: "Placard" },
    { value: "\u{1F397}\u{FE0F}", desc: "Reminder Ribbon" },
];
const activities = [
    { value: "\u{1F39E}\u{FE0F}", desc: "Film Frames" },
    { value: "\u{1F39F}\u{FE0F}", desc: "Admission Tickets" },
    { value: "\u{1F3A0}", desc: "Carousel Horse" },
    { value: "\u{1F3A1}", desc: "Ferris Wheel" },
    { value: "\u{1F3A2}", desc: "Roller Coaster" },
    { value: "\u{1F3A8}", desc: "Artist Palette" },
    { value: "\u{1F3AA}", desc: "Circus Tent" },
    { value: "\u{1F3AB}", desc: "Ticket" },
    { value: "\u{1F3AC}", desc: "Clapper Board" },
    { value: "\u{1F3AD}", desc: "Performing Arts" },
];
const travel = [
    { value: "\u{1F3F7}\u{FE0F}", desc: "Label" },
    { value: "\u{1F30B}", desc: "Volcano" },
    { value: "\u{1F3D4}\u{FE0F}", desc: "Snow-Capped Mountain" },
    { value: "\u{26F0}\u{FE0F}", desc: "Mountain" },
    { value: "\u{1F3D5}\u{FE0F}", desc: "Camping" },
    { value: "\u{1F3D6}\u{FE0F}", desc: "Beach with Umbrella" },
    { value: "\u{26F1}\u{FE0F}", desc: "Umbrella on Ground" },
    { value: "\u{1F3EF}", desc: "Japanese Castle" },
    { value: "\u{1F463}", desc: "Footprints" },
    { value: "\u{1F5FB}", desc: "Mount Fuji" },
    { value: "\u{1F5FC}", desc: "Tokyo Tower" },
    { value: "\u{1F5FD}", desc: "Statue of Liberty" },
    { value: "\u{1F5FE}", desc: "Map of Japan" },
    { value: "\u{1F5FF}", desc: "Moai" },
    { value: "\u{1F6CE}\u{FE0F}", desc: "Bellhop Bell" },
    { value: "\u{1F9F3}", desc: "Luggage" },
    { value: "\u{26F3}", desc: "Flag in Hole" },
    { value: "\u{26FA}", desc: "Tent" },
    { value: "\u{2668}\u{FE0F}", desc: "Hot Springs" },
];
const medieval = [
    { value: "\u{1F3F0}", desc: "Castle" },
    { value: "\u{1F3F9}", desc: "Bow and Arrow" },
    { value: "\u{1F451}", desc: "Crown" },
    { value: "\u{1F531}", desc: "Trident Emblem" },
    { value: "\u{1F5E1}\u{FE0F}", desc: "Dagger" },
    { value: "\u{1F6E1}\u{FE0F}", desc: "Shield" },
    { value: "\u{1F52E}", desc: "Crystal Ball" },
    { value: "\u{1FA84}", desc: "Magic Wand" },
    { value: "\u{2694}\u{FE0F}", desc: "Crossed Swords" },
    { value: "\u{269C}\u{FE0F}", desc: "Fleur-de-lis" },
    { value: "\u{1FA96}", desc: "Military Helmet" }
];

const doubleExclamationMark = { value: "\u{203C}\u{FE0F}", desc: "Double Exclamation Mark" };
const interrobang = { value: "\u{2049}\u{FE0F}", desc: "Exclamation Question Mark" };
const information = { value: "\u{2139}\u{FE0F}", desc: "Information" };
const circledM = { value: "\u{24C2}\u{FE0F}", desc: "Circled M" };
const checkMarkButton = { value: "\u{2705}", desc: "Check Mark Button" };
const checkMark = { value: "\u{2714}\u{FE0F}", desc: "Check Mark" };
const eightSpokedAsterisk = { value: "\u{2733}\u{FE0F}", desc: "Eight-Spoked Asterisk" };
const crossMark = { value: "\u{274C}", desc: "Cross Mark" };
const crossMarkButton = { value: "\u{274E}", desc: "Cross Mark Button" };
const questionMark = { value: "\u{2753}", desc: "Question Mark" };
const whiteQuestionMark = { value: "\u{2754}", desc: "White Question Mark" };
const whiteExclamationMark = { value: "\u{2755}", desc: "White Exclamation Mark" };
const exclamationMark = { value: "\u{2757}", desc: "Exclamation Mark" };
const curlyLoop = { value: "\u{27B0}", desc: "Curly Loop" };
const doubleCurlyLoop = { value: "\u{27BF}", desc: "Double Curly Loop" };
const wavyDash = { value: "\u{3030}\u{FE0F}", desc: "Wavy Dash" };
const partAlternationMark = { value: "\u{303D}\u{FE0F}", desc: "Part Alternation Mark" };
const tradeMark = { value: "\u{2122}\u{FE0F}", desc: "Trade Mark" };
const copyright = { value: "\u{A9}\u{FE0F}", desc: "Copyright" };
const registered = { value: "\u{AE}\u{FE0F}", desc: "Registered" };
const marks = [
    doubleExclamationMark,
    interrobang,
    information,
    circledM,
    checkMarkButton,
    checkMark,
    eightSpokedAsterisk,
    crossMark,
    crossMarkButton,
    questionMark,
    whiteQuestionMark,
    whiteExclamationMark,
    exclamationMark,
    curlyLoop,
    doubleCurlyLoop,
    wavyDash,
    partAlternationMark,
    tradeMark,
    copyright,
    registered,
];

const textStyle = { value: "\u{FE0E}", desc: "Variation Selector-15: text style" };
const emojiStyle = { value: "\u{FE0F}", desc: "Variation Selector-16: emoji style" };
const zeroWidthJoiner = { value: "\u{200D}", desc: "Zero Width Joiner" };
const combiningClosingKeycap = { value: "\u{20E3}", desc: "Combining Enclosing Keycap" };
const combiners = [
    textStyle,
    emojiStyle,
    zeroWidthJoiner,
    combiningClosingKeycap,
];
const allIcons = {
    faces,
    love,
    cartoon,
    hands,
    bodyParts,
    sex,
    people,
    gestures,
    activity,
    roles,
    fantasy,
    sports,
    personResting,
    otherPeople,
    skinTones,
    hairColors,
    animals,
    plants,
    food,
    sweets,
    drinks,
    utensils,
    nations,
    flags,
    vehicles,
    bloodTypes,
    regions,
    japanese,
    time,
    clocks,
    arrows,
    shapes,
    mediaPlayer,
    zodiac,
    chess,
    numbers,
    tags,
    math,
    games,
    sportsEquipment,
    clothing,
    town,
    buttons,
    music,
    weather,
    astro,
    finance,
    writing,
    science,
    tech,
    mail,
    celebration,
    tools,
    office,
    signs,
    religion,
    household,
    activities,
    travel,
    medieval,
    marks,
    combiners
};

class HtmlAttr {
    constructor(key, tags, value) {
        tags = tags.map(t => t.toLocaleUpperCase());

        this.apply = (elem) => {
            const isValid = tags.length === 0
                || tags.indexOf(elem.tagName) > -1;

            if (!isValid) {
                console.warn(`Element ${elem.tagName} does not support Attribute ${key}`);
            }
            else if (key === "style") {
                Object.assign(elem[key], value);
            }
            else if (!(typeof value === "boolean" || value instanceof Boolean)
                || key === "muted") {
                elem[key] = value;
            }
            else if (value) {
                elem.setAttribute(key, "");
            }
            else {
                elem.removeAttribute(key);
            }
        };

        Object.freeze(this);
    }
}
function accessKey(value) { return new HtmlAttr("accessKey", ["input", "button"], value); }
// Alternative text in case an image can't be displayed.
function alt(value) { return new HtmlAttr("alt", ["applet", "area", "img", "input"], value); }
// The audio or video should play as soon as possible.
function autoPlay(value) { return new HtmlAttr("autoplay", ["audio", "video"], value); }
// Often used with CSS to style elements with common properties.
function className(value) { return new HtmlAttr("className", [], value); }
// Describes elements which belongs to this one.
function htmlFor(value) { return new HtmlAttr("htmlFor", ["label", "output"], value); }
// Specifies the height of elements listed here. For all other elements, use the CSS height property.
function height(value) { return new HtmlAttr("height", ["canvas", "embed", "iframe", "img", "input", "object", "video"], value); }
// The URL of a linked resource.
function href(value) { return new HtmlAttr("href", ["a", "area", "base", "link"], value); }
// Often used with CSS to style a specific element. The value of this attribute must be unique.
function id(value) { return new HtmlAttr("id", [], value); }
// Indicates whether the media should start playing from the start when it's finished.
function loop(value) { return new HtmlAttr("loop", ["audio", "bgsound", "marquee", "video"], value); }
// Indicates the maximum value allowed.
function max(value) { return new HtmlAttr("max", ["input", "meter", "progress"], value); }
// Indicates the minimum value allowed.
function min(value) { return new HtmlAttr("min", ["input", "meter"], value); }
// Provides a hint to the user of what can be entered in the field.
function placeHolder(value) { return new HtmlAttr("placeholder", ["input", "textarea"], value); }
// Specifies the relationship of the target object to the link object.
function rel(value) { return new HtmlAttr("rel", ["a", "area", "link"], value); }
// Defines the number of rows in a text area.
function role(value) { return new HtmlAttr("role", [], value); }
// The URL of the embeddable content.
function src(value) { return new HtmlAttr("src", ["audio", "embed", "iframe", "img", "input", "script", "source", "track", "video"], value); }
// Defines CSS styles which will override styles previously set.
function style(value) { return new HtmlAttr("style", [], value); }
// ???
function step(value) { return new HtmlAttr("step", ["input"], value); }
// Text to be displayed in a tooltip when hovering over the element.
function title(value) { return new HtmlAttr("title", [], value); }
// ???
function target(value) { return new HtmlAttr("target", ["a", "area", "base", "form"], value); }
// Defines the type of the element.
function type(value) { return new HtmlAttr("type", ["button", "input", "command", "embed", "object", "script", "source", "style", "menu"], value); }
// Defines a default value which will be displayed in the element on page load.
function value(value) { return new HtmlAttr("value", ["button", "data", "input", "li", "meter", "option", "progress", "param"], value); }
// For the elements listed here, this establishes the element's width.
function width(value) { return new HtmlAttr("width", ["canvas", "embed", "iframe", "img", "input", "object", "video"], value); }

const fillPageStyle = style({
    position: "absolute",
    display: "block",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    padding: 0,
    margin: 0,
    overflow: "hidden",
});

// A selection of fonts for preferred monospace rendering.
const monospaceFamily = "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace";
const monospaceFont = style({ fontFamily: monospaceFamily });

// A selection of fonts that should match whatever the user's operating system normally uses.
const systemFamily = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";
const systemFont = style({ fontFamily: systemFamily });

function isFunction(obj) {
    return typeof obj === "function"
        || obj instanceof Function;
}

class HtmlEvt {
    constructor(name, callback, opts) {
        if (!isFunction(callback)) {
            throw new Error("A function instance is required for this parameter");
        }

        this.add = (elem) => {
            elem.addEventListener(name, callback, opts);
        };

        this.remove = (elem) => {
            elem.removeEventListener(name, callback);
        };

        Object.freeze(this);
    }
}
function onClick(callback) { return new HtmlEvt("click", callback); }
function onInput(callback) { return new HtmlEvt("input", callback); }
function onKeyUp(callback) { return new HtmlEvt("keyup", callback); }

function tag(name, ...rest) {
    const elem = document.createElement(name);

    for (let i = 0; i < rest.length; ++i) {
        if (isFunction(rest[i])) {
            rest[i] = rest[i](true);
        }
    }

    for (let x of rest) {
        if (x !== null && x !== undefined) {
            if (x instanceof String || typeof x === "string"
                || x instanceof Number || typeof x === "number"
                || x instanceof Boolean || typeof x === "boolean"
                || x instanceof Date) {
                elem.appendChild(document.createTextNode(x));
            }
            else if (x instanceof Element) {
                elem.appendChild(x);
            }
            else if (x instanceof HtmlCustomTag) {
                elem.appendChild(x.element);
            }
            else if (x instanceof HtmlAttr) {
                x.apply(elem);
            }
            else if (x instanceof HtmlEvt) {
                x.add(elem);
            }
            else {
                console.trace(`Skipping ${x}: unsupported value type.`);
            }
        }
    }

    return elem;
}

class HtmlCustomTag extends EventTarget {
    constructor(tagName, ...rest) {
        super();
        if (rest.length === 1
            && rest[0] instanceof Element) {
            this.element = rest[0];
        }
        else {
            this.element = tag(tagName, ...rest);
        }
    }
}

class LabeledInputTag extends HtmlCustomTag {
    constructor(id, inputType, labelText, ...rest) {
        super("div");

        this.label = Label(
            htmlFor(id),
            labelText);

        this.input = Input(
            type(inputType),
            ...rest);

        this.element.append(
            this.label,
            this.input);

        Object.seal(this);
    }

    addEventListener(name, callback, opts) {
        this.input.addEventListener(name, callback, opts);
    }

    removeEventListener(name, callback) {
        this.input.removeEventListener(name, callback);
    }

    async once(resolveEvt, rejectEvt, timeout) {
        return await this.input.once(resolveEvt, rejectEvt, timeout);
    }

    get value() {
        return this.input.value;
    }

    set value(v) {
        this.input.value = v;
    }

    get checked() {
        return this.input.checked;
    }

    set checked(v) {
        this.input.checked = v;
    }

    setLocked(value) {
        this.input.setLocked(value);
    }
}

class LabeledSelectBoxTag extends HtmlCustomTag {
    constructor(tagId, labelText, noSelectionText, makeID, makeLabel, ...rest) {
        super("div");

        this.label = Label(
            htmlFor(tagId),
            labelText);

        this.select = new SelectBox(noSelectionText, makeID, makeLabel, id(tagId), ...rest);

        this.element.append(
            this.label,
            this.select.element);

        Object.seal(this);
    }

    get emptySelectionEnabled() {
        return this.select.emptySelectionEnabled;
    }

    set emptySelectionEnabled(value) {
        this.select.emptySelectionEnabled = value;
    }

    get values() {
        return this.select.values;
    }

    set values(values) {
        this.select.values = values;
    }

    get options() {
        return this.select.options;
    }

    get selectedIndex() {
        return this.select.selectedIndex;
    }

    set selectedIndex(i) {
        this.select.selectedIndex = i;
    }

    get selectedValue() {
        return this.select.selectedValue;
    }

    set selectedValue(v) {
        this.select.selectedValue = v;
    }

    addEventListener(name, callback, opts) {
        this.select.addEventListener(name, callback, opts);
    }

    removeEventListener(name, callback) {
        this.select.removeEventListener(name, callback);
    }
}

const selectEvt = new Event("select");

class OptionPanelTag extends HtmlCustomTag {
    constructor(panelID, name, ...rest) {
        super("div",
            id(panelID),
            H2(name),
            P(...rest));

        this.button = Button(
            id(panelID + "Btn"),
            onClick(() => this.dispatchEvent(selectEvt)),
            name);
    }

    get visible() {
        return this.element.style.display !== null;
    }

    set visible(v) {
        this.element.setOpen(v);
        this.button.setLocked(v);
    }
}

const _values = new Map();

class SelectBoxTag extends HtmlCustomTag {
    constructor(noSelectionText, makeID, makeLabel, ...rest) {
        super("select", ...rest);

        if (!isFunction(makeID)) {
            throw new Error("makeID parameter must be a Function");
        }

        if (!isFunction(makeLabel)) {
            throw new Error("makeLabel parameter must be a Function");
        }

        _values.set(this, []);

        this.noSelectionText = noSelectionText;
        this.makeID = (v) => v !== null && makeID(v) || null;
        this.makeLabel = (v) => v !== null && makeLabel(v) || "None";
        this.emptySelectionEnabled = true;

        Object.seal(this);
    }

    get emptySelectionEnabled() {
        return this._emptySelectionEnabled;
    }

    set emptySelectionEnabled(value) {
        this._emptySelectionEnabled = value;
        this._render();
    }

    get values() {
        return _values.get(this);
    }

    set values(newItems) {
        const curValue = this.selectedValue;
        const values = _values.get(this);
        values.splice(0, values.length, ...newItems);
        this._render();
        this.selectedValue = curValue;
    }

    _render() {
        clear(this.element);
        if (this.values.length === 0) {
            this.element.append(Option(this.noSelectionText));
            this.element.lock();
        }
        else {
            if (this.emptySelectionEnabled) {
                this.element.append(Option(this.noSelectionText));
            }
            for (let v of this.values) {
                this.element.append(
                    Option(
                        value(this.makeID(v)),
                        this.makeLabel(v)));
            }

            this.element.unlock();
        }
    }

    get options() {
        return this.element.options;
    }

    get selectedIndex() {
        let i = this.element.selectedIndex;
        if (this.emptySelectionEnabled) {
            --i;
        }
        return i;
    }

    set selectedIndex(i) {
        if (this.emptySelectionEnabled) {
            ++i;
        }
        this.element.selectedIndex = i;
    }

    get selectedValue() {
        if (0 <= this.selectedIndex && this.selectedIndex < this.values.length) {
            return this.values[this.selectedIndex];
        }
        else {
            return null;
        }
    }

    set selectedValue(value) {
        this.selectedIndex = _values.get(this)
            .findIndex(v =>
                value !== null
                && this.makeID(value) === this.makeID(v));
    }

    addEventListener(name, callback, opts) {
        this.element.addEventListener(name, callback, opts);
    }

    removeEventListener(name, callback) {
        this.element.removeEventListener(name, callback);
    }

    setOpen(v) {
        this.element.setOpen(v);
    }

    get style() {
        return this.element.style;
    }
}

function clear(elem) {
    while (elem.lastChild) {
        elem.lastChild.remove();
    }
}

function A(...rest) { return tag("a", ...rest); }
function Aside(...rest) { return tag("aside", ...rest); }
function Audio(...rest) { return tag("audio", ...rest); }
function HtmlButton(...rest) { return tag("button", ...rest); }
function Button(...rest) { return HtmlButton(...rest, type("button")); }
function Canvas(...rest) { return tag("canvas", ...rest); }
function Div(...rest) { return tag("div", ...rest); }
function H1(...rest) { return tag("h1", ...rest); }
function H2(...rest) { return tag("h2", ...rest); }
function Img(...rest) { return tag("img", ...rest); }
function Input(...rest) { return tag("input", ...rest); }
function KBD(...rest) { return tag("kbd", ...rest); }
function Label(...rest) { return tag("label", ...rest); }
function LI(...rest) { return tag("li", ...rest); }
function Option(...rest) { return tag("option", ...rest); }
function P(...rest) { return tag("p", ...rest); }
function Span(...rest) { return tag("span", ...rest); }
function Strong(...rest) { return tag("strong", ...rest); }
function UL(...rest) { return tag("ul", ...rest); }

function LabeledInput(id, inputType, labelText, ...rest) {
    return new LabeledInputTag(id, inputType, labelText, ...rest);
}

function SelectBox(noSelectionText, makeID, makeLabel, ...rest) {
    return new SelectBoxTag(noSelectionText, makeID, makeLabel, ...rest);
}

function LabeledSelectBox(id, labelText, noSelectionText, makeID, makeLabel, ...rest) {
    return new LabeledSelectBoxTag(id, labelText, noSelectionText, makeID, makeLabel, ...rest);
}

function OptionPanel(id, name, ...rest) {
    return new OptionPanelTag(id, name, ...rest);
}

class MockUser {
    constructor(id, x, y, client) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.client = client;
        this.audio = null;
        this.displayName = id;
        this.avatarEmoji = randomPerson();
        this.emoteEvt = { id, value: null, desc: null };
    }

    schedule() {
        this.timeout = setTimeout(
            () => this.update(),
            1000 * (1 + Math.random()));
    }

    start() {
        const evt = Object.assign(
            new Event("participantJoined"),
            {
                id: this.id,
                displayName: this.displayName
            });

        document.body.appendChild(Span(id(`participant_${this.id}`),
            this.audio = Audio(
                src(`/test-audio/${this.id}.mp3`),
                autoPlay,
                loop
            )));

        this.client.dispatchEvent(evt);

        this.schedule();
    }

    stop() {
        clearTimeout(this.timeout);
        if (!!this.audio) {
            document.body.removeChild(this.audio.parentElement);

            this.client.dispatchEvent(Object.assign(new Event("participantLeft"), {
                id: this.id
            }));
        }
    }

    update() {
        const x = this.x + Math.floor(2 * Math.random() - 1),
            y = this.y + Math.floor(2 * Math.random() - 1);

        this.client.sendMessageTo(this.client.localUser, {
            command: "userMoved",
            value: { id: this.id, x, y }
        });

        if (Math.random() <= 0.1) {
            const groups = Object.values(allIcons),
                group = groups.random(),
                emoji = group.random();
            Object.assign(this.emoteEvt, emoji);
            this.client.sendMessageTo(this.client.localUser, {
                command: "emote",
                value: this.emoteEvt
            });
        }

        this.schedule();
    }
}

class CallaEvent extends Event {
    constructor(data) {
        super(data.command);
        Event.clone(this, data.value);
    }
}

class CallaUserEvent extends CallaEvent {
    constructor(id, data) {
        super(data);
        this.id = id;
    }
}

// helps us filter out data channel messages that don't belong to us
const APP_FINGERPRINT
    = window.APP_FINGERPRINT
    = "Calla",
    eventNames = [
        "userMoved",
        "emote",
        "userInitRequest",
        "userInitResponse",
        "audioMuteStatusChanged",
        "videoMuteStatusChanged",
        "localAudioMuteStatusChanged",
        "localVideoMuteStatusChanged",
        "remoteAudioMuteStatusChanged",
        "remoteVideoMuteStatusChanged",
        "videoConferenceJoined",
        "videoConferenceLeft",
        "participantJoined",
        "participantLeft",
        "avatarChanged",
        "displayNameChange",
        "audioActivity"
    ];

// Manages communication between Jitsi Meet and Calla
class BaseJitsiClient extends EventTarget {

    constructor() {
        super();
        this.element = Div(
            id("jitsi"),
            style({
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                margin: 0,
                padding: 0,
                overflow: "hidden"
            }));
        this.localUser = null;
        this.otherUsers = new Map();
        this.audioClient = null;
    }

    hide() {
        this.element.hide();
    }

    show() {
        this.element.show();
    }

    resize(top) {
        if (top !== undefined) {
            this.element.style.top = top + "px";
            this.element.style.height = `calc(100% - ${top}px)`;
        }
    }

    async initializeAsync(host, roomName) {
        throw new Error("Not implemented in base class.");
    }

    async joinAsync(host, roomName, userName) {
        this.dispose();
        await this.initializeAsync(host, roomName);

        this.addEventListener("videoConferenceJoined", (evt) => {
            this.localUser = evt.id;
        });

        this.addEventListener("videoConferenceLeft", (evt) => {
            this.localUser = null;
        });

        this.addEventListener("participantJoined", (evt) => {
            this.otherUsers.set(evt.id, evt.displayName);
        });

        this.addEventListener("participantLeft", (evt) => {
            if (this.otherUsers.has(evt.id)) {
                this.otherUsers.delete(evt.id);
            }
        });

        this.addEventListener("displayNameChange", (evt) => {
            if (this.otherUsers.has(evt.id)) {
                this.otherUsers.set(evt.id, evt.displayname);
            }
        });

        this.addEventListener("audioMuteStatusChanged", (evt) => {
            if (evt.id === this.localUser) {
                this.audioMuteStatusChanged(evt.muted);
            }
        });

        this.addEventListener("videoMuteStatusChanged", (evt) => {
            if (evt.id === this.localUser) {
                this.videoMuteStatusChanged(evt.muted);
            }
        });

        const localizeMuteEvent = (type) => (evt) => {
            const evt2 = Object.assign(
                new Event((evt.id === this.localUser ? "local" : "remote") + type + "MuteStatusChanged"), {
                id: evt.id,
                muted: evt.muted
            });
            this.dispatchEvent(evt2);
        };

        this.addEventListener("audioMuteStatusChanged", localizeMuteEvent("Audio"));
        this.addEventListener("videoMuteStatusChanged", localizeMuteEvent("Video"));

        window.addEventListener("unload", () => {
            this.dispose();
        });

        this.setDisplayName(userName);
    }

    dispose() {
    }

    setDisplayName(userName) {
        throw new Error("Not implemented in base class");
    }

    leave() {
        throw new Error("Not implemented in base class");
    }

    async getAudioOutputDevices() {
        throw new Error("Not implemented in base class");
    }

    async getCurrentAudioOutputDevice() {
        throw new Error("Not implemented in base class");
    }

    setAudioOutputDevice(device) {
        throw new Error("Not implemented in base class");
    }

    async getAudioInputDevices() {
        throw new Error("Not implemented in base class");
    }

    async getCurrentAudioInputDevice() {
        throw new Error("Not implemented in base class");
    }

    setAudioInputDevice(device) {
        throw new Error("Not implemented in base class");
    }

    async getVideoInputDevices() {
        throw new Error("Not implemented in base class");
    }

    async getCurrentVideoInputDevice() {
        throw new Error("Not implemented in base class");
    }

    setVideoInputDevice(device) {
        throw new Error("Not implemented in base class");
    }

    toggleAudio() {
        throw new Error("Not implemented in base class");
    }

    toggleVideo() {
        throw new Error("Not implemented in base class");
    }

    setAvatarURL(url) {
        throw new Error("Not implemented in base class");
    }

    async isAudioMutedAsync() {
        throw new Error("Not implemented in base class");
    }

    async isVideoMutedAsync() {
        throw new Error("Not implemented in base class");
    }

    sendMessageTo(toUserID, data) {
        throw new Error("Not implemented in base class");
    }

    setAudioProperties(origin, transitionTime, minDistance, maxDistance, rolloff) {
        this.audioClient.setAudioProperties({
            origin,
            transitionTime,
            minDistance,
            maxDistance,
            rolloff
        });
    }

    setPosition(evt) {
        if (evt.id === this.localUser) {
            this.audioClient.setLocalPosition(evt);
            for (let toUserID of this.otherUsers.keys()) {
                this.txGameData(toUserID, "userMoved", evt);
            }
        }
        else {
            this.audioClient.setUserPosition(evt);
        }
    }

    removeUser(evt) {
        this.audioClient.removeUser(evt);
    }

    async setAudioMutedAsync(muted) {
        const isMuted = await this.isAudioMutedAsync();
        if (muted !== isMuted) {
            this.toggleAudio();
        }
    }

    async setVideoMutedAsync(muted) {
        const isMuted = await this.isVideoMutedAsync();
        if (muted !== isMuted) {
            this.toggleVideo();
        }
    }

    /// Add a listener for Calla events that come through the Jitsi Meet data channel.
    addEventListener(evtName, callback, opts) {
        if (eventNames.indexOf(evtName) === -1) {
            throw new Error(`Unsupported event type: ${evtName}`);
        }

        super.addEventListener(evtName, callback, opts);
    }

    /// Send a Calla message through the Jitsi Meet data channel.
    txGameData(id, command, value) {
        const data = {
            hax: APP_FINGERPRINT,
            command,
            value
        };
        this.sendMessageTo(id, data);
    }

    /// A listener to add to JitsiExternalAPI::endpointTextMessageReceived event
    /// to receive Calla messages from the Jitsi Meet data channel.
    rxGameData(evt) {
        // JitsiExternalAPI::endpointTextMessageReceived event arguments format: 
        // evt = {
        //    data: {
        //      senderInfo: {
        //        jid: "string", // the jid of the sender
        //        id: "string" // the participant id of the sender
        //      },
        //      eventData: {
        //        name: "string", // the name of the datachannel event: `endpoint-text-message`
        //        text: "string" // the received text from the sender
        //      }
        //   }
        //};
        const data = JSON.parse(evt.data.eventData.text);
        if (data.hax === APP_FINGERPRINT) {
            const evt2 = new CallaUserEvent(evt.data.senderInfo.id, data);
            this.dispatchEvent(evt2);
        }
    }

    userInitRequest(toUserID) {
        this.txGameData(toUserID, "userInitRequest");
    }

    userInitRequestAsync(toUserID) {
        return this.until("userInitResponse",
            () => this.userInitRequest(toUserID),
            (evt) => evt.id === toUserID,
            1000);
    }

    userInitResponse(toUserID, fromUserState) {
        this.txGameData(toUserID, "userInitResponse", fromUserState);
    }

    emote(emoji) {
        for (let toUserID of this.otherUsers.keys()) {
            this.txGameData(toUserID, "emote", emoji);
        }
    }

    audioMuteStatusChanged(muted) {
        for (let toUserID of this.otherUsers.keys()) {
            this.txGameData(toUserID, "audioMuteStatusChanged", { muted });
        }
    }

    videoMuteStatusChanged(muted) {
        for (let toUserID of this.otherUsers.keys()) {
            this.txGameData(toUserID, "videoMuteStatusChanged", { muted });
        }
    }
}

const userNumber = document.location.hash.length > 0
    ? parseFloat(document.location.hash.substring(1))
    : 1;

class BaseSpatializer {

    constructor(destination, audio, analyser, drain) {
        this.destination = destination;
        this.audio = audio;
        this.analyser = analyser;
        this.node = drain;
        this.node.connect(this.destination.audioContext.destination);
        this.source = null;
    }

    checkStream() {
        if (!this.source) {
            try {
                const stream = !!this.audio.mozCaptureStream
                    ? this.audio.mozCaptureStream()
                    : this.audio.captureStream();

                this.source = this.destination.audioContext.createMediaStreamSource(stream);
                this.source.connect(this.analyser);
                this.source.connect(this.node);
            }
            catch (exp) {
                console.warn("Source isn't available yet. Will retry in a moment. Reason: ", exp);
                return false;
            }
        }

        return true;
    }

    dispose() {
        if (!!this.source) {
            this.source.disconnect(this.analyser);
            this.source.disconnect(this.node);
            this.source = null;
        }

        this.node.disconnect(this.destination.audioContext.destination);
        this.node = null;
        this.audio = null;
        this.destination = null;
    }

    update() {
    }

    setAudioProperties(evt) {
        throw new Error("Not implemented in base class.");
    }

    setPosition(evt) {
        throw new Error("Not implemented in base class.");
    }

    get positionX() {
        throw new Error("Not implemented in base class.");
    }

    get positionY() {
        throw new Error("Not implemented in base class.");
    }
}

class FullSpatializer extends BaseSpatializer {

    constructor(destination, audio, analyser) {
        super(destination, audio, analyser, destination.audioContext.createPanner());

        this.node.panningModel = "HRTF";
        this.node.distanceModel = "inverse";
        this.node.refDistance = destination.minDistance;
        this.node.rolloffFactor = destination.rolloff;
        this.node.coneInnerAngle = 360;
        this.node.coneOuterAngle = 0;
        this.node.coneOuterGain = 0;
        this.node.positionY.setValueAtTime(0, this.destination.audioContext.currentTime);
        this.wasMuted = false;
    }

    setAudioProperties(evt) {
        this.node.refDistance = evt.minDistance;
        this.node.rolloffFactor = evt.rolloff;
    }

    setPosition(evt) {
        const time = this.destination.audioContext.currentTime + this.destination.transitionTime;
        // our 2D position is in X/Y coords, but our 3D position
        // along the horizontal plane is X/Z coords.
        this.node.positionX.linearRampToValueAtTime(evt.x, time);
        this.node.positionZ.linearRampToValueAtTime(evt.y, time);
    }

    get positionX() {
        return this.node.positionX.value;
    }

    get positionY() {
        return this.node.positionZ.value;
    }

    update() {
        if (!!this.source) {
            const lx = this.destination.positionX,
                ly = this.destination.positionY,
                distX = this.positionX - lx,
                distY = this.positionY - ly,
                dist = Math.sqrt(distX * distX + distY * distY),
                range = clamp(project(dist, this.destination.minDistance, this.destination.maxDistance), 0, 1),
                muted = range >= 1;

            if (muted !== this.wasMuted) {
                this.wasMuted = muted;
                if (muted) {
                    this.source.disconnect(this.node);
                }
                else {
                    this.source.connect(this.node);
                }
            }
        }
    }
}

const audioActivityEvt = Object.assign(new Event("audioActivity", {
    id: null,
    isActive: false
})),
    activityCounterMin = 0,
    activityCounterMax = 60,
    activityCounterThresh = 5;

function frequencyToIndex(frequency, sampleRate, bufferSize) {
    var nyquist = sampleRate / 2;
    var index = Math.round(frequency / nyquist * bufferSize);
    return clamp(index, 0, bufferSize)
}

function analyserFrequencyAverage(analyser, frequencies, minHz, maxHz, bufferSize) {
    const sampleRate = analyser.context.sampleRate,
        start = frequencyToIndex(minHz, sampleRate, bufferSize),
        end = frequencyToIndex(maxHz, sampleRate, bufferSize),
        count = end - start;
    let sum = 0;
    for (let i = start; i < end; ++i) {
        sum += frequencies[i];
    }
    return count === 0 ? 0 : (sum / count);
}

class Source extends EventTarget {
    constructor(userID, audio, destination, bufferSize) {
        super();

        this.id = userID;
        this.lastAudible = true;
        this.activityCounter = 0;
        this.wasActive = false;

        this.destination = destination;

        this.audio = audio;
        this.audio.volume = 0;

        this.bufferSize = bufferSize;
        this.buffer = new Float32Array(this.bufferSize);

        this.analyser = this.destination.audioContext.createAnalyser();
        this.analyser.fftSize = 2 * this.bufferSize;
        this.analyser.smoothingTimeConstant = 0.2;

        this.spatializer = new FullSpatializer(this.destination, this.audio, this.analyser);

        Object.seal(this);
    }

    dispose() {
        this.spatializer.dispose();
        this.audio.pause();

        this.spatializer = null;
        this.destination = null;
        this.audio = null;
        this.analyser = null;
        this.buffer = null;
    }

    setAudioProperties(evt) {
        this.spatializer.setAudioProperties(evt);
    }

    setPosition(evt) {
        this.spatializer.setPosition(evt);
    }

    update() {
        if (this.spatializer.checkStream()) {
            this.spatializer.update();

            this.analyser.getFloatFrequencyData(this.buffer);

            const average = 1.1 + analyserFrequencyAverage(this.analyser, this.buffer, 85, 255, this.bufferSize) / 100;
            if (average >= 0.5 && this.activityCounter < activityCounterMax) {
                this.activityCounter++;
            } else if (average < 0.5 && this.activityCounter > activityCounterMin) {
                this.activityCounter--;
            }

            const isActive = this.activityCounter > activityCounterThresh;
            if (this.wasActive !== isActive) {
                this.wasActive = isActive;
                audioActivityEvt.id = this.id;
                audioActivityEvt.isActive = isActive;
                this.dispatchEvent(audioActivityEvt);
            }
        }
    }
}

const isOldAudioAPI = !AudioListener.prototype.hasOwnProperty("positionX");

class Destination {
    constructor() {
        this.audioContext = new AudioContext();
        this.listener = this.audioContext.listener;

        this.minDistance = 1;
        this.maxDistance = 10;
        this.rolloff = 1;
        this.transitionTime = 0.125;

        if (isOldAudioAPI) {
            this.startMoveTime
                = this.endMoveTime
                = 0;

            this.listenerX
                = this.targetListenerX
                = this.startListenerX
                = 0;

            this.listenerY
                = this.targetListenerY
                = this.startListenerY
                = 0;

            this.listener.setPosition(0, 0, 0);
            this.listener.setOrientation(0, 0, -1, 0, 1, 0);
        }
        else {
            const time = this.audioContext.currentTime;
            this.listener.positionX.setValueAtTime(0, time);
            this.listener.positionY.setValueAtTime(0, time);
            this.listener.positionZ.setValueAtTime(0, time);
            this.listener.forwardX.setValueAtTime(0, time);
            this.listener.forwardY.setValueAtTime(0, time);
            this.listener.forwardZ.setValueAtTime(-1, time);
            this.listener.upX.setValueAtTime(0, time);
            this.listener.upY.setValueAtTime(1, time);
            this.listener.upZ.setValueAtTime(0, time);
        }
    }

    get positionX() {
        return isOldAudioAPI
            ? this.listenerX
            : this.audioContext.listener.positionX.value
    }

    get positionY() {
        return isOldAudioAPI
            ? this.listenerY
            : this.audioContext.listener.positionZ.value;
    }

    setPosition(evt) {
        const time = this.audioContext.currentTime + this.transitionTime;
        if (isOldAudioAPI) {
            this.startMoveTime = this.audioContext.currentTime;
            this.endMoveTime = time;
            this.startListenerX = this.listenerX;
            this.startListenerY = this.listenerY;
            this.targetListenerX = evt.x;
            this.targetListenerY = evt.y;
        }
        else {
            this.listener.positionX.linearRampToValueAtTime(evt.x, time);
            this.listener.positionZ.linearRampToValueAtTime(evt.y, time);
        }
    }

    setAudioProperties(evt) {
        this.minDistance = evt.minDistance;
        this.maxDistance = evt.maxDistance;
        this.transitionTime = evt.transitionTime;
        this.rolloff = evt.rolloff;
    }

    update() {
        if (isOldAudioAPI) {
            const time = this.audioContext.currentTime,
                p = project(time, this.startMoveTime, this.endMoveTime);

            if (p <= 1) {
                const deltaX = this.targetListenerX - this.startListenerX,
                    deltaY = this.targetListenerY - this.startListenerY;

                this.listenerX = this.startListenerX + p * deltaX;
                this.listenerY = this.startListenerY + p * deltaY;

                this.listener.setPosition(this.listenerX, 0, this.listenerY);
            }
        }
    }
}

const BUFFER_SIZE = 1024,
    audioActivityEvt$1 = Object.assign(new Event("audioActivity", {
        id: null,
        isActive: false
    }));


class AudioManager extends EventTarget {
    constructor() {
        super();
        this.sourceLookup = {};
        this.sourceList = [];
        this.destination = new Destination();

        this.updater = () => {
            requestAnimationFrame(this.updater);
            this.destination.update();
            for (let source of this.sourceList) {
                source.update();
            }
        };
        requestAnimationFrame(this.updater);
    }


    getSource(userID) {
        if (!this.sourceLookup[userID]) {
            const elementID = `#participant_${userID} audio`,
                audio = document.querySelector(elementID);

            if (!!audio) {
                const source = this.sourceLookup[userID] = new Source(userID, audio, this.destination, BUFFER_SIZE);
                source.addEventListener("audioActivity", (evt) => {
                    audioActivityEvt$1.id = evt.id;
                    audioActivityEvt$1.isActive = evt.isActive;
                    this.dispatchEvent(audioActivityEvt$1);
                });
                this.sourceList.push(source);
            }
        }

        const source = this.sourceLookup[userID];
        if (!source) {
            console.warn(`no audio for user ${userID}`);
        }
        return source;
    }

    setUserPosition(evt) {
        const source = this.getSource(evt.id);
        if (!!source) {
            source.setPosition(evt);
        }
    }

    setLocalPosition(evt) {
        this.destination.setPosition(evt);
    }

    setAudioProperties(evt) {
        this.destination.setAudioProperties(evt);

        for (let source of this.sourceList) {
            source.setAudioProperties(evt);
        }
    }

    removeUser(evt) {
        const source = this.sourceLookup[evt.id];
        if (!!source) {
            const sourceIdx = this.sourceList.indexOf(source);
            if (sourceIdx > -1) {
                this.sourceList.splice(sourceIdx, 1);
            }

            source.dispose();
            delete this.sourceLookup[evt.id];
        }
    }
}

class MockJitsiClient extends BaseJitsiClient {
    constructor() {
        super();
        this.host;
        this.testUsers = null;
        this.roomName = null;
        this.userName = null;
        this.audioMuted = false;
        this.videoMuted = true;
        this.availableDevices = {
            audioInput: [
                { id: "mock-audio-input-1", label: "Mock audio input device #1" },
                { id: "mock-audio-input-2", label: "Mock audio input device #2" },
                { id: "mock-audio-input-3", label: "Mock audio input device #3" }
            ],
            audioOutput: [
                { id: "mock-audio-output-1", label: "Mock audio output device #1" },
                { id: "mock-audio-output-2", label: "Mock audio output device #2" }
            ],
            videoInput: [
                { id: "mock-video-input-1", label: "Mock video input device #1" },
                { id: "mock-video-input-2", label: "Mock video input device #2" }
            ]
        };

        this.currentDevices = {
            audioInput: this.availableDevices.audioInput[1],
            audioOutput: this.availableDevices.audioOutput[1],
            videoInput: null
        };

        window.addEventListener("message", (evt) => {
            this.rxJitsiHax(evt);
        });

        this.audioClient = new AudioManager();
    }

    async initializeAsync(host, roomName) {
        this.host = host;
        this.roomName = roomName;
    }

    setDisplayName(displayName) {
        this.userName = displayName;
        this.dispatchEvent(Object.assign(
            new Event("videoConferenceJoined"),
            {
                roomName: this.roomName,
                id: "mock-local-user-" + userNumber,
                displayName
            }));
    }

    async getAudioOutputDevices() {
        return this.availableDevices.audioOutput;
    }

    async getCurrentAudioOutputDevice() {
        return this.currentDevices.audioOutput;
    }

    setAudioOutputDevice(device) {
        this.currentDevices.audioOutput = device;
    }

    async getAudioInputDevices() {
        return this.availableDevices.audioInput;
    }

    async getCurrentAudioInputDevice() {
        return this.currentDevices.audioInput;
    }

    setAudioInputDevice(device) {
        this.currentDevices.audioInput = device;
    }

    async getVideoInputDevices() {
        return this.availableDevices.videoInput;
    }

    async getCurrentVideoInputDevice() {
        return this.currentDevices.videoInput;
    }

    setVideoInputDevice(device) {
        this.currentDevices.videoInput = device;
    }

    toggleAudio() {
        this.audioMuted = !this.audioMuted;
        this.dispatchEvent(Object.assign(new Event("audioMuteStatusChanged"), {
            id: this.localUser,
            muted: this.audioMuted
        }));
    }

    toggleVideo() {
        this.videoMuted = !this.videoMuted;
        this.dispatchEvent(Object.assign(new Event("videoMuteStatusChanged"), {
            id: this.localUser,
            muted: this.videoMuted
        }));
    }

    async isAudioMutedAsync() {
        return this.audioMuted;
    }

    async isVideoMutedAsync() {
        return this.videoMuted;
    }

    setAvatarURL(url) {
        this.dispatchEvent(Object.assign(new Event("avatarChanged"), {
            avatarURL: url
        }));
    }

    sendMessageTo(toUserID, data) {
        if (toUserID === this.localUser) {
            this.dispatchEvent(new CallaEvent(data));
        }
        else {
            const user = this.testUsers.filter(u => u.id === toUserID)[0];
            if (!!user) {
                if (data.command === "userInitRequest") {
                    this.userInitResponse(this.localUser, user);
                }
            }
        }
    }
}

const EMOJI_LIFE = 2;

class Emote {
    constructor(emoji, x, y) {
        this.emoji = emoji;
        this.x = x;
        this.y = y;
        this.dx = Math.random() - 0.5;
        this.dy = -Math.random() * 0.5 - 0.5;
        this.life = 1;
        this.width = -1;
    }

    isDead() {
        return this.life <= 0;
    }

    update(dt) {
        this.life -= dt / EMOJI_LIFE;
        this.dx *= 0.99;
        this.dy *= 0.99;
        this.x += this.dx * dt;
        this.y += this.dy * dt;
    }

    drawShadow(g, map, cameraZ) {
        g.save();
        {
            g.shadowColor = "rgba(0, 0, 0, 0.5)";
            g.shadowOffsetX = 3 * cameraZ;
            g.shadowOffsetY = 3 * cameraZ;
            g.shadowBlur = 3 * cameraZ;

            this.drawEmote(g, map);
        }
        g.restore();
    }

    drawEmote(g, map) {
        g.fillStyle = `rgba(0, 0, 0, ${this.life})`;
        g.font = map.tileHeight / 2 + "px sans-serif";
        if (this.width === -1) {
            const metrics = g.measureText(this.emoji.value);
            this.width = metrics.width;
        }

        g.fillText(
            this.emoji.value,
            this.x * map.tileWidth - this.width / 2,
            this.y * map.tileHeight);
    }
}

class TileSet {
    constructor(url) {
        this.url = url;
        this.tileWidth = 0;
        this.tileHeight = 0;
        this.tilesPerRow = 0;
        this.image = new Image();
        this.collision = {};
    }

    async load() {
        const response = await fetch(this.url),
            tileset = await response.xml(),
            imageLoad = new Promise((resolve, reject) => {
                this.image.addEventListener("load", (evt) => {
                    this.tilesPerRow = Math.floor(this.image.width / this.tileWidth);
                    resolve();
                });
                this.image.addEventListener("error", reject);
            }),
            image = tileset.querySelector("image"),
            imageSource = image.getAttribute("source"),
            imageURL = new URL(imageSource, this.url),
            tiles = tileset.querySelectorAll("tile");

        for (let tile of tiles) {
            const id = 1 * tile.getAttribute("id"),
                collid = tile.querySelector("properties > property[name='Collision']"),
                value = collid.getAttribute("value");
            this.collision[id] = value === "true";
        }

        this.name = tileset.getAttribute("name");
        this.tileWidth = 1 * tileset.getAttribute("tilewidth");
        this.tileHeight = 1 * tileset.getAttribute("tileheight");
        this.tileCount = 1 * tileset.getAttribute("tilecount");
        this.image.src = imageURL.href;
        await imageLoad;
    }

    isClear(tile) {
        return !this.collision[tile - 1];
    }

    draw(g, tile, x, y) {
        if (tile > 0) {
            const idx = tile - 1,
                sx = this.tileWidth * (idx % this.tilesPerRow),
                sy = this.tileHeight * Math.floor(idx / this.tilesPerRow),
                dx = x * this.tileWidth,
                dy = y * this.tileHeight;

            g.drawImage(this.image,
                sx, sy, this.tileWidth, this.tileHeight,
                dx, dy, this.tileWidth, this.tileHeight);
        }
    }
}

// TODO: move map data to requestable files
class TileMap {
    constructor(tilemapName) {
        this.url = new URL(`/data/tilemaps/${tilemapName}.tmx`, document.location);
        this.tileset = null;
        this.tileWidth = 0;
        this.tileHeight = 0;
        this.layers = 0;
        this.width = 0;
        this.height = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.tiles = null;
        this.collision = null;
    }

    async load() {
        const response = await fetch(this.url.href),
            map = await response.xml(),
            width = 1 * map.getAttribute("width"),
            height = 1 * map.getAttribute("height"),
            tileWidth = 1 * map.getAttribute("tilewidth"),
            tileHeight = 1 * map.getAttribute("tileheight"),
            tileset = map.querySelector("tileset"),
            tilesetSource = tileset.getAttribute("source"),
            layers = map.querySelectorAll("layer > data");

        this.layers = layers.length;
        this.width = width;
        this.height = height;
        this.offsetX = -Math.floor(width / 2);
        this.offsetY = -Math.floor(height / 2);
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        this.tiles = [];
        for (let layer of layers) {
            const tileIds = layer.innerHTML
                    .replace(" ", "")
                    .replace("\t", "")
                    .replace("\n", "")
                    .replace("\r", "")
                    .split(","),
                rows = [];
            let row = [];
            for (let tile of tileIds) {
                row.push(tile);
                if (row.length === width) {
                    rows.push(row);
                    row = [];
                }
            }
            if (row.length > 0) {
                rows.push(row);
            }
            this.tiles.push(rows);
        }

        this.tileset = new TileSet(new URL(tilesetSource, this.url));
        await this.tileset.load();
        this.tileWidth = this.tileset.tileWidth;
        this.tileHeight = this.tileset.tileHeight;
    }

    draw(g) {
        g.save();
        {
            g.translate(this.offsetX * this.tileWidth, this.offsetY * this.tileHeight);
            for (let l = 0; l < this.layers; ++l) {
                const layer = this.tiles[l];
                for (let y = 0; y < this.height; ++y) {
                    const row = layer[y];
                    for (let x = 0; x < this.width; ++x) {
                        const tile = row[x];
                        this.tileset.draw(g, tile, x, y);
                    }
                }
            }
        }
        g.restore();
    }

    isClear(x, y, avatar) {
        x -= this.offsetX;
        y -= this.offsetY;
        return x < 0 || this.width <= x
            || y < 0 || this.height <= y
            || this.tileset.isClear(this.tiles[0][y][x])
            || isSurfer(avatar.value);
    }

    // Use Bresenham's line algorithm (with integer error)
    // to draw a line through the map, cutting it off if
    // it hits a wall.
    getClearTile(x, y, dx, dy, avatar) {
        const x1 = x + dx,
            y1 = y + dy,
            sx = x < x1 ? 1 : -1,
            sy = y < y1 ? 1 : -1;

        dx = Math.abs(x1 - x);
        dy = Math.abs(y1 - y);

        let err = (dx > dy ? dx : -dy) / 2;

        while (x !== x1
            || y !== y1) {
            const e2 = err;
            if (e2 > -dx) {
                if (this.isClear(x + sx, y, avatar)) {
                    err -= dy;
                    x += sx;
                }
                else {
                    break;
                }
            }
            if (e2 < dy) {
                if (this.isClear(x, y + sy, avatar)) {
                    err += dx;
                    y += sy;
                }
                else {
                    break;
                }
            }
        }

        return { x, y };
    }
}

const POSITION_REQUEST_DEBOUNCE_TIME = 1000,
    STACKED_USER_OFFSET_X = 5,
    STACKED_USER_OFFSET_Y = 5,
    eventNames$1 = ["userMoved", "userPositionNeeded"];

class User extends EventTarget {
    constructor(id, displayName, isMe) {
        super();

        this.id = id;

        this.x = 0;
        this.y = 0;
        this.avatarEmoji = (isMe ? randomPerson() : bust);

        this.displayName = displayName || id;
        this.audioMuted = false;
        this.videoMuted = true;
        this.sx = 0;
        this.sy = 0;
        this.tx = 0;
        this.ty = 0;
        this.dx = 0;
        this.dy = 0;
        this.dist = 0;
        this.t = 0;
        this.distXToMe = 0;
        this.distYToMe = 0;
        this.isMe = isMe;
        this.isActive = false;
        this.avatarImage = null;
        this.avatarURL = null;
        this.stackUserCount = 1;
        this.stackIndex = 0;
        this.stackAvatarHeight = 0;
        this.stackAvatarWidth = 0;
        this.stackOffsetX = 0;
        this.stackOffsetY = 0;
        this.isInitialized = isMe;
        this.lastPositionRequestTime = Date.now() - POSITION_REQUEST_DEBOUNCE_TIME;
        this.moveEvent = new UserMoveEvent(this.id);
        this.visible = true;
    }

    init(evt) {
        this.sx
            = this.tx
            = this.x
            = evt.x;
        this.sx
            = this.ty
            = this.y
            = evt.y;
        this.displayName = evt.displayName;
        this.avatarURL = evt.avatarURL;
        if (!this.avatarURL && !!this.avatarImage) {
            this.avatarImage = null;
        }

        this.avatarEmoji = evt.avatarEmoji;
        this.isInitialized = true;
    }

    get avatarEmoji() {
        return this._avatarEmoji;
    }

    set avatarEmoji(emoji) {
        this._avatarEmoji = emoji;
        this.avatarEmojiMetrics = null;
        if (!!emoji) {
            this.setAvatarURL("");
        }
    }


    addEventListener(evtName, func, opts) {
        if (eventNames$1.indexOf(evtName) === -1) {
            throw new Error(`Unrecognized event type: ${evtName}`);
        }

        super.addEventListener(evtName, func, opts);
    }

    setAvatarURL(url) {
        if (url !== null
            && url !== undefined) {

            if (url.length === 0) {
                this.avatarURL = null;
                this.avatarImage = null;
            }
            else {
                this.avatarURL = url;
                const img = new Image();
                img.addEventListener("load", (evt) => {
                    this.avatarImage = Canvas(
                        width(img.width),
                        height(img.height));
                    const g = this.avatarImage.getContext("2d");
                    g.clearRect(0, 0, img.width, img.height);
                    g.imageSmoothingEnabled = false;
                    g.drawImage(img, 0, 0);
                });
                img.src = url;
            }
        }
    }

    setDisplayName(name) {
        this.displayName = name || this.id;
    }

    moveTo(x, y) {
        if (this.isMe) {
            if (x !== this.tx
                || y !== this.ty) {
                this.moveEvent.set(x, y);
                this.dispatchEvent(this.moveEvent);
            }
        }
        else if (!this.isInitialized) {
            this.isInitialized = true;
            this.x = x;
            this.y = y;
        }

        this.sx = this.x;
        this.sy = this.y;
        this.tx = x;
        this.ty = y;

        if (this.tx !== this.sx
            || this.ty !== this.sy) {
            this.dx = this.tx - this.sx;
            this.dy = this.ty - this.sy;
            this.dist = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
            this.t = 0;
        }
    }

    update(dt, map, userList) {
        if (this.isInitialized) {
            if (this.dist > 0) {
                this.t += dt;
                if (this.t >= MOVE_TRANSITION_TIME) {
                    this.x = this.sx = this.tx;
                    this.y = this.sy = this.ty;
                    this.t = this.dx = this.dy = this.dist = 0;
                }
                else {
                    const p = this.t / MOVE_TRANSITION_TIME,
                        s = Math.sin(Math.PI * p / 2);
                    this.x = this.sx + s * this.dx;
                    this.y = this.sy + s * this.dy;
                }
            }

            this.stackUserCount = 0;
            this.stackIndex = 0;
            for (let user of userList) {
                if (user.isInitialized
                    && user.tx === this.tx
                    && user.ty === this.ty) {
                    if (user.id === this.id) {
                        this.stackIndex = this.stackUserCount;
                    }
                    ++this.stackUserCount;
                }
            }

            this.stackAvatarWidth = map.tileWidth - (this.stackUserCount - 1) * STACKED_USER_OFFSET_X;
            const oldHeight = this.stackAvatarHeight;
            this.stackAvatarHeight = map.tileHeight - (this.stackUserCount - 1) * STACKED_USER_OFFSET_Y;
            if (this.stackAvatarHeight != oldHeight) {
                this.avatarEmojiMetrics = null;
            }
            this.stackOffsetX = this.stackIndex * STACKED_USER_OFFSET_X;
            this.stackOffsetY = this.stackIndex * STACKED_USER_OFFSET_Y;
        }
        else {
            const now = Date.now(),
                dt = now - this.lastPositionRequestTime;
            if (dt >= POSITION_REQUEST_DEBOUNCE_TIME) {
                this.lastPositionRequestTime = now;
                this.dispatchEvent(new UserPositionNeededEvent(this.id));
            }
        }
    }

    drawShadow(g, map, cameraZ) {
        const x = this.x * map.tileWidth,
            y = this.y * map.tileHeight,
            t = g.getTransform(),
            p = t.transformPoint({ x, y });

        this.visible = -map.tileWidth <= p.x
            && p.x < g.canvas.width
            && -map.tileHeight <= p.y
            && p.y < g.canvas.height;

        if (this.visible) {
            g.save();
            {
                g.shadowColor = "rgba(0, 0, 0, 0.5)";
                g.shadowOffsetX = 3 * cameraZ;
                g.shadowOffsetY = 3 * cameraZ;
                g.shadowBlur = 3 * cameraZ;

                this.innerDraw(g, map);
            }
            g.restore();
        }
    }

    drawAvatar(g, map) {
        if (this.visible) {
            g.save();
            {
                this.innerDraw(g, map);
                if (this.isActive && !this.audioMuted) {
                    const height = this.stackAvatarHeight / 2;
                    g.font = height + "px sans-serif";
                    const metrics = g.measureText(speakerMediumVolume.value);
                    g.fillText(
                        speakerMediumVolume.value,
                        this.stackAvatarWidth - metrics.width,
                        0);
                }
            }
            g.restore();
        }
    }

    innerDraw(g, map) {
        g.translate(
            this.x * map.tileWidth + this.stackOffsetX,
            this.y * map.tileHeight + this.stackOffsetY);
        g.fillStyle = "black";
        g.textBaseline = "top";
        if (!this.avatarImage) {
            g.font = 0.9 * this.stackAvatarHeight + "px sans-serif";
            if (!this.avatarEmojiMetrics) {
                this.avatarEmojiMetrics = g.measureText(this.avatarEmoji.value);
            }
            g.fillText(
                this.avatarEmoji.value,
                (this.avatarEmojiMetrics.width - this.stackAvatarWidth) / 2 + this.avatarEmojiMetrics.actualBoundingBoxLeft,
                this.avatarEmojiMetrics.actualBoundingBoxAscent);
        }
        else {
            g.drawImage(
                this.avatarImage,
                0, 0,
                this.stackAvatarWidth,
                this.stackAvatarHeight);
        }

        if (this.audioMuted || !this.videoMuted) {
            const height = this.stackAvatarHeight / 2;
            g.font = height + "px sans-serif";
            if (this.audioMuted) {
                const metrics = g.measureText(mutedSpeaker.value);
                g.fillText(
                    mutedSpeaker.value,
                    this.stackAvatarWidth - metrics.width,
                    0);
            }
            if (!this.videoMuted) {
                const metrics = g.measureText(videoCamera.value);
                g.fillText(
                    videoCamera.value,
                    this.stackAvatarWidth - metrics.width,
                    height);
            }
        }
    }

    drawName(g, map, cameraZ, fontSize) {
        if (this.visible) {
            g.save();
            {
                g.translate(
                    this.x * map.tileWidth + this.stackOffsetX,
                    this.y * map.tileHeight + this.stackOffsetY);
                g.shadowColor = "black";
                g.shadowOffsetX = 3 * cameraZ;
                g.shadowOffsetY = 3 * cameraZ;
                g.shadowBlur = 3 * cameraZ;

                g.fillStyle = "white";
                g.textBaseline = "bottom";
                g.font = `${fontSize * devicePixelRatio}pt sans-serif`;
                g.fillText(this.displayName, 0, 0);
            }
            g.restore();
        }
    }

    drawHearingTile(g, map, dx, dy, p) {
        g.save();
        {
            g.translate(
                (this.tx + dx) * map.tileWidth,
                (this.ty + dy) * map.tileHeight);
            g.strokeStyle = `rgba(0, 255, 0, ${(1 - p) / 2})`;
            g.strokeRect(0, 0, map.tileWidth, map.tileHeight);
        }
        g.restore();
    }

    drawHearingRange(g, map, cameraZ, minDist, maxDist) {
        if (this.isInitialized) {
            const tw = Math.min(maxDist, Math.ceil(g.canvas.width / (2 * map.tileWidth * cameraZ))),
                th = Math.min(maxDist, Math.ceil(g.canvas.height / (2 * map.tileHeight * cameraZ)));

            for (let dy = 0; dy < th; ++dy) {
                for (let dx = 0; dx < tw; ++dx) {
                    const dist = Math.sqrt(dx * dx + dy * dy),
                        p = project(dist, minDist, maxDist);
                    if (p <= 1) {
                        this.drawHearingTile(g, map, dx, dy, p);
                        if (dy != 0) {
                            this.drawHearingTile(g, map, dx, -dy, p);
                        }
                        if (dx != 0) {
                            this.drawHearingTile(g, map, -dx, dy, p);
                        }
                        if (dx != 0 && dy != 0) {
                            this.drawHearingTile(g, map, -dx, -dy, p);
                        }
                    }
                }
            }
        }
    }
}


class UserMoveEvent extends Event {
    constructor(id) {
        super("userMoved");
        this.id = id;
        this.x = 0;
        this.y = 0;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }
}

class UserPositionNeededEvent extends Event {
    constructor(id) {
        super("userPositionNeeded");
        this.id = id;
    }
}

const CAMERA_LERP = 0.01,
    CAMERA_ZOOM_MAX = 8,
    CAMERA_ZOOM_MIN = 0.1,
    CAMERA_ZOOM_SHAPE = 1 / 4,
    CAMERA_ZOOM_SPEED = 0.005,
    MAX_DRAG_DISTANCE = 5,
    isFirefox = typeof InstallTrigger !== "undefined",
    gameStartedEvt = new Event("gamestarted"),
    gameEndedEvt = new Event("gameended"),
    zoomChangedEvt = new Event("zoomchanged"),
    emojiNeededEvt = new Event("emojineeded"),
    toggleAudioEvt = new Event("toggleaudio"),
    toggleVideoEvt = new Event("togglevideo"),
    emoteEvt = Object.assign(new Event("emote"), {
        id: null,
        emoji: null
    }),
    userJoinedEvt = Object.assign(new Event("userjoined", {
        user: null
    }));

class Game extends EventTarget {

    constructor() {
        super();

        this.element = Canvas(
            id("frontBuffer"),
            fillPageStyle,
            style({ touchAction: "none" }));
        this.gFront = this.element.getContext("2d");

        this.me = null;
        this.map = null;
        this.keys = {};
        this.userLookup = {};
        this.userList = [];

        this._loop = this.loop.bind(this);
        this.lastTime = 0;
        this.lastMove = Number.MAX_VALUE;
        this.gridOffsetX = 0;
        this.gridOffsetY = 0;
        this.cameraX = this.offsetCameraX = this.targetOffsetCameraX = 0;
        this.cameraY = this.offsetCameraY = this.targetOffsetCameraY = 0;
        this.cameraZ = this.targetCameraZ = 1.5;
        this.currentRoomName = null;
        this.fontSize = 10;

        this.drawHearing = false;
        this.audioDistanceMin = 2;
        this.audioDistanceMax = 10;
        this.rolloff = 5;

        this.pointers = [];
        this.lastPinchDistance = 0;
        this.canClick = false;

        this.currentEmoji = null;
        this.emotes = [];

        this.keyEmote = "e";
        this.keyToggleAudio = "a";
        this.keyUp = "ArrowUp";
        this.keyDown = "ArrowDown";
        this.keyLeft = "ArrowLeft";
        this.keyRight = "ArrowRight";

        this.gamepads = [];
        this.lastGamepadIndex = -1;
        this.gamepadIndex = -1;
        this.buttonEmote = 0;
        this.buttonToggleAudio = 1;
        this.buttonUp = 12;
        this.buttonDown = 13;
        this.buttonLeft = 14;
        this.buttonRight = 15;

        // ============= KEYBOARD =================

        addEventListener("keydown", (evt) => {
            this.keys[evt.key] = evt;
            if (!evt.ctrlKey
                && !evt.altKey
                && !evt.shiftKey
                && !evt.metaKey
                && evt.key === this.keyToggleAudio
                && !!this.me) {
                this.toggleMyAudio();
            }
        });

        addEventListener("keyup", (evt) => {
            if (!!this.keys[evt.key]) {
                delete this.keys[evt.key];
            }
        });

        // ============= KEYBOARD =================

        // ============= POINTERS =================

        this.element.addEventListener("wheel", (evt) => {
            if (!evt.shiftKey
                && !evt.altKey
                && !evt.ctrlKey
                && !evt.metaKey) {
                // Chrome and Firefox report scroll values in completely different ranges.
                const deltaZ = evt.deltaY * (isFirefox ? 1 : 0.02);
                this.zoom(deltaZ);
            }
        }, { passive: true });

        function readPointer(evt) {
            return {
                id: evt.pointerId,
                buttons: evt.buttons,
                dragDistance: 0,
                x: evt.offsetX * devicePixelRatio,
                y: evt.offsetY * devicePixelRatio
            }
        }

        const findPointer = (pointer) => {
            return this.pointers.findIndex(p => p.id === pointer.id);
        };

        const replacePointer = (pointer) => {
            const idx = findPointer(pointer);
            if (idx > -1) {
                const last = this.pointers[idx];
                this.pointers[idx] = pointer;
                return last;
            }
            else {
                this.pointers.push(pointer);
                return null;
            }
        };

        const getPressCount = () => {
            let count = 0;
            for (let pointer of this.pointers) {
                if (pointer.buttons === 1) {
                    ++count;
                }
            }
            return count;
        };

        this.element.addEventListener("pointerdown", (evt) => {
            const oldCount = getPressCount(),
                pointer = readPointer(evt),
                _ = replacePointer(pointer),
                newCount = getPressCount();

            this.canClick = oldCount === 0
                && newCount === 1;
        });

        const getPinchDistance = () => {
            const count = getPressCount();
            if (count !== 2) {
                return null;
            }

            const pressed = this.pointers.filter(p => p.buttons === 1),
                a = pressed[0],
                b = pressed[1],
                dx = b.x - a.x,
                dy = b.y - a.y;

            return Math.sqrt(dx * dx + dy * dy);
        };

        this.element.addEventListener("pointermove", (evt) => {
            const oldPinchDistance = getPinchDistance(),
                pointer = readPointer(evt),
                last = replacePointer(pointer),
                count = getPressCount(),
                newPinchDistance = getPinchDistance();

            if (count === 1) {

                if (!!last
                    && pointer.buttons === 1
                    && last.buttons === pointer.buttons) {
                    const dx = pointer.x - last.x,
                        dy = pointer.y - last.y,
                        dist = Math.sqrt(dx * dx + dy * dy);
                    pointer.dragDistance = last.dragDistance + dist;

                    if (pointer.dragDistance > MAX_DRAG_DISTANCE) {
                        this.targetOffsetCameraX = this.offsetCameraX += dx;
                        this.targetOffsetCameraY = this.offsetCameraY += dy;
                        this.canClick = false;
                    }
                }

            }

            if (oldPinchDistance !== null
                && newPinchDistance !== null) {
                const ddist = oldPinchDistance - newPinchDistance;
                this.zoom(ddist / 5);
                this.canClick = false;
            }
        });

        this.element.addEventListener("pointerup", (evt) => {
            const pointer = readPointer(evt),
                _ = replacePointer(pointer);

            if (!!this.me && pointer.dragDistance < 2) {
                const tile = this.getTileAt(pointer),
                    dx = tile.x - this.me.tx,
                    dy = tile.y - this.me.ty;

                if (dx === 0 && dy === 0) {
                    this.emote(this.me.id, this.currentEmoji);
                }
                else if (this.canClick) {
                    this.moveMeBy(dx, dy);
                }
            }
        });

        this.element.addEventListener("pointercancel", (evt) => {
            const pointer = readPointer(evt),
                idx = findPointer(pointer);

            if (idx >= 0) {
                this.pointers.splice(idx, 1);
            }

            return pointer;
        });

        // ============= POINTERS =================

        // ============= GAMEPAD =================
        {
            addEventListener("gamepadconnected", (evt) => {
                const pad = evt.gamepad,
                    idx = this.gamepads.findIndex(x => x.id === pad.id);
                if (idx === -1) {
                    this.gamepads.push(pad);
                    if (this.gamepads.length === 1) {
                        this.gamepadIndex = 0;
                    }
                }
            });

            addEventListener("gamepaddisconnected", (evt) => {
                const pad = evt.gamepad,
                    idx = this.gamepads.findIndex(x => x.id === pad.id);
                if (idx >= 0) {
                    this.gamepads.splice(idx, 1);
                    if (this.gamepads.length === 0) {
                        this.gamepadIndex = -1;
                    }
                }
            });
        }
        // ============= GAMEPAD =================

        // ============= ACTION ==================
    }

    hide() {
        this.element.hide();
    }

    show() {
        this.element.show();
    }

    setOpen(v) {
        this.element.setOpen(v);
    }

    updateAudioActivity(evt) {
        const user = this.userLookup[evt.id];
        if (!!user) {
            user.isActive = evt.isActive;
        }
    }

    emote(id, emoji) {
        const user = this.userLookup[id];

        if (!!user) {

            if (user.isMe) {

                emoji = emoji
                    || this.currentEmoji;

                if (!emoji) {
                    this.dispatchEvent(emojiNeededEvt);
                }
                else {
                    this.currentEmoji = emoji;
                    for (let user of this.userList) {
                        if (user !== this.me) {
                            emoteEvt.id = user.id;
                            emoteEvt.emoji = emoji;
                            this.dispatchEvent(emoteEvt);
                        }
                    }
                }
            }

            if (!!emoji) {
                this.emotes.push(new Emote(emoji, user.tx + 0.5, user.ty));
            }
        }
    }

    getTileAt(cursor) {
        const imageX = cursor.x - this.gridOffsetX - this.offsetCameraX,
            imageY = cursor.y - this.gridOffsetY - this.offsetCameraY,
            zoomX = imageX / this.cameraZ,
            zoomY = imageY / this.cameraZ,
            mapX = zoomX - this.cameraX,
            mapY = zoomY - this.cameraY,
            mapWidth = this.map.tileWidth,
            mapHeight = this.map.tileHeight,
            gridX = Math.floor(mapX / mapWidth),
            gridY = Math.floor(mapY / mapHeight),
            tile = { x: gridX, y: gridY };
        return tile;
    }

    moveMeBy(dx, dy) {
        const clearTile = this.map.getClearTile(this.me.tx, this.me.ty, dx, dy, this.me.avatarEmoji);
        this.me.moveTo(clearTile.x, clearTile.y);
        this.targetOffsetCameraX = 0;
        this.targetOffsetCameraY = 0;
    }

    zoom(deltaZ) {
        const mag = Math.abs(deltaZ);
        if (0 < mag && mag <= 50) {
            const a = project(this.targetCameraZ, CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX),
                b = Math.pow(a, CAMERA_ZOOM_SHAPE),
                c = b - deltaZ * CAMERA_ZOOM_SPEED,
                d = clamp(c, 0, 1),
                e = Math.pow(d, 1 / CAMERA_ZOOM_SHAPE);

            this.targetCameraZ = unproject(e, CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX);
            this.dispatchEvent(zoomChangedEvt);
        }
    }

    addUser(evt) {
        //evt = {
        //    id: "string", // the id of the participant
        //    displayName: "string" // the display name of the participant
        //};
        if (this.userLookup[evt.id]) {
            this.removeUser(evt);
        }

        const user = new User(evt.id, evt.displayName, false);
        this.userLookup[evt.id] = user;
        this.userList.unshift(user);
        userJoinedEvt.user = user;
        this.dispatchEvent(userJoinedEvt);
    }

    changeUserName(evt) {
        //evt = {
        //    id: string, // the id of the participant that changed his display name
        //    displayName: string // the new display name
        //};

        const user = this.userLookup[evt.id];
        if (!!user) {
            user.setDisplayName(evt.displayName);
        }
    }

    toggleMyAudio() {
        this.dispatchEvent(toggleAudioEvt);
    }

    toggleMyVideo() {
        this.dispatchEvent(toggleVideoEvt);
    }

    muteUserAudio(evt) {
        let mutingUser = this.me;
        if (!!evt.id) {
            mutingUser = this.userLookup[evt.id];
        }

        if (!mutingUser) {
            console.log("no user");
            setTimeout(this.muteUserAudio.bind(this, evt), 1000);
        }
        else {
            mutingUser.audioMuted = evt.muted;
        }
    }

    muteUserVideo(evt) {
        let mutingUser = this.me;
        if (!!evt.id) {
            mutingUser = this.userLookup[evt.id];
        }

        if (!mutingUser) {
            console.log("no user");
            setTimeout(this.muteUserVideo.bind(this, evt), 1000);
        }
        else {
            mutingUser.videoMuted = evt.muted;
        }
    }

    removeUser(evt) {
        //evt = {
        //    id: "string" // the id of the participant
        //};
        const user = this.userLookup[evt.id];
        if (!!user) {
            delete this.userLookup[evt.id];

            const userIndex = this.userList.indexOf(user);
            if (userIndex >= 0) {
                this.userList.splice(userIndex, 1);
            }
        }
    }

    setAvatarURL(evt) {
        //evt = {
        //  id: string, // the id of the participant that changed his avatar.
        //  avatarURL: string // the new avatar URL.
        //}
        if (!!evt) {
            const user = this.userLookup[evt.id];
            if (!!user) {
                user.setAvatarURL(evt.avatarURL);
            }
        }
    }

    async start(evt) {
        //evt = {
        //    roomName: "string", // the room name of the conference
        //    id: "string", // the id of the local participant
        //    displayName: "string", // the display name of the local participant
        //    avatarURL: "string" // the avatar URL of the local participant
        //};

        this.currentRoomName = evt.roomName.toLowerCase();
        this.me = new User(evt.id, evt.displayName, true);
        this.userList.push(this.me);
        this.userLookup[this.me.id] = this.me;

        this.setAvatarURL(evt);

        this.map = new TileMap(this.currentRoomName);
        let success = false;
        for (let retryCount = 0; retryCount < 2; ++retryCount) {
            try {
                await this.map.load();
                success = true;
            }
            catch (exp) {
                console.warn(exp);
                this.map = new TileMap("default");
            }
        }

        if (!success) {
            console.error("Couldn't load any maps!");
        }

        this.startLoop();
        this.dispatchEvent(zoomChangedEvt);
        this.dispatchEvent(gameStartedEvt);
    }

    startLoop() {
        this.element.show();
        this.element.resize();
        this.element.focus();

        requestAnimationFrame((time) => {
            this.lastTime = time;
            requestAnimationFrame(this._loop);
        });
    }

    resize(top) {
        if (top !== undefined) {
            this.element.style.top = top + "px";
            this.element.style.height = `calc(100% - ${top}px)`;
        }
        this.element.resize();
    }

    loop(time) {
        if (this.currentRoomName !== null) {
            requestAnimationFrame(this._loop);
            const dt = time - this.lastTime;
            this.lastTime = time;
            this.update(dt / 1000);
            this.render();
        }
    }

    end() {
        this.currentRoomName = null;
        this.map = null;
        this.userLookup = {};
        this.userList.splice(0);
        this.me = null;
        this.dispatchEvent(gameEndedEvt);
    }

    update(dt) {
        this.gridOffsetX = Math.floor(0.5 * this.element.width / this.map.tileWidth) * this.map.tileWidth;
        this.gridOffsetY = Math.floor(0.5 * this.element.height / this.map.tileHeight) * this.map.tileHeight;

        this.lastMove += dt;
        if (this.lastMove >= MOVE_REPEAT) {
            let dx = 0,
                dy = 0;

            for (let evt of Object.values(this.keys)) {
                if (!evt.altKey
                    && !evt.shiftKey
                    && !evt.ctrlKey
                    && !evt.metaKey) {
                    switch (evt.key) {
                        case this.keyUp: dy--; break;
                        case this.keyDown: dy++; break;
                        case this.keyLeft: dx--; break;
                        case this.keyRight: dx++; break;
                        case this.keyEmote: this.emote(this.me.id, this.currentEmoji); break;
                    }
                }
            }

            if (0 <= this.gamepadIndex && this.gamepadIndex < this.gamepads.length) {
                const lastPad = this.gamepads[this.gamepadIndex],
                    pad = navigator.getGamepads()[lastPad.index];

                this.lastGamepadIndex = this.gamepadIndex;

                if (pad.buttons[this.buttonEmote].pressed) {
                    this.emote(this.me.id, this.currentEmoji);
                }

                if (!lastPad.buttons[this.buttonToggleAudio].pressed
                    && pad.buttons[this.buttonToggleAudio].pressed) {
                    this.toggleMyAudio();
                }

                if (pad.buttons[this.buttonUp].pressed) {
                    --dy;
                }
                else if (pad.buttons[this.buttonDown].pressed) {
                    ++dy;
                }

                if (pad.buttons[this.buttonLeft].pressed) {
                    --dx;
                }
                else if (pad.buttons[this.buttonRight].pressed) {
                    ++dx;
                }

                dx += Math.round(pad.axes[0]);
                dy += Math.round(pad.axes[1]);

                this.targetOffsetCameraX += -50 * Math.round(2 * pad.axes[2]);
                this.targetOffsetCameraY += -50 * Math.round(2 * pad.axes[3]);
                this.zoom(2 * (pad.buttons[6].value - pad.buttons[7].value));

                this.gamepads[this.gamepadIndex] = pad;
            }

            dx = clamp(dx, -1, 1);
            dy = clamp(dy, -1, 1);

            if (dx !== 0
                || dy !== 0) {
                this.moveMeBy(dx, dy);
            }

            this.lastMove = 0;
        }

        for (let emote of this.emotes) {
            emote.update(dt);
        }

        this.emotes = this.emotes.filter(e => !e.isDead());

        for (let user of this.userList) {
            user.update(dt, this.map, this.userList);
        }
    }

    render() {
        const targetCameraX = -this.me.x * this.map.tileWidth,
            targetCameraY = -this.me.y * this.map.tileHeight;

        this.cameraZ = lerp(this.cameraZ, this.targetCameraZ, CAMERA_LERP * 10);
        this.cameraX = lerp(this.cameraX, targetCameraX, CAMERA_LERP * this.cameraZ);
        this.cameraY = lerp(this.cameraY, targetCameraY, CAMERA_LERP * this.cameraZ);

        this.offsetCameraX = lerp(this.offsetCameraX, this.targetOffsetCameraX, CAMERA_LERP);
        this.offsetCameraY = lerp(this.offsetCameraY, this.targetOffsetCameraY, CAMERA_LERP);

        this.gFront.resetTransform();
        this.gFront.imageSmoothingEnabled = false;
        this.gFront.clearRect(0, 0, this.element.width, this.element.height);

        this.gFront.save();
        {
            this.gFront.translate(
                this.gridOffsetX + this.offsetCameraX,
                this.gridOffsetY + this.offsetCameraY);
            this.gFront.scale(this.cameraZ, this.cameraZ);
            this.gFront.translate(this.cameraX, this.cameraY);

            this.map.draw(this.gFront);

            for (let user of this.userList) {
                user.drawShadow(this.gFront, this.map, this.cameraZ);
            }

            for (let emote of this.emotes) {
                emote.drawShadow(this.gFront, this.map, this.cameraZ);
            }

            for (let user of this.userList) {
                user.drawAvatar(this.gFront, this.map);
            }

            this.drawCursor();

            for (let user of this.userList) {
                user.drawName(this.gFront, this.map, this.cameraZ, this.fontSize);
            }

            if (this.drawHearing) {
                this.me.drawHearingRange(
                    this.gFront,
                    this.map,
                    this.cameraZ,
                    this.audioDistanceMin,
                    this.audioDistanceMax);
            }

            for (let emote of this.emotes) {
                emote.drawEmote(this.gFront, this.map);
            }

        }
        this.gFront.restore();
    }


    drawCursor() {
        if (this.pointers.length === 1) {
            const pointer = this.pointers[0],
                tile = this.getTileAt(pointer);
            this.gFront.strokeStyle = "red";
            this.gFront.strokeRect(
                tile.x * this.map.tileWidth,
                tile.y * this.map.tileHeight,
                this.map.tileWidth,
                this.map.tileHeight);
        }
    }
}

function Run(txt) {
    return Span(
        style({ margin: "auto" }),
        txt);
}

const toggleAudioEvt$1 = new Event("toggleaudio"),
    emoteEvt$1 = new Event("emote"),
    selectEmojiEvt = new Event("selectemoji"),
    zoomChangedEvt$1 = new Event("zoomchanged"),
    toggleOptionsEvt = new Event("toggleoptions"),
    tweetEvt = new Event("tweet"),
    leaveEvt = new Event("leave"),
    toggleUIEvt = new Event("toggleui"),
    toggleInstructionsEvt = new Event("toggleinstructions"),
    subelStyle = style({
        display: "inline-flex",
        margin: "0 0.5em 0 0"
    });

class ToolBar extends EventTarget {
    constructor() {
        super();

        const _ = (evt) => () => this.dispatchEvent(evt);

        this.element = Div(
            id("toolbar"),
            style({
                position: "fixed",
                top: 0,
                right: 0,
                backgroundColor: "#bbb",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap"
            }),

            this.toolbar = Div(
                style({
                    display: "flex",
                    width: "100vw",
                    padding: "4px",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    boxSizing: "border-box"
                }),
                systemFont,

                this.muteAudioButton = Button(
                    onClick(_(toggleAudioEvt$1)),
                    subelStyle,
                    systemFont,
                    speakerHighVolume.value),

                this.emojiControl = Span(
                    subelStyle,
                    this.emoteButton = Button(
                        title("Emote"),
                        onClick(_(emoteEvt$1)),
                        systemFont,
                        "Emote ",
                        KBD("(E)"),
                        "(@)"),
                    Button(
                        title("Select Emoji"),
                        systemFont,
                        onClick(_(selectEmojiEvt)),
                        downwardsButton.value)),

                Span(
                    subelStyle,
                    Label(
                        htmlFor("zoom"),
                        style({ margin: "auto" }),
                        "Zoom"),
                    this.zoomSpinner = Input(
                        type("number"),
                        id("zoom"),
                        title("Change map zoom"),
                        value(2),
                        min(0.1),
                        max(8),
                        step(0.1),
                        style({ width: "4em" }),
                        systemFont,
                        onInput(_(zoomChangedEvt$1)))),

                this.optionsButton = Button(
                    title("Show/hide options"),
                    onClick(_(toggleOptionsEvt)),
                    subelStyle,
                    systemFont,
                    gear.value),

                this.instructionsButton = Button(
                    title("Show/hide instructions"),
                    onClick(_(toggleInstructionsEvt)),
                    subelStyle,
                    systemFont,
                    questionMark.value),

                Button(
                    title("Share your current room to twitter"),
                    onClick(_(tweetEvt)),
                    subelStyle,
                    systemFont,
                    Run("Share room"),
                    Img(src("https://cdn2.iconfinder.com/data/icons/minimalism/512/twitter.png"),
                        alt("icon"),
                        role("presentation"),
                        style({ height: "1.5em" }))),

                Button(
                    title("Leave the room"),
                    onClick(_(leaveEvt)),
                    subelStyle,
                    systemFont,
                    style({ marginLeft: "1em" }),
                    Run("Leave"))),

            this.hideButton = Button(
                title("Show/hide Jitsi Meet interface"),
                style({
                    position: "absolute",
                    right: 0,
                    margin: "4px"
                }),
                systemFont,
                onClick(() => this.visible = !this.visible),
                Run(pauseButton.value)));

        this._audioEnabled = true;

        Object.seal(this);
    }

    get offsetHeight() {
        return this.toolbar.offsetHeight;
    }

    get zoom() {
        return this.zoomSpinner.value;
    }

    set zoom(value) {
        this.zoomSpinner.value = Math.round(value * 100) / 100;
    }

    get visible() {
        return this.toolbar.style.display !== "none";
    }

    set visible(value) {
        this.toolbar.setOpenWithLabel(
            value,
            this.hideButton,
            pauseButton.value,
            playButton.value);
        this.dispatchEvent(toggleUIEvt);
    }

    hide() {
        this.visible = false;
    }

    show() {
        this.visible = true;
    }

    get audioEnabled() {
        return this._audioEnabled;
    }

    set audioEnabled(value) {
        this._audioEnabled = value;
        this.muteAudioButton.updateLabel(
            value,
            speakerHighVolume.value,
            mutedSpeaker.value);
    }

    appendChild(child) {
        return this.toolbar.appendChild(child);
    }

    insertBefore(newChild, refChild) {
        return this.toolbar.insertBefore(newChild, refChild);
    }

    append(...children) {
        this.toolbar.append(...children);
    }

    setEmojiButton(key, emoji) {
        this.emoteButton.innerHTML = `Emote (<kbd>${key.toUpperCase()}</kbd>) (${emoji.value})`;
    }
}

const gamepadStates = new Map();

class EventedGamepad extends EventTarget {
    constructor(pad) {
        super();
        if (!(pad instanceof Gamepad)) {
            throw new Error("Value must be a Gamepad");
        }
        this.id = pad.id;
        const self = {
            btnDownEvts: [],
            btnUpEvts: [],
            btnState: []
        };
        gamepadStates.set(this, self);
        this.buttons = [];
        this.axes = [];
        this.hapticActuators = [];
        for (let b = 0; b < pad.buttons.length; ++b) {
            self.btnDownEvts[b] = Object.assign(new Event("gamepadbuttondown"), {
                button: b
            });
            self.btnUpEvts[b] = Object.assign(new Event("gamepadbuttonup"), {
                button: b
            });
            self.btnState[b] = pad.buttons[b].pressed;
            this.buttons[b] = pad.buttons[b];
        }
        for (let a = 0; a < pad.axes.length; ++a) {
            this.axes[a] = pad.axes[a];
        }
        if (pad.hapticActuators !== undefined) {
            for (let h = 0; h < pad.hapticActuators.length; ++h) {
                this.hapticActuators[h] = pad.hapticActuators[h];
            }
        }
        Object.freeze(this);
    }

    dispose() {
        gamepadStates.delete(this);
    }

    _update(pad) {
        if (!(pad instanceof Gamepad)) {
            throw new Error("Value must be a Gamepad");
        }
        const self = gamepadStates.get(this);
        for (let b = 0; b < pad.buttons.length; ++b) {
            const wasPressed = self.btnState[b], pressed = pad.buttons[b].pressed;
            if (pressed !== wasPressed) {
                self.btnState[b] = pressed;
                this.dispatchEvent((state
                    ? self.btnDownEvts
                    : self.btnUpEvts)[b]);
            }
            this.buttons[b] = pad.buttons[b];
        }
        for (let a = 0; a < pad.axes.length; ++a) {
            this.axes[a] = pad.axes[a];
        }
        if (pad.hapticActuators !== undefined) {
            for (let h = 0; h < pad.hapticActuators.length; ++h) {
                this.hapticActuators[h] = pad.hapticActuators[h];
            }
        }
    }
}

const gamepadConnectedEvt = Object.assign(new Event("gamepadconnected"), {
    gamepad: null
}),
    gamepadDisconnectedEvt = Object.assign(new Event("gamepaddisconnected"), {
        gamepad: null
    }),

    gamepads = new Map(),
    anyButtonDownEvt = Object.assign(new Event("gamepadbuttondown"), { button: 0 }),
    anyButtonUpEvt = Object.assign(new Event("gamepadbuttonup"), { button: 0 });

class GamepadStateManager extends EventTarget {
    constructor() {
        super();

        const onAnyButtonDown = (evt) => {
            anyButtonDownEvt.button = evt.button;
            this.dispatchEvent(anyButtonDownEvt);
        };

        const onAnyButtonUp = (evt) => {
            anyButtonUpEvt.button = evt.button;
            this.dispatchEvent(anyButtonUpEvt);
        };

        window.addEventListener("gamepadconnected", (evt) => {
            const pad = evt.gamepad,
                gamepad = new EventedGamepad(pad);
            gamepad.addEventListener("gamepadbuttondown", onAnyButtonDown);
            gamepad.addEventListener("gamepadbuttonup", onAnyButtonUp);
            gamepads.set(pad.id, gamepad);
            gamepadConnectedEvt.gamepad = gamepad;
            this.dispatchEvent(gamepadConnectedEvt);
        });

        window.addEventListener("gamepaddisconnected", (evt) => {
            const gamepad = gamepads.get(pad.id);
            gamepads.delete(pad.id);
            gamepad.removeEventListener("gamepadbuttondown", onAnyButtonDown);
            gamepad.removeEventListener("gamepadbuttonup", onAnyButtonUp);
            gamepadDisconnectedEvt.gamepad = gamepad;
            this.dispatchEvent(gamepadDisconnectedEvt);
            gamepad.dispose();
        });

        Object.freeze(this);
    }

    get gamepadIDs() {
        return gamepads.keys();
    }

    get gamepads() {
        return gamepads.values();
    }

    get(id) {
        return gamepads.get(id);
    }
}

const GamepadManager = new GamepadStateManager();


function update() {
    requestAnimationFrame(update);
    const pads = navigator.getGamepads();
    for (let pad of pads) {
        if (pad !== null
            && gamepads.has(pad.id)) {
            const gamepad = gamepads.get(pad.id);
            gamepad.update(pad);
        }
    }
}

requestAnimationFrame(update);

class FormDialog extends EventTarget {
    constructor(name, ...rest) {
        super();

        const formStyle = style({
            position: "absolute",
            display: "grid",
            gridTemplateColumns: "5fr 1fr 1fr",
            gridTemplateRows: "auto auto 1fr auto auto",
            overflowY: "hidden",
            width: "50%",
            left: "25%",
            top: "3em",
            maxWidth: "900px",
            maxHeight: "calc(100% - 4em)",
            backgroundColor: "white",
            padding: "1em 1em 3em 1em",
            margin: "auto",
            borderRadius: "5px",
            border: "solid 4px black",
            boxShadow: "rgba(0, 0, 0, .4) 10px 10px 20px",
            fontFamily: systemFamily
        });

        this.element = document.getElementById(name) ||
            Div(
                id(name),
                H1(
                    style({ gridArea: "1/1/2/4" }),
                    ...rest));

        formStyle.apply(this.element);

        this.header = this.element.querySelector(".header")
            || this.element.appendChild(
                Div(
                    className("header"),
                    style({ gridArea: "2/1/3/4" })));

        this.content = this.element.querySelector(".content")
            || this.element.appendChild(
                Div(
                    className("content"),
                    style({
                        overflowY: "scroll",
                        gridArea: "3/1/4/4"
                    })));

        this.footer = this.element.querySelector(".footer")
            || this.element.appendChild(
                Div(
                    className("footer"),
                    style({
                        display: "flex",
                        flexDirection: "row-reverse",
                        gridArea: "4/1/5/4"
                    })));
    }

    appendChild(child) {
        return this.element.appendChild(child);
    }

    append(...rest) {
        this.element.append(...rest);
    }

    show() {
        this.element.show("grid");
    }

    hide() {
        this.element.hide();
    }

    toggleOpen() {
        this.element.toggleOpen("grid");
    }
}

const inputBindingChangedEvt = new Event("inputbindingchanged");

class InputBinding extends EventTarget {
    constructor() {
        super();

        const bindings = new Map([
            ["keyButtonUp", "ArrowUp"],
            ["keyButtonDown", "ArrowDown"],
            ["keyButtonLeft", "ArrowLeft"],
            ["keyButtonRight", "ArrowRight"],
            ["keyButtonEmote", "e"],
            ["keyButtonToggleAudio", "a"],

            ["gpButtonUp", 12],
            ["gpButtonDown", 13],
            ["gpButtonLeft", 14],
            ["gpButtonRight", 15],
            ["gpButtonEmote", 0],
            ["gpButtonToggleAudio", 1]
        ]);

        for (let id of bindings.keys()) {
            Object.defineProperty(this, id, {
                get: () => bindings.get(id),
                set: (v) => {
                    if (bindings.has(id)
                        && v !== bindings.get(id)) {
                        bindings.set(id, v);
                        this.dispatchEvent(inputBindingChangedEvt);
                    }
                }
            });
        }

        Object.freeze(this);
    }
}

const keyWidthStyle = style({ width: "7em" }),
    numberWidthStyle = style({ width: "3em" }),
    avatarUrlChangedEvt = new Event("avatarurlchanged"),
    gamepadChangedEvt = new Event("gamepadchanged"),
    selectAvatarEvt = new Event("selectavatar"),
    fontSizeChangedEvt = new Event("fontsizechanged"),
    inputBindingChangedEvt$1 = new Event("inputbindingchanged"),
    audioPropsChangedEvt = new Event("audiopropschanged"),
    toggleDrawHearingEvt = new Event("toggledrawhearing"),
    toggleVideoEvt$1 = new Event("togglevideo"),
    audioInputChangedEvt = new Event("audioinputchanged"),
    audioOutputChangedEvt = new Event("audiooutputchanged"),
    videoInputChangedEvt = new Event("videoinputchanged"),
    selfs = new Map();

class OptionsForm extends FormDialog {
    constructor() {
        super("options", "Options");

        const _ = (evt) => () => this.dispatchEvent(evt);

        const self = {
            inputBinding: new InputBinding()
        };

        selfs.set(this, self);

        const audioPropsChanged = onInput(_(audioPropsChangedEvt));

        const makeKeyboardBinder = (id, label) => {
            const key = LabeledInput(
                id,
                "text",
                label,
                keyWidthStyle,
                onKeyUp((evt) => {
                    if (evt.key !== "Tab"
                        && evt.key !== "Shift") {
                        key.value
                            = self.inputBinding[id]
                            = evt.key;
                        this.dispatchEvent(inputBindingChangedEvt$1);
                    }
                }));
            key.value = self.inputBinding[id];
            return key;
        };

        const makeGamepadBinder = (id, label) => {
            const gp = LabeledInput(
                id,
                "text",
                label,
                numberWidthStyle);
            GamepadManager.addEventListener("gamepadbuttonup", (evt) => {
                if (document.activeElement === gp) {
                    gp.value
                        = self.inputBinding[id]
                        = evt.button;
                    this.dispatchEvent(inputBindingChangedEvt$1);
                }
            });
            gp.value = self.inputBinding[id];
            return gp;
        };

        const panels = [
            OptionPanel("avatar", "Avatar",
                this.avatarURLInput = LabeledInput(
                    "avatarURL",
                    "text",
                    "Avatar URL: ",
                    placeHolder("https://example.com/me.png"),
                    onInput(_(avatarUrlChangedEvt))),
                " or ",
                this.avatarEmojiInput = Div(
                    Label(
                        htmlFor("selectAvatarEmoji"),
                        "Avatar Emoji: "),
                    this.avatarEmojiPreview = Span(bust.value),
                    Button(
                        id("selectAvatarEmoji"),
                        "Select",
                        onClick(_(selectAvatarEvt))))),

            OptionPanel("interface", "Interface",
                this.fontSizeInput = LabeledInput(
                    "fontSize",
                    "number",
                    "Font size: ",
                    value(10),
                    min(5),
                    max(32),
                    style({ width: "3em" }),
                    onInput(_(fontSizeChangedEvt)))),

            OptionPanel("keyboard", "Keyboard",
                this.keyButtonUp = makeKeyboardBinder("keyButtonUp", "Up: "),
                this.keyButtonDown = makeKeyboardBinder("keyButtonDown", "Down: "),
                this.keyButtonLeft = makeKeyboardBinder("keyButtonLeft", "Left: "),
                this.keyButtonRight = makeKeyboardBinder("keyButtonRight", "Right: "),
                this.keyButtonEmote = makeKeyboardBinder("keyButtonEmote", "Emote: "),
                this.keyButtonToggleAudio = makeKeyboardBinder("keyButtonToggleAudio", "Toggle audio: ")),

            OptionPanel("gamepad", "Gamepad",
                this.gpSelect = LabeledSelectBox(
                    "gamepads",
                    "Use gamepad: ",
                    "No gamepad",
                    gp => gp.id,
                    gp => gp.id,
                    onInput(_(gamepadChangedEvt))),
                this.gpButtonUp = makeGamepadBinder("gpButtonUp", "Up: "),
                this.gpButtonDown = makeGamepadBinder("gpButtonDown", "Down: "),
                this.gpButtonLeft = makeGamepadBinder("gpButtonLeft", "Left: "),
                this.gpButtonRight = makeGamepadBinder("gpButtonRight", "Right: "),
                this.gpButtonEmote = makeGamepadBinder("gpButtonEmote", "Emote: "),
                this.gpButtonToggleAudio = makeGamepadBinder("gpButtonToggleAudio", "Toggle audio: ")),

            OptionPanel("audio", "Audio",
                P(
                    this.audioInputSelect = LabeledSelectBox(
                        "audioInputDevices",
                        "Input: ",
                        "No audio input",
                        d => d.id,
                        d => d.label,
                        onInput(_(audioInputChangedEvt)))),
                P(
                    this.audioOutputSelect = LabeledSelectBox(
                        "audioOutputDevices",
                        "Output: ",
                        "No audio output",
                        d => d.id,
                        d => d.label,
                        onInput(_(audioOutputChangedEvt)))),
                P(
                    this.drawHearingCheck = LabeledInput(
                        "drawHearing",
                        "checkbox",
                        "Draw hearing range: ",
                        onInput(_(toggleDrawHearingEvt))),
                    this.minAudioInput = LabeledInput(
                        "minAudio",
                        "number",
                        "Min: ",
                        value(1),
                        min(0),
                        max(100),
                        numberWidthStyle,
                        audioPropsChanged),
                    this.maxAudioInput = LabeledInput(
                        "maxAudio",
                        "number",
                        "Min: ",
                        value(10),
                        min(0),
                        max(100),
                        numberWidthStyle,
                        audioPropsChanged),
                    this.rolloffInput = LabeledInput(
                        "rollof",
                        "number",
                        "Rollof: ",
                        value(1),
                        min(0.1),
                        max(10),
                        step(0.1),
                        numberWidthStyle,
                        audioPropsChanged))),

            OptionPanel("video", "Video",
                P(
                    this.enableVideo = Button(
                        accessKey("v"),
                        "Enable video",
                        onClick(_(toggleVideoEvt$1)))),
                P(
                    this.videoInputSelect = LabeledSelectBox(
                        "videoInputDevices",
                        "Device: ",
                        "No video input",
                        d => d.id,
                        d => d.label,
                        onInput(_(videoInputChangedEvt)))))
        ];

        const cols = [];
        for (let i = 0; i < panels.length; ++i) {
            cols[i] = "1fr";
            panels[i].element.style.gridColumnStart = i + 1;
        }

        Object.assign(this.header.style, {
            display: "grid",
            gridTemplateColumns: cols.join(" ")
        });

        this.header.append(...panels.map(p => p.button));
        this.content.append(...panels.map(p => p.element));
        this.footer.append(
            this.confirmButton = Button(
                className("confirm"),
                systemFont,
                "Close",
                onClick(() => this.hide())));

        const showPanel = (p) =>
            () => {
                for (let i = 0; i < panels.length; ++i) {
                    panels[i].visible = i === p;
                }
            };

        for (let i = 0; i < panels.length; ++i) {
            panels[i].visible = i === 0;
            panels[i].addEventListener("select", showPanel(i));
        }

        self.inputBinding.addEventListener("inputbindingchanged", () => {
            for (let id of Object.getOwnPropertyNames(self.inputBinding)) {
                if (value[id] !== undefined
                    && this[id] != undefined) {
                    this[id].value = value[id];
                }
            }
        });

        this.gamepads = [];
        this.audioInputDevices = [];
        this.audioOutputDevices = [];
        this.videoInputDevices = [];

        this._videoEnabled = false;
        this._drawHearing = false;

        Object.seal(this);
    }

    setAvatarEmoji(e) {
        clear(this.avatarEmojiPreview);
        this.avatarEmojiPreview.append(Span(
            title(e.desc),
            e.value));
    }

    get avatarURL() {
        return this.avatarURLInput.value;
    }

    set avatarURL(value) {
        this.avatarURLInput.value = value;
    }

    async showAsync() {
        this.show();
        await this.confirmButton.once("click");
        this.hide();
        return false;
    }

    get inputBinding() {
        const self = selfs.get(this);
        return self.inputBinding;
    }

    set inputBinding(value) {
        const self = selfs.get(this);
        for (let id of Object.getOwnPropertyNames(value)) {
            if (self.inputBinding[id] !== undefined
                && value[id] !== undefined
                && this[id] != undefined) {
                self.inputBinding[id]
                    = this[id].value
                    = value[id];
            }
        }
    }

    get gamepads() {
        return this.gpSelect.values;
    }

    set gamepads(values) {
        this.gpSelect.values = values;
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


    get videoEnabled() {
        return this._videoEnabled;
    }

    set videoEnabled(value) {
        this._videoEnabled = value;
        this.enableVideo.innerHTML = value
            ? "Disable video"
            : "Enable video";
    }

    get gamepads() {
        return this.gpSelect.getValues();
    }

    set gamepads(values) {
        const disable = values.length === 0;
        this.gpSelect.values = values;
        this.gpButtonUp.setLocked(disable);
        this.gpButtonDown.setLocked(disable);
        this.gpButtonLeft.setLocked(disable);
        this.gpButtonRight.setLocked(disable);
        this.gpButtonEmote.setLocked(disable);
        this.gpButtonToggleAudio.setLocked(disable);
    }

    get currentGamepadIndex() {
        return this.gpSelect.selectedIndex;
    }

    set currentGamepadIndex(value) {
        this.gpSelect.selectedIndex = value;
    }

    get drawHearing() {
        return this._drawHearing;
    }

    set drawHearing(value) {
        this._drawHearing = value;
        this.drawHearingCheck.checked = value;
    }

    get minAudioDistance() {
        const value = parseFloat(this.minAudioInput.value);
        if (isGoodNumber(value)) {
            return value;
        }
        else {
            return 1;
        }
    }

    set minAudioDistance(value) {
        if (isGoodNumber(value)
            && value > 0) {
            this.minAudioDistance.value = value;
            if (this.minAudioDistance > this.maxAudioDistance) {
                this.maxAudioDistance = this.minAudioDistance;
            }
        }
    }


    get maxAudioDistance() {
        const value = parseFloat(this.maxAudioInput.value);
        if (isGoodNumber(value)) {
            return value;
        }
        else {
            return 10;
        }
    }

    set maxAudioDistance(value) {
        if (isGoodNumber(value)
            && value > 0) {
            this.maxAudioDistance.value = value;
            if (this.minAudioDistance > this.maxAudioDistance) {
                this.minAudioDistance = this.maxAudioDistance;
            }
        }
    }


    get audioRolloff() {
        const value = parseFloat(this.rolloffInput.value);
        if (isGoodNumber(value)) {
            return value;
        }
        else {
            return 1;
        }
    }

    set audioRolloff(value) {
        if (isGoodNumber(value)
            && value > 0) {
            this.audioRolloff.value = value;
        }
    }


    get fontSize() {
        const value = parseFloat(this.fontSizeInput.value);
        if (isGoodNumber(value)) {
            return value;
        }
        else {
            return 16;
        }
    }

    set fontSize(value) {
        if (isGoodNumber(value)
            && value > 0) {
            this.fontSizeInput.value = value;
        }
    }
}

const headerStyle = style({
    textDecoration: "none",
    color: "black",
    textTransform: "capitalize"
}),
    buttonStyle = style({
        fontSize: "200%",
        width: "2em",
        fontFamily: systemFamily
    }),
    cancelEvt = new Event("emojiCanceled");

class EmojiForm extends FormDialog {
    constructor() {
        super("emoji", "Emoji");

        this.header.append(
            H2("Recent"),
            this.recent = P("(None)"));

        const previousEmoji = [],
            allAlts = [];

        let selectedEmoji = null,
            idCounter = 0;

        const closeAll = () => {
            for (let alt of allAlts) {
                alt.hide();
            }
        };

        function combine(a, b) {
            let left = a.value;

            let idx = left.indexOf(emojiStyle.value);
            if (idx === -1) {
                idx = left.indexOf(textStyle.value);
            }
            if (idx >= 0) {
                left = left.substring(0, idx);
            }

            return {
                value: left + b.value,
                desc: a.desc + "/" + b.desc
            };
        }

        const addIconsToContainer = (group, container, isAlts) => {
            for (let icon of group) {
                const g = isAlts ? UL() : Span(),
                    btn = Button(
                        title(icon.desc),
                        buttonStyle,
                        onClick((evt) => {
                            selectedEmoji = selectedEmoji && evt.ctrlKey
                                ? combine(selectedEmoji, icon)
                                : icon;
                            this.preview.innerHTML = `${selectedEmoji.value} - ${selectedEmoji.desc}`;
                            this.confirmButton.unlock();

                            if (!!alts) {
                                alts.toggleOpen();
                                btn.innerHTML = icon.value + (alts.isOpen() ? "-" : "+");
                            }
                        }), icon.value);

                let alts = null;

                if (isAlts) {
                    btn.id = `emoji-with-alt-${idCounter++}`;
                    g.appendChild(LI(btn,
                        Label(htmlFor(btn.id),
                            icon.desc)));
                }
                else {
                    g.appendChild(btn);
                }

                if (!!icon.alt) {
                    alts = Div();
                    allAlts.push(alts);
                    addIconsToContainer(icon.alt, alts, true);
                    alts.hide();
                    g.appendChild(alts);
                    btn.style.width = "3em";
                    btn.innerHTML += "+";
                }

                if (!!icon.width) {
                    btn.style.width = icon.width;
                }

                if (!!icon.color) {
                    btn.style.color = icon.color;
                }

                container.appendChild(g);
            }
        };

        for (let key of Object.keys(allIcons)) {
            if (key !== "combiners") {
                const header = H1(),
                    container = P(),
                    headerButton = A(
                        href("javascript:undefined"),
                        title(key),
                        headerStyle,
                        onClick(() => {
                            container.toggleOpen();
                            headerButton.innerHTML = key + (container.isOpen() ? " -" : " +");
                        }),
                        key + " -"),
                    group = allIcons[key];

                addIconsToContainer(group, container);
                header.appendChild(headerButton);
                this.content.appendChild(header);
                this.content.appendChild(container);
            }
        }

        this.footer.append(

            this.confirmButton = Button(className("confirm"),
                systemFont,
                "OK",
                onClick(() => {
                    const idx = previousEmoji.indexOf(selectedEmoji);
                    if (idx === -1) {
                        previousEmoji.push(selectedEmoji);
                        this.recent.innerHTML = "";
                        addIconsToContainer(previousEmoji, this.recent);
                    }

                    this.hide();
                    this.dispatchEvent(new EmojiSelectedEvent(selectedEmoji));
                })),

            Button(className("cancel"),
                systemFont,
                "Cancel",
                onClick(() => {
                    this.confirmButton.lock();
                    this.hide();
                    this.dispatchEvent(cancelEvt);
                })),

            this.preview = Span(style({ gridArea: "4/1/5/4" })));

        this.confirmButton.lock();

        this.isOpen = this.element.isOpen.bind(this.element);

        this.selectAsync = () => {
            return new Promise((resolve, reject) => {
                let yes = null,
                    no = null;

                const done = () => {
                    this.removeEventListener("emojiSelected", yes);
                    this.removeEventListener("emojiCanceled", no);
                };

                yes = (evt) => {
                    done();
                    try {
                        resolve(evt.emoji);
                    }
                    catch (exp) {
                        reject(exp);
                    }
                };

                no = () => {
                    done();
                    resolve(null);
                };

                this.addEventListener("emojiSelected", yes);
                this.addEventListener("emojiCanceled", no);

                closeAll();
                this.show();
            });
        };
    }
}

class EmojiSelectedEvent extends Event {
    constructor(emoji) {
        super("emojiSelected");
        this.emoji = emoji;
    }
}

const loginEvt = new Event("login"),
    defaultRooms = new Map([
        ["calla", "Calla"],
        ["island", "Island"],
        ["alxcc", "Alexandria Code & Coffee"],
        ["vurv", "Vurv"]]),
    _state = new Map();

class LoginForm extends FormDialog {
    constructor() {
        super("login");

        const self = Object.seal({
            ready: false,
            connecting: false,
            connected: false,
            validate: () => {
                const canConnect = (this.roomSelectMode
                    ? this.roomSelect.selectedIndex >= 0
                    : this.roomInput.value.length > 0)
                    && this.userName.length > 0;

                this.connectButton.setLocked(!this.ready
                    || this.connecting
                    || this.connected
                    || !canConnect);
                this.connectButton.innerHTML =
                    this.connected
                        ? "Connected"
                        : this.connecting
                            ? "Connecting..."
                            : this.ready
                                ? "Connect"
                                : "Loading...";
            }
        });

        _state.set(this, self);

        this.roomLabel = this.element.querySelector("label[for='roomSelector']");
        this.roomSelect = SelectBox(
            "No rooms available",
            v => v,
            k => defaultRooms.get(k),
            this.element.querySelector("#roomSelector"));
        this.roomInput = this.element.querySelector("#roomName");
        this.createRoomButton = this.element.querySelector("#createNewRoom");
        this.userNameInput = this.element.querySelector("#userName");
        this.connectButton = this.element.querySelector("#connect");

        this.roomInput.addEventListener("input", self.validate);
        this.userNameInput.addEventListener("input", self.validate);
        this.createRoomButton.addEventListener("click", () => {
            this.roomSelectMode = !this.roomSelectMode;
        });
        this.connectButton.addEventListener("click", () => {
            this.connecting = true;
            this.dispatchEvent(loginEvt);
        });

        this.roomSelect.emptySelectionEnabled = false;
        this.roomSelect.values = defaultRooms.keys();
        this.roomSelectMode = true;
        this.roomSelect.selectedIndex = 0;

        self.validate();
    }

    get roomSelectMode() {
        return this.roomSelect.style.display !== "none";
    }

    set roomSelectMode(value) {
        const self = _state.get(this);
        this.roomSelect.setOpen(value);
        this.roomInput.setOpen(!value);
        this.createRoomButton.innerHTML = value
            ? "New"
            : "Cancel";

        if (value) {
            this.roomLabel.htmlFor = this.roomSelect.id;
            this.roomSelect.selectedValue = this.roomInput.value.toLocaleLowerCase();
        }
        else if (this.roomSelect.selectedIndex >= 0) {
            this.roomLabel.htmlFor = this.roomInput.id;
            this.roomInput.value = this.roomSelect.selectedValue;
        }

        self.validate();
    }

    get selectedRoom() {
        const room = this.roomSelectMode
            ? this.roomSelect.selectedValue
            : this.roomInput.value;

        return room.toLocaleLowerCase();
    }

    get userName() {
        return this.userNameInput.value;
    }

    get connectButtonText() {
        return this.connectButton.innerText
            || this.connectButton.textContent;
    }

    set connectButtonText(str) {
        this.connectButton.innerHTML = str;
    }

    get ready() {
        const self = _state.get(this);
        return self.ready;
    }

    set ready(v) {
        const self = _state.get(this);
        self.ready = v;
        self.validate();
    }

    get connecting() {
        const self = _state.get(this);
        return self.connecting;
    }

    set connecting(v) {
        const self = _state.get(this);
        self.connecting = v;
        self.validate();
    }

    get connected() {
        const self = _state.get(this);
        return self.connected;
    }

    set connected(v) {
        const self = _state.get(this);
        self.connected = v;
        this.connecting = false;
    }

    show() {
        this.ready = true;
        super.show();
    }
}

function instructions() {
    return [
        Aside(
            style({
                border: "dashed 2px darkred",
                backgroundColor: "wheat",
                borderRadius: "5px",
                padding: "0.5em"
            }),
            Strong("Note: "),
            "Calla is built on top of ",
            A(
                href("https://jitsi.org"),
                target("_blank"),
                rel("noopener"),
                "Jitsi Meet"),
            ". Jitsi does not support iPhones and iPads."),
        UL(
            LI(
                Strong("Be careful in picking your room name"),
                ", if you don't want randos to join. Traffic is low right now, but you never know."),
            LI(
                "Try to ",
                Strong("pick a unique user name"),
                ". A lot of people use \"Test\" and then there are a bunch of people with the same name running around."),
            LI(
                Strong("Open the Options view"),
                " to set your avatar, or to change your microphone settings."),
            LI(
                Strong("Click on the map"),
                " to move your avatar to wherever you want. Movement is instantaneous, with a smooth animation over the transition. Your avatar will stop at walls."),
            LI(
                "Or, ",
                Strong("use the arrow keys"),
                " on your keyboard to move."),
            LI(
                Strong("Click on yourself"),
                " to open a list of Emoji. Select an Emoji to float it out into the map."),
            LI(
                Strong("Hit the E key"),
                " to re-emote with your last selected Emoji."),
            LI(
                "You can ",
                Strong("roll your mouse wheel"),
                " or ",
                Strong("pinch your touchscreen"),
                " to zoom in and out of the map view. This is useful for groups of people standing close to each other to see the detail in their Avatar."),
            LI(
                "You can ",
                Strong(" click the Pause button(⏸️)"),
                " in the upper-right corner to show the default Jitsi Meet interface, in case you need to change any settings there (the game view blocks clicks on the Jitsi Meet interface)."))];
}

class InstructionsForm extends FormDialog {

    constructor() {
        super("instructions", "Instructions");

        this.content.append(...instructions());

        this.footer.append(
            Button(
                systemFont,
                style({ gridArea: "4/2" }),
                "Close",
                onClick(() => this.hide())));
    }
}

// TODO

function init(host, JitsiClientClass) {
    const game = new Game(),
        login = new LoginForm(),
        client = new JitsiClientClass(),
        toolbar = new ToolBar(),
        options = new OptionsForm(),
        emoji = new EmojiForm(),
        instructions = new InstructionsForm(),
        forExport = {
            client,
            game,
            toolbar,
            options,
            emoji,
            login,
            instructions
        };

    for (let e of Object.values(forExport)) {
        document.body.append(e.element);
    }

    game.drawHearing = options.drawHearing;
    game.audioDistanceMin = options.minAudioDistance;
    game.audioDistanceMax = options.maxAudioDistance;
    game.fontSize = options.fontSize;
    game.targetCameraZ = toolbar.zoom;

    refreshGamepads();
    showLogin();

    function showLogin() {
        client.hide();
        game.hide();
        toolbar.hide();
        options.hide();
        emoji.hide();
        instructions.hide();
        login.show();
    }

    async function withEmojiSelection(callback) {
        if (!emoji.isOpen()) {
            toolbar.optionsButton.lock();
            toolbar.instructionsButton.lock();
            options.hide();
            instructions.hide();
            const e = await emoji.selectAsync();
            if (!!e) {
                callback(e);
            }
            toolbar.optionsButton.unlock();
            toolbar.instructionsButton.unlock();
        }
    }

    async function selectEmojiAsync() {
        await withEmojiSelection((e) => {
            game.emote(game.me.id, e);
            toolbar.setEmojiButton(game.keyEmote, e);
        });
    }

    function setAudioProperties() {
        client.setAudioProperties(
            window.location.origin,
            0.125,
            options.minAudioDistance,
            options.maxAudioDistance,
            options.audioRolloff);
        game.audioDistanceMin = options.minAudioDistance;
        game.audioDistanceMax = options.maxAudioDistance;
    }

    function refreshGamepads() {
        options.gamepads = [...navigator.getGamepads()]
            .filter(g => g !== null);
    }


    window.addEventListener("resize", () => {
        game.resize(toolbar.offsetHeight);
        client.resize(toolbar.offsetHeight);
    });

    window.addEventListener("gamepadconnected", refreshGamepads);
    window.addEventListener("gamepaddisconnected", refreshGamepads);

    toolbar.addEventListener("selectemoji", selectEmojiAsync);

    toolbar.addEventListener("toggleaudio", () => {
        client.toggleAudio();
    });

    toolbar.addEventListener("leave", () => {
        game.end();
    });

    toolbar.addEventListener("emote", () => {
        game.emote(game.me.id, game.currentEmoji);
    });

    toolbar.addEventListener("zoomchanged", () => {
        game.targetCameraZ = toolbar.zoom;
    });

    toolbar.addEventListener("tweet", () => {
        const message = encodeURIComponent(`Join my #TeleParty ${document.location.href}`),
            url = new URL("https://twitter.com/intent/tweet?text=" + message);
        open(url);
    });

    toolbar.addEventListener("toggleui", () => {
        game.setOpen(toolbar.visible);
        game.resize(toolbar.offsetHeight);
        client.resize(toolbar.offsetHeight);
    });

    toolbar.addEventListener("toggleoptions", () => {
        if (!emoji.isOpen()) {
            instructions.hide();
            options.toggleOpen();
        }
    });

    toolbar.addEventListener("toggleinstructions", () => {
        if (!emoji.isOpen()) {
            options.hide();
            instructions.toggleOpen();
        }
    });


    login.addEventListener("login", () => {
        client.joinAsync(host, login.selectedRoom, login.userName);
    });


    options.addEventListener("selectavatar", async () => {
        withEmojiSelection((e) => {
            game.me.avatarEmoji = e;
            options.setAvatarEmoji(e);
        });
    });

    options.addEventListener("avatarurlchanged", () => {
        client.setAvatarURL(options.avatarURL);
    });

    options.addEventListener("audiopropschanged", setAudioProperties);

    options.addEventListener("togglevideo", () => {
        client.toggleVideo();
    });

    options.addEventListener("toggledrawhearing", () => {
        game.drawHearing = options.drawHearing = !options.drawHearing;
    });

    options.addEventListener("fontsizechanged", () => {
        game.fontSize = options.fontSize;
    });

    options.addEventListener("audioinputchanged", () => {
        client.setAudioInputDevice(options.currentAudioInputDevice);
    });

    options.addEventListener("audiooutputchanged", () => {
        client.setAudioOutputDevice(options.currentAudioOutputDevice);
    });

    options.addEventListener("videoinputchanged", () => {
        client.setVideoInputDevice(options.currentVideoInputDevice);
    });

    options.addEventListener("gamepadchanged", () => {
        game.gamepadIndex = options.currentGamepadIndex;
    });


    game.addEventListener("emote", (evt) => {
        client.emote(evt.emoji);
    });

    game.addEventListener("userjoined", (evt) => {
        evt.user.addEventListener("userPositionNeeded", (evt2) => {
            client.userInitRequest(evt2.id);
        });
    });

    game.addEventListener("toggleaudio", async (evt) => {
        client.toggleAudio();
    });

    game.addEventListener("togglevideo", async (evt) => {
        client.toggleVideo();
    });

    game.addEventListener("gamestarted", () => {
        game.me.addEventListener("userMoved", (evt) => {
            client.setPosition(evt);
        });
        setAudioProperties();
        login.hide();
        toolbar.show();
        client.show();
        client.setPosition(game.me);
        options.setAvatarEmoji(game.me.avatarEmoji);
    });

    game.addEventListener("gameended", () => {
        game.hide();
        client.hide();
        login.connected = false;
        showLogin();
    });

    game.addEventListener("emojineeded", selectEmojiAsync);

    game.addEventListener("zoomchanged", () => {
        toolbar.zoom = game.targetCameraZ;
    });

    client.addEventListener("videoConferenceJoined", async (evt) => {
        login.connected = true;

        game.start(evt);
        for (let user of client.otherUsers.entries()) {
            game.addUser({
                id: user[0],
                displayName: user[1]
            });
        }

        options.audioInputDevices = await client.getAudioInputDevices();
        options.audioOutputDevices = await client.getAudioOutputDevices();
        options.videoInputDevices = await client.getVideoInputDevices();

        options.currentAudioInputDevice = await client.getCurrentAudioInputDevice();
        options.currentAudioOutputDevice = await client.getCurrentAudioOutputDevice();
        options.currentVideoInputDevice = await client.getCurrentVideoInputDevice();

        const audioMuted = await client.isAudioMutedAsync();
        game.muteUserAudio({ id: client.localUser, muted: audioMuted });
        toolbar.audioEnabled = !audioMuted;

        const videoMuted = await client.isVideoMutedAsync();
        game.muteUserVideo({ id: client.localUser, muted: videoMuted });
        options.videoEnabled = !videoMuted;
    });

    client.addEventListener("videoConferenceLeft", (evt) => {
        if (evt.roomName.toLowerCase() === game.currentRoomName) {
            game.end();
        }
    });

    client.addEventListener("participantJoined", (evt) => {
        game.addUser(evt);
    });

    client.addEventListener("participantLeft", (evt) => {
        game.removeUser(evt);
        client.removeUser(evt);
    });

    client.addEventListener("avatarChanged", (evt) => {
        game.setAvatarURL(evt);
    });

    client.addEventListener("displayNameChange", (evt) => {
        game.changeUserName(evt);
    });

    client.addEventListener("audioMuteStatusChanged", (evt) => {
        game.muteUserAudio(evt);
        if (evt.id === client.localUser) {
            toolbar.audioEnabled = !evt.muted;
        }
    });

    client.addEventListener("videoMuteStatusChanged", (evt) => {
        game.muteUserVideo(evt);
        if (evt.id === client.localUser) {
            options.videoEnabled = !evt.muted;
        }
    });

    client.addEventListener("userInitRequest", (evt) => {
        client.userInitResponse(evt.id, game.me);
    });

    client.addEventListener("userInitResponse", (evt) => {
        const user = game.userLookup[evt.id];
        if (!!user) {
            user.init(evt);
            client.setPosition(evt);
        }
    });

    client.addEventListener("userMoved", (evt) => {
        const user = game.userLookup[evt.id];
        if (!!user) {
            user.moveTo(evt.x, evt.y);
            client.setPosition(evt);
        }
    });

    client.addEventListener("emote", (evt) => {
        game.emote(evt.id, evt);
    });

    client.addEventListener("audioActivity", (evt) => {
        game.updateAudioActivity(evt);
    });

    client.addEventListener("avatarChanged", (evt) => {
        console.log(evt);
        options.avatarURL = evt.avatarURL;
        game.me.setAvatarURL(evt.avatarURL);
    });

    login.ready = true;
    return forExport;
}

// Creates a mock interface for the Jitsi Meet client, to

(async function () {
    const response = await fetch("../../index.html"),
        html = await response.text(),
        parser = new DOMParser(),
        doc = parser.parseFromString(html, "text/html");
    document.head.append(...doc.head.childNodes);
    document.body.append(...doc.body.childNodes);

    const loginContent = document.querySelector("#login > .content");
    loginContent.parentElement.removeChild(loginContent);

    const components = init("jitsi.calla.chat", MockJitsiClient);
    const { game, login, client, toolbar } = components;
    Object.assign(window, components);

    let testUsers = null,
        spawnUserTimer = null;

    client.element.append(
        Img(
            src("../../screenshot.png"),
            style({
                width: "100%"
            })));

    game.addEventListener("gamestarted", () => {
        testUsers = makeUsers();
        client.testUsers = testUsers.slice();
        spawnUserTimer = setTimeout(spawnUsers, 0);
    });

    toolbar.addEventListener("leave", () => {
        clearTimeout(spawnUserTimer);
        for (let testUser of client.testUsers) {
            testUser.stop();
        }
    });

    login.userNameInput.value = "Sean";
    login.userNameInput.dispatchEvent(new Event("input"));
    login.connectButton.click();

    function spawnUsers() {
        if (testUsers.length > 0) {
            testUsers.shift().start();
            spawnUserTimer = setTimeout(spawnUsers, 1000);
        }
    }

    function makeUsers() {
        return [
            new MockUser("user1", -5, -5, client),
            new MockUser("user2", -5, 5, client),
            new MockUser("user3", 5, -5, client),
            new MockUser("user4", 5, 5, client),
            new MockUser("user5", 0, 0, client)
        ]
    }
})();
