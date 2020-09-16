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

/**
 * @callback onUserGestureTestCallback
 * @returns {boolean}
 */

/**
 * This is not an event handler that you can add to an element. It's a global event that
 * waits for the user to perform some sort of interaction with the website.
 * @param {Function} callback
 * @param {onUserGestureTestCallback} test
  */
export function onUserGesture(callback, test) {
    test = test || (() => true);
    const check = async (evt) => {
        let testResult = test();
        if (testResult instanceof Promise) {
            testResult = await testResult;
        }

        if (evt.isTrusted && testResult) {
            for (let gesture of gestures) {
                window.removeEventListener(gesture, check);
            }

            const result = callback();
            if (result instanceof Promise) {
                await result;
            }
        }
    }

    for (let gesture of gestures) {
        window.addEventListener(gesture, check);
    }
}