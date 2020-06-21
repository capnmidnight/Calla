// Creates a mock interface for the Jitsi Meet client, to
// be able to test the UI without having to connect to a
// meeting.

import "../../etc/jitsihax.js";
import { MockUser } from "./mockuser.js";
import { MockJitsiClient } from "./jitsihax-client-mock.js";
import { init } from "../../src/app.js";

(async function () {
    const response = await fetch("../../index.html"),
        html = await response.text(),
        parser = new DOMParser(),
        doc = parser.parseFromString(html, "text/html");
    document.head.append(...doc.head.childNodes);
    document.body.append(...doc.body.childNodes);

    const { game } = init(MockJitsiClient, document.querySelector("#appView")),
        testUsers = [
            new MockUser("user1", -5, -5),
            new MockUser("user2", -5, 5),
            new MockUser("user3", 5, -5),
            new MockUser("user4", 5, 5),
            new MockUser("user5", 0, 0)
        ];

    game.addEventListener("gamestarted", function createTestUser() {
        if (testUsers.length > 0) {
            testUsers.shift().start();
            setTimeout(createTestUser, 1000);
        }
    });
})();
