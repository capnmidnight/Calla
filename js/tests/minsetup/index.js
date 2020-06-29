import { ExternalJitsiClient as JitsiClient } from "../../src/jitsi/ExternalJitsiClient.js";
import { init } from "../../src/init.js";

const { client } = init("jitsi.calla.chat", new JitsiClient());

function echoEvt(evt) {
    console.log(evt.type, evt.id, evt);
}

client.addEventListener("userMoved", echoEvt);
client.addEventListener("emote", echoEvt);
client.addEventListener("userInitRequest", echoEvt);
client.addEventListener("userInitResponse", echoEvt);
client.addEventListener("audioMuteStatusChanged", echoEvt);
client.addEventListener("videoMuteStatusChanged", echoEvt);
client.addEventListener("localAudioMuteStatusChanged", echoEvt);
client.addEventListener("localVideoMuteStatusChanged", echoEvt);
client.addEventListener("remoteAudioMuteStatusChanged", echoEvt);
client.addEventListener("remoteVideoMuteStatusChanged", echoEvt);
client.addEventListener("videoConferenceJoined", echoEvt);
client.addEventListener("videoConferenceLeft", echoEvt);
client.addEventListener("participantJoined", echoEvt);
client.addEventListener("participantLeft", echoEvt);
client.addEventListener("avatarChanged", echoEvt);
client.addEventListener("displayNameChange", echoEvt);
client.addEventListener("audioActivity", echoEvt);
client.addEventListener("setAvatarEmoji", echoEvt);