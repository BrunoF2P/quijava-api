var express = require('express');
var router = express.Router();

/**
 *  Post login.
 */
router.post('/login', function(req, res, next) {
    res.send('login',);
});

module.exports = router;
