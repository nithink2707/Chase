const express = require('express')
const session = require('express-session')
const cors = require('cors')
const app = express()

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  })
);


app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: false,
    cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
        res.json({message:"Logged out"})
    })
})
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));