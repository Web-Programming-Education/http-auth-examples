const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function getToken(req) {
  const authHeaderValue = req.header('Authorization')
  
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

const secret = 'askjdfhaldsjkf';
const users = [];
const port = 3000;
const app = express();
 
app.use(express.json());
app.use(express.static('public'));
 
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
  }

  const encryptedPassword = encrypt(req.body.password);

  if (users.some(u => u.email === req.body.email && u.passwordDerivative === encryptedPassword)) {
    const token = jwt.sign(
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
  const encryptedToken = getToken(req);

  if (!encryptedToken) {
    res.setHeader('WWW-Authenticate', 'Bearer');
    res.sendStatus(401);
    return;
  }
  
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
    res.setHeader('WWW-Authenticate', 'Bearer');
    res.sendStatus(401);
  }
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})