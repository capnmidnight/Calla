import { once } from "../../../src/events/once.js";
import { LoginForm } from "../../../src/forms/LoginForm.js";
import { href } from "../../../src/html/attrs.js";
import { show } from "../../../src/html/ops.js";
import { Base } from "../../../src/html/tags.js";

(async function () {
    const response = await fetch("../../index.html"),
        html = await response.text(),
        parser = new DOMParser(),
        doc = parser.parseFromString(html, "text/html");
    doc.head.insertBefore(Base(href("../../")), doc.head.children[0]);
    document.head.append(...doc.head.childNodes);
    document.body.append(...doc.body.childNodes);

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

    async function showLogin() {
        show(login);
        const evt = await once(login, "login");
        console.log(evt);
        setTimeout(showLogin, 1000);
    }

    showLogin();
})();