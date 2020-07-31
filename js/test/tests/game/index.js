// Creates a mock interface for the Jitsi Meet client, to
// be able to test the UI without having to connect to a
// meeting.

import { autoPlay, href, srcObject } from "../../../src/html/attrs.js";
import { Base, Video } from "../../../src/html/tags.js";
import { init } from "../../../src/init.js";
import { MockJitsiClient as JitsiClient } from "./MockJitsiClient.js";
import { MockUser } from "./MockUser.js";

(async function () {
    const response = await fetch("../../index.html"),
        html = await response.text(),
        parser = new DOMParser(),
        doc = parser.parseFromString(html, "text/html");
    doc.head.insertBefore(Base(href("../../")), doc.head.children[0]);
    document.head.append(...doc.head.childNodes);
    document.body.append(...doc.body.childNodes);

    const loginContent = document.querySelector("#login > .content")
    loginContent.parentElement.removeChild(loginContent);

    const components = init(new JitsiClient());
    const { game, login, client, headbar } = components;
    Object.assign(window, components);

    let testUsers = null,
        spawnUserTimer = null;

    game.addEventListener("gameStarted", async () => {
        testUsers = makeUsers();
        client.testUsers = testUsers.slice();
        spawnUserTimer = setTimeout(spawnUsers, 0);

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = Video(
            autoPlay,
            srcObject(stream));
        game.me.setAvatarVideo(video);
    });

    headbar.addEventListener("leave", () => {
        clearTimeout(spawnUserTimer);
        for (let testUser of client.testUsers) {
            testUser.stop();
        }
    });

    login.userName = "Sean";

    function spawnUsers() {
        if (testUsers.length > 0) {
            testUsers.shift().start();
            spawnUserTimer = setTimeout(spawnUsers, 1000);
        }
    }

    function makeUsers() {
        return [
            new MockUser("user1", -5, -5, client),
            new MockUser("user2", -5, 5, client),
            new MockUser("user3", 5, -5, client),
            new MockUser("user4", 5, 5, client),
            new MockUser("user5", 0, 0, client)
        ]
    }
})();
