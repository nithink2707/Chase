const express = require('express')
const session = require('express-session')
const cors = require('cors')
import pg from 'pg'
const app = express()
const Pool = pg
const connectstr = "postgresql://neondb_owner:npg_d28TmivnGqpA@ep-fancy-tree-aosw2xw9-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

const pool = new Pool({connectstr,});


function requireAuth(req,res,next) {
    if (!req.session.userId) {
        return res.status(401).json({message:"Not logged in"})
    }
    next();

}

app.set("trust proxy",1);

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
    secure: process.env.NODE_ENV ==="production",
    sameSite: process.env.NODE_ENV ==="production"?"none":"lax",
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
        req.session.email = loginInput;
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

app.get('/api/auth',requireAuth,(req,res) => {
    res.json({id:req.session.userId, email:req.session.email})
})

app.post('/api/register',async (req,res) => {
    const {signupName,signupEmail,signupPhone,signupAge,loginPassword} = req.body
    await pool.connect()
    await pool.query('INSERT INTO users(name,email,phone,password,age)',[signupName,signupEmail,signupPhone,loginPassword,signupAge]);
    await pool.query('COMMIT');
    await pool.end()
    res.status(200).json({message:"User registered"});

})
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));