import { isNullOrUndefined } from "../typeChecks";
function getTestNumber() {
    if ("location" in globalThis) {
        const loc = new URL(globalThis.location.href);
        const testNumber = loc.searchParams.get("testUserNumber");
        return testNumber;
    }
    else {
        return null;
    }
}
export function hasUserNumber() {
    const testNumber = getTestNumber();
    return !isNullOrUndefined(testNumber);
}
/**
 * The test instance value that the current window has loaded. This is
 * figured out either from a number in the query string parameter "testUserNumber",
 * or the default value of 1.
 **/
export function getUserNumber() {
    const testNumber = getTestNumber();
    return !isNullOrUndefined(testNumber)
        ? parseInt(testNumber, 10)
        : 1;
}
//# sourceMappingURL=userNumber.js.map