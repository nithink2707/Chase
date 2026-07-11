const express = require('express')
const session = require('express-session')
const cors = require('cors')
const app = express()


app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: false,
    cookie: {
    httpOnly: true,     
    secure: true,
    maxAge: 1000 * 60 * 60
    }
}));

app.route('/',(req,res) => {
    return res.status(200).json({message:"Health check"})

})

app.post('/api/login',async (req,res) => {
    const {email,password} = req.body
    if (email=="chase@chaseclub.in") {
        if (password=="chase") {
            req.session.userId = email
            req.session.pass = password
            res.json({user: {name:"chase",email:email}})
        }
    }
    else {
        return res.status(400).json({message: 'Wrong credentials'});
    }
}) 

app.post('api/logout',(req,res) => {
    req.session.destroy((err)=> {
        if (err) return res.status(500).json({message:"Logout failed"})
        res.clearCookie('connect.sid')
        res.json({message:"Logged out"})
    })
})