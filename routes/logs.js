"use strict"

const express = require('express')
const router  = express.Router()
const bcrypt  = require('bcrypt')
const md5     = require('md5')



module.exports = (userDataHelpers) => {

  // LOGIN GET ROUTE
  router.get("/login", (req, res) => {
    // If not login, render login form
    if (!req.currentUser.id) {
      res.render("login", {'currentUser': req.currentUser})
    }
    // else redirect to root route
    else {
      res.redirect("/")
    }
  })

  // LOGIN POST ROUTE
  router.post("/login", (req, res) => {

    userDataHelpers.getUser('email',req.body.email,(err, user)=>{
      if (err){
        return res.send('Database connection error.')
      }
      if (user.length === 0){
        return res.send('Email is not registered.')
      }
      else if (user[0].password !== req.body.password) {
        return res.send('invalid password')
      } else {
        req.session.user_id = user[0].id
        return res.status(200).send()
      }
    })
  })


  // REGISTRATION
  router.get("/register", (req, res) => {
    // If not logged in, render register form
    if (!req.currentUser.id) {
      res.render('register', {'currentUser': req.currentUser})
    }
    // else redirect to root route
    else {
      res.redirect("/")
    }
  })



  router.post("/register", (req, res) => {
    // check if the user email is already in the database

    userDataHelpers.getUser('email', req.body.email, (err, user) => {
      if (err) {
        // fix this one later
        return res.send('Error while connecting to the database.')
      }
      if (user.length !== 0) {
        // fix this one later
        return res.send('This email address is already in use by another.')
      }
      let handle = req.body.email.split('@')[0]
      const avatarUrlPrefix = `https://vanillicon.com/${md5(handle)}`
      let newUser = {
        name     : req.body.name,
        email    : req.body.email,
        password : req.body.password,
        avatar   : `${avatarUrlPrefix}.png`
      }
      userDataHelpers.saveUser(newUser, (err, id) => {
        if (err) {
          // Fix this later
          return res.send('Error while connecting to the database.',err)
        }
        else {
          req.session.user_id = id[0]
          return res.status(200).send()
        }
      })
    })
  })

  // Logout
  router.post("/logout", (req, res) => {
    req.session = null
    res.redirect("/login")
  })

  return router;
}
