"use strict";
function sayHello() {
    const roomNameInput = document.getElementById("roomName");
    const userNameInput = document.getElementById("userName");
    const roomName = roomNameInput.value;
    const userName = userNameInput.value;
    alert(`Hello to you from ${userName} in ${roomName}!`);
}
window.sayHello = sayHello;
//# sourceMappingURL=index.js.map