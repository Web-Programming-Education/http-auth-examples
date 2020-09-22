var express = require('express');
var session = require('express-session');
var crypto = require('crypto');
 
const users = [];

function encrypt(password) {
  return crypto.pbkdf2Sync(
    password, 
    'randomStringYouShouldChange', 
    100000, 
    64, 
    'sha512'
  ).toString('hex');
}

var app = express();
 
app.use(express.json());
app.use(express.static('public'));

app.use(session({
  secret: 'asdjfkhalsdjfhad',
  resave: false,
  saveUninitialized: false
}));
 
app.post('/users', function (req, res) {  
  if (!req.body.email || !req.body.password) {
    res.sendStatus(400);
  }

  users.push({ email: req.body.email, password: encrypt(req.body.password) });

  res.send('registered user with mail: ' + req.body.email);
})

app.post('/login', function (req, res) {
  if (!req.body.email || !req.body.password) {
    res.sendStatus(400);
    return;
  }

  const encryptedPassword = encrypt(req.body.password);

  if (users.some(u => u.email === req.body.email && u.password === encryptedPassword)) {
    req.session.user = { email: req.body.email };
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
})
 
app.get('/employees', function (req, res) {
  if (!req.session.user) {
    res.setHeader("Location", "/login");
    res.sendStatus(401);
    return;
  }

  console.log(req.session.user);
  
  res.json({ data: [
    {
      id: "915391",
      salary: 60000
    },
    {
      id: "234892",
      salary: 90000
    }
  ]});
});

const port = 3000;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})