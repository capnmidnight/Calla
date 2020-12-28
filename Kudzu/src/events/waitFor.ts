export function waitFor(test: () => boolean): Promise<void> {
    return new Promise((resolve: () => void) => {
        const handle = setInterval(() => {
            if (test()) {
                clearInterval(handle);
                resolve();
            }
        }, 100);
    });
}
