var express = require('express');
var router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/register', function (req, res) {
    res.render('register', { message: '' });
});

router.post('/register', async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('register', { message: 'All fields are required' });
        }

        if (password.length < 8) {
            return res.render('register', { message: 'Password must be at least 8 characters' });
        }

        const existing = await User.findOne({ email });

        if (existing) {
            return res.render('register', { message: 'Email already exists' });
        }

        const user = new User({ email, password });

        await user.save();

        res.redirect('/auth/login');
    } catch (err) {
        res.render('register', { message: 'Something went wrong' });
    }
});

router.get('/login', function (req, res) {
    res.render('login', { message: '' });
});

router.post('/login', async function (req, res) {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
        return res.render('login', { message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) {
        return res.render('login', { message: 'Invalid credentials' });
    }

    req.session.userId = foundUser._id;

    res.redirect('/dashboard');
});

router.get('/logout', function (req, res) {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
});

module.exports = router;