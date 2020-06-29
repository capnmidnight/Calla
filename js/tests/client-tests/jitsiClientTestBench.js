import "../../src/protos.js";
import { HtmlTestOutput as TestOutput } from "../../testing/HtmlTestOutput.js";
import { JitsiClient1_Tests } from "./mainTest.js";
import { JitsiClient2_Tests } from "./secondaryTest.js";
import { userNumber } from "./userNumber.js";


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
        client.element,
        cons.element);

    Object.assign(client.element.style, {
        bottom: undefined,
        height: "50%"
    });

    Object.assign(cons.element.style, {
        position: "absolute",
        top: "50%",
        left: 0,
        width: "100%",
        height: "50%"
    });

    document.body.removeChild(document.body.querySelector("#login"));

    echoEvts(
        client,
        "userMoved",
        "emote",
        "userInitRequest",
        "userInitResponse",
        "audioMuteStatusChanged",
        "videoMuteStatusChanged",
        "localAudioMuteStatusChanged",
        "localVideoMuteStatusChanged",
        "remoteAudioMuteStatusChanged",
        "remoteVideoMuteStatusChanged",
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
}