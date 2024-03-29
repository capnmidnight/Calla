import { isNullOrUndefined } from "../typeChecks";

const gestures = [
    "change",
    "click",
    "contextmenu",
    "dblclick",
    "mouseup",
    "pointerup",
    "reset",
    "submit",
    "touchend"
];

function identityPromise(): Promise<boolean> {
    return Promise.resolve(true);
}

/**
 * This is not an event handler that you can add to an element. It's a global event that
 * waits for the user to perform some sort of interaction with the website.
  */
export function onUserGesture(callback: () => any, test?: () => Promise<boolean>) {
    const realTest = isNullOrUndefined(test)
        ? identityPromise
        : test;

    const check = async (evt: Event) => {
        if (evt.isTrusted && await realTest()) {
            for (const gesture of gestures) {
                window.removeEventListener(gesture, check);
            }

            await callback();
        }
    };

    for (const gesture of gestures) {
        window.addEventListener(gesture, check);
    }
}

