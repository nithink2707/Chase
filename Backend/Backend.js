const express = require('express')
const session = require('express-session')
const cors = require('cors')
const app = express()

function requireAuth(req,res,next) {
    if (!req.session.userId) {
        return res.status(401).json({message:"Not logged in"})
    }
    next();

}

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: false,
    cookie: {
    httpOnly:true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60
    }
}));

app.get('/',(req,res) => {
    return res.status(200).json({message:"Health check"})

})

app.post('/api/login',async (req,res) => {
    const {loginInput,loginPassword} = req.body
    if (loginInput=="chase@chaseclub.in" && loginPassword=="chase") {
        req.session.userId = loginInput;
        return res.json({user: {name:"chase",email:loginInput}})
    }
    else {
        return res.status(400).json({message: 'Wrong credentials'});
    }
}) 

app.post('/api/logout',(req,res) => {
    req.session.destroy((err)=> {
        if (err) return res.status(500).json({message:"Logout failed"})
        res.clearCookie('connect.sid')
        console.log("logged out")
        res.json({message:"Logged out"})
    })
})

app.get('api/auth',requireAuth,(req,res) => {
    res.json({id:req.session.userId, email:req.session.email})
})
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));