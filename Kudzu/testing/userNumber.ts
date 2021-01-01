import { isNullOrUndefined } from "../typeChecks";

const loc = new URL(document.location.href);
const testNumber = loc.searchParams.get("testUserNumber");
export const hasUserNumber = !isNullOrUndefined(testNumber);

/**
 * The test instance value that the current window has loaded. This is
 * figured out either from a number in the query string parameter "testUserNumber", 
 * or the default value of 1. 
 **/
export const userNumber = !isNullOrUndefined(testNumber)
    ? parseInt(testNumber, 10)
    : 1;