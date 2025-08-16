// This is the client code :D

function login() {
  const up = document.getElementById("up").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value + up;
  fetch(`/login?username=${username}&password=${password}`)
    .then((res) => res.text())
    .then((text) => {
      if (text === "Womp womp. Logged in") {
        document.getElementById(
          "whoami"
        ).innerText = `Logged in as ${username}`;
        window.location += "app";
      } else {
        alert(text);
      }
    });
}

function signup() {
  const up = document.getElementById("up").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value + up;
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
      window.location += "?logout=true";
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

function changeSlide() {
  const v = document.getElementById("below").value / 10;
  const up = document.getElementById("up");
  up.style.transform = `rotate(${(v - 5) * 3}deg)`;
  up.value += (v - 5) / 5;
  gorp.innerText = up.value;
}

setInterval(changeSlide, 50);
