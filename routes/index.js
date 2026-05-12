const connectDB = require('./db');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('index', { title: 'Express Auth App' });
});

module.exports = router;
connectDB();