import { allIcons as icons, randomPerson } from "../../src/emoji.js";
import { autoPlay, id, loop, src } from "../../src/html/attrs.js";
import { Audio, Span } from "../../src/html/tags.js";

export class MockUser {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.audio = null;
        this.displayName = id;
        this.avatarEmoji = randomPerson().value;
    }

    schedule() {
        this.timeout = setTimeout(
            () => this.update(),
            1000 * (1 + Math.random()));
    }

    start() {
        const evt = Object.assign(
            new Event("participantJoined"),
            {
                id: this.id,
                displayName: this.displayName
            });

        document.body.appendChild(Span(id(`participant_${this.id}`),
            this.audio = Audio(
                src(`/test-audio/${this.id}.mp3`),
                autoPlay,
                loop
            )));

        jitsiClient.dispatchEvent(evt);

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

        jitsiClient.sendMessageTo(jitsiClient.localUser, {
            command: "userMoved",
            value: { id: this.id, x, y }
        });

        if (Math.random() <= 0.1) {
            const groups = Object.values(icons),
                group = groups.random(),
                emoji = group.random();
            jitsiClient.sendMessageTo(jitsiClient.localUser, {
                command: "emote",
                id: this.id,
                value: emoji
            });
        }

        this.schedule();
    }
}