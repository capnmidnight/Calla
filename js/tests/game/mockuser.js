import { allIcons as icons, randomPerson } from "../../src/emoji.js";
import { autoPlay, id, loop, src } from "../../src/html/attrs.js";
import { Audio, Span } from "../../src/html/tags.js";

export class MockUser {
    constructor(id, x, y, client) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.client = client;
        this.audio = null;
        this.displayName = id;
        this._avatarEmoji = randomPerson();
        this.emoteEvt = { id, value: null, desc: null };
    }

    get avatarEmoji() {
        return this._avatarEmoji;
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

        this.client.dispatchEvent(evt);

        this.schedule();
    }

    stop() {
        clearTimeout(this.timeout);
        if (!!this.audio) {
            document.body.removeChild(this.audio.parentElement);

            this.client.dispatchEvent(Object.assign(new Event("participantLeft"), {
                id: this.id
            }));
        }
    }

    update() {
        const x = this.x + Math.floor(2 * Math.random() - 1),
            y = this.y + Math.floor(2 * Math.random() - 1);

        this.client.sendMessageTo(this.client.localUser, {
            command: "userMoved",
            value: { id: this.id, x, y }
        });

        if (Math.random() <= 0.1) {
            const groups = Object.values(icons),
                group = groups.random(),
                emoji = group.random();
            Object.assign(this.emoteEvt, emoji);
            this.client.sendMessageTo(this.client.localUser, {
                command: "emote",
                value: this.emoteEvt
            });
        }

        this.schedule();
    }
}