import {
    keyTypes,
    normalizeKeyValue
} from "./keys";

const gesture = Object.seal({
    type: "",
    text: "",
    command: ""
});

// Translates operating system-specific Browser KeyboardEvents into a
// cross-platform Gesture that can then be dispatched to a CommandPack
// for translation to an EditorCommand.
class OperatingSystem {
    makeCommand: (evt: KeyboardEvent) => { type: string; text: string; command: string; };

    constructor(
        public readonly name: string,
        pre1: string,
        pre2: string,
        redo: string,
        pre3: string,
        home: string,
        end: string,
        pre5: string,
        fullHome: string,
        fullEnd: string) {

        const pre4 = pre3;
        if (pre3.length === 0) {
            pre3 = "Normal";
        }

        const substitutions = Object.freeze(new Map([
            ["Normal_ArrowDown", "CursorDown"],
            ["Normal_ArrowLeft", "CursorLeft"],
            ["Normal_ArrowRight", "CursorRight"],
            ["Normal_ArrowUp", "CursorUp"],
            ["Normal_PageDown", "CursorPageDown"],
            ["Normal_PageUp", "CursorPageUp"],
            [`${pre2}_ArrowLeft`, "CursorSkipLeft"],
            [`${pre2}_ArrowRight`, "CursorSkipRight"],
            [`${pre3}_${home}`, "CursorHome"],
            [`${pre3}_${end}`, "CursorEnd"],
            [`${pre5}_${fullHome}`, "CursorFullHome"],
            [`${pre5}_${fullEnd}`, "CursorFullEnd"],


            ["Shift_ArrowDown", "SelectDown"],
            ["Shift_ArrowLeft", "SelectLeft"],
            ["Shift_ArrowRight", "SelectRight"],
            ["Shift_ArrowUp", "SelectUp"],
            ["Shift_PageDown", "SelectPageDown"],
            ["Shift_PageUp", "SelectPageUp"],
            [`${pre2}Shift_ArrowLeft`, "SelectSkipLeft"],
            [`${pre2}Shift_ArrowRight`, "SelectSkipRight"],
            [`${pre4}Shift_${home}`, "SelectHome"],
            [`${pre4}Shift_${end}`, "SelectEnd"],
            [`${pre5}Shift_${fullHome}`, "SelectFullHome"],
            [`${pre5}Shift_${fullEnd}`, "SelectFullEnd"],

            [`${pre1}_a`, "SelectAll"],

            [`${pre1}_ArrowDown`, "ScrollDown"],
            [`${pre1}_ArrowUp`, "ScrollUp"],

            ["Normal_Backspace", "DeleteLetterLeft"],
            ["Normal_Delete", "DeleteLetterRight"],
            [`${pre2}_Backspace`, "DeleteWordLeft"],
            [`${pre2}_Delete`, "DeleteWordRight"],
            [`Shift_Delete`, "DeleteLine"],

            ["Normal_Enter", "AppendNewline"],
            [`${pre2}_Enter`, "PrependNewline"],

            ["Normal_Tab", "InsertTab"],
            ["Shift_Tab", "RemoveTab"],

            [`${pre1}_z`, "Undo"],
            [redo, "Redo"]
        ]));

        this.makeCommand = (evt) => {
            gesture.text = normalizeKeyValue(evt);

            gesture.type = keyTypes.has(gesture.text)
                ? keyTypes.get(gesture.text)
                : "printable";

            gesture.command = "";

            if (evt.ctrlKey
                || evt.altKey
                || evt.metaKey) {
                if (gesture.type === "printable"
                    || gesture.type === "whitespace") {
                    gesture.type = "special";
                }

                if (evt.ctrlKey) {
                    gesture.command += "Control";
                }

                if (evt.altKey) {
                    gesture.command += "Alt";
                }

                if (evt.metaKey) {
                    gesture.command += "Meta";
                }
            }

            if (evt.shiftKey) {
                gesture.command += "Shift";
            }

            if (gesture.command === "") {
                gesture.command += "Normal";
            }

            gesture.command += "_" + gesture.text;

            if (substitutions.has(gesture.command)) {
                gesture.command = substitutions.get(gesture.command);
            }

            if (gesture.command === "PrependNewline") {
                gesture.type = "whitespace";
            }

            return gesture;
        }

        Object.freeze(this);
    }
};

export const Windows = new OperatingSystem(
    "Windows",
    "Control", "Control",
    "Control_y",
    "", "Home", "End",
    "Control", "Home", "End");

export const MacOS = new OperatingSystem(
    "macOS",
    "Meta", "Alt",
    "MetaShift_z",
    "Meta", "ArrowLeft", "ArrowRight",
    "Meta", "ArrowUp", "ArrowDown");