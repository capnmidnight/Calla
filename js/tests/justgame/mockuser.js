import { allIcons as icons } from "../../src/emoji.js";
import { Audio, Span } from "../../src/html.js";

export class MockUser {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.audio = null;
    }

    schedule() {
        this.timeout = setTimeout(
            () => this.update(),
            1000 * (1 + Math.random()));
    }

    start() {
        const evt = Object.assign(
            new Event("participantJoined"),
            { id: this.id });

        jitsiClient.api.dispatchEvent(evt);

        document.body.appendChild(Span({ id: `participant_${this.id}` },
            this.audio = Audio({
                autoplay: "autoplay",
                loop: "loop",
                src: `/test-audio/${this.id}.mp3`
            })));

        this.schedule();
    }

    stop() {
        clearTimeout(this.timeout);
        if (!!this.audio) {
            this.audio.pause();
            document.body.removeChild(this.audio.parentElement);
        }
    }

    update() {
        const x = this.x + Math.floor(2 * Math.random() - 1),
            y = this.y + Math.floor(2 * Math.random() - 1);

        jitsiClient.mockRxGameData("moveTo", this.id, { command: "moveTo", x, y });

        if (Math.random() <= 0.1) {
            const groups = Object.values(icons),
                group = groups.random(),
                emoji = group.random();
            jitsiClient.mockRxGameData("emote", this.id, emoji);
        }

        this.schedule();
    }
}