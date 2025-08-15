const express = require('express');
const { useSyncExternalStore } = require('react');
const app = express();

app.get('/', (req, res) => res.send('Hello'));
app.listen(3000);
app.use(express.json());
app.post('/submit', (req, res) => {
    const data = req.body;
})

const user = {}
users['aaa'] = 'pass123';

const hash = await bcrypt.hash('mpw', 10);

users[username] = await bcrypt.hash(password, 10);

await bcrypt.compare(password, users[username])

req.session.userId = user.id;

if (req.session.userId) {
    res.render('profile');
} else {
    res.redirect('/login')
}

if (!req.session.userId) {
    res.redirect('/login');
}