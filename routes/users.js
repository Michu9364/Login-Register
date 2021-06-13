var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/myaccount', function(req, res, next) {
  if(!req.session.user){
    res.status(301);
    res.redirect('/login');
    return ;
  }
  const username = req.session.user.username;
  const operator = req.session.user.operator;
  res.render('myaccount', { username, operator });
});

module.exports = router;
