
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

/* DATABASE */
const pool = new Pool({
 connectionString: process.env.DATABASE_URL
});

/* SESSION */
app.use(session({
 secret:"secret123",
 resave:false,
 saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user,done)=>{
 done(null,user);
});

passport.deserializeUser((user,done)=>{
 done(null,user);
});


/* TEST LOGIN */
app.get("/auth/test",(req,res)=>{

 req.session.user={
  id:"1",
  name:"Test User",
  email:"test@test.com",
  image:""
 };

 res.json({
  user:req.session.user
 });

});


/* SESSION API */
app.get("/api/auth/session",(req,res)=>{

 if(!req.session.user){
  return res.status(401).json({});
 }

 res.json({
  user:req.session.user
 });

});


/* CREATE BOARD */
app.post("/api/boards",async(req,res)=>{

 const boardId = uuidv4();

 await pool.query(
  "INSERT INTO boards(id) VALUES($1)",
  [boardId]
 );

 res.status(201).json({
  boardId:boardId
 });

});


/* GET ALL BOARDS */
app.get("/api/boards",async(req,res)=>{

 const result = await pool.query(
  "SELECT * FROM boards ORDER BY created_at DESC"
 );

 res.json(result.rows);

});


/* LOAD BOARD */
app.get("/api/boards/:boardId",async(req,res)=>{

 const boardId=req.params.boardId;

 const result = await pool.query(
  "SELECT * FROM boards WHERE id=$1",
  [boardId]
 );

 res.json(result.rows[0]);

});


/* SAVE BOARD */
app.post("/api/boards/:boardId",async(req,res)=>{

 const boardId=req.params.boardId;
 const objects=req.body.objects || [];

 await pool.query(
  "UPDATE boards SET objects=$1, updated_at=NOW() WHERE id=$2",
  [JSON.stringify(objects),boardId]
 );

 res.json({
  success:true
 });

});


/* HEALTH API */
app.get("/health",(req,res)=>{

 res.json({
  status:"ok",
  timestamp:new Date().toISOString()
 });

});


app.listen(PORT,()=>{
 console.log("Server running on port",PORT);
});