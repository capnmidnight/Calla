import { HtmlTestOutput as TestOutput } from "kudzu/src/testing/HtmlTestOutput";
import { userNumber } from "kudzu/src/testing/userNumber";
import { JITSI_HOST, JVB_HOST, JVB_MUC } from "../constants";
import { JitsiClient1_Tests } from "./JitsiClient1_Tests";
import { JitsiClient2_Tests } from "./JitsiClient2_Tests";

function echoEvt(evt) {
    console.log(evt.type, evt.id, evt);
}

function echoEvts(evt, ...evtNameList) {
    for (let evtName of evtNameList) {
        evt.addEventListener(evtName, echoEvt);
    }
}


const client = new CallaClient(JITSI_HOST, JVB_HOST, JVB_MUC),
    cons = new TestOutput(
        { client },
        userNumber === 1
            ? JitsiClient1_Tests
            : JitsiClient2_Tests);

if (!cons.element.parentNode) {
    document.body.append(cons.element);
}

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