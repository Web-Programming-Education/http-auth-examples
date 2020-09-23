const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
 
function encrypt(password) {
  return crypto.pbkdf2Sync(
    password, 
    'randomStringYouShouldChange', 
    100000, 
    64, 
    'sha512'
  ).toString('hex');
}

const users = [];
const port = 3000;
const app = express();
 
app.use(express.json());
app.use(express.static('public'));

app.use(session({
  secret: 'asdjfkhalsdjfhad',
  resave: false,
  saveUninitialized: false
}));
 
app.post('/register', function (req, res) {  
  if ( !req.body.email 
    || !req.body.password 
    || typeof req.body.email !== 'string' 
    || typeof req.body.email !== 'string'
  ) {
    res.sendStatus(400);
  }

  users.push({ email: req.body.email, passwordDerivative: encrypt(req.body.password) });

  res.status(201).send('registered user with mail: ' + req.body.email);
})

app.post('/login', function (req, res) {
  if ( !req.body.email 
    || !req.body.password 
    || typeof req.body.email !== 'string' 
    || typeof req.body.email !== 'string'
  ) {
    res.sendStatus(400);
    return;
  }

  const encryptedPassword = encrypt(req.body.password);

  if (users.some(u => u.email === req.body.email && u.passwordDerivative === encryptedPassword)) {
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

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})