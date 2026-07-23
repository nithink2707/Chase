const express = require('express')
const session = require('express-session')
const cors = require('cors')
const {Pool} = require('pg')
const app = express()
const bcrypt = require("bcryptjs")
const connectionString = "postgresql://neondb_owner:npg_d28TmivnGqpA@ep-fancy-tree-aosw2xw9-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

const pool = new Pool({connectionString,});


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
    const result = await pool.query('SELECT * FROM users WHERE email= $1',[loginInput]);
    if (result.rowCount!=0) {
        const user = result.rows[0]
        const match = await bcrypt.compare(loginPassword,user.password);
        if (match) {
        req.session.userId = user.id;
        req.session.email = user.email;
        return res.json({user: {name:user.name,email:user.email}})}
        else {
        return res.status(400).json({message: 'Wrong credentials'});}
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
    const hashedPassword = await bcrypt.hash(loginPassword,12);
    const conn = await pool.connect()
    await pool.query('INSERT INTO users(name,email,phone,password,age,rating) VALUES ($1,$2,$3,$4,$5,500)',[signupName,signupEmail,signupPhone,hashedPassword,signupAge]);
    await pool.query('INSERT INTO stats(name,phone,rating) VALUES($1,$2,500)',[signupName,signupPhone]);
    await conn.release()
    return res.status(200).json({message:"User registered"});

})

app.get('/api/players',async (req,res) => {
    const conn = await pool.connect()
    const players = await pool.query('SELECT name,rating,phone FROM users');
    await conn.release()
    return res.json(players.rows)
})

app.post('api/match',async (req,res) => {
    const {player1_id,player2_id,p1_points,p2_points,winner_id,new_rating_p1,new_rating_p2,p1phone,p2phone} = req.body
    const conn = await pool.connect()
    await pool.query("UPDATE stats set points=$1,rating=$2 WHERE phone=$3",[p1_points,new_rating_p1,p1phone]);
    await pool.query("UPDATE stats set points=$1,rating=$2 WHERE phone=$3",[p2_points,new_rating_p2,p2phone]);
    await conn.release()
    return res.json({message:"Rating updated"});
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));