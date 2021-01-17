const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const router = require('./routes/index');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
const PORT = 3000;

//setup connection
mongoose.connect(process.env.URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

exports.passport = passport;

app.use('/', router);

app.listen(PORT, () => {
	console.log(`Server listening at ${PORT}`);
});
