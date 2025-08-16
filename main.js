require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
//const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());
//app.user(cors());
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

const users = {};
users['aaa'] = 'pass123';

(async () => {
  const hash = await bcrypt.hash('mypassword', 10);
  console.log('Hash for mypassword:', hash);

  let username = "artemis";
  let password = "iamcool";

  users[username] = await bcrypt.hash(password, 10);
  console.log('Stored users:', users);

  const match = await bcrypt.compare(password, users[username]);
  console.log('Password match?', match);
})();

function requireLogin(req, res, next) {
  if (!req.session.userId) return res.redirect('/login');
  next();
}

function isLoggedIn(req) {
  return !!req.session.userId;
}

app.get('/', (req, res) => res.send('Uhhh'));

app.post('/submit', async (req, res) => {
  const { username, password } = req.body;
  if (!users[username]) return res.status(404).send('User not found');
  const match = await bcrypt.compare(password, users[username]);
  if (match) {
    req.session.userId = username;
    res.send('Womp womp. Logged in');
  } else {
    res.status(401).send('Well well well, look who forgot their password');
  }
});

app.get('/profile', requireLogin, (req, res) => {
  res.send(`Welcome ${req.session.userId} ;3`);
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.send('Someone kicks you out :skulleyirl:');
  });
});

app.listen(3000, () => console.log('Server running on 3000'));
