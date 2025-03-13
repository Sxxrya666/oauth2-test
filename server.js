require('dotenv').config()
const express = require('express')
const passport = require('passport')
const app = express()
const session = require("express-session")

app.set('view engine', 'ejs')

app.use(session({

    name: "soorya-ka-sesh", 
    saveUninitialized: false, 
    secret: 'teriMaaKiChooot', 
    resave: false, 

}))

app.use(passport.initialize())
app.use(passport.session())



//////////////////////////////google part////////////////////////////////////////

const googleStrategy = require('passport-google-oauth20').Strategy

const clientID= process.env.clientID
const clientSecret= process.env.clientSecret
const callbackURL= '/auth/google/callback'

passport.use(new googleStrategy(
    {
        clientID, 
        clientSecret, 
        callbackURL, 
    }, 
    function (accessToken, refreshToken, profile, callback){
        user = profile 
        console.log({user})
        return callback(null, user)
    }
))

//first endpoint 
console.log('before /auth/google')
app.get('/auth/google', passport.authenticate(
        'google', {
            scope: ['profile', 'email']
        })
) 

app.get('/auth/google/callback', passport.authenticate(
    //first arg and sec arg
    'google', 
    {successRedirect: '/login-successful' , failureRedirect: '/error'}, 
    )
)

//////////////////////////////////////////////////////////////////////



let user; //saving login credentials 


app.get('/login-successful', (req, res)=>{
    res.send(user)
})

app.get('/error', (req, res)=>{
    res.send('error logging in') 
})

app.get('/', (req, res)=>{
    res.render('login')
})

passport.serializeUser(function(user, callback){
    console.log("ser");
    callback(null, user)
})

passport.deserializeUser(function(obj, callback){
    console.log("des");
    callback(null, obj)
})

app.listen(8000, ()=>{
  console.log('alive at 8k')
})

