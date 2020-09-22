var express = require('express');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
 
const secret = 'askjdfhaldsjkf';

const users = [];

function getToken(authHeaderValue) {
  let [type, token] = authHeaderValue.split(' ');
  return token;
}

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
  }

  const encryptedPassword = encrypt(req.body.password);

  if (users.some(u => u.email === req.body.email && u.password === encryptedPassword)) {
    var token = jwt.sign(
      { email: req.body.email },
      secret,
      { expiresIn: '1h' }
    );

    res.json({
      token: token
    });
  } else {
    res.sendStatus(401);
  }
})
 
app.get('/employees', function (req, res) {
  const encryptedToken = getToken(req.header('Authorization'));
  
  try {
    const decodedToken = jwt.verify(encryptedToken, secret);

    // @ts-ignore
    console.log(`User '${decodedToken.email}' accessed employee data`);

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
  } catch (e) {
    res.setHeader("Location", "/login");
    res.sendStatus(401);
  }
})

const port = 3000;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})