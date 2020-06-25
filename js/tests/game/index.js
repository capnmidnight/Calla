// Creates a mock interface for the Jitsi Meet client, to
// be able to test the UI without having to connect to a
// meeting.

import "../../src/audio/externalAPIServer.js"
import { MockUser } from "./mockuser.js";
import { MockJitsiClient as JitsiClient } from "./jitsihax-client-mock.js";
import { init } from "../../src/app.js";

(async function () {
    const response = await fetch("../../index.html"),
        html = await response.text(),
        parser = new DOMParser(),
        doc = parser.parseFromString(html, "text/html");
    document.head.append(...doc.head.childNodes);
    document.body.append(...doc.body.childNodes);

    const loginContent = document.querySelector("#login > .content")
    loginContent.parentElement.removeChild(loginContent);

    const { game, loginForm, jitsiClient } = init("jitsi.calla.chat", JitsiClient),
        testUsers = [
            new MockUser("user1", -5, -5, jitsiClient),
            new MockUser("user2", -5, 5, jitsiClient),
            new MockUser("user3", 5, -5, jitsiClient),
            new MockUser("user4", 5, 5, jitsiClient),
            new MockUser("user5", 0, 0, jitsiClient)
        ];

    jitsiClient.testUsers = testUsers.slice();

    game.addEventListener("gamestarted", function createTestUser() {
        if (testUsers.length > 0) {
            testUsers.shift().start();
            setTimeout(createTestUser, 1000);
        }
    });

    loginForm.userNameInput.value = "Sean";
    loginForm.userNameInput.dispatchEvent(new Event("input"));
    loginForm.connectButton.click();
})();
