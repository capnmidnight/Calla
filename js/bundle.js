const versionString = "Calla v0.1.13";

function t(o, s, c) {
    return typeof o === s
        || o instanceof c;
}

function isFunction(obj) {
    return t(obj, "function", Function);
}

function isString(obj) {
    return t(obj, "string", String);
}

function isNumber(obj) {
    return t(obj, "number", Number);
}
function isBoolean(obj) {
    return t(obj, "boolean", Boolean);
}

/**
 * Check a value to see if it is of a number type
 * and is not the special NaN value.
 * 
 * @param {any} v
 */
function isGoodNumber(v) {
    return isNumber(v)
        && !Number.isNaN(v);
}

/**
 * Force a value onto a range
 * 
 * @param {number} v
 * @param {number} min
 * @param {number} max
 */
function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

/**
 * Translate a value into a range.
 * 
 * @param {number} v
 * @param {number} min
 * @param {number} max
 */
function project(v, min, max) {
    return (v - min) / (max - min);
}

/**
 * Translate a value out of a range.
 * 
 * @param {number} v
 * @param {number} min
 * @param {number} max
 */
function unproject(v, min, max) {
    return v * (max - min) + min;
}

/**
 * Pick a value that is proportionally between two values.
 * 
 * @param {number} a
 * @param {number} b
 * @param {number} p
 * @returns {number}
 */
function lerp(a, b, p) {
    return (1 - p) * a + p * b;
}

function add(a, b) {
    return evt => {
        a(evt);
        b(evt);
    };
}


EventTarget.prototype.once = function (resolveEvt, rejectEvt, timeout) {

    if (timeout === undefined
        && isGoodNumber(rejectEvt)) {
        timeout = rejectEvt;
        rejectEvt = undefined;
    }

    return new Promise((resolve, reject) => {
        const hasResolveEvt = isString(resolveEvt);
        if (hasResolveEvt) {
            const oldResolve = resolve;
            const remove = () => {
                this.removeEventListener(resolveEvt, oldResolve);
            };
            resolve = add(remove, resolve);
            reject = add(remove, reject);
        }

        const hasRejectEvt = isString(rejectEvt);
        if (hasRejectEvt) {
            const oldReject = reject;
            const remove = () => {
                this.removeEventListener(rejectEvt, oldReject);
            };

            resolve = add(remove, resolve);
            reject = add(remove, reject);
        }

        if (isNumber(timeout)) {
            const timer = setTimeout(reject, timeout, `'${resolveEvt}' has timed out.`),
                cancel = () => clearTimeout(timer);
            resolve = add(cancel, resolve);
            reject = add(cancel, reject);
        }

        if (hasResolveEvt) {
            this.addEventListener(resolveEvt, resolve);
        }

        if (hasRejectEvt) {
            this.addEventListener(rejectEvt, () => {
                reject("Rejection event found");
            });
        }
    });
};

EventTarget.prototype.when = function (resolveEvt, filterTest, timeout) {

    if (!isString(resolveEvt)) {
        throw new Error("Filtering tests function is required. Otherwise, use `once`.");
    }

    if (!isFunction(filterTest)) {
        throw new Error("Filtering tests function is required. Otherwise, use `once`.");
    }

    return new Promise((resolve, reject) => {
        const remove = () => {
            this.removeEventListener(resolveEvt, resolve);
        };

        resolve = add(remove, resolve);
        reject = add(remove, reject);

        if (isNumber(timeout)) {
            const timer = setTimeout(reject, timeout, `'${resolveEvt}' has timed out.`),
                cancel = () => clearTimeout(timer);
            resolve = add(cancel, resolve);
            reject = add(cancel, reject);
        }

        this.addEventListener(resolveEvt, resolve);
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

        if (repeatTimeout !== undefined) {
            if (cancelTimeout !== undefined) {
                canceller = setTimeout(() => {
                    cleanup();
                    reject(`'${untilEvt}' has timed out.`);
                }, cancelTimeout);
            }

            function repeater() {
                callback();
                timer = setTimeout(repeater, repeatTimeout);
            }

            timer = setTimeout(repeater, 0);
        }
    });
};

EventTarget.prototype.addEventListeners = function (obj) {
    for (let evtName in obj) {
        let callback = obj[evtName];
        let opts = undefined;
        if (callback instanceof Array) {
            opts = callback[1];
            callback = callback[0];
        }

        this.addEventListener(evtName, callback, opts);
    }
};

HTMLElement.prototype.isOpen = function() {
    return this.style.display !== "none";
};

/**
 * Sets the element's style's display property to "none"
 * when `v` is false, or `displayType` when `v` is true.
 * @memberof Element
 * @param {boolean} v
 * @param {string} [displayType=""]
 */
HTMLElement.prototype.setOpen = function (v, displayType = "") {
    this.style.display = v
        ? displayType
        : "none";
};

HTMLElement.prototype.setOpenWithLabel = function (v, label, enabledText, disabledText, bothText, displayType = "") {
    this.setOpen(v, displayType);
    label.updateLabel(this.isOpen(), enabledText, disabledText, bothText);
};

HTMLElement.prototype.updateLabel = function (isOpen, enabledText, disabledText, bothText) {
    bothText = bothText || "";
    if (this.accessKey) {
        bothText += ` <kbd>(ALT+${this.accessKey.toUpperCase()})</kbd>`;
    }
    this.innerHTML = (isOpen ? enabledText : disabledText) + bothText;
};

HTMLElement.prototype.toggleOpen = function (displayType = "") {
    this.setOpen(!this.isOpen(), displayType);
};

HTMLElement.prototype.toggleOpenWithLabel = function (label, enabledText, disabledText, bothText, displayType = "") {
    this.setOpenWithLabel(!this.isOpen(), label, enabledText, disabledText, bothText, displayType);
};

HTMLElement.prototype.show = function (displayType = "") {
    this.setOpen(true, displayType);
};

HTMLElement.prototype.hide = function () {
    this.setOpen(false);
};

HTMLElement.prototype.setLocked = function (value) {
    if (value) {
        this.lock();
    }
    else {
        this.unlock();
    }
};

HTMLElement.prototype.lock = function () {
    this.disabled = "disabled";
};

HTMLElement.prototype.unlock = function () {
    this.disabled = "";
};

HTMLElement.prototype.blinkBorder = function (times, color) {
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

/**
 * Parse a request's response text as XML
 * @returns {Promise<Document>}
 * @memberof Response
 **/
Response.prototype.xml = async function () {
    const text = await this.text(),
        parser = new DOMParser(),
        xml = parser.parseFromString(text, "text/xml");

    return xml.documentElement;
};
/**
 * Parse a request's response text as HTML
 * @returns {Promise<Document>}
 * @memberof Response
 **/
Response.prototype.html = async function () {
    const text = await this.text(),
        parser = new DOMParser(),
        xml = parser.parseFromString(text, "text/html");

    return xml.documentElement;
};

Storage.prototype.getInt = function (name, defaultValue) {
    const s = this.getItem(name);
    if (s === null) {
        return defaultValue;
    }

    const n = parseInt(s, 10);
    if (!Number.isInteger(n)) {
        return defaultValue;
    }

    return n;
};

String.prototype.firstLetterToUpper = function () {
    return this[0].toLocaleUpperCase()
        + this.substring(1);
};

/**
 * Returns a random item from an array of items.
 * 
 * Provides an option to consider an additional item as part of the collection
 * for random selection.
 * @param {any[]} arr
 * @param {any} defaultValue
 */
function arrayRandom(arr, defaultValue) {
    if (!(arr instanceof Array)) {
        throw new Error("Must provide an array as the first parameter.");
    }

    const offset = !!defaultValue ? 1 : 0,
        idx = Math.floor(Math.random() * (arr.length + offset)) - offset;
    if (idx < 0) {
        return defaultValue;
    }
    else {
        return arr[idx];
    }
}

/**
 * Empties out an array
 * @param {any[]} arr - the array to empty.
 * @returns {any[]} - the items that were in the array.
 */
function arrayClear(arr) {
    if (!(arr instanceof Array)) {
        throw new Error("Must provide an array as the first parameter.");
    }

    return arr.splice(0);
}

/**
 * Removes an item at the given index from an array.
 * @param {any[]} arr
 * @param {number} idx
 * @returns {any} - the item that was removed.
 */
function arrayRemoveAt(arr, idx) {
    if (!(arr instanceof Array)) {
        throw new Error("Must provide an array as the first parameter.");
    }

    return arr.splice(idx, 1);
}

/**
 * A test for filtering an array
 * @callback scanArrayCallback
 * @param {any} obj - an array item to check.
 * @param {number} idx - the index of the item that is being checked.
 * @param {any[]} arr - the full array that is being filtered.
 * @returns {boolean} whether or not the item matches the test.
 */

/**
 * Scans through a series of filters to find an item that matches
 * any of the filters. The first item of the first filter that matches
 * will be returned.
 * @param {any[]} arr - the array to scan
 * @param {...scanArrayCallback} tests - the filtering tests.
 * @returns {any}
 */
function arrayScan(arr, ...tests) {
    if (!(arr instanceof Array)) {
        throw new Error("Must provide an array as the first parameter.");
    }

    for (let test of tests) {
        const filtered = arr.filter(test);
        if (filtered.length > 0) {
            return filtered[0];
        }
    }

    return null;
}

/**
 * Unicode-standardized pictograms.
 **/
class Emoji {
    /**
     * Creates a new Unicode-standardized pictograms.
     * @param {string} value - a Unicode sequence.
     * @param {string} desc - an English text description of the pictogram.
     */
    constructor(value, desc) {
        this.value = value;
        this.desc = desc;
    }

    /**
     * Determines of the provided Emoji or EmojiGroup is a subset of
     * this emoji.
     * @param {(Emoji|EmojiGroup)} e
     */
    contains(e) {
        return this.value.indexOf(e.value) >= 0;
    }
}

class EmojiGroup extends Emoji {
    /**
     * Groupings of Unicode-standardized pictograms.
     * @param {string} value - a Unicode sequence.
     * @param {string} desc - an English text description of the pictogram.
     * @param {Emoji[]} rest - Emojis in this group.
     */
    constructor(value, desc, ...rest) {
        super(value, desc);
        /** @type {Emoji[]} */
        this.alts = rest;
        /** @type {string} */
        this.width = null;
    }

    /**
     * Selects a random emoji out of the collection.
     * @returns {(Emoji|EmojiGroup)}
     **/
    random() {
        const selection = arrayRandom(this.alts);
        if (selection instanceof EmojiGroup) {
            return selection.random();
        }
        else {
            return selection;
        }
    }

    /**
     * 
     * @param {(Emoji|EmojiGroup)} e
     */
    contains(e) {
        return super.contains(e)
            || this.alts.reduce((a, b) => a || b.contains(e), false);
    }
}

/**
 * Shorthand for `new Emoji`, which saves significantly on bundle size.
 * @param {string} v - a Unicode sequence.
 * @param {string} d - an English text description of the pictogram.
 * @param {any} [o=null] - an optional set of properties to set on the Emoji object.
 */
function e(v, d, o = null) {
    return Object.assign(new Emoji(v, d), o);
}

/**
 * Shorthand for `new EmojiGroup`, which saves significantly on bundle size.
 * @param {string} v - a Unicode sequence.
 * @param {string} d - an English text description of the pictogram.
 * @param {...(Emoji|EmojiGroup)} r - the emoji that are contained in this group.
 * @returns {EmojiGroup}
 */
function g(v, d, ...r) {
    return new EmojiGroup(v, d, ...r);
}

/**
 * A shorthand for `new EmojiGroup` that allows for setting optional properties
 * on the EmojiGroup object.
 * @param {string} v - a Unicode sequence.
 * @param {string} d - an English text description of the pictogram.
 * @param {any} o - a set of properties to set on the Emoji object.
 * @param {...(Emoji|EmojiGroup)} r - the emoji that are contained in this group.
 * @returns {EmojiGroup}
 */
function gg(v, d, o, ...r) {
    return Object.assign(
        g(
            v, d,
            ...Object.values(o).filter(v => v instanceof Emoji),
            ...r),
        o);
}

const textStyle = e("\u{FE0E}", "Variation Selector-15: text style");
const emojiStyle = e("\u{FE0F}", "Variation Selector-16: emoji style");
const zeroWidthJoiner = e("\u{200D}", "Zero Width Joiner");
const combiningEnclosingCircleBackslash = e("\u{20E3}", "Combining Enclosing Circle Backslash");
const combiningEnclosingKeycap = e("\u{20E3}", "Combining Enclosing Keycap");

const female = e("\u{2640}\u{FE0F}", "Female");
const male = e("\u{2642}\u{FE0F}", "Male");
const skinL = e("\u{1F3FB}", "Light Skin Tone");
const skinML = e("\u{1F3FC}", "Medium-Light Skin Tone");
const skinM = e("\u{1F3FD}", "Medium Skin Tone");
const skinMD = e("\u{1F3FE}", "Medium-Dark Skin Tone");
const skinD = e("\u{1F3FF}", "Dark Skin Tone");
const hairRed = e("\u{1F9B0}", "Red Hair");
const hairCurly = e("\u{1F9B1}", "Curly Hair");
const hairWhite = e("\u{1F9B3}", "White Hair");
const hairBald = e("\u{1F9B2}", "Bald");

function combo(a, b) {
    if (a instanceof Array) {
        return a.map(c => combo(c, b));
    }
    else if (a instanceof EmojiGroup) {
        const { value, desc } = combo(e(a.value, a.desc), b);
        return g(value, desc, ...combo(a.alts, b));
    }
    else if (b instanceof Array) {
        return b.map(c => combo(a, c));
    }
    else {
        return e(a.value + b.value, a.desc + ": " + b.desc);
    }
}

function join(a, b) {
    if (a instanceof Array) {
        return a.map(c => join(c, b));
    }
    else if (a instanceof EmojiGroup) {
        const { value, desc } = join(e(a.value, a.desc), b);
        return g(value, desc, ...join(a.alts, b));
    }
    else if (b instanceof Array) {
        return b.map(c => join(a, c));
    }
    else {
        return e(a.value + zeroWidthJoiner.value + b.value, a.desc + ": " + b.desc);
    }
}

/**
 * Check to see if a given Emoji walks on water.
 * @param {Emoji} e
 */
function isSurfer(e) {
    return surfers.contains(e)
        || rowers.contains(e)
        || swimmers.contains(e)
        || merpeople.contains(e);
}

function skin(v, d, ...rest) {
    const person = e(v, d),
        light = combo(person, skinL),
        mediumLight = combo(person, skinML),
        medium = combo(person, skinM),
        mediumDark = combo(person, skinMD),
        dark = combo(person, skinD);
    return gg(person.value, person.desc, {
        default: person,
        light,
        mediumLight,
        medium,
        mediumDark,
        dark
    }, ...rest);
}

function sex(person) {
    const man = join(person, male),
        woman = join(person, female);

    return gg(person.value, person.desc, {
        default: person,
        man,
        woman
    });
}

function skinAndSex(v, d) {
    return sex(skin(v, d));
}

function skinAndHair(v, d, ...rest) {
    const people = skin(v, d),
        red = join(people, hairRed),
        curly = join(people, hairCurly),
        white = join(people, hairWhite),
        bald = join(people, hairBald);
    return gg(people.value, people.desc, {
        default: people,
        red,
        curly,
        white,
        bald
    }, ...rest);
}

function sym(symbol, name) {
    const j = e(symbol.value, name),
        men = join(man.default, j),
        women = join(woman.default, j);
    return gg(symbol.value, symbol.desc, {
        symbol,
        men,
        women
    });
}

const frowners = skinAndSex("\u{1F64D}", "Frowning");
const pouters = skinAndSex("\u{1F64E}", "Pouting");
const gesturingNo = skinAndSex("\u{1F645}", "Gesturing NO");
const gesturingOK = skinAndSex("\u{1F646}", "Gesturing OK");
const tippingHand = skinAndSex("\u{1F481}", "Tipping Hand");
const raisingHand = skinAndSex("\u{1F64B}", "Raising Hand");
const bowing = skinAndSex("\u{1F647}", "Bowing");
const facePalming = skinAndSex("\u{1F926}", "Facepalming");
const shrugging = skinAndSex("\u{1F937}", "Shrugging");
const cantHear = skinAndSex("\u{1F9CF}", "Can't Hear");
const gettingMassage = skinAndSex("\u{1F486}", "Getting Massage");
const gettingHaircut = skinAndSex("\u{1F487}", "Getting Haircut");

const constructionWorkers = skinAndSex("\u{1F477}", "Construction Worker");
const guards = skinAndSex("\u{1F482}", "Guard");
const spies = skinAndSex("\u{1F575}", "Spy");
const police = skinAndSex("\u{1F46E}", "Police");
const wearingTurban = skinAndSex("\u{1F473}", "Wearing Turban");
const superheroes = skinAndSex("\u{1F9B8}", "Superhero");
const supervillains = skinAndSex("\u{1F9B9}", "Supervillain");
const mages = skinAndSex("\u{1F9D9}", "Mage");
const fairies = skinAndSex("\u{1F9DA}", "Fairy");
const vampires = skinAndSex("\u{1F9DB}", "Vampire");
const merpeople = skinAndSex("\u{1F9DC}", "Merperson");
const elves = skinAndSex("\u{1F9DD}", "Elf");
const walking = skinAndSex("\u{1F6B6}", "Walking");
const standing = skinAndSex("\u{1F9CD}", "Standing");
const kneeling = skinAndSex("\u{1F9CE}", "Kneeling");
const runners = skinAndSex("\u{1F3C3}", "Running");

const gestures = g(
    "Gestures", "Gestures",
    frowners,
    pouters,
    gesturingNo,
    gesturingOK,
    tippingHand,
    raisingHand,
    bowing,
    facePalming,
    shrugging,
    cantHear,
    gettingMassage,
    gettingHaircut);


const baby = skin("\u{1F476}", "Baby");
const child = skin("\u{1F9D2}", "Child");
const boy = skin("\u{1F466}", "Boy");
const girl = skin("\u{1F467}", "Girl");
const children = gg(child.value, child.desc, {
    default: child,
    male: boy,
    female: girl
});


const blondes = skinAndSex("\u{1F471}", "Blond Person");
const person = skin("\u{1F9D1}", "Person", blondes.default, wearingTurban.default);

const beardedMan = skin("\u{1F9D4}", "Bearded Man");
const manInSuitLevitating = e("\u{1F574}\u{FE0F}", "Man in Suit, Levitating");
const manWithChineseCap = skin("\u{1F472}", "Man With Chinese Cap");
const manInTuxedo = skin("\u{1F935}", "Man in Tuxedo");
const man = skinAndHair("\u{1F468}", "Man",
    blondes.man,
    beardedMan,
    manInSuitLevitating,
    manWithChineseCap,
    wearingTurban.man,
    manInTuxedo);

const pregnantWoman = skin("\u{1F930}", "Pregnant Woman");
const breastFeeding = skin("\u{1F931}", "Breast-Feeding");
const womanWithHeadscarf = skin("\u{1F9D5}", "Woman With Headscarf");
const brideWithVeil = skin("\u{1F470}", "Bride With Veil");
const woman = skinAndHair("\u{1F469}", "Woman",
    blondes.woman,
    pregnantWoman,
    breastFeeding,
    womanWithHeadscarf,
    wearingTurban.woman,
    brideWithVeil);
const adults = gg(
    person.value, "Adult", {
    default: person,
    male: man,
    female: woman
});

const olderPerson = skin("\u{1F9D3}", "Older Person");
const oldMan = skin("\u{1F474}", "Old Man");
const oldWoman = skin("\u{1F475}", "Old Woman");
const elderly = gg(
    olderPerson.value, olderPerson.desc, {
    default: olderPerson,
    male: oldMan,
    female: oldWoman
});

const medical = e("\u{2695}\u{FE0F}", "Medical");
const healthCareWorkers = sym(medical, "Health Care");

const graduationCap = e("\u{1F393}", "Graduation Cap");
const students = sym(graduationCap, "Student");

const school = e("\u{1F3EB}", "School");
const teachers = sym(school, "Teacher");

const balanceScale = e("\u{2696}\u{FE0F}", "Balance Scale");
const judges = sym(balanceScale, "Judge");

const sheafOfRice = e("\u{1F33E}", "Sheaf of Rice");
const farmers = sym(sheafOfRice, "Farmer");

const cooking = e("\u{1F373}", "Cooking");
const cooks = sym(cooking, "Cook");

const wrench = e("\u{1F527}", "Wrench");
const mechanics = sym(wrench, "Mechanic");

const factory = e("\u{1F3ED}", "Factory");
const factoryWorkers = sym(factory, "Factory Worker");

const briefcase = e("\u{1F4BC}", "Briefcase");
const officeWorkers = sym(briefcase, "Office Worker");

const fireEngine = e("\u{1F692}", "Fire Engine");
const fireFighters = sym(fireEngine, "Fire Fighter");

const rocket = e("\u{1F680}", "Rocket");
const astronauts = sym(rocket, "Astronaut");

const airplane = e("\u{2708}\u{FE0F}", "Airplane");
const pilots = sym(airplane, "Pilot");

const artistPalette = e("\u{1F3A8}", "Artist Palette");
const artists = sym(artistPalette, "Artist");

const microphone = e("\u{1F3A4}", "Microphone");
const singers = sym(microphone, "Singer");

const laptop = e("\u{1F4BB}", "Laptop");
const technologists = sym(laptop, "Technologist");

const microscope = e("\u{1F52C}", "Microscope");
const scientists = sym(microscope, "Scientist");

const crown = e("\u{1F451}", "Crown");
const prince = skin("\u{1F934}", "Prince");
const princess = skin("\u{1F478}", "Princess");
const royalty = gg(
    crown.value, crown.desc, {
    symbol: crown,
    male: prince,
    female: princess
});

const roles = gg(
    "Roles", "Depictions of people working", {
    healthCareWorkers,
    students,
    teachers,
    judges,
    farmers,
    cooks,
    mechanics,
    factoryWorkers,
    officeWorkers,
    scientists,
    technologists,
    singers,
    artists,
    pilots,
    astronauts,
    fireFighters,
    spies,
    guards,
    constructionWorkers,
    royalty
});

const cherub = skin("\u{1F47C}", "Cherub");
const santaClaus = skin("\u{1F385}", "Santa Claus");
const mrsClaus = skin("\u{1F936}", "Mrs. Claus");

const genies = sex(e("\u{1F9DE}", "Genie"));
const zombies = sex(e("\u{1F9DF}", "Zombie"));

const fantasy = gg(
    "Fantasy", "Depictions of fantasy characters", {
    cherub,
    santaClaus,
    mrsClaus,
    superheroes,
    supervillains,
    mages,
    fairies,
    vampires,
    merpeople,
    elves,
    genies,
    zombies
});

const whiteCane = e("\u{1F9AF}", "Probing Cane");
const withProbingCane = sym(whiteCane, "Probing");

const motorizedWheelchair = e("\u{1F9BC}", "Motorized Wheelchair");
const inMotorizedWheelchair = sym(motorizedWheelchair, "In Motorized Wheelchair");

const manualWheelchair = e("\u{1F9BD}", "Manual Wheelchair");
const inManualWheelchair = sym(manualWheelchair, "In Manual Wheelchair");


const manDancing = skin("\u{1F57A}", "Man Dancing");
const womanDancing = skin("\u{1F483}", "Woman Dancing");
const dancers = gg(
    manDancing.value, "Dancing", {
    male: manDancing,
    female: womanDancing
});

const jugglers = skinAndSex("\u{1F939}", "Juggler");

const climbers = skinAndSex("\u{1F9D7}", "Climber");
const fencer = e("\u{1F93A}", "Fencer");
const jockeys = skin("\u{1F3C7}", "Jockey");
const skier = e("\u{26F7}\u{FE0F}", "Skier");
const snowboarders = skin("\u{1F3C2}", "Snowboarder");
const golfers = skinAndSex("\u{1F3CC}\u{FE0F}", "Golfer");
const surfers = skinAndSex("\u{1F3C4}", "Surfing");
const rowers = skinAndSex("\u{1F6A3}", "Rowing Boat");
const swimmers = skinAndSex("\u{1F3CA}", "Swimming");
const basketballers = skinAndSex("\u{26F9}\u{FE0F}", "Basket Baller");
const weightLifters = skinAndSex("\u{1F3CB}\u{FE0F}", "Weight Lifter");
const bikers = skinAndSex("\u{1F6B4}", "Biker");
const mountainBikers = skinAndSex("\u{1F6B5}", "Mountain Biker");
const cartwheelers = skinAndSex("\u{1F938}", "Cartwheeler");
const wrestlers = sex(e("\u{1F93C}", "Wrestler"));
const waterPoloers = skinAndSex("\u{1F93D}", "Water Polo Player");
const handBallers = skinAndSex("\u{1F93E}", "Hand Baller");

const inMotion = gg(
    "In Motion", "Depictions of people in motion", {
    walking,
    standing,
    kneeling,
    withProbingCane,
    inMotorizedWheelchair,
    inManualWheelchair,
    dancers,
    jugglers,
    climbers,
    fencer,
    jockeys,
    skier,
    snowboarders,
    golfers,
    surfers,
    rowers,
    swimmers,
    runners,
    basketballers,
    weightLifters,
    bikers,
    mountainBikers,
    cartwheelers,
    wrestlers,
    waterPoloers,
    handBallers
});

const inLotusPosition = skinAndSex("\u{1F9D8}", "In Lotus Position");
const inBath = skin("\u{1F6C0}", "In Bath");
const inBed = skin("\u{1F6CC}", "In Bed");
const inSauna = skinAndSex("\u{1F9D6}", "In Sauna");
const resting = gg(
    "Resting", "Depictions of people at rest", {
    inLotusPosition,
    inBath,
    inBed,
    inSauna
});

const babies = g(baby.value, baby.desc, baby, cherub);
const people = gg(
    "People", "People", {
    babies,
    children,
    adults,
    elderly
});

const allPeople = gg(
    "All People", "All People", {
    people,
    gestures,
    inMotion,
    resting,
    roles,
    fantasy
});

const ogre = e("\u{1F479}", "Ogre");
const goblin = e("\u{1F47A}", "Goblin");
const ghost = e("\u{1F47B}", "Ghost");
const alien = e("\u{1F47D}", "Alien");
const alienMonster = e("\u{1F47E}", "Alien Monster");
const angryFaceWithHorns = e("\u{1F47F}", "Angry Face with Horns");
const skull = e("\u{1F480}", "Skull");
const pileOfPoo = e("\u{1F4A9}", "Pile of Poo");
const grinningFace = e("\u{1F600}", "Grinning Face");
const beamingFaceWithSmilingEyes = e("\u{1F601}", "Beaming Face with Smiling Eyes");
const faceWithTearsOfJoy = e("\u{1F602}", "Face with Tears of Joy");
const grinningFaceWithBigEyes = e("\u{1F603}", "Grinning Face with Big Eyes");
const grinningFaceWithSmilingEyes = e("\u{1F604}", "Grinning Face with Smiling Eyes");
const grinningFaceWithSweat = e("\u{1F605}", "Grinning Face with Sweat");
const grinningSquitingFace = e("\u{1F606}", "Grinning Squinting Face");
const smillingFaceWithHalo = e("\u{1F607}", "Smiling Face with Halo");
const smilingFaceWithHorns = e("\u{1F608}", "Smiling Face with Horns");
const winkingFace = e("\u{1F609}", "Winking Face");
const smilingFaceWithSmilingEyes = e("\u{1F60A}", "Smiling Face with Smiling Eyes");
const faceSavoringFood = e("\u{1F60B}", "Face Savoring Food");
const relievedFace = e("\u{1F60C}", "Relieved Face");
const smilingFaceWithHeartEyes = e("\u{1F60D}", "Smiling Face with Heart-Eyes");
const smilingFaceWithSunglasses = e("\u{1F60E}", "Smiling Face with Sunglasses");
const smirkingFace = e("\u{1F60F}", "Smirking Face");
const neutralFace = e("\u{1F610}", "Neutral Face");
const expressionlessFace = e("\u{1F611}", "Expressionless Face");
const unamusedFace = e("\u{1F612}", "Unamused Face");
const downcastFaceWithSweat = e("\u{1F613}", "Downcast Face with Sweat");
const pensiveFace = e("\u{1F614}", "Pensive Face");
const confusedFace = e("\u{1F615}", "Confused Face");
const confoundedFace = e("\u{1F616}", "Confounded Face");
const kissingFace = e("\u{1F617}", "Kissing Face");
const faceBlowingAKiss = e("\u{1F618}", "Face Blowing a Kiss");
const kissingFaceWithSmilingEyes = e("\u{1F619}", "Kissing Face with Smiling Eyes");
const kissingFaceWithClosedEyes = e("\u{1F61A}", "Kissing Face with Closed Eyes");
const faceWithTongue = e("\u{1F61B}", "Face with Tongue");
const winkingFaceWithTongue = e("\u{1F61C}", "Winking Face with Tongue");
const squintingFaceWithTongue = e("\u{1F61D}", "Squinting Face with Tongue");
const disappointedFace = e("\u{1F61E}", "Disappointed Face");
const worriedFace = e("\u{1F61F}", "Worried Face");
const angryFace = e("\u{1F620}", "Angry Face");
const poutingFace = e("\u{1F621}", "Pouting Face");
const cryingFace = e("\u{1F622}", "Crying Face");
const perseveringFace = e("\u{1F623}", "Persevering Face");
const faceWithSteamFromNose = e("\u{1F624}", "Face with Steam From Nose");
const sadButRelievedFace = e("\u{1F625}", "Sad but Relieved Face");
const frowningFaceWithOpenMouth = e("\u{1F626}", "Frowning Face with Open Mouth");
const anguishedFace = e("\u{1F627}", "Anguished Face");
const fearfulFace = e("\u{1F628}", "Fearful Face");
const wearyFace = e("\u{1F629}", "Weary Face");
const sleepyFace = e("\u{1F62A}", "Sleepy Face");
const tiredFace = e("\u{1F62B}", "Tired Face");
const grimacingFace = e("\u{1F62C}", "Grimacing Face");
const loudlyCryingFace = e("\u{1F62D}", "Loudly Crying Face");
const faceWithOpenMouth = e("\u{1F62E}", "Face with Open Mouth");
const hushedFace = e("\u{1F62F}", "Hushed Face");
const anxiousFaceWithSweat = e("\u{1F630}", "Anxious Face with Sweat");
const faceScreamingInFear = e("\u{1F631}", "Face Screaming in Fear");
const astonishedFace = e("\u{1F632}", "Astonished Face");
const flushedFace = e("\u{1F633}", "Flushed Face");
const sleepingFace = e("\u{1F634}", "Sleeping Face");
const dizzyFace = e("\u{1F635}", "Dizzy Face");
const faceWithoutMouth = e("\u{1F636}", "Face Without Mouth");
const faceWithMedicalMask = e("\u{1F637}", "Face with Medical Mask");
const grinningCatWithSmilingEyes = e("\u{1F638}", "Grinning Cat with Smiling Eyes");
const catWithTearsOfJoy = e("\u{1F639}", "Cat with Tears of Joy");
const grinningCat = e("\u{1F63A}", "Grinning Cat");
const smilingCatWithHeartEyes = e("\u{1F63B}", "Smiling Cat with Heart-Eyes");
const catWithWrySmile = e("\u{1F63C}", "Cat with Wry Smile");
const kissingCat = e("\u{1F63D}", "Kissing Cat");
const poutingCat = e("\u{1F63E}", "Pouting Cat");
const cryingCat = e("\u{1F63F}", "Crying Cat");
const wearyCat = e("\u{1F640}", "Weary Cat");
const slightlyFrowningFace = e("\u{1F641}", "Slightly Frowning Face");
const slightlySmilingFace = e("\u{1F642}", "Slightly Smiling Face");
const updisdeDownFace = e("\u{1F643}", "Upside-Down Face");
const faceWithRollingEyes = e("\u{1F644}", "Face with Rolling Eyes");
const seeNoEvilMonkey = e("\u{1F648}", "See-No-Evil Monkey");
const hearNoEvilMonkey = e("\u{1F649}", "Hear-No-Evil Monkey");
const speakNoEvilMonkey = e("\u{1F64A}", "Speak-No-Evil Monkey");
const zipperMouthFace = e("\u{1F910}", "Zipper-Mouth Face");
const moneyMouthFace = e("\u{1F911}", "Money-Mouth Face");
const faceWithThermometer = e("\u{1F912}", "Face with Thermometer");
const nerdFace = e("\u{1F913}", "Nerd Face");
const thinkingFace = e("\u{1F914}", "Thinking Face");
const faceWithHeadBandage = e("\u{1F915}", "Face with Head-Bandage");
const robot = e("\u{1F916}", "Robot");
const huggingFace = e("\u{1F917}", "Hugging Face");
const cowboyHatFace = e("\u{1F920}", "Cowboy Hat Face");
const clownFace = e("\u{1F921}", "Clown Face");
const nauseatedFace = e("\u{1F922}", "Nauseated Face");
const rollingOnTheFloorLaughing = e("\u{1F923}", "Rolling on the Floor Laughing");
const droolingFace = e("\u{1F924}", "Drooling Face");
const lyingFace = e("\u{1F925}", "Lying Face");
const sneezingFace = e("\u{1F927}", "Sneezing Face");
const faceWithRaisedEyebrow = e("\u{1F928}", "Face with Raised Eyebrow");
const starStruck = e("\u{1F929}", "Star-Struck");
const zanyFace = e("\u{1F92A}", "Zany Face");
const shushingFace = e("\u{1F92B}", "Shushing Face");
const faceWithSymbolsOnMouth = e("\u{1F92C}", "Face with Symbols on Mouth");
const faceWithHandOverMouth = e("\u{1F92D}", "Face with Hand Over Mouth");
const faceVomitting = e("\u{1F92E}", "Face Vomiting");
const explodingHead = e("\u{1F92F}", "Exploding Head");
const smilingFaceWithHearts = e("\u{1F970}", "Smiling Face with Hearts");
const yawningFace = e("\u{1F971}", "Yawning Face");
const smilingFaceWithTear = e("\u{1F972}", "Smiling Face with Tear");
const partyingFace = e("\u{1F973}", "Partying Face");
const woozyFace = e("\u{1F974}", "Woozy Face");
const hotFace = e("\u{1F975}", "Hot Face");
const coldFace = e("\u{1F976}", "Cold Face");
const disguisedFace = e("\u{1F978}", "Disguised Face");
const pleadingFace = e("\u{1F97A}", "Pleading Face");
const faceWithMonocle = e("\u{1F9D0}", "Face with Monocle");
const skullAndCrossbones = e("\u{2620}\u{FE0F}", "Skull and Crossbones");
const frowningFace = e("\u{2639}\u{FE0F}", "Frowning Face");
const fmilingFace = e("\u{263A}\u{FE0F}", "Smiling Face");
const speakingHead = e("\u{1F5E3}\u{FE0F}", "Speaking Head");
const bust = e("\u{1F464}", "Bust in Silhouette");
const faces = gg(
    "Faces", "Round emoji faces", {
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
});

const kissMark = e("\u{1F48B}", "Kiss Mark");
const loveLetter = e("\u{1F48C}", "Love Letter");
const beatingHeart = e("\u{1F493}", "Beating Heart");
const brokenHeart = e("\u{1F494}", "Broken Heart");
const twoHearts = e("\u{1F495}", "Two Hearts");
const sparklingHeart = e("\u{1F496}", "Sparkling Heart");
const growingHeart = e("\u{1F497}", "Growing Heart");
const heartWithArrow = e("\u{1F498}", "Heart with Arrow");
const blueHeart = e("\u{1F499}", "Blue Heart");
const greenHeart = e("\u{1F49A}", "Green Heart");
const yellowHeart = e("\u{1F49B}", "Yellow Heart");
const purpleHeart = e("\u{1F49C}", "Purple Heart");
const heartWithRibbon = e("\u{1F49D}", "Heart with Ribbon");
const revolvingHearts = e("\u{1F49E}", "Revolving Hearts");
const heartDecoration = e("\u{1F49F}", "Heart Decoration");
const blackHeart = e("\u{1F5A4}", "Black Heart");
const whiteHeart = e("\u{1F90D}", "White Heart");
const brownHeart = e("\u{1F90E}", "Brown Heart");
const orangeHeart = e("\u{1F9E1}", "Orange Heart");
const heartExclamation = e("\u{2763}\u{FE0F}", "Heart Exclamation");
const redHeart = e("\u{2764}\u{FE0F}", "Red Heart");
const love = gg(
    "Love", "Hearts and kisses", {
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
});

const cartoon = g(
    "Cartoon", "Cartoon symbols",
    e("\u{1F4A2}", "Anger Symbol"),
    e("\u{1F4A3}", "Bomb"),
    e("\u{1F4A4}", "Zzz"),
    e("\u{1F4A5}", "Collision"),
    e("\u{1F4A6}", "Sweat Droplets"),
    e("\u{1F4A8}", "Dashing Away"),
    e("\u{1F4AB}", "Dizzy"),
    e("\u{1F4AC}", "Speech Balloon"),
    e("\u{1F4AD}", "Thought Balloon"),
    e("\u{1F4AF}", "Hundred Points"),
    e("\u{1F573}\u{FE0F}", "Hole"),
    e("\u{1F5E8}\u{FE0F}", "Left Speech Bubble"),
    e("\u{1F5EF}\u{FE0F}", "Right Anger Bubble"));

const hands = g(
    "Hands", "Hands pointing at things",
    e("\u{1F446}", "Backhand Index Pointing Up"),
    e("\u{1F447}", "Backhand Index Pointing Down"),
    e("\u{1F448}", "Backhand Index Pointing Left"),
    e("\u{1F449}", "Backhand Index Pointing Right"),
    e("\u{1F44A}", "Oncoming Fist"),
    e("\u{1F44B}", "Waving Hand"),
    e("\u{1F44C}", "OK Hand"),
    e("\u{1F44D}", "Thumbs Up"),
    e("\u{1F44E}", "Thumbs Down"),
    e("\u{1F44F}", "Clapping Hands"),
    e("\u{1F450}", "Open Hands"),
    e("\u{1F485}", "Nail Polish"),
    e("\u{1F590}\u{FE0F}", "Hand with Fingers Splayed"),
    e("\u{1F595}", "Middle Finger"),
    e("\u{1F596}", "Vulcan Salute"),
    e("\u{1F64C}", "Raising Hands"),
    e("\u{1F64F}", "Folded Hands"),
    e("\u{1F90C}", "Pinched Fingers"),
    e("\u{1F90F}", "Pinching Hand"),
    e("\u{1F918}", "Sign of the Horns"),
    e("\u{1F919}", "Call Me Hand"),
    e("\u{1F91A}", "Raised Back of Hand"),
    e("\u{1F91B}", "Left-Facing Fist"),
    e("\u{1F91C}", "Right-Facing Fist"),
    e("\u{1F91D}", "Handshake"),
    e("\u{1F91E}", "Crossed Fingers"),
    e("\u{1F91F}", "Love-You Gesture"),
    e("\u{1F932}", "Palms Up Together"),
    e("\u{261D}\u{FE0F}", "Index Pointing Up"),
    e("\u{270A}", "Raised Fist"),
    e("\u{270B}", "Raised Hand"),
    e("\u{270C}\u{FE0F}", "Victory Hand"),
    e("\u{270D}\u{FE0F}", "Writing Hand"));

const bodyParts = g(
    "Body Parts", "General body parts",
    e("\u{1F440}", "Eyes"),
    e("\u{1F441}\u{FE0F}", "Eye"),
    e("\u{1F441}\u{FE0F}\u{200D}\u{1F5E8}\u{FE0F}", "Eye in Speech Bubble"),
    e("\u{1F442}", "Ear"),
    e("\u{1F443}", "Nose"),
    e("\u{1F444}", "Mouth"),
    e("\u{1F445}", "Tongue"),
    e("\u{1F4AA}", "Flexed Biceps"),
    e("\u{1F933}", "Selfie"),
    e("\u{1F9B4}", "Bone"),
    e("\u{1F9B5}", "Leg"),
    e("\u{1F9B6}", "Foot"),
    e("\u{1F9B7}", "Tooth"),
    e("\u{1F9BB}", "Ear with Hearing Aid"),
    e("\u{1F9BE}", "Mechanical Arm"),
    e("\u{1F9BF}", "Mechanical Leg"),
    e("\u{1F9E0}", "Brain"),
    e("\u{1FAC0}", "Anatomical Heart"),
    e("\u{1FAC1}", "Lungs"));

const animals = g(
    "Animals", "Animals and insects",
    e("\u{1F400}", "Rat"),
    e("\u{1F401}", "Mouse"),
    e("\u{1F402}", "Ox"),
    e("\u{1F403}", "Water Buffalo"),
    e("\u{1F404}", "Cow"),
    e("\u{1F405}", "Tiger"),
    e("\u{1F406}", "Leopard"),
    e("\u{1F407}", "Rabbit"),
    e("\u{1F408}", "Cat"),
    e("\u{1F408}\u{200D}\u{2B1B}", "Black Cat"),
    e("\u{1F409}", "Dragon"),
    e("\u{1F40A}", "Crocodile"),
    e("\u{1F40B}", "Whale"),
    e("\u{1F40C}", "Snail"),
    e("\u{1F40D}", "Snake"),
    e("\u{1F40E}", "Horse"),
    e("\u{1F40F}", "Ram"),
    e("\u{1F410}", "Goat"),
    e("\u{1F411}", "Ewe"),
    e("\u{1F412}", "Monkey"),
    e("\u{1F413}", "Rooster"),
    e("\u{1F414}", "Chicken"),
    e("\u{1F415}", "Dog"),
    e("\u{1F415}\u{200D}\u{1F9BA}", "Service Dog"),
    e("\u{1F416}", "Pig"),
    e("\u{1F417}", "Boar"),
    e("\u{1F418}", "Elephant"),
    e("\u{1F419}", "Octopus"),
    e("\u{1F41A}", "Spiral Shell"),
    e("\u{1F41B}", "Bug"),
    e("\u{1F41C}", "Ant"),
    e("\u{1F41D}", "Honeybee"),
    e("\u{1F41E}", "Lady Beetle"),
    e("\u{1F41F}", "Fish"),
    e("\u{1F420}", "Tropical Fish"),
    e("\u{1F421}", "Blowfish"),
    e("\u{1F422}", "Turtle"),
    e("\u{1F423}", "Hatching Chick"),
    e("\u{1F424}", "Baby Chick"),
    e("\u{1F425}", "Front-Facing Baby Chick"),
    e("\u{1F426}", "Bird"),
    e("\u{1F427}", "Penguin"),
    e("\u{1F428}", "Koala"),
    e("\u{1F429}", "Poodle"),
    e("\u{1F42A}", "Camel"),
    e("\u{1F42B}", "Two-Hump Camel"),
    e("\u{1F42C}", "Dolphin"),
    e("\u{1F42D}", "Mouse Face"),
    e("\u{1F42E}", "Cow Face"),
    e("\u{1F42F}", "Tiger Face"),
    e("\u{1F430}", "Rabbit Face"),
    e("\u{1F431}", "Cat Face"),
    e("\u{1F432}", "Dragon Face"),
    e("\u{1F433}", "Spouting Whale"),
    e("\u{1F434}", "Horse Face"),
    e("\u{1F435}", "Monkey Face"),
    e("\u{1F436}", "Dog Face"),
    e("\u{1F437}", "Pig Face"),
    e("\u{1F438}", "Frog"),
    e("\u{1F439}", "Hamster"),
    e("\u{1F43A}", "Wolf"),
    e("\u{1F43B}", "Bear"),
    e("\u{1F43B}\u{200D}\u{2744}\u{FE0F}", "Polar Bear"),
    e("\u{1F43C}", "Panda"),
    e("\u{1F43D}", "Pig Nose"),
    e("\u{1F43E}", "Paw Prints"),
    e("\u{1F43F}\u{FE0F}", "Chipmunk"),
    e("\u{1F54A}\u{FE0F}", "Dove"),
    e("\u{1F577}\u{FE0F}", "Spider"),
    e("\u{1F578}\u{FE0F}", "Spider Web"),
    e("\u{1F981}", "Lion"),
    e("\u{1F982}", "Scorpion"),
    e("\u{1F983}", "Turkey"),
    e("\u{1F984}", "Unicorn"),
    e("\u{1F985}", "Eagle"),
    e("\u{1F986}", "Duck"),
    e("\u{1F987}", "Bat"),
    e("\u{1F988}", "Shark"),
    e("\u{1F989}", "Owl"),
    e("\u{1F98A}", "Fox"),
    e("\u{1F98B}", "Butterfly"),
    e("\u{1F98C}", "Deer"),
    e("\u{1F98D}", "Gorilla"),
    e("\u{1F98E}", "Lizard"),
    e("\u{1F98F}", "Rhinoceros"),
    e("\u{1F992}", "Giraffe"),
    e("\u{1F993}", "Zebra"),
    e("\u{1F994}", "Hedgehog"),
    e("\u{1F995}", "Sauropod"),
    e("\u{1F996}", "T-Rex"),
    e("\u{1F997}", "Cricket"),
    e("\u{1F998}", "Kangaroo"),
    e("\u{1F999}", "Llama"),
    e("\u{1F99A}", "Peacock"),
    e("\u{1F99B}", "Hippopotamus"),
    e("\u{1F99C}", "Parrot"),
    e("\u{1F99D}", "Raccoon"),
    e("\u{1F99F}", "Mosquito"),
    e("\u{1F9A0}", "Microbe"),
    e("\u{1F9A1}", "Badger"),
    e("\u{1F9A2}", "Swan"),
    e("\u{1F9A3}", "Mammoth"),
    e("\u{1F9A4}", "Dodo"),
    e("\u{1F9A5}", "Sloth"),
    e("\u{1F9A6}", "Otter"),
    e("\u{1F9A7}", "Orangutan"),
    e("\u{1F9A8}", "Skunk"),
    e("\u{1F9A9}", "Flamingo"),
    e("\u{1F9AB}", "Beaver"),
    e("\u{1F9AC}", "Bison"),
    e("\u{1F9AD}", "Seal"),
    e("\u{1F9AE}", "Guide Dog"),
    e("\u{1FAB0}", "Fly"),
    e("\u{1FAB1}", "Worm"),
    e("\u{1FAB2}", "Beetle"),
    e("\u{1FAB3}", "Cockroach"),
    e("\u{1FAB6}", "Feather"));

const whiteFlower = e("\u{1F4AE}", "White Flower");
const plants = g(
    "Plants", "Flowers, trees, and things",
    e("\u{1F331}", "Seedling"),
    e("\u{1F332}", "Evergreen Tree"),
    e("\u{1F333}", "Deciduous Tree"),
    e("\u{1F334}", "Palm Tree"),
    e("\u{1F335}", "Cactus"),
    e("\u{1F337}", "Tulip"),
    e("\u{1F338}", "Cherry Blossom"),
    e("\u{1F339}", "Rose"),
    e("\u{1F33A}", "Hibiscus"),
    e("\u{1F33B}", "Sunflower"),
    e("\u{1F33C}", "Blossom"),
    sheafOfRice,
    e("\u{1F33F}", "Herb"),
    e("\u{1F340}", "Four Leaf Clover"),
    e("\u{1F341}", "Maple Leaf"),
    e("\u{1F342}", "Fallen Leaf"),
    e("\u{1F343}", "Leaf Fluttering in Wind"),
    e("\u{1F3F5}\u{FE0F}", "Rosette"),
    e("\u{1F490}", "Bouquet"),
    whiteFlower,
    e("\u{1F940}", "Wilted Flower"),
    e("\u{1FAB4}", "Potted Plant"),
    e("\u{2618}\u{FE0F}", "Shamrock"));

const banana = e("\u{1F34C}", "Banana");
const food = g(
    "Food", "Food, drink, and utensils",
    e("\u{1F32D}", "Hot Dog"),
    e("\u{1F32E}", "Taco"),
    e("\u{1F32F}", "Burrito"),
    e("\u{1F330}", "Chestnut"),
    e("\u{1F336}\u{FE0F}", "Hot Pepper"),
    e("\u{1F33D}", "Ear of Corn"),
    e("\u{1F344}", "Mushroom"),
    e("\u{1F345}", "Tomato"),
    e("\u{1F346}", "Eggplant"),
    e("\u{1F347}", "Grapes"),
    e("\u{1F348}", "Melon"),
    e("\u{1F349}", "Watermelon"),
    e("\u{1F34A}", "Tangerine"),
    e("\u{1F34B}", "Lemon"),
    banana,
    e("\u{1F34D}", "Pineapple"),
    e("\u{1F34E}", "Red Apple"),
    e("\u{1F34F}", "Green Apple"),
    e("\u{1F350}", "Pear"),
    e("\u{1F351}", "Peach"),
    e("\u{1F352}", "Cherries"),
    e("\u{1F353}", "Strawberry"),
    e("\u{1F354}", "Hamburger"),
    e("\u{1F355}", "Pizza"),
    e("\u{1F356}", "Meat on Bone"),
    e("\u{1F357}", "Poultry Leg"),
    e("\u{1F358}", "Rice Cracker"),
    e("\u{1F359}", "Rice Ball"),
    e("\u{1F35A}", "Cooked Rice"),
    e("\u{1F35B}", "Curry Rice"),
    e("\u{1F35C}", "Steaming Bowl"),
    e("\u{1F35D}", "Spaghetti"),
    e("\u{1F35E}", "Bread"),
    e("\u{1F35F}", "French Fries"),
    e("\u{1F360}", "Roasted Sweet Potato"),
    e("\u{1F361}", "Dango"),
    e("\u{1F362}", "Oden"),
    e("\u{1F363}", "Sushi"),
    e("\u{1F364}", "Fried Shrimp"),
    e("\u{1F365}", "Fish Cake with Swirl"),
    e("\u{1F371}", "Bento Box"),
    e("\u{1F372}", "Pot of Food"),
    cooking,
    e("\u{1F37F}", "Popcorn"),
    e("\u{1F950}", "Croissant"),
    e("\u{1F951}", "Avocado"),
    e("\u{1F952}", "Cucumber"),
    e("\u{1F953}", "Bacon"),
    e("\u{1F954}", "Potato"),
    e("\u{1F955}", "Carrot"),
    e("\u{1F956}", "Baguette Bread"),
    e("\u{1F957}", "Green Salad"),
    e("\u{1F958}", "Shallow Pan of Food"),
    e("\u{1F959}", "Stuffed Flatbread"),
    e("\u{1F95A}", "Egg"),
    e("\u{1F95C}", "Peanuts"),
    e("\u{1F95D}", "Kiwi Fruit"),
    e("\u{1F95E}", "Pancakes"),
    e("\u{1F95F}", "Dumpling"),
    e("\u{1F960}", "Fortune Cookie"),
    e("\u{1F961}", "Takeout Box"),
    e("\u{1F963}", "Bowl with Spoon"),
    e("\u{1F965}", "Coconut"),
    e("\u{1F966}", "Broccoli"),
    e("\u{1F968}", "Pretzel"),
    e("\u{1F969}", "Cut of Meat"),
    e("\u{1F96A}", "Sandwich"),
    e("\u{1F96B}", "Canned Food"),
    e("\u{1F96C}", "Leafy Green"),
    e("\u{1F96D}", "Mango"),
    e("\u{1F96E}", "Moon Cake"),
    e("\u{1F96F}", "Bagel"),
    e("\u{1F980}", "Crab"),
    e("\u{1F990}", "Shrimp"),
    e("\u{1F991}", "Squid"),
    e("\u{1F99E}", "Lobster"),
    e("\u{1F9AA}", "Oyster"),
    e("\u{1F9C0}", "Cheese Wedge"),
    e("\u{1F9C2}", "Salt"),
    e("\u{1F9C4}", "Garlic"),
    e("\u{1F9C5}", "Onion"),
    e("\u{1F9C6}", "Falafel"),
    e("\u{1F9C7}", "Waffle"),
    e("\u{1F9C8}", "Butter"),
    e("\u{1FAD0}", "Blueberries"),
    e("\u{1FAD1}", "Bell Pepper"),
    e("\u{1FAD2}", "Olive"),
    e("\u{1FAD3}", "Flatbread"),
    e("\u{1FAD4}", "Tamale"),
    e("\u{1FAD5}", "Fondue"),
    e("\u{1F366}", "Soft Ice Cream"),
    e("\u{1F367}", "Shaved Ice"),
    e("\u{1F368}", "Ice Cream"),
    e("\u{1F369}", "Doughnut"),
    e("\u{1F36A}", "Cookie"),
    e("\u{1F36B}", "Chocolate Bar"),
    e("\u{1F36C}", "Candy"),
    e("\u{1F36D}", "Lollipop"),
    e("\u{1F36E}", "Custard"),
    e("\u{1F36F}", "Honey Pot"),
    e("\u{1F370}", "Shortcake"),
    e("\u{1F382}", "Birthday Cake"),
    e("\u{1F967}", "Pie"),
    e("\u{1F9C1}", "Cupcake"),
    e("\u{1F375}", "Teacup Without Handle"),
    e("\u{1F376}", "Sake"),
    e("\u{1F377}", "Wine Glass"),
    e("\u{1F378}", "Cocktail Glass"),
    e("\u{1F379}", "Tropical Drink"),
    e("\u{1F37A}", "Beer Mug"),
    e("\u{1F37B}", "Clinking Beer Mugs"),
    e("\u{1F37C}", "Baby Bottle"),
    e("\u{1F37E}", "Bottle with Popping Cork"),
    e("\u{1F942}", "Clinking Glasses"),
    e("\u{1F943}", "Tumbler Glass"),
    e("\u{1F95B}", "Glass of Milk"),
    e("\u{1F964}", "Cup with Straw"),
    e("\u{1F9C3}", "Beverage Box"),
    e("\u{1F9C9}", "Mate"),
    e("\u{1F9CA}", "Ice"),
    e("\u{1F9CB}", "Bubble Tea"),
    e("\u{1FAD6}", "Teapot"),
    e("\u{2615}", "Hot Beverage"),
    e("\u{1F374}", "Fork and Knife"),
    e("\u{1F37D}\u{FE0F}", "Fork and Knife with Plate"),
    e("\u{1F3FA}", "Amphora"),
    e("\u{1F52A}", "Kitchen Knife"),
    e("\u{1F944}", "Spoon"),
    e("\u{1F962}", "Chopsticks"));

const nations = g(
    "National Flags", "Flags of countries from around the world",
    e("\u{1F1E6}\u{1F1E8}", "Flag: Ascension Island"),
    e("\u{1F1E6}\u{1F1E9}", "Flag: Andorra"),
    e("\u{1F1E6}\u{1F1EA}", "Flag: United Arab Emirates"),
    e("\u{1F1E6}\u{1F1EB}", "Flag: Afghanistan"),
    e("\u{1F1E6}\u{1F1EC}", "Flag: Antigua & Barbuda"),
    e("\u{1F1E6}\u{1F1EE}", "Flag: Anguilla"),
    e("\u{1F1E6}\u{1F1F1}", "Flag: Albania"),
    e("\u{1F1E6}\u{1F1F2}", "Flag: Armenia"),
    e("\u{1F1E6}\u{1F1F4}", "Flag: Angola"),
    e("\u{1F1E6}\u{1F1F6}", "Flag: Antarctica"),
    e("\u{1F1E6}\u{1F1F7}", "Flag: Argentina"),
    e("\u{1F1E6}\u{1F1F8}", "Flag: American Samoa"),
    e("\u{1F1E6}\u{1F1F9}", "Flag: Austria"),
    e("\u{1F1E6}\u{1F1FA}", "Flag: Australia"),
    e("\u{1F1E6}\u{1F1FC}", "Flag: Aruba"),
    e("\u{1F1E6}\u{1F1FD}", "Flag: Åland Islands"),
    e("\u{1F1E6}\u{1F1FF}", "Flag: Azerbaijan"),
    e("\u{1F1E7}\u{1F1E6}", "Flag: Bosnia & Herzegovina"),
    e("\u{1F1E7}\u{1F1E7}", "Flag: Barbados"),
    e("\u{1F1E7}\u{1F1E9}", "Flag: Bangladesh"),
    e("\u{1F1E7}\u{1F1EA}", "Flag: Belgium"),
    e("\u{1F1E7}\u{1F1EB}", "Flag: Burkina Faso"),
    e("\u{1F1E7}\u{1F1EC}", "Flag: Bulgaria"),
    e("\u{1F1E7}\u{1F1ED}", "Flag: Bahrain"),
    e("\u{1F1E7}\u{1F1EE}", "Flag: Burundi"),
    e("\u{1F1E7}\u{1F1EF}", "Flag: Benin"),
    e("\u{1F1E7}\u{1F1F1}", "Flag: St. Barthélemy"),
    e("\u{1F1E7}\u{1F1F2}", "Flag: Bermuda"),
    e("\u{1F1E7}\u{1F1F3}", "Flag: Brunei"),
    e("\u{1F1E7}\u{1F1F4}", "Flag: Bolivia"),
    e("\u{1F1E7}\u{1F1F6}", "Flag: Caribbean Netherlands"),
    e("\u{1F1E7}\u{1F1F7}", "Flag: Brazil"),
    e("\u{1F1E7}\u{1F1F8}", "Flag: Bahamas"),
    e("\u{1F1E7}\u{1F1F9}", "Flag: Bhutan"),
    e("\u{1F1E7}\u{1F1FB}", "Flag: Bouvet Island"),
    e("\u{1F1E7}\u{1F1FC}", "Flag: Botswana"),
    e("\u{1F1E7}\u{1F1FE}", "Flag: Belarus"),
    e("\u{1F1E7}\u{1F1FF}", "Flag: Belize"),
    e("\u{1F1E8}\u{1F1E6}", "Flag: Canada"),
    e("\u{1F1E8}\u{1F1E8}", "Flag: Cocos (Keeling) Islands"),
    e("\u{1F1E8}\u{1F1E9}", "Flag: Congo - Kinshasa"),
    e("\u{1F1E8}\u{1F1EB}", "Flag: Central African Republic"),
    e("\u{1F1E8}\u{1F1EC}", "Flag: Congo - Brazzaville"),
    e("\u{1F1E8}\u{1F1ED}", "Flag: Switzerland"),
    e("\u{1F1E8}\u{1F1EE}", "Flag: Côte d’Ivoire"),
    e("\u{1F1E8}\u{1F1F0}", "Flag: Cook Islands"),
    e("\u{1F1E8}\u{1F1F1}", "Flag: Chile"),
    e("\u{1F1E8}\u{1F1F2}", "Flag: Cameroon"),
    e("\u{1F1E8}\u{1F1F3}", "Flag: China"),
    e("\u{1F1E8}\u{1F1F4}", "Flag: Colombia"),
    e("\u{1F1E8}\u{1F1F5}", "Flag: Clipperton Island"),
    e("\u{1F1E8}\u{1F1F7}", "Flag: Costa Rica"),
    e("\u{1F1E8}\u{1F1FA}", "Flag: Cuba"),
    e("\u{1F1E8}\u{1F1FB}", "Flag: Cape Verde"),
    e("\u{1F1E8}\u{1F1FC}", "Flag: Curaçao"),
    e("\u{1F1E8}\u{1F1FD}", "Flag: Christmas Island"),
    e("\u{1F1E8}\u{1F1FE}", "Flag: Cyprus"),
    e("\u{1F1E8}\u{1F1FF}", "Flag: Czechia"),
    e("\u{1F1E9}\u{1F1EA}", "Flag: Germany"),
    e("\u{1F1E9}\u{1F1EC}", "Flag: Diego Garcia"),
    e("\u{1F1E9}\u{1F1EF}", "Flag: Djibouti"),
    e("\u{1F1E9}\u{1F1F0}", "Flag: Denmark"),
    e("\u{1F1E9}\u{1F1F2}", "Flag: Dominica"),
    e("\u{1F1E9}\u{1F1F4}", "Flag: Dominican Republic"),
    e("\u{1F1E9}\u{1F1FF}", "Flag: Algeria"),
    e("\u{1F1EA}\u{1F1E6}", "Flag: Ceuta & Melilla"),
    e("\u{1F1EA}\u{1F1E8}", "Flag: Ecuador"),
    e("\u{1F1EA}\u{1F1EA}", "Flag: Estonia"),
    e("\u{1F1EA}\u{1F1EC}", "Flag: Egypt"),
    e("\u{1F1EA}\u{1F1ED}", "Flag: Western Sahara"),
    e("\u{1F1EA}\u{1F1F7}", "Flag: Eritrea"),
    e("\u{1F1EA}\u{1F1F8}", "Flag: Spain"),
    e("\u{1F1EA}\u{1F1F9}", "Flag: Ethiopia"),
    e("\u{1F1EA}\u{1F1FA}", "Flag: European Union"),
    e("\u{1F1EB}\u{1F1EE}", "Flag: Finland"),
    e("\u{1F1EB}\u{1F1EF}", "Flag: Fiji"),
    e("\u{1F1EB}\u{1F1F0}", "Flag: Falkland Islands"),
    e("\u{1F1EB}\u{1F1F2}", "Flag: Micronesia"),
    e("\u{1F1EB}\u{1F1F4}", "Flag: Faroe Islands"),
    e("\u{1F1EB}\u{1F1F7}", "Flag: France"),
    e("\u{1F1EC}\u{1F1E6}", "Flag: Gabon"),
    e("\u{1F1EC}\u{1F1E7}", "Flag: United Kingdom"),
    e("\u{1F1EC}\u{1F1E9}", "Flag: Grenada"),
    e("\u{1F1EC}\u{1F1EA}", "Flag: Georgia"),
    e("\u{1F1EC}\u{1F1EB}", "Flag: French Guiana"),
    e("\u{1F1EC}\u{1F1EC}", "Flag: Guernsey"),
    e("\u{1F1EC}\u{1F1ED}", "Flag: Ghana"),
    e("\u{1F1EC}\u{1F1EE}", "Flag: Gibraltar"),
    e("\u{1F1EC}\u{1F1F1}", "Flag: Greenland"),
    e("\u{1F1EC}\u{1F1F2}", "Flag: Gambia"),
    e("\u{1F1EC}\u{1F1F3}", "Flag: Guinea"),
    e("\u{1F1EC}\u{1F1F5}", "Flag: Guadeloupe"),
    e("\u{1F1EC}\u{1F1F6}", "Flag: Equatorial Guinea"),
    e("\u{1F1EC}\u{1F1F7}", "Flag: Greece"),
    e("\u{1F1EC}\u{1F1F8}", "Flag: South Georgia & South Sandwich Islands"),
    e("\u{1F1EC}\u{1F1F9}", "Flag: Guatemala"),
    e("\u{1F1EC}\u{1F1FA}", "Flag: Guam"),
    e("\u{1F1EC}\u{1F1FC}", "Flag: Guinea-Bissau"),
    e("\u{1F1EC}\u{1F1FE}", "Flag: Guyana"),
    e("\u{1F1ED}\u{1F1F0}", "Flag: Hong Kong SAR China"),
    e("\u{1F1ED}\u{1F1F2}", "Flag: Heard & McDonald Islands"),
    e("\u{1F1ED}\u{1F1F3}", "Flag: Honduras"),
    e("\u{1F1ED}\u{1F1F7}", "Flag: Croatia"),
    e("\u{1F1ED}\u{1F1F9}", "Flag: Haiti"),
    e("\u{1F1ED}\u{1F1FA}", "Flag: Hungary"),
    e("\u{1F1EE}\u{1F1E8}", "Flag: Canary Islands"),
    e("\u{1F1EE}\u{1F1E9}", "Flag: Indonesia"),
    e("\u{1F1EE}\u{1F1EA}", "Flag: Ireland"),
    e("\u{1F1EE}\u{1F1F1}", "Flag: Israel"),
    e("\u{1F1EE}\u{1F1F2}", "Flag: Isle of Man"),
    e("\u{1F1EE}\u{1F1F3}", "Flag: India"),
    e("\u{1F1EE}\u{1F1F4}", "Flag: British Indian Ocean Territory"),
    e("\u{1F1EE}\u{1F1F6}", "Flag: Iraq"),
    e("\u{1F1EE}\u{1F1F7}", "Flag: Iran"),
    e("\u{1F1EE}\u{1F1F8}", "Flag: Iceland"),
    e("\u{1F1EE}\u{1F1F9}", "Flag: Italy"),
    e("\u{1F1EF}\u{1F1EA}", "Flag: Jersey"),
    e("\u{1F1EF}\u{1F1F2}", "Flag: Jamaica"),
    e("\u{1F1EF}\u{1F1F4}", "Flag: Jordan"),
    e("\u{1F1EF}\u{1F1F5}", "Flag: Japan"),
    e("\u{1F1F0}\u{1F1EA}", "Flag: Kenya"),
    e("\u{1F1F0}\u{1F1EC}", "Flag: Kyrgyzstan"),
    e("\u{1F1F0}\u{1F1ED}", "Flag: Cambodia"),
    e("\u{1F1F0}\u{1F1EE}", "Flag: Kiribati"),
    e("\u{1F1F0}\u{1F1F2}", "Flag: Comoros"),
    e("\u{1F1F0}\u{1F1F3}", "Flag: St. Kitts & Nevis"),
    e("\u{1F1F0}\u{1F1F5}", "Flag: North Korea"),
    e("\u{1F1F0}\u{1F1F7}", "Flag: South Korea"),
    e("\u{1F1F0}\u{1F1FC}", "Flag: Kuwait"),
    e("\u{1F1F0}\u{1F1FE}", "Flag: Cayman Islands"),
    e("\u{1F1F0}\u{1F1FF}", "Flag: Kazakhstan"),
    e("\u{1F1F1}\u{1F1E6}", "Flag: Laos"),
    e("\u{1F1F1}\u{1F1E7}", "Flag: Lebanon"),
    e("\u{1F1F1}\u{1F1E8}", "Flag: St. Lucia"),
    e("\u{1F1F1}\u{1F1EE}", "Flag: Liechtenstein"),
    e("\u{1F1F1}\u{1F1F0}", "Flag: Sri Lanka"),
    e("\u{1F1F1}\u{1F1F7}", "Flag: Liberia"),
    e("\u{1F1F1}\u{1F1F8}", "Flag: Lesotho"),
    e("\u{1F1F1}\u{1F1F9}", "Flag: Lithuania"),
    e("\u{1F1F1}\u{1F1FA}", "Flag: Luxembourg"),
    e("\u{1F1F1}\u{1F1FB}", "Flag: Latvia"),
    e("\u{1F1F1}\u{1F1FE}", "Flag: Libya"),
    e("\u{1F1F2}\u{1F1E6}", "Flag: Morocco"),
    e("\u{1F1F2}\u{1F1E8}", "Flag: Monaco"),
    e("\u{1F1F2}\u{1F1E9}", "Flag: Moldova"),
    e("\u{1F1F2}\u{1F1EA}", "Flag: Montenegro"),
    e("\u{1F1F2}\u{1F1EB}", "Flag: St. Martin"),
    e("\u{1F1F2}\u{1F1EC}", "Flag: Madagascar"),
    e("\u{1F1F2}\u{1F1ED}", "Flag: Marshall Islands"),
    e("\u{1F1F2}\u{1F1F0}", "Flag: North Macedonia"),
    e("\u{1F1F2}\u{1F1F1}", "Flag: Mali"),
    e("\u{1F1F2}\u{1F1F2}", "Flag: Myanmar (Burma)"),
    e("\u{1F1F2}\u{1F1F3}", "Flag: Mongolia"),
    e("\u{1F1F2}\u{1F1F4}", "Flag: Macao Sar China"),
    e("\u{1F1F2}\u{1F1F5}", "Flag: Northern Mariana Islands"),
    e("\u{1F1F2}\u{1F1F6}", "Flag: Martinique"),
    e("\u{1F1F2}\u{1F1F7}", "Flag: Mauritania"),
    e("\u{1F1F2}\u{1F1F8}", "Flag: Montserrat"),
    e("\u{1F1F2}\u{1F1F9}", "Flag: Malta"),
    e("\u{1F1F2}\u{1F1FA}", "Flag: Mauritius"),
    e("\u{1F1F2}\u{1F1FB}", "Flag: Maldives"),
    e("\u{1F1F2}\u{1F1FC}", "Flag: Malawi"),
    e("\u{1F1F2}\u{1F1FD}", "Flag: Mexico"),
    e("\u{1F1F2}\u{1F1FE}", "Flag: Malaysia"),
    e("\u{1F1F2}\u{1F1FF}", "Flag: Mozambique"),
    e("\u{1F1F3}\u{1F1E6}", "Flag: Namibia"),
    e("\u{1F1F3}\u{1F1E8}", "Flag: New Caledonia"),
    e("\u{1F1F3}\u{1F1EA}", "Flag: Niger"),
    e("\u{1F1F3}\u{1F1EB}", "Flag: Norfolk Island"),
    e("\u{1F1F3}\u{1F1EC}", "Flag: Nigeria"),
    e("\u{1F1F3}\u{1F1EE}", "Flag: Nicaragua"),
    e("\u{1F1F3}\u{1F1F1}", "Flag: Netherlands"),
    e("\u{1F1F3}\u{1F1F4}", "Flag: Norway"),
    e("\u{1F1F3}\u{1F1F5}", "Flag: Nepal"),
    e("\u{1F1F3}\u{1F1F7}", "Flag: Nauru"),
    e("\u{1F1F3}\u{1F1FA}", "Flag: Niue"),
    e("\u{1F1F3}\u{1F1FF}", "Flag: New Zealand"),
    e("\u{1F1F4}\u{1F1F2}", "Flag: Oman"),
    e("\u{1F1F5}\u{1F1E6}", "Flag: Panama"),
    e("\u{1F1F5}\u{1F1EA}", "Flag: Peru"),
    e("\u{1F1F5}\u{1F1EB}", "Flag: French Polynesia"),
    e("\u{1F1F5}\u{1F1EC}", "Flag: Papua New Guinea"),
    e("\u{1F1F5}\u{1F1ED}", "Flag: Philippines"),
    e("\u{1F1F5}\u{1F1F0}", "Flag: Pakistan"),
    e("\u{1F1F5}\u{1F1F1}", "Flag: Poland"),
    e("\u{1F1F5}\u{1F1F2}", "Flag: St. Pierre & Miquelon"),
    e("\u{1F1F5}\u{1F1F3}", "Flag: Pitcairn Islands"),
    e("\u{1F1F5}\u{1F1F7}", "Flag: Puerto Rico"),
    e("\u{1F1F5}\u{1F1F8}", "Flag: Palestinian Territories"),
    e("\u{1F1F5}\u{1F1F9}", "Flag: Portugal"),
    e("\u{1F1F5}\u{1F1FC}", "Flag: Palau"),
    e("\u{1F1F5}\u{1F1FE}", "Flag: Paraguay"),
    e("\u{1F1F6}\u{1F1E6}", "Flag: Qatar"),
    e("\u{1F1F7}\u{1F1EA}", "Flag: Réunion"),
    e("\u{1F1F7}\u{1F1F4}", "Flag: Romania"),
    e("\u{1F1F7}\u{1F1F8}", "Flag: Serbia"),
    e("\u{1F1F7}\u{1F1FA}", "Flag: Russia"),
    e("\u{1F1F7}\u{1F1FC}", "Flag: Rwanda"),
    e("\u{1F1F8}\u{1F1E6}", "Flag: Saudi Arabia"),
    e("\u{1F1F8}\u{1F1E7}", "Flag: Solomon Islands"),
    e("\u{1F1F8}\u{1F1E8}", "Flag: Seychelles"),
    e("\u{1F1F8}\u{1F1E9}", "Flag: Sudan"),
    e("\u{1F1F8}\u{1F1EA}", "Flag: Sweden"),
    e("\u{1F1F8}\u{1F1EC}", "Flag: Singapore"),
    e("\u{1F1F8}\u{1F1ED}", "Flag: St. Helena"),
    e("\u{1F1F8}\u{1F1EE}", "Flag: Slovenia"),
    e("\u{1F1F8}\u{1F1EF}", "Flag: Svalbard & Jan Mayen"),
    e("\u{1F1F8}\u{1F1F0}", "Flag: Slovakia"),
    e("\u{1F1F8}\u{1F1F1}", "Flag: Sierra Leone"),
    e("\u{1F1F8}\u{1F1F2}", "Flag: San Marino"),
    e("\u{1F1F8}\u{1F1F3}", "Flag: Senegal"),
    e("\u{1F1F8}\u{1F1F4}", "Flag: Somalia"),
    e("\u{1F1F8}\u{1F1F7}", "Flag: Suriname"),
    e("\u{1F1F8}\u{1F1F8}", "Flag: South Sudan"),
    e("\u{1F1F8}\u{1F1F9}", "Flag: São Tomé & Príncipe"),
    e("\u{1F1F8}\u{1F1FB}", "Flag: El Salvador"),
    e("\u{1F1F8}\u{1F1FD}", "Flag: Sint Maarten"),
    e("\u{1F1F8}\u{1F1FE}", "Flag: Syria"),
    e("\u{1F1F8}\u{1F1FF}", "Flag: Eswatini"),
    e("\u{1F1F9}\u{1F1E6}", "Flag: Tristan Da Cunha"),
    e("\u{1F1F9}\u{1F1E8}", "Flag: Turks & Caicos Islands"),
    e("\u{1F1F9}\u{1F1E9}", "Flag: Chad"),
    e("\u{1F1F9}\u{1F1EB}", "Flag: French Southern Territories"),
    e("\u{1F1F9}\u{1F1EC}", "Flag: Togo"),
    e("\u{1F1F9}\u{1F1ED}", "Flag: Thailand"),
    e("\u{1F1F9}\u{1F1EF}", "Flag: Tajikistan"),
    e("\u{1F1F9}\u{1F1F0}", "Flag: Tokelau"),
    e("\u{1F1F9}\u{1F1F1}", "Flag: Timor-Leste"),
    e("\u{1F1F9}\u{1F1F2}", "Flag: Turkmenistan"),
    e("\u{1F1F9}\u{1F1F3}", "Flag: Tunisia"),
    e("\u{1F1F9}\u{1F1F4}", "Flag: Tonga"),
    e("\u{1F1F9}\u{1F1F7}", "Flag: Turkey"),
    e("\u{1F1F9}\u{1F1F9}", "Flag: Trinidad & Tobago"),
    e("\u{1F1F9}\u{1F1FB}", "Flag: Tuvalu"),
    e("\u{1F1F9}\u{1F1FC}", "Flag: Taiwan"),
    e("\u{1F1F9}\u{1F1FF}", "Flag: Tanzania"),
    e("\u{1F1FA}\u{1F1E6}", "Flag: Ukraine"),
    e("\u{1F1FA}\u{1F1EC}", "Flag: Uganda"),
    e("\u{1F1FA}\u{1F1F2}", "Flag: U.S. Outlying Islands"),
    e("\u{1F1FA}\u{1F1F3}", "Flag: United Nations"),
    e("\u{1F1FA}\u{1F1F8}", "Flag: United States"),
    e("\u{1F1FA}\u{1F1FE}", "Flag: Uruguay"),
    e("\u{1F1FA}\u{1F1FF}", "Flag: Uzbekistan"),
    e("\u{1F1FB}\u{1F1E6}", "Flag: Vatican City"),
    e("\u{1F1FB}\u{1F1E8}", "Flag: St. Vincent & Grenadines"),
    e("\u{1F1FB}\u{1F1EA}", "Flag: Venezuela"),
    e("\u{1F1FB}\u{1F1EC}", "Flag: British Virgin Islands"),
    e("\u{1F1FB}\u{1F1EE}", "Flag: U.S. Virgin Islands"),
    e("\u{1F1FB}\u{1F1F3}", "Flag: Vietnam"),
    e("\u{1F1FB}\u{1F1FA}", "Flag: Vanuatu"),
    e("\u{1F1FC}\u{1F1EB}", "Flag: Wallis & Futuna"),
    e("\u{1F1FC}\u{1F1F8}", "Flag: Samoa"),
    e("\u{1F1FD}\u{1F1F0}", "Flag: Kosovo"),
    e("\u{1F1FE}\u{1F1EA}", "Flag: Yemen"),
    e("\u{1F1FE}\u{1F1F9}", "Flag: Mayotte"),
    e("\u{1F1FF}\u{1F1E6}", "Flag: South Africa"),
    e("\u{1F1FF}\u{1F1F2}", "Flag: Zambia"),
    e("\u{1F1FF}\u{1F1FC}", "Flag: Zimbabwe"));

const flags = g(
    "Flags", "Basic flags",
    e("\u{1F38C}", "Crossed Flags"),
    e("\u{1F3C1}", "Chequered Flag"),
    e("\u{1F3F3}\u{FE0F}", "White Flag"),
    e("\u{1F3F3}\u{FE0F}\u{200D}\u{1F308}", "Rainbow Flag"),
    e("\u{1F3F3}\u{FE0F}\u{200D}\u{26A7}\u{FE0F}", "Transgender Flag"),
    e("\u{1F3F4}", "Black Flag"),
    e("\u{1F3F4}\u{200D}\u{2620}\u{FE0F}", "Pirate Flag"),
    e("\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}", "Flag: England"),
    e("\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}", "Flag: Scotland"),
    e("\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}", "Flag: Wales"),
    e("\u{1F6A9}", "Triangular Flag"));

const motorcycle = e("\u{1F3CD}\u{FE0F}", "Motorcycle");
const racingCar = e("\u{1F3CE}\u{FE0F}", "Racing Car");
const seat = e("\u{1F4BA}", "Seat");
const helicopter = e("\u{1F681}", "Helicopter");
const locomotive = e("\u{1F682}", "Locomotive");
const railwayCar = e("\u{1F683}", "Railway Car");
const highspeedTrain = e("\u{1F684}", "High-Speed Train");
const bulletTrain = e("\u{1F685}", "Bullet Train");
const train = e("\u{1F686}", "Train");
const metro = e("\u{1F687}", "Metro");
const lightRail = e("\u{1F688}", "Light Rail");
const station = e("\u{1F689}", "Station");
const tram = e("\u{1F68A}", "Tram");
const tramCar = e("\u{1F68B}", "Tram Car");
const bus = e("\u{1F68C}", "Bus");
const oncomingBus = e("\u{1F68D}", "Oncoming Bus");
const trolleyBus = e("\u{1F68E}", "Trolleybus");
const busStop = e("\u{1F68F}", "Bus Stop");
const miniBus = e("\u{1F690}", "Minibus");
const ambulance = e("\u{1F691}", "Ambulance");
const policeCar = e("\u{1F693}", "Police Car");
const oncomingPoliceCar = e("\u{1F694}", "Oncoming Police Car");
const taxi = e("\u{1F695}", "Taxi");
const oncomingTaxi = e("\u{1F696}", "Oncoming Taxi");
const automobile = e("\u{1F697}", "Automobile");
const oncomingAutomobile = e("\u{1F698}", "Oncoming Automobile");
const sportUtilityVehicle = e("\u{1F699}", "Sport Utility Vehicle");
const deliveryTruck = e("\u{1F69A}", "Delivery Truck");
const articulatedLorry = e("\u{1F69B}", "Articulated Lorry");
const tractor = e("\u{1F69C}", "Tractor");
const monorail = e("\u{1F69D}", "Monorail");
const mountainRailway = e("\u{1F69E}", "Mountain Railway");
const suspensionRailway = e("\u{1F69F}", "Suspension Railway");
const mountainCableway = e("\u{1F6A0}", "Mountain Cableway");
const aerialTramway = e("\u{1F6A1}", "Aerial Tramway");
const ship = e("\u{1F6A2}", "Ship");
const speedBoat = e("\u{1F6A4}", "Speedboat");
const horizontalTrafficLight = e("\u{1F6A5}", "Horizontal Traffic Light");
const verticalTrafficLight = e("\u{1F6A6}", "Vertical Traffic Light");
const construction = e("\u{1F6A7}", "Construction");
const policeCarLight = e("\u{1F6A8}", "Police Car Light");
const bicycle = e("\u{1F6B2}", "Bicycle");
const stopSign = e("\u{1F6D1}", "Stop Sign");
const oilDrum = e("\u{1F6E2}\u{FE0F}", "Oil Drum");
const motorway = e("\u{1F6E3}\u{FE0F}", "Motorway");
const railwayTrack = e("\u{1F6E4}\u{FE0F}", "Railway Track");
const motorBoat = e("\u{1F6E5}\u{FE0F}", "Motor Boat");
const smallAirplane = e("\u{1F6E9}\u{FE0F}", "Small Airplane");
const airplaneDeparture = e("\u{1F6EB}", "Airplane Departure");
const airplaneArrival = e("\u{1F6EC}", "Airplane Arrival");
const satellite = e("\u{1F6F0}\u{FE0F}", "Satellite");
const passengerShip = e("\u{1F6F3}\u{FE0F}", "Passenger Ship");
const kickScooter = e("\u{1F6F4}", "Kick Scooter");
const motorScooter = e("\u{1F6F5}", "Motor Scooter");
const canoe = e("\u{1F6F6}", "Canoe");
const flyingSaucer = e("\u{1F6F8}", "Flying Saucer");
const skateboard = e("\u{1F6F9}", "Skateboard");
const autoRickshaw = e("\u{1F6FA}", "Auto Rickshaw");
const pickupTruck = e("\u{1F6FB}", "Pickup Truck");
const rollerSkate = e("\u{1F6FC}", "Roller Skate");
const parachute = e("\u{1FA82}", "Parachute");
const anchor = e("\u{2693}", "Anchor");
const ferry = e("\u{26F4}\u{FE0F}", "Ferry");
const sailboat = e("\u{26F5}", "Sailboat");
const fuelPump = e("\u{26FD}", "Fuel Pump");
const vehicles = g(
    "Vehicles", "Things that go",
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
    airplane);

const bloodTypes = g(
    "Blood Types", "Blood types",
    e("\u{1F170}", "A Button (Blood Type)"),
    e("\u{1F171}", "B Button (Blood Type)"),
    e("\u{1F17E}", "O Button (Blood Type)"),
    e("\u{1F18E}", "AB Button (Blood Type)"));

const regionIndicators = g(
    "Regions", "Region indicators",
    e("\u{1F1E6}", "Regional Indicator Symbol Letter A"),
    e("\u{1F1E7}", "Regional Indicator Symbol Letter B"),
    e("\u{1F1E8}", "Regional Indicator Symbol Letter C"),
    e("\u{1F1E9}", "Regional Indicator Symbol Letter D"),
    e("\u{1F1EA}", "Regional Indicator Symbol Letter E"),
    e("\u{1F1EB}", "Regional Indicator Symbol Letter F"),
    e("\u{1F1EC}", "Regional Indicator Symbol Letter G"),
    e("\u{1F1ED}", "Regional Indicator Symbol Letter H"),
    e("\u{1F1EE}", "Regional Indicator Symbol Letter I"),
    e("\u{1F1EF}", "Regional Indicator Symbol Letter J"),
    e("\u{1F1F0}", "Regional Indicator Symbol Letter K"),
    e("\u{1F1F1}", "Regional Indicator Symbol Letter L"),
    e("\u{1F1F2}", "Regional Indicator Symbol Letter M"),
    e("\u{1F1F3}", "Regional Indicator Symbol Letter N"),
    e("\u{1F1F4}", "Regional Indicator Symbol Letter O"),
    e("\u{1F1F5}", "Regional Indicator Symbol Letter P"),
    e("\u{1F1F6}", "Regional Indicator Symbol Letter Q"),
    e("\u{1F1F7}", "Regional Indicator Symbol Letter R"),
    e("\u{1F1F8}", "Regional Indicator Symbol Letter S"),
    e("\u{1F1F9}", "Regional Indicator Symbol Letter T"),
    e("\u{1F1FA}", "Regional Indicator Symbol Letter U"),
    e("\u{1F1FB}", "Regional Indicator Symbol Letter V"),
    e("\u{1F1FC}", "Regional Indicator Symbol Letter W"),
    e("\u{1F1FD}", "Regional Indicator Symbol Letter X"),
    e("\u{1F1FE}", "Regional Indicator Symbol Letter Y"),
    e("\u{1F1FF}", "Regional Indicator Symbol Letter Z"));

const japanese = g(
    "Japanese", "Japanse symbology",
    e("\u{1F530}", "Japanese Symbol for Beginner"),
    e("\u{1F201}", "Japanese “Here” Button"),
    e("\u{1F202}\u{FE0F}", "Japanese “Service Charge” Button"),
    e("\u{1F21A}", "Japanese “Free of Charge” Button"),
    e("\u{1F22F}", "Japanese “Reserved” Button"),
    e("\u{1F232}", "Japanese “Prohibited” Button"),
    e("\u{1F233}", "Japanese “Vacancy” Button"),
    e("\u{1F234}", "Japanese “Passing Grade” Button"),
    e("\u{1F235}", "Japanese “No Vacancy” Button"),
    e("\u{1F236}", "Japanese “Not Free of Charge” Button"),
    e("\u{1F237}\u{FE0F}", "Japanese “Monthly Amount” Button"),
    e("\u{1F238}", "Japanese “Application” Button"),
    e("\u{1F239}", "Japanese “Discount” Button"),
    e("\u{1F23A}", "Japanese “Open for Business” Button"),
    e("\u{1F250}", "Japanese “Bargain” Button"),
    e("\u{1F251}", "Japanese “Acceptable” Button"),
    e("\u{3297}\u{FE0F}", "Japanese “Congratulations” Button"),
    e("\u{3299}\u{FE0F}", "Japanese “Secret” Button"));

const clocks = g(
    "Clocks", "Time-keeping pieces",
    e("\u{1F550}", "One O’Clock"),
    e("\u{1F551}", "Two O’Clock"),
    e("\u{1F552}", "Three O’Clock"),
    e("\u{1F553}", "Four O’Clock"),
    e("\u{1F554}", "Five O’Clock"),
    e("\u{1F555}", "Six O’Clock"),
    e("\u{1F556}", "Seven O’Clock"),
    e("\u{1F557}", "Eight O’Clock"),
    e("\u{1F558}", "Nine O’Clock"),
    e("\u{1F559}", "Ten O’Clock"),
    e("\u{1F55A}", "Eleven O’Clock"),
    e("\u{1F55B}", "Twelve O’Clock"),
    e("\u{1F55C}", "One-Thirty"),
    e("\u{1F55D}", "Two-Thirty"),
    e("\u{1F55E}", "Three-Thirty"),
    e("\u{1F55F}", "Four-Thirty"),
    e("\u{1F560}", "Five-Thirty"),
    e("\u{1F561}", "Six-Thirty"),
    e("\u{1F562}", "Seven-Thirty"),
    e("\u{1F563}", "Eight-Thirty"),
    e("\u{1F564}", "Nine-Thirty"),
    e("\u{1F565}", "Ten-Thirty"),
    e("\u{1F566}", "Eleven-Thirty"),
    e("\u{1F567}", "Twelve-Thirty"),
    e("\u{1F570}\u{FE0F}", "Mantelpiece Clock"),
    e("\u{231A}", "Watch"),
    e("\u{23F0}", "Alarm Clock"),
    e("\u{23F1}\u{FE0F}", "Stopwatch"),
    e("\u{23F2}\u{FE0F}", "Timer Clock"),
    e("\u{231B}", "Hourglass Done"),
    e("\u{23F3}", "Hourglass Not Done"));

const downRightArrow = e("\u{2198}", "Down-Right Arrow");
const downRightArrowText = e("\u{2198}\u{FE0E}", "Down-Right Arrow");
const downRightArrowEmoji = e("\u{2198}\u{FE0F}", "Down-Right Arrow");
const arrows = g(
    "Arrows", "Arrows pointing in different directions",
    e("\u{1F503}\u{FE0F}", "Clockwise Vertical Arrows"),
    e("\u{1F504}\u{FE0F}", "Counterclockwise Arrows Button"),
    e("\u{2194}\u{FE0F}", "Left-Right Arrow"),
    e("\u{2195}\u{FE0F}", "Up-Down Arrow"),
    e("\u{2196}\u{FE0F}", "Up-Left Arrow"),
    e("\u{2197}\u{FE0F}", "Up-Right Arrow"),
    downRightArrowEmoji,
    e("\u{2199}\u{FE0F}", "Down-Left Arrow"),
    e("\u{21A9}\u{FE0F}", "Right Arrow Curving Left"),
    e("\u{21AA}\u{FE0F}", "Left Arrow Curving Right"),
    e("\u{27A1}\u{FE0F}", "Right Arrow"),
    e("\u{2934}\u{FE0F}", "Right Arrow Curving Up"),
    e("\u{2935}\u{FE0F}", "Right Arrow Curving Down"),
    e("\u{2B05}\u{FE0F}", "Left Arrow"),
    e("\u{2B06}\u{FE0F}", "Up Arrow"),
    e("\u{2B07}\u{FE0F}", "Down Arrow"));

const shapes = g(
    "Shapes", "Colored shapes",
    e("\u{1F534}", "Red Circle"),
    e("\u{1F535}", "Blue Circle"),
    e("\u{1F536}", "Large Orange Diamond"),
    e("\u{1F537}", "Large Blue Diamond"),
    e("\u{1F538}", "Small Orange Diamond"),
    e("\u{1F539}", "Small Blue Diamond"),
    e("\u{1F53A}", "Red Triangle Pointed Up"),
    e("\u{1F53B}", "Red Triangle Pointed Down"),
    e("\u{1F7E0}", "Orange Circle"),
    e("\u{1F7E1}", "Yellow Circle"),
    e("\u{1F7E2}", "Green Circle"),
    e("\u{1F7E3}", "Purple Circle"),
    e("\u{1F7E4}", "Brown Circle"),
    e("\u{2B55}", "Hollow Red Circle"),
    e("\u{26AA}", "White Circle"),
    e("\u{26AB}", "Black Circle"),
    e("\u{1F7E5}", "Red Square"),
    e("\u{1F7E6}", "Blue Square"),
    e("\u{1F7E7}", "Orange Square"),
    e("\u{1F7E8}", "Yellow Square"),
    e("\u{1F7E9}", "Green Square"),
    e("\u{1F7EA}", "Purple Square"),
    e("\u{1F7EB}", "Brown Square"),
    e("\u{1F532}", "Black Square Button"),
    e("\u{1F533}", "White Square Button"),
    e("\u{25AA}\u{FE0F}", "Black Small Square"),
    e("\u{25AB}\u{FE0F}", "White Small Square"),
    e("\u{25FD}", "White Medium-Small Square"),
    e("\u{25FE}", "Black Medium-Small Square"),
    e("\u{25FB}\u{FE0F}", "White Medium Square"),
    e("\u{25FC}\u{FE0F}", "Black Medium Square"),
    e("\u{2B1B}", "Black Large Square"),
    e("\u{2B1C}", "White Large Square"),
    e("\u{2B50}", "Star"),
    e("\u{1F4A0}", "Diamond with a Dot"));

const shuffleTracksButton = e("\u{1F500}", "Shuffle Tracks Button");
const repeatButton = e("\u{1F501}", "Repeat Button");
const repeatSingleButton = e("\u{1F502}", "Repeat Single Button");
const upwardsButton = e("\u{1F53C}", "Upwards Button");
const downwardsButton = e("\u{1F53D}", "Downwards Button");
const playButton = e("\u{25B6}\u{FE0F}", "Play Button");
const reverseButton = e("\u{25C0}\u{FE0F}", "Reverse Button");
const ejectButton = e("\u{23CF}\u{FE0F}", "Eject Button");
const fastForwardButton = e("\u{23E9}", "Fast-Forward Button");
const fastReverseButton = e("\u{23EA}", "Fast Reverse Button");
const fastUpButton = e("\u{23EB}", "Fast Up Button");
const fastDownButton = e("\u{23EC}", "Fast Down Button");
const nextTrackButton = e("\u{23ED}\u{FE0F}", "Next Track Button");
const lastTrackButton = e("\u{23EE}\u{FE0F}", "Last Track Button");
const playOrPauseButton = e("\u{23EF}\u{FE0F}", "Play or Pause Button");
const pauseButton = e("\u{23F8}\u{FE0F}", "Pause Button");
const stopButton = e("\u{23F9}\u{FE0F}", "Stop Button");
const recordButton = e("\u{23FA}\u{FE0F}", "Record Button");


const buttons = g(
    "Buttons", "Buttons",
    e("\u{1F191}", "CL Button"),
    e("\u{1F192}", "Cool Button"),
    e("\u{1F193}", "Free Button"),
    e("\u{1F194}", "ID Button"),
    e("\u{1F195}", "New Button"),
    e("\u{1F196}", "NG Button"),
    e("\u{1F197}", "OK Button"),
    e("\u{1F198}", "SOS Button"),
    e("\u{1F199}", "Up! Button"),
    e("\u{1F19A}", "Vs Button"),
    e("\u{1F518}", "Radio Button"),
    e("\u{1F519}", "Back Arrow"),
    e("\u{1F51A}", "End Arrow"),
    e("\u{1F51B}", "On! Arrow"),
    e("\u{1F51C}", "Soon Arrow"),
    e("\u{1F51D}", "Top Arrow"),
    e("\u{2611}\u{FE0F}", "Check Box with Check"),
    e("\u{1F520}", "Input Latin Uppercase"),
    e("\u{1F521}", "Input Latin Lowercase"),
    e("\u{1F522}", "Input Numbers"),
    e("\u{1F523}", "Input Symbols"),
    e("\u{1F524}", "Input Latin Letters"),
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
    recordButton);

const zodiac = g(
    "Zodiac", "The symbology of astrology",
    e("\u{2648}", "Aries"),
    e("\u{2649}", "Taurus"),
    e("\u{264A}", "Gemini"),
    e("\u{264B}", "Cancer"),
    e("\u{264C}", "Leo"),
    e("\u{264D}", "Virgo"),
    e("\u{264E}", "Libra"),
    e("\u{264F}", "Scorpio"),
    e("\u{2650}", "Sagittarius"),
    e("\u{2651}", "Capricorn"),
    e("\u{2652}", "Aquarius"),
    e("\u{2653}", "Pisces"),
    e("\u{26CE}", "Ophiuchus"));

const numbers = g(
    "Numbers", "Numbers",
    e("\u{30}\u{FE0F}", "Digit Zero"),
    e("\u{31}\u{FE0F}", "Digit One"),
    e("\u{32}\u{FE0F}", "Digit Two"),
    e("\u{33}\u{FE0F}", "Digit Three"),
    e("\u{34}\u{FE0F}", "Digit Four"),
    e("\u{35}\u{FE0F}", "Digit Five"),
    e("\u{36}\u{FE0F}", "Digit Six"),
    e("\u{37}\u{FE0F}", "Digit Seven"),
    e("\u{38}\u{FE0F}", "Digit Eight"),
    e("\u{39}\u{FE0F}", "Digit Nine"),
    e("\u{2A}\u{FE0F}", "Asterisk"),
    e("\u{23}\u{FE0F}", "Number Sign"),
    e("\u{30}\u{FE0F}\u{20E3}", "Keycap Digit Zero"),
    e("\u{31}\u{FE0F}\u{20E3}", "Keycap Digit One"),
    e("\u{32}\u{FE0F}\u{20E3}", "Keycap Digit Two"),
    e("\u{33}\u{FE0F}\u{20E3}", "Keycap Digit Three"),
    e("\u{34}\u{FE0F}\u{20E3}", "Keycap Digit Four"),
    e("\u{35}\u{FE0F}\u{20E3}", "Keycap Digit Five"),
    e("\u{36}\u{FE0F}\u{20E3}", "Keycap Digit Six"),
    e("\u{37}\u{FE0F}\u{20E3}", "Keycap Digit Seven"),
    e("\u{38}\u{FE0F}\u{20E3}", "Keycap Digit Eight"),
    e("\u{39}\u{FE0F}\u{20E3}", "Keycap Digit Nine"),
    e("\u{2A}\u{FE0F}\u{20E3}", "Keycap Asterisk"),
    e("\u{23}\u{FE0F}\u{20E3}", "Keycap Number Sign"),
    e("\u{1F51F}", "Keycap: 10"));

const tags = g(
    "Tags", "Tags",
    e("\u{E0020}", "Tag Space"),
    e("\u{E0021}", "Tag Exclamation Mark"),
    e("\u{E0022}", "Tag Quotation Mark"),
    e("\u{E0023}", "Tag Number Sign"),
    e("\u{E0024}", "Tag Dollar Sign"),
    e("\u{E0025}", "Tag Percent Sign"),
    e("\u{E0026}", "Tag Ampersand"),
    e("\u{E0027}", "Tag Apostrophe"),
    e("\u{E0028}", "Tag Left Parenthesis"),
    e("\u{E0029}", "Tag Right Parenthesis"),
    e("\u{E002A}", "Tag Asterisk"),
    e("\u{E002B}", "Tag Plus Sign"),
    e("\u{E002C}", "Tag Comma"),
    e("\u{E002D}", "Tag Hyphen-Minus"),
    e("\u{E002E}", "Tag Full Stop"),
    e("\u{E002F}", "Tag Solidus"),
    e("\u{E0030}", "Tag Digit Zero"),
    e("\u{E0031}", "Tag Digit One"),
    e("\u{E0032}", "Tag Digit Two"),
    e("\u{E0033}", "Tag Digit Three"),
    e("\u{E0034}", "Tag Digit Four"),
    e("\u{E0035}", "Tag Digit Five"),
    e("\u{E0036}", "Tag Digit Six"),
    e("\u{E0037}", "Tag Digit Seven"),
    e("\u{E0038}", "Tag Digit Eight"),
    e("\u{E0039}", "Tag Digit Nine"),
    e("\u{E003A}", "Tag Colon"),
    e("\u{E003B}", "Tag Semicolon"),
    e("\u{E003C}", "Tag Less-Than Sign"),
    e("\u{E003D}", "Tag Equals Sign"),
    e("\u{E003E}", "Tag Greater-Than Sign"),
    e("\u{E003F}", "Tag Question Mark"),
    e("\u{E0040}", "Tag Commercial at"),
    e("\u{E0041}", "Tag Latin Capital Letter a"),
    e("\u{E0042}", "Tag Latin Capital Letter B"),
    e("\u{E0043}", "Tag Latin Capital Letter C"),
    e("\u{E0044}", "Tag Latin Capital Letter D"),
    e("\u{E0045}", "Tag Latin Capital Letter E"),
    e("\u{E0046}", "Tag Latin Capital Letter F"),
    e("\u{E0047}", "Tag Latin Capital Letter G"),
    e("\u{E0048}", "Tag Latin Capital Letter H"),
    e("\u{E0049}", "Tag Latin Capital Letter I"),
    e("\u{E004A}", "Tag Latin Capital Letter J"),
    e("\u{E004B}", "Tag Latin Capital Letter K"),
    e("\u{E004C}", "Tag Latin Capital Letter L"),
    e("\u{E004D}", "Tag Latin Capital Letter M"),
    e("\u{E004E}", "Tag Latin Capital Letter N"),
    e("\u{E004F}", "Tag Latin Capital Letter O"),
    e("\u{E0050}", "Tag Latin Capital Letter P"),
    e("\u{E0051}", "Tag Latin Capital Letter Q"),
    e("\u{E0052}", "Tag Latin Capital Letter R"),
    e("\u{E0053}", "Tag Latin Capital Letter S"),
    e("\u{E0054}", "Tag Latin Capital Letter T"),
    e("\u{E0055}", "Tag Latin Capital Letter U"),
    e("\u{E0056}", "Tag Latin Capital Letter V"),
    e("\u{E0057}", "Tag Latin Capital Letter W"),
    e("\u{E0058}", "Tag Latin Capital Letter X"),
    e("\u{E0059}", "Tag Latin Capital Letter Y"),
    e("\u{E005A}", "Tag Latin Capital Letter Z"),
    e("\u{E005B}", "Tag Left Square Bracket"),
    e("\u{E005C}", "Tag Reverse Solidus"),
    e("\u{E005D}", "Tag Right Square Bracket"),
    e("\u{E005E}", "Tag Circumflex Accent"),
    e("\u{E005F}", "Tag Low Line"),
    e("\u{E0060}", "Tag Grave Accent"),
    e("\u{E0061}", "Tag Latin Small Letter a"),
    e("\u{E0062}", "Tag Latin Small Letter B"),
    e("\u{E0063}", "Tag Latin Small Letter C"),
    e("\u{E0064}", "Tag Latin Small Letter D"),
    e("\u{E0065}", "Tag Latin Small Letter E"),
    e("\u{E0066}", "Tag Latin Small Letter F"),
    e("\u{E0067}", "Tag Latin Small Letter G"),
    e("\u{E0068}", "Tag Latin Small Letter H"),
    e("\u{E0069}", "Tag Latin Small Letter I"),
    e("\u{E006A}", "Tag Latin Small Letter J"),
    e("\u{E006B}", "Tag Latin Small Letter K"),
    e("\u{E006C}", "Tag Latin Small Letter L"),
    e("\u{E006D}", "Tag Latin Small Letter M"),
    e("\u{E006E}", "Tag Latin Small Letter N"),
    e("\u{E006F}", "Tag Latin Small Letter O"),
    e("\u{E0070}", "Tag Latin Small Letter P"),
    e("\u{E0071}", "Tag Latin Small Letter Q"),
    e("\u{E0072}", "Tag Latin Small Letter R"),
    e("\u{E0073}", "Tag Latin Small Letter S"),
    e("\u{E0074}", "Tag Latin Small Letter T"),
    e("\u{E0075}", "Tag Latin Small Letter U"),
    e("\u{E0076}", "Tag Latin Small Letter V"),
    e("\u{E0077}", "Tag Latin Small Letter W"),
    e("\u{E0078}", "Tag Latin Small Letter X"),
    e("\u{E0079}", "Tag Latin Small Letter Y"),
    e("\u{E007A}", "Tag Latin Small Letter Z"),
    e("\u{E007B}", "Tag Left Curly Bracket"),
    e("\u{E007C}", "Tag Vertical Line"),
    e("\u{E007D}", "Tag Right Curly Bracket"),
    e("\u{E007E}", "Tag Tilde"),
    e("\u{E007F}", "Cancel Tag"));

const math = g(
    "Math", "Math",
    e("\u{2716}\u{FE0F}", "Multiply"),
    e("\u{2795}", "Plus"),
    e("\u{2796}", "Minus"),
    e("\u{2797}", "Divide"));

const games = g(
    "Games", "Games",
    e("\u{2660}\u{FE0F}", "Spade Suit"),
    e("\u{2663}\u{FE0F}", "Club Suit"),
    e("\u{2665}\u{FE0F}", "Heart Suit", { color: "red" }),
    e("\u{2666}\u{FE0F}", "Diamond Suit", { color: "red" }),
    e("\u{1F004}", "Mahjong Red Dragon"),
    e("\u{1F0CF}", "Joker"),
    e("\u{1F3AF}", "Direct Hit"),
    e("\u{1F3B0}", "Slot Machine"),
    e("\u{1F3B1}", "Pool 8 Ball"),
    e("\u{1F3B2}", "Game Die"),
    e("\u{1F3B3}", "Bowling"),
    e("\u{1F3B4}", "Flower Playing Cards"),
    e("\u{1F9E9}", "Puzzle Piece"),
    e("\u{265F}\u{FE0F}", "Chess Pawn"),
    e("\u{1FA80}", "Yo-Yo"),
    e("\u{1FA81}", "Kite"),
    e("\u{1FA83}", "Boomerang"),
    e("\u{1FA86}", "Nesting Dolls"));

const sportsEquipment = g(
    "Sports Equipment", "Sports equipment",
    e("\u{1F3BD}", "Running Shirt"),
    e("\u{1F3BE}", "Tennis"),
    e("\u{1F3BF}", "Skis"),
    e("\u{1F3C0}", "Basketball"),
    e("\u{1F3C5}", "Sports Medal"),
    e("\u{1F3C6}", "Trophy"),
    e("\u{1F3C8}", "American Football"),
    e("\u{1F3C9}", "Rugby Football"),
    e("\u{1F3CF}", "Cricket Game"),
    e("\u{1F3D0}", "Volleyball"),
    e("\u{1F3D1}", "Field Hockey"),
    e("\u{1F3D2}", "Ice Hockey"),
    e("\u{1F3D3}", "Ping Pong"),
    e("\u{1F3F8}", "Badminton"),
    e("\u{1F6F7}", "Sled"),
    e("\u{1F945}", "Goal Net"),
    e("\u{1F947}", "1st Place Medal"),
    e("\u{1F948}", "2nd Place Medal"),
    e("\u{1F949}", "3rd Place Medal"),
    e("\u{1F94A}", "Boxing Glove"),
    e("\u{1F94C}", "Curling Stone"),
    e("\u{1F94D}", "Lacrosse"),
    e("\u{1F94E}", "Softball"),
    e("\u{1F94F}", "Flying Disc"),
    e("\u{26BD}", "Soccer Ball"),
    e("\u{26BE}", "Baseball"),
    e("\u{26F8}\u{FE0F}", "Ice Skate"));

const clothing = g(
    "Clothing", "Clothing",
    e("\u{1F3A9}", "Top Hat"),
    e("\u{1F93F}", "Diving Mask"),
    e("\u{1F452}", "Woman’s Hat"),
    e("\u{1F453}", "Glasses"),
    e("\u{1F576}\u{FE0F}", "Sunglasses"),
    e("\u{1F454}", "Necktie"),
    e("\u{1F455}", "T-Shirt"),
    e("\u{1F456}", "Jeans"),
    e("\u{1F457}", "Dress"),
    e("\u{1F458}", "Kimono"),
    e("\u{1F459}", "Bikini"),
    e("\u{1F45A}", "Woman’s Clothes"),
    e("\u{1F45B}", "Purse"),
    e("\u{1F45C}", "Handbag"),
    e("\u{1F45D}", "Clutch Bag"),
    e("\u{1F45E}", "Man’s Shoe"),
    e("\u{1F45F}", "Running Shoe"),
    e("\u{1F460}", "High-Heeled Shoe"),
    e("\u{1F461}", "Woman’s Sandal"),
    e("\u{1F462}", "Woman’s Boot"),
    e("\u{1F94B}", "Martial Arts Uniform"),
    e("\u{1F97B}", "Sari"),
    e("\u{1F97C}", "Lab Coat"),
    e("\u{1F97D}", "Goggles"),
    e("\u{1F97E}", "Hiking Boot"),
    e("\u{1F97F}", "Flat Shoe"),
    whiteCane,
    e("\u{1F9BA}", "Safety Vest"),
    e("\u{1F9E2}", "Billed Cap"),
    e("\u{1F9E3}", "Scarf"),
    e("\u{1F9E4}", "Gloves"),
    e("\u{1F9E5}", "Coat"),
    e("\u{1F9E6}", "Socks"),
    e("\u{1F9FF}", "Nazar Amulet"),
    e("\u{1FA70}", "Ballet Shoes"),
    e("\u{1FA71}", "One-Piece Swimsuit"),
    e("\u{1FA72}", "Briefs"),
    e("\u{1FA73}", "Shorts"),
    e("\u{1FA74}", "Thong Sandal"));

const town = g(
    "Town", "Town",
    e("\u{1F3D7}\u{FE0F}", "Building Construction"),
    e("\u{1F3D8}\u{FE0F}", "Houses"),
    e("\u{1F3D9}\u{FE0F}", "Cityscape"),
    e("\u{1F3DA}\u{FE0F}", "Derelict House"),
    e("\u{1F3DB}\u{FE0F}", "Classical Building"),
    e("\u{1F3DC}\u{FE0F}", "Desert"),
    e("\u{1F3DD}\u{FE0F}", "Desert Island"),
    e("\u{1F3DE}\u{FE0F}", "National Park"),
    e("\u{1F3DF}\u{FE0F}", "Stadium"),
    e("\u{1F3E0}", "House"),
    e("\u{1F3E1}", "House with Garden"),
    e("\u{1F3E2}", "Office Building"),
    e("\u{1F3E3}", "Japanese Post Office"),
    e("\u{1F3E4}", "Post Office"),
    e("\u{1F3E5}", "Hospital"),
    e("\u{1F3E6}", "Bank"),
    e("\u{1F3E7}", "ATM Sign"),
    e("\u{1F3E8}", "Hotel"),
    e("\u{1F3E9}", "Love Hotel"),
    e("\u{1F3EA}", "Convenience Store"),
    school,
    e("\u{1F3EC}", "Department Store"),
    factory,
    e("\u{1F309}", "Bridge at Night"),
    e("\u{26F2}", "Fountain"),
    e("\u{1F6CD}\u{FE0F}", "Shopping Bags"),
    e("\u{1F9FE}", "Receipt"),
    e("\u{1F6D2}", "Shopping Cart"),
    e("\u{1F488}", "Barber Pole"),
    e("\u{1F492}", "Wedding"),
    e("\u{1F6D6}", "Hut"),
    e("\u{1F6D7}", "Elevator"),
    e("\u{1F5F3}\u{FE0F}", "Ballot Box with Ballot"));

const music = g(
    "Music", "Music",
    e("\u{1F3BC}", "Musical Score"),
    e("\u{1F3B6}", "Musical Notes"),
    e("\u{1F3B5}", "Musical Note"),
    e("\u{1F3B7}", "Saxophone"),
    e("\u{1F3B8}", "Guitar"),
    e("\u{1F3B9}", "Musical Keyboard"),
    e("\u{1F3BA}", "Trumpet"),
    e("\u{1F3BB}", "Violin"),
    e("\u{1F941}", "Drum"),
    e("\u{1FA95}", "Banjo"),
    e("\u{1FA97}", "Accordion"),
    e("\u{1FA98}", "Long Drum"));

const weather = g(
    "Weather", "Weather",
    e("\u{1F304}", "Sunrise Over Mountains"),
    e("\u{1F305}", "Sunrise"),
    e("\u{1F306}", "Cityscape at Dusk"),
    e("\u{1F307}", "Sunset"),
    e("\u{1F303}", "Night with Stars"),
    e("\u{1F302}", "Closed Umbrella"),
    e("\u{2602}\u{FE0F}", "Umbrella"),
    e("\u{2614}\u{FE0F}", "Umbrella with Rain Drops"),
    e("\u{2603}\u{FE0F}", "Snowman"),
    e("\u{26C4}", "Snowman Without Snow"),
    e("\u{2600}\u{FE0F}", "Sun"),
    e("\u{2601}\u{FE0F}", "Cloud"),
    e("\u{1F324}\u{FE0F}", "Sun Behind Small Cloud"),
    e("\u{26C5}", "Sun Behind Cloud"),
    e("\u{1F325}\u{FE0F}", "Sun Behind Large Cloud"),
    e("\u{1F326}\u{FE0F}", "Sun Behind Rain Cloud"),
    e("\u{1F327}\u{FE0F}", "Cloud with Rain"),
    e("\u{1F328}\u{FE0F}", "Cloud with Snow"),
    e("\u{1F329}\u{FE0F}", "Cloud with Lightning"),
    e("\u{26C8}\u{FE0F}", "Cloud with Lightning and Rain"),
    e("\u{2744}\u{FE0F}", "Snowflake"),
    e("\u{1F300}", "Cyclone"),
    e("\u{1F32A}\u{FE0F}", "Tornado"),
    e("\u{1F32C}\u{FE0F}", "Wind Face"),
    e("\u{1F30A}", "Water Wave"),
    e("\u{1F32B}\u{FE0F}", "Fog"),
    e("\u{1F301}", "Foggy"),
    e("\u{1F308}", "Rainbow"),
    e("\u{1F321}\u{FE0F}", "Thermometer"));

const astro = g(
    "Astronomy", "Astronomy",
    e("\u{1F30C}", "Milky Way"),
    e("\u{1F30D}", "Globe Showing Europe-Africa"),
    e("\u{1F30E}", "Globe Showing Americas"),
    e("\u{1F30F}", "Globe Showing Asia-Australia"),
    e("\u{1F310}", "Globe with Meridians"),
    e("\u{1F311}", "New Moon"),
    e("\u{1F312}", "Waxing Crescent Moon"),
    e("\u{1F313}", "First Quarter Moon"),
    e("\u{1F314}", "Waxing Gibbous Moon"),
    e("\u{1F315}", "Full Moon"),
    e("\u{1F316}", "Waning Gibbous Moon"),
    e("\u{1F317}", "Last Quarter Moon"),
    e("\u{1F318}", "Waning Crescent Moon"),
    e("\u{1F319}", "Crescent Moon"),
    e("\u{1F31A}", "New Moon Face"),
    e("\u{1F31B}", "First Quarter Moon Face"),
    e("\u{1F31C}", "Last Quarter Moon Face"),
    e("\u{1F31D}", "Full Moon Face"),
    e("\u{1F31E}", "Sun with Face"),
    e("\u{1F31F}", "Glowing Star"),
    e("\u{1F320}", "Shooting Star"),
    e("\u{2604}\u{FE0F}", "Comet"),
    e("\u{1FA90}", "Ringed Planet"));

const finance = g(
    "Finance", "Finance",
    e("\u{1F4B0}", "Money Bag"),
    e("\u{1F4B1}", "Currency Exchange"),
    e("\u{1F4B2}", "Heavy Dollar Sign"),
    e("\u{1F4B3}", "Credit Card"),
    e("\u{1F4B4}", "Yen Banknote"),
    e("\u{1F4B5}", "Dollar Banknote"),
    e("\u{1F4B6}", "Euro Banknote"),
    e("\u{1F4B7}", "Pound Banknote"),
    e("\u{1F4B8}", "Money with Wings"),
    e("\u{1F4B9}", "Chart Increasing with Yen"),
    e("\u{1FA99}", "Coin"));

const writing = g(
    "Writing", "Writing",
    e("\u{1F58A}\u{FE0F}", "Pen"),
    e("\u{1F58B}\u{FE0F}", "Fountain Pen"),
    e("\u{1F58C}\u{FE0F}", "Paintbrush"),
    e("\u{1F58D}\u{FE0F}", "Crayon"),
    e("\u{270F}\u{FE0F}", "Pencil"),
    e("\u{2712}\u{FE0F}", "Black Nib"));

const droplet = e("\u{1F4A7}", "Droplet");
const dropOfBlood = e("\u{1FA78}", "Drop of Blood");
const adhesiveBandage = e("\u{1FA79}", "Adhesive Bandage");
const stehoscope = e("\u{1FA7A}", "Stethoscope");
const syringe = e("\u{1F489}", "Syringe");
const pill = e("\u{1F48A}", "Pill");
const testTube = e("\u{1F9EA}", "Test Tube");
const petriDish = e("\u{1F9EB}", "Petri Dish");
const dna = e("\u{1F9EC}", "DNA");
const abacus = e("\u{1F9EE}", "Abacus");
const magnet = e("\u{1F9F2}", "Magnet");
const telescope = e("\u{1F52D}", "Telescope");
const alembic = e("\u{2697}\u{FE0F}", "Alembic");
const gear = e("\u{2699}\u{FE0F}", "Gear");
const atomSymbol = e("\u{269B}\u{FE0F}", "Atom Symbol");
const keyboard = e("\u{2328}\u{FE0F}", "Keyboard");
const telephone = e("\u{260E}\u{FE0F}", "Telephone");
const studioMicrophone = e("\u{1F399}\u{FE0F}", "Studio Microphone");
const levelSlider = e("\u{1F39A}\u{FE0F}", "Level Slider");
const controlKnobs = e("\u{1F39B}\u{FE0F}", "Control Knobs");
const movieCamera = e("\u{1F3A5}", "Movie Camera");
const headphone = e("\u{1F3A7}", "Headphone");
const videoGame = e("\u{1F3AE}", "Video Game");
const lightBulb = e("\u{1F4A1}", "Light Bulb");
const computerDisk = e("\u{1F4BD}", "Computer Disk");
const floppyDisk = e("\u{1F4BE}", "Floppy Disk");
const opticalDisk = e("\u{1F4BF}", "Optical Disk");
const dvd = e("\u{1F4C0}", "DVD");
const telephoneReceiver = e("\u{1F4DE}", "Telephone Receiver");
const pager = e("\u{1F4DF}", "Pager");
const faxMachine = e("\u{1F4E0}", "Fax Machine");
const satelliteAntenna = e("\u{1F4E1}", "Satellite Antenna");
const loudspeaker = e("\u{1F4E2}", "Loudspeaker");
const megaphone = e("\u{1F4E3}", "Megaphone");
const mobilePhone = e("\u{1F4F1}", "Mobile Phone");
const mobilePhoneWithArrow = e("\u{1F4F2}", "Mobile Phone with Arrow");
const mobilePhoneVibrating = e("\u{1F4F3}", "Mobile Phone Vibrating");
const mobilePhoneOff = e("\u{1F4F4}", "Mobile Phone Off");
const noMobilePhone = e("\u{1F4F5}", "No Mobile Phone");
const antennaBars = e("\u{1F4F6}", "Antenna Bars");
const camera = e("\u{1F4F7}", "Camera");
const cameraWithFlash = e("\u{1F4F8}", "Camera with Flash");
const videoCamera = e("\u{1F4F9}", "Video Camera");
const television = e("\u{1F4FA}", "Television");
const radio = e("\u{1F4FB}", "Radio");
const videocassette = e("\u{1F4FC}", "Videocassette");
const filmProjector = e("\u{1F4FD}\u{FE0F}", "Film Projector");
const portableStereo = e("\u{1F4FE}\u{FE0F}", "Portable Stereo");
const dimButton = e("\u{1F505}", "Dim Button");
const brightButton = e("\u{1F506}", "Bright Button");
const mutedSpeaker = e("\u{1F507}", "Muted Speaker");
const speakerLowVolume = e("\u{1F508}", "Speaker Low Volume");
const speakerMediumVolume = e("\u{1F509}", "Speaker Medium Volume");
const speakerHighVolume = e("\u{1F50A}", "Speaker High Volume");
const battery = e("\u{1F50B}", "Battery");
const electricPlug = e("\u{1F50C}", "Electric Plug");
const magnifyingGlassTiltedLeft = e("\u{1F50D}", "Magnifying Glass Tilted Left");
const magnifyingGlassTiltedRight = e("\u{1F50E}", "Magnifying Glass Tilted Right");
const lockedWithPen = e("\u{1F50F}", "Locked with Pen");
const lockedWithKey = e("\u{1F510}", "Locked with Key");
const key = e("\u{1F511}", "Key");
const locked = e("\u{1F512}", "Locked");
const unlocked = e("\u{1F513}", "Unlocked");
const bell = e("\u{1F514}", "Bell");
const bellWithSlash = e("\u{1F515}", "Bell with Slash");
const bookmark = e("\u{1F516}", "Bookmark");
const link = e("\u{1F517}", "Link");
const joystick = e("\u{1F579}\u{FE0F}", "Joystick");
const desktopComputer = e("\u{1F5A5}\u{FE0F}", "Desktop Computer");
const printer = e("\u{1F5A8}\u{FE0F}", "Printer");
const computerMouse = e("\u{1F5B1}\u{FE0F}", "Computer Mouse");
const trackball = e("\u{1F5B2}\u{FE0F}", "Trackball");
const blackFolder = e("\u{1F5BF}", "Black Folder");
const folder = e("\u{1F5C0}", "Folder");
const openFolder = e("\u{1F5C1}", "Open Folder");
const cardIndexDividers = e("\u{1F5C2}", "Card Index Dividers");
const cardFileBox = e("\u{1F5C3}", "Card File Box");
const fileCabinet = e("\u{1F5C4}", "File Cabinet");
const emptyNote = e("\u{1F5C5}", "Empty Note");
const emptyNotePage = e("\u{1F5C6}", "Empty Note Page");
const emptyNotePad = e("\u{1F5C7}", "Empty Note Pad");
const note = e("\u{1F5C8}", "Note");
const notePage = e("\u{1F5C9}", "Note Page");
const notePad = e("\u{1F5CA}", "Note Pad");
const emptyDocument = e("\u{1F5CB}", "Empty Document");
const emptyPage = e("\u{1F5CC}", "Empty Page");
const emptyPages = e("\u{1F5CD}", "Empty Pages");
const document$1 = e("\u{1F5CE}", "Document");
const page = e("\u{1F5CF}", "Page");
const pages = e("\u{1F5D0}", "Pages");
const wastebasket = e("\u{1F5D1}", "Wastebasket");
const spiralNotePad = e("\u{1F5D2}", "Spiral Note Pad");
const spiralCalendar = e("\u{1F5D3}", "Spiral Calendar");
const desktopWindow = e("\u{1F5D4}", "Desktop Window");
const minimize = e("\u{1F5D5}", "Minimize");
const maximize = e("\u{1F5D6}", "Maximize");
const overlap = e("\u{1F5D7}", "Overlap");
const reload = e("\u{1F5D8}", "Reload");
const close = e("\u{1F5D9}", "Close");
const increaseFontSize = e("\u{1F5DA}", "Increase Font Size");
const decreaseFontSize = e("\u{1F5DB}", "Decrease Font Size");
const clamp$1 = e("\u{1F5DC}", "Compression");
const oldKey = e("\u{1F5DD}", "Old Key");
const tech = g(
    "Technology", "Technology",
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
    filmProjector,
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
    mobilePhoneVibrating,
    antennaBars,
    dimButton,
    brightButton,
    mutedSpeaker,
    speakerLowVolume,
    speakerMediumVolume,
    speakerHighVolume,
    battery,
    electricPlug);

const mail = g(
    "Mail", "Mail",
    e("\u{1F4E4}", "Outbox Tray"),
    e("\u{1F4E5}", "Inbox Tray"),
    e("\u{1F4E6}", "Package"),
    e("\u{1F4E7}", "E-Mail"),
    e("\u{1F4E8}", "Incoming Envelope"),
    e("\u{1F4E9}", "Envelope with Arrow"),
    e("\u{1F4EA}", "Closed Mailbox with Lowered Flag"),
    e("\u{1F4EB}", "Closed Mailbox with Raised Flag"),
    e("\u{1F4EC}", "Open Mailbox with Raised Flag"),
    e("\u{1F4ED}", "Open Mailbox with Lowered Flag"),
    e("\u{1F4EE}", "Postbox"),
    e("\u{1F4EF}", "Postal Horn"));

const celebration = g(
    "Celebration", "Celebration",
    e("\u{1FA85}", "Piñata"),
    e("\u{1F380}", "Ribbon"),
    e("\u{1F381}", "Wrapped Gift"),
    e("\u{1F383}", "Jack-O-Lantern"),
    e("\u{1F384}", "Christmas Tree"),
    e("\u{1F9E8}", "Firecracker"),
    e("\u{1F386}", "Fireworks"),
    e("\u{1F387}", "Sparkler"),
    e("\u{2728}", "Sparkles"),
    e("\u{2747}\u{FE0F}", "Sparkle"),
    e("\u{1F388}", "Balloon"),
    e("\u{1F389}", "Party Popper"),
    e("\u{1F38A}", "Confetti Ball"),
    e("\u{1F38B}", "Tanabata Tree"),
    e("\u{1F38D}", "Pine Decoration"),
    e("\u{1F38E}", "Japanese Dolls"),
    e("\u{1F38F}", "Carp Streamer"),
    e("\u{1F390}", "Wind Chime"),
    e("\u{1F391}", "Moon Viewing Ceremony"),
    e("\u{1F392}", "Backpack"),
    graduationCap,
    e("\u{1F9E7}", "Red Envelope"),
    e("\u{1F3EE}", "Red Paper Lantern"),
    e("\u{1F396}\u{FE0F}", "Military Medal"));

const tools = g(
    "Tools", "Tools",
    e("\u{1F3A3}", "Fishing Pole"),
    e("\u{1F526}", "Flashlight"),
    wrench,
    e("\u{1F528}", "Hammer"),
    e("\u{1F529}", "Nut and Bolt"),
    e("\u{1F6E0}\u{FE0F}", "Hammer and Wrench"),
    e("\u{1F9ED}", "Compass"),
    e("\u{1F9EF}", "Fire Extinguisher"),
    e("\u{1F9F0}", "Toolbox"),
    e("\u{1F9F1}", "Brick"),
    e("\u{1FA93}", "Axe"),
    e("\u{2692}\u{FE0F}", "Hammer and Pick"),
    e("\u{26CF}\u{FE0F}", "Pick"),
    e("\u{26D1}\u{FE0F}", "Rescue Worker’s Helmet"),
    e("\u{26D3}\u{FE0F}", "Chains"),
    clamp$1,
    e("\u{1FA9A}", "Carpentry Saw"),
    e("\u{1FA9B}", "Screwdriver"),
    e("\u{1FA9C}", "Ladder"),
    e("\u{1FA9D}", "Hook"));

const office = g(
    "Office", "Office",
    e("\u{1F4C1}", "File Folder"),
    e("\u{1F4C2}", "Open File Folder"),
    e("\u{1F4C3}", "Page with Curl"),
    e("\u{1F4C4}", "Page Facing Up"),
    e("\u{1F4C5}", "Calendar"),
    e("\u{1F4C6}", "Tear-Off Calendar"),
    e("\u{1F4C7}", "Card Index"),
    cardIndexDividers,
    cardFileBox,
    fileCabinet,
    wastebasket,
    spiralNotePad,
    spiralCalendar,
    e("\u{1F4C8}", "Chart Increasing"),
    e("\u{1F4C9}", "Chart Decreasing"),
    e("\u{1F4CA}", "Bar Chart"),
    e("\u{1F4CB}", "Clipboard"),
    e("\u{1F4CC}", "Pushpin"),
    e("\u{1F4CD}", "Round Pushpin"),
    e("\u{1F4CE}", "Paperclip"),
    e("\u{1F587}\u{FE0F}", "Linked Paperclips"),
    e("\u{1F4CF}", "Straight Ruler"),
    e("\u{1F4D0}", "Triangular Ruler"),
    e("\u{1F4D1}", "Bookmark Tabs"),
    e("\u{1F4D2}", "Ledger"),
    e("\u{1F4D3}", "Notebook"),
    e("\u{1F4D4}", "Notebook with Decorative Cover"),
    e("\u{1F4D5}", "Closed Book"),
    e("\u{1F4D6}", "Open Book"),
    e("\u{1F4D7}", "Green Book"),
    e("\u{1F4D8}", "Blue Book"),
    e("\u{1F4D9}", "Orange Book"),
    e("\u{1F4DA}", "Books"),
    e("\u{1F4DB}", "Name Badge"),
    e("\u{1F4DC}", "Scroll"),
    e("\u{1F4DD}", "Memo"),
    e("\u{2702}\u{FE0F}", "Scissors"),
    e("\u{2709}\u{FE0F}", "Envelope"));

const signs = g(
    "Signs", "Signs",
    e("\u{1F3A6}", "Cinema"),
    noMobilePhone,
    e("\u{1F51E}", "No One Under Eighteen"),
    e("\u{1F6AB}", "Prohibited"),
    e("\u{1F6AC}", "Cigarette"),
    e("\u{1F6AD}", "No Smoking"),
    e("\u{1F6AE}", "Litter in Bin Sign"),
    e("\u{1F6AF}", "No Littering"),
    e("\u{1F6B0}", "Potable Water"),
    e("\u{1F6B1}", "Non-Potable Water"),
    e("\u{1F6B3}", "No Bicycles"),
    e("\u{1F6B7}", "No Pedestrians"),
    e("\u{1F6B8}", "Children Crossing"),
    e("\u{1F6B9}", "Men’s Room"),
    e("\u{1F6BA}", "Women’s Room"),
    e("\u{1F6BB}", "Restroom"),
    e("\u{1F6BC}", "Baby Symbol"),
    e("\u{1F6BE}", "Water Closet"),
    e("\u{1F6C2}", "Passport Control"),
    e("\u{1F6C3}", "Customs"),
    e("\u{1F6C4}", "Baggage Claim"),
    e("\u{1F6C5}", "Left Luggage"),
    e("\u{1F17F}\u{FE0F}", "Parking Button"),
    e("\u{267F}", "Wheelchair Symbol"),
    e("\u{2622}\u{FE0F}", "Radioactive"),
    e("\u{2623}\u{FE0F}", "Biohazard"),
    e("\u{26A0}\u{FE0F}", "Warning"),
    e("\u{26A1}", "High Voltage"),
    e("\u{26D4}", "No Entry"),
    e("\u{267B}\u{FE0F}", "Recycling Symbol"),
    female,
    male,
    e("\u{26A7}\u{FE0F}", "Transgender Symbol"));

const religion = g(
    "Religion", "Religion",
    e("\u{1F52F}", "Dotted Six-Pointed Star"),
    e("\u{2721}\u{FE0F}", "Star of David"),
    e("\u{1F549}\u{FE0F}", "Om"),
    e("\u{1F54B}", "Kaaba"),
    e("\u{1F54C}", "Mosque"),
    e("\u{1F54D}", "Synagogue"),
    e("\u{1F54E}", "Menorah"),
    e("\u{1F6D0}", "Place of Worship"),
    e("\u{1F6D5}", "Hindu Temple"),
    e("\u{2626}\u{FE0F}", "Orthodox Cross"),
    e("\u{271D}\u{FE0F}", "Latin Cross"),
    e("\u{262A}\u{FE0F}", "Star and Crescent"),
    e("\u{262E}\u{FE0F}", "Peace Symbol"),
    e("\u{262F}\u{FE0F}", "Yin Yang"),
    e("\u{2638}\u{FE0F}", "Wheel of Dharma"),
    e("\u{267E}\u{FE0F}", "Infinity"),
    e("\u{1FA94}", "Diya Lamp"),
    e("\u{26E9}\u{FE0F}", "Shinto Shrine"),
    e("\u{26EA}", "Church"),
    e("\u{2734}\u{FE0F}", "Eight-Pointed Star"),
    e("\u{1F4FF}", "Prayer Beads"));

const door = e("\u{1F6AA}", "Door");
const household = g(
    "Household", "Household",
    e("\u{1F484}", "Lipstick"),
    e("\u{1F48D}", "Ring"),
    e("\u{1F48E}", "Gem Stone"),
    e("\u{1F4F0}", "Newspaper"),
    key,
    e("\u{1F525}", "Fire"),
    e("\u{1FAA8}", "Rock"),
    e("\u{1FAB5}", "Wood"),
    e("\u{1F52B}", "Pistol"),
    e("\u{1F56F}\u{FE0F}", "Candle"),
    e("\u{1F5BC}\u{FE0F}", "Framed Picture"),
    oldKey,
    e("\u{1F5DE}\u{FE0F}", "Rolled-Up Newspaper"),
    e("\u{1F5FA}\u{FE0F}", "World Map"),
    door,
    e("\u{1F6BD}", "Toilet"),
    e("\u{1F6BF}", "Shower"),
    e("\u{1F6C1}", "Bathtub"),
    e("\u{1F6CB}\u{FE0F}", "Couch and Lamp"),
    e("\u{1F6CF}\u{FE0F}", "Bed"),
    e("\u{1F9F4}", "Lotion Bottle"),
    e("\u{1F9F5}", "Thread"),
    e("\u{1F9F6}", "Yarn"),
    e("\u{1F9F7}", "Safety Pin"),
    e("\u{1F9F8}", "Teddy Bear"),
    e("\u{1F9F9}", "Broom"),
    e("\u{1F9FA}", "Basket"),
    e("\u{1F9FB}", "Roll of Paper"),
    e("\u{1F9FC}", "Soap"),
    e("\u{1F9FD}", "Sponge"),
    e("\u{1FA91}", "Chair"),
    e("\u{1FA92}", "Razor"),
    e("\u{1FA9E}", "Mirror"),
    e("\u{1FA9F}", "Window"),
    e("\u{1FAA0}", "Plunger"),
    e("\u{1FAA1}", "Sewing Needle"),
    e("\u{1FAA2}", "Knot"),
    e("\u{1FAA3}", "Bucket"),
    e("\u{1FAA4}", "Mouse Trap"),
    e("\u{1FAA5}", "Toothbrush"),
    e("\u{1FAA6}", "Headstone"),
    e("\u{1FAA7}", "Placard"),
    e("\u{1F397}\u{FE0F}", "Reminder Ribbon"));

const activities = g(
    "Activities", "Activities",
    e("\u{1F39E}\u{FE0F}", "Film Frames"),
    e("\u{1F39F}\u{FE0F}", "Admission Tickets"),
    e("\u{1F3A0}", "Carousel Horse"),
    e("\u{1F3A1}", "Ferris Wheel"),
    e("\u{1F3A2}", "Roller Coaster"),
    artistPalette,
    e("\u{1F3AA}", "Circus Tent"),
    e("\u{1F3AB}", "Ticket"),
    e("\u{1F3AC}", "Clapper Board"),
    e("\u{1F3AD}", "Performing Arts"));

const travel = g(
    "Travel", "Travel",
    e("\u{1F3F7}\u{FE0F}", "Label"),
    e("\u{1F30B}", "Volcano"),
    e("\u{1F3D4}\u{FE0F}", "Snow-Capped Mountain"),
    e("\u{26F0}\u{FE0F}", "Mountain"),
    e("\u{1F3D5}\u{FE0F}", "Camping"),
    e("\u{1F3D6}\u{FE0F}", "Beach with Umbrella"),
    e("\u{26F1}\u{FE0F}", "Umbrella on Ground"),
    e("\u{1F3EF}", "Japanese Castle"),
    e("\u{1F463}", "Footprints"),
    e("\u{1F5FB}", "Mount Fuji"),
    e("\u{1F5FC}", "Tokyo Tower"),
    e("\u{1F5FD}", "Statue of Liberty"),
    e("\u{1F5FE}", "Map of Japan"),
    e("\u{1F5FF}", "Moai"),
    e("\u{1F6CE}\u{FE0F}", "Bellhop Bell"),
    e("\u{1F9F3}", "Luggage"),
    e("\u{26F3}", "Flag in Hole"),
    e("\u{26FA}", "Tent"),
    e("\u{2668}\u{FE0F}", "Hot Springs"));

const medieval = g(
    "Medieval", "Medieval",
    e("\u{1F3F0}", "Castle"),
    e("\u{1F3F9}", "Bow and Arrow"),
    crown,
    e("\u{1F531}", "Trident Emblem"),
    e("\u{1F5E1}\u{FE0F}", "Dagger"),
    e("\u{1F6E1}\u{FE0F}", "Shield"),
    e("\u{1F52E}", "Crystal Ball"),
    e("\u{1FA84}", "Magic Wand"),
    e("\u{2694}\u{FE0F}", "Crossed Swords"),
    e("\u{269C}\u{FE0F}", "Fleur-de-lis"),
    e("\u{1FA96}", "Military Helmet"));

const doubleExclamationMark = e("\u{203C}\u{FE0F}", "Double Exclamation Mark");
const interrobang = e("\u{2049}\u{FE0F}", "Exclamation Question Mark");
const information = e("\u{2139}\u{FE0F}", "Information");
const circledM = e("\u{24C2}\u{FE0F}", "Circled M");
const checkMarkButton = e("\u{2705}", "Check Mark Button");
const checkMark = e("\u{2714}\u{FE0F}", "Check Mark");
const eightSpokedAsterisk = e("\u{2733}\u{FE0F}", "Eight-Spoked Asterisk");
const crossMark = e("\u{274C}", "Cross Mark");
const crossMarkButton = e("\u{274E}", "Cross Mark Button");
const questionMark = e("\u{2753}", "Question Mark");
const whiteQuestionMark = e("\u{2754}", "White Question Mark");
const whiteExclamationMark = e("\u{2755}", "White Exclamation Mark");
const exclamationMark = e("\u{2757}", "Exclamation Mark");
const curlyLoop = e("\u{27B0}", "Curly Loop");
const doubleCurlyLoop = e("\u{27BF}", "Double Curly Loop");
const wavyDash = e("\u{3030}\u{FE0F}", "Wavy Dash");
const partAlternationMark = e("\u{303D}\u{FE0F}", "Part Alternation Mark");
const tradeMark = e("\u{2122}\u{FE0F}", "Trade Mark");
const copyright = e("\u{A9}\u{FE0F}", "Copyright");
const registered = e("\u{AE}\u{FE0F}", "Registered");
const squareFourCourners = e("\u{26F6}\u{FE0F}", "Square: Four Corners");

const marks = gg(
    "Marks", "Marks", {
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
});

const dice1 = e("\u2680", "Dice: Side 1");
const dice2 = e("\u2681", "Dice: Side 2");
const dice3 = e("\u2682", "Dice: Side 3");
const dice4 = e("\u2683", "Dice: Side 4");
const dice5 = e("\u2684", "Dice: Side 5");
const dice6 = e("\u2685", "Dice: Side 6");
const dice = gg(
    "Dice", "Dice", {
    dice1,
    dice2,
    dice3,
    dice4,
    dice5,
    dice6
});

const whiteChessKing = e("\u{2654}", "White Chess King");
const whiteChessQueen = e("\u{2655}", "White Chess Queen");
const whiteChessRook = e("\u{2656}", "White Chess Rook");
const whiteChessBishop = e("\u{2657}", "White Chess Bishop");
const whiteChessKnight = e("\u{2658}", "White Chess Knight");
const whiteChessPawn = e("\u{2659}", "White Chess Pawn");
const whiteChessPieces = gg(
    whiteChessKing.value + whiteChessQueen.value + whiteChessRook.value + whiteChessBishop.value + whiteChessKnight.value + whiteChessPawn.value,
    "White Chess Pieces", {
    width: "auto",
    king: whiteChessKing,
    queen: whiteChessQueen,
    rook: whiteChessRook,
    bishop: whiteChessBishop,
    knight: whiteChessKnight,
    pawn: whiteChessPawn
});

const blackChessKing = e("\u{265A}", "Black Chess King");
const blackChessQueen = e("\u{265B}", "Black Chess Queen");
const blackChessRook = e("\u{265C}", "Black Chess Rook");
const blackChessBishop = e("\u{265D}", "Black Chess Bishop");
const blackChessKnight = e("\u{265E}", "Black Chess Knight");
const blackChessPawn = e("\u{265F}", "Black Chess Pawn");
const blackChessPieces = gg(
    blackChessKing.value + blackChessQueen.value + blackChessRook.value + blackChessBishop.value + blackChessKnight.value + blackChessPawn.value,
    "Black Chess Pieces", {
    width: "auto",
    king: blackChessKing,
    queen: blackChessQueen,
    rook: blackChessRook,
    bishop: blackChessBishop,
    knight: blackChessKnight,
    pawn: blackChessPawn
});
const chessPawns = gg(
    whiteChessPawn.value + blackChessPawn.value,
    "Chess Pawns", {
    width: "auto",
    white: whiteChessPawn,
    black: blackChessPawn
});
const chessRooks = gg(
    whiteChessRook.value + blackChessRook.value,
    "Chess Rooks", {
    width: "auto",
    white: whiteChessRook,
    black: blackChessRook
});
const chessBishops = gg(
    whiteChessBishop.value + blackChessBishop.value,
    "Chess Bishops", {
    width: "auto",
    white: whiteChessBishop,
    black: blackChessBishop
});
const chessKnights = gg(
    whiteChessKnight.value + blackChessKnight.value,
    "Chess Knights", {
    width: "auto",
    white: whiteChessKnight,
    black: blackChessKnight
});
const chessQueens = gg(
    whiteChessQueen.value + blackChessQueen.value,
    "Chess Queens", {
    width: "auto",
    white: whiteChessQueen,
    black: blackChessQueen
});
const chessKings = gg(
    whiteChessKing.value + blackChessKing.value,
    "Chess Kings", {
    width: "auto",
    white: whiteChessKing,
    black: blackChessKing
});
const chess = gg(
    "Chess Pieces", "Chess Pieces", {
    width: "auto",
    white: whiteChessPieces,
    black: blackChessPieces,
    pawns: chessPawns,
    rooks: chessRooks,
    bishops: chessBishops,
    knights: chessKnights,
    queens: chessQueens,
    kings: chessKings
});

const science = gg(
    "Science", "Science", {
    droplet,
    dropOfBlood,
    adhesiveBandage,
    stehoscope,
    syringe,
    pill,
    microscope,
    testTube,
    petriDish,
    dna,
    abacus,
    magnet,
    telescope,
    medical,
    balanceScale,
    alembic,
    gear,
    atomSymbol,
    magnifyingGlassTiltedLeft,
    magnifyingGlassTiltedRight,
});

const allIcons = gg(
    "All Icons", "All Icons", {
    faces,
    love,
    cartoon,
    hands,
    bodyParts,
    people,
    gestures,
    inMotion,
    resting,
    roles,
    fantasy,
    animals,
    plants,
    food,
    flags,
    vehicles,
    clocks,
    arrows,
    shapes,
    buttons,
    zodiac,
    chess,
    dice,
    math,
    games,
    sportsEquipment,
    clothing,
    town,
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
    medieval
});

/**
 * A setter functor for HTML attributes.
 **/
class HtmlAttr {
    /**
     * Creates a new setter functor for HTML Attributes
     * @param {string} key - the attribute name.
     * @param {any} value - the value to set for the attribute.
     * @param {...string} tags - the HTML tags that support this attribute.
     */
    constructor(key, value, ...tags) {
        this.key = key;
        this.value = value;
        this.tags = tags.map(t => t.toLocaleUpperCase());
        Object.freeze(this);
    }

    /**
     * Set the attribute value on an HTMLElement
     * @param {HTMLElement} elem - the element on which to set the attribute.
     */
    apply(elem) {
        const isValid = this.tags.length === 0
            || this.tags.indexOf(elem.tagName) > -1;

        if (!isValid) {
            console.warn(`Element ${elem.tagName} does not support Attribute ${this.key}`);
        }
        else if (this.key === "style") {
            Object.assign(elem[this.key], this.value);
        }
        else if (!(typeof value === "boolean" || value instanceof Boolean)
            || this.key === "muted") {
            elem[this.key] = this.value;
        }
        else if (this.value) {
            elem.setAttribute(this.key, "");
        }
        else {
            elem.removeAttribute(this.key);
        }
    }
}

/**
 * The alt attribute, Alternative text in case an image can't be displayed.
 * @param {any} value - the value to set on the attribute.
 **/
function alt(value) { return new HtmlAttr("alt", value, "applet", "area", "img", "input"); }

/**
 * The autoplay attribute, The audio or video should play as soon as possible.
 * @param {any} value - the value to set on the attribute.
 **/
function autoPlay(value) { return new HtmlAttr("autoplay", value, "audio", "video"); }

/**
 * The className attribute, Often used with CSS to style elements with common properties.
 * @param {any} value - the value to set on the attribute.
 **/
function className(value) { return new HtmlAttr("className", value); }

/**
 * The controls attribute, Indicates whether the browser should show playback controls to the user.
 * @param {any} value - the value to set on the attribute.
 **/
function controls(value) { return new HtmlAttr("controls", value, "audio", "video"); }

/**
 * The htmlFor attribute, Describes elements which belongs to this one.
 * @param {any} value - the value to set on the attribute.
 **/
function htmlFor(value) { return new HtmlAttr("htmlFor", value, "label", "output"); }

/**
 * The href attribute, The URL of a linked resource.
 * @param {any} value - the value to set on the attribute.
 **/
function href(value) { return new HtmlAttr("href", value, "a", "area", "base", "link"); }

/**
 * The id attribute, Often used with CSS to style a specific element. The value of this attribute must be unique.
 * @param {any} value - the value to set on the attribute.
 **/
function id(value) { return new HtmlAttr("id", value); }

/**
 * The max attribute, Indicates the maximum value allowed.
 * @param {any} value - the value to set on the attribute.
 **/
function max(value) { return new HtmlAttr("max", value, "input", "meter", "progress"); }

/**
 * The min attribute, Indicates the minimum value allowed.
 * @param {any} value - the value to set on the attribute.
 **/
function min(value) { return new HtmlAttr("min", value, "input", "meter"); }

/**
 * The muted attribute, Indicates whether the audio will be initially silenced on page load.
 * @param {any} value - the value to set on the attribute.
 **/
function muted(value) { return new HtmlAttr("muted", value, "audio", "video"); }

/**
 * The placeholder attribute, Provides a hint to the user of what can be entered in the field.
 * @param {any} value - the value to set on the attribute.
 **/
function placeHolder(value) { return new HtmlAttr("placeholder", value, "input", "textarea"); }

/**
 * The role attribute, Defines the number of rows in a text area.
 * @param {any} value - the value to set on the attribute.
 **/
function role(value) { return new HtmlAttr("role", value); }

/**
 * The src attribute, The URL of the embeddable content.
 * @param {any} value - the value to set on the attribute.
 **/
function src(value) { return new HtmlAttr("src", value, "audio", "embed", "iframe", "img", "input", "script", "source", "track", "video"); }

/**
 * The srcObject attribute, A MediaStream object to use as a source for an HTML video or audio element
 * @param {any} value - the value to set on the attribute.
 **/
function srcObject(value) { return new HtmlAttr("srcObject", value, "audio", "video"); }

/**
 * The style attribute, Defines CSS styles which will override styles previously set.
 * @param {any} value - the value to set on the attribute.
 **/
function style(value) { return new HtmlAttr("style", value); }

/**
 * The step attribute
 * @param {any} value - the value to set on the attribute.
 **/
function step(value) { return new HtmlAttr("step", value, "input"); }

/**
 * The title attribute, Text to be displayed in a tooltip when hovering over the element.
 * @param {any} value - the value to set on the attribute.
 **/
function title(value) { return new HtmlAttr("title", value); }

/**
 * The type attribute, Defines the type of the element.
 * @param {any} value - the value to set on the attribute.
 **/
function type(value) { return new HtmlAttr("type", value, "button", "input", "command", "embed", "object", "script", "source", "style", "menu"); }

/**
 * The value attribute, Defines a default value which will be displayed in the element on page load.
 * @param {any} value - the value to set on the attribute.
 **/
function value(value) { return new HtmlAttr("value", value, "button", "data", "input", "li", "meter", "option", "progress", "param"); }

// A selection of fonts for preferred monospace rendering.
const monospaceFamily = "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace";
const monospaceFont = style({ fontFamily: monospaceFamily });

/**
 * Constructs a CSS grid row definition
 * @param {number} y - the starting vertical cell for the element.
 * @param {number} [h=null] - the number of cells tall the element should cover.
 */
function row(y, h = null) {
    if (h === null) {
        h = 1;
    }

    return style({
        gridRowStart: y,
        gridRowEnd: y + h
    });
}

/**
 * Constructs a CSS grid area definition.
 * @param {number} x - the starting horizontal cell for the element.
 * @param {number} y - the starting vertical cell for the element.
 * @param {number} [w=null] - the number of cells wide the element should cover.
 * @param {number} [h=null] - the number of cells tall the element should cover.
 */
function grid(x, y, w = null, h = null) {
    if (w === null) {
        w = 1;
    }

    if (h === null) {
        h = 1;
    }

    return style({
        gridRowStart: y,
        gridRowEnd: y + h,
        gridColumnStart: x,
        gridColumnEnd: x + w
    });
}

/**
 * A setter functor for HTML element events.
 **/
class HtmlEvt {
    /**
     * Creates a new setter functor for an HTML element event.
     * @param {string} name - the name of the event to attach to.
     * @param {Function} callback - the callback function to use with the event handler.
     * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
     */
    constructor(name, callback, opts) {
        if (!isFunction(callback)) {
            throw new Error("A function instance is required for this parameter");
        }

        this.name = name;
        this.callback = callback;
        this.opts = opts;
        Object.freeze(this);
    }

    /**
     * Add the encapsulate callback as an event listener to the give HTMLElement
     * @param {HTMLElement} elem
     */
    add(elem) {
        elem.addEventListener(this.name, this.callback, this.opts);
    }

    /**
     * Remove the encapsulate callback as an event listener from the give HTMLElement
     * @param {HTMLElement} elem
     */
    remove(elem) {
        elem.removeEventListener(this.name, this.callback);
    }
}

/**
 * The click event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
function onClick(callback, opts) { return new HtmlEvt("click", callback, opts); }

/**
 * The input event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
function onInput(callback, opts) { return new HtmlEvt("input", callback, opts); }

/**
 * The keyup event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
function onKeyUp(callback, opts) { return new HtmlEvt("keyup", callback, opts); }

/**
 * The mouseout event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
function onMouseOut(callback, opts) { return new HtmlEvt("mouseout", callback, opts); }

/**
 * The mouseover event.
 * @param {Function} callback - the callback function to use with the event handler.
 * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
 **/
function onMouseOver(callback, opts) { return new HtmlEvt("mouseover", callback, opts); }

/**
 * @typedef {(Element|HtmlAttr|HtmlEvt|string|number|boolean|Date)} TagChild
 **/

/**
 * Creates an HTML element for a given tag name.
 * 
 * Boolean attributes that you want to default to true can be passed
 * as just the attribute creating function, 
 *   e.g. `Audio(autoPlay)` vs `Audio(autoPlay(true))`
 * @param {string} name - the name of the tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
function tag(name, ...rest) {
    const elem = document.createElement(name);

    for (let i = 0; i < rest.length; ++i) {
        // 
        if (isFunction(rest[i])) {
            rest[i] = rest[i](true);
        }
    }

    for (let x of rest) {
        if (x !== null && x !== undefined) {
            if (isString(x)
                || isNumber(x)
                || isBoolean(x)
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

/**
 * A pseudo-element that is made out of other elements.
 **/
class HtmlCustomTag extends EventTarget {
    /**
     * Creates a new pseudo-element
     * @param {string} tagName - the type of tag that will contain the elements in the custom tag.
     * @param {...TagChild} rest - optional attributes, child elements, and text
     */
    constructor(tagName, ...rest) {
        super();
        if (rest.length === 1
            && rest[0] instanceof Element) {
            /** @type {HTMLElement} */
            this.element = rest[0];
        }
        else {
            /** @type {HTMLElement} */
            this.element = tag(tagName, ...rest);
        }
    }

    /**
     * Gets the ID attribute of the container element.
     * @type {string}
     **/
    get id() {
        return this.element.id;
    }

    /**
     * Retrieves the desired element for attaching events.
     * @returns {HTMLElement}
     **/
    get eventTarget() {
        return this.element;
    }

    /**
     * Determine if an event type should be forwarded to the container element.
     * @param {string} name
     * @returns {boolean}
     */
    isForwardedEvent(name) {
        return true;
    }

    /**
     * Adds an event listener to the container element.
     * @param {string} name - the name of the event to attach to.
     * @param {Function} callback - the callback function to use with the event handler.
     * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
     */
    addEventListener(name, callback, opts) {
        if (this.isForwardedEvent(name)) {
            this.eventTarget.addEventListener(name, callback, opts);
        }
        else {
            super.addEventListener(name, callback, opts);
        }
    }

    /**
     * Removes an event listener from the container element.
     * @param {string} name - the name of the event to attach to.
     * @param {Function} callback - the callback function to use with the event handler.
     */
    removeEventListener(name, callback) {
        if (this.isForwardedEvent(name)) {
            this.eventTarget.removeEventListener(name, callback);
        }
        else {
            super.removeEventListener(name, callback);
        }
    }

    /**
     * Wait for a specific event, one time.
     * @param {string} resolveEvt - the name of the event that will resolve the Promise this method creates.
     * @param {string} rejectEvt - the name of the event that could reject the Promise this method creates.
     * @param {number} timeout - the number of milliseconds to wait for the resolveEvt, before rejecting.
     */
    async once(resolveEvt, rejectEvt, timeout) {
        return await this.eventTarget.once(resolveEvt, rejectEvt, timeout);
    }

    /**
     * Set whether or not the container element is visible.
     * @param {boolean} v
     */
    setOpen(v) {
        this.element.setOpen(v);
    }

    /**
     * Makes the container element visible, if it is not already.
     **/
    show() {
        this.setOpen(true);
    }

    /**
     * Makes the container element not visible, if it is not already.
     **/
    hide() {
        this.setOpen(false);
    }

    /**
     * Gets the style attribute of the underlying select box.
     * @type {ElementCSSInlineStyle}
     */
    get style() {
        return this.element.style;
    }

    /**
     * Moves cursor focus to the underyling element.
     **/
    focus() {
        this.element.focus();
    }

    /**
     * Removes cursor focus from the underlying element.
     **/
    blur() {
        this.element.blur();
    }
}

/**
 * An input box that has a label attached to it.
 **/
class LabeledInputTag extends HtmlCustomTag {
    /**
     * Creates an input box that has a label attached to it.
     * @param {string} id - the ID to use for the input box
     * @param {string} inputType - the type to use for the input box (number, text, etc.)
     * @param {string} labelText - the text to display in the label
     * @param {...TagChild} rest - optional attributes, child elements, and text to use on the select element
     * @returns {LabeledInputTag}
     */
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

    /**
     * Retrieves the desired element for attaching events.
     * @returns {HTMLElement}
     **/
    get eventTarget() {
        return this.input;
    }

    /**
     * Gets the value attribute of the input element
     * @type {string}
     */
    get value() {
        return this.input.value;
    }

    /**
     * Sets the value attribute of the input element
     * @param {string} v
     */
    set value(v) {
        this.input.value = v;
    }

    /**
     * Gets whether or not the input element is checked, if it's a checkbox or radio button.
     * @type {boolean}
     */
    get checked() {
        return this.input.checked;
    }

    /**
     * Sets whether or not the input element is checked, if it's a checkbox or radio button.
     * @param {boolean} v
     */
    set checked(v) {
        this.input.checked = v;
    }

    /**
     * Sets whether or not the input element should be disabled.
     * @param {boolean} value
     */
    setLocked(value) {
        this.input.setLocked(value);
    }
}

class LabeledSelectBoxTag extends HtmlCustomTag {
    /**
     * Creates a select box that can bind to collections, with a label set on the side.
     * @param {string} tagId - the ID to use for the select box.
     * @param {any} labelText - the text to put in the label.
     * @param {string} noSelectionText - the text to display when no items are available.
     * @param {makeItemValueCallback} makeID - a function that evalutes a databound item to create an ID for it.
     * @param {makeItemValueCallback} makeLabel - a function that evalutes a databound item to create a label for it.
     * @param {...TagChild} rest - optional attributes, child elements, and text to use on the select element
     */
    constructor(tagId, labelText, noSelectionText, makeID, makeLabel, ...rest) {
        super("div");

        this.label = Label(
            htmlFor(tagId),
            labelText);

        /** @type {SelectBox} */
        this.select = new SelectBox(noSelectionText, makeID, makeLabel, id(tagId), ...rest);

        this.element.append(
            this.label,
            this.select.element);

        Object.seal(this);
    }

    /**
     * Retrieves the desired element for attaching events.
     * @returns {HTMLElement}
     **/
    get eventTarget() {
        return this.select;
    }

    /**
     * Gets whether or not the select box will have a vestigial entry for "no selection" or "null" in the select box.
     * @type {boolean}
     **/
    get emptySelectionEnabled() {
        return this.select.emptySelectionEnabled;
    }

    /**
     * Sets whether or not the select box will have a vestigial entry for "no selection" or "null" in the select box.
     * @param {boolean} value
     **/
    set emptySelectionEnabled(value) {
        this.select.emptySelectionEnabled = value;
    }

    /**
     * Gets the collection to which the select box was databound
     **/
    get values() {
        return this.select.values;
    }

    /**
     * Sets the collection to which the select box will be databound
     **/
    set values(values) {
        this.select.values = values;
    }

    /**
     * Returns the collection of HTMLOptionElements that are stored in the select box
     * @type {HTMLOptionsCollection}
     */
    get options() {
        return this.select.options;
    }

    /**
     * Gets the index of the item that is currently selected in the select box.
     * The index is offset by -1 if the select box has `emptySelectionEnabled`
     * set to true, so that the indices returned are always in range of the collection
     * to which the select box was databound
     * @type {number}
     */
    get selectedIndex() {
        return this.select.selectedIndex;
    }
    /**
    * Sets the index of the item that should be selected in the select box.
    * The index is offset by -1 if the select box has `emptySelectionEnabled`
    * set to true, so that the indices returned are always in range of the collection
    * to which the select box was databound
    * @param {number} i
    */
    set selectedIndex(i) {
        this.select.selectedIndex = i;
    }

    /**
     * Gets the item at `selectedIndex` in the collection to which the select box was databound
     * @type {any}
     */
    get selectedValue() {
        return this.select.selectedValue;
    }
    /**
    * Gets the index of the given item in the select box's databound collection, then
    * sets that index as the `selectedIndex`.
     * @param {any) value
    */
    set selectedValue(v) {
        this.select.selectedValue = v;
    }

    /**
     * Returns the index of the given item in the select box's databound collection.
     * @param {any} value
     * @returns {number}
     */
    indexOf(value) {
        return this.select.indexOf(value);
    }

    /**
     * Checks to see if the value exists in the databound collection.
     * @param {any} value
     * @returns {boolean}
     */
    contains(value) {
        return this.select.contains(value);
    }
}

const selectEvt = new Event("select");

/**
 * A panel and a button that opens it.
 **/
class OptionPanelTag extends HtmlCustomTag {

    /**
     * Creates a new panel that can be opened with a button click, 
     * living in a collection of panels that will be hidden when
     * this panel is opened.
     * @param {string} panelID - the ID to use for the panel element.
     * @param {string} name - the text to use on the button.
     * @param {...any} rest
     */
    constructor(panelID, name, ...rest) {
        super("div",
            id(panelID),
            style({ padding: "1em" }),
            P(...rest));

        this.button = Button(
            id(panelID + "Btn"),
            onClick(() => this.dispatchEvent(selectEvt)),
            name);
    }

    isForwardedEvent(name) {
        return name !== "select";
    }

    /**
     * Gets whether or not the panel is visible
     * @type {boolean}
     **/
    get visible() {
        return this.element.style.display !== null;
    }

    /**
     * Sets whether or not the panel is visible
     * @param {boolean} v
     **/
    set visible(v) {
        this.element.setOpen(v);
        style({
            borderStyle: "solid",
            borderSize: "2px",
            backgroundColor: v ? "#ddd" : "transparent",
            borderTop: v ? "" : "none",
            borderRight: v ? "" : "none",
            borderBottomColor: v ? "#ddd" : "",
            borderLeft: v ? "" : "none",
        }).apply(this.button);
    }
}

/** @type {WeakMap<SelectBoxTag, any[]>} */
const values = new WeakMap();

function render(self) {
    clear(self.element);
    if (self.values.length === 0) {
        self.element.append(Option(self.noSelectionText));
        self.element.lock();
    }
    else {
        if (self.emptySelectionEnabled) {
            self.element.append(Option(self.noSelectionText));
        }
        for (let v of self.values) {
            self.element.append(
                Option(
                    value(self.makeID(v)),
                    self.makeLabel(v)));
        }

        self.element.unlock();
    }
}

/**
 * A select box that can be databound to collections.
 **/
class SelectBoxTag extends HtmlCustomTag {

    /**
     * Creates a select box that can bind to collections
     * @param {string} noSelectionText - the text to display when no items are available.
     * @param {makeItemValueCallback} makeID - a function that evalutes a databound item to create an ID for it.
     * @param {makeItemValueCallback} makeLabel - a function that evalutes a databound item to create a label for it.
     * @param {...TagChild} rest - optional attributes, child elements, and text to use on the select element
     */
    constructor(noSelectionText, makeID, makeLabel, ...rest) {
        super("select", ...rest);

        if (!isFunction(makeID)) {
            throw new Error("makeID parameter must be a Function");
        }

        if (!isFunction(makeLabel)) {
            throw new Error("makeLabel parameter must be a Function");
        }

        this.noSelectionText = noSelectionText;
        this.makeID = (v) => v !== null && makeID(v) || null;
        this.makeLabel = (v) => v !== null && makeLabel(v) || "None";
        this.emptySelectionEnabled = true;

        Object.seal(this);
    }

    /**
     * Gets whether or not the select box will have a vestigial entry for "no selection" or "null" in the select box.
     * @type {boolean}
     **/
    get emptySelectionEnabled() {
        return this._emptySelectionEnabled;
    }

    /**
     * Sets whether or not the select box will have a vestigial entry for "no selection" or "null" in the select box.
     * @param {boolean} value
     **/
    set emptySelectionEnabled(value) {
        this._emptySelectionEnabled = value;
        render(this);
    }

    /**
     * Gets the collection to which the select box was databound
     **/
    get values() {
        if (!values.has(this)) {
            values.set(this, []);
        }
        return values.get(this);
    }

    /**
     * Sets the collection to which the select box will be databound
     **/
    set values(newItems) {
        const curValue = this.selectedValue;
        const values = this.values;
        values.splice(0, values.length, ...newItems);
        render(this);
        this.selectedValue = curValue;
    }

    /**
     * Returns the collection of HTMLOptionElements that are stored in the select box
     * @type {HTMLOptionsCollection}
     */
    get options() {
        return this.element.options;
    }

    /**
     * Gets the index of the item that is currently selected in the select box.
     * The index is offset by -1 if the select box has `emptySelectionEnabled`
     * set to true, so that the indices returned are always in range of the collection
     * to which the select box was databound
     * @type {number}
     */
    get selectedIndex() {
        let i = this.element.selectedIndex;
        if (this.emptySelectionEnabled) {
            --i;
        }
        return i;
    }

    /**
     * Sets the index of the item that should be selected in the select box.
     * The index is offset by -1 if the select box has `emptySelectionEnabled`
     * set to true, so that the indices returned are always in range of the collection
     * to which the select box was databound
     * @param {number} i
     */
    set selectedIndex(i) {
        if (this.emptySelectionEnabled) {
            ++i;
        }
        this.element.selectedIndex = i;
    }

    /**
     * Gets the item at `selectedIndex` in the collection to which the select box was databound
     * @type {any}
     */
    get selectedValue() {
        if (0 <= this.selectedIndex && this.selectedIndex < this.values.length) {
            return this.values[this.selectedIndex];
        }
        else {
            return null;
        }
    }

    /**
     * Gets the index of the given item in the select box's databound collection, then
     * sets that index as the `selectedIndex`.
     * @param {any) value
     */
    set selectedValue(value) {
        this.selectedIndex = this.indexOf(value);
    }

    /**
     * Returns the index of the given item in the select box's databound collection.
     * @param {any} value
     * @returns {number}
     */
    indexOf(value) {
        return this.values
            .findIndex(v =>
                value !== null
                && this.makeID(value) === this.makeID(v));
    }

    /**
     * Checks to see if the value exists in the databound collection.
     * @param {any} value
     * @returns {boolean}
     */
    contains(value) {
        return this.indexOf(value) >= 0.
    }
}

/**
 * Empty an element of all children. This is faster than
 * setting `innerHTML = ""`.
 * @param {any} elem
 */
function clear(elem) {
    while (elem.lastChild) {
        elem.lastChild.remove();
    }
}

/**
 * creates an HTML A tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLAnchorElement}
 */
function A(...rest) { return tag("a", ...rest); }

/**
 * creates an HTML Audio tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLAudioElement}
 */
function Audio(...rest) { return tag("audio", ...rest); }

/**
 * creates an HTML HtmlButton tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLButtonElement}
 */
function ButtonRaw(...rest) { return tag("button", ...rest); }

/**
 * creates an HTML Button tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLButtonElement}
 */
function Button(...rest) { return ButtonRaw(...rest, type("button")); }

/**
 * creates an HTML Canvas tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLCanvasElement}
 */
function Canvas(...rest) { return tag("canvas", ...rest); }

/**
 * creates an HTML Div tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLDivElement}
 */
function Div(...rest) { return tag("div", ...rest); }

/**
 * creates an HTML H1 tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHeadingElement}
 */
function H1(...rest) { return tag("h1", ...rest); }

/**
 * creates an HTML H2 tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHeadingElement}
 */
function H2(...rest) { return tag("h2", ...rest); }

/**
 * creates an HTML Img tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLImageElement}
 */
function Img(...rest) { return tag("img", ...rest); }

/**
 * creates an HTML Input tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
function Input(...rest) { return tag("input", ...rest); }

/**
 * creates an HTML Label tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLLabelElement}
 */
function Label(...rest) { return tag("label", ...rest); }

/**
 * creates an HTML LI tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLLIElement}
 */
function LI(...rest) { return tag("li", ...rest); }

/**
 * creates an HTML Option tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLOptionElement}
 */
function Option(...rest) { return tag("option", ...rest); }

/**
 * creates an HTML P tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLParagraphElement}
 */
function P(...rest) { return tag("p", ...rest); }

/**
 * creates an HTML Source tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLSourceElement}
 */
function Source(...rest) { return tag("source", ...rest); }

/**
 * creates an HTML Span tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLSpanElement}
 */
function Span(...rest) { return tag("span", ...rest); }

/**
 * creates an HTML UL tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLUListElement}
 */
function UL(...rest) { return tag("ul", ...rest); }

/**
 * Creates an input box that has a label attached to it.
 * @param {string} id - the ID to use for the input box
 * @param {string} inputType - the type to use for the input box (number, text, etc.)
 * @param {string} labelText - the text to display in the label
 * @param {...TagChild} rest - optional attributes, child elements, and text to use on the select element
 * @returns {LabeledInputTag}
 */
function LabeledInput(id, inputType, labelText, ...rest) {
    return new LabeledInputTag(id, inputType, labelText, ...rest);
}

/**
 * Creates a string from a list item to use as the item's ID or label in a select box.
 * @callback makeItemValueCallback
 * @param {any} obj - the object
 * @returns {string}
 */

/**
 * Creates a select box that can bind to collections
 * @param {string} noSelectionText - the text to display when no items are available.
 * @param {makeItemValueCallback} makeID - a function that evalutes a databound item to create an ID for it.
 * @param {makeItemValueCallback} makeLabel - a function that evalutes a databound item to create a label for it.
 * @param {...TagChild} rest - optional attributes, child elements, and text to use on the select element
 * @returns {SelectBoxTag}
 */
function SelectBox(noSelectionText, makeID, makeLabel, ...rest) {
    return new SelectBoxTag(noSelectionText, makeID, makeLabel, ...rest);
}

/**
 * Creates a select box, with a label attached to it, that can bind to collections
 * @param {string} id - the ID to use for the input box
 * @param {string} labelText - the text to display in the label
 * @param {string} noSelectionText - the text to display when no items are available.
 * @param {makeItemValueCallback} makeID - a function that evalutes a databound item to create an ID for it.
 * @param {makeItemValueCallback} makeLabel - a function that evalutes a databound item to create a label for it.
 * @param {...TagChild} rest - optional attributes, child elements, and text to use on the select element
 * @returns {LabeledSelectBoxTag}
 */
function LabeledSelectBox(id, labelText, noSelectionText, makeID, makeLabel, ...rest) {
    return new LabeledSelectBoxTag(id, labelText, noSelectionText, makeID, makeLabel, ...rest);
}

/**
 * Creates an OptionPanelTag element
 * @param {string} id - the ID to use for the content element of the option panel
 * @param {string} name - the text to use in the button that triggers displaying the content element
 * @param {...TagChild} rest - optional attributes, child elements, and text to use on the content element
 */
function OptionPanel(id, name, ...rest) {
    return new OptionPanelTag(id, name, ...rest);
}

class FormDialog extends EventTarget {
    constructor(name, ...rest) {
        super();

        const formStyle = style({
            display: "grid",
            gridTemplateColumns: "5fr 1fr 1fr",
            gridTemplateRows: "auto auto 1fr auto auto",
            overflowY: "hidden"
        });

        this.element = document.getElementById(name) ||
            Div(
                id(name),
                className("dialog"),
                H1(...rest));

        formStyle.apply(this.element);

        style({ gridArea: "1/1/2/4" }).apply(this.element.querySelector("h1"));

        this.header = this.element.querySelector(".header")
            || this.element.appendChild(Div(className("header")));

        style({ gridArea: "2/1/3/4" }).apply(this.header);

        this.content = this.element.querySelector(".content")
            || this.element.appendChild(Div(className("content")));

        style({
            padding: "1em",
            overflowY: "scroll",
            gridArea: "3/1/4/4"
        }).apply(this.content);

        this.footer = this.element.querySelector(".footer")
            || this.element.appendChild(Div(className("footer")));

        style({
            display: "flex",
            flexDirection: "row-reverse",
            gridArea: "4/1/5/4"
        }).apply(this.footer);
    }

    get isOpen() {
        return this.element.isOpen();
    }

    set isOpen(v) {
        if (v !== this.isOpen) {
            this.toggleOpen();
        }
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

const headerStyle = style({
    textDecoration: "none",
    color: "black",
    textTransform: "capitalize"
}),
    buttonStyle = style({
        fontSize: "200%",
        width: "2em"
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

        /**
         * 
         * @param {EmojiGroup} group
         * @param {HTMLElement} container
         * @param {boolean} isAlts
         */
        const addIconsToContainer = (group, container, isAlts) => {
            const alts = group.alts || group;
            for (let icon of alts) {
                const btn = Button(
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

                /** @type {HTMLUListElement|HTMLSpanElement} */
                let g = null;

                if (isAlts) {
                    btn.id = `emoji-with-alt-${idCounter++}`;
                    g = UL(
                        LI(btn,
                            Label(htmlFor(btn.id),
                                icon.desc)));
                }
                else {
                    g = Span(btn);
                }

                if (!!icon.alts) {
                    alts = Div();
                    allAlts.push(alts);
                    addIconsToContainer(icon, alts, true);
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

        for (let group of Object.values(allIcons)) {
            if (group instanceof EmojiGroup) {
                const header = H1(),
                    container = P(),
                    headerButton = A(
                        href("javascript:undefined"),
                        title(group.desc),
                        headerStyle,
                        onClick(() => {
                            container.toggleOpen();
                            headerButton.innerHTML = group.value  + (container.isOpen() ? " -" : " +");
                        }),
                        group.value + " -");

                addIconsToContainer(group, container);
                header.appendChild(headerButton);
                this.content.appendChild(header);
                this.content.appendChild(container);
            }
        }

        this.footer.append(

            this.confirmButton = Button(className("confirm"),
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
                "Cancel",
                onClick(() => {
                    this.confirmButton.lock();
                    this.hide();
                    this.dispatchEvent(cancelEvt);
                })),

            this.preview = Span(style({ gridArea: "4/1/5/4" })));

        this.confirmButton.lock();

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

function Run(...rest) {
    return Div(
        style({ margin: "auto" }),
        ...rest);
}

const toggleAudioEvt = new Event("toggleAudio"),
    toggleVideoEvt = new Event("toggleVideo"),
    emoteEvt = new Event("emote"),
    selectEmojiEvt = new Event("selectEmoji"),
    subelStyle = style({
        fontSize: "1.25em",
        width: "3em",
        height: "100%"
    }),
    pointerEventsAll = style({
        pointerEvents: "all"
    }),
    subButtonStyle = style({
        fontSize: "1.25em",
        height: "100%"
    }),
    buttonLabelStyle = style({
        fontSize: "12px"
    });

class FooterBar extends EventTarget {
    constructor() {
        super();

        const _ = (evt) => () => this.dispatchEvent(evt);

        /** @type {HTMLButtonElement} */
        this.muteAudioButton = null;

        this.element = Div(
            id("footbar"),
            style({
                gridTemplateColumns: "auto 1fr auto",
                display: "grid",
                padding: "4px",
                width: "100%",
                columnGap: "5px",
                backgroundColor: "transparent",
                pointerEvents: "none"
            }),

            Button(
                title("Toggle audio mute/unmute"),
                onClick(_(toggleAudioEvt)),
                grid(1, 1),
                subelStyle,
                pointerEventsAll,
                this.muteAudioButton = Run(speakerHighVolume.value),
                Run(buttonLabelStyle, "Audio")),

            this.emojiControl = Span(
                grid(2, 1),
                style({ textAlign: "center" }),
                subButtonStyle,
                Button(
                    title("Emote"),
                    onClick(_(emoteEvt)),
                    subButtonStyle,
                    pointerEventsAll,
                    style({ borderRight: "none" }),
                    this.emoteButton = Run(whiteFlower.value),
                    Run(buttonLabelStyle, "Emote")),
                Button(
                    title("Select Emoji"),
                    onClick(_(selectEmojiEvt)),
                    subButtonStyle,
                    pointerEventsAll,
                    style({ borderLeft: "none" }),
                    Run(upwardsButton.value),
                    Run(buttonLabelStyle, "Change"))),


            Button(
                title("Toggle video mute/unmute"),
                onClick(_(toggleVideoEvt)),
                grid(3, 1),
                subelStyle,
                pointerEventsAll,
                this.muteVideoButton = Run(noMobilePhone.value),
                Run(buttonLabelStyle, "Video")));

        this._audioEnabled = true;
        this._videoEnabled = false;

        Object.seal(this);
    }

    get enabled() {
        return !this.muteAudioButton.disabled;
    }

    set enabled(v) {
        for (let button of this.element.querySelectorAll("button")) {
            button.disabled = !v;
        }
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

    get videoEnabled() {
        return this._videoEnabled;
    }

    set videoEnabled(value) {
        this._videoEnabled = value;
        this.muteVideoButton.updateLabel(
            value,
            videoCamera.value,
            noMobilePhone.value);
    }

    setEmojiButton(key, emoji) {
        this.emoteButton.innerHTML = emoji.value;
    }
}

function Run$1(...rest) {
    return Div(
        style({ margin: "auto" }),
        ...rest);
}

const toggleOptionsEvt = new Event("toggleOptions"),
    tweetEvt = new Event("tweet"),
    leaveEvt = new Event("leave"),
    toggleFullscreenEvt = new Event("toggleFullscreen"),
    toggleInstructionsEvt = new Event("toggleInstructions"),
    toggleUserDirectoryEvt = new Event("toggleUserDirectory"),
    subelStyle$1 = style({
        fontSize: "1.25em",
        width: "3em",
        height: "100%",
        pointerEvents: "all"
    }),
    buttonLabelStyle$1 = style({
        fontSize: "12px"
    });

class HeaderBar extends EventTarget {
    constructor() {
        super();

        const _ = (evt) => () => this.dispatchEvent(evt);

        this.element = Div(
            id("headbar"),
            style({
                gridTemplateColumns: "auto auto auto auto 1fr auto auto",
                display: "grid",
                padding: "4px",
                width: "100%",
                columnGap: "5px",
                backgroundColor: "transparent",
                pointerEvents: "none"
            }),

            this.optionsButton = Button(
                title("Show/hide options"),
                onClick(_(toggleOptionsEvt)),
                subelStyle$1,
                grid(1, 1),
                Run$1(gear.value),
                Run$1(buttonLabelStyle$1, "Options")),

            this.instructionsButton = Button(
                title("Show/hide instructions"),
                onClick(_(toggleInstructionsEvt)),
                subelStyle$1,
                grid(2, 1),
                Run$1(questionMark.value),
                Run$1(buttonLabelStyle$1, "Info")),

            Button(
                title("Share your current room to twitter"),
                onClick(_(tweetEvt)),
                subelStyle$1,
                grid(3, 1),
                Img(src("https://cdn2.iconfinder.com/data/icons/minimalism/512/twitter.png"),
                    alt("icon"),
                    role("presentation"),
                    style({ height: "25px", marginBottom: "-7px" })),
                Run$1(buttonLabelStyle$1, "Tweet")),

            Button(
                title("View user directory"),
                onClick(_(toggleUserDirectoryEvt)),
                subelStyle$1,
                grid(4, 1),
                Run$1(speakingHead.value),
                Run$1(buttonLabelStyle$1, "Users")),


            this.fullscreenButton = Button(
                title("Toggle fullscreen"),
                onClick(_(toggleFullscreenEvt)),
                subelStyle$1,
                grid(6, 1),
                Run$1(squareFourCourners.value),
                Run$1(buttonLabelStyle$1, "Expand")),


            Button(
                title("Leave the room"),
                onClick(_(leaveEvt)),
                subelStyle$1,
                grid(7, 1),
                Run$1(door.value),
                Run$1(buttonLabelStyle$1, "Leave")));

        Object.seal(this);
    }

    get isFullscreen() {
        return document.fullscreenElement !== null;
    }

    set isFullscreen(value) {
        if (value) {
            document.body.requestFullscreen();
        }
        else {
            document.exitFullscreen();
        }
        this.fullscreenButton.updateLabel(
            value,
            downRightArrow.value,
            squareFourCourners.value);
    }

    get enabled() {
        return !this.instructionsButton.disabled;
    }

    set enabled(v) {
        for (let button of this.element.querySelectorAll("button")) {
            button.disabled = !v;
        }
    }
}

const loginEvt = new Event("login"),
    defaultRooms = new Map([
        ["calla", "Calla"],
        ["island", "Island"],
        ["alxcc", "Alexandria Code & Coffee"],
        ["vurv", "Vurv"]]),
    selfs = new Map();

class LoginForm extends FormDialog {
    constructor() {
        super("login");

        const self = Object.seal({
            ready: false,
            connecting: false,
            connected: false,
            validate: () => {
                const canConnect = this.roomName.length > 0
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

        selfs.set(this, self);

        this.roomLabel = this.element.querySelector("label[for='roomSelector']");

        this.roomSelect = SelectBox(
            "No rooms available",
            v => v,
            k => defaultRooms.get(k),
            this.element.querySelector("#roomSelector"));

        this.roomSelect.addEventListener("input", () => {
            self.validate();
        });

        this.roomSelect.emptySelectionEnabled = false;
        this.roomSelect.values = defaultRooms.keys();
        this.roomSelect.selectedIndex = 0;

        this.roomInput = this.element.querySelector("#roomName");
        this.roomInput.addEventListener("input", self.validate);
        this.roomInput.addEventListener("enter", () => {
            this.userNameInput.focus();
        });

        this.userNameInput = this.element.querySelector("#userName");
        this.userNameInput.addEventListener("input", self.validate);
        this.userNameInput.addEventListener("enter", () => {
            if (this.roomName.length > 0
                && this.userName.length > 0) ;
            else if (this.userName.length === 0) {
                this.userNameInput.focus();
            }
            else if (this.roomSelectMode) {
                this.roomSelect.focus();
            }
            else {
                this.roomInput.focus();
            }
        });

        this.createRoomButton = this.element.querySelector("#createNewRoom");
        this.createRoomButton.addEventListener("click", () => {
            this.roomSelectMode = !this.roomSelectMode;
        });

        this.connectButton = this.element.querySelector("#connect");
        this.addEventListener("login", () => {
            this.connecting = true;
        });

        this.roomSelectMode = true;

        self.validate();
    }

    addEventListener(evtName, callback, options) {
        if (evtName === "login") {
            this.connectButton.addEventListener("click", callback, options);
        }
        else {
            super.addEventListener(evtName, callback, options);
        }
    }

    removeEventListener(evtName, callback) {
        if (evtName === "login") {
            this.connectButton.removeEventListener("click", callback);
        }
        else {
            super.removeEventListener(evtName, callback);
        }
    }

    get roomSelectMode() {
        return this.roomSelect.style.display !== "none";
    }

    set roomSelectMode(value) {
        const self = selfs.get(this);
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

    get roomName() {
        const room = this.roomSelectMode
            ? this.roomSelect.selectedValue
            : this.roomInput.value;

        return room && room.toLocaleLowerCase() || "";
    }

    set roomName(v) {
        if (v === null
            || v === undefined
            || v.length === 0) {
            v = defaultRooms.keys().next();
        }

        this.roomInput.value = v;
        this.roomSelect.selectedValue = v;
        this.roomSelectMode = this.roomSelect.contains(v);
        selfs.get(this).validate();
    }

    set userName(value) {
        this.userNameInput.value = value;
        selfs.get(this).validate();
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
        const self = selfs.get(this);
        return self.ready;
    }

    set ready(v) {
        const self = selfs.get(this);
        self.ready = v;
        self.validate();
    }

    get connecting() {
        const self = selfs.get(this);
        return self.connecting;
    }

    set connecting(v) {
        const self = selfs.get(this);
        self.connecting = v;
        self.validate();
    }

    get connected() {
        const self = selfs.get(this);
        return self.connected;
    }

    set connected(v) {
        const self = selfs.get(this);
        self.connected = v;
        this.connecting = false;
    }

    show() {
        this.ready = true;
        super.show();
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
        this.displayId = pad.displayId;

        this.connected = pad.connected;
        this.hand = pad.hand;
        this.pose = pad.pose;

        const self = {
            btnDownEvts: [],
            btnUpEvts: [],
            btnState: [],
            axisMaxed: [],
            axisMaxEvts: [],
            sticks: []
        };

        this.lastButtons = [];
        this.buttons = [];
        this.axes = [];
        this.hapticActuators = [];
        this.axisThresholdMax = 0.9;
        this.axisThresholdMin = 0.1;

        this._isStick = (a) => a % 2 === 0 && a < pad.axes.length - 1;

        for (let b = 0; b < pad.buttons.length; ++b) {
            self.btnDownEvts[b] = Object.assign(new Event("gamepadbuttondown"), {
                button: b
            });
            self.btnUpEvts[b] = Object.assign(new Event("gamepadbuttonup"), {
                button: b
            });
            self.btnState[b] = false;

            this.lastButtons[b] = null;
            this.buttons[b] = pad.buttons[b];
        }

        for (let a = 0; a < pad.axes.length; ++a) {
            self.axisMaxEvts[a] = Object.assign(new Event("gamepadaxismaxed"), {
                axis: a
            });
            self.axisMaxed[a] = false;
            if (this._isStick(a)) {
                self.sticks[a / 2] = { x: 0, y: 0 };
            }

            this.axes[a] = pad.axes[a];
        }

        if (pad.hapticActuators !== undefined) {
            for (let h = 0; h < pad.hapticActuators.length; ++h) {
                this.hapticActuators[h] = pad.hapticActuators[h];
            }
        }

        Object.seal(this);
        gamepadStates.set(this, self);
    }

    dispose() {
        gamepadStates.delete(this);
    }

    update(pad) {
        if (!(pad instanceof Gamepad)) {
            throw new Error("Value must be a Gamepad");
        }

        this.connected = pad.connected;
        this.hand = pad.hand;
        this.pose = pad.pose;

        const self = gamepadStates.get(this);

        for (let b = 0; b < pad.buttons.length; ++b) {
            const wasPressed = self.btnState[b],
                pressed = pad.buttons[b].pressed;
            if (pressed !== wasPressed) {
                self.btnState[b] = pressed;
                this.dispatchEvent((pressed
                    ? self.btnDownEvts
                    : self.btnUpEvts)[b]);
            }

            this.lastButtons[b] = this.buttons[b];
            this.buttons[b] = pad.buttons[b];
        }

        for (let a = 0; a < pad.axes.length; ++a) {
            const wasMaxed = self.axisMaxed[a],
                val = pad.axes[a],
                dir = Math.sign(val),
                mag = Math.abs(val),
                maxed = mag >= this.axisThresholdMax,
                mined = mag <= this.axisThresholdMin;
            if (maxed && !wasMaxed) {
                this.dispatchEvent(self.axisMaxEvts[a]);
            }

            this.axes[a] = dir * (maxed ? 1 : (mined ? 0 : mag));
        }

        for (let a = 0; a < this.axes.length - 1; a += 2) {
            const stick = self.sticks[a / 2];
            stick.x = this.axes[a];
            stick.y = this.axes[a + 1];
        }

        if (pad.hapticActuators !== undefined) {
            for (let h = 0; h < pad.hapticActuators.length; ++h) {
                this.hapticActuators[h] = pad.hapticActuators[h];
            }
        }
    }
}

const tickEvt = Object.assign(new Event("tick"), {
    dt: 0
});

class BaseTimer extends EventTarget {

    /**
     * 
     * @param {number} targetFrameRate
     */
    constructor(targetFrameRate) {
        super();
        this._lt = 0;
        this._timer = null;
        this.targetFrameRate = targetFrameRate;
    }

    /**
     * 
     * @param {number} dt
     */
    _onTick(dt) {
        tickEvt.dt = dt;
        this.dispatchEvent(tickEvt);
    }

    restart() {
        this.stop();
        this.start();
    }

    get isRunning() {
        return this._timer !== null;
    }

    start() {
        throw new Error("Not implemented in base class");
    }

    stop() {
        this._timer = null;
    }

    /** @type {number} */
    get targetFrameRate() {
        return this._targetFPS;
    }

    set targetFrameRate(fps) {
        this._targetFPS = fps;
        this._frameTime = 1000 / fps;
    }
}

class RequestAnimationFrameTimer extends BaseTimer {
    constructor() {
        super(60);
    }

    start() {
        const updater = (t) => {
            const dt = t - this._lt;
            this._lt = t;
            this._timer = requestAnimationFrame(updater);
            this._onTick(dt);
        };
        this._lt = performance.now();
        this._timer = requestAnimationFrame(updater);
    }

    stop() {
        if (this.isRunning) {
            cancelAnimationFrame(this._timer);
            super.stop();
        }
    }

    get targetFrameRate() {
        return super.targetFrameRate;
    }

    set targetFrameRate(fps) {
        console.warn("You cannot change the target framerate for requestAnimationFrame");
    }
}

const inputBindingChangedEvt = new Event("inputBindingChanged");

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

            ["gpAxisLeftRight", 0],
            ["gpAxisUpDown", 1],

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

        this.clone = () => {
            const c = {};
            for (let kp of bindings.entries()) {
                c[kp[0]] = kp[1];
            }
            return c;
        };

        Object.freeze(this);
    }
}

const keyWidthStyle = style({ width: "7em" }),
    numberWidthStyle = style({ width: "3em" }),
    avatarUrlChangedEvt = new Event("avatarURLChanged"),
    gamepadChangedEvt = new Event("gamepadChanged"),
    selectAvatarEvt = new Event("selectAvatar"),
    fontSizeChangedEvt = new Event("fontSizeChanged"),
    inputBindingChangedEvt$1 = new Event("inputBindingChanged"),
    audioPropsChangedEvt = new Event("audioPropertiesChanged"),
    toggleDrawHearingEvt = new Event("toggleDrawHearing"),
    audioInputChangedEvt = new Event("audioInputChanged"),
    audioOutputChangedEvt = new Event("audioOutputChanged"),
    videoInputChangedEvt = new Event("videoInputChanged"),
    gamepadButtonUpEvt = Object.assign(new Event("gamepadbuttonup"), {
        button: 0
    }),
    gamepadAxisMaxedEvt = Object.assign(new Event("gamepadaxismaxed"), {
        axis: 0
    }),
    selfs$1 = new Map();

class OptionsForm extends FormDialog {
    constructor() {
        super("options", "Options");

        const _ = (evt) => () => this.dispatchEvent(evt);

        const self = {
            inputBinding: new InputBinding(),
            timer: new RequestAnimationFrameTimer(),

            /** @type {EventedGamepad} */
            pad: null
        };

        selfs$1.set(this, self);

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

        const makeGamepadButtonBinder = (id, label) => {
            const gp = LabeledInput(
                id,
                "text",
                label,
                numberWidthStyle);
            this.addEventListener("gamepadbuttonup", (evt) => {
                if (document.activeElement === gp.input) {
                    gp.value
                        = self.inputBinding[id]
                        = evt.button;
                    this.dispatchEvent(inputBindingChangedEvt$1);
                }
            });
            gp.value = self.inputBinding[id];
            return gp;
        };

        const makeGamepadAxisBinder = (id, label) => {
            const gp = LabeledInput(
                id,
                "text",
                label,
                numberWidthStyle);
            this.addEventListener("gamepadaxismaxed", (evt) => {
                if (document.activeElement === gp.input) {
                    gp.value
                        = self.inputBinding[id]
                        = evt.axis;
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
                    onInput(_(fontSizeChangedEvt))),
                P(
                    this.drawHearingCheck = LabeledInput(
                        "drawHearing",
                        "checkbox",
                        "Draw hearing range: ",
                        onInput(() => {
                            this.drawHearing = !this.drawHearing;
                            this.dispatchEvent(toggleDrawHearingEvt);
                        })),
                    this.audioMinInput = LabeledInput(
                        "minAudio",
                        "number",
                        "Min: ",
                        value(1),
                        min(0),
                        max(100),
                        numberWidthStyle,
                        audioPropsChanged),
                    this.audioMaxInput = LabeledInput(
                        "maxAudio",
                        "number",
                        "Min: ",
                        value(10),
                        min(0),
                        max(100),
                        numberWidthStyle,
                        audioPropsChanged),
                    this.audioRolloffInput = LabeledInput(
                        "rollof",
                        "number",
                        "Rollof: ",
                        value(1),
                        min(0.1),
                        max(10),
                        step(0.1),
                        numberWidthStyle,
                        audioPropsChanged))),

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
                this.gpAxisLeftRight = makeGamepadAxisBinder("gpAxisLeftRight", "Left/Right axis:"),
                this.gpAxisUpDown = makeGamepadAxisBinder("gpAxisUpDown", "Up/Down axis:"),
                this.gpButtonUp = makeGamepadButtonBinder("gpButtonUp", "Up button: "),
                this.gpButtonDown = makeGamepadButtonBinder("gpButtonDown", "Down button: "),
                this.gpButtonLeft = makeGamepadButtonBinder("gpButtonLeft", "Left button: "),
                this.gpButtonRight = makeGamepadButtonBinder("gpButtonRight", "Right button: "),
                this.gpButtonEmote = makeGamepadButtonBinder("gpButtonEmote", "Emote button: "),
                this.gpButtonToggleAudio = makeGamepadButtonBinder("gpButtonToggleAudio", "Toggle audio button: ")),

            OptionPanel("devices", "Devices",
                this.videoInputSelect = LabeledSelectBox(
                    "videoInputDevices",
                    "Video Input: ",
                    "No video input",
                    d => d.deviceId,
                    d => d.label,
                    onInput(_(videoInputChangedEvt))),
                this.audioInputSelect = LabeledSelectBox(
                    "audioInputDevices",
                    "Audio Input: ",
                    "No audio input",
                    d => d.deviceId,
                    d => d.label,
                    onInput(_(audioInputChangedEvt))),
                this.audioOutputSelect = LabeledSelectBox(
                    "audioOutputDevices",
                    "Audio Output: ",
                    "No audio output",
                    d => d.deviceId,
                    d => d.label,
                    onInput(_(audioOutputChangedEvt))))
        ];

        const cols = [];
        for (let i = 0; i < panels.length; ++i) {
            cols[i] = "1fr";
            panels[i].element.style.gridColumnStart = i + 1;
            panels[i].button.style.fontSize = "3.5vw";
        }

        Object.assign(this.header.style, {
            display: "grid",
            gridTemplateColumns: cols.join(" ")
        });

        this.header.append(...panels.map(p => p.button));
        this.content.append(...panels.map(p => p.element));
        style({
            backgroundColor: "#ddd",
            borderLeft: "solid 2px black",
            borderRight: "solid 2px black",
            borderBottom: "solid 2px black"
        }).apply(this.content);
        this.footer.append(
            this.confirmButton = Button(
                className("confirm"),
                "Close",
                onClick(() => this.hide())));

        const showPanel = (p) =>
            () => {
                for (let i = 0; i < panels.length; ++i) {
                    panels[i].visible = i === p;
                }

                const isGamepad = panels[p].id === "gamepad";
                if (self.timer.isRunning !== isGamepad) {
                    if (isGamepad) {
                        self.timer.start();
                    }
                    else {
                        self.timer.stop();
                    }
                }
            };

        for (let i = 0; i < panels.length; ++i) {
            panels[i].visible = i === 0;
            panels[i].addEventListener("select", showPanel(i));
        }

        self.inputBinding.addEventListener("inputBindingChanged", () => {
            for (let id of Object.getOwnPropertyNames(self.inputBinding)) {
                if (value[id] !== undefined
                    && this[id] != undefined) {
                    this[id].value = value[id];
                }
            }
        });

        self.timer.addEventListener("tick", () => {
            const pad = this.currentGamepad;
            if (pad) {
                if (self.pad) {
                    self.pad.update(pad);
                }
                else {
                    self.pad = new EventedGamepad(pad);
                    self.pad.addEventListener("gamepadbuttonup", (evt) => {
                        gamepadButtonUpEvt.button = evt.button;
                        this.dispatchEvent(gamepadButtonUpEvt);
                    });
                    self.pad.addEventListener("gamepadaxismaxed", (evt) => {
                        gamepadAxisMaxedEvt.axis = evt.axis;
                        this.dispatchEvent(gamepadAxisMaxedEvt);
                    });
                }
            }
        });

        this.gamepads = [];
        this.audioInputDevices = [];
        this.audioOutputDevices = [];
        this.videoInputDevices = [];

        this._drawHearing = false;
        this._avatarEmoji = null;

        Object.seal(this);
    }

    get avatarEmoji() {
        return this._avatarEmoji;
    }

    set avatarEmoji(e) {
        this._avatarEmoji = e;
        clear(this.avatarEmojiPreview);
        this.avatarEmojiPreview.append(Span(
            title(e && e.desc || "(None)"),
            e && e.value || "N/A"));
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
    }

    get inputBinding() {
        const self = selfs$1.get(this);
        return self.inputBinding.clone();
    }

    set inputBinding(value) {
        const self = selfs$1.get(this);
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

    get currentGamepadIndex() {
        return this.gpSelect.selectedIndex;
    }

    get currentGamepad() {
        if (this.currentGamepadIndex < 0) {
            return null;
        }
        else {
            return navigator.getGamepads()[this.currentGamepadIndex];
        }
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

    get gamepads() {
        return this.gpSelect.getValues();
    }

    set gamepads(values) {
        const disable = values.length === 0;
        this.gpSelect.values = values;
        this.gpAxisLeftRight.setLocked(disable);
        this.gpAxisUpDown.setLocked(disable);
        this.gpButtonUp.setLocked(disable);
        this.gpButtonDown.setLocked(disable);
        this.gpButtonLeft.setLocked(disable);
        this.gpButtonRight.setLocked(disable);
        this.gpButtonEmote.setLocked(disable);
        this.gpButtonToggleAudio.setLocked(disable);
    }

    get gamepadIndex() {
        return this.gpSelect.selectedIndex;
    }

    set gamepadIndex(value) {
        this.gpSelect.selectedIndex = value;
    }

    get drawHearing() {
        return this._drawHearing;
    }

    set drawHearing(value) {
        this._drawHearing = value;
        this.drawHearingCheck.checked = value;
    }

    get audioDistanceMin() {
        const value = parseFloat(this.audioMinInput.value);
        if (isGoodNumber(value)) {
            return value;
        }
        else {
            return 1;
        }
    }

    set audioDistanceMin(value) {
        if (isGoodNumber(value)
            && value > 0) {
            this.audioMinInput.value = value;
            if (this.audioDistanceMin > this.audioDistanceMax) {
                this.audioDistanceMax = this.audioDistanceMin;
            }
        }
    }


    get audioDistanceMax() {
        const value = parseFloat(this.audioMaxInput.value);
        if (isGoodNumber(value)) {
            return value;
        }
        else {
            return 10;
        }
    }

    set audioDistanceMax(value) {
        if (isGoodNumber(value)
            && value > 0) {
            this.audioMaxInput.value = value;
            if (this.audioDistanceMin > this.audioDistanceMax) {
                this.audioDistanceMin = this.audioDistanceMax;
            }
        }
    }


    get audioRolloff() {
        const value = parseFloat(this.audioRolloffInput.value);
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
            this.audioRolloffInput.value = value;
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

class BasePosition {
    /** 
     *  The horizontal component of the position.
     *  @type {number} */
    get x() {
        throw new Error("Not implemented in base class.");
    }

    /** 
     *  The vertical component of the position.
     *  @type {number} */
    get y() {
        throw new Error("Not implemented in base class.");
    }

    /**
     * Set the target position for the time `t + dt`.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     * @param {number} t
     * @param {number} dt
     */
    setTarget(x, y, t, dt) {
        throw new Error("Not implemented in base class.");
    }

    /**
     * Update the position.
     * @param {number} t - the current time, in seconds
     */
    update(t) {
    }
}

/**
 * A position value that is blended from the current position to
 * a target position over time.
 */
class InterpolatedPosition extends BasePosition {

    /**
     * Creates a new position value that is blended from the current position to
     * a target position over time.
     **/
    constructor() {
        super();

        this._st
            = this._et
            = 0;
        this._x
            = this._tx
            = this._sx
            = 0;
        this._y
            = this._ty
            = this._sy
            = 0;
    }

    /**
     *  The horizontal component of the position.
     *  @type {number} */
    get x() {
        return this._x;
    }

    /**
     *  The vertical component of the position.
     *  @type {number} */
    get y() {
        return this._y;
    }

    /**
     * Set the target position for the time `t + dt`.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     * @param {number} t
     * @param {number} dt
     */
    setTarget(x, y, t, dt) {
        this._st = t;
        this._et = t + dt;
        this._sx = this._x;
        this._sy = this._y;
        this._tx = x;
        this._ty = y;
    }

    /**
     * Calculates the new position for the given time.
     * @protected
     * @param {number} t
     */
    update(t) {
        if (this._st !== this._et) {
            const p = project(t, this._st, this._et);
            const q = clamp(p, 0, 1);
            this._x = lerp(this._sx, this._tx, q);
            this._y = lerp(this._sy, this._ty, q);
        }
        else {
            this._x = this._sx = this._tx;
            this._y = this._sy = this._ty;
        }
    }
}

/**
 * A base class for different types of avatars.
 **/
class BaseAvatar {

    /**
     * Encapsulates a resource to use as an avatar.
     * @param {Image|Video|Emoji} element
     */
    constructor(element) {
        this.element = element;
    }

    /** 
     *  Is the avatar able to run on water?
     *  @type {boolean} 
     **/
    get canSwim() {
        return false;
    }

    /**
     * Render the avatar at a certain size.
     * @param {CanvasRenderingContext2D} g - the context to render to
     * @param {number} width - the width the avatar should be rendered at
     * @param {number} height - the height the avatar should be rendered at.
     * @param {boolean} isMe - whether the avatar is the local user
     */
    draw(g, width, height, isMe) {
        throw new Error("Not implemented in base class");
    }
}

/**
 * Types of avatars.
 * @enum {string}
 **/
const AvatarMode = Object.freeze({
    none: null,
    emoji: "emoji",
    photo: "photo",
    video: "video"
});

const selfs$2 = new Map();

/**
 * An avatar that uses a Unicode emoji as its representation
 **/
class EmojiAvatar extends BaseAvatar {

    /**
     * Creatse a new avatar that uses a Unicode emoji as its representation.
     * @param {Emoji} emoji
     */
    constructor(emoji) {
        super(Span(
            title(emoji.desc),
            emoji.value));

        const self = {
            canSwim: isSurfer(emoji),
            x: 0,
            y: 0,
            aspectRatio: null
        };

        this.value = emoji.value;
        this.desc = emoji.desc;

        selfs$2.set(this, self);
    }

    /**
     *  Is the avatar able to run on water?
     *  @type {boolean}
     **/
    get canSwim() {
        return selfs$2.get(this).canSwim;
    }

    /**
     * Render the avatar at a certain size.
     * @param {CanvasRenderingContext2D} g - the context to render to
     * @param {number} width - the width the avatar should be rendered at
     * @param {number} height - the height the avatar should be rendered at.
     * @param {boolean} isMe - whether the avatar is the local user
     */
    draw(g, width, height, isMe) {
        const self = selfs$2.get(this);

        if (self.aspectRatio === null) {
            const oldFont = g.font;
            const size = 100;
            g.font = size + "px sans-serif";
            const metrics = g.measureText(this.value);
            self.aspectRatio = metrics.width / size;
            self.x = (size - metrics.width) / 2;
            self.y = metrics.actualBoundingBoxAscent / 2;

            self.x /= size;
            self.y /= size;

            g.font = oldFont;
        }

        if (self.aspectRatio !== null) {
            const fontHeight = self.aspectRatio <= 1
                ? height
                : width / self.aspectRatio;

            g.font = fontHeight + "px sans-serif";
            g.fillText(this.value, self.x * fontHeight, self.y * fontHeight);
        }
    }
}

/**
 * An avatar that uses an Image as its representation.
 **/
class PhotoAvatar extends BaseAvatar {

    /**
     * Creates a new avatar that uses an Image as its representation.
     * @param {(URL|string)} url
     */
    constructor(url) {
        super(Canvas());

        /** @type {HTMLCanvasElement} */
        this.element = null;

        const img = new Image();
        img.addEventListener("load", (evt) => {
            this.element.width = img.width;
            this.element.height = img.height;
            const g = this.element.getContext("2d");
            g.clearRect(0, 0, img.width, img.height);
            g.imageSmoothingEnabled = false;
            g.drawImage(img, 0, 0);
        });

        /** @type {string} */
        this.url
            = img.src
            = url && url.href || url;
    }

    /**
     * Render the avatar at a certain size.
     * @param {CanvasRenderingContext2D} g - the context to render to
     * @param {number} width - the width the avatar should be rendered at
     * @param {number} height - the height the avatar should be rendered at.
     * @param {boolean} isMe - whether the avatar is the local user
     */
    draw(g, width, height, isMe) {
        const offset = (this.element.width - this.element.height) / 2,
            sx = Math.max(0, offset),
            sy = Math.max(0, -offset),
            dim = Math.min(this.element.width, this.element.height);
        g.drawImage(
            this.element,
            sx, sy,
            dim, dim,
            0, 0,
            width, height);
    }
}

/**
 * An avatar that uses an HTML Video element as its representation.
 **/
class VideoAvatar extends BaseAvatar {
    /**
     * Creates a new avatar that uses an HTML Video element as its representation.
     * @param {HTMLVideoElement} video
     */
    constructor(video) {
        super(video);
        video.volume = 0;
        video.muted = true;
        video.play();
        video.once("canplay")
            .then(() => video.play());
    }

    /**
     * Render the avatar at a certain size.
     * @param {CanvasRenderingContext2D} g - the context to render to
     * @param {number} width - the width the avatar should be rendered at
     * @param {number} height - the height the avatar should be rendered at.
     * @param {boolean} isMe - whether the avatar is the local user
     */
    draw(g, width, height, isMe) {
        if (this.element !== null) {
            const offset = (this.element.videoWidth - this.element.videoHeight) / 2,
                sx = Math.max(0, offset),
                sy = Math.max(0, -offset),
                dim = Math.min(this.element.videoWidth, this.element.videoHeight),
                hWidth = width / 2;

            g.save();
            {
                g.translate(hWidth, 0);
                if (isMe) {
                    g.scale(-1, 1);
                }
                g.drawImage(
                    this.element,
                    sx, sy,
                    dim, dim,
                    -hWidth, 0,
                    width, height);
            }
            g.restore();
        }
    }
}

const POSITION_REQUEST_DEBOUNCE_TIME = 1,
    STACKED_USER_OFFSET_X = 5,
    STACKED_USER_OFFSET_Y = 5,
    eventNames = ["userMoved", "userPositionNeeded"];

class User extends EventTarget {
    constructor(evt, isMe) {
        super();

        this.id = evt.id;
        this.displayName = evt.displayName;
        this.label = isMe ? "(Me)" : `(${this.id})`;

        this.moveEvent = new UserMoveEvent(this.id);
        this.position = new InterpolatedPosition();

        /** @type {AvatarMode} */
        this.setAvatarVideo(null);
        this.setAvatarImage(null);
        this.setAvatarEmoji(isMe ? allPeople.random() : bust);

        this.audioMuted = false;
        this.videoMuted = true;
        this.isMe = isMe;
        this.isActive = false;
        this.stackUserCount = 1;
        this.stackIndex = 0;
        this.stackAvatarHeight = 0;
        this.stackAvatarWidth = 0;
        this.stackOffsetX = 0;
        this.stackOffsetY = 0;
        this.isInitialized = isMe;
        this.lastPositionRequestTime = performance.now() / 1000 - POSITION_REQUEST_DEBOUNCE_TIME;
        this.visible = true;
    }

    deserialize(evt) {
        if (evt.displayName) {
            this.displayName = evt.displayName;
        }

        switch (evt.avatarMode) {
            case AvatarMode.emoji:
                this.setAvatarEmoji(evt.avatarID);
                break;
            case AvatarMode.photo:
                this.setAvatarImage(evt.avatarID);
                break;
        }

        if (isNumber(evt.x)
            && isNumber(evt.y)) {
            this.position.setTarget(evt.x, evt.y, performance.now() / 1000, 0);
            this.isInitialized = true;
        }
    }

    serialize() {
        return {
            id: this.id,
            x: this.position._tx,
            y: this.position._ty,
            displayName: this.displayName,
            avatarMode: this.avatarMode,
            avatarID: this.avatarID
        };
    }

    /**
     * An avatar using a live video.
     * @type {PhotoAvatar}
     **/
    get avatarVideo() {
        return this._avatarVideo;
    }

    /**
     * Set the current video element used as the avatar.
     * @param {Video}
     **/
    setAvatarVideo(video) {
        if (video instanceof HTMLVideoElement) {
            this._avatarVideo = new VideoAvatar(video);
        }
        else {
            this._avatarVideo = null;
        }
    }

    /**
     * An avatar using a photo
     * @type {PhotoAvatar}
     **/
    get avatarImage() {
        return this._avatarImage;
    }

    /**
     * Set the URL of the photo to use as an avatar.
     * @param {string} url
     */
    setAvatarImage(url) {
        if (isString(url)) {
            this._avatarImage = new PhotoAvatar(url);
        }
        else {
            this._avatarImage = null;
        }
    }

    /**
     * An avatar using a Unicode emoji.
     * @type {EmojiAvatar}
     **/
    get avatarEmoji() {
        return this._avatarEmoji;
    }

    /**
     * Set the emoji to use as an avatar.
     * @param {Emoji} emoji
     */
    setAvatarEmoji(emoji) {
        if (emoji
            && emoji.value
            && emoji.desc) {
            this._avatarEmoji = new EmojiAvatar(emoji);
        }
        else {
            this._avatarEmoji = null;
        }
    }

    /**
     * Returns the type of avatar that is currently active.
     * @returns {AvatarMode}
     **/
    get avatarMode() {
        if (this.avatarVideo) {
            return AvatarMode.video;
        }
        else if (this.avatarPhoto) {
            return AvatarMode.photo;
        }
        else if (this.avatarEmoji) {
            return AvatarMode.emoji;
        }
        else {
            return AvatarMode.none;
        }
    }

    /**
     * Returns a serialized representation of the current avatar,
     * if such a representation exists.
     * @returns {string}
     **/
    get avatarID() {
        switch (this.avatarMode) {
            case AvatarMode.emoji:
                return { value: this.avatarEmoji.value, desc: this.avatarEmoji.desc };
            case AvatarMode.photo:
                return this.avatarImage.url;
            default:
                return null;
        }
    }

    /**
     * Returns the current avatar
     * @returns {BaseAvatar}
     **/
    get avatar() {
        switch (this.avatarMode) {
            case AvatarMode.emoji:
                return this.avatarEmoji;
            case AvatarMode.photo:
                return this.avatarImage;
            case AvatarMode.video:
                return this.avatarVideo;
            default:
                return null;
        }
    }

    addEventListener(evtName, func, opts) {
        if (eventNames.indexOf(evtName) === -1) {
            throw new Error(`Unrecognized event type: ${evtName}`);
        }

        super.addEventListener(evtName, func, opts);
    }

    setDisplayName(name) {
        this.displayName = name;
    }

    moveTo(x, y, dt) {
        if (this.isInitialized) {
            if (this.isMe) {
                this.moveEvent.set(x, y);
                this.dispatchEvent(this.moveEvent);
            }

            this.position.setTarget(x, y, performance.now() / 1000, dt);
        }
    }

    update(map, users) {
        const t = performance.now() / 1000;

        if (!this.isInitialized) {
            const dt = t - this.lastPositionRequestTime;
            if (dt >= POSITION_REQUEST_DEBOUNCE_TIME) {
                this.lastPositionRequestTime = t;
                this.dispatchEvent(new UserPositionNeededEvent(this.id));
            }
        }

        this.position.update(t);

        this.stackUserCount = 0;
        this.stackIndex = 0;
        for (let user of users.values()) {
            if (user.position._tx === this.position._tx
                && user.position._ty === this.position._ty) {
                if (user.id === this.id) {
                    this.stackIndex = this.stackUserCount;
                }
                ++this.stackUserCount;
            }
        }

        this.stackAvatarWidth = map.tileWidth - (this.stackUserCount - 1) * STACKED_USER_OFFSET_X;
        this.stackAvatarHeight = map.tileHeight - (this.stackUserCount - 1) * STACKED_USER_OFFSET_Y;
        this.stackOffsetX = this.stackIndex * STACKED_USER_OFFSET_X;
        this.stackOffsetY = this.stackIndex * STACKED_USER_OFFSET_Y;
    }

    drawShadow(g, map, cameraZ) {
        const x = this.position.x * map.tileWidth,
            y = this.position.y * map.tileHeight,
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
            this.position.x * map.tileWidth + this.stackOffsetX,
            this.position.y * map.tileHeight + this.stackOffsetY);
        g.fillStyle = "black";
        g.textBaseline = "top";

        if (this.avatar) {
            this.avatar.draw(g, this.stackAvatarWidth, this.stackAvatarHeight, this.isMe);
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
            if (!this.videoMuted && !(this.avatar instanceof VideoAvatar)) {
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
                    this.position.x * map.tileWidth + this.stackOffsetX,
                    this.position.y * map.tileHeight + this.stackOffsetY);
                g.shadowColor = "black";
                g.shadowOffsetX = 3 * cameraZ;
                g.shadowOffsetY = 3 * cameraZ;
                g.shadowBlur = 3 * cameraZ;

                g.fillStyle = "white";
                g.textBaseline = "bottom";
                g.font = `${fontSize * devicePixelRatio}pt sans-serif`;
                g.fillText(this.displayName || this.label, 0, 0);
            }
            g.restore();
        }
    }

    drawHearingTile(g, map, dx, dy, p) {
        g.save();
        {
            g.translate(
                (this.position._tx + dx) * map.tileWidth,
                (this.position._ty + dy) * map.tileHeight);
            g.strokeStyle = `rgba(0, 255, 0, ${(1 - p) / 2})`;
            g.strokeRect(0, 0, map.tileWidth, map.tileHeight);
        }
        g.restore();
    }

    drawHearingRange(g, map, cameraZ, minDist, maxDist) {
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

function bg(backgroundColor) {
    return style({ backgroundColor });
}

function z(zIndex) {
    return style({ zIndex });
}

const newRowColor = bg("lightgreen");
const hoveredColor = bg("rgba(65, 255, 202, 0.25)");
const unhoveredColor = bg("transparent");
const avatarSize = style({ height: "32px" });
const warpToEvt = Object.assign(
    new Event("warpTo"),
    {
        id: null
    });

const ROW_TIMEOUT = 3000;

class UserDirectoryForm extends FormDialog {

    constructor() {
        super("users", "Users");

        /** @type {Map.<string, Element[]>} */
        this.rows = new Map();

        this.content.append(
            this.table = Div(
                style({
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gridTemplateRows: "min-content",
                    columnGap: "5px",
                    width: "100%"
                })));
    }

    /**
     * 
     * @param {User} user
     */
    set(user, isNew = false) {
        this.delete(user.id);
        const row = this.rows.size + 1;

        if (isNew) {
            const elem = Div(
                grid(1, row, 2, 1),
                z(-1),
                newRowColor);
            setTimeout(() => {
                this.table.removeChild(elem);
            }, ROW_TIMEOUT);
            this.table.append(elem);
        }

        let avatar = "N/A";
        if (user.avatar && user.avatar.element) {
            avatar = user.avatar.element;
            avatarSize.apply(avatar);
        }

        const elems = [
            Div(grid(1, row), z(0), avatar),
            Div(grid(2, row), z(0), user.displayName),
            Div(
                grid(1, row, 2, 1), z(1),
                unhoveredColor,
                onMouseOver(function () {
                    hoveredColor.apply(this);
                }),
                onMouseOut(function () {
                    unhoveredColor.apply(this);
                }),
                onClick(() => {
                    warpToEvt.id = user.id;
                    this.dispatchEvent(warpToEvt);
                }))];

        this.rows.set(user.id, elems);
        this.table.append(...elems);
    }

    delete(userID) {
        if (this.rows.has(userID)) {
            const elems = this.rows.get(userID);
            this.rows.delete(userID);
            for (let elem of elems) {
                this.table.removeChild(elem);
            }

            let rowCount = 1;
            for (let elems of this.rows.values()) {
                const r = row(rowCount++);
                for (let elem of elems) {
                    r.apply(elem);
                }
            }
        }
    }

    clear() {
        for (let id of this.rows.keys()) {
            this.delete(id);
        }
    }

    warn(...rest) {
        const elem = Div(
            grid(1, this.rows.size + 1, 2, 1),
            bg("yellow"),
            ...rest.map(i => i.toString()));

        this.table.append(elem);

        setTimeout(() => {
            this.table.removeChild(elem);
        }, 5000);
    }

    async showAsync() {
        this.show();
        await this.confirmButton.once("click");
        return false;
    }
}

const EMOJI_LIFE = 5;

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

/**
 * Returns true if the given object is either an HTMLCanvasElement or an OffscreenCanvas.
 * @param {any} obj
 * @returns {boolean}
 */

/**
 * Resizes a canvas element
 * @param {HTMLCanvasElement|OffscreenCanvas} canv
 * @param {number} w - the new width of the canvas
 * @param {number} h - the new height of the canvas
 * @param {number} [superscale=1] - a value by which to scale width and height to achieve supersampling. Defaults to 1.
 * @returns {boolean} - true, if the canvas size changed, false if the given size (with super sampling) resulted in the same size.
 */
function setCanvasSize(canv, w, h, superscale = 1) {
    w = Math.floor(w * superscale);
    h = Math.floor(h * superscale);
    if (canv.width != w
        || canv.height != h) {
        canv.width = w;
        canv.height = h;
        return true;
    }
    return false;
}

/**
 * Resizes a canvas element to match the proportions of the size of the element in the DOM.
 * @param {HTMLCanvasElement} canv
 * @param {number} [superscale=1] - a value by which to scale width and height to achieve supersampling. Defaults to 1.
 * @returns {boolean} - true, if the canvas size changed, false if the given size (with super sampling) resulted in the same size.
 */
function resizeCanvas(canv, superscale = 1) {
    return setCanvasSize(
        canv,
        canv.clientWidth,
        canv.clientHeight,
        superscale);
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
            || isSurfer(avatar);
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

    getClearTileNear(x, y, maxRadius, avatar) {
        for (let r = 1; r <= maxRadius; ++r) {
            for (let dx = -r; dx <= r; ++dx) {
                const dy1 = r - Math.abs(dx);
                const dy2 = -dy1;
                const tx = x + dx;
                const ty1 = y + dy1;
                const ty2 = y + dy2;

                if (this.isClear(tx, ty1, avatar)) {
                    return { x: tx, y: ty1 };
                }
                else if (this.isClear(tx, ty2, avatar)) {
                    return { x: tx, y: ty2 };
                }
            }
        }

        return { x, y };
    }
}

const CAMERA_LERP = 0.01,
    CAMERA_ZOOM_MAX = 8,
    CAMERA_ZOOM_MIN = 0.1,
    CAMERA_ZOOM_SHAPE = 1 / 4,
    CAMERA_ZOOM_SPEED = 0.005,
    MAX_DRAG_DISTANCE = 5,
    MOVE_REPEAT = 0.125,
    isFirefox = typeof InstallTrigger !== "undefined",
    gameStartedEvt = new Event("gameStarted"),
    gameEndedEvt = new Event("gameEnded"),
    zoomChangedEvt = new Event("zoomChanged"),
    emojiNeededEvt = new Event("emojiNeeded"),
    toggleAudioEvt$1 = new Event("toggleAudio"),
    toggleVideoEvt$1 = new Event("toggleVideo"),
    emoteEvt$1 = Object.assign(new Event("emote"), {
        id: null,
        emoji: null
    }),
    userJoinedEvt = Object.assign(new Event("userJoined", {
        user: null
    }));

/** @type {Map.<Game, EventedGamepad>} */
const gamepads = new Map();

class Game extends EventTarget {

    constructor() {
        super();

        this.element = Canvas(
            id("frontBuffer"),
            style({
                width: "100%",
                height: "100%",
                touchAction: "none"
            }));
        this.gFront = this.element.getContext("2d");

        this.me = null;
        this.map = null;
        this.keys = {};

        /** @type {Map.<string, User>} */
        this.users = new Map();

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

        /** @type {Emote[]} */
        this.emotes = [];

        this.inputBinding = {
            keyButtonUp: "ArrowUp",
            keyButtonDown: "ArrowDown",
            keyButtonLeft: "ArrowLeft",
            keyButtonRight: "ArrowRight",
            keyButtonEmote: "e",
            keyButtonToggleAudio: "a",

            gpAxisLeftRight: 0,
            gpAxisUpDown: 1,

            gpButtonUp: 12,
            gpButtonDown: 13,
            gpButtonLeft: 14,
            gpButtonRight: 15,
            gpButtonEmote: 0,
            gpButtonToggleAudio: 1
        };

        this.lastGamepadIndex = -1;
        this.gamepadIndex = -1;
        this.transitionSpeed = 0.125;


        // ============= KEYBOARD =================

        addEventListener("keydown", (evt) => {
            this.keys[evt.key] = evt;
            if (!evt.ctrlKey
                && !evt.altKey
                && !evt.shiftKey
                && !evt.metaKey
                && evt.key === this.inputBinding.keyButtonToggleAudio
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
                    dx = tile.x - this.me.position._tx,
                    dy = tile.y - this.me.position._ty;

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
                arrayRemoveAt(this.pointers, idx);
            }

            return pointer;
        });

        // ============= POINTERS =================

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
        if (this.users.has(evt.id)) {
            const user = this.users.get(evt.id);
            user.isActive = evt.isActive;
        }
    }

    emote(id, emoji) {
        if (this.users.has(id)) {
            const user = this.users.get(id);
            if (user.isMe) {

                emoji = emoji
                    || this.currentEmoji;

                if (!emoji) {
                    this.dispatchEvent(emojiNeededEvt);
                }
                else {
                    emoteEvt$1.emoji = this.currentEmoji = emoji;
                    this.dispatchEvent(emoteEvt$1);
                }
            }

            if (!!emoji) {
                this.emotes.push(new Emote(emoji, user.position.x + 0.5, user.position.y));
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

    moveMeTo(x, y) {
        if (this.map.isClear(x, y, this.me.avatar)) {
            this.me.moveTo(x, y, this.transitionSpeed);
            this.targetOffsetCameraX = 0;
            this.targetOffsetCameraY = 0;
        }
    }


    moveMeBy(dx, dy) {
        const clearTile = this.map.getClearTile(this.me.position._tx, this.me.position._ty, dx, dy, this.me.avatar);
        this.moveMeTo(clearTile.x, clearTile.y);
    }

    warpMeTo(x, y) {
        const clearTile = this.map.getClearTileNear(x, y, 3, this.me.avatar);
        this.moveMeTo(clearTile.x, clearTile.y);
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
        if (this.users.has(evt.id)) {
            this.removeUser(evt);
        }

        const user = new User(evt, false);
        this.users.set(evt.id, user);

        userJoinedEvt.user = user;
        this.dispatchEvent(userJoinedEvt);
    }

    toggleMyAudio() {
        this.dispatchEvent(toggleAudioEvt$1);
    }

    toggleMyVideo() {
        this.dispatchEvent(toggleVideoEvt$1);
    }

    muteUserAudio(evt) {
        let mutingUser = this.me;
        if (!!evt.id && this.users.has(evt.id)) {
            mutingUser = this.users.get(evt.id);
        }

        if (!mutingUser) {
            console.warn("No user found to mute audio, retrying in 1 second.");
            setTimeout(this.muteUserAudio.bind(this, evt), 1000);
        }
        else {
            mutingUser.audioMuted = evt.muted;
        }
    }

    muteUserVideo(evt) {
        let mutingUser = this.me;
        if (!!evt.id && this.users.has(evt.id)) {
            mutingUser = this.users.get(evt.id);
        }

        if (!mutingUser) {
            console.warn("No user found to mute video, retrying in 1 second.");
            setTimeout(this.muteUserVideo.bind(this, evt), 1000);
        }
        else {
            mutingUser.videoMuted = evt.muted;
        }
    }

    withUser(id, callback, timeout) {
        if (timeout === undefined) {
            timeout = 5000;
        }
        if (!!id) {
            if (this.users.has(id)) {
                const user = this.users.get(id);
                callback(user);
            }
            else {
                console.warn("No user, trying again in a quarter second");
                if (timeout > 0) {
                    setTimeout(this.withUser.bind(this, id, callback, timeout - 250), 250);
                }
            }
        }
    }

    changeUserName(evt) {
        //evt = {
        //    id: string, // the id of the participant that changed his display name
        //    displayName: string // the new display name
        //};
        this.withUser(evt && evt.id, (user) => {
            user.setDisplayName(evt.displayName);
        });
    }

    removeUser(evt) {
        //evt = {
        //    id: "string" // the id of the participant
        //};
        this.withUser(evt && evt.id, (user) => {
            this.users.delete(user.id);
        });
    }

    setAvatarVideo(evt) {
        this.withUser(evt && evt.id, (user) => {
            user.setAvatarVideo(evt.element);
        });
    }

    setAvatarURL(evt) {
        //evt = {
        //  id: string, // the id of the participant that changed his avatar.
        //  avatarURL: string // the new avatar URL.
        //}
        this.withUser(evt && evt.id, (user) => {
            user.setAvatarImage(evt.avatarURL);
        });
    }

    setAvatarEmoji(evt) {
        //evt = {
        //  id: string, // the id of the participant that changed his avatar.
        //  value: string // the emoji text to use as the avatar.
        //  desc: string // a description of the emoji
        //}
        this.withUser(evt && evt.id, (user) => {
            user.setAvatarEmoji(evt);
        });
    }

    async startAsync(evt) {
        //evt = {
        //    roomName: "string", // the room name of the conference
        //    id: "string", // the id of the local participant
        //    displayName: "string", // the display name of the local participant
        //    avatarURL: "string" // the avatar URL of the local participant
        //};

        this.currentRoomName = evt.roomName.toLowerCase();
        this.me = new User(evt, true);
        this.users.set(evt.id, this.me);

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
        this.show();
        this.resize();
        this.element.focus();

        requestAnimationFrame((time) => {
            this.lastTime = time;
            requestAnimationFrame(this._loop);
        });
    }

    resize() {
        resizeCanvas(this.element, window.devicePixelRatio);
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
        this.users.clear();
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
                        case this.inputBinding.keyButtonUp: dy--; break;
                        case this.inputBinding.keyButtonDown: dy++; break;
                        case this.inputBinding.keyButtonLeft: dx--; break;
                        case this.inputBinding.keyButtonRight: dx++; break;
                        case this.inputBinding.keyButtonEmote: this.emote(this.me.id, this.currentEmoji); break;
                    }
                }
            }

            const gp = navigator.getGamepads()[this.gamepadIndex];
            if (gp) {
                if (!gamepads.has(this)) {
                    gamepads.set(this, new EventedGamepad(gp));
                }

                const pad = gamepads.get(this);
                pad.update(gp);

                if (pad.buttons[this.inputBinding.gpButtonEmote].pressed) {
                    this.emote(this.me.id, this.currentEmoji);
                }

                if (!pad.lastButtons[this.inputBinding.gpButtonToggleAudio].pressed
                    && pad.buttons[this.inputBinding.gpButtonToggleAudio].pressed) {
                    this.toggleMyAudio();
                }

                if (pad.buttons[this.inputBinding.gpButtonUp].pressed) {
                    --dy;
                }
                else if (pad.buttons[this.inputBinding.gpButtonDown].pressed) {
                    ++dy;
                }

                if (pad.buttons[this.inputBinding.gpButtonLeft].pressed) {
                    --dx;
                }
                else if (pad.buttons[this.inputBinding.gpButtonRight].pressed) {
                    ++dx;
                }

                dx += Math.round(pad.axes[this.inputBinding.gpAxisLeftRight]);
                dy += Math.round(pad.axes[this.inputBinding.gpAxisUpDown]);

                this.targetOffsetCameraX += -50 * Math.round(2 * pad.axes[2]);
                this.targetOffsetCameraY += -50 * Math.round(2 * pad.axes[3]);
                this.zoom(2 * (pad.buttons[6].value - pad.buttons[7].value));
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

        for (let user of this.users.values()) {
            user.update(this.map, this.users);
        }
    }

    render() {
        const targetCameraX = -this.me.position.x * this.map.tileWidth,
            targetCameraY = -this.me.position.y * this.map.tileHeight;

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

            for (let user of this.users.values()) {
                user.drawShadow(this.gFront, this.map, this.cameraZ);
            }

            for (let emote of this.emotes) {
                emote.drawShadow(this.gFront, this.map, this.cameraZ);
            }

            for (let user of this.users.values()) {
                user.drawAvatar(this.gFront, this.map);
            }

            this.drawCursor();

            for (let user of this.users.values()) {
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

/**
 * A base class for managers of audio sources, destinations, and their spatialization.
 **/
class BaseAudioClient extends EventTarget {

    /**
     * Creates a new manager of audio sources, destinations, and their spatialization.
     **/
    constructor() {
        super();
    }

    /** Perform the audio system initialization, after a user gesture */
    start() {
    }

    /**
     * Sets parameters that alter spatialization.
     * @param {number} minDistance
     * @param {number} maxDistance
     * @param {number} rolloff
     * @param {number} transitionTime
     */
    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        throw new Error("Not implemented in base class");
    }

    /**
     * Set the audio device used to play audio to the local user.
     * @param {string} deviceID
     */
    setAudioOutputDevice(deviceID) {
        throw new Error("Not implemented in base class");
    }

    /**
     * Remove a user from audio processing.
     * @param {string} id - the id of the user to remove
     */
    removeSource(id) {
        throw new Error("Not implemented in base class");
    }

    /**
     * Set the position of the listener.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     */
    setLocalPosition(x, y) {
        throw new Error("Not implemented in base class");
    }

    /**
     * Set the position of an audio source.
     * @param {string} id - the id of the user for which to set the position.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     */
    setUserPosition(id, x, y) {
        throw new Error("Not implemented in base class");
    }
}

/**
 * Indicates whether or not the current browser can change the destination device for audio output.
 * @constant
 * @type {boolean}
 **/
const canChangeAudioOutput = HTMLAudioElement.prototype["setSinkId"] instanceof Function;

// helps us filter out data channel messages that don't belong to us
const APP_FINGERPRINT$1
    = window.APP_FINGERPRINT
    = "Calla",
    eventNames$1 = [
        "userMoved",
        "emote",
        "userInitRequest",
        "userInitResponse",
        "audioMuteStatusChanged",
        "videoMuteStatusChanged",
        "videoConferenceJoined",
        "videoConferenceLeft",
        "participantJoined",
        "participantLeft",
        "avatarChanged",
        "displayNameChange",
        "audioActivity",
        "setAvatarEmoji",
        "deviceListChanged",
        "participantRoleChanged",
        "audioAdded",
        "videoAdded",
        "audioRemoved",
        "videoRemoved"
    ];

// Manages communication between Jitsi Meet and Calla
class BaseJitsiClient extends EventTarget {

    constructor() {
        super();

        this.hasAudioPermission = false;
        this.hasVideoPermission = false;

        /** @type {String} */
        this.localUser = null;

        /** @type {BaseAudioClient} */
        this.audioClient = null;

        this.preInitEvtQ = [];

        this.preferedAudioOutputID = null;
        this.preferedAudioInputID = null;
        this.preferedVideoInputID = null;
    }

    userIDs() {
        throw new Error("Not implemented in base class");
    }

    userExists(id) {
        throw new Error("Not implemented in base class");
    }

    users() {
        throw new Error("Not implemented in base class");
    }


    /**
     * 
     * @param {string} host
     * @param {string} roomName
     * @param {string} userName
     */
    async initializeAsync(host, roomName, userName) {
        throw new Error("Not implemented in base class.");
    }

    dispatchEvent(evt) {
        if (this.localUser !== null) {
            if (evt.id === null
                || evt.id === undefined
                || evt.id === "local") {
                evt.id = this.localUser;
            }

            super.dispatchEvent(evt);
            if (evt.type === "videoConferenceLeft") {
                this.localUser = null;
            }
        }
        else if (evt.type === "videoConferenceJoined") {
            this.localUser = evt.id;

            this.dispatchEvent(evt);
            for (evt of this.preInitEvtQ) {
                this.dispatchEvent(evt);
            }

            arrayClear(this.preInitEvtQ);
        }
        else {
            this.preInitEvtQ.push(evt);
        }
    }

    /**
     * 
     * @param {string} host
     * @param {string} roomName
     * @param {string} userName
     */
    async joinAsync(host, roomName, userName) {
        this.dispose();

        const joinTask = this.once("videoConferenceJoined");

        await this.initializeAsync(host, roomName, userName);

        window.addEventListener("unload", () => {
            this.dispose();
        });

        const joinInfo = await joinTask;

        this.setDisplayName(userName);

        await this.setPreferredDevicesAsync();

        return joinInfo;
    }

    async setPreferredDevicesAsync() {
        await this.setPreferredAudioOutputAsync();
        await this.setPreferredAudioInputAsync();
        await this.setPreferredVideoInputAsync();
    }

    async setPreferredVideoInputAsync() {
        const videoInput = await this.getVideoInputDevicesAsync();
        const vidIn = arrayScan(videoInput, (d) => d.deviceId === this.preferedVideoInputID);
        if (vidIn) {
            await this.setVideoInputDeviceAsync(vidIn);
        }
    }

    async setPreferredAudioInputAsync() {
        const audioInput = await this.getAudioInputDevicesAsync();
        const audIn = arrayScan(audioInput, (d) => d.deviceId === this.preferedAudioInputID, (d) => d.deviceId === "communications", (d) => d.deviceId === "default", (d) => d && d.deviceId);
        if (audIn) {
            await this.setAudioInputDeviceAsync(audIn);
        }
    }

    async setPreferredAudioOutputAsync() {
        const audioOutput = await this.getAudioOutputDevicesAsync();
        const audOut = arrayScan(audioOutput, (d) => d.deviceId === this.preferedAudioOutputID, (d) => d.deviceId === "communications", (d) => d.deviceId === "default", (d) => d && d.deviceId);
        if (audOut) {
            await this.setAudioOutputDeviceAsync(audOut);
        }
    }

    dispose() {
        this.leave();
    }

    /**
     * 
     * @param {string} userName
     */
    setDisplayName(userName) {
        throw new Error("Not implemented in base class");
    }

    async leaveAsync() {
        const leaveTask = this.once("videoConferenceLeft", 5000);
        const maybeLeaveTask = this.leave();
        if (maybeLeaveTask instanceof Promise) {
            await maybeLeaveTask;
        }
        return await leaveTask;
    }

    leave() {
        throw new Error("Not implemented in base class");
    }

    async _getDevicesAsync() {
        let devices = await navigator.mediaDevices.enumerateDevices();

        for (let device of devices) {
            if (device.deviceId.length > 0) {
                this.hasAudioPermission |= device.kind === "audioinput";
                this.hasVideoPermission |= device.kind === "videoinput";
            }
        }

        return devices;
    }

    async getAvailableDevicesAsync() {
        let devices = await this._getDevicesAsync();

        for (let i = 0; i < 3 && !this.hasAudioPermission; ++i) {
            devices = null;
            try {
                const _ = await navigator.mediaDevices.getUserMedia({ audio: !this.hasAudioPermission, video: !this.hasVideoPermission });
            }
            catch (exp) {
                console.warn(exp);
            }

            devices = await this._getDevicesAsync();
        }

        return {
            audioOutput: canChangeAudioOutput ? devices.filter(d => d.kind === "audiooutput") : [],
            audioInput: devices.filter(d => d.kind === "audioinput"),
            videoInput: devices.filter(d => d.kind === "videoinput")
        };
    }

    async getAudioOutputDevicesAsync() {
        if (!canChangeAudioOutput) {
            return [];
        }
        const devices = await this.getAvailableDevicesAsync();
        return devices && devices.audioOutput || [];
    }

    async getAudioInputDevicesAsync() {
        const devices = await this.getAvailableDevicesAsync();
        return devices && devices.audioInput || [];
    }

    async getVideoInputDevicesAsync() {
        const devices = await this.getAvailableDevicesAsync();
        return devices && devices.videoInput || [];
    }

    async getCurrentAudioInputDeviceAsync() {
        throw new Error("Not implemented in base class");
    }

    async setAudioInputDeviceAsync(device) {
        throw new Error("Not implemented in base class");
    }

    /**
     * @return {Promise.<MediaDeviceInfo>} */
    async getCurrentAudioOutputDeviceAsync() {
        throw new Error("Not implemented in base class");
    }

    /**
     * 
     * @param {MediaDeviceInfo} device
     */
    async setAudioOutputDeviceAsync(device) {
        throw new Error("Not implemented in base class");
    }

    async getCurrentVideoInputDeviceAsync() {
        throw new Error("Not implemented in base class");
    }

    async setVideoInputDeviceAsync(device) {
        throw new Error("Not implemented in base class");
    }

    async toggleAudioMutedAsync() {
        throw new Error("Not implemented in base class");
    }

    async toggleVideoMutedAsync() {
        throw new Error("Not implemented in base class");
    }

    /**
     * @return {Promise.<boolean>}
     */
    get isAudioMuted() {
        throw new Error("Not implemented in base class");
    }

    /**
     * @return {Promise.<boolean>}
     */
    get isVideoMuted() {
        throw new Error("Not implemented in base class");
    }

    txGameData(toUserID, data) {
        throw new Error("Not implemented in base class");
    }

    rxGameData(evt) {
        throw new Error("Not implemented in base class");
    }

    /// Send a Calla message through the Jitsi Meet data channel.
    sendMessageTo(toUserID, command, value) {
        this.txGameData(toUserID, {
            hax: APP_FINGERPRINT$1,
            command,
            value
        });
    }

    receiveMessageFrom(fromUserID, command, value) {
        const evt = new JitsiClientEvent(command, fromUserID, value);
        this.dispatchEvent(evt);
    }

    /**
     * Sets parameters that alter spatialization.
     * @param {number} minDistance
     * @param {number} maxDistance
     * @param {number} rolloff
     * @param {number} transitionTime
     */
    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        this.audioClient.setAudioProperties(minDistance, maxDistance, rolloff, transitionTime);
    }

    /**
     * Set the position of the listener.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     */
    setLocalPosition(x, y) {
        this.audioClient.setLocalPosition(x, y);
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "userMoved", { x, y });
        }
    }

    /**
     * Set the position of an audio source.
     * @param {string} id - the id of the user for which to set the position.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     */
    setUserPosition(id, x, y) {
        this.audioClient.setUserPosition(id, x, y);
    }

    removeUser(evt) {
        this.audioClient.removeSource(evt.id);
    }

    /**
     *
     * @param {boolean} muted
     */
    async setAudioMutedAsync(muted) {
        let isMuted = this.isAudioMuted;
        if (muted !== isMuted) {
            isMuted = await this.toggleAudioMutedAsync();
        }
        return isMuted;
    }

    /**
     *
     * @param {boolean} muted
     */
    async setVideoMutedAsync(muted) {
        let isMuted = this.isVideoMuted;
        if (muted !== isMuted) {
            isMuted = await this.toggleVideoMutedAsync();
        }
        return isMuted;
    }

    /// Add a listener for Calla events that come through the Jitsi Meet data channel.
    /**
     * 
     * @param {string} evtName
     * @param {function} callback
     * @param {AddEventListenerOptions} opts
     */
    addEventListener(evtName, callback, opts) {
        if (eventNames$1.indexOf(evtName) === -1) {
            throw new Error(`Unsupported event type: ${evtName}`);
        }

        super.addEventListener(evtName, callback, opts);
    }

    /**
     * 
     * @param {string} toUserID
     */
    userInitRequest(toUserID) {
        this.sendMessageTo(toUserID, "userInitRequest");
    }

    /**
     * 
     * @param {string} toUserID
     */
    async userInitRequestAsync(toUserID) {
        return await this.until("userInitResponse",
            () => this.userInitRequest(toUserID),
            (evt) => evt.id === toUserID,
            1000);
    }

    /**
     * 
     * @param {string} toUserID
     * @param {User} fromUserState
     */
    userInitResponse(toUserID, fromUserState) {
        this.sendMessageTo(toUserID, "userInitResponse", fromUserState);
    }

    setAvatarEmoji(emoji) {
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "setAvatarEmoji", emoji);
        }
    }

    setAvatarURL(url) {
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "setAvatarURL", url);
        }
    }

    emote(emoji) {
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "emote", emoji);
        }
    }

    startAudio() {
    }
}

class JitsiClientEvent extends Event {
    constructor(command, id, value) {
        super(command);
        this.id = id;
        for (let key in value) {
            if (key !== "isTrusted"
                && !Event.prototype.hasOwnProperty(key)) {
                this[key] = value[key];
            }
        }
    }
}

const selfs$3 = new Map(),
    KEY = "CallaSettings",
    DEFAULT_SETTINGS = {
        drawHearing: false,
        audioDistanceMin: 1,
        audioDistanceMax: 10,
        audioRolloff: 1,
        fontSize: 12,
        transitionSpeed: 1,
        zoom: 1.5,
        roomName: "calla",
        userName: "",
        avatarEmoji: null,
        gamepadIndex: 0,
        preferedAudioOutputID: null,
        preferedAudioInputID: null,
        preferedVideoInputID: null,

        inputBinding: {
            keyButtonUp: "ArrowUp",
            keyButtonDown: "ArrowDown",
            keyButtonLeft: "ArrowLeft",
            keyButtonRight: "ArrowRight",
            keyButtonEmote: "e",
            keyButtonToggleAudio: "a",

            gpButtonUp: 12,
            gpButtonDown: 13,
            gpButtonLeft: 14,
            gpButtonRight: 15,
            gpButtonEmote: 0,
            gpButtonToggleAudio: 1
        }
    };

function commit(settings) {
    const self = selfs$3.get(settings);
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

class Settings {
    constructor() {
        const self = Object.seal(load() || DEFAULT_SETTINGS);
        selfs$3.set(this, self);
        if (window.location.hash.length > 0) {
            self.roomName = window.location.hash.substring(1);
        }
        Object.seal(this);
    }

    get preferedAudioOutputID() {
        return selfs$3.get(this).preferedAudioOutputID;
    }

    set preferedAudioOutputID(value) {
        if (value !== this.preferedAudioOutputID) {
            selfs$3.get(this).preferedAudioOutputID = value;
            commit(this);
        }
    }

    get preferedAudioInputID() {
        return selfs$3.get(this).preferedAudioInputID;
    }

    set preferedAudioInputID(value) {
        if (value !== this.preferedAudioInputID) {
            selfs$3.get(this).preferedAudioInputID = value;
            commit(this);
        }
    }

    get preferedVideoInputID() {
        return selfs$3.get(this).preferedVideoInputID;
    }

    set preferedVideoInputID(value) {
        if (value !== this.preferedVideoInputID) {
            selfs$3.get(this).preferedVideoInputID = value;
            commit(this);
        }
    }

    get transitionSpeed() {
        return selfs$3.get(this).transitionSpeed;
    }

    set transitionSpeed(value) {
        if (value !== this.transitionSpeed) {
            selfs$3.get(this).transitionSpeed = value;
            commit(this);
        }
    }

    get drawHearing() {
        return selfs$3.get(this).drawHearing;
    }

    set drawHearing(value) {
        if (value !== this.drawHearing) {
            selfs$3.get(this).drawHearing = value;
            commit(this);
        }
    }

    get audioDistanceMin() {
        return selfs$3.get(this).audioDistanceMin;
    }

    set audioDistanceMin(value) {
        if (value !== this.audioDistanceMin) {
            selfs$3.get(this).audioDistanceMin = value;
            commit(this);
        }
    }

    get audioDistanceMax() {
        return selfs$3.get(this).audioDistanceMax;
    }

    set audioDistanceMax(value) {
        if (value !== this.audioDistanceMax) {
            selfs$3.get(this).audioDistanceMax = value;
            commit(this);
        }
    }

    get audioRolloff() {
        return selfs$3.get(this).audioRolloff;
    }

    set audioRolloff(value) {
        if (value !== this.audioRolloff) {
            selfs$3.get(this).audioRolloff = value;
            commit(this);
        }
    }

    get fontSize() {
        return selfs$3.get(this).fontSize;
    }

    set fontSize(value) {
        if (value !== this.fontSize) {
            selfs$3.get(this).fontSize = value;
            commit(this);
        }
    }

    get zoom() {
        return selfs$3.get(this).zoom;
    }

    set zoom(value) {
        if (value !== this.zoom) {
            selfs$3.get(this).zoom = value;
            commit(this);
        }
    }

    get userName() {
        return selfs$3.get(this).userName;
    }

    set userName(value) {
        if (value !== this.userName) {
            selfs$3.get(this).userName = value;
            commit(this);
        }
    }

    get avatarEmoji() {
        return selfs$3.get(this).avatarEmoji;
    }

    set avatarEmoji(value) {
        if (value !== this.avatarEmoji) {
            selfs$3.get(this).avatarEmoji = value;
            commit(this);
        }
    }

    get roomName() {
        return selfs$3.get(this).roomName;
    }

    set roomName(value) {
        if (value !== this.roomName) {
            selfs$3.get(this).roomName = value;
            commit(this);
        }
    }

    get gamepadIndex() {
        return selfs$3.get(this).gamepadIndex;
    }

    set gamepadIndex(value) {
        if (value !== this.gamepadIndex) {
            selfs$3.get(this).gamepadIndex = value;
            commit(this);
        }
    }

    get inputBinding() {
        return selfs$3.get(this).inputBinding;
    }

    set inputBinding(value) {
        if (value !== this.inputBinding) {
            selfs$3.get(this).inputBinding = value;
            commit(this);
        }
    }
}

/**
 * A sound effects palette.
 **/
class SFX extends EventTarget {

    /**
     * Creates a new sound effects palette.
     * 
     * NOTE: sound effects are not spatialized.
     **/
    constructor() {
        super();

        /** @type {Map.<string, Audio>} */
        this.clips = new Map();
    }

    /**
     * Creates a new sound effect from a series of fallback paths
     * for media files.
     * @param {string} name - the name of the sound effect, to reference when executing playback.
     * @param {string[]} paths - a series of fallback paths for loading the media of the sound effect.
     * @returns {SFX}
     */
    add(name, ...paths) {
        const sources = paths
            .map((p) => src(p))
            .map((s) => Source(s));

        const elem = Audio(
            controls(false),
            ...sources);

        this.clips.set(name, elem);
        return this;
    }

    /**
     * Plays a named sound effect.
     * @param {string} name - the name of the effect to play.
     * @param {number} [volume=1] - the volume at which to play the effect.
     */
    play(name, volume = 1) {
        if (this.clips.has(name)) {
            const clip = this.clips.get(name);
            clip.volume = volume;
            clip.play();
        }
    }
}

console.log(`${versionString}`);
/** @type {Element} */
const versionContainer = document.querySelector("#login h1");
if (versionContainer) {
    versionContainer.replaceChild(
        document.createTextNode(versionString),
        versionContainer.childNodes[0]);
    versionContainer.childNodes[1].style.display = "inline-block";
}



/**
 * 
 * @param {string} host
 * @param {BaseJitsiClient} client
 */
function init(host, client) {
    const settings = new Settings(),
        sound = new SFX()
            .add("join", "/audio/door-open.ogg", "/audio/door-open.mp3", "/audio/door-open.wav")
            .add("leave", "/audio/door-close.ogg", "/audio/door-close.mp3", "/audio/door-close.wav"),
        game = new Game(),
        login = new LoginForm(),
        directory = new UserDirectoryForm(),
        headbar = new HeaderBar(),
        footbar = new FooterBar(),
        options = new OptionsForm(),
        emoji = new EmojiForm(),

        forExport = {
            settings,
            client,
            game,
            login,
            directory,
            headbar,
            footbar,
            options,
            emoji
        },

        forAppend = [
            game,
            directory,
            options,
            emoji,
            headbar,
            footbar,
            login
        ].filter(x => x.element);

    function showLogin() {
        game.hide();
        directory.hide();
        options.hide();
        emoji.hide();
        headbar.enabled = false;
        footbar.enabled = false;
        login.show();
    }

    async function withEmojiSelection(callback) {
        if (!emoji.isOpen) {
            headbar.optionsButton.lock();
            headbar.instructionsButton.lock();
            options.hide();
            const e = await emoji.selectAsync();
            if (!!e) {
                callback(e);
            }
            headbar.optionsButton.unlock();
            headbar.instructionsButton.unlock();
        }
    }

    async function selectEmojiAsync() {
        await withEmojiSelection((e) => {
            game.emote(client.localUser, e);
            footbar.setEmojiButton(settings.inputBinding.keyButtonEmote, e);
        });
    }

    function setAudioProperties() {
        client.setAudioProperties(
            settings.audioDistanceMin = game.audioDistanceMin = options.audioDistanceMin,
            settings.audioDistanceMax = game.audioDistanceMax = options.audioDistanceMax,
            settings.audioRolloff = options.audioRolloff,
            settings.transitionSpeed);
    }

    function refreshGamepads() {
        options.gamepads = navigator.getGamepads();
        options.gamepadIndex = game.gamepadIndex;
    }

    function refreshUser(userID, isNew) {
        if (game.users.has(userID)) {
            const user = game.users.get(userID);
            directory.set(user, isNew);
        }
    }

    document.body.style.display = "grid";
    document.body.style.gridTemplateRows = "auto 1fr auto";
    let z = 0;
    for (let e of forAppend) {
        if (e.element) {
            let g = null;
            if (e === headbar) {
                g = grid(1, 1);
            }
            else if (e === footbar) {
                g = grid(1, 3);
            }
            else if (e === game || e === login) {
                g = grid(1, 1, 1, 3);
            }
            else {
                g = grid(1, 2);
            }
            g.apply(e.element);
            e.element.style.zIndex = (z++);
            document.body.append(e.element);
        }
    }

    refreshGamepads();
    headbar.enabled = false;
    footbar.enabled = false;
    options.drawHearing = game.drawHearing = settings.drawHearing;
    options.audioDistanceMin = game.audioDistanceMin = settings.audioDistanceMin;
    options.audioDistanceMax = game.audioDistanceMax = settings.audioDistanceMax;
    options.audioRolloff = settings.audioRolloff;
    options.fontSize = game.fontSize = settings.fontSize;
    options.gamepadIndex = game.gamepadIndex = settings.gamepadIndex;
    options.inputBinding = game.inputBinding = settings.inputBinding;
    game.cameraZ = game.targetCameraZ = settings.zoom;
    game.transitionSpeed = settings.transitionSpeed = 0.5;
    login.userName = settings.userName;
    login.roomName = settings.roomName;
    client.preferedAudioOutputID = settings.preferedAudioOutputID;
    client.preferedAudioInputID = settings.preferedAudioInputID;
    client.preferedVideoInputID = settings.preferedVideoInputID;

    showLogin();

    window.addEventListeners({
        gamepadconnected: refreshGamepads,
        gamepaddisconnected: refreshGamepads,

        resize: () => {
            game.resize();
        }
    });

    const showView = (view) => () => {
        if (!emoji.isOpen) {
            const isOpen = view.isOpen;
            login.hide();
            directory.hide();
            options.hide();
            view.isOpen = !isOpen;
        }
    };

    headbar.addEventListeners({
        toggleOptions: showView(options),
        toggleInstructions: showView(login),
        toggleUserDirectory: showView(directory),

        toggleFullscreen: () => {
            headbar.isFullscreen = !headbar.isFullscreen;
        },

        tweet: () => {
            const message = encodeURIComponent(`Join my #TeleParty ${document.location.href}`),
                url = new URL("https://twitter.com/intent/tweet?text=" + message);
            open(url);
        },

        leave: () => {
            directory.clear();
            client.leave();
        }
    });

    footbar.addEventListeners({
        selectEmoji: selectEmojiAsync,

        emote: () => {
            game.emote(client.localUser, game.currentEmoji);
        },

        toggleAudio: async () => {
            await client.toggleAudioMutedAsync();
        },

        toggleVideo: async () => {
            await client.toggleVideoMutedAsync();
        }
    });


    login.addEventListener("login", async () => {
        client.startAudio();

        const joinInfo = await client.joinAsync(
            host,
            settings.roomName = login.roomName,
            settings.userName = login.userName);

        login.connected = true;

        window.location.hash = login.roomName;

        await game.startAsync(joinInfo);

        options.audioInputDevices = await client.getAudioInputDevicesAsync();
        options.audioOutputDevices = await client.getAudioOutputDevicesAsync();
        options.videoInputDevices = await client.getVideoInputDevicesAsync();

        options.currentAudioInputDevice = await client.getCurrentAudioInputDeviceAsync();
        options.currentAudioOutputDevice = await client.getCurrentAudioOutputDeviceAsync();
        options.currentVideoInputDevice = await client.getCurrentVideoInputDeviceAsync();

        const audioMuted = client.isAudioMuted;
        game.muteUserAudio({ id: client.localUser, muted: audioMuted });
        footbar.audioEnabled = !audioMuted;

        const videoMuted = client.isVideoMuted;
        game.muteUserVideo({ id: client.localUser, muted: videoMuted });
        footbar.videoEnabled = !videoMuted;
    });


    options.addEventListeners({
        audioPropertiesChanged: setAudioProperties,

        selectAvatar: async () => {
            await withEmojiSelection((e) => {
                settings.avatarEmoji
                    = options.avatarEmoji
                    = e;
                game.me.setAvatarEmoji(e);
                client.setAvatarEmoji(e);
            });
        },

        avatarURLChanged: () => {
            client.setAvatarURL(options.avatarURL);
        },

        toggleVideo: async () => {
            await client.toggleVideoMutedAsync();
        },

        toggleDrawHearing: () => {
            settings.drawHearing = game.drawHearing = options.drawHearing;
        },

        fontSizeChanged: () => {
            settings.fontSize = game.fontSize = options.fontSize;
        },

        audioInputChanged: async () => {
            const device = options.currentAudioInputDevice;
            settings.preferedAudioInputID = device && device.deviceId || null;
            await client.setAudioInputDeviceAsync(device);
        },

        audioOutputChanged: async () => {
            const device = options.currentAudioOutputDevice;
            settings.preferedAudioOutputID = device && device.deviceId || null;
            await client.setAudioOutputDeviceAsync(device);
        },

        videoInputChanged: () => {
            const device = options.currentVideoInputDevice;
            settings.preferedVideoInputID = device && device.deviceId || null;
            client.setVideoInputDeviceAsync(device);
        },

        gamepadChanged: () => {
            settings.gamepadIndex = game.gamepadIndex = options.gamepadIndex;
        },

        inputBindingChanged: () => {
            settings.inputBinding = game.inputBinding = options.inputBinding;
        }
    });

    game.addEventListeners({
        emojiNeeded: selectEmojiAsync,

        emote: (evt) => {
            client.emote(evt.emoji);
        },

        userJoined: (evt) => {
            evt.user.addEventListener("userPositionNeeded", (evt2) => {
                client.userInitRequest(evt2.id);
            });
            refreshUser(evt.user.id, true);
        },

        toggleAudio: async () => {
            await client.toggleAudioMutedAsync();
        },

        toggleVideo: async () => {
            await client.toggleVideoMutedAsync();
        },

        gameStarted: () => {
            grid(1, 2).apply(login.element);
            login.hide();
            headbar.enabled = true;
            footbar.enabled = true;

            setAudioProperties();

            client.setLocalPosition(game.me.position.x, game.me.position.y);
            game.me.addEventListener("userMoved", (evt) => {
                client.setLocalPosition(evt.x, evt.y);
                refreshUser(game.me.id);
            });

            if (settings.avatarEmoji !== null) {
                game.me.setAvatarEmoji(settings.avatarEmoji);
            }

            settings.avatarEmoji
                = options.avatarEmoji
                = game.me.avatarEmoji;

            refreshUser(game.me.id);
        },

        gameEnded: () => {
            grid(1, 1, 1, 3).apply(login.element);
            game.hide();
            login.connected = false;
            showLogin();
        },

        zoomChanged: () => {
            settings.zoom = game.targetCameraZ;
        }
    });

    directory.addEventListener("warpTo", (evt) => {
        if (game.users.has(evt.id)) {
            const user = game.users.get(evt.id);
            game.warpMeTo(user.position._tx, user.position._ty);
            directory.hide();
        }
    });

    client.addEventListeners({

        videoConferenceLeft: (evt) => {
            game.end();
        },

        participantJoined: (evt) => {
            sound.play("join", 0.5);
            game.addUser(evt);
        },

        videoAdded: (evt) => {
            game.setAvatarVideo(evt);
            refreshUser(evt.id);
        },

        videoRemoved: (evt) => {
            game.setAvatarVideo(evt);
            refreshUser(evt.id);
        },

        participantLeft: (evt) => {
            sound.play("leave", 0.5);
            game.removeUser(evt);
            client.removeUser(evt);
            directory.delete(evt.id);
        },

        avatarChanged: (evt) => {
            game.setAvatarURL(evt);
            if (evt.id === client.localUser) {
                options.avatarURL = evt.avatarURL;
            }
            refreshUser(evt.id);
        },

        displayNameChange: (evt) => {
            game.changeUserName(evt);
            refreshUser(evt.id);
        },

        audioMuteStatusChanged: async (evt) => {
            game.muteUserAudio(evt);
            if (evt.id === client.localUser) {
                footbar.audioEnabled = !evt.muted;
                options.currentAudioInputDevice = await client.getCurrentAudioInputDeviceAsync();
            }
        },

        videoMuteStatusChanged: async (evt) => {
            game.muteUserVideo(evt);
            if (evt.id === client.localUser) {
                footbar.videoEnabled = !evt.muted;
                options.currentVideoInputDevice = await client.getCurrentVideoInputDeviceAsync();
            }
        },

        userInitRequest: (evt) => {
            if (game.me && game.me.id) {
                client.userInitResponse(evt.id, game.me.serialize());
            }
            else {
                directory.warn("Local user not initialized");
            }
        },

        userInitResponse: (evt) => {
            if (game.users.has(evt.id)) {
                const user = game.users.get(evt.id);
                user.deserialize(evt);
                client.setUserPosition(evt.id, evt.x, evt.y);
                refreshUser(evt.id);
            }
        },

        userMoved: (evt) => {
            if (game.users.has(evt.id)) {
                const user = game.users.get(evt.id);
                user.moveTo(evt.x, evt.y, settings.transitionSpeed);
                client.setUserPosition(evt.id, evt.x, evt.y);
            }
            refreshUser(evt.id);
        },

        emote: (evt) => {
            game.emote(evt.id, evt);
        },

        setAvatarEmoji: (evt) => {
            game.setAvatarEmoji(evt);
            refreshUser(evt.id);
        },

        audioActivity: (evt) => {
            game.updateAudioActivity(evt);
        }
    });

    login.ready = true;

    return forExport;
}

/**
 * An Event class for tracking changes to audio activity.
 **/
class AudioActivityEvent extends Event {
    /** Creates a new "audioActivity" event */
    constructor() {
        super("audioActivity");
        /** @type {string} */
        this.id = null;
        this.isActive = false;
    }

    /**
     * Sets the current state of the event
     * @param {string} id - the user for which the activity changed
     * @param {boolean} isActive - the new state of the activity
     */
    set(id, isActive) {
        this.id = id;
        this.isActive = isActive;
    }
}

/**
 * A mocking class for providing the playback timing needed to synchronize motion and audio.
 **/
class MockAudioContext {
    /**
     * Starts the timer at "now".
     **/
    constructor() {
        this._t = performance.now() / 1000;
    }

    /**
     * Gets the current playback time.
     * @type {number}
     */
    get currentTime() {
        return performance.now() / 1000 - this._t;
    }

    /**
     * Returns nothing.
     * @type {AudioDestinationNode} */
    get destination() {
        return null;
    }
}

/**
 * A positioner that uses the WebAudio API's old setPosition method.
 **/
class WebAudioOldListenerPosition extends InterpolatedPosition {

    /**
     * Creates a new positioner that uses the WebAudio API's old setPosition method.
     * @param {AudioListener} listener - the listener on the audio context.
     */
    constructor(listener) {
        super();

        this.listener = listener;
        this.listener.setPosition(0, 0, 0);
        this.listener.setOrientation(0, 0, -1, 0, 1, 0);
    }

    /**
     * Calculates the new position for the given time.
     * @protected
     * @param {number} t
     */
    update(t) {
        super.update(t);
        this.listener.setPosition(this.x, 0, this.y);
    }
}

/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
class WebAudioNodePosition extends BasePosition {

    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     * @param {PannerNode|AudioListener} node - the audio node that will receive the position value.
     * @param {boolean} forceInterpolation - when set to true, circumvents WebAudio's time tracking and uses our own.
     */
    constructor(node, forceInterpolation) {
        super();

        /** @type {BasePosition} */
        this._p = forceInterpolation ? new InterpolatedPosition() : null;
        this.node = node;
        this.node.positionX.setValueAtTime(0, 0);
        this.node.positionY.setValueAtTime(0, 0);
        this.node.positionZ.setValueAtTime(0, 0);
    }

    /**
     *  The horizontal component of the position.
     *  @type {number} */
    get x() {
        return this.node.positionX.value;
    }

    /**
     *  The vertical component of the position.
     *  @type {number} */
    get y() {
        return this.node.positionZ.value;
    }

    /**
     * Set the target position for the time `t + dt`.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     * @param {number} t
     * @param {number} dt
     */
    setTarget(x, y, t, dt) {
        if (this._p) {
            this._p.setTarget(x, y, t, dt);
        }
        else {
            const time = t + dt;
            // our 2D position is in X/Y coords, but our 3D position
            // along the horizontal plane is X/Z coords.
            this.node.positionX.linearRampToValueAtTime(x, time);
            this.node.positionZ.linearRampToValueAtTime(y, time);
        }
    }

    /**
     * Calculates the new position for the given time.
     * @protected
     * @param {number} t
     */
    update(t) {
        if (this._p) {
            this._p.update(t);
            this.node.positionX.linearRampToValueAtTime(this._p.x, 0);
            this.node.positionZ.linearRampToValueAtTime(this._p.y, 0);
        }
    }
}

/**
 * A positioner that uses WebAudio's playback dependent time progression.
 **/
class WebAudioNewListenerPosition extends WebAudioNodePosition {
    /**
     * Creates a new positioner that uses WebAudio's playback dependent time progression.
     * @param {AudioListener} node - the audio node that will receive the position value.
     * @param {boolean} forceInterpolation - when set to true, circumvents WebAudio's time tracking and uses our own.
     */
    constructor(node, forceInterpolation) {
        super(node, forceInterpolation);
        this.node.forwardX.setValueAtTime(0, 0);
        this.node.forwardY.setValueAtTime(0, 0);
        this.node.forwardZ.setValueAtTime(-1, 0);
        this.node.upX.setValueAtTime(0, 0);
        this.node.upY.setValueAtTime(1, 0);
        this.node.upZ.setValueAtTime(0, 0);
    }
}

/**
 * A base class for positioned audio elements.
 **/
class BaseAudioElement extends EventTarget {
    /**
     * Creates a new positioned audio element.
     * @param {BasePosition} position
     */
    constructor(position) {
        super();

        this.minDistance = 1;
        this.minDistanceSq = 1;
        this.maxDistance = 10;
        this.maxDistanceSq = 100;
        this.rolloff = 1;
        this.transitionTime = 0.5;

        /** @type {BasePosition} */
        this.position = position;
    }

    /**
     * Sets parameters that alter spatialization.
     * @param {number} minDistance
     * @param {number} maxDistance
     * @param {number} rolloff
     * @param {number} transitionTime
     */
    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        this.minDistance = minDistance;
        this.maxDistance = maxDistance;
        this.transitionTime = transitionTime;
        this.rolloff = rolloff;
    }

    /**
     * Gets the current playback time from the audio context.
     * @returns {number}
     */
    get currentTime() {
        throw new Error("Not implemented in base class");
    }

    /**
     * Set the target position
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     */
    setTarget(x, y) {
        if (this.position) {
            this.position.setTarget(x, y, this.currentTime, this.transitionTime);
            this.update();
        }
    }

    /**
     * Performs position updates.
     **/
    update() {
        if (this.position) {
            this.position.update(this.currentTime);
        }
    }
}

/** Base class providing functionality for spatializers. */
class BaseSpatializer extends BaseAudioElement {

    /**
     * Creates a spatializer that keeps track of the relative position
     * of an audio element to the listener destination.
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {BasePosition} position
     */
    constructor(userID, destination, audio, position) {
        super(position);

        this.id = userID;
        this.destination = destination;
        this.audio = audio;
        this.volume = 1;
        this.pan = 0;
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        this.audio.pause();

        this.position = null;
        this.audio = null;
        this.destination = null;
        this.id = null;
    }

    /**
     * Changes the device to which audio will be output
     * @param {string} deviceID
     */
    setAudioOutputDevice(deviceID) {
        if (canChangeAudioOutput) {
            this.audio.setSinkId(deviceID);
        }
    }

    /**
     * Retrieves the current time from the audio context.
     * @type {number}
     */
    get currentTime() {
        return this.destination.currentTime;
    }


    /**
     * Performs the spatialization operation for the audio source's latest location.
     **/
    update() {
        super.update();

        const lx = this.destination.position.x,
            ly = this.destination.position.y,
            distX = this.position.x - lx,
            distY = this.position.y - ly,
            distSqr = distX * distX + distY * distY,
            dist = Math.sqrt(distSqr),
            distScale = project(dist, this.minDistance, this.maxDistance);

        this.volume = 1 - clamp(distScale, 0, 1);
        this.volume = this.volume * this.volume;
        this.pan = dist > 0
            ? distX / dist
            : 0;
    }
}

/**
 * A spatializer that only modifies volume.
 **/
class VolumeOnlySpatializer extends BaseSpatializer {

    /**
     * Creates a new spatializer that only modifies volume.
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     */
    constructor(userID, destination, audio) {
        super(userID, destination, audio, new InterpolatedPosition());
        this.audio.play();

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     **/
    update() {
        super.update();
        this.audio.volume = this.volume;
    }
}

const audioActivityEvt = new AudioActivityEvent(),
    activityCounterMin = 0,
    activityCounterMax = 60,
    activityCounterThresh = 5;

/**
 * 
 * @param {number} frequency
 * @param {number} sampleRate
 * @param {number} bufferSize
 */
function frequencyToIndex(frequency, sampleRate, bufferSize) {
    var nyquist = sampleRate / 2;
    var index = Math.round(frequency / nyquist * bufferSize);
    return clamp(index, 0, bufferSize)
}

/**
 * 
 * @param {AnalyserNode} analyser
 * @param {Float32Array} frequencies
 * @param {number} minHz
 * @param {number} maxHz
 * @param {number} bufferSize
 */
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

class BaseAnalyzedSpatializer extends BaseSpatializer {

    /**
     * 
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {BasePosition} position
     * @param {number} bufferSize
     * @param {PannerNode|StereoPannerNode} inNode
     */
    constructor(userID, destination, audio, position, bufferSize, inNode) {
        super(userID, destination, audio, position);

        this.audio.volume = 0;

        this.bufferSize = bufferSize;
        this.buffer = new Float32Array(this.bufferSize);

        /** @type {AnalyserNode} */
        this.analyser = this.destination.audioContext.createAnalyser();
        this.analyser.fftSize = 2 * this.bufferSize;
        this.analyser.smoothingTimeConstant = 0.2;

        /** @type {PannerNode|StereoPannerNode} */
        this.inNode = inNode;

        /** @type {boolean} */
        this.wasActive = false;
        this.lastAudible = true;
        this.activityCounter = 0;

        /** @type {MediaStream} */
        this.stream = null;

        /** @type {MediaSource} */
        this.source = null;
    }

    /**
     * @fires BaseAnalyzedSpatializer#audioActivity
     **/
    update() {
        super.update();

        if (!this.source) {
            try {
                if (!this.stream) {
                    this.stream = !!this.audio.mozCaptureStream
                        ? this.audio.mozCaptureStream()
                        : this.audio.captureStream();
                }

                if (this.stream.active) {
                    this.source = this.destination.audioContext.createMediaStreamSource(this.stream);
                    this.source.connect(this.analyser);
                    this.source.connect(this.inNode);
                }
            }
            catch (exp) {
                console.warn("Source isn't available yet. Will retry in a moment. Reason: ", exp);
            }
        }

        if (!!this.source) {
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
                audioActivityEvt.set(this.id, isActive);
                this.dispatchEvent(audioActivityEvt);
            }
        }
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        if (!!this.source) {
            this.source.disconnect(this.analyser);
            this.source.disconnect(this.inNode);
        }

        this.source = null;
        this.stream = null;
        this.inNode = null;
        this.analyser = null;
        this.buffer = null;

        super.dispose();
    }
}

/**
 * A spatializer that uses the WebAudio API.
 **/
class BaseWebAudioSpatializer extends BaseAnalyzedSpatializer {

    /**
     * Creates a new spatializer that uses the WebAudio API
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {BasePosition} position
     * @param {number} bufferSize
     * @param {PannerNode|StereoPannerNode} inNode
     * @param {GainNode=} outNode
     */
    constructor(userID, destination, audio, position, bufferSize, inNode, outNode) {
        super(userID, destination, audio, position, bufferSize, inNode);

        this.outNode = outNode || inNode;
        this.outNode.connect(this.destination.audioContext.destination);

        if (this.inNode !== this.outNode) {
            this.inNode.connect(this.outNode);
        }
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        if (this.inNode !== this.outNode) {
            this.inNode.disconnect(this.outNode);
        }

        this.outNode.disconnect(this.destination.audioContext.destination);
        this.outNode = null;

        super.dispose();
    }
}

/**
 * A spatializer that uses WebAudio's PannerNode
 **/
class FullSpatializer extends BaseWebAudioSpatializer {

    /**
     * Creates a new spatializer that uses WebAudio's PannerNode.
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {number} bufferSize
     * @param {boolean} forceInterpolatedPosition
     */
    constructor(userID, destination, audio, bufferSize, forceInterpolatedPosition) {
        const panner = destination.audioContext.createPanner(),
            position = new WebAudioNodePosition(panner, forceInterpolatedPosition);
        super(userID, destination, audio, position, bufferSize, panner);

        this.inNode.panningModel = "HRTF";
        this.inNode.distanceModel = "inverse";
        this.inNode.coneInnerAngle = 360;
        this.inNode.coneOuterAngle = 0;
        this.inNode.coneOuterGain = 0;

        Object.seal(this);
    }

    /**
     * Sets parameters that alter spatialization.
     * @param {number} minDistance
     * @param {number} maxDistance
     * @param {number} rolloff
     * @param {number} transitionTime
     */
    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        super.setAudioProperties(minDistance, maxDistance, rolloff, transitionTime);
        this.inNode.refDistance = minDistance;
        this.inNode.rolloffFactor = rolloff;
    }
}

/**
 * A spatializer that performs stereo panning and volume scaling.
 **/
class StereoSpatializer extends BaseWebAudioSpatializer {

    /**
     * Creates a new spatializer that performs stereo panning and volume scaling.
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {number} bufferSize
     */
    constructor(userID, destination, audio, bufferSize) {
        super(userID, destination, audio, new InterpolatedPosition(), bufferSize,
            destination.audioContext.createStereoPanner(),
            destination.audioContext.createGain());

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     **/
    update() {
        super.update();
        this.inNode.pan.value = this.pan;
        this.outNode.gain.value = this.volume;
    }
}

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(undefined || window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file ResonanceAudio library common utilities, mathematical constants,
 * and default values.
 * @author Andrew Allen <bitllama@google.com>
 */




/**
 * @class Utils
 * @description A set of defaults, constants and utility functions.
 */
function Utils() {}

/**
 * Default input gain (linear).
 * @type {Number}
 */
Utils.DEFAULT_SOURCE_GAIN = 1;


/**
 * Maximum outside-the-room distance to attenuate far-field listener by.
 * @type {Number}
 */
Utils.LISTENER_MAX_OUTSIDE_ROOM_DISTANCE = 1;


/**
 * Maximum outside-the-room distance to attenuate far-field sources by.
 * @type {Number}
 */
Utils.SOURCE_MAX_OUTSIDE_ROOM_DISTANCE = 1;


/**
 * Default distance from listener when setting angle.
 * @type {Number}
 */
Utils.DEFAULT_SOURCE_DISTANCE = 1;


/** @type {Float32Array} */
Utils.DEFAULT_POSITION = [0, 0, 0];


/** @type {Float32Array} */
Utils.DEFAULT_FORWARD = [0, 0, -1];


/** @type {Float32Array} */
Utils.DEFAULT_UP = [0, 1, 0];


/** @type {Float32Array} */
Utils.DEFAULT_RIGHT = [1, 0, 0];


/**
 * @type {Number}
 */
Utils.DEFAULT_SPEED_OF_SOUND = 343;


/** Rolloff models (e.g. 'logarithmic', 'linear', or 'none').
 * @type {Array}
 */
Utils.ATTENUATION_ROLLOFFS = ['logarithmic', 'linear', 'none'];


/** Default rolloff model ('logarithmic').
 * @type {string}
 */
Utils.DEFAULT_ATTENUATION_ROLLOFF = 'logarithmic';


/** @type {Number} */
Utils.DEFAULT_MIN_DISTANCE = 1;


/** @type {Number} */
Utils.DEFAULT_MAX_DISTANCE = 1000;


/**
 * The default alpha (i.e. microphone pattern).
 * @type {Number}
 */
Utils.DEFAULT_DIRECTIVITY_ALPHA = 0;


/**
 * The default pattern sharpness (i.e. pattern exponent).
 * @type {Number}
 */
Utils.DEFAULT_DIRECTIVITY_SHARPNESS = 1;


/**
 * Default azimuth (in degrees). Suitable range is 0 to 360.
 * @type {Number}
 */
Utils.DEFAULT_AZIMUTH = 0;


/**
 * Default elevation (in degres).
 * Suitable range is from -90 (below) to 90 (above).
 * @type {Number}
 */
Utils.DEFAULT_ELEVATION = 0;


/**
 * The default ambisonic order.
 * @type {Number}
 */
Utils.DEFAULT_AMBISONIC_ORDER = 1;


/**
 * The default source width.
 * @type {Number}
 */
Utils.DEFAULT_SOURCE_WIDTH = 0;


/**
 * The maximum delay (in seconds) of a single wall reflection.
 * @type {Number}
 */
Utils.DEFAULT_REFLECTION_MAX_DURATION = 0.5;


/**
 * The -12dB cutoff frequency (in Hertz) for the lowpass filter applied to
 * all reflections.
 * @type {Number}
 */
Utils.DEFAULT_REFLECTION_CUTOFF_FREQUENCY = 6400; // Uses -12dB cutoff.


/**
 * The default reflection coefficients (where 0 = no reflection, 1 = perfect
 * reflection, -1 = mirrored reflection (180-degrees out of phase)).
 * @type {Object}
 */
Utils.DEFAULT_REFLECTION_COEFFICIENTS = {
  left: 0, right: 0, front: 0, back: 0, down: 0, up: 0,
};


/**
 * The minimum distance we consider the listener to be to any given wall.
 * @type {Number}
 */
Utils.DEFAULT_REFLECTION_MIN_DISTANCE = 1;


/**
 * Default room dimensions (in meters).
 * @type {Object}
 */
Utils.DEFAULT_ROOM_DIMENSIONS = {
  width: 0, height: 0, depth: 0,
};


/**
 * The multiplier to apply to distances from the listener to each wall.
 * @type {Number}
 */
Utils.DEFAULT_REFLECTION_MULTIPLIER = 1;


/** The default bandwidth (in octaves) of the center frequencies.
 * @type {Number}
 */
Utils.DEFAULT_REVERB_BANDWIDTH = 1;


/** The default multiplier applied when computing tail lengths.
 * @type {Number}
 */
Utils.DEFAULT_REVERB_DURATION_MULTIPLIER = 1;


/**
 * The late reflections pre-delay (in milliseconds).
 * @type {Number}
 */
Utils.DEFAULT_REVERB_PREDELAY = 1.5;


/**
 * The length of the beginning of the impulse response to apply a
 * half-Hann window to.
 * @type {Number}
 */
Utils.DEFAULT_REVERB_TAIL_ONSET = 3.8;


/**
 * The default gain (linear).
 * @type {Number}
 */
Utils.DEFAULT_REVERB_GAIN = 0.01;


/**
 * The maximum impulse response length (in seconds).
 * @type {Number}
 */
Utils.DEFAULT_REVERB_MAX_DURATION = 3;


/**
 * Center frequencies of the multiband late reflections.
 * Nine bands are computed by: 31.25 * 2^(0:8).
 * @type {Array}
 */
Utils.DEFAULT_REVERB_FREQUENCY_BANDS = [
  31.25, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000,
];


/**
 * The number of frequency bands.
 */
Utils.NUMBER_REVERB_FREQUENCY_BANDS =
  Utils.DEFAULT_REVERB_FREQUENCY_BANDS.length;


/**
 * The default multiband RT60 durations (in seconds).
 * @type {Float32Array}
 */
Utils.DEFAULT_REVERB_DURATIONS =
  new Float32Array(Utils.NUMBER_REVERB_FREQUENCY_BANDS);


/**
 * Pre-defined frequency-dependent absorption coefficients for listed materials.
 * Currently supported materials are:
 * <ul>
 * <li>'transparent'</li>
 * <li>'acoustic-ceiling-tiles'</li>
 * <li>'brick-bare'</li>
 * <li>'brick-painted'</li>
 * <li>'concrete-block-coarse'</li>
 * <li>'concrete-block-painted'</li>
 * <li>'curtain-heavy'</li>
 * <li>'fiber-glass-insulation'</li>
 * <li>'glass-thin'</li>
 * <li>'glass-thick'</li>
 * <li>'grass'</li>
 * <li>'linoleum-on-concrete'</li>
 * <li>'marble'</li>
 * <li>'metal'</li>
 * <li>'parquet-on-concrete'</li>
 * <li>'plaster-smooth'</li>
 * <li>'plywood-panel'</li>
 * <li>'polished-concrete-or-tile'</li>
 * <li>'sheetrock'</li>
 * <li>'water-or-ice-surface'</li>
 * <li>'wood-ceiling'</li>
 * <li>'wood-panel'</li>
 * <li>'uniform'</li>
 * </ul>
 * @type {Object}
 */
Utils.ROOM_MATERIAL_COEFFICIENTS = {
  'transparent':
  [1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000],
  'acoustic-ceiling-tiles':
  [0.672, 0.675, 0.700, 0.660, 0.720, 0.920, 0.880, 0.750, 1.000],
  'brick-bare':
  [0.030, 0.030, 0.030, 0.030, 0.030, 0.040, 0.050, 0.070, 0.140],
  'brick-painted':
  [0.006, 0.007, 0.010, 0.010, 0.020, 0.020, 0.020, 0.030, 0.060],
  'concrete-block-coarse':
  [0.360, 0.360, 0.360, 0.440, 0.310, 0.290, 0.390, 0.250, 0.500],
  'concrete-block-painted':
  [0.092, 0.090, 0.100, 0.050, 0.060, 0.070, 0.090, 0.080, 0.160],
  'curtain-heavy':
  [0.073, 0.106, 0.140, 0.350, 0.550, 0.720, 0.700, 0.650, 1.000],
  'fiber-glass-insulation':
  [0.193, 0.220, 0.220, 0.820, 0.990, 0.990, 0.990, 0.990, 1.000],
  'glass-thin':
  [0.180, 0.169, 0.180, 0.060, 0.040, 0.030, 0.020, 0.020, 0.040],
  'glass-thick':
  [0.350, 0.350, 0.350, 0.250, 0.180, 0.120, 0.070, 0.040, 0.080],
  'grass':
  [0.050, 0.050, 0.150, 0.250, 0.400, 0.550, 0.600, 0.600, 0.600],
  'linoleum-on-concrete':
  [0.020, 0.020, 0.020, 0.030, 0.030, 0.030, 0.030, 0.020, 0.040],
  'marble':
  [0.010, 0.010, 0.010, 0.010, 0.010, 0.010, 0.020, 0.020, 0.040],
  'metal':
  [0.030, 0.035, 0.040, 0.040, 0.050, 0.050, 0.050, 0.070, 0.090],
  'parquet-on-concrete':
  [0.028, 0.030, 0.040, 0.040, 0.070, 0.060, 0.060, 0.070, 0.140],
  'plaster-rough':
  [0.017, 0.018, 0.020, 0.030, 0.040, 0.050, 0.040, 0.030, 0.060],
  'plaster-smooth':
  [0.011, 0.012, 0.013, 0.015, 0.020, 0.030, 0.040, 0.050, 0.100],
  'plywood-panel':
  [0.400, 0.340, 0.280, 0.220, 0.170, 0.090, 0.100, 0.110, 0.220],
  'polished-concrete-or-tile':
  [0.008, 0.008, 0.010, 0.010, 0.015, 0.020, 0.020, 0.020, 0.040],
  'sheet-rock':
  [0.290, 0.279, 0.290, 0.100, 0.050, 0.040, 0.070, 0.090, 0.180],
  'water-or-ice-surface':
  [0.006, 0.006, 0.008, 0.008, 0.013, 0.015, 0.020, 0.025, 0.050],
  'wood-ceiling':
  [0.150, 0.147, 0.150, 0.110, 0.100, 0.070, 0.060, 0.070, 0.140],
  'wood-panel':
  [0.280, 0.280, 0.280, 0.220, 0.170, 0.090, 0.100, 0.110, 0.220],
  'uniform':
  [0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500],
};


/**
 * Default materials that use strings from
 * {@linkcode Utils.MATERIAL_COEFFICIENTS MATERIAL_COEFFICIENTS}
 * @type {Object}
 */
Utils.DEFAULT_ROOM_MATERIALS = {
  left: 'transparent', right: 'transparent', front: 'transparent',
  back: 'transparent', down: 'transparent', up: 'transparent',
};


/**
 * The number of bands to average over when computing reflection coefficients.
 * @type {Number}
 */
Utils.NUMBER_REFLECTION_AVERAGING_BANDS = 3;


/**
 * The starting band to average over when computing reflection coefficients.
 * @type {Number}
 */
Utils.ROOM_STARTING_AVERAGING_BAND = 4;


/**
 * The minimum threshold for room volume.
 * Room model is disabled if volume is below this value.
 * @type {Number} */
Utils.ROOM_MIN_VOLUME = 1e-4;


/**
 * Air absorption coefficients per frequency band.
 * @type {Float32Array}
 */
Utils.ROOM_AIR_ABSORPTION_COEFFICIENTS =
  [0.0006, 0.0006, 0.0007, 0.0008, 0.0010, 0.0015, 0.0026, 0.0060, 0.0207];


/**
 * A scalar correction value to ensure Sabine and Eyring produce the same RT60
 * value at the cross-over threshold.
 * @type {Number}
 */
Utils.ROOM_EYRING_CORRECTION_COEFFICIENT = 1.38;


/**
 * @type {Number}
 * @private
 */
Utils.TWO_PI = 6.28318530717959;


/**
 * @type {Number}
 * @private
 */
Utils.TWENTY_FOUR_LOG10 = 55.2620422318571;


/**
 * @type {Number}
 * @private
 */
Utils.LOG1000 = 6.90775527898214;


/**
 * @type {Number}
 * @private
 */
Utils.LOG2_DIV2 = 0.346573590279973;


/**
 * @type {Number}
 * @private
 */
Utils.DEGREES_TO_RADIANS = 0.017453292519943;


/**
 * @type {Number}
 * @private
 */
Utils.RADIANS_TO_DEGREES = 57.295779513082323;


/**
 * @type {Number}
 * @private
 */
Utils.EPSILON_FLOAT = 1e-8;


/**
 * ResonanceAudio library logging function.
 * @type {Function}
 * @param {any} Message to be printed out.
 * @private
 */
Utils.log = function() {
  window.console.log.apply(window.console, [
    '%c[ResonanceAudio]%c '
      + Array.prototype.slice.call(arguments).join(' ') + ' %c(@'
      + performance.now().toFixed(2) + 'ms)',
    'background: #BBDEFB; color: #FF5722; font-weight: 700',
    'font-weight: 400',
    'color: #AAA',
  ]);
};


/**
 * Normalize a 3-d vector.
 * @param {Float32Array} v 3-element vector.
 * @return {Float32Array} 3-element vector.
 * @private
 */
Utils.normalizeVector = function(v) {
  let n = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  if (n > exports.EPSILON_FLOAT) {
    n = 1 / n;
    v[0] *= n;
    v[1] *= n;
    v[2] *= n;
  }
  return v;
};


/**
 * Cross-product between two 3-d vectors.
 * @param {Float32Array} a 3-element vector.
 * @param {Float32Array} b 3-element vector.
 * @return {Float32Array}
 * @private
 */
Utils.crossProduct = function(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
};

module.exports = Utils;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Spatially encodes input using weighted spherical harmonics.
 * @author Andrew Allen <bitllama@google.com>
 */



// Internal dependencies.
const Tables = __webpack_require__(3);
const Utils = __webpack_require__(0);


/**
 * @class Encoder
 * @description Spatially encodes input using weighted spherical harmonics.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Number} options.ambisonicOrder
 * Desired ambisonic order. Defaults to
 * {@linkcode Utils.DEFAULT_AMBISONIC_ORDER DEFAULT_AMBISONIC_ORDER}.
 * @param {Number} options.azimuth
 * Azimuth (in degrees). Defaults to
 * {@linkcode Utils.DEFAULT_AZIMUTH DEFAULT_AZIMUTH}.
 * @param {Number} options.elevation
 * Elevation (in degrees). Defaults to
 * {@linkcode Utils.DEFAULT_ELEVATION DEFAULT_ELEVATION}.
 * @param {Number} options.sourceWidth
 * Source width (in degrees). Where 0 degrees is a point source and 360 degrees
 * is an omnidirectional source. Defaults to
 * {@linkcode Utils.DEFAULT_SOURCE_WIDTH DEFAULT_SOURCE_WIDTH}.
 */
function Encoder(context, options) {
  // Public variables.
  /**
   * Mono (1-channel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof Encoder
   * @instance
   */
  /**
   * Ambisonic (multichannel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof Encoder
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.ambisonicOrder == undefined) {
    options.ambisonicOrder = Utils.DEFAULT_AMBISONIC_ORDER;
  }
  if (options.azimuth == undefined) {
    options.azimuth = Utils.DEFAULT_AZIMUTH;
  }
  if (options.elevation == undefined) {
    options.elevation = Utils.DEFAULT_ELEVATION;
  }
  if (options.sourceWidth == undefined) {
    options.sourceWidth = Utils.DEFAULT_SOURCE_WIDTH;
  }

  this._context = context;

  // Create I/O nodes.
  this.input = context.createGain();
  this._channelGain = [];
  this._merger = undefined;
  this.output = context.createGain();

  // Set initial order, angle and source width.
  this.setAmbisonicOrder(options.ambisonicOrder);
  this._azimuth = options.azimuth;
  this._elevation = options.elevation;
  this.setSourceWidth(options.sourceWidth);
}

/**
 * Set the desired ambisonic order.
 * @param {Number} ambisonicOrder Desired ambisonic order.
 */
Encoder.prototype.setAmbisonicOrder = function(ambisonicOrder) {
  this._ambisonicOrder = Encoder.validateAmbisonicOrder(ambisonicOrder);

  this.input.disconnect();
  for (let i = 0; i < this._channelGain.length; i++) {
    this._channelGain[i].disconnect();
  }
  if (this._merger != undefined) {
    this._merger.disconnect();
  }
  delete this._channelGain;
  delete this._merger;

  // Create audio graph.
  let numChannels = (this._ambisonicOrder + 1) * (this._ambisonicOrder + 1);
  this._merger = this._context.createChannelMerger(numChannels);
  this._channelGain = new Array(numChannels);
  for (let i = 0; i < numChannels; i++) {
    this._channelGain[i] = this._context.createGain();
    this.input.connect(this._channelGain[i]);
    this._channelGain[i].connect(this._merger, 0, i);
  }
  this._merger.connect(this.output);
};


/**
 * Set the direction of the encoded source signal.
 * @param {Number} azimuth
 * Azimuth (in degrees). Defaults to
 * {@linkcode Utils.DEFAULT_AZIMUTH DEFAULT_AZIMUTH}.
 * @param {Number} elevation
 * Elevation (in degrees). Defaults to
 * {@linkcode Utils.DEFAULT_ELEVATION DEFAULT_ELEVATION}.
 */
Encoder.prototype.setDirection = function(azimuth, elevation) {
  // Format input direction to nearest indices.
  if (azimuth == undefined || isNaN(azimuth)) {
    azimuth = Utils.DEFAULT_AZIMUTH;
  }
  if (elevation == undefined || isNaN(elevation)) {
    elevation = Utils.DEFAULT_ELEVATION;
  }

  // Store the formatted input (for updating source width).
  this._azimuth = azimuth;
  this._elevation = elevation;

  // Format direction for index lookups.
  azimuth = Math.round(azimuth % 360);
  if (azimuth < 0) {
    azimuth += 360;
  }
  elevation = Math.round(Math.min(90, Math.max(-90, elevation))) + 90;

  // Assign gains to each output.
  this._channelGain[0].gain.value = Tables.MAX_RE_WEIGHTS[this._spreadIndex][0];
  for (let i = 1; i <= this._ambisonicOrder; i++) {
    let degreeWeight = Tables.MAX_RE_WEIGHTS[this._spreadIndex][i];
    for (let j = -i; j <= i; j++) {
      let acnChannel = (i * i) + i + j;
      let elevationIndex = i * (i + 1) / 2 + Math.abs(j) - 1;
      let val = Tables.SPHERICAL_HARMONICS[1][elevation][elevationIndex];
      if (j != 0) {
        let azimuthIndex = Tables.SPHERICAL_HARMONICS_MAX_ORDER + j - 1;
        if (j < 0) {
          azimuthIndex = Tables.SPHERICAL_HARMONICS_MAX_ORDER + j;
        }
        val *= Tables.SPHERICAL_HARMONICS[0][azimuth][azimuthIndex];
      }
      this._channelGain[acnChannel].gain.value = val * degreeWeight;
    }
  }
};


/**
 * Set the source width (in degrees). Where 0 degrees is a point source and 360
 * degrees is an omnidirectional source.
 * @param {Number} sourceWidth (in degrees).
 */
Encoder.prototype.setSourceWidth = function(sourceWidth) {
  // The MAX_RE_WEIGHTS is a 360 x (Tables.SPHERICAL_HARMONICS_MAX_ORDER+1)
  // size table.
  this._spreadIndex = Math.min(359, Math.max(0, Math.round(sourceWidth)));
  this.setDirection(this._azimuth, this._elevation);
};


/**
 * Validate the provided ambisonic order.
 * @param {Number} ambisonicOrder Desired ambisonic order.
 * @return {Number} Validated/adjusted ambisonic order.
 * @private
 */
Encoder.validateAmbisonicOrder = function(ambisonicOrder) {
  if (isNaN(ambisonicOrder) || ambisonicOrder == undefined) {
    Utils.log('Error: Invalid ambisonic order',
    options.ambisonicOrder, '\nUsing ambisonicOrder=1 instead.');
    ambisonicOrder = 1;
  } else if (ambisonicOrder < 1) {
    Utils.log('Error: Unable to render ambisonic order',
    options.ambisonicOrder, '(Min order is 1)',
    '\nUsing min order instead.');
    ambisonicOrder = 1;
  } else if (ambisonicOrder > Tables.SPHERICAL_HARMONICS_MAX_ORDER) {
    Utils.log('Error: Unable to render ambisonic order',
    options.ambisonicOrder, '(Max order is',
    Tables.SPHERICAL_HARMONICS_MAX_ORDER, ')\nUsing max order instead.');
    options.ambisonicOrder = Tables.SPHERICAL_HARMONICS_MAX_ORDER;
  }
  return ambisonicOrder;
};


module.exports = Encoder;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Listener model to spatialize sources in an environment.
 * @author Andrew Allen <bitllama@google.com>
 */




// Internal dependencies.
const Omnitone = __webpack_require__(12);
const Encoder = __webpack_require__(1);
const Utils = __webpack_require__(0);


/**
 * @class Listener
 * @description Listener model to spatialize sources in an environment.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Number} options.ambisonicOrder
 * Desired ambisonic order. Defaults to
 * {@linkcode Utils.DEFAULT_AMBISONIC_ORDER DEFAULT_AMBISONIC_ORDER}.
 * @param {Float32Array} options.position
 * Initial position (in meters), where origin is the center of
 * the room. Defaults to
 * {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 * @param {Float32Array} options.forward
 * The listener's initial forward vector. Defaults to
 * {@linkcode Utils.DEFAULT_FORWARD DEFAULT_FORWARD}.
 * @param {Float32Array} options.up
 * The listener's initial up vector. Defaults to
 * {@linkcode Utils.DEFAULT_UP DEFAULT_UP}.
 */
function Listener(context, options) {
  // Public variables.
  /**
   * Position (in meters).
   * @member {Float32Array} position
   * @memberof Listener
   * @instance
   */
  /**
   * Ambisonic (multichannel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof Listener
   * @instance
   */
  /**
   * Binaurally-rendered stereo (2-channel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof Listener
   * @instance
   */
  /**
   * Ambisonic (multichannel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} ambisonicOutput
   * @memberof Listener
   * @instance
   */
  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.ambisonicOrder == undefined) {
    options.ambisonicOrder = Utils.DEFAULT_AMBISONIC_ORDER;
  }
  if (options.position == undefined) {
    options.position = Utils.DEFAULT_POSITION.slice();
  }
  if (options.forward == undefined) {
    options.forward = Utils.DEFAULT_FORWARD.slice();
  }
  if (options.up == undefined) {
    options.up = Utils.DEFAULT_UP.slice();
  }

  // Member variables.
  this.position = new Float32Array(3);
  this._tempMatrix3 = new Float32Array(9);

  // Select the appropriate HRIR filters using 2-channel chunks since
  // multichannel audio is not yet supported by a majority of browsers.
  this._ambisonicOrder =
    Encoder.validateAmbisonicOrder(options.ambisonicOrder);

    // Create audio nodes.
  this._context = context;
  if (this._ambisonicOrder == 1) {
    this._renderer = Omnitone.Omnitone.createFOARenderer(context, {});
  } else if (this._ambisonicOrder > 1) {
    this._renderer = Omnitone.Omnitone.createHOARenderer(context, {
      ambisonicOrder: this._ambisonicOrder,
    });
  }

  // These nodes are created in order to safely asynchronously load Omnitone
  // while the rest of the scene is being created.
  this.input = context.createGain();
  this.output = context.createGain();
  this.ambisonicOutput = context.createGain();

  // Initialize Omnitone (async) and connect to audio graph when complete.
  let that = this;
  this._renderer.initialize().then(function() {
    // Connect pre-rotated soundfield to renderer.
    that.input.connect(that._renderer.input);

    // Connect rotated soundfield to ambisonic output.
    if (that._ambisonicOrder > 1) {
      that._renderer._hoaRotator.output.connect(that.ambisonicOutput);
    } else {
      that._renderer._foaRotator.output.connect(that.ambisonicOutput);
    }

    // Connect binaurally-rendered soundfield to binaural output.
    that._renderer.output.connect(that.output);
  });

  // Set orientation and update rotation matrix accordingly.
  this.setOrientation(options.forward[0], options.forward[1],
    options.forward[2], options.up[0], options.up[1], options.up[2]);
}

/**
 * Set the source's orientation using forward and up vectors.
 * @param {Number} forwardX
 * @param {Number} forwardY
 * @param {Number} forwardZ
 * @param {Number} upX
 * @param {Number} upY
 * @param {Number} upZ
 */
Listener.prototype.setOrientation = function(forwardX, forwardY, forwardZ,
  upX, upY, upZ) {
  let right = Utils.crossProduct([forwardX, forwardY, forwardZ],
    [upX, upY, upZ]);
  this._tempMatrix3[0] = right[0];
  this._tempMatrix3[1] = right[1];
  this._tempMatrix3[2] = right[2];
  this._tempMatrix3[3] = upX;
  this._tempMatrix3[4] = upY;
  this._tempMatrix3[5] = upZ;
  this._tempMatrix3[6] = forwardX;
  this._tempMatrix3[7] = forwardY;
  this._tempMatrix3[8] = forwardZ;
  this._renderer.setRotationMatrix3(this._tempMatrix3);
};


/**
 * Set the listener's position and orientation using a Three.js Matrix4 object.
 * @param {Object} matrix4
 * The Three.js Matrix4 object representing the listener's world transform.
 */
Listener.prototype.setFromMatrix = function(matrix4) {
  // Update ambisonic rotation matrix internally.
  this._renderer.setRotationMatrix4(matrix4.elements);

  // Extract position from matrix.
  this.position[0] = matrix4.elements[12];
  this.position[1] = matrix4.elements[13];
  this.position[2] = matrix4.elements[14];
};


module.exports = Listener;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Pre-computed lookup tables for encoding ambisonic sources.
 * @author Andrew Allen <bitllama@google.com>
 */




/**
 * Pre-computed Spherical Harmonics Coefficients.
 *
 * This function generates an efficient lookup table of SH coefficients. It
 * exploits the way SHs are generated (i.e. Ylm = Nlm * Plm * Em). Since Nlm
 * & Plm coefficients only depend on theta, and Em only depends on phi, we
 * can separate the equation along these lines. Em does not depend on
 * degree, so we only need to compute (2 * l) per azimuth Em total and
 * Nlm * Plm is symmetrical across indexes, so only positive indexes are
 * computed ((l + 1) * (l + 2) / 2 - 1) per elevation.
 * @type {Float32Array}
 */
exports.SPHERICAL_HARMONICS =
[
  [
    [0.000000, 0.000000, 0.000000, 1.000000, 1.000000, 1.000000],
    [0.052336, 0.034899, 0.017452, 0.999848, 0.999391, 0.998630],
    [0.104528, 0.069756, 0.034899, 0.999391, 0.997564, 0.994522],
    [0.156434, 0.104528, 0.052336, 0.998630, 0.994522, 0.987688],
    [0.207912, 0.139173, 0.069756, 0.997564, 0.990268, 0.978148],
    [0.258819, 0.173648, 0.087156, 0.996195, 0.984808, 0.965926],
    [0.309017, 0.207912, 0.104528, 0.994522, 0.978148, 0.951057],
    [0.358368, 0.241922, 0.121869, 0.992546, 0.970296, 0.933580],
    [0.406737, 0.275637, 0.139173, 0.990268, 0.961262, 0.913545],
    [0.453990, 0.309017, 0.156434, 0.987688, 0.951057, 0.891007],
    [0.500000, 0.342020, 0.173648, 0.984808, 0.939693, 0.866025],
    [0.544639, 0.374607, 0.190809, 0.981627, 0.927184, 0.838671],
    [0.587785, 0.406737, 0.207912, 0.978148, 0.913545, 0.809017],
    [0.629320, 0.438371, 0.224951, 0.974370, 0.898794, 0.777146],
    [0.669131, 0.469472, 0.241922, 0.970296, 0.882948, 0.743145],
    [0.707107, 0.500000, 0.258819, 0.965926, 0.866025, 0.707107],
    [0.743145, 0.529919, 0.275637, 0.961262, 0.848048, 0.669131],
    [0.777146, 0.559193, 0.292372, 0.956305, 0.829038, 0.629320],
    [0.809017, 0.587785, 0.309017, 0.951057, 0.809017, 0.587785],
    [0.838671, 0.615661, 0.325568, 0.945519, 0.788011, 0.544639],
    [0.866025, 0.642788, 0.342020, 0.939693, 0.766044, 0.500000],
    [0.891007, 0.669131, 0.358368, 0.933580, 0.743145, 0.453990],
    [0.913545, 0.694658, 0.374607, 0.927184, 0.719340, 0.406737],
    [0.933580, 0.719340, 0.390731, 0.920505, 0.694658, 0.358368],
    [0.951057, 0.743145, 0.406737, 0.913545, 0.669131, 0.309017],
    [0.965926, 0.766044, 0.422618, 0.906308, 0.642788, 0.258819],
    [0.978148, 0.788011, 0.438371, 0.898794, 0.615661, 0.207912],
    [0.987688, 0.809017, 0.453990, 0.891007, 0.587785, 0.156434],
    [0.994522, 0.829038, 0.469472, 0.882948, 0.559193, 0.104528],
    [0.998630, 0.848048, 0.484810, 0.874620, 0.529919, 0.052336],
    [1.000000, 0.866025, 0.500000, 0.866025, 0.500000, 0.000000],
    [0.998630, 0.882948, 0.515038, 0.857167, 0.469472, -0.052336],
    [0.994522, 0.898794, 0.529919, 0.848048, 0.438371, -0.104528],
    [0.987688, 0.913545, 0.544639, 0.838671, 0.406737, -0.156434],
    [0.978148, 0.927184, 0.559193, 0.829038, 0.374607, -0.207912],
    [0.965926, 0.939693, 0.573576, 0.819152, 0.342020, -0.258819],
    [0.951057, 0.951057, 0.587785, 0.809017, 0.309017, -0.309017],
    [0.933580, 0.961262, 0.601815, 0.798636, 0.275637, -0.358368],
    [0.913545, 0.970296, 0.615661, 0.788011, 0.241922, -0.406737],
    [0.891007, 0.978148, 0.629320, 0.777146, 0.207912, -0.453990],
    [0.866025, 0.984808, 0.642788, 0.766044, 0.173648, -0.500000],
    [0.838671, 0.990268, 0.656059, 0.754710, 0.139173, -0.544639],
    [0.809017, 0.994522, 0.669131, 0.743145, 0.104528, -0.587785],
    [0.777146, 0.997564, 0.681998, 0.731354, 0.069756, -0.629320],
    [0.743145, 0.999391, 0.694658, 0.719340, 0.034899, -0.669131],
    [0.707107, 1.000000, 0.707107, 0.707107, 0.000000, -0.707107],
    [0.669131, 0.999391, 0.719340, 0.694658, -0.034899, -0.743145],
    [0.629320, 0.997564, 0.731354, 0.681998, -0.069756, -0.777146],
    [0.587785, 0.994522, 0.743145, 0.669131, -0.104528, -0.809017],
    [0.544639, 0.990268, 0.754710, 0.656059, -0.139173, -0.838671],
    [0.500000, 0.984808, 0.766044, 0.642788, -0.173648, -0.866025],
    [0.453990, 0.978148, 0.777146, 0.629320, -0.207912, -0.891007],
    [0.406737, 0.970296, 0.788011, 0.615661, -0.241922, -0.913545],
    [0.358368, 0.961262, 0.798636, 0.601815, -0.275637, -0.933580],
    [0.309017, 0.951057, 0.809017, 0.587785, -0.309017, -0.951057],
    [0.258819, 0.939693, 0.819152, 0.573576, -0.342020, -0.965926],
    [0.207912, 0.927184, 0.829038, 0.559193, -0.374607, -0.978148],
    [0.156434, 0.913545, 0.838671, 0.544639, -0.406737, -0.987688],
    [0.104528, 0.898794, 0.848048, 0.529919, -0.438371, -0.994522],
    [0.052336, 0.882948, 0.857167, 0.515038, -0.469472, -0.998630],
    [0.000000, 0.866025, 0.866025, 0.500000, -0.500000, -1.000000],
    [-0.052336, 0.848048, 0.874620, 0.484810, -0.529919, -0.998630],
    [-0.104528, 0.829038, 0.882948, 0.469472, -0.559193, -0.994522],
    [-0.156434, 0.809017, 0.891007, 0.453990, -0.587785, -0.987688],
    [-0.207912, 0.788011, 0.898794, 0.438371, -0.615661, -0.978148],
    [-0.258819, 0.766044, 0.906308, 0.422618, -0.642788, -0.965926],
    [-0.309017, 0.743145, 0.913545, 0.406737, -0.669131, -0.951057],
    [-0.358368, 0.719340, 0.920505, 0.390731, -0.694658, -0.933580],
    [-0.406737, 0.694658, 0.927184, 0.374607, -0.719340, -0.913545],
    [-0.453990, 0.669131, 0.933580, 0.358368, -0.743145, -0.891007],
    [-0.500000, 0.642788, 0.939693, 0.342020, -0.766044, -0.866025],
    [-0.544639, 0.615661, 0.945519, 0.325568, -0.788011, -0.838671],
    [-0.587785, 0.587785, 0.951057, 0.309017, -0.809017, -0.809017],
    [-0.629320, 0.559193, 0.956305, 0.292372, -0.829038, -0.777146],
    [-0.669131, 0.529919, 0.961262, 0.275637, -0.848048, -0.743145],
    [-0.707107, 0.500000, 0.965926, 0.258819, -0.866025, -0.707107],
    [-0.743145, 0.469472, 0.970296, 0.241922, -0.882948, -0.669131],
    [-0.777146, 0.438371, 0.974370, 0.224951, -0.898794, -0.629320],
    [-0.809017, 0.406737, 0.978148, 0.207912, -0.913545, -0.587785],
    [-0.838671, 0.374607, 0.981627, 0.190809, -0.927184, -0.544639],
    [-0.866025, 0.342020, 0.984808, 0.173648, -0.939693, -0.500000],
    [-0.891007, 0.309017, 0.987688, 0.156434, -0.951057, -0.453990],
    [-0.913545, 0.275637, 0.990268, 0.139173, -0.961262, -0.406737],
    [-0.933580, 0.241922, 0.992546, 0.121869, -0.970296, -0.358368],
    [-0.951057, 0.207912, 0.994522, 0.104528, -0.978148, -0.309017],
    [-0.965926, 0.173648, 0.996195, 0.087156, -0.984808, -0.258819],
    [-0.978148, 0.139173, 0.997564, 0.069756, -0.990268, -0.207912],
    [-0.987688, 0.104528, 0.998630, 0.052336, -0.994522, -0.156434],
    [-0.994522, 0.069756, 0.999391, 0.034899, -0.997564, -0.104528],
    [-0.998630, 0.034899, 0.999848, 0.017452, -0.999391, -0.052336],
    [-1.000000, 0.000000, 1.000000, 0.000000, -1.000000, -0.000000],
    [-0.998630, -0.034899, 0.999848, -0.017452, -0.999391, 0.052336],
    [-0.994522, -0.069756, 0.999391, -0.034899, -0.997564, 0.104528],
    [-0.987688, -0.104528, 0.998630, -0.052336, -0.994522, 0.156434],
    [-0.978148, -0.139173, 0.997564, -0.069756, -0.990268, 0.207912],
    [-0.965926, -0.173648, 0.996195, -0.087156, -0.984808, 0.258819],
    [-0.951057, -0.207912, 0.994522, -0.104528, -0.978148, 0.309017],
    [-0.933580, -0.241922, 0.992546, -0.121869, -0.970296, 0.358368],
    [-0.913545, -0.275637, 0.990268, -0.139173, -0.961262, 0.406737],
    [-0.891007, -0.309017, 0.987688, -0.156434, -0.951057, 0.453990],
    [-0.866025, -0.342020, 0.984808, -0.173648, -0.939693, 0.500000],
    [-0.838671, -0.374607, 0.981627, -0.190809, -0.927184, 0.544639],
    [-0.809017, -0.406737, 0.978148, -0.207912, -0.913545, 0.587785],
    [-0.777146, -0.438371, 0.974370, -0.224951, -0.898794, 0.629320],
    [-0.743145, -0.469472, 0.970296, -0.241922, -0.882948, 0.669131],
    [-0.707107, -0.500000, 0.965926, -0.258819, -0.866025, 0.707107],
    [-0.669131, -0.529919, 0.961262, -0.275637, -0.848048, 0.743145],
    [-0.629320, -0.559193, 0.956305, -0.292372, -0.829038, 0.777146],
    [-0.587785, -0.587785, 0.951057, -0.309017, -0.809017, 0.809017],
    [-0.544639, -0.615661, 0.945519, -0.325568, -0.788011, 0.838671],
    [-0.500000, -0.642788, 0.939693, -0.342020, -0.766044, 0.866025],
    [-0.453990, -0.669131, 0.933580, -0.358368, -0.743145, 0.891007],
    [-0.406737, -0.694658, 0.927184, -0.374607, -0.719340, 0.913545],
    [-0.358368, -0.719340, 0.920505, -0.390731, -0.694658, 0.933580],
    [-0.309017, -0.743145, 0.913545, -0.406737, -0.669131, 0.951057],
    [-0.258819, -0.766044, 0.906308, -0.422618, -0.642788, 0.965926],
    [-0.207912, -0.788011, 0.898794, -0.438371, -0.615661, 0.978148],
    [-0.156434, -0.809017, 0.891007, -0.453990, -0.587785, 0.987688],
    [-0.104528, -0.829038, 0.882948, -0.469472, -0.559193, 0.994522],
    [-0.052336, -0.848048, 0.874620, -0.484810, -0.529919, 0.998630],
    [-0.000000, -0.866025, 0.866025, -0.500000, -0.500000, 1.000000],
    [0.052336, -0.882948, 0.857167, -0.515038, -0.469472, 0.998630],
    [0.104528, -0.898794, 0.848048, -0.529919, -0.438371, 0.994522],
    [0.156434, -0.913545, 0.838671, -0.544639, -0.406737, 0.987688],
    [0.207912, -0.927184, 0.829038, -0.559193, -0.374607, 0.978148],
    [0.258819, -0.939693, 0.819152, -0.573576, -0.342020, 0.965926],
    [0.309017, -0.951057, 0.809017, -0.587785, -0.309017, 0.951057],
    [0.358368, -0.961262, 0.798636, -0.601815, -0.275637, 0.933580],
    [0.406737, -0.970296, 0.788011, -0.615661, -0.241922, 0.913545],
    [0.453990, -0.978148, 0.777146, -0.629320, -0.207912, 0.891007],
    [0.500000, -0.984808, 0.766044, -0.642788, -0.173648, 0.866025],
    [0.544639, -0.990268, 0.754710, -0.656059, -0.139173, 0.838671],
    [0.587785, -0.994522, 0.743145, -0.669131, -0.104528, 0.809017],
    [0.629320, -0.997564, 0.731354, -0.681998, -0.069756, 0.777146],
    [0.669131, -0.999391, 0.719340, -0.694658, -0.034899, 0.743145],
    [0.707107, -1.000000, 0.707107, -0.707107, -0.000000, 0.707107],
    [0.743145, -0.999391, 0.694658, -0.719340, 0.034899, 0.669131],
    [0.777146, -0.997564, 0.681998, -0.731354, 0.069756, 0.629320],
    [0.809017, -0.994522, 0.669131, -0.743145, 0.104528, 0.587785],
    [0.838671, -0.990268, 0.656059, -0.754710, 0.139173, 0.544639],
    [0.866025, -0.984808, 0.642788, -0.766044, 0.173648, 0.500000],
    [0.891007, -0.978148, 0.629320, -0.777146, 0.207912, 0.453990],
    [0.913545, -0.970296, 0.615661, -0.788011, 0.241922, 0.406737],
    [0.933580, -0.961262, 0.601815, -0.798636, 0.275637, 0.358368],
    [0.951057, -0.951057, 0.587785, -0.809017, 0.309017, 0.309017],
    [0.965926, -0.939693, 0.573576, -0.819152, 0.342020, 0.258819],
    [0.978148, -0.927184, 0.559193, -0.829038, 0.374607, 0.207912],
    [0.987688, -0.913545, 0.544639, -0.838671, 0.406737, 0.156434],
    [0.994522, -0.898794, 0.529919, -0.848048, 0.438371, 0.104528],
    [0.998630, -0.882948, 0.515038, -0.857167, 0.469472, 0.052336],
    [1.000000, -0.866025, 0.500000, -0.866025, 0.500000, 0.000000],
    [0.998630, -0.848048, 0.484810, -0.874620, 0.529919, -0.052336],
    [0.994522, -0.829038, 0.469472, -0.882948, 0.559193, -0.104528],
    [0.987688, -0.809017, 0.453990, -0.891007, 0.587785, -0.156434],
    [0.978148, -0.788011, 0.438371, -0.898794, 0.615661, -0.207912],
    [0.965926, -0.766044, 0.422618, -0.906308, 0.642788, -0.258819],
    [0.951057, -0.743145, 0.406737, -0.913545, 0.669131, -0.309017],
    [0.933580, -0.719340, 0.390731, -0.920505, 0.694658, -0.358368],
    [0.913545, -0.694658, 0.374607, -0.927184, 0.719340, -0.406737],
    [0.891007, -0.669131, 0.358368, -0.933580, 0.743145, -0.453990],
    [0.866025, -0.642788, 0.342020, -0.939693, 0.766044, -0.500000],
    [0.838671, -0.615661, 0.325568, -0.945519, 0.788011, -0.544639],
    [0.809017, -0.587785, 0.309017, -0.951057, 0.809017, -0.587785],
    [0.777146, -0.559193, 0.292372, -0.956305, 0.829038, -0.629320],
    [0.743145, -0.529919, 0.275637, -0.961262, 0.848048, -0.669131],
    [0.707107, -0.500000, 0.258819, -0.965926, 0.866025, -0.707107],
    [0.669131, -0.469472, 0.241922, -0.970296, 0.882948, -0.743145],
    [0.629320, -0.438371, 0.224951, -0.974370, 0.898794, -0.777146],
    [0.587785, -0.406737, 0.207912, -0.978148, 0.913545, -0.809017],
    [0.544639, -0.374607, 0.190809, -0.981627, 0.927184, -0.838671],
    [0.500000, -0.342020, 0.173648, -0.984808, 0.939693, -0.866025],
    [0.453990, -0.309017, 0.156434, -0.987688, 0.951057, -0.891007],
    [0.406737, -0.275637, 0.139173, -0.990268, 0.961262, -0.913545],
    [0.358368, -0.241922, 0.121869, -0.992546, 0.970296, -0.933580],
    [0.309017, -0.207912, 0.104528, -0.994522, 0.978148, -0.951057],
    [0.258819, -0.173648, 0.087156, -0.996195, 0.984808, -0.965926],
    [0.207912, -0.139173, 0.069756, -0.997564, 0.990268, -0.978148],
    [0.156434, -0.104528, 0.052336, -0.998630, 0.994522, -0.987688],
    [0.104528, -0.069756, 0.034899, -0.999391, 0.997564, -0.994522],
    [0.052336, -0.034899, 0.017452, -0.999848, 0.999391, -0.998630],
    [0.000000, -0.000000, 0.000000, -1.000000, 1.000000, -1.000000],
    [-0.052336, 0.034899, -0.017452, -0.999848, 0.999391, -0.998630],
    [-0.104528, 0.069756, -0.034899, -0.999391, 0.997564, -0.994522],
    [-0.156434, 0.104528, -0.052336, -0.998630, 0.994522, -0.987688],
    [-0.207912, 0.139173, -0.069756, -0.997564, 0.990268, -0.978148],
    [-0.258819, 0.173648, -0.087156, -0.996195, 0.984808, -0.965926],
    [-0.309017, 0.207912, -0.104528, -0.994522, 0.978148, -0.951057],
    [-0.358368, 0.241922, -0.121869, -0.992546, 0.970296, -0.933580],
    [-0.406737, 0.275637, -0.139173, -0.990268, 0.961262, -0.913545],
    [-0.453990, 0.309017, -0.156434, -0.987688, 0.951057, -0.891007],
    [-0.500000, 0.342020, -0.173648, -0.984808, 0.939693, -0.866025],
    [-0.544639, 0.374607, -0.190809, -0.981627, 0.927184, -0.838671],
    [-0.587785, 0.406737, -0.207912, -0.978148, 0.913545, -0.809017],
    [-0.629320, 0.438371, -0.224951, -0.974370, 0.898794, -0.777146],
    [-0.669131, 0.469472, -0.241922, -0.970296, 0.882948, -0.743145],
    [-0.707107, 0.500000, -0.258819, -0.965926, 0.866025, -0.707107],
    [-0.743145, 0.529919, -0.275637, -0.961262, 0.848048, -0.669131],
    [-0.777146, 0.559193, -0.292372, -0.956305, 0.829038, -0.629320],
    [-0.809017, 0.587785, -0.309017, -0.951057, 0.809017, -0.587785],
    [-0.838671, 0.615661, -0.325568, -0.945519, 0.788011, -0.544639],
    [-0.866025, 0.642788, -0.342020, -0.939693, 0.766044, -0.500000],
    [-0.891007, 0.669131, -0.358368, -0.933580, 0.743145, -0.453990],
    [-0.913545, 0.694658, -0.374607, -0.927184, 0.719340, -0.406737],
    [-0.933580, 0.719340, -0.390731, -0.920505, 0.694658, -0.358368],
    [-0.951057, 0.743145, -0.406737, -0.913545, 0.669131, -0.309017],
    [-0.965926, 0.766044, -0.422618, -0.906308, 0.642788, -0.258819],
    [-0.978148, 0.788011, -0.438371, -0.898794, 0.615661, -0.207912],
    [-0.987688, 0.809017, -0.453990, -0.891007, 0.587785, -0.156434],
    [-0.994522, 0.829038, -0.469472, -0.882948, 0.559193, -0.104528],
    [-0.998630, 0.848048, -0.484810, -0.874620, 0.529919, -0.052336],
    [-1.000000, 0.866025, -0.500000, -0.866025, 0.500000, 0.000000],
    [-0.998630, 0.882948, -0.515038, -0.857167, 0.469472, 0.052336],
    [-0.994522, 0.898794, -0.529919, -0.848048, 0.438371, 0.104528],
    [-0.987688, 0.913545, -0.544639, -0.838671, 0.406737, 0.156434],
    [-0.978148, 0.927184, -0.559193, -0.829038, 0.374607, 0.207912],
    [-0.965926, 0.939693, -0.573576, -0.819152, 0.342020, 0.258819],
    [-0.951057, 0.951057, -0.587785, -0.809017, 0.309017, 0.309017],
    [-0.933580, 0.961262, -0.601815, -0.798636, 0.275637, 0.358368],
    [-0.913545, 0.970296, -0.615661, -0.788011, 0.241922, 0.406737],
    [-0.891007, 0.978148, -0.629320, -0.777146, 0.207912, 0.453990],
    [-0.866025, 0.984808, -0.642788, -0.766044, 0.173648, 0.500000],
    [-0.838671, 0.990268, -0.656059, -0.754710, 0.139173, 0.544639],
    [-0.809017, 0.994522, -0.669131, -0.743145, 0.104528, 0.587785],
    [-0.777146, 0.997564, -0.681998, -0.731354, 0.069756, 0.629320],
    [-0.743145, 0.999391, -0.694658, -0.719340, 0.034899, 0.669131],
    [-0.707107, 1.000000, -0.707107, -0.707107, 0.000000, 0.707107],
    [-0.669131, 0.999391, -0.719340, -0.694658, -0.034899, 0.743145],
    [-0.629320, 0.997564, -0.731354, -0.681998, -0.069756, 0.777146],
    [-0.587785, 0.994522, -0.743145, -0.669131, -0.104528, 0.809017],
    [-0.544639, 0.990268, -0.754710, -0.656059, -0.139173, 0.838671],
    [-0.500000, 0.984808, -0.766044, -0.642788, -0.173648, 0.866025],
    [-0.453990, 0.978148, -0.777146, -0.629320, -0.207912, 0.891007],
    [-0.406737, 0.970296, -0.788011, -0.615661, -0.241922, 0.913545],
    [-0.358368, 0.961262, -0.798636, -0.601815, -0.275637, 0.933580],
    [-0.309017, 0.951057, -0.809017, -0.587785, -0.309017, 0.951057],
    [-0.258819, 0.939693, -0.819152, -0.573576, -0.342020, 0.965926],
    [-0.207912, 0.927184, -0.829038, -0.559193, -0.374607, 0.978148],
    [-0.156434, 0.913545, -0.838671, -0.544639, -0.406737, 0.987688],
    [-0.104528, 0.898794, -0.848048, -0.529919, -0.438371, 0.994522],
    [-0.052336, 0.882948, -0.857167, -0.515038, -0.469472, 0.998630],
    [-0.000000, 0.866025, -0.866025, -0.500000, -0.500000, 1.000000],
    [0.052336, 0.848048, -0.874620, -0.484810, -0.529919, 0.998630],
    [0.104528, 0.829038, -0.882948, -0.469472, -0.559193, 0.994522],
    [0.156434, 0.809017, -0.891007, -0.453990, -0.587785, 0.987688],
    [0.207912, 0.788011, -0.898794, -0.438371, -0.615661, 0.978148],
    [0.258819, 0.766044, -0.906308, -0.422618, -0.642788, 0.965926],
    [0.309017, 0.743145, -0.913545, -0.406737, -0.669131, 0.951057],
    [0.358368, 0.719340, -0.920505, -0.390731, -0.694658, 0.933580],
    [0.406737, 0.694658, -0.927184, -0.374607, -0.719340, 0.913545],
    [0.453990, 0.669131, -0.933580, -0.358368, -0.743145, 0.891007],
    [0.500000, 0.642788, -0.939693, -0.342020, -0.766044, 0.866025],
    [0.544639, 0.615661, -0.945519, -0.325568, -0.788011, 0.838671],
    [0.587785, 0.587785, -0.951057, -0.309017, -0.809017, 0.809017],
    [0.629320, 0.559193, -0.956305, -0.292372, -0.829038, 0.777146],
    [0.669131, 0.529919, -0.961262, -0.275637, -0.848048, 0.743145],
    [0.707107, 0.500000, -0.965926, -0.258819, -0.866025, 0.707107],
    [0.743145, 0.469472, -0.970296, -0.241922, -0.882948, 0.669131],
    [0.777146, 0.438371, -0.974370, -0.224951, -0.898794, 0.629320],
    [0.809017, 0.406737, -0.978148, -0.207912, -0.913545, 0.587785],
    [0.838671, 0.374607, -0.981627, -0.190809, -0.927184, 0.544639],
    [0.866025, 0.342020, -0.984808, -0.173648, -0.939693, 0.500000],
    [0.891007, 0.309017, -0.987688, -0.156434, -0.951057, 0.453990],
    [0.913545, 0.275637, -0.990268, -0.139173, -0.961262, 0.406737],
    [0.933580, 0.241922, -0.992546, -0.121869, -0.970296, 0.358368],
    [0.951057, 0.207912, -0.994522, -0.104528, -0.978148, 0.309017],
    [0.965926, 0.173648, -0.996195, -0.087156, -0.984808, 0.258819],
    [0.978148, 0.139173, -0.997564, -0.069756, -0.990268, 0.207912],
    [0.987688, 0.104528, -0.998630, -0.052336, -0.994522, 0.156434],
    [0.994522, 0.069756, -0.999391, -0.034899, -0.997564, 0.104528],
    [0.998630, 0.034899, -0.999848, -0.017452, -0.999391, 0.052336],
    [1.000000, 0.000000, -1.000000, -0.000000, -1.000000, 0.000000],
    [0.998630, -0.034899, -0.999848, 0.017452, -0.999391, -0.052336],
    [0.994522, -0.069756, -0.999391, 0.034899, -0.997564, -0.104528],
    [0.987688, -0.104528, -0.998630, 0.052336, -0.994522, -0.156434],
    [0.978148, -0.139173, -0.997564, 0.069756, -0.990268, -0.207912],
    [0.965926, -0.173648, -0.996195, 0.087156, -0.984808, -0.258819],
    [0.951057, -0.207912, -0.994522, 0.104528, -0.978148, -0.309017],
    [0.933580, -0.241922, -0.992546, 0.121869, -0.970296, -0.358368],
    [0.913545, -0.275637, -0.990268, 0.139173, -0.961262, -0.406737],
    [0.891007, -0.309017, -0.987688, 0.156434, -0.951057, -0.453990],
    [0.866025, -0.342020, -0.984808, 0.173648, -0.939693, -0.500000],
    [0.838671, -0.374607, -0.981627, 0.190809, -0.927184, -0.544639],
    [0.809017, -0.406737, -0.978148, 0.207912, -0.913545, -0.587785],
    [0.777146, -0.438371, -0.974370, 0.224951, -0.898794, -0.629320],
    [0.743145, -0.469472, -0.970296, 0.241922, -0.882948, -0.669131],
    [0.707107, -0.500000, -0.965926, 0.258819, -0.866025, -0.707107],
    [0.669131, -0.529919, -0.961262, 0.275637, -0.848048, -0.743145],
    [0.629320, -0.559193, -0.956305, 0.292372, -0.829038, -0.777146],
    [0.587785, -0.587785, -0.951057, 0.309017, -0.809017, -0.809017],
    [0.544639, -0.615661, -0.945519, 0.325568, -0.788011, -0.838671],
    [0.500000, -0.642788, -0.939693, 0.342020, -0.766044, -0.866025],
    [0.453990, -0.669131, -0.933580, 0.358368, -0.743145, -0.891007],
    [0.406737, -0.694658, -0.927184, 0.374607, -0.719340, -0.913545],
    [0.358368, -0.719340, -0.920505, 0.390731, -0.694658, -0.933580],
    [0.309017, -0.743145, -0.913545, 0.406737, -0.669131, -0.951057],
    [0.258819, -0.766044, -0.906308, 0.422618, -0.642788, -0.965926],
    [0.207912, -0.788011, -0.898794, 0.438371, -0.615661, -0.978148],
    [0.156434, -0.809017, -0.891007, 0.453990, -0.587785, -0.987688],
    [0.104528, -0.829038, -0.882948, 0.469472, -0.559193, -0.994522],
    [0.052336, -0.848048, -0.874620, 0.484810, -0.529919, -0.998630],
    [0.000000, -0.866025, -0.866025, 0.500000, -0.500000, -1.000000],
    [-0.052336, -0.882948, -0.857167, 0.515038, -0.469472, -0.998630],
    [-0.104528, -0.898794, -0.848048, 0.529919, -0.438371, -0.994522],
    [-0.156434, -0.913545, -0.838671, 0.544639, -0.406737, -0.987688],
    [-0.207912, -0.927184, -0.829038, 0.559193, -0.374607, -0.978148],
    [-0.258819, -0.939693, -0.819152, 0.573576, -0.342020, -0.965926],
    [-0.309017, -0.951057, -0.809017, 0.587785, -0.309017, -0.951057],
    [-0.358368, -0.961262, -0.798636, 0.601815, -0.275637, -0.933580],
    [-0.406737, -0.970296, -0.788011, 0.615661, -0.241922, -0.913545],
    [-0.453990, -0.978148, -0.777146, 0.629320, -0.207912, -0.891007],
    [-0.500000, -0.984808, -0.766044, 0.642788, -0.173648, -0.866025],
    [-0.544639, -0.990268, -0.754710, 0.656059, -0.139173, -0.838671],
    [-0.587785, -0.994522, -0.743145, 0.669131, -0.104528, -0.809017],
    [-0.629320, -0.997564, -0.731354, 0.681998, -0.069756, -0.777146],
    [-0.669131, -0.999391, -0.719340, 0.694658, -0.034899, -0.743145],
    [-0.707107, -1.000000, -0.707107, 0.707107, -0.000000, -0.707107],
    [-0.743145, -0.999391, -0.694658, 0.719340, 0.034899, -0.669131],
    [-0.777146, -0.997564, -0.681998, 0.731354, 0.069756, -0.629320],
    [-0.809017, -0.994522, -0.669131, 0.743145, 0.104528, -0.587785],
    [-0.838671, -0.990268, -0.656059, 0.754710, 0.139173, -0.544639],
    [-0.866025, -0.984808, -0.642788, 0.766044, 0.173648, -0.500000],
    [-0.891007, -0.978148, -0.629320, 0.777146, 0.207912, -0.453990],
    [-0.913545, -0.970296, -0.615661, 0.788011, 0.241922, -0.406737],
    [-0.933580, -0.961262, -0.601815, 0.798636, 0.275637, -0.358368],
    [-0.951057, -0.951057, -0.587785, 0.809017, 0.309017, -0.309017],
    [-0.965926, -0.939693, -0.573576, 0.819152, 0.342020, -0.258819],
    [-0.978148, -0.927184, -0.559193, 0.829038, 0.374607, -0.207912],
    [-0.987688, -0.913545, -0.544639, 0.838671, 0.406737, -0.156434],
    [-0.994522, -0.898794, -0.529919, 0.848048, 0.438371, -0.104528],
    [-0.998630, -0.882948, -0.515038, 0.857167, 0.469472, -0.052336],
    [-1.000000, -0.866025, -0.500000, 0.866025, 0.500000, -0.000000],
    [-0.998630, -0.848048, -0.484810, 0.874620, 0.529919, 0.052336],
    [-0.994522, -0.829038, -0.469472, 0.882948, 0.559193, 0.104528],
    [-0.987688, -0.809017, -0.453990, 0.891007, 0.587785, 0.156434],
    [-0.978148, -0.788011, -0.438371, 0.898794, 0.615661, 0.207912],
    [-0.965926, -0.766044, -0.422618, 0.906308, 0.642788, 0.258819],
    [-0.951057, -0.743145, -0.406737, 0.913545, 0.669131, 0.309017],
    [-0.933580, -0.719340, -0.390731, 0.920505, 0.694658, 0.358368],
    [-0.913545, -0.694658, -0.374607, 0.927184, 0.719340, 0.406737],
    [-0.891007, -0.669131, -0.358368, 0.933580, 0.743145, 0.453990],
    [-0.866025, -0.642788, -0.342020, 0.939693, 0.766044, 0.500000],
    [-0.838671, -0.615661, -0.325568, 0.945519, 0.788011, 0.544639],
    [-0.809017, -0.587785, -0.309017, 0.951057, 0.809017, 0.587785],
    [-0.777146, -0.559193, -0.292372, 0.956305, 0.829038, 0.629320],
    [-0.743145, -0.529919, -0.275637, 0.961262, 0.848048, 0.669131],
    [-0.707107, -0.500000, -0.258819, 0.965926, 0.866025, 0.707107],
    [-0.669131, -0.469472, -0.241922, 0.970296, 0.882948, 0.743145],
    [-0.629320, -0.438371, -0.224951, 0.974370, 0.898794, 0.777146],
    [-0.587785, -0.406737, -0.207912, 0.978148, 0.913545, 0.809017],
    [-0.544639, -0.374607, -0.190809, 0.981627, 0.927184, 0.838671],
    [-0.500000, -0.342020, -0.173648, 0.984808, 0.939693, 0.866025],
    [-0.453990, -0.309017, -0.156434, 0.987688, 0.951057, 0.891007],
    [-0.406737, -0.275637, -0.139173, 0.990268, 0.961262, 0.913545],
    [-0.358368, -0.241922, -0.121869, 0.992546, 0.970296, 0.933580],
    [-0.309017, -0.207912, -0.104528, 0.994522, 0.978148, 0.951057],
    [-0.258819, -0.173648, -0.087156, 0.996195, 0.984808, 0.965926],
    [-0.207912, -0.139173, -0.069756, 0.997564, 0.990268, 0.978148],
    [-0.156434, -0.104528, -0.052336, 0.998630, 0.994522, 0.987688],
    [-0.104528, -0.069756, -0.034899, 0.999391, 0.997564, 0.994522],
    [-0.052336, -0.034899, -0.017452, 0.999848, 0.999391, 0.998630],
  ],
  [
    [-1.000000, -0.000000, 1.000000, -0.000000, 0.000000,
     -1.000000, -0.000000, 0.000000, -0.000000],
    [-0.999848, 0.017452, 0.999543, -0.030224, 0.000264,
     -0.999086, 0.042733, -0.000590, 0.000004],
    [-0.999391, 0.034899, 0.998173, -0.060411, 0.001055,
     -0.996348, 0.085356, -0.002357, 0.000034],
    [-0.998630, 0.052336, 0.995891, -0.090524, 0.002372,
     -0.991791, 0.127757, -0.005297, 0.000113],
    [-0.997564, 0.069756, 0.992701, -0.120527, 0.004214,
     -0.985429, 0.169828, -0.009400, 0.000268],
    [-0.996195, 0.087156, 0.988606, -0.150384, 0.006578,
     -0.977277, 0.211460, -0.014654, 0.000523],
    [-0.994522, 0.104528, 0.983611, -0.180057, 0.009462,
     -0.967356, 0.252544, -0.021043, 0.000903],
    [-0.992546, 0.121869, 0.977722, -0.209511, 0.012862,
     -0.955693, 0.292976, -0.028547, 0.001431],
    [-0.990268, 0.139173, 0.970946, -0.238709, 0.016774,
     -0.942316, 0.332649, -0.037143, 0.002131],
    [-0.987688, 0.156434, 0.963292, -0.267617, 0.021193,
     -0.927262, 0.371463, -0.046806, 0.003026],
    [-0.984808, 0.173648, 0.954769, -0.296198, 0.026114,
     -0.910569, 0.409317, -0.057505, 0.004140],
    [-0.981627, 0.190809, 0.945388, -0.324419, 0.031530,
     -0.892279, 0.446114, -0.069209, 0.005492],
    [-0.978148, 0.207912, 0.935159, -0.352244, 0.037436,
     -0.872441, 0.481759, -0.081880, 0.007105],
    [-0.974370, 0.224951, 0.924096, -0.379641, 0.043823,
     -0.851105, 0.516162, -0.095481, 0.008999],
    [-0.970296, 0.241922, 0.912211, -0.406574, 0.050685,
     -0.828326, 0.549233, -0.109969, 0.011193],
    [-0.965926, 0.258819, 0.899519, -0.433013, 0.058013,
     -0.804164, 0.580889, -0.125300, 0.013707],
    [-0.961262, 0.275637, 0.886036, -0.458924, 0.065797,
     -0.778680, 0.611050, -0.141427, 0.016556],
    [-0.956305, 0.292372, 0.871778, -0.484275, 0.074029,
     -0.751940, 0.639639, -0.158301, 0.019758],
    [-0.951057, 0.309017, 0.856763, -0.509037, 0.082698,
     -0.724012, 0.666583, -0.175868, 0.023329],
    [-0.945519, 0.325568, 0.841008, -0.533178, 0.091794,
     -0.694969, 0.691816, -0.194075, 0.027281],
    [-0.939693, 0.342020, 0.824533, -0.556670, 0.101306,
     -0.664885, 0.715274, -0.212865, 0.031630],
    [-0.933580, 0.358368, 0.807359, -0.579484, 0.111222,
     -0.633837, 0.736898, -0.232180, 0.036385],
    [-0.927184, 0.374607, 0.789505, -0.601592, 0.121529,
     -0.601904, 0.756637, -0.251960, 0.041559],
    [-0.920505, 0.390731, 0.770994, -0.622967, 0.132217,
     -0.569169, 0.774442, -0.272143, 0.047160],
    [-0.913545, 0.406737, 0.751848, -0.643582, 0.143271,
     -0.535715, 0.790270, -0.292666, 0.053196],
    [-0.906308, 0.422618, 0.732091, -0.663414, 0.154678,
     -0.501627, 0.804083, -0.313464, 0.059674],
    [-0.898794, 0.438371, 0.711746, -0.682437, 0.166423,
     -0.466993, 0.815850, -0.334472, 0.066599],
    [-0.891007, 0.453990, 0.690839, -0.700629, 0.178494,
     -0.431899, 0.825544, -0.355623, 0.073974],
    [-0.882948, 0.469472, 0.669395, -0.717968, 0.190875,
     -0.396436, 0.833145, -0.376851, 0.081803],
    [-0.874620, 0.484810, 0.647439, -0.734431, 0.203551,
     -0.360692, 0.838638, -0.398086, 0.090085],
    [-0.866025, 0.500000, 0.625000, -0.750000, 0.216506,
     -0.324760, 0.842012, -0.419263, 0.098821],
    [-0.857167, 0.515038, 0.602104, -0.764655, 0.229726,
     -0.288728, 0.843265, -0.440311, 0.108009],
    [-0.848048, 0.529919, 0.578778, -0.778378, 0.243192,
     -0.252688, 0.842399, -0.461164, 0.117644],
    [-0.838671, 0.544639, 0.555052, -0.791154, 0.256891,
     -0.216730, 0.839422, -0.481753, 0.127722],
    [-0.829038, 0.559193, 0.530955, -0.802965, 0.270803,
     -0.180944, 0.834347, -0.502011, 0.138237],
    [-0.819152, 0.573576, 0.506515, -0.813798, 0.284914,
     -0.145420, 0.827194, -0.521871, 0.149181],
    [-0.809017, 0.587785, 0.481763, -0.823639, 0.299204,
     -0.110246, 0.817987, -0.541266, 0.160545],
    [-0.798636, 0.601815, 0.456728, -0.832477, 0.313658,
     -0.075508, 0.806757, -0.560132, 0.172317],
    [-0.788011, 0.615661, 0.431441, -0.840301, 0.328257,
     -0.041294, 0.793541, -0.578405, 0.184487],
    [-0.777146, 0.629320, 0.405934, -0.847101, 0.342984,
     -0.007686, 0.778379, -0.596021, 0.197040],
    [-0.766044, 0.642788, 0.380236, -0.852869, 0.357821,
     0.025233, 0.761319, -0.612921, 0.209963],
    [-0.754710, 0.656059, 0.354380, -0.857597, 0.372749,
     0.057383, 0.742412, -0.629044, 0.223238],
    [-0.743145, 0.669131, 0.328396, -0.861281, 0.387751,
     0.088686, 0.721714, -0.644334, 0.236850],
    [-0.731354, 0.681998, 0.302317, -0.863916, 0.402807,
     0.119068, 0.699288, -0.658734, 0.250778],
    [-0.719340, 0.694658, 0.276175, -0.865498, 0.417901,
     0.148454, 0.675199, -0.672190, 0.265005],
    [-0.707107, 0.707107, 0.250000, -0.866025, 0.433013,
     0.176777, 0.649519, -0.684653, 0.279508],
    [-0.694658, 0.719340, 0.223825, -0.865498, 0.448125,
     0.203969, 0.622322, -0.696073, 0.294267],
    [-0.681998, 0.731354, 0.197683, -0.863916, 0.463218,
     0.229967, 0.593688, -0.706405, 0.309259],
    [-0.669131, 0.743145, 0.171604, -0.861281, 0.478275,
     0.254712, 0.563700, -0.715605, 0.324459],
    [-0.656059, 0.754710, 0.145620, -0.857597, 0.493276,
     0.278147, 0.532443, -0.723633, 0.339844],
    [-0.642788, 0.766044, 0.119764, -0.852869, 0.508205,
     0.300221, 0.500009, -0.730451, 0.355387],
    [-0.629320, 0.777146, 0.094066, -0.847101, 0.523041,
     0.320884, 0.466490, -0.736025, 0.371063],
    [-0.615661, 0.788011, 0.068559, -0.840301, 0.537768,
     0.340093, 0.431982, -0.740324, 0.386845],
    [-0.601815, 0.798636, 0.043272, -0.832477, 0.552367,
     0.357807, 0.396584, -0.743320, 0.402704],
    [-0.587785, 0.809017, 0.018237, -0.823639, 0.566821,
     0.373991, 0.360397, -0.744989, 0.418613],
    [-0.573576, 0.819152, -0.006515, -0.813798, 0.581112,
     0.388612, 0.323524, -0.745308, 0.434544],
    [-0.559193, 0.829038, -0.030955, -0.802965, 0.595222,
     0.401645, 0.286069, -0.744262, 0.450467],
    [-0.544639, 0.838671, -0.055052, -0.791154, 0.609135,
     0.413066, 0.248140, -0.741835, 0.466352],
    [-0.529919, 0.848048, -0.078778, -0.778378, 0.622833,
     0.422856, 0.209843, -0.738017, 0.482171],
    [-0.515038, 0.857167, -0.102104, -0.764655, 0.636300,
     0.431004, 0.171288, -0.732801, 0.497894],
    [-0.500000, 0.866025, -0.125000, -0.750000, 0.649519,
     0.437500, 0.132583, -0.726184, 0.513490],
    [-0.484810, 0.874620, -0.147439, -0.734431, 0.662474,
     0.442340, 0.093837, -0.718167, 0.528929],
    [-0.469472, 0.882948, -0.169395, -0.717968, 0.675150,
     0.445524, 0.055160, -0.708753, 0.544183],
    [-0.453990, 0.891007, -0.190839, -0.700629, 0.687531,
     0.447059, 0.016662, -0.697950, 0.559220],
    [-0.438371, 0.898794, -0.211746, -0.682437, 0.699602,
     0.446953, -0.021550, -0.685769, 0.574011],
    [-0.422618, 0.906308, -0.232091, -0.663414, 0.711348,
     0.445222, -0.059368, -0.672226, 0.588528],
    [-0.406737, 0.913545, -0.251848, -0.643582, 0.722755,
     0.441884, -0.096684, -0.657339, 0.602741],
    [-0.390731, 0.920505, -0.270994, -0.622967, 0.733809,
     0.436964, -0.133395, -0.641130, 0.616621],
    [-0.374607, 0.927184, -0.289505, -0.601592, 0.744496,
     0.430488, -0.169397, -0.623624, 0.630141],
    [-0.358368, 0.933580, -0.307359, -0.579484, 0.754804,
     0.422491, -0.204589, -0.604851, 0.643273],
    [-0.342020, 0.939693, -0.324533, -0.556670, 0.764720,
     0.413008, -0.238872, -0.584843, 0.655990],
    [-0.325568, 0.945519, -0.341008, -0.533178, 0.774231,
     0.402081, -0.272150, -0.563635, 0.668267],
    [-0.309017, 0.951057, -0.356763, -0.509037, 0.783327,
     0.389754, -0.304329, -0.541266, 0.680078],
    [-0.292372, 0.956305, -0.371778, -0.484275, 0.791997,
     0.376077, -0.335319, -0.517778, 0.691399],
    [-0.275637, 0.961262, -0.386036, -0.458924, 0.800228,
     0.361102, -0.365034, -0.493216, 0.702207],
    [-0.258819, 0.965926, -0.399519, -0.433013, 0.808013,
     0.344885, -0.393389, -0.467627, 0.712478],
    [-0.241922, 0.970296, -0.412211, -0.406574, 0.815340,
     0.327486, -0.420306, -0.441061, 0.722191],
    [-0.224951, 0.974370, -0.424096, -0.379641, 0.822202,
     0.308969, -0.445709, -0.413572, 0.731327],
    [-0.207912, 0.978148, -0.435159, -0.352244, 0.828589,
     0.289399, -0.469527, -0.385215, 0.739866],
    [-0.190809, 0.981627, -0.445388, -0.324419, 0.834495,
     0.268846, -0.491693, -0.356047, 0.747790],
    [-0.173648, 0.984808, -0.454769, -0.296198, 0.839912,
     0.247382, -0.512145, -0.326129, 0.755082],
    [-0.156434, 0.987688, -0.463292, -0.267617, 0.844832,
     0.225081, -0.530827, -0.295521, 0.761728],
    [-0.139173, 0.990268, -0.470946, -0.238709, 0.849251,
     0.202020, -0.547684, -0.264287, 0.767712],
    [-0.121869, 0.992546, -0.477722, -0.209511, 0.853163,
     0.178279, -0.562672, -0.232494, 0.773023],
    [-0.104528, 0.994522, -0.483611, -0.180057, 0.856563,
     0.153937, -0.575747, -0.200207, 0.777648],
    [-0.087156, 0.996195, -0.488606, -0.150384, 0.859447,
     0.129078, -0.586872, -0.167494, 0.781579],
    [-0.069756, 0.997564, -0.492701, -0.120527, 0.861811,
     0.103786, -0.596018, -0.134426, 0.784806],
    [-0.052336, 0.998630, -0.495891, -0.090524, 0.863653,
     0.078146, -0.603158, -0.101071, 0.787324],
    [-0.034899, 0.999391, -0.498173, -0.060411, 0.864971,
     0.052243, -0.608272, -0.067500, 0.789126],
    [-0.017452, 0.999848, -0.499543, -0.030224, 0.865762,
     0.026165, -0.611347, -0.033786, 0.790208],
    [0.000000, 1.000000, -0.500000, 0.000000, 0.866025,
     -0.000000, -0.612372, 0.000000, 0.790569],
    [0.017452, 0.999848, -0.499543, 0.030224, 0.865762,
     -0.026165, -0.611347, 0.033786, 0.790208],
    [0.034899, 0.999391, -0.498173, 0.060411, 0.864971,
     -0.052243, -0.608272, 0.067500, 0.789126],
    [0.052336, 0.998630, -0.495891, 0.090524, 0.863653,
     -0.078146, -0.603158, 0.101071, 0.787324],
    [0.069756, 0.997564, -0.492701, 0.120527, 0.861811,
     -0.103786, -0.596018, 0.134426, 0.784806],
    [0.087156, 0.996195, -0.488606, 0.150384, 0.859447,
     -0.129078, -0.586872, 0.167494, 0.781579],
    [0.104528, 0.994522, -0.483611, 0.180057, 0.856563,
     -0.153937, -0.575747, 0.200207, 0.777648],
    [0.121869, 0.992546, -0.477722, 0.209511, 0.853163,
     -0.178279, -0.562672, 0.232494, 0.773023],
    [0.139173, 0.990268, -0.470946, 0.238709, 0.849251,
     -0.202020, -0.547684, 0.264287, 0.767712],
    [0.156434, 0.987688, -0.463292, 0.267617, 0.844832,
     -0.225081, -0.530827, 0.295521, 0.761728],
    [0.173648, 0.984808, -0.454769, 0.296198, 0.839912,
     -0.247382, -0.512145, 0.326129, 0.755082],
    [0.190809, 0.981627, -0.445388, 0.324419, 0.834495,
     -0.268846, -0.491693, 0.356047, 0.747790],
    [0.207912, 0.978148, -0.435159, 0.352244, 0.828589,
     -0.289399, -0.469527, 0.385215, 0.739866],
    [0.224951, 0.974370, -0.424096, 0.379641, 0.822202,
     -0.308969, -0.445709, 0.413572, 0.731327],
    [0.241922, 0.970296, -0.412211, 0.406574, 0.815340,
     -0.327486, -0.420306, 0.441061, 0.722191],
    [0.258819, 0.965926, -0.399519, 0.433013, 0.808013,
     -0.344885, -0.393389, 0.467627, 0.712478],
    [0.275637, 0.961262, -0.386036, 0.458924, 0.800228,
     -0.361102, -0.365034, 0.493216, 0.702207],
    [0.292372, 0.956305, -0.371778, 0.484275, 0.791997,
     -0.376077, -0.335319, 0.517778, 0.691399],
    [0.309017, 0.951057, -0.356763, 0.509037, 0.783327,
     -0.389754, -0.304329, 0.541266, 0.680078],
    [0.325568, 0.945519, -0.341008, 0.533178, 0.774231,
     -0.402081, -0.272150, 0.563635, 0.668267],
    [0.342020, 0.939693, -0.324533, 0.556670, 0.764720,
     -0.413008, -0.238872, 0.584843, 0.655990],
    [0.358368, 0.933580, -0.307359, 0.579484, 0.754804,
     -0.422491, -0.204589, 0.604851, 0.643273],
    [0.374607, 0.927184, -0.289505, 0.601592, 0.744496,
     -0.430488, -0.169397, 0.623624, 0.630141],
    [0.390731, 0.920505, -0.270994, 0.622967, 0.733809,
     -0.436964, -0.133395, 0.641130, 0.616621],
    [0.406737, 0.913545, -0.251848, 0.643582, 0.722755,
     -0.441884, -0.096684, 0.657339, 0.602741],
    [0.422618, 0.906308, -0.232091, 0.663414, 0.711348,
     -0.445222, -0.059368, 0.672226, 0.588528],
    [0.438371, 0.898794, -0.211746, 0.682437, 0.699602,
     -0.446953, -0.021550, 0.685769, 0.574011],
    [0.453990, 0.891007, -0.190839, 0.700629, 0.687531,
     -0.447059, 0.016662, 0.697950, 0.559220],
    [0.469472, 0.882948, -0.169395, 0.717968, 0.675150,
     -0.445524, 0.055160, 0.708753, 0.544183],
    [0.484810, 0.874620, -0.147439, 0.734431, 0.662474,
     -0.442340, 0.093837, 0.718167, 0.528929],
    [0.500000, 0.866025, -0.125000, 0.750000, 0.649519,
     -0.437500, 0.132583, 0.726184, 0.513490],
    [0.515038, 0.857167, -0.102104, 0.764655, 0.636300,
     -0.431004, 0.171288, 0.732801, 0.497894],
    [0.529919, 0.848048, -0.078778, 0.778378, 0.622833,
     -0.422856, 0.209843, 0.738017, 0.482171],
    [0.544639, 0.838671, -0.055052, 0.791154, 0.609135,
     -0.413066, 0.248140, 0.741835, 0.466352],
    [0.559193, 0.829038, -0.030955, 0.802965, 0.595222,
     -0.401645, 0.286069, 0.744262, 0.450467],
    [0.573576, 0.819152, -0.006515, 0.813798, 0.581112,
     -0.388612, 0.323524, 0.745308, 0.434544],
    [0.587785, 0.809017, 0.018237, 0.823639, 0.566821,
     -0.373991, 0.360397, 0.744989, 0.418613],
    [0.601815, 0.798636, 0.043272, 0.832477, 0.552367,
     -0.357807, 0.396584, 0.743320, 0.402704],
    [0.615661, 0.788011, 0.068559, 0.840301, 0.537768,
     -0.340093, 0.431982, 0.740324, 0.386845],
    [0.629320, 0.777146, 0.094066, 0.847101, 0.523041,
     -0.320884, 0.466490, 0.736025, 0.371063],
    [0.642788, 0.766044, 0.119764, 0.852869, 0.508205,
     -0.300221, 0.500009, 0.730451, 0.355387],
    [0.656059, 0.754710, 0.145620, 0.857597, 0.493276,
     -0.278147, 0.532443, 0.723633, 0.339844],
    [0.669131, 0.743145, 0.171604, 0.861281, 0.478275,
     -0.254712, 0.563700, 0.715605, 0.324459],
    [0.681998, 0.731354, 0.197683, 0.863916, 0.463218,
     -0.229967, 0.593688, 0.706405, 0.309259],
    [0.694658, 0.719340, 0.223825, 0.865498, 0.448125,
     -0.203969, 0.622322, 0.696073, 0.294267],
    [0.707107, 0.707107, 0.250000, 0.866025, 0.433013,
     -0.176777, 0.649519, 0.684653, 0.279508],
    [0.719340, 0.694658, 0.276175, 0.865498, 0.417901,
     -0.148454, 0.675199, 0.672190, 0.265005],
    [0.731354, 0.681998, 0.302317, 0.863916, 0.402807,
     -0.119068, 0.699288, 0.658734, 0.250778],
    [0.743145, 0.669131, 0.328396, 0.861281, 0.387751,
     -0.088686, 0.721714, 0.644334, 0.236850],
    [0.754710, 0.656059, 0.354380, 0.857597, 0.372749,
     -0.057383, 0.742412, 0.629044, 0.223238],
    [0.766044, 0.642788, 0.380236, 0.852869, 0.357821,
     -0.025233, 0.761319, 0.612921, 0.209963],
    [0.777146, 0.629320, 0.405934, 0.847101, 0.342984,
     0.007686, 0.778379, 0.596021, 0.197040],
    [0.788011, 0.615661, 0.431441, 0.840301, 0.328257,
     0.041294, 0.793541, 0.578405, 0.184487],
    [0.798636, 0.601815, 0.456728, 0.832477, 0.313658,
     0.075508, 0.806757, 0.560132, 0.172317],
    [0.809017, 0.587785, 0.481763, 0.823639, 0.299204,
     0.110246, 0.817987, 0.541266, 0.160545],
    [0.819152, 0.573576, 0.506515, 0.813798, 0.284914,
     0.145420, 0.827194, 0.521871, 0.149181],
    [0.829038, 0.559193, 0.530955, 0.802965, 0.270803,
     0.180944, 0.834347, 0.502011, 0.138237],
    [0.838671, 0.544639, 0.555052, 0.791154, 0.256891,
     0.216730, 0.839422, 0.481753, 0.127722],
    [0.848048, 0.529919, 0.578778, 0.778378, 0.243192,
     0.252688, 0.842399, 0.461164, 0.117644],
    [0.857167, 0.515038, 0.602104, 0.764655, 0.229726,
     0.288728, 0.843265, 0.440311, 0.108009],
    [0.866025, 0.500000, 0.625000, 0.750000, 0.216506,
     0.324760, 0.842012, 0.419263, 0.098821],
    [0.874620, 0.484810, 0.647439, 0.734431, 0.203551,
     0.360692, 0.838638, 0.398086, 0.090085],
    [0.882948, 0.469472, 0.669395, 0.717968, 0.190875,
     0.396436, 0.833145, 0.376851, 0.081803],
    [0.891007, 0.453990, 0.690839, 0.700629, 0.178494,
     0.431899, 0.825544, 0.355623, 0.073974],
    [0.898794, 0.438371, 0.711746, 0.682437, 0.166423,
     0.466993, 0.815850, 0.334472, 0.066599],
    [0.906308, 0.422618, 0.732091, 0.663414, 0.154678,
     0.501627, 0.804083, 0.313464, 0.059674],
    [0.913545, 0.406737, 0.751848, 0.643582, 0.143271,
     0.535715, 0.790270, 0.292666, 0.053196],
    [0.920505, 0.390731, 0.770994, 0.622967, 0.132217,
     0.569169, 0.774442, 0.272143, 0.047160],
    [0.927184, 0.374607, 0.789505, 0.601592, 0.121529,
     0.601904, 0.756637, 0.251960, 0.041559],
    [0.933580, 0.358368, 0.807359, 0.579484, 0.111222,
     0.633837, 0.736898, 0.232180, 0.036385],
    [0.939693, 0.342020, 0.824533, 0.556670, 0.101306,
     0.664885, 0.715274, 0.212865, 0.031630],
    [0.945519, 0.325568, 0.841008, 0.533178, 0.091794,
     0.694969, 0.691816, 0.194075, 0.027281],
    [0.951057, 0.309017, 0.856763, 0.509037, 0.082698,
     0.724012, 0.666583, 0.175868, 0.023329],
    [0.956305, 0.292372, 0.871778, 0.484275, 0.074029,
     0.751940, 0.639639, 0.158301, 0.019758],
    [0.961262, 0.275637, 0.886036, 0.458924, 0.065797,
     0.778680, 0.611050, 0.141427, 0.016556],
    [0.965926, 0.258819, 0.899519, 0.433013, 0.058013,
     0.804164, 0.580889, 0.125300, 0.013707],
    [0.970296, 0.241922, 0.912211, 0.406574, 0.050685,
     0.828326, 0.549233, 0.109969, 0.011193],
    [0.974370, 0.224951, 0.924096, 0.379641, 0.043823,
     0.851105, 0.516162, 0.095481, 0.008999],
    [0.978148, 0.207912, 0.935159, 0.352244, 0.037436,
     0.872441, 0.481759, 0.081880, 0.007105],
    [0.981627, 0.190809, 0.945388, 0.324419, 0.031530,
     0.892279, 0.446114, 0.069209, 0.005492],
    [0.984808, 0.173648, 0.954769, 0.296198, 0.026114,
     0.910569, 0.409317, 0.057505, 0.004140],
    [0.987688, 0.156434, 0.963292, 0.267617, 0.021193,
     0.927262, 0.371463, 0.046806, 0.003026],
    [0.990268, 0.139173, 0.970946, 0.238709, 0.016774,
     0.942316, 0.332649, 0.037143, 0.002131],
    [0.992546, 0.121869, 0.977722, 0.209511, 0.012862,
     0.955693, 0.292976, 0.028547, 0.001431],
    [0.994522, 0.104528, 0.983611, 0.180057, 0.009462,
     0.967356, 0.252544, 0.021043, 0.000903],
    [0.996195, 0.087156, 0.988606, 0.150384, 0.006578,
     0.977277, 0.211460, 0.014654, 0.000523],
    [0.997564, 0.069756, 0.992701, 0.120527, 0.004214,
     0.985429, 0.169828, 0.009400, 0.000268],
    [0.998630, 0.052336, 0.995891, 0.090524, 0.002372,
     0.991791, 0.127757, 0.005297, 0.000113],
    [0.999391, 0.034899, 0.998173, 0.060411, 0.001055,
     0.996348, 0.085356, 0.002357, 0.000034],
    [0.999848, 0.017452, 0.999543, 0.030224, 0.000264,
     0.999086, 0.042733, 0.000590, 0.000004],
    [1.000000, -0.000000, 1.000000, -0.000000, 0.000000,
     1.000000, -0.000000, 0.000000, -0.000000],
  ],
];


/** @type {Number} */
exports.SPHERICAL_HARMONICS_AZIMUTH_RESOLUTION =
  exports.SPHERICAL_HARMONICS[0].length;


/** @type {Number} */
exports.SPHERICAL_HARMONICS_ELEVATION_RESOLUTION =
  exports.SPHERICAL_HARMONICS[1].length;


/**
 * The maximum allowed ambisonic order.
 * @type {Number}
 */
exports.SPHERICAL_HARMONICS_MAX_ORDER =
  exports.SPHERICAL_HARMONICS[0][0].length / 2;


/**
 * Pre-computed per-band weighting coefficients for producing energy-preserving
 * Max-Re sources.
 */
exports.MAX_RE_WEIGHTS =
[
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.000000, 1.000000, 1.000000, 1.000000],
  [1.003236, 1.002156, 0.999152, 0.990038],
  [1.032370, 1.021194, 0.990433, 0.898572],
  [1.062694, 1.040231, 0.979161, 0.799806],
  [1.093999, 1.058954, 0.964976, 0.693603],
  [1.126003, 1.077006, 0.947526, 0.579890],
  [1.158345, 1.093982, 0.926474, 0.458690],
  [1.190590, 1.109437, 0.901512, 0.330158],
  [1.222228, 1.122890, 0.872370, 0.194621],
  [1.252684, 1.133837, 0.838839, 0.052614],
  [1.281987, 1.142358, 0.801199, 0.000000],
  [1.312073, 1.150207, 0.760839, 0.000000],
  [1.343011, 1.157424, 0.717799, 0.000000],
  [1.374649, 1.163859, 0.671999, 0.000000],
  [1.406809, 1.169354, 0.623371, 0.000000],
  [1.439286, 1.173739, 0.571868, 0.000000],
  [1.471846, 1.176837, 0.517465, 0.000000],
  [1.504226, 1.178465, 0.460174, 0.000000],
  [1.536133, 1.178438, 0.400043, 0.000000],
  [1.567253, 1.176573, 0.337165, 0.000000],
  [1.597247, 1.172695, 0.271688, 0.000000],
  [1.625766, 1.166645, 0.203815, 0.000000],
  [1.652455, 1.158285, 0.133806, 0.000000],
  [1.676966, 1.147506, 0.061983, 0.000000],
  [1.699006, 1.134261, 0.000000, 0.000000],
  [1.720224, 1.119789, 0.000000, 0.000000],
  [1.741631, 1.104810, 0.000000, 0.000000],
  [1.763183, 1.089330, 0.000000, 0.000000],
  [1.784837, 1.073356, 0.000000, 0.000000],
  [1.806548, 1.056898, 0.000000, 0.000000],
  [1.828269, 1.039968, 0.000000, 0.000000],
  [1.849952, 1.022580, 0.000000, 0.000000],
  [1.871552, 1.004752, 0.000000, 0.000000],
  [1.893018, 0.986504, 0.000000, 0.000000],
  [1.914305, 0.967857, 0.000000, 0.000000],
  [1.935366, 0.948837, 0.000000, 0.000000],
  [1.956154, 0.929471, 0.000000, 0.000000],
  [1.976625, 0.909790, 0.000000, 0.000000],
  [1.996736, 0.889823, 0.000000, 0.000000],
  [2.016448, 0.869607, 0.000000, 0.000000],
  [2.035721, 0.849175, 0.000000, 0.000000],
  [2.054522, 0.828565, 0.000000, 0.000000],
  [2.072818, 0.807816, 0.000000, 0.000000],
  [2.090581, 0.786964, 0.000000, 0.000000],
  [2.107785, 0.766051, 0.000000, 0.000000],
  [2.124411, 0.745115, 0.000000, 0.000000],
  [2.140439, 0.724196, 0.000000, 0.000000],
  [2.155856, 0.703332, 0.000000, 0.000000],
  [2.170653, 0.682561, 0.000000, 0.000000],
  [2.184823, 0.661921, 0.000000, 0.000000],
  [2.198364, 0.641445, 0.000000, 0.000000],
  [2.211275, 0.621169, 0.000000, 0.000000],
  [2.223562, 0.601125, 0.000000, 0.000000],
  [2.235230, 0.581341, 0.000000, 0.000000],
  [2.246289, 0.561847, 0.000000, 0.000000],
  [2.256751, 0.542667, 0.000000, 0.000000],
  [2.266631, 0.523826, 0.000000, 0.000000],
  [2.275943, 0.505344, 0.000000, 0.000000],
  [2.284707, 0.487239, 0.000000, 0.000000],
  [2.292939, 0.469528, 0.000000, 0.000000],
  [2.300661, 0.452225, 0.000000, 0.000000],
  [2.307892, 0.435342, 0.000000, 0.000000],
  [2.314654, 0.418888, 0.000000, 0.000000],
  [2.320969, 0.402870, 0.000000, 0.000000],
  [2.326858, 0.387294, 0.000000, 0.000000],
  [2.332343, 0.372164, 0.000000, 0.000000],
  [2.337445, 0.357481, 0.000000, 0.000000],
  [2.342186, 0.343246, 0.000000, 0.000000],
  [2.346585, 0.329458, 0.000000, 0.000000],
  [2.350664, 0.316113, 0.000000, 0.000000],
  [2.354442, 0.303208, 0.000000, 0.000000],
  [2.357937, 0.290738, 0.000000, 0.000000],
  [2.361168, 0.278698, 0.000000, 0.000000],
  [2.364152, 0.267080, 0.000000, 0.000000],
  [2.366906, 0.255878, 0.000000, 0.000000],
  [2.369446, 0.245082, 0.000000, 0.000000],
  [2.371786, 0.234685, 0.000000, 0.000000],
  [2.373940, 0.224677, 0.000000, 0.000000],
  [2.375923, 0.215048, 0.000000, 0.000000],
  [2.377745, 0.205790, 0.000000, 0.000000],
  [2.379421, 0.196891, 0.000000, 0.000000],
  [2.380959, 0.188342, 0.000000, 0.000000],
  [2.382372, 0.180132, 0.000000, 0.000000],
  [2.383667, 0.172251, 0.000000, 0.000000],
  [2.384856, 0.164689, 0.000000, 0.000000],
  [2.385945, 0.157435, 0.000000, 0.000000],
  [2.386943, 0.150479, 0.000000, 0.000000],
  [2.387857, 0.143811, 0.000000, 0.000000],
  [2.388694, 0.137421, 0.000000, 0.000000],
  [2.389460, 0.131299, 0.000000, 0.000000],
  [2.390160, 0.125435, 0.000000, 0.000000],
  [2.390801, 0.119820, 0.000000, 0.000000],
  [2.391386, 0.114445, 0.000000, 0.000000],
  [2.391921, 0.109300, 0.000000, 0.000000],
  [2.392410, 0.104376, 0.000000, 0.000000],
  [2.392857, 0.099666, 0.000000, 0.000000],
  [2.393265, 0.095160, 0.000000, 0.000000],
  [2.393637, 0.090851, 0.000000, 0.000000],
  [2.393977, 0.086731, 0.000000, 0.000000],
  [2.394288, 0.082791, 0.000000, 0.000000],
  [2.394571, 0.079025, 0.000000, 0.000000],
  [2.394829, 0.075426, 0.000000, 0.000000],
  [2.395064, 0.071986, 0.000000, 0.000000],
  [2.395279, 0.068699, 0.000000, 0.000000],
  [2.395475, 0.065558, 0.000000, 0.000000],
  [2.395653, 0.062558, 0.000000, 0.000000],
  [2.395816, 0.059693, 0.000000, 0.000000],
  [2.395964, 0.056955, 0.000000, 0.000000],
  [2.396099, 0.054341, 0.000000, 0.000000],
  [2.396222, 0.051845, 0.000000, 0.000000],
  [2.396334, 0.049462, 0.000000, 0.000000],
  [2.396436, 0.047186, 0.000000, 0.000000],
  [2.396529, 0.045013, 0.000000, 0.000000],
  [2.396613, 0.042939, 0.000000, 0.000000],
  [2.396691, 0.040959, 0.000000, 0.000000],
  [2.396761, 0.039069, 0.000000, 0.000000],
  [2.396825, 0.037266, 0.000000, 0.000000],
  [2.396883, 0.035544, 0.000000, 0.000000],
  [2.396936, 0.033901, 0.000000, 0.000000],
  [2.396984, 0.032334, 0.000000, 0.000000],
  [2.397028, 0.030838, 0.000000, 0.000000],
  [2.397068, 0.029410, 0.000000, 0.000000],
  [2.397104, 0.028048, 0.000000, 0.000000],
  [2.397137, 0.026749, 0.000000, 0.000000],
  [2.397167, 0.025509, 0.000000, 0.000000],
  [2.397194, 0.024326, 0.000000, 0.000000],
  [2.397219, 0.023198, 0.000000, 0.000000],
  [2.397242, 0.022122, 0.000000, 0.000000],
  [2.397262, 0.021095, 0.000000, 0.000000],
  [2.397281, 0.020116, 0.000000, 0.000000],
  [2.397298, 0.019181, 0.000000, 0.000000],
  [2.397314, 0.018290, 0.000000, 0.000000],
  [2.397328, 0.017441, 0.000000, 0.000000],
  [2.397341, 0.016630, 0.000000, 0.000000],
  [2.397352, 0.015857, 0.000000, 0.000000],
  [2.397363, 0.015119, 0.000000, 0.000000],
  [2.397372, 0.014416, 0.000000, 0.000000],
  [2.397381, 0.013745, 0.000000, 0.000000],
  [2.397389, 0.013106, 0.000000, 0.000000],
  [2.397396, 0.012496, 0.000000, 0.000000],
  [2.397403, 0.011914, 0.000000, 0.000000],
  [2.397409, 0.011360, 0.000000, 0.000000],
  [2.397414, 0.010831, 0.000000, 0.000000],
  [2.397419, 0.010326, 0.000000, 0.000000],
  [2.397424, 0.009845, 0.000000, 0.000000],
  [2.397428, 0.009387, 0.000000, 0.000000],
  [2.397432, 0.008949, 0.000000, 0.000000],
  [2.397435, 0.008532, 0.000000, 0.000000],
  [2.397438, 0.008135, 0.000000, 0.000000],
  [2.397441, 0.007755, 0.000000, 0.000000],
  [2.397443, 0.007394, 0.000000, 0.000000],
  [2.397446, 0.007049, 0.000000, 0.000000],
  [2.397448, 0.006721, 0.000000, 0.000000],
  [2.397450, 0.006407, 0.000000, 0.000000],
  [2.397451, 0.006108, 0.000000, 0.000000],
  [2.397453, 0.005824, 0.000000, 0.000000],
  [2.397454, 0.005552, 0.000000, 0.000000],
  [2.397456, 0.005293, 0.000000, 0.000000],
  [2.397457, 0.005046, 0.000000, 0.000000],
  [2.397458, 0.004811, 0.000000, 0.000000],
  [2.397459, 0.004586, 0.000000, 0.000000],
  [2.397460, 0.004372, 0.000000, 0.000000],
  [2.397461, 0.004168, 0.000000, 0.000000],
  [2.397461, 0.003974, 0.000000, 0.000000],
  [2.397462, 0.003788, 0.000000, 0.000000],
  [2.397463, 0.003611, 0.000000, 0.000000],
  [2.397463, 0.003443, 0.000000, 0.000000],
  [2.397464, 0.003282, 0.000000, 0.000000],
  [2.397464, 0.003129, 0.000000, 0.000000],
  [2.397465, 0.002983, 0.000000, 0.000000],
  [2.397465, 0.002844, 0.000000, 0.000000],
  [2.397465, 0.002711, 0.000000, 0.000000],
  [2.397466, 0.002584, 0.000000, 0.000000],
  [2.397466, 0.002464, 0.000000, 0.000000],
  [2.397466, 0.002349, 0.000000, 0.000000],
  [2.397466, 0.002239, 0.000000, 0.000000],
  [2.397467, 0.002135, 0.000000, 0.000000],
  [2.397467, 0.002035, 0.000000, 0.000000],
  [2.397467, 0.001940, 0.000000, 0.000000],
  [2.397467, 0.001849, 0.000000, 0.000000],
  [2.397467, 0.001763, 0.000000, 0.000000],
  [2.397467, 0.001681, 0.000000, 0.000000],
  [2.397468, 0.001602, 0.000000, 0.000000],
  [2.397468, 0.001527, 0.000000, 0.000000],
  [2.397468, 0.001456, 0.000000, 0.000000],
  [2.397468, 0.001388, 0.000000, 0.000000],
  [2.397468, 0.001323, 0.000000, 0.000000],
  [2.397468, 0.001261, 0.000000, 0.000000],
  [2.397468, 0.001202, 0.000000, 0.000000],
  [2.397468, 0.001146, 0.000000, 0.000000],
  [2.397468, 0.001093, 0.000000, 0.000000],
  [2.397468, 0.001042, 0.000000, 0.000000],
  [2.397468, 0.000993, 0.000000, 0.000000],
  [2.397468, 0.000947, 0.000000, 0.000000],
  [2.397468, 0.000902, 0.000000, 0.000000],
  [2.397468, 0.000860, 0.000000, 0.000000],
  [2.397468, 0.000820, 0.000000, 0.000000],
  [2.397469, 0.000782, 0.000000, 0.000000],
  [2.397469, 0.000745, 0.000000, 0.000000],
  [2.397469, 0.000710, 0.000000, 0.000000],
  [2.397469, 0.000677, 0.000000, 0.000000],
  [2.397469, 0.000646, 0.000000, 0.000000],
  [2.397469, 0.000616, 0.000000, 0.000000],
  [2.397469, 0.000587, 0.000000, 0.000000],
  [2.397469, 0.000559, 0.000000, 0.000000],
  [2.397469, 0.000533, 0.000000, 0.000000],
  [2.397469, 0.000508, 0.000000, 0.000000],
  [2.397469, 0.000485, 0.000000, 0.000000],
  [2.397469, 0.000462, 0.000000, 0.000000],
  [2.397469, 0.000440, 0.000000, 0.000000],
  [2.397469, 0.000420, 0.000000, 0.000000],
  [2.397469, 0.000400, 0.000000, 0.000000],
  [2.397469, 0.000381, 0.000000, 0.000000],
  [2.397469, 0.000364, 0.000000, 0.000000],
  [2.397469, 0.000347, 0.000000, 0.000000],
  [2.397469, 0.000330, 0.000000, 0.000000],
  [2.397469, 0.000315, 0.000000, 0.000000],
  [2.397469, 0.000300, 0.000000, 0.000000],
  [2.397469, 0.000286, 0.000000, 0.000000],
  [2.397469, 0.000273, 0.000000, 0.000000],
  [2.397469, 0.000260, 0.000000, 0.000000],
  [2.397469, 0.000248, 0.000000, 0.000000],
  [2.397469, 0.000236, 0.000000, 0.000000],
  [2.397469, 0.000225, 0.000000, 0.000000],
  [2.397469, 0.000215, 0.000000, 0.000000],
  [2.397469, 0.000205, 0.000000, 0.000000],
  [2.397469, 0.000195, 0.000000, 0.000000],
  [2.397469, 0.000186, 0.000000, 0.000000],
  [2.397469, 0.000177, 0.000000, 0.000000],
  [2.397469, 0.000169, 0.000000, 0.000000],
  [2.397469, 0.000161, 0.000000, 0.000000],
  [2.397469, 0.000154, 0.000000, 0.000000],
  [2.397469, 0.000147, 0.000000, 0.000000],
  [2.397469, 0.000140, 0.000000, 0.000000],
  [2.397469, 0.000133, 0.000000, 0.000000],
  [2.397469, 0.000127, 0.000000, 0.000000],
  [2.397469, 0.000121, 0.000000, 0.000000],
  [2.397469, 0.000115, 0.000000, 0.000000],
  [2.397469, 0.000110, 0.000000, 0.000000],
  [2.397469, 0.000105, 0.000000, 0.000000],
  [2.397469, 0.000100, 0.000000, 0.000000],
  [2.397469, 0.000095, 0.000000, 0.000000],
  [2.397469, 0.000091, 0.000000, 0.000000],
  [2.397469, 0.000087, 0.000000, 0.000000],
  [2.397469, 0.000083, 0.000000, 0.000000],
  [2.397469, 0.000079, 0.000000, 0.000000],
  [2.397469, 0.000075, 0.000000, 0.000000],
  [2.397469, 0.000071, 0.000000, 0.000000],
  [2.397469, 0.000068, 0.000000, 0.000000],
  [2.397469, 0.000065, 0.000000, 0.000000],
  [2.397469, 0.000062, 0.000000, 0.000000],
  [2.397469, 0.000059, 0.000000, 0.000000],
  [2.397469, 0.000056, 0.000000, 0.000000],
  [2.397469, 0.000054, 0.000000, 0.000000],
  [2.397469, 0.000051, 0.000000, 0.000000],
  [2.397469, 0.000049, 0.000000, 0.000000],
  [2.397469, 0.000046, 0.000000, 0.000000],
  [2.397469, 0.000044, 0.000000, 0.000000],
  [2.397469, 0.000042, 0.000000, 0.000000],
  [2.397469, 0.000040, 0.000000, 0.000000],
  [2.397469, 0.000038, 0.000000, 0.000000],
  [2.397469, 0.000037, 0.000000, 0.000000],
  [2.397469, 0.000035, 0.000000, 0.000000],
  [2.397469, 0.000033, 0.000000, 0.000000],
  [2.397469, 0.000032, 0.000000, 0.000000],
  [2.397469, 0.000030, 0.000000, 0.000000],
  [2.397469, 0.000029, 0.000000, 0.000000],
  [2.397469, 0.000027, 0.000000, 0.000000],
  [2.397469, 0.000026, 0.000000, 0.000000],
  [2.397469, 0.000025, 0.000000, 0.000000],
  [2.397469, 0.000024, 0.000000, 0.000000],
  [2.397469, 0.000023, 0.000000, 0.000000],
  [2.397469, 0.000022, 0.000000, 0.000000],
  [2.397469, 0.000021, 0.000000, 0.000000],
  [2.397469, 0.000020, 0.000000, 0.000000],
  [2.397469, 0.000019, 0.000000, 0.000000],
  [2.397469, 0.000018, 0.000000, 0.000000],
  [2.397469, 0.000017, 0.000000, 0.000000],
  [2.397469, 0.000016, 0.000000, 0.000000],
  [2.397469, 0.000015, 0.000000, 0.000000],
  [2.397469, 0.000015, 0.000000, 0.000000],
  [2.397469, 0.000014, 0.000000, 0.000000],
  [2.397469, 0.000013, 0.000000, 0.000000],
  [2.397469, 0.000013, 0.000000, 0.000000],
  [2.397469, 0.000012, 0.000000, 0.000000],
  [2.397469, 0.000012, 0.000000, 0.000000],
  [2.397469, 0.000011, 0.000000, 0.000000],
  [2.397469, 0.000011, 0.000000, 0.000000],
  [2.397469, 0.000010, 0.000000, 0.000000],
  [2.397469, 0.000010, 0.000000, 0.000000],
  [2.397469, 0.000009, 0.000000, 0.000000],
  [2.397469, 0.000009, 0.000000, 0.000000],
  [2.397469, 0.000008, 0.000000, 0.000000],
  [2.397469, 0.000008, 0.000000, 0.000000],
  [2.397469, 0.000008, 0.000000, 0.000000],
  [2.397469, 0.000007, 0.000000, 0.000000],
  [2.397469, 0.000007, 0.000000, 0.000000],
  [2.397469, 0.000007, 0.000000, 0.000000],
  [2.397469, 0.000006, 0.000000, 0.000000],
  [2.397469, 0.000006, 0.000000, 0.000000],
  [2.397469, 0.000006, 0.000000, 0.000000],
  [2.397469, 0.000005, 0.000000, 0.000000],
  [2.397469, 0.000005, 0.000000, 0.000000],
  [2.397469, 0.000005, 0.000000, 0.000000],
  [2.397469, 0.000005, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000004, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000003, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000002, 0.000000, 0.000000],
  [2.397469, 0.000001, 0.000000, 0.000000],
  [2.397469, 0.000001, 0.000000, 0.000000],
  [2.397469, 0.000001, 0.000000, 0.000000],
];


/** @type {Number} */
exports.MAX_RE_WEIGHTS_RESOLUTION = exports.MAX_RE_WEIGHTS.length;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Source model to spatialize an audio buffer.
 * @author Andrew Allen <bitllama@google.com>
 */




// Internal dependencies.
const Directivity = __webpack_require__(5);
const Attenuation = __webpack_require__(6);
const Encoder = __webpack_require__(1);
const Utils = __webpack_require__(0);


/**
 * @class Source
 * @description Source model to spatialize an audio buffer.
 * @param {ResonanceAudio} scene Associated {@link ResonanceAudio
 * ResonanceAudio} instance.
 * @param {Object} options
 * @param {Float32Array} options.position
 * The source's initial position (in meters), where origin is the center of
 * the room. Defaults to {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 * @param {Float32Array} options.forward
 * The source's initial forward vector. Defaults to
 * {@linkcode Utils.DEFAULT_FORWARD DEFAULT_FORWARD}.
 * @param {Float32Array} options.up
 * The source's initial up vector. Defaults to
 * {@linkcode Utils.DEFAULT_UP DEFAULT_UP}.
 * @param {Number} options.minDistance
 * Min. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MIN_DISTANCE DEFAULT_MIN_DISTANCE}.
 * @param {Number} options.maxDistance
 * Max. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MAX_DISTANCE DEFAULT_MAX_DISTANCE}.
 * @param {string} options.rolloff
 * Rolloff model to use, chosen from options in
 * {@linkcode Utils.ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}. Defaults to
 * {@linkcode Utils.DEFAULT_ATTENUATION_ROLLOFF DEFAULT_ATTENUATION_ROLLOFF}.
 * @param {Number} options.gain Input gain (linear). Defaults to
 * {@linkcode Utils.DEFAULT_SOURCE_GAIN DEFAULT_SOURCE_GAIN}.
 * @param {Number} options.alpha Directivity alpha. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_ALPHA DEFAULT_DIRECTIVITY_ALPHA}.
 * @param {Number} options.sharpness Directivity sharpness. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_SHARPNESS
 * DEFAULT_DIRECTIVITY_SHARPNESS}.
 * @param {Number} options.sourceWidth
 * Source width (in degrees). Where 0 degrees is a point source and 360 degrees
 * is an omnidirectional source. Defaults to
 * {@linkcode Utils.DEFAULT_SOURCE_WIDTH DEFAULT_SOURCE_WIDTH}.
 */
function Source(scene, options) {
  // Public variables.
  /**
   * Mono (1-channel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof Source
   * @instance
   */
  /**
   *
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.position == undefined) {
    options.position = Utils.DEFAULT_POSITION.slice();
  }
  if (options.forward == undefined) {
    options.forward = Utils.DEFAULT_FORWARD.slice();
  }
  if (options.up == undefined) {
    options.up = Utils.DEFAULT_UP.slice();
  }
  if (options.minDistance == undefined) {
    options.minDistance = Utils.DEFAULT_MIN_DISTANCE;
  }
  if (options.maxDistance == undefined) {
    options.maxDistance = Utils.DEFAULT_MAX_DISTANCE;
  }
  if (options.rolloff == undefined) {
    options.rolloff = Utils.DEFAULT_ROLLOFF;
  }
  if (options.gain == undefined) {
    options.gain = Utils.DEFAULT_SOURCE_GAIN;
  }
  if (options.alpha == undefined) {
    options.alpha = Utils.DEFAULT_DIRECTIVITY_ALPHA;
  }
  if (options.sharpness == undefined) {
    options.sharpness = Utils.DEFAULT_DIRECTIVITY_SHARPNESS;
  }
  if (options.sourceWidth == undefined) {
    options.sourceWidth = Utils.DEFAULT_SOURCE_WIDTH;
  }

  // Member variables.
  this._scene = scene;
  this._position = options.position;
  this._forward = options.forward;
  this._up = options.up;
  this._dx = new Float32Array(3);
  this._right = Utils.crossProduct(this._forward, this._up);

  // Create audio nodes.
  let context = scene._context;
  this.input = context.createGain();
  this._directivity = new Directivity(context, {
    alpha: options.alpha,
    sharpness: options.sharpness,
  });
  this._toEarly = context.createGain();
  this._toLate = context.createGain();
  this._attenuation = new Attenuation(context, {
    minDistance: options.minDistance,
    maxDistance: options.maxDistance,
    rolloff: options.rolloff,
  });
  this._encoder = new Encoder(context, {
    ambisonicOrder: scene._ambisonicOrder,
    sourceWidth: options.sourceWidth,
  });

  // Connect nodes.
  this.input.connect(this._toLate);
  this._toLate.connect(scene._room.late.input);

  this.input.connect(this._attenuation.input);
  this._attenuation.output.connect(this._toEarly);
  this._toEarly.connect(scene._room.early.input);

  this._attenuation.output.connect(this._directivity.input);
  this._directivity.output.connect(this._encoder.input);

  this._encoder.output.connect(scene._listener.input);

  // Assign initial conditions.
  this.setPosition(
    options.position[0], options.position[1], options.position[2]);
  this.input.gain.value = options.gain;
}

/**
 * Set source's position (in meters), where origin is the center of
 * the room.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
Source.prototype.setPosition = function(x, y, z) {
  // Assign new position.
  this._position[0] = x;
  this._position[1] = y;
  this._position[2] = z;

  // Handle far-field effect.
  let distance = this._scene._room.getDistanceOutsideRoom(
    this._position[0], this._position[1], this._position[2]);
    let gain = _computeDistanceOutsideRoom(distance);
  this._toLate.gain.value = gain;
  this._toEarly.gain.value = gain;

  this._update();
};


// Update the source when changing the listener's position.
Source.prototype._update = function() {
  // Compute distance to listener.
  for (let i = 0; i < 3; i++) {
    this._dx[i] = this._position[i] - this._scene._listener.position[i];
  }
  let distance = Math.sqrt(this._dx[0] * this._dx[0] +
    this._dx[1] * this._dx[1] + this._dx[2] * this._dx[2]);
  if (distance > 0) {
    // Normalize direction vector.
    this._dx[0] /= distance;
    this._dx[1] /= distance;
    this._dx[2] /= distance;
  }

  // Compuete angle of direction vector.
  let azimuth = Math.atan2(-this._dx[0], this._dx[2]) *
    Utils.RADIANS_TO_DEGREES;
  let elevation = Math.atan2(this._dx[1], Math.sqrt(this._dx[0] * this._dx[0] +
    this._dx[2] * this._dx[2])) * Utils.RADIANS_TO_DEGREES;

  // Set distance/directivity/direction values.
  this._attenuation.setDistance(distance);
  this._directivity.computeAngle(this._forward, this._dx);
  this._encoder.setDirection(azimuth, elevation);
};


/**
 * Set source's rolloff.
 * @param {string} rolloff
 * Rolloff model to use, chosen from options in
 * {@linkcode Utils.ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}.
 */
Source.prototype.setRolloff = function(rolloff) {
  this._attenuation.setRolloff(rolloff);
};


/**
 * Set source's minimum distance (in meters).
 * @param {Number} minDistance
 */
Source.prototype.setMinDistance = function(minDistance) {
  this._attenuation.minDistance = minDistance;
};


/**
 * Set source's maximum distance (in meters).
 * @param {Number} maxDistance
 */
Source.prototype.setMaxDistance = function(maxDistance) {
  this._attenuation.maxDistance = maxDistance;
};


/**
 * Set source's gain (linear).
 * @param {Number} gain
 */
Source.prototype.setGain = function(gain) {
  this.input.gain.value = gain;
};


/**
 * Set the source's orientation using forward and up vectors.
 * @param {Number} forwardX
 * @param {Number} forwardY
 * @param {Number} forwardZ
 * @param {Number} upX
 * @param {Number} upY
 * @param {Number} upZ
 */
Source.prototype.setOrientation = function(forwardX, forwardY, forwardZ,
    upX, upY, upZ) {
  this._forward[0] = forwardX;
  this._forward[1] = forwardY;
  this._forward[2] = forwardZ;
  this._up[0] = upX;
  this._up[1] = upY;
  this._up[2] = upZ;
  this._right = Utils.crossProduct(this._forward, this._up);
};


// TODO(bitllama): Make sure this works with Three.js as intended.
/**
 * Set source's position and orientation using a
 * Three.js modelViewMatrix object.
 * @param {Float32Array} matrix4
 * The Matrix4 representing the object position and rotation in world space.
 */
Source.prototype.setFromMatrix = function(matrix4) {
  this._right[0] = matrix4.elements[0];
  this._right[1] = matrix4.elements[1];
  this._right[2] = matrix4.elements[2];
  this._up[0] = matrix4.elements[4];
  this._up[1] = matrix4.elements[5];
  this._up[2] = matrix4.elements[6];
  this._forward[0] = matrix4.elements[8];
  this._forward[1] = matrix4.elements[9];
  this._forward[2] = matrix4.elements[10];

  // Normalize to remove scaling.
  this._right = Utils.normalizeVector(this._right);
  this._up = Utils.normalizeVector(this._up);
  this._forward = Utils.normalizeVector(this._forward);

  // Update position.
  this.setPosition(
    matrix4.elements[12], matrix4.elements[13], matrix4.elements[14]);
};


/**
 * Set the source width (in degrees). Where 0 degrees is a point source and 360
 * degrees is an omnidirectional source.
 * @param {Number} sourceWidth (in degrees).
 */
Source.prototype.setSourceWidth = function(sourceWidth) {
  this._encoder.setSourceWidth(sourceWidth);
  this.setPosition(this._position[0], this._position[1], this._position[2]);
};


/**
 * Set source's directivity pattern (defined by alpha), where 0 is an
 * omnidirectional pattern, 1 is a bidirectional pattern, 0.5 is a cardiod
 * pattern. The sharpness of the pattern is increased exponentially.
 * @param {Number} alpha
 * Determines directivity pattern (0 to 1).
 * @param {Number} sharpness
 * Determines the sharpness of the directivity pattern (1 to Inf).
 */
Source.prototype.setDirectivityPattern = function(alpha, sharpness) {
  this._directivity.setPattern(alpha, sharpness);
  this.setPosition(this._position[0], this._position[1], this._position[2]);
};


/**
 * Determine the distance a source is outside of a room. Attenuate gain going
 * to the reflections and reverb when the source is outside of the room.
 * @param {Number} distance Distance in meters.
 * @return {Number} Gain (linear) of source.
 * @private
 */
function _computeDistanceOutsideRoom(distance) {
  // We apply a linear ramp from 1 to 0 as the source is up to 1m outside.
  let gain = 1;
  if (distance > Utils.EPSILON_FLOAT) {
    gain = 1 - distance / Utils.SOURCE_MAX_OUTSIDE_ROOM_DISTANCE;

    // Clamp gain between 0 and 1.
    gain = Math.max(0, Math.min(1, gain));
  }
  return gain;
}


module.exports = Source;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Directivity/occlusion filter.
 * @author Andrew Allen <bitllama@google.com>
 */



// Internal dependencies.
const Utils = __webpack_require__(0);


/**
 * @class Directivity
 * @description Directivity/occlusion filter.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Number} options.alpha
 * Determines directivity pattern (0 to 1). See
 * {@link Directivity#setPattern setPattern} for more details. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_ALPHA DEFAULT_DIRECTIVITY_ALPHA}.
 * @param {Number} options.sharpness
 * Determines the sharpness of the directivity pattern (1 to Inf). See
 * {@link Directivity#setPattern setPattern} for more details. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_SHARPNESS
 * DEFAULT_DIRECTIVITY_SHARPNESS}.
 */
function Directivity(context, options) {
  // Public variables.
  /**
   * Mono (1-channel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof Directivity
   * @instance
   */
  /**
   * Mono (1-channel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof Directivity
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.alpha == undefined) {
    options.alpha = Utils.DEFAULT_DIRECTIVITY_ALPHA;
  }
  if (options.sharpness == undefined) {
    options.sharpness = Utils.DEFAULT_DIRECTIVITY_SHARPNESS;
  }

  // Create audio node.
  this._context = context;
  this._lowpass = context.createBiquadFilter();

  // Initialize filter coefficients.
  this._lowpass.type = 'lowpass';
  this._lowpass.Q.value = 0;
  this._lowpass.frequency.value = context.sampleRate * 0.5;

  this._cosTheta = 0;
  this.setPattern(options.alpha, options.sharpness);

  // Input/Output proxy.
  this.input = this._lowpass;
  this.output = this._lowpass;
}


/**
 * Compute the filter using the source's forward orientation and the listener's
 * position.
 * @param {Float32Array} forward The source's forward vector.
 * @param {Float32Array} direction The direction from the source to the
 * listener.
 */
Directivity.prototype.computeAngle = function(forward, direction) {
  let forwardNorm = Utils.normalizeVector(forward);
  let directionNorm = Utils.normalizeVector(direction);
  let coeff = 1;
  if (this._alpha > Utils.EPSILON_FLOAT) {
    let cosTheta = forwardNorm[0] * directionNorm[0] +
      forwardNorm[1] * directionNorm[1] + forwardNorm[2] * directionNorm[2];
    coeff = (1 - this._alpha) + this._alpha * cosTheta;
    coeff = Math.pow(Math.abs(coeff), this._sharpness);
  }
  this._lowpass.frequency.value = this._context.sampleRate * 0.5 * coeff;
};


/**
 * Set source's directivity pattern (defined by alpha), where 0 is an
 * omnidirectional pattern, 1 is a bidirectional pattern, 0.5 is a cardiod
 * pattern. The sharpness of the pattern is increased exponenentially.
 * @param {Number} alpha
 * Determines directivity pattern (0 to 1).
 * @param {Number} sharpness
 * Determines the sharpness of the directivity pattern (1 to Inf).
 * DEFAULT_DIRECTIVITY_SHARPNESS}.
 */
Directivity.prototype.setPattern = function(alpha, sharpness) {
  // Clamp and set values.
  this._alpha = Math.min(1, Math.max(0, alpha));
  this._sharpness = Math.max(1, sharpness);

  // Update angle calculation using new values.
  this.computeAngle([this._cosTheta * this._cosTheta, 0, 0], [1, 0, 0]);
};


module.exports = Directivity;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Distance-based attenuation filter.
 * @author Andrew Allen <bitllama@google.com>
 */




// Internal dependencies.
const Utils = __webpack_require__(0);


/**
 * @class Attenuation
 * @description Distance-based attenuation filter.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Number} options.minDistance
 * Min. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MIN_DISTANCE DEFAULT_MIN_DISTANCE}.
 * @param {Number} options.maxDistance
 * Max. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MAX_DISTANCE DEFAULT_MAX_DISTANCE}.
 * @param {string} options.rolloff
 * Rolloff model to use, chosen from options in
 * {@linkcode Utils.ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}. Defaults to
 * {@linkcode Utils.DEFAULT_ATTENUATION_ROLLOFF DEFAULT_ATTENUATION_ROLLOFF}.
 */
function Attenuation(context, options) {
  // Public variables.
  /**
   * Min. distance (in meters).
   * @member {Number} minDistance
   * @memberof Attenuation
   * @instance
   */
  /**
   * Max. distance (in meters).
   * @member {Number} maxDistance
   * @memberof Attenuation
   * @instance
   */
  /**
   * Mono (1-channel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof Attenuation
   * @instance
   */
  /**
   * Mono (1-channel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof Attenuation
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.minDistance == undefined) {
    options.minDistance = Utils.DEFAULT_MIN_DISTANCE;
  }
  if (options.maxDistance == undefined) {
    options.maxDistance = Utils.DEFAULT_MAX_DISTANCE;
  }
  if (options.rolloff == undefined) {
    options.rolloff = Utils.DEFAULT_ATTENUATION_ROLLOFF;
  }

  // Assign values.
  this.minDistance = options.minDistance;
  this.maxDistance = options.maxDistance;
  this.setRolloff(options.rolloff);

  // Create node.
  this._gainNode = context.createGain();

  // Initialize distance to max distance.
  this.setDistance(options.maxDistance);

  // Input/Output proxy.
  this.input = this._gainNode;
  this.output = this._gainNode;
}


/**
 * Set distance from the listener.
 * @param {Number} distance Distance (in meters).
 */
Attenuation.prototype.setDistance = function(distance) {
  let gain = 1;
  if (this._rolloff == 'logarithmic') {
    if (distance > this.maxDistance) {
      gain = 0;
    } else if (distance > this.minDistance) {
      let range = this.maxDistance - this.minDistance;
      if (range > Utils.EPSILON_FLOAT) {
        // Compute the distance attenuation value by the logarithmic curve
        // "1 / (d + 1)" with an offset of |minDistance|.
        let relativeDistance = distance - this.minDistance;
        let attenuation = 1 / (relativeDistance + 1);
        let attenuationMax = 1 / (range + 1);
        gain = (attenuation - attenuationMax) / (1 - attenuationMax);
      }
    }
  } else if (this._rolloff == 'linear') {
    if (distance > this.maxDistance) {
      gain = 0;
    } else if (distance > this.minDistance) {
      let range = this.maxDistance - this.minDistance;
      if (range > Utils.EPSILON_FLOAT) {
        gain = (this.maxDistance - distance) / range;
      }
    }
  }
  this._gainNode.gain.value = gain;
};


/**
 * Set rolloff.
 * @param {string} rolloff
 * Rolloff model to use, chosen from options in
 * {@linkcode Utils.ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}.
 */
Attenuation.prototype.setRolloff = function(rolloff) {
  let isValidModel = ~Utils.ATTENUATION_ROLLOFFS.indexOf(rolloff);
  if (rolloff == undefined || !isValidModel) {
    if (!isValidModel) {
      Utils.log('Invalid rolloff model (\"' + rolloff +
        '\"). Using default: \"' + Utils.DEFAULT_ATTENUATION_ROLLOFF + '\".');
    }
    rolloff = Utils.DEFAULT_ATTENUATION_ROLLOFF;
  } else {
    rolloff = rolloff.toString().toLowerCase();
  }
  this._rolloff = rolloff;
};


module.exports = Attenuation;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Complete room model with early and late reflections.
 * @author Andrew Allen <bitllama@google.com>
 */




// Internal dependencies.
const LateReflections = __webpack_require__(8);
const EarlyReflections = __webpack_require__(9);
const Utils = __webpack_require__(0);


/**
 * Generate absorption coefficients from material names.
 * @param {Object} materials
 * @return {Object}
 */
function _getCoefficientsFromMaterials(materials) {
  // Initialize coefficients to use defaults.
  let coefficients = {};
  for (let property in Utils.DEFAULT_ROOM_MATERIALS) {
    if (Utils.DEFAULT_ROOM_MATERIALS.hasOwnProperty(property)) {
      coefficients[property] = Utils.ROOM_MATERIAL_COEFFICIENTS[
        Utils.DEFAULT_ROOM_MATERIALS[property]];
    }
  }

  // Sanitize materials.
  if (materials == undefined) {
    materials = {};
    Object.assign(materials, Utils.DEFAULT_ROOM_MATERIALS);
  }

  // Assign coefficients using provided materials.
  for (let property in Utils.DEFAULT_ROOM_MATERIALS) {
    if (Utils.DEFAULT_ROOM_MATERIALS.hasOwnProperty(property) &&
        materials.hasOwnProperty(property)) {
      if (materials[property] in Utils.ROOM_MATERIAL_COEFFICIENTS) {
        coefficients[property] =
          Utils.ROOM_MATERIAL_COEFFICIENTS[materials[property]];
      } else {
        Utils.log('Material \"' + materials[property] + '\" on wall \"' +
          property + '\" not found. Using \"' +
          Utils.DEFAULT_ROOM_MATERIALS[property] + '\".');
      }
    } else {
      Utils.log('Wall \"' + property + '\" is not defined. Default used.');
    }
  }
  return coefficients;
}

/**
 * Sanitize coefficients.
 * @param {Object} coefficients
 * @return {Object}
 */
function _sanitizeCoefficients(coefficients) {
  if (coefficients == undefined) {
    coefficients = {};
  }
  for (let property in Utils.DEFAULT_ROOM_MATERIALS) {
    if (!(coefficients.hasOwnProperty(property))) {
      // If element is not present, use default coefficients.
      coefficients[property] = Utils.ROOM_MATERIAL_COEFFICIENTS[
        Utils.DEFAULT_ROOM_MATERIALS[property]];
    }
  }
  return coefficients;
}

/**
 * Sanitize dimensions.
 * @param {Object} dimensions
 * @return {Object}
 */
function _sanitizeDimensions(dimensions) {
  if (dimensions == undefined) {
    dimensions = {};
  }
  for (let property in Utils.DEFAULT_ROOM_DIMENSIONS) {
    if (!(dimensions.hasOwnProperty(property))) {
      dimensions[property] = Utils.DEFAULT_ROOM_DIMENSIONS[property];
    }
  }
  return dimensions;
}

/**
 * Compute frequency-dependent reverb durations.
 * @param {Object} dimensions
 * @param {Object} coefficients
 * @param {Number} speedOfSound
 * @return {Array}
 */
function _getDurationsFromProperties(dimensions, coefficients, speedOfSound) {
  let durations = new Float32Array(Utils.NUMBER_REVERB_FREQUENCY_BANDS);

  // Sanitize inputs.
  dimensions = _sanitizeDimensions(dimensions);
  coefficients = _sanitizeCoefficients(coefficients);
  if (speedOfSound == undefined) {
    speedOfSound = Utils.DEFAULT_SPEED_OF_SOUND;
  }

  // Acoustic constant.
  let k = Utils.TWENTY_FOUR_LOG10 / speedOfSound;

  // Compute volume, skip if room is not present.
  let volume = dimensions.width * dimensions.height * dimensions.depth;
  if (volume < Utils.ROOM_MIN_VOLUME) {
    return durations;
  }

  // Room surface area.
  let leftRightArea = dimensions.width * dimensions.height;
  let floorCeilingArea = dimensions.width * dimensions.depth;
  let frontBackArea = dimensions.depth * dimensions.height;
  let totalArea = 2 * (leftRightArea + floorCeilingArea + frontBackArea);
  for (let i = 0; i < Utils.NUMBER_REVERB_FREQUENCY_BANDS; i++) {
    // Effective absorptive area.
    let absorbtionArea =
      (coefficients.left[i] + coefficients.right[i]) * leftRightArea +
      (coefficients.down[i] + coefficients.up[i]) * floorCeilingArea +
      (coefficients.front[i] + coefficients.back[i]) * frontBackArea;
    let meanAbsorbtionArea = absorbtionArea / totalArea;

    // Compute reverberation using Eyring equation [1].
    // [1] Beranek, Leo L. "Analysis of Sabine and Eyring equations and their
    //     application to concert hall audience and chair absorption." The
    //     Journal of the Acoustical Society of America, Vol. 120, No. 3.
    //     (2006), pp. 1399-1399.
    durations[i] = Utils.ROOM_EYRING_CORRECTION_COEFFICIENT * k * volume /
      (-totalArea * Math.log(1 - meanAbsorbtionArea) + 4 *
      Utils.ROOM_AIR_ABSORPTION_COEFFICIENTS[i] * volume);
  }
  return durations;
}


/**
 * Compute reflection coefficients from absorption coefficients.
 * @param {Object} absorptionCoefficients
 * @return {Object}
 */
function _computeReflectionCoefficients(absorptionCoefficients) {
  let reflectionCoefficients = [];
  for (let property in Utils.DEFAULT_REFLECTION_COEFFICIENTS) {
    if (Utils.DEFAULT_REFLECTION_COEFFICIENTS
        .hasOwnProperty(property)) {
      // Compute average absorption coefficient (per wall).
      reflectionCoefficients[property] = 0;
      for (let j = 0; j < Utils.NUMBER_REFLECTION_AVERAGING_BANDS; j++) {
        let bandIndex = j + Utils.ROOM_STARTING_AVERAGING_BAND;
        reflectionCoefficients[property] +=
          absorptionCoefficients[property][bandIndex];
      }
      reflectionCoefficients[property] /=
        Utils.NUMBER_REFLECTION_AVERAGING_BANDS;

      // Convert absorption coefficient to reflection coefficient.
      reflectionCoefficients[property] =
        Math.sqrt(1 - reflectionCoefficients[property]);
    }
  }
  return reflectionCoefficients;
}


/**
 * @class Room
 * @description Model that manages early and late reflections using acoustic
 * properties and listener position relative to a rectangular room.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Float32Array} options.listenerPosition
 * The listener's initial position (in meters), where origin is the center of
 * the room. Defaults to {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 * @param {Object} options.dimensions Room dimensions (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
 * @param {Object} options.materials Named acoustic materials per wall.
 * Defaults to {@linkcode Utils.DEFAULT_ROOM_MATERIALS DEFAULT_ROOM_MATERIALS}.
 * @param {Number} options.speedOfSound
 * (in meters/second). Defaults to
 * {@linkcode Utils.DEFAULT_SPEED_OF_SOUND DEFAULT_SPEED_OF_SOUND}.
 */
function Room(context, options) {
  // Public variables.
  /**
   * EarlyReflections {@link EarlyReflections EarlyReflections} submodule.
   * @member {AudioNode} early
   * @memberof Room
   * @instance
   */
  /**
   * LateReflections {@link LateReflections LateReflections} submodule.
   * @member {AudioNode} late
   * @memberof Room
   * @instance
   */
  /**
   * Ambisonic (multichannel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof Room
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.listenerPosition == undefined) {
    options.listenerPosition = Utils.DEFAULT_POSITION.slice();
  }
  if (options.dimensions == undefined) {
    options.dimensions = {};
    Object.assign(options.dimensions, Utils.DEFAULT_ROOM_DIMENSIONS);
  }
  if (options.materials == undefined) {
    options.materials = {};
    Object.assign(options.materials, Utils.DEFAULT_ROOM_MATERIALS);
  }
  if (options.speedOfSound == undefined) {
    options.speedOfSound = Utils.DEFAULT_SPEED_OF_SOUND;
  }

  // Sanitize room-properties-related arguments.
  options.dimensions = _sanitizeDimensions(options.dimensions);
  let absorptionCoefficients = _getCoefficientsFromMaterials(options.materials);
  let reflectionCoefficients =
    _computeReflectionCoefficients(absorptionCoefficients);
  let durations = _getDurationsFromProperties(options.dimensions,
    absorptionCoefficients, options.speedOfSound);

  // Construct submodules for early and late reflections.
  this.early = new EarlyReflections(context, {
    dimensions: options.dimensions,
    coefficients: reflectionCoefficients,
    speedOfSound: options.speedOfSound,
    listenerPosition: options.listenerPosition,
  });
  this.late = new LateReflections(context, {
    durations: durations,
  });

  this.speedOfSound = options.speedOfSound;

  // Construct auxillary audio nodes.
  this.output = context.createGain();
  this.early.output.connect(this.output);
  this._merger = context.createChannelMerger(4);

  this.late.output.connect(this._merger, 0, 0);
  this._merger.connect(this.output);
}


/**
 * Set the room's dimensions and wall materials.
 * @param {Object} dimensions Room dimensions (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
 * @param {Object} materials Named acoustic materials per wall. Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_MATERIALS DEFAULT_ROOM_MATERIALS}.
 */
Room.prototype.setProperties = function(dimensions, materials) {
  // Compute late response.
  let absorptionCoefficients = _getCoefficientsFromMaterials(materials);
  let durations = _getDurationsFromProperties(dimensions,
    absorptionCoefficients, this.speedOfSound);
  this.late.setDurations(durations);

  // Compute early response.
  this.early.speedOfSound = this.speedOfSound;
  let reflectionCoefficients =
    _computeReflectionCoefficients(absorptionCoefficients);
  this.early.setRoomProperties(dimensions, reflectionCoefficients);
};


/**
 * Set the listener's position (in meters), where origin is the center of
 * the room.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
Room.prototype.setListenerPosition = function(x, y, z) {
  this.early.speedOfSound = this.speedOfSound;
  this.early.setListenerPosition(x, y, z);

  // Disable room effects if the listener is outside the room boundaries.
  let distance = this.getDistanceOutsideRoom(x, y, z);
  let gain = 1;
  if (distance > Utils.EPSILON_FLOAT) {
    gain = 1 - distance / Utils.LISTENER_MAX_OUTSIDE_ROOM_DISTANCE;

    // Clamp gain between 0 and 1.
    gain = Math.max(0, Math.min(1, gain));
  }
  this.output.gain.value = gain;
};


/**
 * Compute distance outside room of provided position (in meters).
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @return {Number}
 * Distance outside room (in meters). Returns 0 if inside room.
 */
Room.prototype.getDistanceOutsideRoom = function(x, y, z) {
  let dx = Math.max(0, -this.early._halfDimensions.width - x,
    x - this.early._halfDimensions.width);
    let dy = Math.max(0, -this.early._halfDimensions.height - y,
    y - this.early._halfDimensions.height);
    let dz = Math.max(0, -this.early._halfDimensions.depth - z,
    z - this.early._halfDimensions.depth);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};


module.exports = Room;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Late reverberation filter for Ambisonic content.
 * @author Andrew Allen <bitllama@google.com>
 */



// Internal dependencies.
const Utils = __webpack_require__(0);


/**
 * @class LateReflections
 * @description Late-reflections reverberation filter for Ambisonic content.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Array} options.durations
 * Multiband RT60 durations (in seconds) for each frequency band, listed as
 * {@linkcode Utils.DEFAULT_REVERB_FREQUENCY_BANDS
 * FREQUDEFAULT_REVERB_FREQUENCY_BANDSENCY_BANDS}. Defaults to
 * {@linkcode Utils.DEFAULT_REVERB_DURATIONS DEFAULT_REVERB_DURATIONS}.
 * @param {Number} options.predelay Pre-delay (in milliseconds). Defaults to
 * {@linkcode Utils.DEFAULT_REVERB_PREDELAY DEFAULT_REVERB_PREDELAY}.
 * @param {Number} options.gain Output gain (linear). Defaults to
 * {@linkcode Utils.DEFAULT_REVERB_GAIN DEFAULT_REVERB_GAIN}.
 * @param {Number} options.bandwidth Bandwidth (in octaves) for each frequency
 * band. Defaults to
 * {@linkcode Utils.DEFAULT_REVERB_BANDWIDTH DEFAULT_REVERB_BANDWIDTH}.
 * @param {Number} options.tailonset Length (in milliseconds) of impulse
 * response to apply a half-Hann window. Defaults to
 * {@linkcode Utils.DEFAULT_REVERB_TAIL_ONSET DEFAULT_REVERB_TAIL_ONSET}.
 */
function LateReflections(context, options) {
  // Public variables.
  /**
   * Mono (1-channel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof LateReflections
   * @instance
   */
  /**
   * Mono (1-channel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof LateReflections
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.durations == undefined) {
    options.durations = Utils.DEFAULT_REVERB_DURATIONS.slice();
  }
  if (options.predelay == undefined) {
    options.predelay = Utils.DEFAULT_REVERB_PREDELAY;
  }
  if (options.gain == undefined) {
    options.gain = Utils.DEFAULT_REVERB_GAIN;
  }
  if (options.bandwidth == undefined) {
    options.bandwidth = Utils.DEFAULT_REVERB_BANDWIDTH;
  }
  if (options.tailonset == undefined) {
    options.tailonset = Utils.DEFAULT_REVERB_TAIL_ONSET;
  }

  // Assign pre-computed variables.
  let delaySecs = options.predelay / 1000;
  this._bandwidthCoeff = options.bandwidth * Utils.LOG2_DIV2;
  this._tailonsetSamples = options.tailonset / 1000;

  // Create nodes.
  this._context = context;
  this.input = context.createGain();
  this._predelay = context.createDelay(delaySecs);
  this._convolver = context.createConvolver();
  this.output = context.createGain();

  // Set reverb attenuation.
  this.output.gain.value = options.gain;

  // Disable normalization.
  this._convolver.normalize = false;

  // Connect nodes.
  this.input.connect(this._predelay);
  this._predelay.connect(this._convolver);
  this._convolver.connect(this.output);

  // Compute IR using RT60 values.
  this.setDurations(options.durations);
}


/**
 * Re-compute a new impulse response by providing Multiband RT60 durations.
 * @param {Array} durations
 * Multiband RT60 durations (in seconds) for each frequency band, listed as
 * {@linkcode Utils.DEFAULT_REVERB_FREQUENCY_BANDS
 * DEFAULT_REVERB_FREQUENCY_BANDS}.
 */
LateReflections.prototype.setDurations = function(durations) {
  if (durations.length !== Utils.NUMBER_REVERB_FREQUENCY_BANDS) {
    Utils.log('Warning: invalid number of RT60 values provided to reverb.');
    return;
  }

  // Compute impulse response.
  let durationsSamples =
    new Float32Array(Utils.NUMBER_REVERB_FREQUENCY_BANDS);
    let sampleRate = this._context.sampleRate;

  for (let i = 0; i < durations.length; i++) {
    // Clamp within suitable range.
    durations[i] =
      Math.max(0, Math.min(Utils.DEFAULT_REVERB_MAX_DURATION, durations[i]));

    // Convert seconds to samples.
    durationsSamples[i] = Math.round(durations[i] * sampleRate *
      Utils.DEFAULT_REVERB_DURATION_MULTIPLIER);
  }
  // Determine max RT60 length in samples.
  let durationsSamplesMax = 0;
  for (let i = 0; i < durationsSamples.length; i++) {
    if (durationsSamples[i] > durationsSamplesMax) {
      durationsSamplesMax = durationsSamples[i];
    }
  }

  // Skip this step if there is no reverberation to compute.
  if (durationsSamplesMax < 1) {
    durationsSamplesMax = 1;
  }

  // Create impulse response buffer.
  let buffer = this._context.createBuffer(1, durationsSamplesMax, sampleRate);
  let bufferData = buffer.getChannelData(0);

  // Create noise signal (computed once, referenced in each band's routine).
  let noiseSignal = new Float32Array(durationsSamplesMax);
  for (let i = 0; i < durationsSamplesMax; i++) {
    noiseSignal[i] = Math.random() * 2 - 1;
  }

  // Compute the decay rate per-band and filter the decaying noise signal.
  for (let i = 0; i < Utils.NUMBER_REVERB_FREQUENCY_BANDS; i++) {
    // Compute decay rate.
    let decayRate = -Utils.LOG1000 / durationsSamples[i];

    // Construct a standard one-zero, two-pole bandpass filter:
    // H(z) = (b0 * z^0 + b1 * z^-1 + b2 * z^-2) / (1 + a1 * z^-1 + a2 * z^-2)
    let omega = Utils.TWO_PI *
      Utils.DEFAULT_REVERB_FREQUENCY_BANDS[i] / sampleRate;
    let sinOmega = Math.sin(omega);
    let alpha = sinOmega * Math.sinh(this._bandwidthCoeff * omega / sinOmega);
    let a0CoeffReciprocal = 1 / (1 + alpha);
    let b0Coeff = alpha * a0CoeffReciprocal;
    let a1Coeff = -2 * Math.cos(omega) * a0CoeffReciprocal;
    let a2Coeff = (1 - alpha) * a0CoeffReciprocal;

    // We optimize since b2 = -b0, b1 = 0.
    // Update equation for two-pole bandpass filter:
    //   u[n] = x[n] - a1 * x[n-1] - a2 * x[n-2]
    //   y[n] = b0 * (u[n] - u[n-2])
    let um1 = 0;
    let um2 = 0;
    for (let j = 0; j < durationsSamples[i]; j++) {
      // Exponentially-decaying white noise.
      let x = noiseSignal[j] * Math.exp(decayRate * j);

      // Filter signal with bandpass filter and add to output.
      let u = x - a1Coeff * um1 - a2Coeff * um2;
      bufferData[j] += b0Coeff * (u - um2);

      // Update coefficients.
      um2 = um1;
      um1 = u;
    }
  }

  // Create and apply half of a Hann window to the beginning of the
  // impulse response.
  let halfHannLength =
    Math.round(this._tailonsetSamples);
  for (let i = 0; i < Math.min(bufferData.length, halfHannLength); i++) {
    let halfHann =
      0.5 * (1 - Math.cos(Utils.TWO_PI * i / (2 * halfHannLength - 1)));
      bufferData[i] *= halfHann;
  }
  this._convolver.buffer = buffer;
};


module.exports = LateReflections;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Ray-tracing-based early reflections model.
 * @author Andrew Allen <bitllama@google.com>
 */



// Internal dependencies.
const Utils = __webpack_require__(0);


/**
 * @class EarlyReflections
 * @description Ray-tracing-based early reflections model.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Object} options.dimensions
 * Room dimensions (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
 * @param {Object} options.coefficients
 * Frequency-independent reflection coeffs per wall. Defaults to
 * {@linkcode Utils.DEFAULT_REFLECTION_COEFFICIENTS
 * DEFAULT_REFLECTION_COEFFICIENTS}.
 * @param {Number} options.speedOfSound
 * (in meters / second). Defaults to {@linkcode Utils.DEFAULT_SPEED_OF_SOUND
 * DEFAULT_SPEED_OF_SOUND}.
 * @param {Float32Array} options.listenerPosition
 * (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 */
function EarlyReflections(context, options) {
  // Public variables.
  /**
   * The room's speed of sound (in meters/second).
   * @member {Number} speedOfSound
   * @memberof EarlyReflections
   * @instance
   */
  /**
   * Mono (1-channel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} input
   * @memberof EarlyReflections
   * @instance
   */
  /**
   * First-order ambisonic (4-channel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof EarlyReflections
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.speedOfSound == undefined) {
    options.speedOfSound = Utils.DEFAULT_SPEED_OF_SOUND;
  }
  if (options.listenerPosition == undefined) {
    options.listenerPosition = Utils.DEFAULT_POSITION.slice();
  }
  if (options.coefficients == undefined) {
    options.coefficients = {};
    Object.assign(options.coefficients, Utils.DEFAULT_REFLECTION_COEFFICIENTS);
  }

  // Assign room's speed of sound.
  this.speedOfSound = options.speedOfSound;

  // Create nodes.
  this.input = context.createGain();
  this.output = context.createGain();
  this._lowpass = context.createBiquadFilter();
  this._delays = {};
  this._gains = {}; // gainPerWall = (ReflectionCoeff / Attenuation)
  this._inverters = {}; // 3 of these are needed for right/back/down walls.
  this._merger = context.createChannelMerger(4); // First-order encoding only.

  // Connect audio graph for each wall reflection.
  for (let property in Utils.DEFAULT_REFLECTION_COEFFICIENTS) {
    if (Utils.DEFAULT_REFLECTION_COEFFICIENTS
        .hasOwnProperty(property)) {
      this._delays[property] =
        context.createDelay(Utils.MAX_DURATION);
      this._gains[property] = context.createGain();
    }
  }
  this._inverters.right = context.createGain();
  this._inverters.down = context.createGain();
  this._inverters.back = context.createGain();

  // Initialize lowpass filter.
  this._lowpass.type = 'lowpass';
  this._lowpass.frequency.value = Utils.DEFAULT_REFLECTION_CUTOFF_FREQUENCY;
  this._lowpass.Q.value = 0;

  // Initialize encoder directions, set delay times and gains to 0.
  for (let property in Utils.DEFAULT_REFLECTION_COEFFICIENTS) {
    if (Utils.DEFAULT_REFLECTION_COEFFICIENTS
        .hasOwnProperty(property)) {
      this._delays[property].delayTime.value = 0;
      this._gains[property].gain.value = 0;
    }
  }

  // Initialize inverters for opposite walls ('right', 'down', 'back' only).
  this._inverters.right.gain.value = -1;
  this._inverters.down.gain.value = -1;
  this._inverters.back.gain.value = -1;

  // Connect nodes.
  this.input.connect(this._lowpass);
  for (let property in Utils.DEFAULT_REFLECTION_COEFFICIENTS) {
    if (Utils.DEFAULT_REFLECTION_COEFFICIENTS
        .hasOwnProperty(property)) {
      this._lowpass.connect(this._delays[property]);
      this._delays[property].connect(this._gains[property]);
      this._gains[property].connect(this._merger, 0, 0);
    }
  }

  // Connect gains to ambisonic channel output.
  // Left: [1 1 0 0]
  // Right: [1 -1 0 0]
  // Up: [1 0 1 0]
  // Down: [1 0 -1 0]
  // Front: [1 0 0 1]
  // Back: [1 0 0 -1]
  this._gains.left.connect(this._merger, 0, 1);

  this._gains.right.connect(this._inverters.right);
  this._inverters.right.connect(this._merger, 0, 1);

  this._gains.up.connect(this._merger, 0, 2);

  this._gains.down.connect(this._inverters.down);
  this._inverters.down.connect(this._merger, 0, 2);

  this._gains.front.connect(this._merger, 0, 3);

  this._gains.back.connect(this._inverters.back);
  this._inverters.back.connect(this._merger, 0, 3);
  this._merger.connect(this.output);

  // Initialize.
  this._listenerPosition = options.listenerPosition;
  this.setRoomProperties(options.dimensions, options.coefficients);
}


/**
 * Set the listener's position (in meters),
 * where [0,0,0] is the center of the room.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
EarlyReflections.prototype.setListenerPosition = function(x, y, z) {
  // Assign listener position.
  this._listenerPosition = [x, y, z];

  // Determine distances to each wall.
  let distances = {
    left: Utils.DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
      this._halfDimensions.width + x) + Utils.DEFAULT_REFLECTION_MIN_DISTANCE,
    right: Utils.DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
      this._halfDimensions.width - x) + Utils.DEFAULT_REFLECTION_MIN_DISTANCE,
    front: Utils.DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
      this._halfDimensions.depth + z) + Utils.DEFAULT_REFLECTION_MIN_DISTANCE,
    back: Utils.DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
      this._halfDimensions.depth - z) + Utils.DEFAULT_REFLECTION_MIN_DISTANCE,
    down: Utils.DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
      this._halfDimensions.height + y) + Utils.DEFAULT_REFLECTION_MIN_DISTANCE,
    up: Utils.DEFAULT_REFLECTION_MULTIPLIER * Math.max(0,
      this._halfDimensions.height - y) + Utils.DEFAULT_REFLECTION_MIN_DISTANCE,
  };

  // Assign delay & attenuation values using distances.
  for (let property in Utils.DEFAULT_REFLECTION_COEFFICIENTS) {
    if (Utils.DEFAULT_REFLECTION_COEFFICIENTS
        .hasOwnProperty(property)) {
      // Compute and assign delay (in seconds).
      let delayInSecs = distances[property] / this.speedOfSound;
      this._delays[property].delayTime.value = delayInSecs;

      // Compute and assign gain, uses logarithmic rolloff: "g = R / (d + 1)"
      let attenuation = this._coefficients[property] / distances[property];
      this._gains[property].gain.value = attenuation;
    }
  }
};


/**
 * Set the room's properties which determines the characteristics of
 * reflections.
 * @param {Object} dimensions
 * Room dimensions (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
 * @param {Object} coefficients
 * Frequency-independent reflection coeffs per wall. Defaults to
 * {@linkcode Utils.DEFAULT_REFLECTION_COEFFICIENTS
 * DEFAULT_REFLECTION_COEFFICIENTS}.
 */
EarlyReflections.prototype.setRoomProperties = function(dimensions,
                                                        coefficients) {
  if (dimensions == undefined) {
    dimensions = {};
    Object.assign(dimensions, Utils.DEFAULT_ROOM_DIMENSIONS);
  }
  if (coefficients == undefined) {
    coefficients = {};
    Object.assign(coefficients, Utils.DEFAULT_REFLECTION_COEFFICIENTS);
  }
  this._coefficients = coefficients;

  // Sanitize dimensions and store half-dimensions.
  this._halfDimensions = {};
  this._halfDimensions.width = dimensions.width * 0.5;
  this._halfDimensions.height = dimensions.height * 0.5;
  this._halfDimensions.depth = dimensions.depth * 0.5;

  // Update listener position with new room properties.
  this.setListenerPosition(this._listenerPosition[0],
    this._listenerPosition[1], this._listenerPosition[2]);
};


module.exports = EarlyReflections;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Primary namespace for ResonanceAudio library.
 * @author Andrew Allen <bitllama@google.com>
 */

 


// Main module.
exports.ResonanceAudio = __webpack_require__(11);


// Testable Submodules.
exports.ResonanceAudio.Attenuation = __webpack_require__(6);
exports.ResonanceAudio.Directivity = __webpack_require__(5);
exports.ResonanceAudio.EarlyReflections = __webpack_require__(9);
exports.ResonanceAudio.Encoder = __webpack_require__(1);
exports.ResonanceAudio.LateReflections = __webpack_require__(8);
exports.ResonanceAudio.Listener = __webpack_require__(2);
exports.ResonanceAudio.Room = __webpack_require__(7);
exports.ResonanceAudio.Source = __webpack_require__(4);
exports.ResonanceAudio.Tables = __webpack_require__(3);
exports.ResonanceAudio.Utils = __webpack_require__(0);
exports.ResonanceAudio.Version = __webpack_require__(13);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file ResonanceAudio library name space and common utilities.
 * @author Andrew Allen <bitllama@google.com>
 */




// Internal dependencies.
const Listener = __webpack_require__(2);
const Source = __webpack_require__(4);
const Room = __webpack_require__(7);
const Encoder = __webpack_require__(1);
const Utils = __webpack_require__(0);


/**
 * @class ResonanceAudio
 * @description Main class for managing sources, room and listener models.
 * @param {AudioContext} context
 * Associated {@link
https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
 * @param {Object} options
 * @param {Number} options.ambisonicOrder
 * Desired ambisonic Order. Defaults to
 * {@linkcode Utils.DEFAULT_AMBISONIC_ORDER DEFAULT_AMBISONIC_ORDER}.
 * @param {Float32Array} options.listenerPosition
 * The listener's initial position (in meters), where origin is the center of
 * the room. Defaults to {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 * @param {Float32Array} options.listenerForward
 * The listener's initial forward vector.
 * Defaults to {@linkcode Utils.DEFAULT_FORWARD DEFAULT_FORWARD}.
 * @param {Float32Array} options.listenerUp
 * The listener's initial up vector.
 * Defaults to {@linkcode Utils.DEFAULT_UP DEFAULT_UP}.
 * @param {Object} options.dimensions Room dimensions (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
 * @param {Object} options.materials Named acoustic materials per wall.
 * Defaults to {@linkcode Utils.DEFAULT_ROOM_MATERIALS DEFAULT_ROOM_MATERIALS}.
 * @param {Number} options.speedOfSound
 * (in meters/second). Defaults to
 * {@linkcode Utils.DEFAULT_SPEED_OF_SOUND DEFAULT_SPEED_OF_SOUND}.
 */
function ResonanceAudio(context, options) {
  // Public variables.
  /**
   * Binaurally-rendered stereo (2-channel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}.
   * @member {AudioNode} output
   * @memberof ResonanceAudio
   * @instance
   */
  /**
   * Ambisonic (multichannel) input {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}
   * (For rendering input soundfields).
   * @member {AudioNode} ambisonicInput
   * @memberof ResonanceAudio
   * @instance
   */
  /**
   * Ambisonic (multichannel) output {@link
   * https://developer.mozilla.org/en-US/docs/Web/API/AudioNode AudioNode}
   * (For allowing external rendering / post-processing).
   * @member {AudioNode} ambisonicOutput
   * @memberof ResonanceAudio
   * @instance
   */

  // Use defaults for undefined arguments.
  if (options == undefined) {
    options = {};
  }
  if (options.ambisonicOrder == undefined) {
    options.ambisonicOrder = Utils.DEFAULT_AMBISONIC_ORDER;
  }
  if (options.listenerPosition == undefined) {
    options.listenerPosition = Utils.DEFAULT_POSITION.slice();
  }
  if (options.listenerForward == undefined) {
    options.listenerForward = Utils.DEFAULT_FORWARD.slice();
  }
  if (options.listenerUp == undefined) {
    options.listenerUp = Utils.DEFAULT_UP.slice();
  }
  if (options.dimensions == undefined) {
    options.dimensions = {};
    Object.assign(options.dimensions, Utils.DEFAULT_ROOM_DIMENSIONS);
  }
  if (options.materials == undefined) {
    options.materials = {};
    Object.assign(options.materials, Utils.DEFAULT_ROOM_MATERIALS);
  }
  if (options.speedOfSound == undefined) {
    options.speedOfSound = Utils.DEFAULT_SPEED_OF_SOUND;
  }

  // Create member submodules.
  this._ambisonicOrder = Encoder.validateAmbisonicOrder(options.ambisonicOrder);
  this._sources = [];
  this._room = new Room(context, {
    listenerPosition: options.listenerPosition,
    dimensions: options.dimensions,
    materials: options.materials,
    speedOfSound: options.speedOfSound,
  });
  this._listener = new Listener(context, {
    ambisonicOrder: options.ambisonicOrder,
    position: options.listenerPosition,
    forward: options.listenerForward,
    up: options.listenerUp,
  });

  // Create auxillary audio nodes.
  this._context = context;
  this.output = context.createGain();
  this.ambisonicOutput = context.createGain();
  this.ambisonicInput = this._listener.input;

  // Connect audio graph.
  this._room.output.connect(this._listener.input);
  this._listener.output.connect(this.output);
  this._listener.ambisonicOutput.connect(this.ambisonicOutput);
}


/**
 * Create a new source for the scene.
 * @param {Object} options
 * @param {Float32Array} options.position
 * The source's initial position (in meters), where origin is the center of
 * the room. Defaults to {@linkcode Utils.DEFAULT_POSITION DEFAULT_POSITION}.
 * @param {Float32Array} options.forward
 * The source's initial forward vector. Defaults to
 * {@linkcode Utils.DEFAULT_FORWARD DEFAULT_FORWARD}.
 * @param {Float32Array} options.up
 * The source's initial up vector. Defaults to
 * {@linkcode Utils.DEFAULT_UP DEFAULT_UP}.
 * @param {Number} options.minDistance
 * Min. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MIN_DISTANCE DEFAULT_MIN_DISTANCE}.
 * @param {Number} options.maxDistance
 * Max. distance (in meters). Defaults to
 * {@linkcode Utils.DEFAULT_MAX_DISTANCE DEFAULT_MAX_DISTANCE}.
 * @param {string} options.rolloff
 * Rolloff model to use, chosen from options in
 * {@linkcode Utils.ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}. Defaults to
 * {@linkcode Utils.DEFAULT_ATTENUATION_ROLLOFF DEFAULT_ATTENUATION_ROLLOFF}.
 * @param {Number} options.gain Input gain (linear). Defaults to
 * {@linkcode Utils.DEFAULT_SOURCE_GAIN DEFAULT_SOURCE_GAIN}.
 * @param {Number} options.alpha Directivity alpha. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_ALPHA DEFAULT_DIRECTIVITY_ALPHA}.
 * @param {Number} options.sharpness Directivity sharpness. Defaults to
 * {@linkcode Utils.DEFAULT_DIRECTIVITY_SHARPNESS
 * DEFAULT_DIRECTIVITY_SHARPNESS}.
 * @param {Number} options.sourceWidth
 * Source width (in degrees). Where 0 degrees is a point source and 360 degrees
 * is an omnidirectional source. Defaults to
 * {@linkcode Utils.DEFAULT_SOURCE_WIDTH DEFAULT_SOURCE_WIDTH}.
 * @return {Source}
 */
ResonanceAudio.prototype.createSource = function(options) {
  // Create a source and push it to the internal sources array, returning
  // the object's reference to the user.
  let source = new Source(this, options);
  this._sources[this._sources.length] = source;
  return source;
};


/**
 * Set the scene's desired ambisonic order.
 * @param {Number} ambisonicOrder Desired ambisonic order.
 */
ResonanceAudio.prototype.setAmbisonicOrder = function(ambisonicOrder) {
  this._ambisonicOrder = Encoder.validateAmbisonicOrder(ambisonicOrder);
};


/**
 * Set the room's dimensions and wall materials.
 * @param {Object} dimensions Room dimensions (in meters).
 * @param {Object} materials Named acoustic materials per wall.
 */
ResonanceAudio.prototype.setRoomProperties = function(dimensions, materials) {
  this._room.setProperties(dimensions, materials);
};


/**
 * Set the listener's position (in meters), where origin is the center of
 * the room.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
ResonanceAudio.prototype.setListenerPosition = function(x, y, z) {
  // Update listener position.
  this._listener.position[0] = x;
  this._listener.position[1] = y;
  this._listener.position[2] = z;
  this._room.setListenerPosition(x, y, z);

  // Update sources with new listener position.
  this._sources.forEach(function(element) {
     element._update();
  });
};


/**
 * Set the source's orientation using forward and up vectors.
 * @param {Number} forwardX
 * @param {Number} forwardY
 * @param {Number} forwardZ
 * @param {Number} upX
 * @param {Number} upY
 * @param {Number} upZ
 */
ResonanceAudio.prototype.setListenerOrientation = function(forwardX, forwardY,
  forwardZ, upX, upY, upZ) {
  this._listener.setOrientation(forwardX, forwardY, forwardZ, upX, upY, upZ);
};


/**
 * Set the listener's position and orientation using a Three.js Matrix4 object.
 * @param {Object} matrix
 * The Three.js Matrix4 object representing the listener's world transform.
 */
ResonanceAudio.prototype.setListenerFromMatrix = function(matrix) {
  this._listener.setFromMatrix(matrix);

  // Update the rest of the scene using new listener position.
  this.setListenerPosition(this._listener.position[0],
    this._listener.position[1], this._listener.position[2]);
};


/**
 * Set the speed of sound.
 * @param {Number} speedOfSound
 */
ResonanceAudio.prototype.setSpeedOfSound = function(speedOfSound) {
  this._room.speedOfSound = speedOfSound;
};


module.exports = ResonanceAudio;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	module.exports = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Omnitone library common utilities.
 */


/**
 * Omnitone library logging function.
 * @param {any} Message to be printed out.
 */
exports.log = function() {
  window.console.log.apply(window.console, [
    '%c[Omnitone]%c ' + Array.prototype.slice.call(arguments).join(' ') +
        ' %c(@' + performance.now().toFixed(2) + 'ms)',
    'background: #BBDEFB; color: #FF5722; font-weight: 500', 'font-weight: 300',
    'color: #AAA',
  ]);
};


/**
 * Omnitone library error-throwing function.
 * @param {any} Message to be printed out.
 */
exports.throw = function() {
  window.console.error.apply(window.console, [
    '%c[Omnitone]%c ' + Array.prototype.slice.call(arguments).join(' ') +
        ' %c(@' + performance.now().toFixed(2) + 'ms)',
    'background: #C62828; color: #FFEBEE; font-weight: 800', 'font-weight: 400',
    'color: #AAA',
  ]);

  throw new Error(false);
};


// Static temp storage for matrix inversion.
let a00;
let a01;
let a02;
let a03;
let a10;
let a11;
let a12;
let a13;
let a20;
let a21;
let a22;
let a23;
let a30;
let a31;
let a32;
let a33;
let b00;
let b01;
let b02;
let b03;
let b04;
let b05;
let b06;
let b07;
let b08;
let b09;
let b10;
let b11;
let det;


/**
 * A 4x4 matrix inversion utility. This does not handle the case when the
 * arguments are not proper 4x4 matrices.
 * @param {Float32Array} out   The inverted result.
 * @param {Float32Array} a     The source matrix.
 * @return {Float32Array} out
 */
exports.invertMatrix4 = function(out, a) {
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11];
  a30 = a[12];
  a31 = a[13];
  a32 = a[14];
  a33 = a[15];
  b00 = a00 * a11 - a01 * a10;
  b01 = a00 * a12 - a02 * a10;
  b02 = a00 * a13 - a03 * a10;
  b03 = a01 * a12 - a02 * a11;
  b04 = a01 * a13 - a03 * a11;
  b05 = a02 * a13 - a03 * a12;
  b06 = a20 * a31 - a21 * a30;
  b07 = a20 * a32 - a22 * a30;
  b08 = a20 * a33 - a23 * a30;
  b09 = a21 * a32 - a22 * a31;
  b10 = a21 * a33 - a23 * a31;
  b11 = a22 * a33 - a23 * a32;
  det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  return out;
};


/**
 * Check if a value is defined in the ENUM dictionary.
 * @param {Object} enumDictionary - ENUM dictionary.
 * @param {Number|String} entryValue - a value to probe.
 * @return {Boolean}
 */
exports.isDefinedENUMEntry = function(enumDictionary, entryValue) {
  for (let enumKey in enumDictionary) {
    if (entryValue === enumDictionary[enumKey]) {
      return true;
    }
  }
  return false;
};


/**
 * Check if the given object is an instance of BaseAudioContext.
 * @param {AudioContext} context - A context object to be checked.
 * @return {Boolean}
 */
exports.isAudioContext = function(context) {
  // TODO(hoch): Update this when BaseAudioContext is available for all
  // browsers.
  return context instanceof AudioContext ||
    context instanceof OfflineAudioContext;
};


/**
 * Check if the given object is a valid AudioBuffer.
 * @param {Object} audioBuffer An AudioBuffer object to be checked.
 * @return {Boolean}
 */
exports.isAudioBuffer = function(audioBuffer) {
  return audioBuffer instanceof AudioBuffer;
};


/**
 * Perform channel-wise merge on multiple AudioBuffers. The sample rate and
 * the length of buffers to be merged must be identical.
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {AudioBuffer[]} bufferList - An array of AudioBuffers to be merged
 * channel-wise.
 * @return {AudioBuffer} - A single merged AudioBuffer.
 */
exports.mergeBufferListByChannel = function(context, bufferList) {
  const bufferLength = bufferList[0].length;
  const bufferSampleRate = bufferList[0].sampleRate;
  let bufferNumberOfChannel = 0;

  for (let i = 0; i < bufferList.length; ++i) {
    if (bufferNumberOfChannel > 32) {
      exports.throw('Utils.mergeBuffer: Number of channels cannot exceed 32.' +
          '(got ' + bufferNumberOfChannel + ')');
    }
    if (bufferLength !== bufferList[i].length) {
      exports.throw('Utils.mergeBuffer: AudioBuffer lengths are ' +
          'inconsistent. (expected ' + bufferLength + ' but got ' +
          bufferList[i].length + ')');
    }
    if (bufferSampleRate !== bufferList[i].sampleRate) {
      exports.throw('Utils.mergeBuffer: AudioBuffer sample rates are ' +
          'inconsistent. (expected ' + bufferSampleRate + ' but got ' +
          bufferList[i].sampleRate + ')');
    }
    bufferNumberOfChannel += bufferList[i].numberOfChannels;
  }

  const buffer = context.createBuffer(bufferNumberOfChannel,
                                      bufferLength,
                                      bufferSampleRate);
  let destinationChannelIndex = 0;
  for (let i = 0; i < bufferList.length; ++i) {
    for (let j = 0; j < bufferList[i].numberOfChannels; ++j) {
      buffer.getChannelData(destinationChannelIndex++).set(
          bufferList[i].getChannelData(j));
    }
  }

  return buffer;
};


/**
 * Perform channel-wise split by the given channel count. For example,
 * 1 x AudioBuffer(8) -> splitBuffer(context, buffer, 2) -> 4 x AudioBuffer(2).
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {AudioBuffer} audioBuffer - An AudioBuffer to be splitted.
 * @param {Number} splitBy - Number of channels to be splitted.
 * @return {AudioBuffer[]} - An array of splitted AudioBuffers.
 */
exports.splitBufferbyChannel = function(context, audioBuffer, splitBy) {
  if (audioBuffer.numberOfChannels <= splitBy) {
    exports.throw('Utils.splitBuffer: Insufficient number of channels. (' +
        audioBuffer.numberOfChannels + ' splitted by ' + splitBy + ')');
  }
  let sourceChannelIndex = 0;
  const numberOfSplittedBuffer =
      Math.ceil(audioBuffer.numberOfChannels / splitBy);
  for (let i = 0; i < numberOfSplittedBuffer; ++i) {
    let buffer = context.createBuffer(splitBy,
                                      audioBuffer.length,
                                      audioBuffer.sampleRate);
    for (let j = 0; j < splitBy; ++j) {
      if (sourceChannelIndex < audioBuffer.numberOfChannels) {
        buffer.getChannelData(j).set(
          audioBuffer.getChannelData(sourceChannelIndex++));
      }
    }
  }

  return bufferList;
};


/**
 * Converts Base64-encoded string to ArrayBuffer.
 * @param {string} base64String - Base64-encdoed string.
 * @return {ArrayByuffer} Converted ArrayBuffer object.
 */
exports.getArrayBufferFromBase64String = function(base64String) {
  let binaryString = window.atob(base64String);
  let byteArray = new Uint8Array(binaryString.length);
  byteArray.forEach(
    (value, index) => byteArray[index] = binaryString.charCodeAt(index));
  return byteArray.buffer;
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Streamlined AudioBuffer loader.
 */




const Utils = __webpack_require__(0);

/**
 * @typedef {string} BufferDataType
 */

/**
 * Buffer data type for ENUM.
 * @enum {BufferDataType}
 */
const BufferDataType = {
  /** @type {string} The data contains Base64-encoded string.. */
  BASE64: 'base64',
  /** @type {string} The data is a URL for audio file. */
  URL: 'url',
};


/**
 * BufferList object mananges the async loading/decoding of multiple
 * AudioBuffers from multiple URLs.
 * @constructor
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {string[]} bufferData - An ordered list of URLs.
 * @param {Object} options - Options
 * @param {string} [options.dataType='base64'] - BufferDataType specifier.
 * @param {Boolean} [options.verbose=false] - Log verbosity. |true| prints the
 * individual message from each URL and AudioBuffer.
 */
function BufferList(context, bufferData, options) {
  this._context = Utils.isAudioContext(context) ?
      context :
      Utils.throw('BufferList: Invalid BaseAudioContext.');

  this._options = {
    dataType: BufferDataType.BASE64,
    verbose: false,
  };

  if (options) {
    if (options.dataType &&
        Utils.isDefinedENUMEntry(BufferDataType, options.dataType)) {
      this._options.dataType = options.dataType;
    }
    if (options.verbose) {
      this._options.verbose = Boolean(options.verbose);
    }
  }

  this._bufferList = [];
  this._bufferData = this._options.dataType === BufferDataType.BASE64
      ? bufferData
      : bufferData.slice(0);
  this._numberOfTasks = this._bufferData.length;

  this._resolveHandler = null;
  this._rejectHandler = new Function();
}


/**
 * Starts AudioBuffer loading tasks.
 * @return {Promise<AudioBuffer[]>} The promise resolves with an array of
 * AudioBuffer.
 */
BufferList.prototype.load = function() {
  return new Promise(this._promiseGenerator.bind(this));
};


/**
 * Promise argument generator. Internally starts multiple async loading tasks.
 * @private
 * @param {function} resolve Promise resolver.
 * @param {function} reject Promise reject.
 */
BufferList.prototype._promiseGenerator = function(resolve, reject) {
  if (typeof resolve !== 'function') {
    Utils.throw('BufferList: Invalid Promise resolver.');
  } else {
    this._resolveHandler = resolve;
  }

  if (typeof reject === 'function') {
    this._rejectHandler = reject;
  }

  for (let i = 0; i < this._bufferData.length; ++i) {
    this._options.dataType === BufferDataType.BASE64
        ? this._launchAsyncLoadTask(i)
        : this._launchAsyncLoadTaskXHR(i);
  }
};


/**
 * Run async loading task for Base64-encoded string.
 * @private
 * @param {Number} taskId Task ID number from the ordered list |bufferData|.
 */
BufferList.prototype._launchAsyncLoadTask = function(taskId) {
  const that = this;
  this._context.decodeAudioData(
      Utils.getArrayBufferFromBase64String(this._bufferData[taskId]),
      function(audioBuffer) {
        that._updateProgress(taskId, audioBuffer);
      },
      function(errorMessage) {
        that._updateProgress(taskId, null);
        const message = 'BufferList: decoding ArrayByffer("' + taskId +
            '" from Base64-encoded data failed. (' + errorMessage + ')';
        Utils.throw(message);
        that._rejectHandler(message);
      });
};


/**
 * Run async loading task via XHR for audio file URLs.
 * @private
 * @param {Number} taskId Task ID number from the ordered list |bufferData|.
 */
BufferList.prototype._launchAsyncLoadTaskXHR = function(taskId) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', this._bufferData[taskId]);
  xhr.responseType = 'arraybuffer';

  const that = this;
  xhr.onload = function() {
    if (xhr.status === 200) {
      that._context.decodeAudioData(
          xhr.response,
          function(audioBuffer) {
            that._updateProgress(taskId, audioBuffer);
          },
          function(errorMessage) {
            that._updateProgress(taskId, null);
            const message = 'BufferList: decoding "' +
                that._bufferData[taskId] + '" failed. (' + errorMessage + ')';
            Utils.throw(message);
            that._rejectHandler(message);
          });
    } else {
      const message = 'BufferList: XHR error while loading "' +
          that._bufferData[taskId] + '(' + xhr.statusText + ')';
      Utils.throw(message);
      that._rejectHandler(message);
    }
  };

  xhr.onerror = function(event) {
    Utils.throw(
        'BufferList: XHR network failed on loading "' +
        that._bufferData[taskId] + '".');
    that._updateProgress(taskId, null);
    that._rejectHandler();
  };

  xhr.send();
};


/**
 * Updates the overall progress on loading tasks.
 * @param {Number} taskId Task ID number.
 * @param {AudioBuffer} audioBuffer Decoded AudioBuffer object.
 */
BufferList.prototype._updateProgress = function(taskId, audioBuffer) {
  this._bufferList[taskId] = audioBuffer;

  if (this._options.verbose) {
    let messageString = this._options.dataType === BufferDataType.BASE64
        ? 'ArrayBuffer(' + taskId + ') from Base64-encoded HRIR'
        : '"' + this._bufferData[taskId] + '"';
    Utils.log('BufferList: ' + messageString + ' successfully loaded.');
  }

  if (--this._numberOfTasks === 0) {
    let messageString = this._options.dataType === BufferDataType.BASE64
        ? this._bufferData.length + ' AudioBuffers from Base64-encoded HRIRs'
        : this._bufferData.length + ' files via XHR';
    Utils.log('BufferList: ' + messageString + ' loaded successfully.');
    this._resolveHandler(this._bufferList);
  }
};


module.exports = BufferList;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file An audio channel router to resolve different channel layouts between
 * browsers.
 */




/**
 * @typedef {Number[]} ChannelMap
 */

/**
 * Channel map dictionary ENUM.
 * @enum {ChannelMap}
 */
const ChannelMap = {
  /** @type {Number[]} - ACN channel map for Chrome and FireFox. (FFMPEG) */
  DEFAULT: [0, 1, 2, 3],
  /** @type {Number[]} - Safari's 4-channel map for AAC codec. */
  SAFARI: [2, 0, 1, 3],
  /** @type {Number[]} - ACN > FuMa conversion map. */
  FUMA: [0, 3, 1, 2],
};


/**
 * Channel router for FOA stream.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number[]} channelMap - Routing destination array.
 */
function FOARouter(context, channelMap) {
  this._context = context;

  this._splitter = this._context.createChannelSplitter(4);
  this._merger = this._context.createChannelMerger(4);

  // input/output proxy.
  this.input = this._splitter;
  this.output = this._merger;

  this.setChannelMap(channelMap || ChannelMap.DEFAULT);
}


/**
 * Sets channel map.
 * @param {Number[]} channelMap - A new channel map for FOA stream.
 */
FOARouter.prototype.setChannelMap = function(channelMap) {
  if (!Array.isArray(channelMap)) {
    return;
  }

  this._channelMap = channelMap;
  this._splitter.disconnect();
  this._splitter.connect(this._merger, 0, this._channelMap[0]);
  this._splitter.connect(this._merger, 1, this._channelMap[1]);
  this._splitter.connect(this._merger, 2, this._channelMap[2]);
  this._splitter.connect(this._merger, 3, this._channelMap[3]);
};


/**
 * Static channel map ENUM.
 * @static
 * @type {ChannelMap}
 */
FOARouter.ChannelMap = ChannelMap;


module.exports = FOARouter;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Sound field rotator for first-order-ambisonics decoding.
 */




/**
 * First-order-ambisonic decoder based on gain node network.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 */
function FOARotator(context) {
  this._context = context;

  this._splitter = this._context.createChannelSplitter(4);
  this._inY = this._context.createGain();
  this._inZ = this._context.createGain();
  this._inX = this._context.createGain();
  this._m0 = this._context.createGain();
  this._m1 = this._context.createGain();
  this._m2 = this._context.createGain();
  this._m3 = this._context.createGain();
  this._m4 = this._context.createGain();
  this._m5 = this._context.createGain();
  this._m6 = this._context.createGain();
  this._m7 = this._context.createGain();
  this._m8 = this._context.createGain();
  this._outY = this._context.createGain();
  this._outZ = this._context.createGain();
  this._outX = this._context.createGain();
  this._merger = this._context.createChannelMerger(4);

  // ACN channel ordering: [1, 2, 3] => [-Y, Z, -X]
  // Y (from channel 1)
  this._splitter.connect(this._inY, 1);
  // Z (from channel 2)
  this._splitter.connect(this._inZ, 2);
  // X (from channel 3)
  this._splitter.connect(this._inX, 3);
  this._inY.gain.value = -1;
  this._inX.gain.value = -1;

  // Apply the rotation in the world space.
  // |Y|   | m0  m3  m6 |   | Y * m0 + Z * m3 + X * m6 |   | Yr |
  // |Z| * | m1  m4  m7 | = | Y * m1 + Z * m4 + X * m7 | = | Zr |
  // |X|   | m2  m5  m8 |   | Y * m2 + Z * m5 + X * m8 |   | Xr |
  this._inY.connect(this._m0);
  this._inY.connect(this._m1);
  this._inY.connect(this._m2);
  this._inZ.connect(this._m3);
  this._inZ.connect(this._m4);
  this._inZ.connect(this._m5);
  this._inX.connect(this._m6);
  this._inX.connect(this._m7);
  this._inX.connect(this._m8);
  this._m0.connect(this._outY);
  this._m1.connect(this._outZ);
  this._m2.connect(this._outX);
  this._m3.connect(this._outY);
  this._m4.connect(this._outZ);
  this._m5.connect(this._outX);
  this._m6.connect(this._outY);
  this._m7.connect(this._outZ);
  this._m8.connect(this._outX);

  // Transform 3: world space to audio space.
  // W -> W (to channel 0)
  this._splitter.connect(this._merger, 0, 0);
  // Y (to channel 1)
  this._outY.connect(this._merger, 0, 1);
  // Z (to channel 2)
  this._outZ.connect(this._merger, 0, 2);
  // X (to channel 3)
  this._outX.connect(this._merger, 0, 3);
  this._outY.gain.value = -1;
  this._outX.gain.value = -1;

  this.setRotationMatrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));

  // input/output proxy.
  this.input = this._splitter;
  this.output = this._merger;
}


/**
 * Updates the rotation matrix with 3x3 matrix.
 * @param {Number[]} rotationMatrix3 - A 3x3 rotation matrix. (column-major)
 */
FOARotator.prototype.setRotationMatrix3 = function(rotationMatrix3) {
  this._m0.gain.value = rotationMatrix3[0];
  this._m1.gain.value = rotationMatrix3[1];
  this._m2.gain.value = rotationMatrix3[2];
  this._m3.gain.value = rotationMatrix3[3];
  this._m4.gain.value = rotationMatrix3[4];
  this._m5.gain.value = rotationMatrix3[5];
  this._m6.gain.value = rotationMatrix3[6];
  this._m7.gain.value = rotationMatrix3[7];
  this._m8.gain.value = rotationMatrix3[8];
};


/**
 * Updates the rotation matrix with 4x4 matrix.
 * @param {Number[]} rotationMatrix4 - A 4x4 rotation matrix. (column-major)
 */
FOARotator.prototype.setRotationMatrix4 = function(rotationMatrix4) {
  this._m0.gain.value = rotationMatrix4[0];
  this._m1.gain.value = rotationMatrix4[1];
  this._m2.gain.value = rotationMatrix4[2];
  this._m3.gain.value = rotationMatrix4[4];
  this._m4.gain.value = rotationMatrix4[5];
  this._m5.gain.value = rotationMatrix4[6];
  this._m6.gain.value = rotationMatrix4[8];
  this._m7.gain.value = rotationMatrix4[9];
  this._m8.gain.value = rotationMatrix4[10];
};


/**
 * Returns the current 3x3 rotation matrix.
 * @return {Number[]} - A 3x3 rotation matrix. (column-major)
 */
FOARotator.prototype.getRotationMatrix3 = function() {
  return [
    this._m0.gain.value, this._m1.gain.value, this._m2.gain.value,
    this._m3.gain.value, this._m4.gain.value, this._m5.gain.value,
    this._m6.gain.value, this._m7.gain.value, this._m8.gain.value,
  ];
};


/**
 * Returns the current 4x4 rotation matrix.
 * @return {Number[]} - A 4x4 rotation matrix. (column-major)
 */
FOARotator.prototype.getRotationMatrix4 = function() {
  let rotationMatrix4 = new Float32Array(16);
  rotationMatrix4[0] = this._m0.gain.value;
  rotationMatrix4[1] = this._m1.gain.value;
  rotationMatrix4[2] = this._m2.gain.value;
  rotationMatrix4[4] = this._m3.gain.value;
  rotationMatrix4[5] = this._m4.gain.value;
  rotationMatrix4[6] = this._m5.gain.value;
  rotationMatrix4[8] = this._m6.gain.value;
  rotationMatrix4[9] = this._m7.gain.value;
  rotationMatrix4[10] = this._m8.gain.value;
  return rotationMatrix4;
};


module.exports = FOARotator;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @file A collection of convolvers. Can be used for the optimized FOA binaural
 * rendering. (e.g. SH-MaxRe HRTFs)
 */




/**
 * FOAConvolver. A collection of 2 stereo convolvers for 4-channel FOA stream.
 * @constructor
 * @param {BaseAudioContext} context The associated AudioContext.
 * @param {AudioBuffer[]} [hrirBufferList] - An ordered-list of stereo
 * AudioBuffers for convolution. (i.e. 2 stereo AudioBuffers for FOA)
 */
function FOAConvolver(context, hrirBufferList) {
  this._context = context;

  this._active = false;
  this._isBufferLoaded = false;

  this._buildAudioGraph();

  if (hrirBufferList) {
    this.setHRIRBufferList(hrirBufferList);
  }

  this.enable();
}


/**
 * Build the internal audio graph.
 *
 * @private
 */
FOAConvolver.prototype._buildAudioGraph = function() {
  this._splitterWYZX = this._context.createChannelSplitter(4);
  this._mergerWY = this._context.createChannelMerger(2);
  this._mergerZX = this._context.createChannelMerger(2);
  this._convolverWY = this._context.createConvolver();
  this._convolverZX = this._context.createConvolver();
  this._splitterWY = this._context.createChannelSplitter(2);
  this._splitterZX = this._context.createChannelSplitter(2);
  this._inverter = this._context.createGain();
  this._mergerBinaural = this._context.createChannelMerger(2);
  this._summingBus = this._context.createGain();

  // Group W and Y, then Z and X.
  this._splitterWYZX.connect(this._mergerWY, 0, 0);
  this._splitterWYZX.connect(this._mergerWY, 1, 1);
  this._splitterWYZX.connect(this._mergerZX, 2, 0);
  this._splitterWYZX.connect(this._mergerZX, 3, 1);

  // Create a network of convolvers using splitter/merger.
  this._mergerWY.connect(this._convolverWY);
  this._mergerZX.connect(this._convolverZX);
  this._convolverWY.connect(this._splitterWY);
  this._convolverZX.connect(this._splitterZX);
  this._splitterWY.connect(this._mergerBinaural, 0, 0);
  this._splitterWY.connect(this._mergerBinaural, 0, 1);
  this._splitterWY.connect(this._mergerBinaural, 1, 0);
  this._splitterWY.connect(this._inverter, 1, 0);
  this._inverter.connect(this._mergerBinaural, 0, 1);
  this._splitterZX.connect(this._mergerBinaural, 0, 0);
  this._splitterZX.connect(this._mergerBinaural, 0, 1);
  this._splitterZX.connect(this._mergerBinaural, 1, 0);
  this._splitterZX.connect(this._mergerBinaural, 1, 1);

  // By default, WebAudio's convolver does the normalization based on IR's
  // energy. For the precise convolution, it must be disabled before the buffer
  // assignment.
  this._convolverWY.normalize = false;
  this._convolverZX.normalize = false;

  // For asymmetric degree.
  this._inverter.gain.value = -1;

  // Input/output proxy.
  this.input = this._splitterWYZX;
  this.output = this._summingBus;
};


/**
 * Assigns 2 HRIR AudioBuffers to 2 convolvers: Note that we use 2 stereo
 * convolutions for 4-channel direct convolution. Using mono convolver or
 * 4-channel convolver is not viable because mono convolution wastefully
 * produces the stereo outputs, and the 4-ch convolver does cross-channel
 * convolution. (See Web Audio API spec)
 * @param {AudioBuffer[]} hrirBufferList - An array of stereo AudioBuffers for
 * convolvers.
 */
FOAConvolver.prototype.setHRIRBufferList = function(hrirBufferList) {
  // After these assignments, the channel data in the buffer is immutable in
  // FireFox. (i.e. neutered) So we should avoid re-assigning buffers, otherwise
  // an exception will be thrown.
  if (this._isBufferLoaded) {
    return;
  }

  this._convolverWY.buffer = hrirBufferList[0];
  this._convolverZX.buffer = hrirBufferList[1];
  this._isBufferLoaded = true;
};


/**
 * Enable FOAConvolver instance. The audio graph will be activated and pulled by
 * the WebAudio engine. (i.e. consume CPU cycle)
 */
FOAConvolver.prototype.enable = function() {
  this._mergerBinaural.connect(this._summingBus);
  this._active = true;
};


/**
 * Disable FOAConvolver instance. The inner graph will be disconnected from the
 * audio destination, thus no CPU cycle will be consumed.
 */
FOAConvolver.prototype.disable = function() {
  this._mergerBinaural.disconnect();
  this._active = false;
};


module.exports = FOAConvolver;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileOverview DEPRECATED at V1. Audio buffer loading utility.
 */



const Utils = __webpack_require__(0);

/**
 * Streamlined audio file loader supports Promise.
 * @param {Object} context          AudioContext
 * @param {Object} audioFileData    Audio file info as [{name, url}]
 * @param {Function} resolve        Resolution handler for promise.
 * @param {Function} reject         Rejection handler for promise.
 * @param {Function} progress       Progress event handler.
 */
function AudioBufferManager(context, audioFileData, resolve, reject, progress) {
  this._context = context;

  this._buffers = new Map();
  this._loadingTasks = {};

  this._resolve = resolve;
  this._reject = reject;
  this._progress = progress;

  // Iterating file loading.
  for (let i = 0; i < audioFileData.length; i++) {
    const fileInfo = audioFileData[i];

    // Check for duplicates filename and quit if it happens.
    if (this._loadingTasks.hasOwnProperty(fileInfo.name)) {
      Utils.log('Duplicated filename when loading: ' + fileInfo.name);
      return;
    }

    // Mark it as pending (0)
    this._loadingTasks[fileInfo.name] = 0;
    this._loadAudioFile(fileInfo);
  }
}

AudioBufferManager.prototype._loadAudioFile = function(fileInfo) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', fileInfo.url);
  xhr.responseType = 'arraybuffer';

  const that = this;
  xhr.onload = function() {
    if (xhr.status === 200) {
      that._context.decodeAudioData(xhr.response,
        function(buffer) {
          // Utils.log('File loaded: ' + fileInfo.url);
          that._done(fileInfo.name, buffer);
        },
        function(message) {
          Utils.log('Decoding failure: '
            + fileInfo.url + ' (' + message + ')');
          that._done(fileInfo.name, null);
        });
    } else {
      Utils.log('XHR Error: ' + fileInfo.url + ' (' + xhr.statusText
        + ')');
      that._done(fileInfo.name, null);
    }
  };

  // TODO: fetch local resources if XHR fails.
  xhr.onerror = function(event) {
    Utils.log('XHR Network failure: ' + fileInfo.url);
    that._done(fileInfo.name, null);
  };

  xhr.send();
};

AudioBufferManager.prototype._done = function(filename, buffer) {
  // Label the loading task.
  this._loadingTasks[filename] = buffer !== null ? 'loaded' : 'failed';

  // A failed task will be a null buffer.
  this._buffers.set(filename, buffer);

  this._updateProgress(filename);
};

AudioBufferManager.prototype._updateProgress = function(filename) {
  let numberOfFinishedTasks = 0;
  let numberOfFailedTask = 0;
  let numberOfTasks = 0;

  for (const task in this._loadingTasks) {
    if (Object.prototype.hasOwnProperty.call(this._loadingTasks, task)) {
      numberOfTasks++;
      if (this._loadingTasks[task] === 'loaded') {
        numberOfFinishedTasks++;
      } else if (this._loadingTasks[task] === 'failed') {
        numberOfFailedTask++;
      }
    }
  }

  if (typeof this._progress === 'function') {
    this._progress(filename, numberOfFinishedTasks, numberOfTasks);
    return;
  }

  if (numberOfFinishedTasks === numberOfTasks) {
    this._resolve(this._buffers);
    return;
  }

  if (numberOfFinishedTasks + numberOfFailedTask === numberOfTasks) {
    this._reject(this._buffers);
    return;
  }
};

module.exports = AudioBufferManager;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @file Phase matched filter for first-order-ambisonics decoding.
 */



const Utils = __webpack_require__(0);


// Static parameters.
const CROSSOVER_FREQUENCY = 690;
const GAIN_COEFFICIENTS = [1.4142, 0.8166, 0.8166, 0.8166];


/**
 * Generate the coefficients for dual band filter.
 * @param {Number} crossoverFrequency
 * @param {Number} sampleRate
 * @return {Object} Filter coefficients.
 */
function generateDualBandCoefficients(crossoverFrequency, sampleRate) {
  const k = Math.tan(Math.PI * crossoverFrequency / sampleRate);
  const k2 = k * k;
  const denominator = k2 + 2 * k + 1;

  return {
    lowpassA: [1, 2 * (k2 - 1) / denominator, (k2 - 2 * k + 1) / denominator],
    lowpassB: [k2 / denominator, 2 * k2 / denominator, k2 / denominator],
    hipassA: [1, 2 * (k2 - 1) / denominator, (k2 - 2 * k + 1) / denominator],
    hipassB: [1 / denominator, -2 * 1 / denominator, 1 / denominator],
  };
}


/**
 * FOAPhaseMatchedFilter: A set of filters (LP/HP) with a crossover frequency to
 * compensate the gain of high frequency contents without a phase difference.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 */
function FOAPhaseMatchedFilter(context) {
  this._context = context;

  this._input = this._context.createGain();

  if (!this._context.createIIRFilter) {
    Utils.log('IIR filter is missing. Using Biquad filter instead.');
    this._lpf = this._context.createBiquadFilter();
    this._hpf = this._context.createBiquadFilter();
    this._lpf.frequency.value = CROSSOVER_FREQUENCY;
    this._hpf.frequency.value = CROSSOVER_FREQUENCY;
    this._hpf.type = 'highpass';
  } else {
    const coef = generateDualBandCoefficients(CROSSOVER_FREQUENCY,
                                              this._context.sampleRate);
    this._lpf = this._context.createIIRFilter(coef.lowpassB, coef.lowpassA);
    this._hpf = this._context.createIIRFilter(coef.hipassB, coef.hipassA);
  }

  this._splitterLow = this._context.createChannelSplitter(4);
  this._splitterHigh = this._context.createChannelSplitter(4);
  this._gainHighW = this._context.createGain();
  this._gainHighY = this._context.createGain();
  this._gainHighZ = this._context.createGain();
  this._gainHighX = this._context.createGain();
  this._merger = this._context.createChannelMerger(4);

  this._input.connect(this._hpf);
  this._hpf.connect(this._splitterHigh);
  this._splitterHigh.connect(this._gainHighW, 0);
  this._splitterHigh.connect(this._gainHighY, 1);
  this._splitterHigh.connect(this._gainHighZ, 2);
  this._splitterHigh.connect(this._gainHighX, 3);
  this._gainHighW.connect(this._merger, 0, 0);
  this._gainHighY.connect(this._merger, 0, 1);
  this._gainHighZ.connect(this._merger, 0, 2);
  this._gainHighX.connect(this._merger, 0, 3);

  this._input.connect(this._lpf);
  this._lpf.connect(this._splitterLow);
  this._splitterLow.connect(this._merger, 0, 0);
  this._splitterLow.connect(this._merger, 1, 1);
  this._splitterLow.connect(this._merger, 2, 2);
  this._splitterLow.connect(this._merger, 3, 3);

  // Apply gain correction to hi-passed pressure and velocity components:
  // Inverting sign is necessary as the low-passed and high-passed portion are
  // out-of-phase after the filtering.
  const now = this._context.currentTime;
  this._gainHighW.gain.setValueAtTime(-1 * GAIN_COEFFICIENTS[0], now);
  this._gainHighY.gain.setValueAtTime(-1 * GAIN_COEFFICIENTS[1], now);
  this._gainHighZ.gain.setValueAtTime(-1 * GAIN_COEFFICIENTS[2], now);
  this._gainHighX.gain.setValueAtTime(-1 * GAIN_COEFFICIENTS[3], now);

  // Input/output Proxy.
  this.input = this._input;
  this.output = this._merger;
}


module.exports = FOAPhaseMatchedFilter;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @file Virtual speaker abstraction for first-order-ambisonics decoding.
 */




/**
 * DEPRECATED at V1: A virtual speaker with ambisonic decoding gain coefficients
 * and HRTF convolution for first-order-ambisonics stream. Note that the
 * subgraph directly connects to context's destination.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} options - Options for speaker.
 * @param {Number[]} options.coefficients - Decoding coefficients for (W,Y,Z,X).
 * @param {AudioBuffer} options.IR - Stereo IR buffer for HRTF convolution.
 * @param {Number} options.gain - Post-gain for the speaker.
 */
function FOAVirtualSpeaker(context, options) {
  if (options.IR.numberOfChannels !== 2) {
    throw new Error('IR does not have 2 channels. cannot proceed.');
  }

  this._active = false;
  this._context = context;

  this._input = this._context.createChannelSplitter(4);
  this._cW = this._context.createGain();
  this._cY = this._context.createGain();
  this._cZ = this._context.createGain();
  this._cX = this._context.createGain();
  this._convolver = this._context.createConvolver();
  this._gain = this._context.createGain();

  this._input.connect(this._cW, 0);
  this._input.connect(this._cY, 1);
  this._input.connect(this._cZ, 2);
  this._input.connect(this._cX, 3);
  this._cW.connect(this._convolver);
  this._cY.connect(this._convolver);
  this._cZ.connect(this._convolver);
  this._cX.connect(this._convolver);
  this._convolver.connect(this._gain);
  this._gain.connect(this._context.destination);

  this.enable();

  this._convolver.normalize = false;
  this._convolver.buffer = options.IR;
  this._gain.gain.value = options.gain;

  // Set gain coefficients for FOA ambisonic streams.
  this._cW.gain.value = options.coefficients[0];
  this._cY.gain.value = options.coefficients[1];
  this._cZ.gain.value = options.coefficients[2];
  this._cX.gain.value = options.coefficients[3];

  // Input proxy. Output directly connects to the destination.
  this.input = this._input;
}


FOAVirtualSpeaker.prototype.enable = function() {
  this._gain.connect(this._context.destination);
  this._active = true;
};


FOAVirtualSpeaker.prototype.disable = function() {
  this._gain.disconnect();
  this._active = false;
};


module.exports = FOAVirtualSpeaker;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @file A collection of convolvers. Can be used for the optimized HOA binaural
 * rendering. (e.g. SH-MaxRe HRTFs)
 */




/**
 * A convolver network for N-channel HOA stream.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number} ambisonicOrder - Ambisonic order. (2 or 3)
 * @param {AudioBuffer[]} [hrirBufferList] - An ordered-list of stereo
 * AudioBuffers for convolution. (SOA: 5 AudioBuffers, TOA: 8 AudioBuffers)
 */
function HOAConvolver(context, ambisonicOrder, hrirBufferList) {
  this._context = context;

  this._active = false;
  this._isBufferLoaded = false;

  // The number of channels K based on the ambisonic order N where K = (N+1)^2.
  this._ambisonicOrder = ambisonicOrder;
  this._numberOfChannels =
      (this._ambisonicOrder + 1) * (this._ambisonicOrder + 1);

  this._buildAudioGraph();
  if (hrirBufferList) {
    this.setHRIRBufferList(hrirBufferList);
  }

  this.enable();
}


/**
 * Build the internal audio graph.
 * For TOA convolution:
 *   input -> splitter(16) -[0,1]-> merger(2) -> convolver(2) -> splitter(2)
 *                         -[2,3]-> merger(2) -> convolver(2) -> splitter(2)
 *                         -[4,5]-> ... (6 more, 8 branches total)
 * @private
 */
HOAConvolver.prototype._buildAudioGraph = function() {
  const numberOfStereoChannels = Math.ceil(this._numberOfChannels / 2);

  this._inputSplitter =
      this._context.createChannelSplitter(this._numberOfChannels);
  this._stereoMergers = [];
  this._convolvers = [];
  this._stereoSplitters = [];
  this._positiveIndexSphericalHarmonics = this._context.createGain();
  this._negativeIndexSphericalHarmonics = this._context.createGain();
  this._inverter = this._context.createGain();
  this._binauralMerger = this._context.createChannelMerger(2);
  this._outputGain = this._context.createGain();

  for (let i = 0; i < numberOfStereoChannels; ++i) {
    this._stereoMergers[i] = this._context.createChannelMerger(2);
    this._convolvers[i] = this._context.createConvolver();
    this._stereoSplitters[i] = this._context.createChannelSplitter(2);
    this._convolvers[i].normalize = false;
  }

  for (let l = 0; l <= this._ambisonicOrder; ++l) {
    for (let m = -l; m <= l; m++) {
      // We compute the ACN index (k) of ambisonics channel using the degree (l)
      // and index (m): k = l^2 + l + m
      const acnIndex = l * l + l + m;
      const stereoIndex = Math.floor(acnIndex / 2);

      // Split channels from input into array of stereo convolvers.
      // Then create a network of mergers that produces the stereo output.
      this._inputSplitter.connect(
          this._stereoMergers[stereoIndex], acnIndex, acnIndex % 2);
      this._stereoMergers[stereoIndex].connect(this._convolvers[stereoIndex]);
      this._convolvers[stereoIndex].connect(this._stereoSplitters[stereoIndex]);

      // Positive index (m >= 0) spherical harmonics are symmetrical around the
      // front axis, while negative index (m < 0) spherical harmonics are
      // anti-symmetrical around the front axis. We will exploit this symmetry
      // to reduce the number of convolutions required when rendering to a
      // symmetrical binaural renderer.
      if (m >= 0) {
        this._stereoSplitters[stereoIndex].connect(
            this._positiveIndexSphericalHarmonics, acnIndex % 2);
      } else {
        this._stereoSplitters[stereoIndex].connect(
            this._negativeIndexSphericalHarmonics, acnIndex % 2);
      }
    }
  }

  this._positiveIndexSphericalHarmonics.connect(this._binauralMerger, 0, 0);
  this._positiveIndexSphericalHarmonics.connect(this._binauralMerger, 0, 1);
  this._negativeIndexSphericalHarmonics.connect(this._binauralMerger, 0, 0);
  this._negativeIndexSphericalHarmonics.connect(this._inverter);
  this._inverter.connect(this._binauralMerger, 0, 1);

  // For asymmetric index.
  this._inverter.gain.value = -1;

  // Input/Output proxy.
  this.input = this._inputSplitter;
  this.output = this._outputGain;
};


/**
 * Assigns N HRIR AudioBuffers to N convolvers: Note that we use 2 stereo
 * convolutions for 4-channel direct convolution. Using mono convolver or
 * 4-channel convolver is not viable because mono convolution wastefully
 * produces the stereo outputs, and the 4-ch convolver does cross-channel
 * convolution. (See Web Audio API spec)
 * @param {AudioBuffer[]} hrirBufferList - An array of stereo AudioBuffers for
 * convolvers.
 */
HOAConvolver.prototype.setHRIRBufferList = function(hrirBufferList) {
  // After these assignments, the channel data in the buffer is immutable in
  // FireFox. (i.e. neutered) So we should avoid re-assigning buffers, otherwise
  // an exception will be thrown.
  if (this._isBufferLoaded) {
    return;
  }

  for (let i = 0; i < hrirBufferList.length; ++i) {
    this._convolvers[i].buffer = hrirBufferList[i];
  }

  this._isBufferLoaded = true;
};


/**
 * Enable HOAConvolver instance. The audio graph will be activated and pulled by
 * the WebAudio engine. (i.e. consume CPU cycle)
 */
HOAConvolver.prototype.enable = function() {
  this._binauralMerger.connect(this._outputGain);
  this._active = true;
};


/**
 * Disable HOAConvolver instance. The inner graph will be disconnected from the
 * audio destination, thus no CPU cycle will be consumed.
 */
HOAConvolver.prototype.disable = function() {
  this._binauralMerger.disconnect();
  this._active = false;
};


module.exports = HOAConvolver;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Sound field rotator for higher-order-ambisonics decoding.
 */




/**
 * Kronecker Delta function.
 * @param {Number} i
 * @param {Number} j
 * @return {Number}
 */
function getKroneckerDelta(i, j) {
  return i === j ? 1 : 0;
}


/**
 * A helper function to allow us to access a matrix array in the same
 * manner, assuming it is a (2l+1)x(2l+1) matrix. [2] uses an odd convention of
 * referring to the rows and columns using centered indices, so the middle row
 * and column are (0, 0) and the upper left would have negative coordinates.
 * @param {Number[]} matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 * @param {Number} l
 * @param {Number} i
 * @param {Number} j
 * @param {Number} gainValue
 */
function setCenteredElement(matrix, l, i, j, gainValue) {
  const index = (j + l) * (2 * l + 1) + (i + l);
  // Row-wise indexing.
  matrix[l - 1][index].gain.value = gainValue;
}


/**
 * This is a helper function to allow us to access a matrix array in the same
 * manner, assuming it is a (2l+1) x (2l+1) matrix.
 * @param {Number[]} matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 * @param {Number} l
 * @param {Number} i
 * @param {Number} j
 * @return {Number}
 */
function getCenteredElement(matrix, l, i, j) {
  // Row-wise indexing.
  const index = (j + l) * (2 * l + 1) + (i + l);
  return matrix[l - 1][index].gain.value;
}


/**
 * Helper function defined in [2] that is used by the functions U, V, W.
 * This should not be called on its own, as U, V, and W (and their coefficients)
 * select the appropriate matrix elements to access arguments |a| and |b|.
 * @param {Number[]} matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 * @param {Number} i
 * @param {Number} a
 * @param {Number} b
 * @param {Number} l
 * @return {Number}
 */
function getP(matrix, i, a, b, l) {
  if (b === l) {
    return getCenteredElement(matrix, 1, i, 1) *
        getCenteredElement(matrix, l - 1, a, l - 1) -
        getCenteredElement(matrix, 1, i, -1) *
        getCenteredElement(matrix, l - 1, a, -l + 1);
  } else if (b === -l) {
    return getCenteredElement(matrix, 1, i, 1) *
        getCenteredElement(matrix, l - 1, a, -l + 1) +
        getCenteredElement(matrix, 1, i, -1) *
        getCenteredElement(matrix, l - 1, a, l - 1);
  } else {
    return getCenteredElement(matrix, 1, i, 0) *
        getCenteredElement(matrix, l - 1, a, b);
  }
}


/**
 * The functions U, V, and W should only be called if the correspondingly
 * named coefficient u, v, w from the function ComputeUVWCoeff() is non-zero.
 * When the coefficient is 0, these would attempt to access matrix elements that
 * are out of bounds. The vector of rotations, |r|, must have the |l - 1|
 * previously completed band rotations. These functions are valid for |l >= 2|.
 * @param {Number[]} matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 * @param {Number} m
 * @param {Number} n
 * @param {Number} l
 * @return {Number}
 */
function getU(matrix, m, n, l) {
  // Although [1, 2] split U into three cases for m == 0, m < 0, m > 0
  // the actual values are the same for all three cases.
  return getP(matrix, 0, m, n, l);
}


/**
 * The functions U, V, and W should only be called if the correspondingly
 * named coefficient u, v, w from the function ComputeUVWCoeff() is non-zero.
 * When the coefficient is 0, these would attempt to access matrix elements that
 * are out of bounds. The vector of rotations, |r|, must have the |l - 1|
 * previously completed band rotations. These functions are valid for |l >= 2|.
 * @param {Number[]} matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 * @param {Number} m
 * @param {Number} n
 * @param {Number} l
 * @return {Number}
 */
function getV(matrix, m, n, l) {
  if (m === 0) {
    return getP(matrix, 1, 1, n, l) + getP(matrix, -1, -1, n, l);
  } else if (m > 0) {
    const d = getKroneckerDelta(m, 1);
    return getP(matrix, 1, m - 1, n, l) * Math.sqrt(1 + d) -
        getP(matrix, -1, -m + 1, n, l) * (1 - d);
  } else {
    // Note there is apparent errata in [1,2,2b] dealing with this particular
    // case. [2b] writes it should be P*(1-d)+P*(1-d)^0.5
    // [1] writes it as P*(1+d)+P*(1-d)^0.5, but going through the math by hand,
    // you must have it as P*(1-d)+P*(1+d)^0.5 to form a 2^.5 term, which
    // parallels the case where m > 0.
    const d = getKroneckerDelta(m, -1);
    return getP(matrix, 1, m + 1, n, l) * (1 - d) +
        getP(matrix, -1, -m - 1, n, l) * Math.sqrt(1 + d);
  }
}


/**
 * The functions U, V, and W should only be called if the correspondingly
 * named coefficient u, v, w from the function ComputeUVWCoeff() is non-zero.
 * When the coefficient is 0, these would attempt to access matrix elements that
 * are out of bounds. The vector of rotations, |r|, must have the |l - 1|
 * previously completed band rotations. These functions are valid for |l >= 2|.
 * @param {Number[]} matrix N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 * @param {Number} m
 * @param {Number} n
 * @param {Number} l
 * @return {Number}
 */
function getW(matrix, m, n, l) {
  // Whenever this happens, w is also 0 so W can be anything.
  if (m === 0) {
    return 0;
  }

  return m > 0 ? getP(matrix, 1, m + 1, n, l) + getP(matrix, -1, -m - 1, n, l) :
                 getP(matrix, 1, m - 1, n, l) - getP(matrix, -1, -m + 1, n, l);
}


/**
 * Calculates the coefficients applied to the U, V, and W functions. Because
 * their equations share many common terms they are computed simultaneously.
 * @param {Number} m
 * @param {Number} n
 * @param {Number} l
 * @return {Array} 3 coefficients for U, V and W functions.
 */
function computeUVWCoeff(m, n, l) {
  const d = getKroneckerDelta(m, 0);
  const reciprocalDenominator =
      Math.abs(n) === l ? 1 / (2 * l * (2 * l - 1)) : 1 / ((l + n) * (l - n));

  return [
    Math.sqrt((l + m) * (l - m) * reciprocalDenominator),
    0.5 * (1 - 2 * d) * Math.sqrt((1 + d) *
                                  (l + Math.abs(m) - 1) *
                                  (l + Math.abs(m)) *
                                  reciprocalDenominator),
    -0.5 * (1 - d) * Math.sqrt((l - Math.abs(m) - 1) * (l - Math.abs(m))) *
        reciprocalDenominator,
  ];
}


/**
 * Calculates the (2l+1) x (2l+1) rotation matrix for the band l.
 * This uses the matrices computed for band 1 and band l-1 to compute the
 * matrix for band l. |rotations| must contain the previously computed l-1
 * rotation matrices.
 * This implementation comes from p. 5 (6346), Table 1 and 2 in [2] taking
 * into account the corrections from [2b].
 * @param {Number[]} matrix - N matrices of gainNodes, each with where
 * n=1,2,...,N.
 * @param {Number} l
 */
function computeBandRotation(matrix, l) {
  // The lth band rotation matrix has rows and columns equal to the number of
  // coefficients within that band (-l <= m <= l implies 2l + 1 coefficients).
  for (let m = -l; m <= l; m++) {
    for (let n = -l; n <= l; n++) {
      const uvwCoefficients = computeUVWCoeff(m, n, l);

      // The functions U, V, W are only safe to call if the coefficients
      // u, v, w are not zero.
      if (Math.abs(uvwCoefficients[0]) > 0) {
        uvwCoefficients[0] *= getU(matrix, m, n, l);
      }
      if (Math.abs(uvwCoefficients[1]) > 0) {
        uvwCoefficients[1] *= getV(matrix, m, n, l);
      }
      if (Math.abs(uvwCoefficients[2]) > 0) {
        uvwCoefficients[2] *= getW(matrix, m, n, l);
      }

      setCenteredElement(
          matrix, l, m, n,
          uvwCoefficients[0] + uvwCoefficients[1] + uvwCoefficients[2]);
    }
  }
}


/**
 * Compute the HOA rotation matrix after setting the transform matrix.
 * @param {Array} matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
 * elements, where n=1,2,...,N.
 */
function computeHOAMatrices(matrix) {
  // We start by computing the 2nd-order matrix from the 1st-order matrix.
  for (let i = 2; i <= matrix.length; i++) {
    computeBandRotation(matrix, i);
  }
}


/**
 * Higher-order-ambisonic decoder based on gain node network. We expect
 * the order of the channels to conform to ACN ordering. Below are the helper
 * methods to compute SH rotation using recursion. The code uses maths described
 * in the following papers:
 *  [1] R. Green, "Spherical Harmonic Lighting: The Gritty Details", GDC 2003,
 *      http://www.research.scea.com/gdc2003/spherical-harmonic-lighting.pdf
 *  [2] J. Ivanic and K. Ruedenberg, "Rotation Matrices for Real
 *      Spherical Harmonics. Direct Determination by Recursion", J. Phys.
 *      Chem., vol. 100, no. 15, pp. 6342-6347, 1996.
 *      http://pubs.acs.org/doi/pdf/10.1021/jp953350u
 *  [2b] Corrections to initial publication:
 *       http://pubs.acs.org/doi/pdf/10.1021/jp9833350
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number} ambisonicOrder - Ambisonic order.
 */
function HOARotator(context, ambisonicOrder) {
  this._context = context;
  this._ambisonicOrder = ambisonicOrder;

  // We need to determine the number of channels K based on the ambisonic order
  // N where K = (N + 1)^2.
  const numberOfChannels = (ambisonicOrder + 1) * (ambisonicOrder + 1);

  this._splitter = this._context.createChannelSplitter(numberOfChannels);
  this._merger = this._context.createChannelMerger(numberOfChannels);

  // Create a set of per-order rotation matrices using gain nodes.
  this._gainNodeMatrix = [];
  let orderOffset;
  let rows;
  let inputIndex;
  let outputIndex;
  let matrixIndex;
  for (let i = 1; i <= ambisonicOrder; i++) {
    // Each ambisonic order requires a separate (2l + 1) x (2l + 1) rotation
    // matrix. We compute the offset value as the first channel index of the
    // current order where
    //   k_last = l^2 + l + m,
    // and m = -l
    //   k_last = l^2
    orderOffset = i * i;

    // Uses row-major indexing.
    rows = (2 * i + 1);

    this._gainNodeMatrix[i - 1] = [];
    for (let j = 0; j < rows; j++) {
      inputIndex = orderOffset + j;
      for (let k = 0; k < rows; k++) {
        outputIndex = orderOffset + k;
        matrixIndex = j * rows + k;
        this._gainNodeMatrix[i - 1][matrixIndex] = this._context.createGain();
        this._splitter.connect(
            this._gainNodeMatrix[i - 1][matrixIndex], inputIndex);
        this._gainNodeMatrix[i - 1][matrixIndex].connect(
            this._merger, 0, outputIndex);
      }
    }
  }

  // W-channel is not involved in rotation, skip straight to ouput.
  this._splitter.connect(this._merger, 0, 0);

  // Default Identity matrix.
  this.setRotationMatrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));

  // Input/Output proxy.
  this.input = this._splitter;
  this.output = this._merger;
}


/**
 * Updates the rotation matrix with 3x3 matrix.
 * @param {Number[]} rotationMatrix3 - A 3x3 rotation matrix. (column-major)
 */
HOARotator.prototype.setRotationMatrix3 = function(rotationMatrix3) {
  for (let i = 0; i < 9; ++i) {
    this._gainNodeMatrix[0][i].gain.value = rotationMatrix3[i];
  }
  computeHOAMatrices(this._gainNodeMatrix);
};


/**
 * Updates the rotation matrix with 4x4 matrix.
 * @param {Number[]} rotationMatrix4 - A 4x4 rotation matrix. (column-major)
 */
HOARotator.prototype.setRotationMatrix4 = function(rotationMatrix4) {
  this._gainNodeMatrix[0][0].gain.value = rotationMatrix4[0];
  this._gainNodeMatrix[0][1].gain.value = rotationMatrix4[1];
  this._gainNodeMatrix[0][2].gain.value = rotationMatrix4[2];
  this._gainNodeMatrix[0][3].gain.value = rotationMatrix4[4];
  this._gainNodeMatrix[0][4].gain.value = rotationMatrix4[5];
  this._gainNodeMatrix[0][5].gain.value = rotationMatrix4[6];
  this._gainNodeMatrix[0][6].gain.value = rotationMatrix4[8];
  this._gainNodeMatrix[0][7].gain.value = rotationMatrix4[9];
  this._gainNodeMatrix[0][8].gain.value = rotationMatrix4[10];
  computeHOAMatrices(this._gainNodeMatrix);
};


/**
 * Returns the current 3x3 rotation matrix.
 * @return {Number[]} - A 3x3 rotation matrix. (column-major)
 */
HOARotator.prototype.getRotationMatrix3 = function() {
  let rotationMatrix3 = new Float32Array(9);
  for (let i = 0; i < 9; ++i) {
    rotationMatrix3[i] = this._gainNodeMatrix[0][i].gain.value;
  }
  return rotationMatrix3;
};


/**
 * Returns the current 4x4 rotation matrix.
 * @return {Number[]} - A 4x4 rotation matrix. (column-major)
 */
HOARotator.prototype.getRotationMatrix4 = function() {
  let rotationMatrix4 = new Float32Array(16);
  rotationMatrix4[0] = this._gainNodeMatrix[0][0].gain.value;
  rotationMatrix4[1] = this._gainNodeMatrix[0][1].gain.value;
  rotationMatrix4[2] = this._gainNodeMatrix[0][2].gain.value;
  rotationMatrix4[4] = this._gainNodeMatrix[0][3].gain.value;
  rotationMatrix4[5] = this._gainNodeMatrix[0][4].gain.value;
  rotationMatrix4[6] = this._gainNodeMatrix[0][5].gain.value;
  rotationMatrix4[8] = this._gainNodeMatrix[0][6].gain.value;
  rotationMatrix4[9] = this._gainNodeMatrix[0][7].gain.value;
  rotationMatrix4[10] = this._gainNodeMatrix[0][8].gain.value;
  return rotationMatrix4;
};


/**
 * Get the current ambisonic order.
 * @return {Number}
 */
HOARotator.prototype.getAmbisonicOrder = function() {
  return this._ambisonicOrder;
};


module.exports = HOARotator;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Namespace for Omnitone library.
 */




exports.Omnitone = __webpack_require__(11);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Omnitone library name space and user-facing APIs.
 */




const BufferList = __webpack_require__(1);
const FOAConvolver = __webpack_require__(4);
const FOADecoder = __webpack_require__(12);
const FOAPhaseMatchedFilter = __webpack_require__(6);
const FOARenderer = __webpack_require__(14);
const FOARotator = __webpack_require__(3);
const FOARouter = __webpack_require__(2);
const FOAVirtualSpeaker = __webpack_require__(7);
const HOAConvolver = __webpack_require__(8);
const HOARenderer = __webpack_require__(16);
const HOARotator = __webpack_require__(9);
const Polyfill = __webpack_require__(19);
const Utils = __webpack_require__(0);
const Version = __webpack_require__(20);

// DEPRECATED in V1, in favor of BufferList.
const AudioBufferManager = __webpack_require__(5);


/**
 * Omnitone namespace.
 * @namespace
 */
let Omnitone = {};


/**
 * @typedef {Object} BrowserInfo
 * @property {string} name - Browser name.
 * @property {string} version - Browser version.
 */

/**
 * An object contains the detected browser name and version.
 * @memberOf Omnitone
 * @static {BrowserInfo}
 */
Omnitone.browserInfo = Polyfill.getBrowserInfo();


// DEPRECATED in V1. DO. NOT. USE.
Omnitone.loadAudioBuffers = function(context, speakerData) {
  return new Promise(function(resolve, reject) {
    new AudioBufferManager(context, speakerData, function(buffers) {
      resolve(buffers);
    }, reject);
  });
};


/**
 * Performs the async loading/decoding of multiple AudioBuffers from multiple
 * URLs.
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {string[]} bufferData - An ordered list of URLs.
 * @param {Object} [options] - BufferList options.
 * @param {String} [options.dataType='url'] - BufferList data type.
 * @return {Promise<AudioBuffer[]>} - The promise resolves with an array of
 * AudioBuffer.
 */
Omnitone.createBufferList = function(context, bufferData, options) {
  const bufferList =
      new BufferList(context, bufferData, options || {dataType: 'url'});
  return bufferList.load();
};


/**
 * Perform channel-wise merge on multiple AudioBuffers. The sample rate and
 * the length of buffers to be merged must be identical.
 * @static
 * @function
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {AudioBuffer[]} bufferList - An array of AudioBuffers to be merged
 * channel-wise.
 * @return {AudioBuffer} - A single merged AudioBuffer.
 */
Omnitone.mergeBufferListByChannel = Utils.mergeBufferListByChannel;


/**
 * Perform channel-wise split by the given channel count. For example,
 * 1 x AudioBuffer(8) -> splitBuffer(context, buffer, 2) -> 4 x AudioBuffer(2).
 * @static
 * @function
 * @param {BaseAudioContext} context - Associated BaseAudioContext.
 * @param {AudioBuffer} audioBuffer - An AudioBuffer to be splitted.
 * @param {Number} splitBy - Number of channels to be splitted.
 * @return {AudioBuffer[]} - An array of splitted AudioBuffers.
 */
Omnitone.splitBufferbyChannel = Utils.splitBufferbyChannel;


/**
 * Creates an instance of FOA Convolver.
 * @see FOAConvolver
 * @param {BaseAudioContext} context The associated AudioContext.
 * @param {AudioBuffer[]} [hrirBufferList] - An ordered-list of stereo
 * @return {FOAConvolver}
 */
Omnitone.createFOAConvolver = function(context, hrirBufferList) {
  return new FOAConvolver(context, hrirBufferList);
};


/**
 * Create an instance of FOA Router.
 * @see FOARouter
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number[]} channelMap - Routing destination array.
 * @return {FOARouter}
 */
Omnitone.createFOARouter = function(context, channelMap) {
  return new FOARouter(context, channelMap);
};


/**
 * Create an instance of FOA Rotator.
 * @see FOARotator
 * @param {AudioContext} context - Associated AudioContext.
 * @return {FOARotator}
 */
Omnitone.createFOARotator = function(context) {
  return new FOARotator(context);
};


/**
 * Create an instance of FOAPhaseMatchedFilter.
 * @ignore
 * @see FOAPhaseMatchedFilter
 * @param {AudioContext} context - Associated AudioContext.
 * @return {FOAPhaseMatchedFilter}
 */
Omnitone.createFOAPhaseMatchedFilter = function(context) {
  return new FOAPhaseMatchedFilter(context);
};


/**
 * Create an instance of FOAVirtualSpeaker. For parameters, refer the
 * definition of VirtualSpeaker class.
 * @ignore
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} options - Options.
 * @return {FOAVirtualSpeaker}
 */
Omnitone.createFOAVirtualSpeaker = function(context, options) {
  return new FOAVirtualSpeaker(context, options);
};


/**
 * DEPRECATED. Use FOARenderer instance.
 * @see FOARenderer
 * @param {AudioContext} context - Associated AudioContext.
 * @param {DOMElement} videoElement - Video or Audio DOM element to be streamed.
 * @param {Object} options - Options for FOA decoder.
 * @param {String} options.baseResourceUrl - Base URL for resources.
 * (base path for HRIR files)
 * @param {Number} [options.postGain=26.0] - Post-decoding gain compensation.
 * @param {Array} [options.routingDestination]  Custom channel layout.
 * @return {FOADecoder}
 */
Omnitone.createFOADecoder = function(context, videoElement, options) {
  Utils.log('WARNING: FOADecoder is deprecated in favor of FOARenderer.');
  return new FOADecoder(context, videoElement, options);
};


/**
 * Create a FOARenderer, the first-order ambisonic decoder and the optimized
 * binaural renderer.
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} config
 * @param {Array} [config.channelMap] - Custom channel routing map. Useful for
 * handling the inconsistency in browser's multichannel audio decoding.
 * @param {Array} [config.hrirPathList] - A list of paths to HRIR files. It
 * overrides the internal HRIR list if given.
 * @param {RenderingMode} [config.renderingMode='ambisonic'] - Rendering mode.
 * @return {FOARenderer}
 */
Omnitone.createFOARenderer = function(context, config) {
  return new FOARenderer(context, config);
};


/**
 * Creates HOARotator for higher-order ambisonics rotation.
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number} ambisonicOrder - Ambisonic order.
 * @return {HOARotator}
 */
Omnitone.createHOARotator = function(context, ambisonicOrder) {
  return new HOARotator(context, ambisonicOrder);
};


/**
 * Creates HOAConvolver performs the multi-channel convolution for the optmized
 * binaural rendering.
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Number} ambisonicOrder - Ambisonic order. (2 or 3)
 * @param {AudioBuffer[]} [hrirBufferList] - An ordered-list of stereo
 * AudioBuffers for convolution. (SOA: 5 AudioBuffers, TOA: 8 AudioBuffers)
 * @return {HOAConvovler}
 */
Omnitone.createHOAConvolver = function(
    context, ambisonicOrder, hrirBufferList) {
  return new HOAConvolver(context, ambisonicOrder, hrirBufferList);
};


/**
 * Creates HOARenderer for higher-order ambisonic decoding and the optimized
 * binaural rendering.
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} config
 * @param {Number} [config.ambisonicOrder=3] - Ambisonic order.
 * @param {Array} [config.hrirPathList] - A list of paths to HRIR files. It
 * overrides the internal HRIR list if given.
 * @param {RenderingMode} [config.renderingMode='ambisonic'] - Rendering mode.
 * @return {HOARenderer}
 */
Omnitone.createHOARenderer = function(context, config) {
  return new HOARenderer(context, config);
};


// Handler Preload Tasks.
// - Detects the browser information.
// - Prints out the version number.
(function() {
  Utils.log('Version ' + Version + ' (running ' +
      Omnitone.browserInfo.name + ' ' + Omnitone.browserInfo.version +
      ' on ' + Omnitone.browserInfo.platform +')');
  if (Omnitone.browserInfo.name.toLowerCase() === 'safari') {
    Polyfill.patchSafari();
    Utils.log(Omnitone.browserInfo.name + ' detected. Appliying polyfill...');
  }
})();


module.exports = Omnitone;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @file Omnitone FOA decoder, DEPRECATED in favor of FOARenderer.
 */



const AudioBufferManager = __webpack_require__(5);
const FOARouter = __webpack_require__(2);
const FOARotator = __webpack_require__(3);
const FOAPhaseMatchedFilter = __webpack_require__(6);
const FOAVirtualSpeaker = __webpack_require__(7);
const FOASpeakerData = __webpack_require__(13);
const Utils = __webpack_require__(0);

// By default, Omnitone fetches IR from the spatial media repository.
const HRTFSET_URL = 'https://raw.githubusercontent.com/GoogleChrome/omnitone/master/build/resources/';

// Post gain compensation value.
let POST_GAIN_DB = 0;


/**
 * Omnitone FOA decoder.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {VideoElement} videoElement - Target video (or audio) element for
 * streaming.
 * @param {Object} options
 * @param {String} options.HRTFSetUrl - Base URL for the cube HRTF sets.
 * @param {Number} options.postGainDB - Post-decoding gain compensation in dB.
 * @param {Number[]} options.channelMap - Custom channel map.
 */
function FOADecoder(context, videoElement, options) {
  this._isDecoderReady = false;
  this._context = context;
  this._videoElement = videoElement;
  this._decodingMode = 'ambisonic';

  this._postGainDB = POST_GAIN_DB;
  this._HRTFSetUrl = HRTFSET_URL;
  this._channelMap = FOARouter.ChannelMap.DEFAULT; // ACN

  if (options) {
    if (options.postGainDB) {
      this._postGainDB = options.postGainDB;
    }
    if (options.HRTFSetUrl) {
      this._HRTFSetUrl = options.HRTFSetUrl;
    }
    if (options.channelMap) {
      this._channelMap = options.channelMap;
    }
  }

  // Rearrange speaker data based on |options.HRTFSetUrl|.
  this._speakerData = [];
  for (let i = 0; i < FOASpeakerData.length; ++i) {
    this._speakerData.push({
      name: FOASpeakerData[i].name,
      url: this._HRTFSetUrl + '/' + FOASpeakerData[i].url,
      coef: FOASpeakerData[i].coef,
    });
  }

  this._tempMatrix4 = new Float32Array(16);
}


/**
 * Initialize and load the resources for the decode.
 * @return {Promise}
 */
FOADecoder.prototype.initialize = function() {
  Utils.log('Initializing... (mode: ' + this._decodingMode + ')');

  // Rerouting channels if necessary.
  let channelMapString = this._channelMap.toString();
  let defaultChannelMapString = FOARouter.ChannelMap.DEFAULT.toString();
  if (channelMapString !== defaultChannelMapString) {
    Utils.log('Remapping channels ([' + defaultChannelMapString + '] -> ['
      + channelMapString + '])');
  }

  this._audioElementSource =
      this._context.createMediaElementSource(this._videoElement);
  this._foaRouter = new FOARouter(this._context, this._channelMap);
  this._foaRotator = new FOARotator(this._context);
  this._foaPhaseMatchedFilter = new FOAPhaseMatchedFilter(this._context);

  this._audioElementSource.connect(this._foaRouter.input);
  this._foaRouter.output.connect(this._foaRotator.input);
  this._foaRotator.output.connect(this._foaPhaseMatchedFilter.input);

  this._foaVirtualSpeakers = [];

  // Bypass signal path.
  this._bypass = this._context.createGain();
  this._audioElementSource.connect(this._bypass);

  // Get the linear amplitude from the post gain option, which is in decibel.
  const postGainLinear = Math.pow(10, this._postGainDB/20);
  Utils.log('Gain compensation: ' + postGainLinear + ' (' + this._postGainDB
    + 'dB)');

  // This returns a promise so developers can use the decoder when it is ready.
  const that = this;
  return new Promise(function(resolve, reject) {
    new AudioBufferManager(that._context, that._speakerData,
      function(buffers) {
        for (let i = 0; i < that._speakerData.length; ++i) {
          that._foaVirtualSpeakers[i] = new FOAVirtualSpeaker(that._context, {
            coefficients: that._speakerData[i].coef,
            IR: buffers.get(that._speakerData[i].name),
            gain: postGainLinear,
          });

          that._foaPhaseMatchedFilter.output.connect(
            that._foaVirtualSpeakers[i].input);
        }

        // Set the decoding mode.
        that.setMode(that._decodingMode);
        that._isDecoderReady = true;
        Utils.log('HRTF IRs are loaded successfully. The decoder is ready.');
        resolve();
      }, reject);
  });
};

/**
 * Set the rotation matrix for the sound field rotation.
 * @param {Array} rotationMatrix      3x3 rotation matrix (row-major
 *                                    representation)
 */
FOADecoder.prototype.setRotationMatrix = function(rotationMatrix) {
  this._foaRotator.setRotationMatrix(rotationMatrix);
};


/**
 * Update the rotation matrix from a Three.js camera object.
 * @param  {Object} cameraMatrix      The Matrix4 obejct of Three.js the camera.
 */
FOADecoder.prototype.setRotationMatrixFromCamera = function(cameraMatrix) {
  // Extract the inner array elements and inverse. (The actual view rotation is
  // the opposite of the camera movement.)
  Utils.invertMatrix4(this._tempMatrix4, cameraMatrix.elements);
  this._foaRotator.setRotationMatrix4(this._tempMatrix4);
};

/**
 * Set the decoding mode.
 * @param {String} mode               Decoding mode. When the mode is 'bypass'
 *                                    the decoder is disabled and bypass the
 *                                    input stream to the output. Setting the
 *                                    mode to 'ambisonic' activates the decoder.
 *                                    When the mode is 'off', all the
 *                                    processing is completely turned off saving
 *                                    the CPU power.
 */
FOADecoder.prototype.setMode = function(mode) {
  if (mode === this._decodingMode) {
    return;
  }

  switch (mode) {
    case 'bypass':
      this._decodingMode = 'bypass';
      for (let i = 0; i < this._foaVirtualSpeakers.length; ++i) {
        this._foaVirtualSpeakers[i].disable();
      }
      this._bypass.connect(this._context.destination);
      break;

    case 'ambisonic':
      this._decodingMode = 'ambisonic';
      for (let i = 0; i < this._foaVirtualSpeakers.length; ++i) {
        this._foaVirtualSpeakers[i].enable();
      }
      this._bypass.disconnect();
      break;

    case 'off':
      this._decodingMode = 'off';
      for (let i = 0; i < this._foaVirtualSpeakers.length; ++i) {
        this._foaVirtualSpeakers[i].disable();
      }
      this._bypass.disconnect();
      break;
  }

  Utils.log('Decoding mode changed. (' + mode + ')');
};

module.exports = FOADecoder;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * The data for FOAVirtualSpeaker. Each entry contains the URL for IR files and
 * the gain coefficients for the associated IR files. Note that the order of
 * coefficients follows the ACN channel ordering. (W,Y,Z,X)
 * @type {Object[]}
 */
const FOASpeakerData = [{
  name: 'E35_A135',
  url: 'E35_A135.wav',
  gainFactor: 1,
  coef: [.1250, 0.216495, 0.21653, -0.216495],
}, {
  name: 'E35_A-135',
  url: 'E35_A-135.wav',
  gainFactor: 1,
  coef: [.1250, -0.216495, 0.21653, -0.216495],
}, {
  name: 'E-35_A135',
  url: 'E-35_A135.wav',
  gainFactor: 1,
  coef: [.1250, 0.216495, -0.21653, -0.216495],
}, {
  name: 'E-35_A-135',
  url: 'E-35_A-135.wav',
  gainFactor: 1,
  coef: [.1250, -0.216495, -0.21653, -0.216495],
}, {
  name: 'E35_A45',
  url: 'E35_A45.wav',
  gainFactor: 1,
  coef: [.1250, 0.216495, 0.21653, 0.216495],
}, {
  name: 'E35_A-45',
  url: 'E35_A-45.wav',
  gainFactor: 1,
  coef: [.1250, -0.216495, 0.21653, 0.216495],
}, {
  name: 'E-35_A45',
  url: 'E-35_A45.wav',
  gainFactor: 1,
  coef: [.1250, 0.216495, -0.21653, 0.216495],
}, {
  name: 'E-35_A-45',
  url: 'E-35_A-45.wav',
  gainFactor: 1,
  coef: [.1250, -0.216495, -0.21653, 0.216495],
}];


module.exports = FOASpeakerData;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @file Omnitone FOARenderer. This is user-facing API for the first-order
 * ambisonic decoder and the optimized binaural renderer.
 */



const BufferList = __webpack_require__(1);
const FOAConvolver = __webpack_require__(4);
const FOAHrirBase64 = __webpack_require__(15);
const FOARotator = __webpack_require__(3);
const FOARouter = __webpack_require__(2);
const Utils = __webpack_require__(0);


/**
 * @typedef {string} RenderingMode
 */

/**
 * Rendering mode ENUM.
 * @enum {RenderingMode}
 */
const RenderingMode = {
  /** @type {string} Use ambisonic rendering. */
  AMBISONIC: 'ambisonic',
  /** @type {string} Bypass. No ambisonic rendering. */
  BYPASS: 'bypass',
  /** @type {string} Disable audio output. */
  OFF: 'off',
};


/**
 * Omnitone FOA renderer class. Uses the optimized convolution technique.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} config
 * @param {Array} [config.channelMap] - Custom channel routing map. Useful for
 * handling the inconsistency in browser's multichannel audio decoding.
 * @param {Array} [config.hrirPathList] - A list of paths to HRIR files. It
 * overrides the internal HRIR list if given.
 * @param {RenderingMode} [config.renderingMode='ambisonic'] - Rendering mode.
 */
function FOARenderer(context, config) {
  this._context = Utils.isAudioContext(context) ?
      context :
      Utils.throw('FOARenderer: Invalid BaseAudioContext.');

  this._config = {
    channelMap: FOARouter.ChannelMap.DEFAULT,
    renderingMode: RenderingMode.AMBISONIC,
  };

  if (config) {
    if (config.channelMap) {
      if (Array.isArray(config.channelMap) && config.channelMap.length === 4) {
        this._config.channelMap = config.channelMap;
      } else {
        Utils.throw(
            'FOARenderer: Invalid channel map. (got ' + config.channelMap
            + ')');
      }
    }

    if (config.hrirPathList) {
      if (Array.isArray(config.hrirPathList) &&
          config.hrirPathList.length === 2) {
        this._config.pathList = config.hrirPathList;
      } else {
        Utils.throw(
            'FOARenderer: Invalid HRIR URLs. It must be an array with ' +
            '2 URLs to HRIR files. (got ' + config.hrirPathList + ')');
      }
    }

    if (config.renderingMode) {
      if (Object.values(RenderingMode).includes(config.renderingMode)) {
        this._config.renderingMode = config.renderingMode;
      } else {
        Utils.log(
            'FOARenderer: Invalid rendering mode order. (got' +
            config.renderingMode + ') Fallbacks to the mode "ambisonic".');
      }
    }
  }

  this._buildAudioGraph();

  this._tempMatrix4 = new Float32Array(16);
  this._isRendererReady = false;
}


/**
 * Builds the internal audio graph.
 * @private
 */
FOARenderer.prototype._buildAudioGraph = function() {
  this.input = this._context.createGain();
  this.output = this._context.createGain();
  this._bypass = this._context.createGain();
  this._foaRouter = new FOARouter(this._context, this._config.channelMap);
  this._foaRotator = new FOARotator(this._context);
  this._foaConvolver = new FOAConvolver(this._context);
  this.input.connect(this._foaRouter.input);
  this.input.connect(this._bypass);
  this._foaRouter.output.connect(this._foaRotator.input);
  this._foaRotator.output.connect(this._foaConvolver.input);
  this._foaConvolver.output.connect(this.output);

  this.input.channelCount = 4;
  this.input.channelCountMode = 'explicit';
  this.input.channelInterpretation = 'discrete';
};


/**
 * Internal callback handler for |initialize| method.
 * @private
 * @param {function} resolve - Resolution handler.
 * @param {function} reject - Rejection handler.
 */
FOARenderer.prototype._initializeCallback = function(resolve, reject) {
  const bufferList = this._config.pathList
      ? new BufferList(this._context, this._config.pathList, {dataType: 'url'})
      : new BufferList(this._context, FOAHrirBase64);
  bufferList.load().then(
      function(hrirBufferList) {
        this._foaConvolver.setHRIRBufferList(hrirBufferList);
        this.setRenderingMode(this._config.renderingMode);
        this._isRendererReady = true;
        Utils.log('FOARenderer: HRIRs loaded successfully. Ready.');
        resolve();
      }.bind(this),
      function() {
        const errorMessage = 'FOARenderer: HRIR loading/decoding failed.';
        Utils.throw(errorMessage);
        reject(errorMessage);
      });
};


/**
 * Initializes and loads the resource for the renderer.
 * @return {Promise}
 */
FOARenderer.prototype.initialize = function() {
  Utils.log(
      'FOARenderer: Initializing... (mode: ' + this._config.renderingMode +
      ')');

  return new Promise(this._initializeCallback.bind(this), function(error) {
    Utils.throw('FOARenderer: Initialization failed. (' + error + ')');
  });
};


/**
 * Set the channel map.
 * @param {Number[]} channelMap - Custom channel routing for FOA stream.
 */
FOARenderer.prototype.setChannelMap = function(channelMap) {
  if (!this._isRendererReady) {
    return;
  }

  if (channelMap.toString() !== this._config.channelMap.toString()) {
    Utils.log(
        'Remapping channels ([' + this._config.channelMap.toString() +
        '] -> [' + channelMap.toString() + ']).');
    this._config.channelMap = channelMap.slice();
    this._foaRouter.setChannelMap(this._config.channelMap);
  }
};


/**
 * Updates the rotation matrix with 3x3 matrix.
 * @param {Number[]} rotationMatrix3 - A 3x3 rotation matrix. (column-major)
 */
FOARenderer.prototype.setRotationMatrix3 = function(rotationMatrix3) {
  if (!this._isRendererReady) {
    return;
  }

  this._foaRotator.setRotationMatrix3(rotationMatrix3);
};


/**
 * Updates the rotation matrix with 4x4 matrix.
 * @param {Number[]} rotationMatrix4 - A 4x4 rotation matrix. (column-major)
 */
FOARenderer.prototype.setRotationMatrix4 = function(rotationMatrix4) {
  if (!this._isRendererReady) {
    return;
  }

  this._foaRotator.setRotationMatrix4(rotationMatrix4);
};


/**
 * Set the rotation matrix from a Three.js camera object. Depreated in V1, and
 * this exists only for the backward compatiblity. Instead, use
 * |setRotatationMatrix4()| with Three.js |camera.worldMatrix.elements|.
 * @deprecated
 * @param {Object} cameraMatrix - Matrix4 from Three.js |camera.matrix|.
 */
FOARenderer.prototype.setRotationMatrixFromCamera = function(cameraMatrix) {
  if (!this._isRendererReady) {
    return;
  }

  // Extract the inner array elements and inverse. (The actual view rotation is
  // the opposite of the camera movement.)
  Utils.invertMatrix4(this._tempMatrix4, cameraMatrix.elements);
  this._foaRotator.setRotationMatrix4(this._tempMatrix4);
};


/**
 * Set the rendering mode.
 * @param {RenderingMode} mode - Rendering mode.
 *  - 'ambisonic': activates the ambisonic decoding/binaurl rendering.
 *  - 'bypass': bypasses the input stream directly to the output. No ambisonic
 *    decoding or encoding.
 *  - 'off': all the processing off saving the CPU power.
 */
FOARenderer.prototype.setRenderingMode = function(mode) {
  if (mode === this._config.renderingMode) {
    return;
  }

  switch (mode) {
    case RenderingMode.AMBISONIC:
      this._foaConvolver.enable();
      this._bypass.disconnect();
      break;
    case RenderingMode.BYPASS:
      this._foaConvolver.disable();
      this._bypass.connect(this.output);
      break;
    case RenderingMode.OFF:
      this._foaConvolver.disable();
      this._bypass.disconnect();
      break;
    default:
      Utils.log(
          'FOARenderer: Rendering mode "' + mode + '" is not ' +
          'supported.');
      return;
  }

  this._config.renderingMode = mode;
  Utils.log('FOARenderer: Rendering mode changed. (' + mode + ')');
};


module.exports = FOARenderer;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

const OmnitoneFOAHrirBase64 = [
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+/wIA9v8QAPv/CwD+/wcA/v8MAP//AQD7/wEACAAEAPj/+v8YABAA7v/n//v/9P/M/8D//f34/R38EvzxAfEBtA2lDTcBJQFJ9T71FP0D/cD1tfVo/Wv9uPTO9PPmOufc/U/+agL3Aisc/RxuGKEZBv3j/iYMzQ2gAzsEQQUABiQFrASzA5cB2QmyCy0AtgR4AeYGtfgAA2j5OQHP+scArPsMBJgEggIEBtz6+QVq/pj/aPg8BPP3gQEi+jEAof0fA1v9+/7S+8IBjvwd/xD4IADL/Pf9zvs+/l3+wgB7/+L+7fzFADH9kf6A+n3+DP6+/TP9xP68/pn+w/26/i39YgA0/u790Pt9/kD+7v1s/Wb+8f4C/1P+pf/x/cT+6/3p/Xz9ff5F/0f9G/4r/6v/4P5L/sL+ff7c/pj+Ov7X/UT+9P5G/oz+6v6A/2D+9/6P/8r/bP7m/ij+C//e/tj/Gf4e/9v+FwDP/lz/sP7F/2H+rv/G/s7/Hf7y/4P+NAD9/k0AK/6w/zP/hACh/sX/gf44AOP+dgCm/iUAk/5qAOD+PwC+/jEAWP4CAAr/bQBw/vv/zf5iACD/OgCS/uD/Cv9oAAb/CgDK/kwA//5tACH/TgCg/h4AHP9aABP/JADP/hEAYv9gAAj/3f8m/ysAYv8gACX/8/8k/ysAXv8bABH//v8j/ygAa/8qAAD/9f9g/1YAWf8JACH/AgB2/z4AXP/w/z3/FgB2/ykAX//9/z//EwCV/zUAS//n/1T/GACK/x4ATv/0/4P/QQB4//v/WP/2/3X/HAB8//P/V//3/2f/AQBh/9v/Tf/x/5P/IwCI/wMAf/8hAKP/JACZ/xUAiv8nAK//HgCr/yMAm/8uAMz/OACi/yQAqf87AMT/MwCY/yUAtP9FAMH/KgCu/ycAyP85AMv/IwCz/xoA1f8qAMn/FgC8/xQA4/8nAMX/CwDJ/xQA4f8ZAMH/BgDO/xQA4f8WAMP/BwDU/xQA4P8QAMH/AQDb/xQA3P8JAMP/AgDh/xIA2v8EAMj/AgDk/w0A1f/+/8v/AwDm/wwA0v/+/9H/BgDl/wkAzv/8/9T/BwDk/wcAzv/8/9r/CQDi/wQAzf/8/9//CADf////0P/9/+L/BwDd//7/0////+T/BgDb//z/1f8AAOf/BQDZ//v/2v8CAOb/AwDY//v/3v8EAOb/AgDY//3/4f8FAOX/AQDZ//7/5P8GAOP/AADb/wAA5/8GAOH////d/wIA5/8FAOD////f/wMA6P8FAOD////h/wQA6P8EAN7////h/wUA4v8DANv/AQDd/wQA3P8CANn/AgDb/wMA2/8CANv/AgDd/wIA3v8CAOH/AQDj/wEA",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAAAA/f8CAP//AQD//wEA//8BAP3/AAACAP7/+f8AAAIA/P8FAAQA8/8AABoA+f/V/wQAHQDO/xoAQQBO/ocA0Px1/ucHW/4UCm8HLO6kAjv8/fCRDdAAYfPiBIgFXveUCM0GBvh6/nz7rf0J/QcQSRVdBgoBSgFR62r9NP8m+LoEAvriBVAAiAPmABEGMf2l+SwBjva6/G4A//8P/CYDMgXm/R0CKAE6/fcBBwAtAND+kQA0A5UDhwFs/8IB8fydAEP/A/8v/e7/mP8j/2YBIwE3Av0AYv+uAOD8lgAg/wwAIf/L/n0Ae//OAJMB3P/XAF//XwCM/08AB/8NAEf/rf4jAT3/lgAJAP4AHgDpAO8AUf9L/07/Qf8KAOD/x/+D/3sATQCDAMoA0f79/+L/EQDt/7EAqv+S/7IAuv/o/wgAc//X//H/SwCm/+3/Yf/B/yoAAADI/7X/AwBg/5EATgCX/xYA/P+q/00AVACY/6v/BADD/zwALQCN/8z/KQDu/ygAEgCZ/6f/VQDC//T/KQCs/7P/UgAfAO7/NgC8/57/awAZAPP/+P/V/8z/bQBBAL//DgD0/+T/TABBAMz/CwAxAPz/SQBqALn/BgALAPz/EAA7AIz/3/8iAAUA//8kALf/y/9VABQA+v81AOj/0P9cAB4A+f8WAOr/vv83ABgAw/8JAOj/4f8nACIAsf/y/w4A3v8gACQAxP/n/ycA7P8WAC0Ayf/U/ycA9v/7/yUA0P/P/zUABADc/xUA5P/J/zcACwDS/xUA9P/m/zAACQDX/+3/9v/2/yQACgDZ/+P/AwAKABYA///b/9j/EQALABkADgD6/+7/GwD4/w4A8P/w//j/EgAEAAUA9f/1/wQAGgD4/wAA5////wAAGQD1////7f8FAAUAFQDv/wAA6v8LAAcAFQDs/wEA9P8SAAYACwDr//7/AQASAAYABQDv/wIAAwAWAAIAAgDv/wAABgATAAEA/f/u/wQABgAQAPr/+P/z/wUACQALAPj/9//4/wgABwAKAPT/+f/5/w4ABwAIAPT/+//9/w4AAwADAPH//f///w8A//8BAPP///8BAA0A/f/+//X/AgACAA0A+//8//b/BAADAAoA+f/7//n/BgADAAcA+P/7//v/BwABAAQA+P/8//3/CQABAAIA9//9////CQD/////+P///wAACAD9//7/+f8AAAAABwD8//3/+v8CAAAABgD7//z//P8EAAAABAD6//3//P8FAP//AgD6//7//v8FAP7/AQD7//////8GAP7/AAD7/wEA//8EAP3/AAD9/wEA/v8DAP3/AAD9/wIA/v8CAP3/AQD9/wIA/v8CAP7/AQD+/wEA",
];

module.exports = OmnitoneFOAHrirBase64;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @file Omnitone HOARenderer. This is user-facing API for the higher-order
 * ambisonic decoder and the optimized binaural renderer.
 */



const BufferList = __webpack_require__(1);
const HOAConvolver = __webpack_require__(8);
const HOARotator = __webpack_require__(9);
const TOAHrirBase64 = __webpack_require__(17);
const SOAHrirBase64 = __webpack_require__(18);
const Utils = __webpack_require__(0);


/**
 * @typedef {string} RenderingMode
 */

/**
 * Rendering mode ENUM.
 * @enum {RenderingMode}
 */
const RenderingMode = {
  /** @type {string} Use ambisonic rendering. */
  AMBISONIC: 'ambisonic',
  /** @type {string} Bypass. No ambisonic rendering. */
  BYPASS: 'bypass',
  /** @type {string} Disable audio output. */
  OFF: 'off',
};


// Currently SOA and TOA are only supported.
const SupportedAmbisonicOrder = [2, 3];


/**
 * Omnitone HOA renderer class. Uses the optimized convolution technique.
 * @constructor
 * @param {AudioContext} context - Associated AudioContext.
 * @param {Object} config
 * @param {Number} [config.ambisonicOrder=3] - Ambisonic order.
 * @param {Array} [config.hrirPathList] - A list of paths to HRIR files. It
 * overrides the internal HRIR list if given.
 * @param {RenderingMode} [config.renderingMode='ambisonic'] - Rendering mode.
 */
function HOARenderer(context, config) {
  this._context = Utils.isAudioContext(context) ?
      context :
      Utils.throw('HOARenderer: Invalid BaseAudioContext.');

  this._config = {
    ambisonicOrder: 3,
    renderingMode: RenderingMode.AMBISONIC,
  };

  if (config && config.ambisonicOrder) {
    if (SupportedAmbisonicOrder.includes(config.ambisonicOrder)) {
      this._config.ambisonicOrder = config.ambisonicOrder;
    } else {
      Utils.log(
          'HOARenderer: Invalid ambisonic order. (got ' +
          config.ambisonicOrder + ') Fallbacks to 3rd-order ambisonic.');
    }
  }

  this._config.numberOfChannels =
      (this._config.ambisonicOrder + 1) * (this._config.ambisonicOrder + 1);
  this._config.numberOfStereoChannels =
      Math.ceil(this._config.numberOfChannels / 2);

  if (config && config.hrirPathList) {
    if (Array.isArray(config.hrirPathList) &&
        config.hrirPathList.length === this._config.numberOfStereoChannels) {
      this._config.pathList = config.hrirPathList;
    } else {
      Utils.throw(
          'HOARenderer: Invalid HRIR URLs. It must be an array with ' +
          this._config.numberOfStereoChannels + ' URLs to HRIR files.' +
          ' (got ' + config.hrirPathList + ')');
    }
  }

  if (config && config.renderingMode) {
    if (Object.values(RenderingMode).includes(config.renderingMode)) {
      this._config.renderingMode = config.renderingMode;
    } else {
      Utils.log(
          'HOARenderer: Invalid rendering mode. (got ' +
          config.renderingMode + ') Fallbacks to "ambisonic".');
    }
  }

  this._buildAudioGraph();

  this._isRendererReady = false;
}


/**
 * Builds the internal audio graph.
 * @private
 */
HOARenderer.prototype._buildAudioGraph = function() {
  this.input = this._context.createGain();
  this.output = this._context.createGain();
  this._bypass = this._context.createGain();
  this._hoaRotator = new HOARotator(this._context, this._config.ambisonicOrder);
  this._hoaConvolver =
      new HOAConvolver(this._context, this._config.ambisonicOrder);
  this.input.connect(this._hoaRotator.input);
  this.input.connect(this._bypass);
  this._hoaRotator.output.connect(this._hoaConvolver.input);
  this._hoaConvolver.output.connect(this.output);

  this.input.channelCount = this._config.numberOfChannels;
  this.input.channelCountMode = 'explicit';
  this.input.channelInterpretation = 'discrete';
};


/**
 * Internal callback handler for |initialize| method.
 * @private
 * @param {function} resolve - Resolution handler.
 * @param {function} reject - Rejection handler.
 */
HOARenderer.prototype._initializeCallback = function(resolve, reject) {
  let bufferList;
  if (this._config.pathList) {
    bufferList =
        new BufferList(this._context, this._config.pathList, {dataType: 'url'});
  } else {
    bufferList = this._config.ambisonicOrder === 2
        ? new BufferList(this._context, SOAHrirBase64)
        : new BufferList(this._context, TOAHrirBase64);
  }

  bufferList.load().then(
      function(hrirBufferList) {
        this._hoaConvolver.setHRIRBufferList(hrirBufferList);
        this.setRenderingMode(this._config.renderingMode);
        this._isRendererReady = true;
        Utils.log('HOARenderer: HRIRs loaded successfully. Ready.');
        resolve();
      }.bind(this),
      function() {
        const errorMessage = 'HOARenderer: HRIR loading/decoding failed.';
        Utils.throw(errorMessage);
        reject(errorMessage);
      });
};


/**
 * Initializes and loads the resource for the renderer.
 * @return {Promise}
 */
HOARenderer.prototype.initialize = function() {
  Utils.log(
      'HOARenderer: Initializing... (mode: ' + this._config.renderingMode +
      ', ambisonic order: ' + this._config.ambisonicOrder + ')');

  return new Promise(this._initializeCallback.bind(this), function(error) {
    Utils.throw('HOARenderer: Initialization failed. (' + error + ')');
  });
};


/**
 * Updates the rotation matrix with 3x3 matrix.
 * @param {Number[]} rotationMatrix3 - A 3x3 rotation matrix. (column-major)
 */
HOARenderer.prototype.setRotationMatrix3 = function(rotationMatrix3) {
  if (!this._isRendererReady) {
    return;
  }

  this._hoaRotator.setRotationMatrix3(rotationMatrix3);
};


/**
 * Updates the rotation matrix with 4x4 matrix.
 * @param {Number[]} rotationMatrix4 - A 4x4 rotation matrix. (column-major)
 */
HOARenderer.prototype.setRotationMatrix4 = function(rotationMatrix4) {
  if (!this._isRendererReady) {
    return;
  }

  this._hoaRotator.setRotationMatrix4(rotationMatrix4);
};


/**
 * Set the decoding mode.
 * @param {RenderingMode} mode - Decoding mode.
 *  - 'ambisonic': activates the ambisonic decoding/binaurl rendering.
 *  - 'bypass': bypasses the input stream directly to the output. No ambisonic
 *    decoding or encoding.
 *  - 'off': all the processing off saving the CPU power.
 */
HOARenderer.prototype.setRenderingMode = function(mode) {
  if (mode === this._config.renderingMode) {
    return;
  }

  switch (mode) {
    case RenderingMode.AMBISONIC:
      this._hoaConvolver.enable();
      this._bypass.disconnect();
      break;
    case RenderingMode.BYPASS:
      this._hoaConvolver.disable();
      this._bypass.connect(this.output);
      break;
    case RenderingMode.OFF:
      this._hoaConvolver.disable();
      this._bypass.disconnect();
      break;
    default:
      Utils.log(
          'HOARenderer: Rendering mode "' + mode + '" is not ' +
          'supported.');
      return;
  }

  this._config.renderingMode = mode;
  Utils.log('HOARenderer: Rendering mode changed. (' + mode + ')');
};


module.exports = HOARenderer;


/***/ }),
/* 17 */
/***/ (function(module, exports) {

const OmnitoneTOAHrirBase64 = [
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+/wQA8/8YAP3/CgACAAAA//8CAAYA8/8AAPH/CgDv/97/e/+y/9P+UQDwAHUBEwV7/pP8P/y09bsDwAfNBGYIFf/Y+736+fP890Hv8AGcC3T/vwYy+S70AAICA3AD4AagBw0R4w3ZEAcN8RVYAV8Q8P2z+kECHwdK/jIG0QNKAYUElf8IClj7BgjX+/f8j/l3/5f/6fkK+xz8FP0v/nj/Mf/n/FcBPfvH/1H3+gBP/Hf8cfiCAR/54QBh+UQAcvkzAWL8TP13+iD/V/73+wv9Kv+Y/hv+xPz7/UL83//a/z/9AP6R/5L+jf26/P3+rP26/tD8nP7B/Pv+WP1V/sP9gv91/3P9xP3J/nv/GP5S/sb+IP8v/9j/dv7U/pr+6v+u/Z3/sv5cAOr9Q/83/+n/zP5x/57+2//k/nwA/v01//L+SACB/sD/Ff81AJT+TgDp/ocAm/5dAFT+MgD+/pMAW/7o/yH/xQDA/kkA9P6LAL3+pAC0/iQAz/5UALD+UwAt/3UAhf4UAA//pwC+/joAz/5aAAv/fwDY/iMAIf+uAPP+ZAAc/0QAy/4xAB7/TgDs/goADP8wAEL/NwDo/ub/Uf9BAC3/+v9F/y4ARP9HAFP/EQA3/xMATP81AG3/HQAu/wgAaP9FACb/9f9B/y0AUP8rAED/CwBV/z4AW/8TAGH/BQBK/xsAfv8eAFn/AgB3/zwAff8RAGj//v+E/yAAb//0/3n/FwBz/xcAiv8PAHn/FQCJ/xgAg//x/3j/EQCa/ycAff/w/47/HwCI//X/iv/7/43/JQCM/+n/kP8AAJb/JACj//7/oP8ZAML/SwCo/w4Atv8tAMb/PACr/xcAwP9HAMP/OADF/y4A0f9IANL/NwC//zEA0f9LAMb/MAC8/y4A3f9GAMH/FQDQ/yYA2/8sAMT/AwDX/xkA3v8SAM3/9v/c/w8A4f8LAMj/8f/h/xQA2P8CAMn/8//j/xQA0v/7/9H//P/i/xEA0v/1/9L//f/j/w0A0f/x/9f//v/k/wgAz//u/9z/AwDg/wMA0P/v/9//BQDf////0v/y/+D/CADc//3/0v/2/+L/CgDa//r/1v/5/+T/CgDY//j/2f/9/+T/CADY//f/3P8AAOT/BwDY//f/4P8EAOP/BADZ//j/4v8GAOL/AwDa//r/5f8IAOH/AQDc//3/5v8JAOD//v/f////5v8IAOD//v/h/wIA5/8HAOD//f/j/wMA5/8GAOD//f/l/wYA5v8EAOD//v/m/wYA5f8CAOL////n/wYA5P8BAOH/AADl/wUA4f///+H/AQDk/wMA4f///+T/AQDm/wEA5////+r/AADt/wAA7/////P/AAD1////",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD//////v///wAAAAAAAAAAAQAAAAAA///9/wAABAD+//n/AgAJAAAA+v/+//f/DAAdAPv/+v+l/8L+jf/4/vgAdwVPAQACLQBo+Qj/Ev7o/N3/VgCbA08Bxf+L+yn9J/2HCU8FmgBvDe30Rv5h/LT09gi5CxkA5gOi8/30kwEM+4YJMf2nBmkJJAQQBLoFtvvv+m4A7PF6/R0Bif3qAuf8WARAAf4GyABG/BIAwvr4Acv8U//c/yIC8AEn/B8Daf2CAgMBAf3MAN38vgLK/UT/QwCyAPYClPyvAW/+pQAoASD+zP+R/IYC1f7C/nEBQP96AZb+1QAIAM//yQE7/tkAZ/7TAXL/w/8+AIsAtwB7/24A4v9a/z4A7v4iADb/dwCj/23/kgBOANUAIv8lAKEAxP9gAK7/BwCP/5kA7/9v/0wAzv9DAGT/3/9vAHv/6P+q/xUA7P8XAO//uv/g/2UAEgCV/wEATADM/+7/+//j/+D/9v/i//j/IgD+/xoAxf/6/z4A5/+8/9D/QwDq/+3/OQDT/zUAIgA/APP/PgAjAPD/BwAGACAADAC3//b/HAA3AN//RgDN/w8AIAACAN//GQBDACEAIwA+ACoAJQAeAPz/KgAYAPr/DgAEABYAIgAcAMT/7f8OAOL/5P/2//L/9P8GAPT/7v/8/+7/6v/t//z/AgAUAOL//P8VAAMA4/8IAPb/+P8MAAoA5v8NAAsA9v///wEAAAD9//n/9/8JAAYA7v/6/wMA+f8GAAEA7f/7/xgACAD4/w8A///3/w0A+f8BAAIA/P/5/xIA///9//r/7v/+/xYACQD///H/CwDz/wEADgAHAPP/FADn/+3/AQD5//f/AgD7/wEABwAMAAEADQD8//n/8f8OAPX/BAD+//X/+v8WAAQA+f8CAAEA7/8QAAEA/P8DAAUA9f8KAAwA9v8DAAUA+f8OAAoA9f/7/w0A+v8EAAgA8P/6/woA+//8/wkA+P/3/woA+//8/wcA9//1/woAAwD5/wcA/P/3/w0AAwD3/wEABAD2/wkABgD3/wEABQD3/wUABQD3//v/BwD3/wMABQD3//r/CQD7////BQD6//n/CQD9//3/BAD9//j/BwAAAPv/AwD///j/BwABAPn/AQABAPn/BQACAPn///8DAPr/AwADAPr//v8EAPv/AQADAPv//P8FAP3///8DAPz/+/8FAP7//f8CAP7/+/8EAP///P8BAP//+/8DAAEA+/8AAAEA+/8CAAIA+////wIA/f8AAAIA/P/+/wIA/f8AAAIA/f/9/wMA/////wEA///+/wIA/////wAAAAD+/wAAAAD/////AAD//wAA//8AAP//AAD//wAA",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD////////+//////8AAP////8AAP//AAAAAPz//f8IAAMA9////w4AAQD6/wwA8//+/y8Afv/0/2H/UP5gAbH+2QG1B2cAVAIh/l32FPyM/nACPQDV/+UEo/Q6AQwCu/oLD9kF8QJA/Uz+Wf2KCOcC+wUKBsL5aQBQ97rwOPiPAvn5CAl8AHEDkQPcAA8Bn/lIAdz7HQF1+xz9cAM4/94E4gDKAun+cgPYAYr9JgJr/bf+ivxz/MoBgv5UA8EBSgAQAJ7/UgEk/cQB7f63/sD/vf4XAhT/BQFCADYAnQGI/9EBtv3hALD/vP+c/3H/TgIN/1sBpf8yAP3/4f8qABr+1f8OAJ3/dwAGADEBnv9JAPz/IQBwAIH/jgAS/4wAsACTAOn/DQDCALn/ZQCSAAIAAwD1/9//jv9aADQA/v9EAB0AfgA8AAQACgB9APr/IAARAPT/5v9xACAABAAHAGUAt/89AC4ACgAjAMP/+v/9/xYA7f/1/+D/7P87AC0Auv8RAAcA9/8FAC8A2//y/xIAEwAaADQAJADp/zoAAgAfABIA2f/e/zUA+P/6/w4A9//A/zcA4//P//T/5f/R////EwDb/w4A8/8BABkANADh/xEA+f/0/wIAHADc//j/GwD1//f/GADs/+v/EAAAAPz/EgD3/+r/FgAMAAkAGAD9/+z/IQAQAPH/GQD3//z/CgAfAOX/AgD8//H/BAATAOv/+v///wIABAAdAOj/BQAPAAcAAQATAOz/8/8JAAkA6f8VAOv/+f8QABUA/v8OAO3/+P8KABUA9f8FAPv/5/8TAA0A7f8XAAkAAQAJABYA4/8WAAcACgANABEA7v8EAP7/AAD+/wMA9//7/xAAAQD8/wQA+f/7/wMABgDq/wAA+v/3/wYACQD1//3/BAD9/wgADgDw//r/AgD6/wEACADv//j/BQD///X/BwDu//j/AgACAPP/BAD2//n/BAAGAPb/BAD8//3/BQAJAPL/AwD+//3/BAAIAPP//f8DAPz/AAAGAPP/+/8CAP7//f8FAPX/+f8DAAAA/P8EAPf/+v8GAAMA+/8EAPv/+/8GAAQA+v8CAP///P8EAAUA+f8AAP///f8CAAUA+P///wEA/v8BAAUA+f/+/wIAAAD//wUA+v/9/wMAAQD9/wQA+//9/wMAAgD8/wMA/P/9/wMAAwD7/wEA/v/+/wIAAwD6/wEA///+/wAABAD6/wAAAQD//wAAAwD7////AQAAAP//AwD8//7/AgABAP3/AgD9//7/AQABAP3/AQD+//7/AAACAPz/AAD+//////8BAP3/AAD//wAA//8BAP7/AAD//wAA/v8AAP7/AAD//wAA//8AAP//",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD//////P/9//3//////wAAAAAAAAIAAgACAP//CAAEAEEA//+cAAUAb/8HAAH9+P9eARkAogQUAJn8BwCd/gX/+QQNAKoC9gFdAtb/b/vd/936TP/6AsD/nfqn/un1W/0dA8IEsQLvAJv2bP72+WMAkP8dAcX+nQO2AIr6bP/EABX+NgK/Bdj2IQv2AE4EUAiD/xQAnwIm/B0B/wGNAoH7sQaP/b8CiQakAqD+R/9xA477KQL//6r75v/O/pcCgQCtAiMCBQAkANAARwHf//39hgBl/kUAJgEtAUEATgA/AgoASADK/zUAJv29/vL+l/9c/0cAUwBBAE8A6QE5/87/Wv9NAOf+5v7P/5P/4/9BAKYAQwDD/zYB5v+r/zYATwAp/1v/WQAEAB0AhwA0AA0AIAA3AAEAzv/u/+//5v9m/zwAIADQ/8T/SABiANb/SwAbAFf/MQDX/7L/hP8TAPr/AgAMAAsAHwAZAI3/VgDC/9v/5//x/6P/AwBlAMv/yf82AB4A+P9WAPj/NwDi/1EA0v9JANj/JwAcAAEADABYANj/4f8MAEwAmP82AN//3P8UADYA7//6/wIACADU/ygAyv82AN7/9v/2/ygAxv/9/+3/5//n/zUA6//g/y4ADgD5/wsABwDv/xIADwAGACoAJQD3/zIA+/8FABsAFgDO/zAAHAAIABQALADp/xcACAAAAPH/GADs/wkACQAFAAgAFQDp/wIAHAD1//P/EQDw/+3/GAD9/+f/HAD8//T/DAAQAPH/HwD4//r/DwAPAOj/EQACAOn/DAAXAOX/BAAOANH/9/8MAO//9f8LANT/9f8EAO//6f8NANb/+P8KAOz/5v8MAOD/7f8UAO//7//+//7/9v8YAPj/9f/z/wsA+v8SAPD/+v/x/xYA+f8SAPb/9//3/xEABQACAPn/9//y/xQACQD///b//v/7/xIACQD9//H/AAD7/xEAAgD5//P/AwD9/w8AAgD3//D/BAD//wUA/v/0//D/BgADAAMA/P/2//f/BwAGAP7/+//2//j/CAAFAPv/+f/5//v/BwAHAPn/9//7//7/BQAFAPf/9//+/wEABAACAPf/+P8BAAIAAgAAAPj/9/8CAAMAAAD+//n/+f8EAAQA/v/8//r/+/8EAAMA/P/7//z//P8EAAIA/P/5//7//v8DAAEA+//5//////8CAAAA+//5/wEAAAABAP//+//6/wIAAQD///3//P/7/wMAAQD///3//f/9/wIAAQD9//3//v/9/wMAAQD9//z/AAD//wEAAAD9//z/AAAAAAAA///9//3/AAD//wAA/v////7/AAD//wAA////////AAD//wAA//8AAP//",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+////+f////v//v///wAA/////wUAAQAIAAIABwACAHkATAAOAaMAAf9C/9X6QvwhArAAtghABW37nv/y+0wAWQNcAE8JRwSOC6AEJe8P8S/zrPWaBI/+LQA/+0L+P/4K8AgAb/8uCh78BQtC614GaQWfAin5UfzN8Tf+GQizAZ4MCQMbGJ4BoRS7AvcHyQARA6n9ZwHZ/z4DvwAZAlAB6gbNAS4GFADFATL7E/2K+j37C/xp/SD9Uv0VAOsDs//WAd3+bv7F/f79mP2X/KH+FwC0/1n+VgFcATABHQGaAET+nf8Y/hoAovpqAXj9CQKW/lsCl/4RApj+bAHk/RcAlv4BAG/+DgDi//3/GwAOAEIAq/+y/3z/8v8+/7T/Tv8//27/mgDZ/1sA+P+cAAAA/P/i/yMAi/85AMP/KgDM/9MA9P+QABoA4QAiACwACwBdAP7/TQDb/y0Ayf+SAA0AZwDg/4wA+/8/AAMAgQDp/w0ADAAQAAoANgAgAA4AKABIAB4A4v/3/+f/+v/c/+n/EADn/wgAFAAqAOz/IwDc/9//3f8XAND/2v/a/w0A5v8BANb/9P/m/wAA8P8ZAN3/RwAGAEsABgB/AP7/NAASAEgABAA3AP3/KgD9/1sA8P8lAOr/FgD1/xAA4/8kAOv/AwD4/xEA5f8NAPT/+v/3/x8A7f8PAPj/IwD5/yAA9/8ZAAEAGgD4/xoA9f8HAAMACAD0/xgA+P8AAPr/IQDp/w4A8v8HAPX/IgD1/wYA+P8GAPX/GgD3/woABQASAAcAGQDw/+v/9P8bAP3/HADs/+f/7/8LAPr//v/0//T/AgD2/wsA6P///+P/CADY//7/5v/3/wQA/v8LAPD/GgD1/yMA/P8QAOv/LADw/yQA+P8XAO7/MQD9/yEAAQAcAPD/IgD9/xMA+/8OAO//FQABAAoA+/8PAPP/FQABAAQA9/8PAPX/CAADAAEA+P8NAPv/CAAGAAUA9/8JAP//AAAFAPz/+f8HAAQA/f8FAP3//P8FAAYA+P8DAP7/+/8AAAcA9/8BAP///f///wgA9//+/wAA/v/8/wUA9//8/wIA///7/wUA+v/7/wIAAAD6/wMA/P/6/wEAAQD6/wEA/v/7/wIAAgD6////AAD7/wEAAgD7//7/AQD8/wAAAwD8//3/AwD9/wAAAgD9//z/AwD/////AgD+//z/AwAAAP7/AQD///3/AgABAP3/AAAAAP3/AgACAPz///8BAP3/AQACAP3//v8BAP7/AAABAP3//v8CAP7///8BAP7//f8CAP////8AAAAA/v8CAAAAAAAAAAAA/v8BAAAAAAD//wAA//8AAP//AAD//wAA//8AAP//",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAP//AAD//wAA//8AAAAA/////wAAAQD+////AAAGAP3/OAABAIIAAwBv//f/E/0QAK0ADQCzA/7/8P4u/0cBDQCJA6ABbQDg/w7/z/9o+Vn/SPnL/1//Ef+2+jr9RfZgA5QFZwILDFj+PAb2/nEFKgKk/R0Dlv6b/FUDsP6YAoj9SgAT/iL/tAPwAv8A0P6zAr7/dwAnAf39uP22/skA2v///2YCoP4UAUsAZgF2AJH+4P70/rz9+f+U/Xv/8v7CAcb+TACS/kwAv/+x/tX9oP71/oL/1f8nAEUAZwGtAAgAIgC/AD4BaP8GAGH/dQDF/64Arf8nAakAhAH9/+kAQQD3AFb/q/8p/yIAR/8FAPD/ZAA/AIYA3v8tADQADQBp/3f/CwABAP3/Wf8OANj/WwDH/xoAe/8DAKz/zv96/z8A3f/J/5X/IAD5//j/q//c/+//RADq//D/vv8pADUAFQDI/y8ACAAbANb/OwD3/+3/9f/e/wcAIAAeAMH/8/8xAC0AEADW/+3/HAADAPv/8P8DAOL/OwD3/xcACQAHAM//5f8XAAcAz//T/9D/HgD9////yf/e//v/AgD//9H/6/////H/+/8hAAIA9//7/w0AFgAQAPL/2v/8/xsAGQABANz/9P8YAAQA/v/y/wMA5v8YAAkAAAAAAAMA7/8KABgADwDs//j/BwATABsA8P/1//z/BAAMAAAA9P/s/xAA/v8GAAkA/v/p/wMACwALAP7/9P/p/wcADQAFAPb/7//4/w0ACAD8//b//v/1/wMACwD1//T/8P/8/wAACQDz/+f/5P8GAAkABQD5//D/+v8FAA0AAwD///T/AgACABAA/v8CAPD/+/8FAAoA9f/3//f//v8GAP7/9v/t//z/+f8AAPj/+v/3/wEA+v8HAPr//P/5/wQA//8DAPr/+P/3/wYA///+//X/+//5/wQA/f/7//X/+//4/wMA/f/8//j//v/9/wYA///8//f/AgAAAAUA/f/6//n/AwACAAIA/f/7//z/AwACAAAA/f/6//3/AgADAP7//f/7/wAAAwAFAPz////8/wMAAgAEAPv//v/+/wMAAgADAPv//v///wMAAQABAPv//f8AAAIAAAD///v//f8BAAIA///+//z//v8CAAIA/v/9//3///8CAAEA/v/9//7/AAACAAAA/v/9////AAABAAAA/f/9/wAAAQABAP///f/+/wEAAQAAAP///v/+/wEAAQD///7//v///wEAAQD///7//v///wEAAAD+//7///8AAAAAAAD+//7///8AAAAA///+//7///8AAAAA////////AAAAAP////////////8AAP//////////",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAAAAAAABAAAAAAD//////////////v////3/////////+//8////AQD9//z/9f8BAAIA+f8dACgAWQBxAJX/qv+Y/uz9aP9k/7UDUQQBAiQA4Pgi/AkB0gKaBsD/+fxp/vz9CQSp/I/+ywDO+vMD0fzK/PABcgBeBfoBv/+uAuH9Sf5gAy39awMmBWUBuP9fA9/9fgDj/2/+EACaACcCSv9Z/2j/rv7hAA0AWf55/7L84P7E/SIAT/67AMv/tf+FAA7/1v+7/gv/IP+E/sQA+P5aAXz/tP9XAFX/tP8o/4r/j//e/yQAMv9mAJT/rgCr/9X/EwCb//H/9f7F/6D/EAAoAK3//v+e/zsAh/+B/7r/if/C/2r/4P/z/6//HwCy/0IA7/9ZALT/y/80ACgA9v/J/9//DgA5ADUALQARADIACwAfAOf/NgArACMACQBBAEcAGAAjAC4AWQBUAHcAAAAfACEAIAAcAPj/CADk/yQA7v89AEEAFwD5/xYA6f8aAOX/AADF/zQADwAUAOT/BQDr/yUA6P8XAOf/HADR/0AA8P8nAAgACQDt/ycAKAAHAPH/IQDz/xsACADn//n/DgADAA4A8P///8z/GgDN/yMA/f8QANj/MwACAC0ACwAOAO3/JgAZAAUACgAAAA4AIgAaAAkADwACAAAAHQATAAUABQACAAgACwAjAO////8AAA8ABQAPAPL//f8GAAsABgAGAPD/8v8GAPz/CAD6//H/6v8PAAgABgD4//3/9v8aAAgABwD1//7//v8QAAoACAD//wUA9v8QAAoABAAFAAgAAgAJAAoAAwD//w0AAgD//wcA/v8DAAoABQAFABUABAAKAAYABwAHAA8ACgAGAAwADwAMAAkAEAAJAAgADwAMAAgADgAJAAUACQAPAAUACwAHAAEABgAIAAEABAAGAP//AgAJAAAAAgAEAP7///8IAAIA//8GAAEAAQAJAAIA/v8EAAMA//8JAAEA/v8DAAMA/v8HAAMA/f8BAAUA/v8FAAMA/v8BAAcA//8DAAMA/v8BAAYA//8CAAMA/////wcAAAAAAAMAAAD//wYAAQD+/wMAAQD//wUAAQD+/wIAAgD//wQAAgD+/wEAAwD//wMAAwD+/wEAAwD//wIAAwD//wEABAAAAAEABAD//wAABAABAAAAAwAAAAAABAABAP//AwABAAAAAwACAP//AgACAAAAAwACAP//AgACAAAAAgACAAAAAQADAAAAAQACAAAAAQADAAAAAQACAAAAAAACAAEAAAACAAEAAAACAAEAAAABAAEAAAABAAEAAAABAAEAAAABAAEAAAABAAEAAAABAAEAAAAAAAAAAAAAAAAA",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAP//AAD//wAA//8AAAAA//8AAP//AAACAAAA+f8BAAYA///4/wIA//8AAA8A/v/V/wEAEwA9AAEBRwA2AF7/kfog/3gBwv99CDYBU/qtAUX/AP7OAfkAX/o9B38FSfwaAuT14/60BAr8CQAI/tfyIQTzAXP+egdUBBwBof7TBMT8bAWi/5EEWwBRAAAKyfxE/8b88vp6ACP+PAF4/qD8MQNM/ygCJ/2XAPD9kP5gAVT/iP9I/lEB4P8qAD0BFAGa/+7/DgB2AOP98gFm/u/+Vv5/AG8ASP9gAM//qv9w//oAcv+2/jIBHgA7/6D/oAAGAKH/lADT/wAAggC8AAYAkP9yAEcAkf8BAOD/RAAr/zUANwDt/xQAJQAkAMT/zwA/AOH/xv9zAGsANQBTAIcALAAvACIATACy/xMADADg/xcAWABvAJL/7f9VAPb/EgDt/wcA4f8kAPP/5P+h/wgACQDy//r/LgAQAMn/8/9CAOX/5v/S/9//3P8pABYAuP/s/w8AFgDt/+3/7v/w/9j/5/8GAOf/2P/2//P//v8kABMAuf/m/xoADADZ/+r/3P8KAAUAKwDe/wsA3P8VAAAADgAfAB0ACAAMAF4AGgAhAPL/MwDz/0kABAAKAPX/LwAbAAkA9v/s/+3/8/8CABAAAADm//n/BQALAAUAAQDj//n/JQAVAPX/9v/+/wIAEQABAPP/8P/1/wAABgD6/+3/7//o//j/DAD8/+b/8P8IAAkABgD4//D/8P8UAAoAAwD4/wAA+f8OAAcAAAAFAPX/9v8TAAkA8v8EAPb/9/8dAA0A7/8CAPn/+f8SAAQA8/8CAOf/+v8DAAgA9P////H//P8IAAUA8//0/wIAAQAGAAgA9//7/wAA+/8EAP//+P/+////AgACAAsA8v/+/wIABQD7/wgA9v/7/wMABAD5/wAA/P/3/wEAAQD7//7//P/1/wQA///3//r////3/wMAAwD1//r/AwD6////AgD4//n/AwD8//7/AgD4//n/AwD+//3/AQD4//n/BQD///n/AAD6//j/BAABAPj/AAD9//v/AwADAPj//v/+//z/AwAEAPj//v8BAP7/AQADAPj//f8CAP////8EAPr//P8DAAAA/v8CAPv//P8DAAEA/f8BAP3//f8DAAIA/P8AAP7//f8DAAIA/P///wAA/f8BAAIA+//+/wEA//8AAAEA+//+/wEA/////wEA/P/+/wEA///+/wAA/f/9/wEAAAD9/wAA/f/+/wEAAQD8/////v/+/wAAAQD8////////////AQD9////AAD/////AAD+////AAAAAP//AAD///////8AAP//AAD//wAA//8AAP//",
];

module.exports = OmnitoneTOAHrirBase64;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

const OmnitoneSOAHrirBase64 = [
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+/wQA8/8ZAPr/DAD+/wMA/v8KAAQA/f8DAAMABADs//z/8v/z/8f/R/90/ob+//zAAWsDAwY3DKn9//tu93DvkwI6An4CuwJ0/BH7VPux92X0Gu7N/EX9mgfqCkkIiRMgBd4NQQGL/c0G/xBxAKELZATUA/sIHRSx+fkCyAUmBNEJIARlAdHz2AjNACcIsAW4AlECsvtJ/P/7K/tf++n8aP4W+g0FXAElAMn8nQHn/sT+Zv7N+9X2xvzM/O3+EvpqBBD7SQLd+vb/sPlw/JD72/3n+Rr+L/wS/vz6UQGg/Nf+Av5L/5X9Gv2//SP+mf3j/lf+v/2B/ZH/5P05/iL9MP9F/uf9UP4v/qv9mv7o/Xn+wP2k/8L+uP5J/tD+Dv/Y/bL+mP72/n3+pP+7/hAA+/5zAGH+Z/+u/g8Azv2y/6L+//9o/iIADP8VACz/CwCN/pb/1v4yAFP+wf+4/jsAcf5VAP3+bADa/nMA6f4sAOT+IQBd/v7/7v6aAIL+QADe/nEA0P4yAKz+CQCo/moAuf5xAN7+mAC8/jcANf9eAPX+IAA1/1kAAP9hAMz+PQD5/m0A2/4gAPr+UQDh/jQAEv9BAPH+FABN/zkASv9DADP/BABe/1IAGf8oAE3/RQAw/zIAQf8mADn/GgBE/xIAR/8hAD7/BABy/zEAKP/0/07/GwBX/z4ARf8mAFr/QQBV/zUAVP8eAFz/JABt/0EAUP8MAHz/KgBr/ycAYv8EAH3/MABl/x8Agv8bAIj/GgBv//z/ff8AAJX/IABu/+T/jv/r/4z/9/9n/77/pP8JAJD/EQCJ//r/q/8WAJ//GQCU/xYAtv8qAKr/PQCW/ysAwf8+ALb/OgC3/ygAz/8uAM7/OgDH/ygAz/8kAMz/OgC//xsA1f8qAMn/LwDN/xcA1f8oAMv/JQDR/xMAzf8bAM//HgDU/wUA2v8ZANL/EwDW/wEA1f8ZAMz/BwDX/wIA0v8SANT/BQDW/wMA0/8PANT/AADY/wIA1f8MANX/+f/a/wUA0v8IANf/+//Y/wUA0/8DANr/+f/Y/wQA1v8BANr/+f/Z/wUA1//8/9z/+v/Y/wYA2f/8/93//v/Y/wUA2v/9/93////Z/wUA3P/8/97/AgDa/wMA3v/8/97/AwDb/wIA3//9/97/BADd/wEA4f///9//BQDf/wAA4v8AAN//BQDf/wAA4/8CAN//BADh/wAA4/8DAOD/BADi////4/8DAOH/AwDk/wAA5P8FAOL/AgDl/wEA5P8FAOL/AQDl/wEA4/8EAOL/AQDj/wIA4P8DAN//AADg/wIA3v8CAOD/AADh/wEA4v8AAOP/AADm/wAA6P8AAOz/AADu/wAA",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD//////f/+//7///8AAP////8BAAEA/f8AAAEAAQAFAAUA9//6/x0A2f/9/xMA3P+jAE//of9HAKP//gCj/77/Z/vi/28D9/ywDJAJIvr6AsX0Xec4BhcGzf23DZP7yfZ6C1//nwBDBIHyYgob/Tf3sQ41ANoKRA/A+E7yffAa9gD5EQUBDMwMygiqAHMAqPqhAGUB2/gE+a78H/+4APT6DwIUAA0HNwMhBfL8E/90A5n7dP9cALIC+v5C/q0AOv9kAogBHv01/+3/qAQD/ub8T/4vAOUA5P6KATv+ywEYAeT+KP6i/3gCFP6h/hr/+P83ACL/VADn/8UARQJI/4MAu/8qAlj+wf4iAPb/LgFJ/8QAUABAAI4ABf+k/3X/YgFK/ij/j/9HADoAi/+WAA0BVwC/ACL/LACe//cARv9i/xgAUgA0ACj/FgBgAIj/5P9M/7z/zv8/AKz/gv8sAEQA6/+I/yYAawDL/7T/xf8qAOv/FQCu/5n/EgAyAO3/i/9LAE4A+//R//P/FgDe/8z/u/8DADIALAAZALL/TAA8ABwAo//1/xwA/P/L/z0A6P8jAN7/7v+a/zAAwf/7/3//KQAuACwA9v8RAGYAIwBNADgAKgASAF0ADgANACEAMQDH//H/LQACAB0Ay////x0APAABAAQA2v8iAAcAEgDE/+v/FQD+/+P/DAD1/97/6v/4//X/EwD4/+7/5P8cAA0ACQDH//7/CQAXAAEA/P/5//j/CwAWAAEABQD9//n/AQAWAB0A7v/k/wAACQAmAP//9/8AAPn/8/8aAO//6/8fAOv/5v8hAP//5/8PAOf/AAAGAPn/6v8JAAYABgABAOv/1//1//L/+P8DABcA6f/8/wMACgD7/xAA3v/2//z/DADu//z/5v/5/wEA/P/6//7/7v/x/wQABgD5/wAA8v/w/wkAEQD2//j/+v8EAAcAEAD3//v/+v8CAAAACQD3//v//v/9/wUADAD2//X/AgAHAAAABwD2//T/BgAKAP7/AQD4//r/BAAIAPn/AAD3//f/BQAHAPv//v/7//n/BQAJAPj/+v/9//7/AgAGAPj/+f8BAAEAAgAFAPn/+v8BAAIAAAAEAPn/+f8CAAQA/v8BAPr/+v8CAAQA/P////v//P8CAAQA+//+//3//f8CAAUA+v/9//////8AAAQA+v/8////AAD//wIA+//8/wAAAQD+/wEA+//8/wAAAgD9/////P/9/wEAAgD8//7//f/9/wAAAgD8//3//v/+////AQD8//z/////////AAD8//3///8AAP7/AAD9//7///8AAP7////+//////8AAP7////+////////////////////",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD//////v8AAP///////wAAAAAAAP7/AQABAAAABwD///X/BQAjAPL/CQDb/9D/GAAb/7sAYwCW/z0BcP/X/7T/2QDW+wH8yANCCCUJ5QT++UXmhPwhA78FuAxH+p78ifudBlAG9vmu/lAK2fdlB///cfjoCa0E7Akn9Yb/zvba+AkAHPywBGEBFwUNAL8AXAAGA20DFvmR/kz+F/06Ag/+GwHl/5EEKgJd/q0AP/ym/9n6EfxY/2H+/QFtAC4C6QBDAaMCo/20/+3/3f/p/fL9rv9V/6cBhQHuAX4AcwJYAaH/IP/P/gsApP0LAe7/sQBuAI0AAgGDAE4BzACe/5X//v+v/+f+Zf+gAOv/5QBhAOIApAANASYAuP+h/8b/HQBr/9//bACWAGEAFAB5AD0AWQDU/+D/Yf/p//D/s/+R/4QAMQBvABEAkQBfABQAJgDW/wwA8/8XALz/vf8zAFAAKwD1/zEAPwDJ/x0A7/8LAOX/FwDR//H/EQAdAO//6P8QAFEA2f8WABEAMgDy/xIA+f/s/xAALgDv////HQAvAPT/+f8iAAYAEgAFABoAGgD//w0A+f/0/xsAHgDx/9f/GAACAPH/8f8JAPf/GwALABEA7/8cAPT/CgD2//j/BQD8/+3/OgAgAAYA9f8PAN7/DgD9/9r/1//3/+3/9//1//b/8//5//f/AgAJAOf/+v8OAAMACwD9/+7/5f8eAAEA9//q//7/8P8WAP7/+//4/wIA+f8TAAIA9f/5/wcA+P8iAAgA9v/n/xoA//8gAAUABwDj/wAA9v8BAAUAFQDn/wMA7v8QABAAEQDm/wwA8f8aAAAABwDu/wcACgASAAEA7//w//f/BgARAAkA6P/3/wcADgAKAAYA4f/4/wYADgAAAPr/8P/9/xQACgAHAPn/7//9/xEAAgD+//L/8v/8/xUAAwDw//H/9f8CAAsA/v/q//L/+f8FAAYA/P/r//j///8GAAkA+//o//j/AQAIAP//+v/o//v/CAAIAPv/+P/w/wEACQAHAPj/+f/0/wIACwAFAPb/+f/4/wQACwACAPP/+f/+/wYACAD///L/+/8BAAYABQD9//P//P8FAAUAAgD7//T//f8HAAQA///7//f///8IAAMA/P/6//r/AQAIAAEA+v/6//3/AgAHAAAA+f/7/wAAAwAFAP7/+P/8/wIAAgACAP3/+f/9/wMAAwAAAPz/+v/+/wQAAgD+//z/+/8AAAQAAQD8//z//f8BAAQAAAD7//3///8BAAMA///7//3/AAACAAEA/v/7//7/AQABAAAA/v/9////AQAAAP///v/+////AAD/////////////////////////////",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD////////+//////8AAAAA/v/+/wAAAQD8//3/CQAJAP3/+v8PAAcApABlABkBkwCO/i//lfqa/HQAcf/3BdkCzwJcBCMC0wMN/9/9wgI7AaECYfxV/Tf83vhn/xrt8Owx/8n7cgHABYb43QcZDh4WugNrA7P74gHu/9z/zv0t/acCiQHY/iv4qQOl/ysCE/0//XT9Sf4O//j9xfupAn394gHO+rsCXAFIAxQC9wIXBgcD2AQuAnb/9gJh/6wAVfxEAI4Bvf7oAFv/bALsAMQBe/88/joAT/4dAH39/v9LAXn/gwDI//QBdABcAA0A7f4lAMn///+9/tv/iABp/13/pP/dALv/w/8MAHv//f+y/6////7U/5AAZP+Z/8r/nQDR/5r/DwDr/xAA4v+s/3z/+P9uAOv/t/82AGcAHgCb/yQAFQBGAM7/CgD3/xoAegAaAOz/CgBHAA8Adv8/AAAABQC2/xIAAAA7ABQAKgCj/z4AAQAXAJz/JAADAAcA8f/1/2AAAQAlAPD/NgDx/1wA7v/4/wMAZADv//3/HQAkAFoA8P9FAPv/FgBIAPf/WQAHAEUACQD0/xIAQwDu/wMAwP9VALn/XwCw/yEA5f8sAPj/FgDD/1YAyv8rAOX/HQDo//j/IQAQACAAHwD9/yQAHQBAABgABQAiAAUAKAD3/wkACwAKAAMABwAJAPb/+f8GAOr/JQAHABMA6P8TAA4AGgD//woA8/8ZAP//GADu/w0A9v8SAAMABwD4/wQA5P8XAAQACgDq/wUA+/8VAAcACADs/xIAAAATAPH/+v/1//T/7f///+z/+v/y/+//9/8KAAcACgAJAPT/BAAKAAAABgAIAPL/9v8KAAMABAACAPr/9v8OAAIA+P/x//v/+f8MAPb/+P/w/wQA9f8MAPn////7/woA/v8PAAEAAgD1/xAAAQAPAP//AwD//xQABwALAAAABgADABAAAgAHAAAACAABAA8ABQAFAAMABwAEAA4ABwADAAEACQAFAAoAAwD//wAACQADAAUAAQD/////CAABAAMAAAD/////BwACAAEAAAD/////BwACAP7///8BAAAABgABAP7///8CAAAABAAAAP7///8DAAAAAwAAAP3///8DAAAAAQAAAP3//v8EAAAAAAD+//////8EAP/////+/wAA/v8EAP/////+/wEA/v8EAP///v/+/wIA//8DAP///v/+/wIA//8BAP///v/+/wMA//8BAP/////+/wMA//8AAP//AAD+/wQA//8AAP7/AQD//wIA////////AQD//wIA////////AQAAAAEAAAAAAP//AQD//wEAAAAAAP//AQAAAAEAAAAAAAAA",
"UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+/wAA+v8AAPz/AAD//wAA/f8AAAEAAAD+/wAACQAAAAQAAAAZAAAAtgAAAFsBAABW/gAAH/oAAGcBAABoBwAAlAAAAO3/AAARAQAA+wIAAEoEAACe/gAAiv4AALD0AADJ8wAAkQQAAF34AABi8QAAPQAAAAH2AAD19AAADAMAAJwGAACTEAAA0AwAAJkHAACOBwAAuQEAANcDAAC6AgAAHwUAAHEFAAB0AwAAbgEAADz+AADYAQAAGAAAAJwCAADgAAAA//0AAMn+AAAT/AAAwP8AAOn9AAAJAAAAewEAAOn+AACN/wAAOv0AAO3+AADN/gAAcP8AACj/AACq/gAA+f4AAML9AACa/wAA/f4AAN7/AABo/wAA6/4AAE//AAAC/wAAEQAAAHX/AAB0AAAA5f8AAEwAAAB3AAAA5/8AAMIAAABCAAAAzgAAAE8AAAB3AAAAKAAAADMAAACqAAAALwAAAK4AAAASAAAAVgAAACgAAAAtAAAATAAAAP3/AAA7AAAA2/8AACQAAADw/wAALQAAADEAAAAlAAAAbAAAADMAAABUAAAAEAAAACgAAAD1/wAA9v8AAPr/AADu/wAALgAAABIAAABUAAAARAAAAGUAAABGAAAAOAAAAGAAAAAuAAAARQAAACEAAAAfAAAAAAAAAAkAAAAQAAAAAwAAABIAAADs/wAAEAAAAAYAAAASAAAAIgAAABEAAAADAAAABAAAAA8AAAD4/wAAHQAAAAsAAAAIAAAADgAAAP//AAAcAAAADwAAAAYAAAASAAAAFwAAAAMAAAAYAAAAEgAAAPr/AAAQAAAADQAAAAoAAAD3/wAABgAAAPb/AADf/wAA/v8AAPL/AAD6/wAAFAAAAAQAAAAEAAAAGwAAAAEAAAAMAAAAIAAAAAIAAAAdAAAAGAAAAAIAAAAcAAAAEgAAAAcAAAAeAAAADwAAAAQAAAAeAAAABAAAAAYAAAAZAAAAAQAAAA4AAAATAAAA/v8AAAoAAAAOAAAA+/8AAAsAAAAJAAAA+f8AAAsAAAABAAAA+f8AAAoAAAD9/wAA+v8AAAcAAAD5/wAA+v8AAAUAAAD3/wAA/f8AAAQAAAD2/wAAAAAAAAEAAAD3/wAAAgAAAAAAAAD4/wAAAwAAAP7/AAD6/wAABAAAAP3/AAD8/wAABAAAAPv/AAD+/wAAAwAAAPv/AAD//wAAAQAAAPv/AAAAAAAAAAAAAPv/AAACAAAA//8AAPz/AAACAAAA/v8AAP3/AAACAAAA/f8AAP7/AAABAAAA/f8AAP//AAABAAAA/f8AAAAAAAAAAAAA/v8AAAEAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
];

module.exports = OmnitoneSOAHrirBase64;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Cross-browser support polyfill for Omnitone library.
 */




/**
 * Detects browser type and version.
 * @return {string[]} - An array contains the detected browser name and version.
 */
exports.getBrowserInfo = function() {
  const ua = navigator.userAgent;
  let M = ua.match(
      /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) ||
      [];
  let tem;

  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return {name: 'IE', version: (tem[1] || '')};
  }

  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR|Edge\/(\d+)/);
    if (tem != null) {
      return {name: 'Opera', version: tem[1]};
    }
  }

  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/([\d.]+)/i)) != null) {
    M.splice(1, 1, tem[1]);
  }

  let platform = ua.match(/android|ipad|iphone/i);
  if (!platform) {
    platform = ua.match(/cros|linux|mac os x|windows/i);
  }

  return {
    name: M[0],
    version: M[1],
    platform: platform ? platform[0] : 'unknown',
  };
};


/**
 * Patches AudioContext if the prefixed API is found.
 */
exports.patchSafari = function() {
  if (window.webkitAudioContext && window.webkitOfflineAudioContext) {
    window.AudioContext = window.webkitAudioContext;
    window.OfflineAudioContext = window.webkitOfflineAudioContext;
  }
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Omnitone version.
 */




/**
 * Omnitone library version
 * @type {String}
 */
module.exports = '1.0.6';


/***/ })
/******/ ]);
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file ResonanceAudio version.
 * @author Andrew Allen <bitllama@google.com>
 */




/**
 * ResonanceAudio library version
 * @type {String}
 */
module.exports = '0.0.4';


/***/ })
/******/ ]);
});

/**
 * An audio positioner that uses Google's Resonance Audio library
 **/
class GoogleResonanceAudioScene extends InterpolatedPosition {
    /**
     * Creates a new audio positioner that uses Google's Resonance Audio library
     * @param {AudioContext} audioContext
     */
    constructor(audioContext) {
        super();

        this.scene = new ResonanceAudio(audioContext, {
            ambisonicOrder: 3
        });
        this.scene.output.connect(audioContext.destination);

        this.position = new InterpolatedPosition();

        this.scene.setRoomProperties({
            width: 10,
            height: 5,
            depth: 10,
        }, {
            left: "transparent",
            right: "transparent",
            front: "transparent",
            back: "transparent",
            down: "grass",
            up: "transparent",
        });
    }

    /**
     * Updates the Resonance Audio scene with the latest position.
     * @protected
     * @param {number} t
     */
    update(t) {
        super.update(t);
        this.scene.setListenerPosition(this.x, 0, this.y);
    }
}

/**
 * A spatializer that uses Google's Resonance Audio library.
 **/
class GoogleResonanceAudioSpatializer extends BaseAnalyzedSpatializer {

    /**
     * Creates a new spatializer that uses Google's Resonance Audio library.
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {number} bufferSize
     */
    constructor(userID, destination, audio, bufferSize) {
        const position = new InterpolatedPosition();
        const resNode = destination.position.scene.createSource();

        super(userID, destination, audio, position, bufferSize, resNode.input);

        this.resNode = resNode;
    }

    /**
     * Sets parameters that alter spatialization.
     * @param {number} minDistance
     * @param {number} maxDistance
     * @param {number} rolloff
     * @param {number} transitionTime
     */
    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        super.setAudioProperties(minDistance, maxDistance, rolloff, transitionTime);
        this.resNode.setMinDistance(minDistance);
        this.resNode.setMaxDistance(maxDistance);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     **/
    update() {
        super.update();
        this.resNode.setPosition(this.position.x, 0, this.position.y);
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        this.resNode = null;
        super.dispose();
    }
}

/* global window, AudioListener, AudioContext, Event, EventTarget */

const contextDestroyingEvt = new Event("contextDestroying"),
    contextDestroyedEvt = new Event("contextDestroyed");

let hasWebAudioAPI = window.hasOwnProperty("AudioListener"),
    hasFullSpatializer = hasWebAudioAPI && window.hasOwnProperty("PannerNode"),
    isLatestWebAudioAPI = hasWebAudioAPI && AudioListener.prototype.hasOwnProperty("positionX"),
    forceInterpolatedPosition = true,
    attemptResonanceAPI = hasWebAudioAPI;

/**
 * A manager of the audio context and listener.
 **/
class Destination extends BaseAudioElement {

    /**
     * Creates a new manager of the audio context and listener
     **/
    constructor() {
        super(null);

        /** @type {AudioContext|MockAudioContext} */
        this.audioContext = null;
    }

    /**
     * If no audio context is currently available, creates one, and initializes the
     * spatialization of its listener.
     * 
     * If WebAudio isn't available, a mock audio context is created that provides
     * ersatz playback timing.
     **/
    createContext() {
        if (!this.audioContext) {
            try {
                if (hasWebAudioAPI) {
                    this.audioContext = new AudioContext();

                    try {
                        if (isLatestWebAudioAPI) {
                            try {
                                if (attemptResonanceAPI) {
                                    this.position = new GoogleResonanceAudioScene(this.audioContext);
                                }
                            }
                            catch (exp3) {
                                attemptResonanceAPI = false;
                                console.warn("Resonance Audio API not available!", exp3);
                            }
                            finally {
                                if (!attemptResonanceAPI) {
                                    this.position = new WebAudioNewListenerPosition(this.audioContext.listener, forceInterpolatedPosition);
                                }
                            }
                        }
                    }
                    catch (exp2) {
                        isLatestWebAudioAPI = false;
                        console.warn("No AudioListener.positionX property!", exp2);
                    }
                    finally {
                        if (!isLatestWebAudioAPI) {
                            this.position = new WebAudioOldListenerPosition(this.audioContext.listener);
                        }
                    }
                }
            }
            catch (exp1) {
                hasWebAudioAPI = false;
                console.warn("No WebAudio API!", exp1);
            }
            finally {
                if (!hasWebAudioAPI) {
                    this.audioContext = new MockAudioContext();
                    this.position = new InterpolatedPosition();
                }
            }
        }
    }

    /**
     * Gets the current playback time.
     * @type {number}
     */
    get currentTime() {
        return this.audioContext.currentTime;
    }


    /**
     * Creates a spatializer for an audio source, and initializes its audio properties.
     * @param {string} userID
     * @param {HTMLAudioElement} audio
     * @param {number} bufferSize
     * @return {BaseSpatializer}
     */
    createSpatializer(userID, audio, bufferSize) {
        const spatializer = this._createSpatializer(userID, audio, bufferSize);
        if (spatializer) {
            spatializer.setAudioProperties(this.minDistance, this.maxDistance, this.rolloff, this.transitionTime);
        }

        return spatializer;
    }

    /**
     * Creates a spatialzer for an audio source.
     * @private
     * @param {string} id - the user for which the audio source is being created.
     * @param {HTMLAudioElement} audio - the audio element that is being spatialized.
     * @param {number} bufferSize - the size of the analysis buffer to use for audio activity detection
     * @return {BaseSpatializer}
     */
    _createSpatializer(id, audio, bufferSize) {
        try {
            if (hasWebAudioAPI) {
                try {
                    if (hasFullSpatializer) {
                        try {
                            if (attemptResonanceAPI) {
                                return new GoogleResonanceAudioSpatializer(id, this, audio, bufferSize);
                            }
                        }
                        catch (exp3) {
                            attemptResonanceAPI = false;
                            console.warn("Resonance Audio API not available!", exp3);
                        }
                        finally {
                            if (!attemptResonanceAPI) {
                                return new FullSpatializer(id, this, audio, bufferSize, forceInterpolatedPosition);
                            }
                        }
                    }
                }
                catch (exp2) {
                    hasFullSpatializer = false;
                    console.warn("No 360 spatializer support", exp2);
                }
                finally {
                    if (!hasFullSpatializer) {
                        return new StereoSpatializer(id, this, audio, bufferSize);
                    }
                }
            }
        }
        catch (exp1) {
            hasWebAudioAPI = false;
            if (this.audioContext) {
                this.dispatchEvent(contextDestroyingEvt);
                this.audioContext.close();
                this.audioContext = null;
                this.position = null;
                this.dispatchEvent(contextDestroyedEvt);
            }
            console.warn("No WebAudio API!", exp1);
        }
        finally {
            if (!hasWebAudioAPI) {
                return new VolumeOnlySpatializer(id, this, audio);
            }
        }
    }
}

const BUFFER_SIZE = 1024,
    audioActivityEvt$1 = new AudioActivityEvent;

/**
 * A manager of audio sources, destinations, and their spatialization.
 **/
class AudioManager extends BaseAudioClient {

    /**
     * Creates a new manager of audio sources, destinations, and their spatialization.
     **/
    constructor() {
        super();

        /**
         * Forwards on the audioActivity of an audio source.
         * @param {AudioActivityEvent} evt
         * @fires AudioManager#audioActivity
         */
        this.onAudioActivity = (evt) => {
            audioActivityEvt$1.id = evt.id;
            audioActivityEvt$1.isActive = evt.isActive;
            this.dispatchEvent(audioActivityEvt$1);
        };

        /** @type {Map.<string, BaseSpatializer>} */
        this.sources = new Map();

        this.destination = new Destination();

        /** @type {Event[]} */
        const recreationQ = [];

        this.destination.addEventListener("contextDestroying", () => {
            for (let source of this.sources.values()) {
                source.removeEventListener("audioActivity", this.onAudioActivity);
                recreationQ.push({
                    id: source.id,
                    x: source.position.x,
                    y: source.position.y,
                    audio: source.audio
                });

                source.dispose();
            }

            this.sources.clear();
        });

        this.destination.addEventListener("contextDestroyed", () => {
            this.timer.stop();
            this.destination.createContext();

            for (let recreate of recreationQ) {
                const source = this.createSource(recreate.id, recreate.audio);
                source.setTarget(recreate.x, recreate.y);
            }

            arrayClear(recreationQ);
            this.timer.start();
        });

        this.timer = new RequestAnimationFrameTimer();
        this.timer.addEventListener("tick", () => {
            this.destination.update();
            for (let source of this.sources.values()) {
                source.update();
            }
        });

        Object.seal(this);
    }

    /** Perform the audio system initialization, after a user gesture */
    start() {
        this.destination.createContext();
        this.timer.start();
    }

    /**
     *
     * @param {string} userID
     * @param {HTMLAudioElement} audio
     * @return {BaseSpatializer}
     */
    createSource(userID, audio) {
        const source = this.destination.createSpatializer(userID, audio, BUFFER_SIZE);
        source.addEventListener("audioActivity", this.onAudioActivity);
        this.sources.set(userID, source);
        return source;
    }

    /**
     * Sets parameters that alter spatialization.
     * @param {number} minDistance
     * @param {number} maxDistance
     * @param {number} rolloff
     * @param {number} transitionTime
     */
    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        this.destination.setAudioProperties(minDistance, maxDistance, rolloff, transitionTime);
        for (let source of this.sources.values()) {
            source.setAudioProperties(minDistance, maxDistance, rolloff, transitionTime);
        }
    }

    /**
     * Set the audio device used to play audio to the local user.
     * @param {string} deviceID
     */
    setAudioOutputDevice(deviceID) {
        for (let source of this.sources.values()) {
            source.setAudioOutputDevice(deviceID);
        }
    }

    /**
     * Remove a user from audio processing.
     * @param {string} id - the id of the user to remove
     */
    removeSource(id) {
        if (this.sources.has(id)) {
            const source = this.sources.get(id);
            source.dispose();
            this.sources.delete(id);
        }
    }

    /**
     * Set the position of the listener.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     */
    setLocalPosition(x, y) {
        this.destination.setTarget(x, y);
    }

    /**
     * Set the position of an audio source.
     * @param {string} id - the id of the user for which to set the position.
     * @param {number} x - the horizontal component of the position.
     * @param {number} y - the vertical component of the position.
     */
    setUserPosition(id, x, y) {
        if (this.sources.has(id)) {
            const source = this.sources.get(id);
            source.setTarget(x, y);
        }
    }
}

/**
 * @typedef {object} JitsiTrack
 * @property {Function} getParticipantId
 * @property {Function} getType
 * @property {Function} isMuted
 * @property {Function} isLocal
 * @property {Function} addEventListener
 * @property {Function} dispose
 * @property {MediaStream} stream
 **/

/**
 * A paring of audio and video inputs for a user in the conference.
 **/
class MediaElements {
    /**
     * Creates a pairing of audio and video inputs for a user.
     * @param {JitsiTrack} audio
     * @param {JitsiTrack} video
     */
    constructor(audio = null, video = null) {
        this.audio = audio;
        this.video = video;
    }
}

/** @type {Map<string, MediaElements>} */
const userInputs = new Map();

const audioActivityEvt$2 = new AudioActivityEvent();


function logger(source, evtName) {
    const handler = (...rest) => {
        if (evtName === "conference.endpoint_message_received"
            && rest.length >= 2
            && (rest[1].type === "e2e-ping-request"
                || rest[1].type === "e2e-ping-response"
                || rest[1].type === "stats")) {
            return;
        }
        console.log(evtName, ...rest);
    };

    if (window.location.hostname === "localhost") {
        source.addEventListener(evtName, handler);
    }
}

function setLoggers(source, evtObj) {
    for (let evtName of Object.values(evtObj)) {
        if (evtName.indexOf("audioLevelsChanged") === -1) {
            logger(source, evtName);
        }
    }
}

// Manages communication between Jitsi Meet and Calla
class LibJitsiMeetClient extends BaseJitsiClient {

    constructor() {
        super();
        this.connection = null;
        this.conference = null;
        this.audioClient = new AudioManager();
        this.audioClient.addEventListener("audioActivity", (evt) => {
            audioActivityEvt$2.set(evt.id, evt.isActive);
            this.dispatchEvent(audioActivityEvt$2);
        });

        Object.seal(this);
    }

    async initializeAsync(host, roomName, userName) {
        await import(`${window.location.origin}/lib/jquery.min.js`);
        await import(`https://${host}/libs/lib-jitsi-meet.min.js`);

        roomName = roomName.toLocaleLowerCase();

        JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
        JitsiMeetJS.init();

        this.connection = new JitsiMeetJS.JitsiConnection(null, null, {
            hosts: {
                domain: JVB_HOST,
                muc: JVB_MUC
            },
            serviceUrl: `https://${host}/http-bind`,
            enableLipSync: true
        });

        const {
            CONNECTION_ESTABLISHED,
            CONNECTION_FAILED,
            CONNECTION_DISCONNECTED
        } = JitsiMeetJS.events.connection;

        setLoggers(this.connection, JitsiMeetJS.events.connection);

        const onConnect = (connectionID) => {
            this.conference = this.connection.initJitsiConference(roomName, {
                openBridgeChannel: true
            });

            const {
                TRACK_ADDED,
                TRACK_REMOVED,
                CONFERENCE_JOINED,
                CONFERENCE_LEFT,
                USER_JOINED,
                USER_LEFT,
                DISPLAY_NAME_CHANGED,
                ENDPOINT_MESSAGE_RECEIVED
            } = JitsiMeetJS.events.conference;

            setLoggers(this.conference, JitsiMeetJS.events.conference);

            this.conference.addEventListener(CONFERENCE_JOINED, async () => {
                const id = this.conference.myUserId();

                this.dispatchEvent(Object.assign(
                    new Event("videoConferenceJoined"), {
                    id,
                    roomName,
                    displayName: userName
                }));
            });

            this.conference.addEventListener(CONFERENCE_LEFT, () => {
                this.dispatchEvent(Object.assign(
                    new Event("videoConferenceLeft"), {
                    roomName
                }));
            });

            const onTrackMuteChanged = (track, muted) => {
                const userID = track.getParticipantId() || this.localUser,
                    trackKind = track.getType(),
                    muteChangedEvtName = trackKind + "MuteStatusChanged",
                    evt = Object.assign(
                        new Event(muteChangedEvtName), {
                        id: userID,
                        muted
                    });

                this.dispatchEvent(evt);
            },

                onTrackChanged = (track) => {
                    onTrackMuteChanged(track, track.isMuted());
                };

            this.conference.addEventListener(USER_JOINED, (id, user) => {
                const evt = Object.assign(
                    new Event("participantJoined"), {
                    id,
                    displayName: user.getDisplayName()
                });
                this.dispatchEvent(evt);
            });

            this.conference.addEventListener(USER_LEFT, (id) => {
                const evt = Object.assign(
                    new Event("participantLeft"), {
                    id
                });

                this.dispatchEvent(evt);
            });

            this.conference.addEventListener(DISPLAY_NAME_CHANGED, (id, displayName) => {
                const evt = Object.assign(
                    new Event("displayNameChange"), {
                    id,
                    displayName
                });

                this.dispatchEvent(evt);
            });

            this.conference.addEventListener(TRACK_ADDED, (track) => {
                const userID = track.getParticipantId() || this.localUser,
                    isLocal = track.isLocal(),
                    trackKind = track.getType(),
                    trackType = trackKind.firstLetterToUpper();

                setLoggers(track, JitsiMeetJS.events.track);

                track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, onTrackChanged);

                const elem = tag(trackType,
                    autoPlay(!isLocal),
                    muted(isLocal),
                    srcObject(track.stream));

                if (!userInputs.has(userID)) {
                    userInputs.set(userID, new MediaElements());
                }

                const inputs = userInputs.get(userID),
                    hasCurrentTrack = !!inputs[trackKind];
                if (hasCurrentTrack) {
                    inputs[trackKind].dispose();
                }

                inputs[trackKind] = track;

                if (!isLocal && trackKind === "audio") {
                    this.audioClient.createSource(userID, elem);
                }

                this.dispatchEvent(Object.assign(new Event(trackKind + "Added"), {
                    id: userID,
                    element: elem
                }));

                onTrackMuteChanged(track, false);
            });

            this.conference.addEventListener(TRACK_REMOVED, (track) => {

                const userID = track.getParticipantId() || this.localUser,
                    isLocal = track.isLocal(),
                    trackKind = track.getType();

                if (userInputs.has(userID)) {
                    const inputs = userInputs.get(userID);
                    if (inputs[trackKind] === track) {
                        inputs[trackKind] = null;
                    }
                }

                if (!isLocal && trackKind === "audio") {
                    this.audioClient.removeSource(userID);
                }

                track.dispose();

                onTrackMuteChanged(track, true);

                this.dispatchEvent(Object.assign(new Event(trackKind + "Removed"), {
                    id: userID
                }));
            });

            this.conference.addEventListener(ENDPOINT_MESSAGE_RECEIVED, (user, data) => {
                this.rxGameData({ user, data });
            });

            this.conference.join();
        };

        const onFailed = (evt) => {
            console.error("Connection failed", evt);
            onDisconnect();
        };

        const onDisconnect = () => {
            this.connection.removeEventListener(CONNECTION_ESTABLISHED, onConnect);
            this.connection.removeEventListener(CONNECTION_FAILED, onFailed);
            this.connection.removeEventListener(CONNECTION_DISCONNECTED, onDisconnect);
        };

        this.connection.addEventListener(CONNECTION_ESTABLISHED, onConnect);
        this.connection.addEventListener(CONNECTION_FAILED, onFailed);
        this.connection.addEventListener(CONNECTION_DISCONNECTED, onDisconnect);

        setLoggers(JitsiMeetJS.mediaDevices, JitsiMeetJS.events.mediaDevices);

        this.connection.connect();
    }

    txGameData(toUserID, data) {
        this.conference.sendMessage(data, toUserID);
    }

    /// A listener to add to JitsiExternalAPI::endpointTextMessageReceived event
    /// to receive Calla messages from the Jitsi Meet data channel.
    rxGameData(evt) {
        if (evt.data.hax === APP_FINGERPRINT) {
            this.receiveMessageFrom(evt.user.getId(), evt.data.command, evt.data.value);
        }
    }

    leave() {
        if (this.conference) {
            if (this.localUser !== null && userInputs.has(this.localUser)) {
                const inputs = userInputs.get(this.localUser);
                if (inputs.audio) {
                    this.conference.removeTrack(inputs.audio);
                }

                if (inputs.video) {
                    this.conference.removeTrack(inputs.video);
                }
            }

            const leaveTask = this.conference.leave();
            leaveTask
                .then(() => this.connection.disconnect());
            return leaveTask;
        }
    }

    async getCurrentAudioOutputDeviceAsync() {
        if (!canChangeAudioOutput) {
            return null;
        }
        const deviceId = JitsiMeetJS.mediaDevices.getAudioOutputDevice(),
            devices = await this.getAudioOutputDevicesAsync(),
            device = devices.filter((d) => d.deviceId === deviceId);
        if (device.length === 0) {
            return null;
        }
        else {
            return device[0];
        }
    }

    async setAudioOutputDeviceAsync(device) {
        if (!canChangeAudioOutput) {
            return;
        }
        const id = device && device.deviceId || null;
        this.audioClient.setAudioOutputDevice(id);
        await JitsiMeetJS.mediaDevices.setAudioOutputDevice(id);
    }

    getCurrentMediaTrack(type) {
        return this.localUser !== null
            && userInputs.has(this.localUser)
            && userInputs.get(this.localUser)[type]
            || null;
    }

    async getCurrentAudioInputDeviceAsync() {
        const cur = this.getCurrentMediaTrack("audio"),
            devices = await this.getAudioInputDevicesAsync(),
            device = devices.filter((d) => cur !== null && d.deviceId === cur.deviceId);
        if (device.length === 0) {
            return null;
        }
        else {
            return device[0];
        }
    }

    taskOf(evt) {
        return this.when(evt, (evt) => evt.id === this.localUser, 5000);
    }

    async toggleAudioMutedAsync() {
        const changeTask = this.taskOf("audioMuteStatusChanged");
        const cur = this.getCurrentMediaTrack("audio");
        if (cur) {
            const muted = cur.isMuted();
            if (muted) {
                await cur.unmute();
            }
            else {
                await cur.mute();
            }
        }
        else {
            await this.setPreferredAudioInputAsync();
        }

        const evt = await changeTask;
        return evt.muted;
    }

    async toggleVideoMutedAsync() {
        const changeTask = this.taskOf("videoMuteStatusChanged");
        const cur = this.getCurrentMediaTrack("video");
        if (cur) {
            await this.setVideoInputDeviceAsync(null);
        }
        else {
            await this.setPreferredVideoInputAsync();
        }

        const evt = await changeTask;
        return evt.muted;
    }

    async setAudioInputDeviceAsync(device) {
        const cur = this.getCurrentMediaTrack("audio");
        if (cur) {
            const removeTask = this.taskOf("audioRemoved");
            this.conference.removeTrack(cur);
            await removeTask;
        }

        if (device) {
            const addTask = this.taskOf("audioAdded");
            const tracks = await JitsiMeetJS.createLocalTracks({
                devices: ["audio"],
                micDeviceId: device.deviceId
            });

            for (let track of tracks) {
                this.conference.addTrack(track);
            }

            await addTask;
        }
    }

    async getCurrentVideoInputDeviceAsync() {
        const cur = this.getCurrentMediaTrack("video"),
            devices = await this.getVideoInputDevicesAsync(),
            device = devices.filter((d) => cur !== null && d.deviceId === cur.deviceId);
        if (device.length === 0) {
            return null;
        }
        else {
            return device[0];
        }
    }

    async setVideoInputDeviceAsync(device) {
        const cur = this.getCurrentMediaTrack("video");
        if (cur) {
            const removeTask = this.taskOf("videoRemoved");
            this.conference.removeTrack(cur);
            await removeTask;
        }

        if (device) {
            const addTask = this.taskOf("videoAdded");
            const tracks = await JitsiMeetJS.createLocalTracks({
                devices: ["video"],
                cameraDeviceId: device.deviceId
            });

            for (let track of tracks) {
                this.conference.addTrack(track);
            }

            await addTask;
        }
    }

    setDisplayName(userName) {
        this.conference.setDisplayName(userName);
    }

    isMediaMuted(type) {
        const cur = this.getCurrentMediaTrack(type);
        return cur === null
            || cur.isMuted();
    }

    get isAudioMuted() {
        return this.isMediaMuted("audio");
    }

    get isVideoMuted() {
        return this.isMediaMuted("video");
    }

    startAudio() {
        this.audioClient.start();
    }

    userIDs() {
        return Object.keys(this.conference.participants);
    }

    userExists(id) {
        return !!this.conference.participants[id];
    }

    users() {
        return Object.keys(this.conference.participants)
            .map(k => [k, this.conference.participants[k].getDisplayName()]);
    }
}

/* global JITSI_HOST */
init(JITSI_HOST, new LibJitsiMeetClient());
