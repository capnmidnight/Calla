// Creates a mock interface for the Jitsi Meet client, to
// be able to test the UI without having to connect to a
// meeting.

import { MockUser } from "./mockuser.js";
import { MockJitsiClient as JitsiClient } from "./jitsihax-client-mock.js";
import { init } from "../../src/init.js";
import { Img } from "../../src/html/tags.js";
import { src, style } from "../../src/html/attrs.js";

(async function () {
    const response = await fetch("../../index.html"),
        html = await response.text(),
        parser = new DOMParser(),
        doc = parser.parseFromString(html, "text/html");
    document.head.append(...doc.head.childNodes);
    document.body.append(...doc.body.childNodes);

    const loginContent = document.querySelector("#login > .content")
    loginContent.parentElement.removeChild(loginContent);

    const components = init("jitsi.calla.chat", JitsiClient);
    const { game, login, client, toolbar } = components;
    Object.assign(window, components);

    let testUsers = null,
        spawnUserTimer = null;

    client.element.append(
        Img(
            src("../../screenshot.png"),
            style({
                width: "100%"
            })));

    game.addEventListener("gamestarted", () => {
        testUsers = makeUsers();
        client.testUsers = testUsers.slice();
        spawnUserTimer = setTimeout(spawnUsers, 0);
    });

    toolbar.addEventListener("leave", () => {
        clearTimeout(spawnUserTimer);
        for (let testUser of client.testUsers) {
            testUser.stop();
        }
    });

    login.userNameInput.value = "Sean";
    login.userNameInput.dispatchEvent(new Event("input"));
    login.connectButton.click();

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
