import { onUserGesture } from "./onUserGesture";
export async function whenAudioContextReady(ctx) {
    const task = new Promise((resolve) => {
        if (ctx.state === "running") {
            resolve();
        }
        else {
            const onStateChange = () => {
                if (ctx.state === "running") {
                    resolve();
                    ctx.removeEventListener("statechange", onStateChange);
                }
            };
            ctx.addEventListener("statechange", onStateChange);
        }
    });
    if (ctx.state === "suspended") {
        onUserGesture(() => ctx.resume());
    }
    else if (ctx.state === "closed") {
        await ctx.resume();
    }
    await task;
}
//# sourceMappingURL=whenAudioContextReady.js.map