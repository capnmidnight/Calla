export function waitFor(test) {
    return new Promise((resolve) => {
        const handle = setInterval(() => {
            if (test()) {
                clearInterval(handle);
                resolve();
            }
        }, 100);
    });
}
//# sourceMappingURL=waitFor.js.map