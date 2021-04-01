export const documentReady = (document.readyState === "complete"
    ? Promise.resolve("already")
    : new Promise((resolve) => {
        document.addEventListener("readystatechange", () => {
            if (document.readyState === "complete") {
                resolve("had to wait for it");
            }
        }, false);
    }));
//# sourceMappingURL=documentReady.js.map