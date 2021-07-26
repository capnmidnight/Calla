import { waitFor } from "./waitFor";
import { onUserGesture } from "./onUserGesture";


export async function whenAudioContextReady(ctx: AudioContext): Promise<void> {
    const task = waitFor(() => ctx.state === "running");
    if (ctx.state === "suspended") {
        onUserGesture(() => ctx.resume());
    }
    else if (ctx.state === "closed") {
        await ctx.resume();
    }
    await task;
}
