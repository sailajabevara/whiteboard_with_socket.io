
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
 origin:true,
 credentials:true
}));

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


/* LOAD BOARD */

app.get("/api/boards/:boardId",async(req,res)=>{

 const boardId=req.params.boardId;

 const result = await pool.query(
  "SELECT * FROM boards WHERE id=$1",
  [boardId]
 );

 res.json({
  boardId:boardId,
  objects:result.rows[0]?.objects || [],
  updatedAt:new Date().toISOString()
 });

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
  success:true,
  boardId:boardId
 });

});


/* HEALTH API */

app.get("/health",(req,res)=>{

 res.json({
  status:"ok",
  timestamp:new Date().toISOString()
 });

});


/* ===================== */
/* SOCKET.IO SERVER */
/* ===================== */

const server = http.createServer(app);

const io = new Server(server,{
 cors:{
  origin:"*"
 }
});


/* USERS IN ROOM */

const rooms = {};


io.on("connection",(socket)=>{

 console.log("User Connected:",socket.id);


 socket.on("joinRoom",(data)=>{

  const boardId=data.boardId;

  socket.join(boardId);

  if(!rooms[boardId]) rooms[boardId]=[];

  const user={
   id:socket.id,
   name:"User-"+socket.id.substring(0,4)
  };

  rooms[boardId].push(user);

  io.to(boardId).emit("roomUsers",{
   users:rooms[boardId]
  });

  console.log("Joined Room:",boardId);

 });


 socket.on("cursorMove",(data)=>{

  socket.to(data.boardId).emit("cursorUpdate",{
   userId:socket.id,
   x:data.x,
   y:data.y
  });

 });


 socket.on("draw",(data)=>{

  socket.to(data.boardId).emit("drawUpdate",data);

 });


 socket.on("addObject",(data)=>{

  socket.to(data.boardId).emit("objectAdded",data);

 });


 socket.on("disconnect",()=>{

  console.log("User Disconnected:",socket.id);

 });

});


server.listen(PORT,()=>{

 console.log("Server running on port",PORT);

});