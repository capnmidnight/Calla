// Creates a mock interface for the Jitsi Meet client, to
// be able to test the UI without having to connect to a
// meeting.

import "../../package/src/protos.js";
import { Game } from "../../package/src/game.js";
import { AppGui } from "../../package/src/appgui.js";
import "../../etc/jitsihax.js";
import { MockJitsiClient } from "./mockjitsiclient.js";
import { MockJitsiMeetExternalAPI } from "./mockjitsimeetexternalapi.js";
import { MockUser } from "./mockuser.js";

const jitsiClient = new MockJitsiClient(MockJitsiMeetExternalAPI, document.querySelector("#jitsi")),
    game = new Game(jitsiClient),
    gui = new AppGui(game, jitsiClient),
    testUsers = [
        new MockUser("user1", -5, -5),
        new MockUser("user2", -5, 5),
        new MockUser("user3", 5, -5),
        new MockUser("user4", 5, 5),
        new MockUser("user5", 0, 0)
    ];

Object.assign(window, {
    jitsiClient,
    game,
    gui
});

game.addEventListener("gamestarted", function createTestUser() {
    if (game.userList.length < 5) {
        const idx = game.userList.length - 1,
            user = testUsers[idx];
        user.start();
        setTimeout(createTestUser, 1000);
    }
});