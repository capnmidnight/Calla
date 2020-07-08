import "../../src/protos.js";
import { HtmlTestOutput as TestOutput } from "../../testing/HtmlTestOutput.js";
import { JitsiClient1_Tests } from "./mainTest.js";
import { JitsiClient2_Tests } from "./secondaryTest.js";
import { userNumber } from "../../testing/userNumber.js";


function echoEvt(evt) {
    console.log(evt.type, evt.id, evt);
}

function echoEvts(evt, ...evtNameList) {
    for (let evtName of evtNameList) {
        evt.addEventListener(evtName, echoEvt);
    }
}

export async function RunTest(JitsiClient) {

    const response = await fetch("../../index.html"),
        html = await response.text(),
        parser = new DOMParser(),
        doc = parser.parseFromString(html, "text/html"),

        client = new JitsiClient(),
        cons = new TestOutput(
            { client },
            userNumber === 1
                ? JitsiClient1_Tests
                : JitsiClient2_Tests);

    document.head.append(...doc.head.childNodes);

    document.body.append(
        ...doc.body.childNodes,
        cons.element);

    document.body.removeChild(document.body.querySelector("#login"));

    echoEvts(
        client,
        "userMoved",
        "emote",
        "userInitRequest",
        "userInitResponse",
        "audioMuteStatusChanged",
        "videoMuteStatusChanged",
        "videoConferenceJoined",
        "videoConferenceLeft",
        "participantJoined",
        "participantLeft",
        "avatarChanged",
        "displayNameChange",
        "audioActivity",
        "participantRoleChanged");

    client.addEventListener("userInitRequest", (evt) => {
        client.userInitResponse(evt.id, { x: userNumber, y: userNumber });
    });


    cons.run();

    document.body.style.backgroundImage = "none";
}