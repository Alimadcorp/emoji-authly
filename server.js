// This is the server code. I will host this using my heroku cloud subscription
// I wrote a bunch of comments so they explain how stuff works

require("dotenv").config();
// This imports the .env we created
// Why do we need a .env?
// Because it keeps the main password secret
// If a user gained access to it, they can authenticate without
// logging into an actual account, or can login to
// other user's account. In such a case tho, we usually change the password
const express = require("express"); // This is the thing that puts our service on the internet
const bcrypt = require("bcrypt");
// Encryption with a hashing algorithm
// If a user were to ever steal the password database, they
// cannot auth into a user
const session = require("express-session");
// This stores the user's session on the server side
const cookieParser = require("cookie-parser");
// This stores the user's session on the client side
// BUt why TF dooes a session mean??
// > Well it means to save who you are.
// If you logged in to eve@art3mis.dev, your session may look like:
// { "email": "eve@art3mis.dev", "login": 122019911919222 (this is a date), "display_name": "Art3mis" }
const cors = require("cors"); // Cross Origin Resource Sharing
const fs = require("fs"); // Used to read and send the index.html
const users = require("./users.json"); // Load the already saved users

const app = express(); // Create a new express app

app.use(express.json()); // The app will use the json service
app.use(cookieParser()); // The app will have cookies
// app.use(cors()); // Uncomment to allow users to auth outside of this application
app.use(
  session({
    secret: process.env.SECRET, // This is the secret we have created in .env
    resave: false,
    saveUninitialized: false,
  })
); // The app session will not resave without a re-login, it will not save until a user signs up

let pages = {
  index: fs.readFileSync("./index.html", "utf-8"),
  script: fs.readFileSync("./script.js", "utf-8")
};
// We are having to manually load and provide pages because this is the best way to keep the authentication secure
// We will mimic a static github hosting through express
app.get("/", (req, res) => res.send(pages.index)); // main page
app.get("/index", (req, res) => res.send(pages.index)); // also main page
app.get("/index.html", (req, res) => res.send(pages.index)); // also also main page
app.get("/script", (req, res) => res.send(pages.script)); // the script
app.get("/script.js", (req, res) => res.send(pages.script)); // also the script

async function signup(username, password) {
  users[username] = await bcrypt.hash(password, 10);
  saveSavedUsers();
}

// Returns an array that goes: [ verdict (boolean), reason_of_failure (string) ]
async function login(username, password) {
  if (!users[username]) {
    return [false, "User not found"];
  }
  const match = await bcrypt.compare(password, users[username]);
  if (match) {
    return [true, ""];
  } else {
    return [false, "Incorrect Password"];
  }
}

function saveSavedUsers() {
  fs.writeFileSync("./users.json", JSON.stringify(users, null, 2), "utf-8");
}

function requireLogin(req, res, next) {
  if (!req.session.userId) return res.redirect("/login");
  next();
}

function isLoggedIn(req) {
  return !!req.session.userId;
}

app.post("/submit", async (req, res) => {
  const { username, password } = req.body;
  if (!users[username]) return res.status(404).send("User not found");
  const match = await bcrypt.compare(password, users[username]);
  if (match) {
    req.session.userId = username;
    res.send("Womp womp. Logged in");
  } else {
    res.status(401).send("Well well well, look who forgot their password");
  }
});

app.get("/profile", requireLogin, (req, res) => {
  res.send(`Welcome ${req.session.userId} ;3`);
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.send("Someone kicks you out :skulleyirl:");
  });
});

app.listen(process.env.post || 3000, () =>
  console.log(`Server running on ${process.env.PORT || 3000}`)
); // Make the server LIVE
