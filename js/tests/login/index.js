import { LoginForm } from "../../src/forms/LoginForm.js";

(async function () {
    const request = await fetch("../../index.html"),
        doc = await request.html(),
        head = doc.querySelector("head"),
        body = doc.querySelector("body");

    document.head.append(...head.childNodes);
    document.body.append(...body.childNodes);

    const login = new LoginForm();
    document.body.appendChild(login.element);

    login.addEventListener("login", () => {
        const user = login.userName,
            room = login.roomName;

        console.log(`Logging in: User ${user}, Room ${room}.`);
        setTimeout(() => {
            if (room === "island") {
                login.connected = true;
            }
            else {
                login.connecting = false;
            }
        }, 1000);
    });

    async function show() {
        login.show();
        const evt = await login.once("login");
        console.log(evt);
        setTimeout(show, 1000);
    }

    show();
})();