import { LoginForm } from "../../src/forms/LoginForm.js";
(async function () {
    const request = await fetch("../../index.html"),
        doc = await request.html(),
        head = doc.querySelector("head"),
        body = doc.querySelector("body");

    document.head.append(...head.childNodes);
    document.body.append(...body.childNodes);

    const loginForm = new LoginForm();
    document.body.appendChild(loginForm.element);

    loginForm.addEventListener("login", () => {
        const user = loginForm.userName,
            room = loginForm.roomName;

        console.log(`Logging in: User ${user}, Room ${room}.`);
        setTimeout(() => {
            if (room === "island") {
                loginForm.connected = true;
            }
            else {
                loginForm.connecting = false;
            }
        }, 1000);
    });

    async function show() {
        loginForm.show();
        const login = await loginForm.once("login");
        console.log(login);
        setTimeout(show, 1000);
    }
    setTimeout(show, 500);
})();