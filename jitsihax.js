(function () {

    var commands = {
        setVolume: function (evt) {
            var id = "#participant_" + evt.user + " audio",
                audio = document.querySelector(id);
            if (audio) {
                audio.volume = evt.volume;
            }
            else {
                console.warn("Could not find audio element for user " + user);
            }
        }
    };

    addEventListener("message", function (evt) {
        if (evt.origin === "http://localhost"
            || evt.origin === "https://localhost"
            || evt.origin.startsWith("http://localhost:")
            || evt.origin.startsWith("https://localhost:")
            || evt.origin === "https://meet.primrosevr.com") {
            try {
                var data = JSON.parse(evt.data);
                if (data.hax === "jitsi"
                    && commands[data.command]) {
                    commands[data.command](data);
                }
            }
            catch (exp) {
                console.error(exp);
            }
        }
    });
})();
