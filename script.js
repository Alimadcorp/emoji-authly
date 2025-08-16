// This is the client code :D

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  fetch(`/login?username=${username}&password=${password}`)
    .then((res) => res.text())
    .then((text) => {
      if (text === "Womp womp. Logged in") {
        document.getElementById(
          "whoami"
        ).innerText = `Logged in as ${username}`;
      } else {
        alert(text);
      }
    });
}

function signup() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  fetch(`/signup?username=${username}&password=${password}`)
    .then((res) => res.text())
    .then((text) => {
      alert(text);
    });
}

function logout() {
  fetch("/logout")
    .then((res) => res.text())
    .then((text) => {
      if (text === "Logged out") {
        document.getElementById("whoami").innerText = "You are not logged in.";
      } else {
        alert(text);
      }
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const whoami = document.getElementById("whoami");
  fetch("/profile")
    .then((res) => res.text())
    .then((text) => {
      if (text.startsWith("Welcome")) {
        whoami.innerText = text;
      } else {
        whoami.innerText = "You are not logged in.";
      }
    });
});
