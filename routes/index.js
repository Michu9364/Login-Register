var express = require('express');
var router = express.Router();

const fs = require('fs');
const crypto = require('crypto');
const operator = true;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Wybierz poniższą czynność:'});
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Wybierz poniższą czynność:' });
});

router.post('/register', function(req, res, next) {
  if(req.body.password !== req.body.passwordRepeat){
    res.status(429);
    res.send('Hasła się różnią!');
    return;
  }
  const users = JSON.parse(fs.readFileSync('users.json').toString());
  const username = req.body.login;
  const isAlreadyRegistered = users.find((dbUser) => dbUser.username === username)
  if(isAlreadyRegistered){
    res.status(409);
    res.send('Ktoś o takim loginie już istnieje!');
    return;
  }

  const password = crypto.createHash('sha256').update(req.body.password).digest('hex');

  users.push({username, password, operator});
  fs.writeFileSync('users.json', JSON.stringify(users));
  res.send('Zarejestrowany!')
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Logowanie' });
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.status(301);
  res.redirect('/')
});

router.post('/login', function(req, res, next) {
  const users = JSON.parse(fs.readFileSync('users.json').toString());
  const username = req.body.login;
  const registeredUser = users.find((dbUser) => dbUser.username === username)
  if(!registeredUser){
    res.send('Ludzie tu nikogo nie ma! (takiego)')
    return;
  }

  const password = crypto.createHash('sha256').update(req.body.password).digest('hex');
  if(password !== registeredUser.password){
    res.send('hasła się nie zgadzają!')
    return;
  }

  req.session.user = {
    username,
    operator,
  }

  res.status(301);
  res.redirect('/users/myaccount')
});

module.exports = router;
