"use strict";
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const api = require('./routes/api.js');
const exphbs = require('express-handlebars');

var app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use('', api);

app.set('views', './public/views');
app.set('view engine', '.hbs');
app.engine('.hbs', exphbs({defaultLayout:'main', extname: '.hbs'}));
app.use(express.static('public'));


app.listen(8000, "0.0.0.0", (req,res)=> (
	console.log("Server Started Well")
));
