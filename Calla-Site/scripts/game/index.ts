function sayHello() {
    const roomNameInput = document.getElementById("roomName") as HTMLInputElement;
    const userNameInput = document.getElementById("userName") as HTMLInputElement;
    const roomName = roomNameInput.value;
    const userName = userNameInput.value;
    alert(`Hello to you from ${userName} in ${roomName}!`);
}

window.sayHello = sayHello;