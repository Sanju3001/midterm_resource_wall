'use strict'

require('dotenv').config();

const PORT          = process.env.PORT || 8080;
const ENV           = process.env.ENV || "development";
const express       = require("express");
const bodyParser    = require("body-parser");
const sass          = require("node-sass-middleware");
const app           = express();
const cookieSession = require('cookie-session')


const knexConfig    = require("./knexfile");
const knex          = require("knex")(knexConfig[ENV]);
const morgan        = require('morgan');
const knexLogger    = require('knex-logger');


// Seperated Routes for each Resource
const usersRoutes   = require("./routes/users");
const logsRoutes    = require("./routes/logs");
const urlsRoutes    = require("./routes/urls");


// Load the logger first so all (static) HTTP requests are logged to STDOUT
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

// Middlewares
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));
app.use(cookieSession({
  name: 'session',
  keys: ['abcdefghijklmnopqrstuvwxyz0123456789']
}))
app.use(express.static("public"))

// Data Helper Functions
const urlDataHelpers  = require('./db/data_helpers/url_data_helpers.js')(knex)
const userDataHelpers = require('./db/data_helpers/user_data_helpers.js')(knex)


// USER AUTHENTICATION MIDDLEWARE
app.use((req, res, next) => {
  // If there is a cookie attach the current user's info to the request object
  if (req.session.user_id) {
    userDataHelpers.getUser('id', req.session.user_id, (err, user) => {
      if (err) {
        return res.send('Error while connecting to the database.')
        next()
      }
      else {
        req.currentUser = {
          'id'   : req.session.user_id,
          'email': user[0].email,
          'name' : user[0].name
        }
        next()
      }
    })
  }
  // else attach an empty object
  else {
    req.currentUser = {}
    next()
  }
})



// Mount all resource routes
app.use("/users", usersRoutes(userDataHelpers));
app.use("/", logsRoutes(userDataHelpers))
app.use("/urls", urlsRoutes(urlDataHelpers))

// Redirect home page to /urls
app.get("/", (req, res) => {
  res.redirect("/urls")
})



app.listen(PORT, () => {
  console.log('Example app listening on port'  + PORT);
})
