/**
 * The test instance value that the current window has loaded. This is
 * figured out either from a number in the query string parameter "testUserNumber", 
 * or the default value of 1. 
 **/
export const userNumber = (function () {
    const loc = new URL(document.location.href);
    if (loc.searchParams.has("testUserNumber")) {
        return parseFloat(loc.searchParams.get("testUserNumber"));
    }
    else {
        return 1;
    }
})();