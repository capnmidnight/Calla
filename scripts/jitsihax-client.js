"use strict";

// Manages communication between Jitsi Meet and Lozya
const jitsiClient = (function () {

    // helps us filter out data channel messages that don't belong to us
    const LOZYA_FINGERPRINT = "lozya";

    const eventHandlers = {};

    return {

        /// Add a listener for Lozya events that come through the Jitsi Meet data channel.
        addEventListener: function (evtName, callback) {
            if (!eventHandlers[evtName]) {
                eventHandlers[evtName] = [];
            }

            eventHandlers[evtName].push(callback);
        },

        /// Remove a listener for Lozya events that come through the Jitsi Meet data channel
        removeEventListener: function (evtName, callback) {
            const handlers = eventHandlers[evtName];
            if (!!handlers) {
                const idx = handlers.indexOf(callback);
                if (idx >= 0) {
                    handlers.splice(idx, 1);
                }
            }
        },

        /// Send a Lozya message through the Jitsi Meet data channel.
        txGameData: function (id, command, obj) {
            obj = obj || {};
            obj.hax = LOZYA_FINGERPRINT;
            obj.command = command;
            api.executeCommand("sendEndpointTextMessage", id, JSON.stringify(obj));
        },

        /// A listener to add to JitsiExternalAPI::endpointTextMessageReceived event
        /// to receive Lozya messages from the Jitsi Meet data channel.
        rxGameData: function (evt) {
            // JitsiExternalAPI::endpointTextMessageReceived event arguments format: 
            // evt = {
            //    data: {
            //      senderInfo: {
            //        jid: "string", // the jid of the sender
            //        id: "string" // the participant id of the sender
            //      },
            //      eventData: {
            //        name: "string", // the name of the datachannel event: `endpoint-text-message`
            //        text: "string" // the received text from the sender
            //      }
            //   }
            //};
            const data = JSON.parse(evt.data.eventData.text);
            if (data.hax === LOZYA_FINGERPRINT) {
                const handlers = eventHandlers[data.command];
                if (!!handlers) {
                    data.participantID = evt.data.senderInfo.id;
                    for (let i = 0; i < handlers.length; ++i) {
                        handlers[i](data);
                    }
                }
            }
        },

        /// Send a Lozya message to the jitsihax.js script
        txJitsiHax: function (command, obj) {
            if (iframe) {
                obj.hax = LOZYA_FINGERPRINT;
                obj.command = command;
                iframe.contentWindow.postMessage(JSON.stringify(obj), "https://" + JITSI_HOST);
            }
        }
    }
})();