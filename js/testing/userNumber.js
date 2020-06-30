export const userNumber = (function () {
    const loc = new URL(document.location.href);
    if (loc.searchParams.has("testUserNumber")) {
        return parseFloat(loc.searchParams.get("testUserNumber"));
    }
    else {
        return 1;
    }
})();