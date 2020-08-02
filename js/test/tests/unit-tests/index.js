import { JITSI_HOST, JVB_HOST, JVB_MUC } from "../../constants.js";
import { HtmlTestOutput as TestOutput } from "../../testing/HtmlTestOutput.js";
import { userNumber } from "../../testing/userNumber.js";
import { JitsiClient1_Tests } from "./JitsiClient1_Tests.js";
import { JitsiClient2_Tests } from "./JitsiClient2_Tests.js";
import { LibJitsiMeetClient } from "../../../src/jitsi/LibJitsiMeetClient.js";

function echoEvt(evt) {
    console.log(evt.type, evt.id, evt);
}

function echoEvts(evt, ...evtNameList) {
    for (let evtName of evtNameList) {
        evt.addEventListener(evtName, echoEvt);
    }
}


const client = new LibJitsiMeetClient(JITSI_HOST, JVB_HOST, JVB_MUC),
    cons = new TestOutput(
        { client },
        userNumber === 1
            ? JitsiClient1_Tests
            : JitsiClient2_Tests);

document.body.append(cons.element);

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

client.startAudio();
cons.run();

document.body.style.backgroundImage = "none";