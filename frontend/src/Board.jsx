

// import { useEffect,useRef,useState } from "react";
// import socket from "./socket";

// function BoardPage(){

// const canvasRef=useRef(null);

// const lastX=useRef(0);
// const lastY=useRef(0);

// const drawing=useRef(false);

// /* REAL BOARD ID */

// const boardId="92f6cdd5-7690-4588-b0f2-8a8d95e2404f";

// /* STORE ALL OBJECTS */

// const objectsRef=useRef([]);

// const [color,setColor]=useState("#000000");
// const [size,setSize]=useState(3);


// /* ================= */
// /* JOIN ROOM */
// /* ================= */

// useEffect(()=>{

// socket.emit("joinRoom",{boardId});

// },[]);


// /* ================= */
// /* LOAD BOARD */
// /* ================= */

// useEffect(()=>{

// fetch("http://localhost:3001/api/boards/"+boardId)

// .then(res=>res.json())

// .then(data=>{

// if(!data || !data.objects) return;

// objectsRef.current=data.objects;

// const canvas=canvasRef.current;

// const ctx=canvas.getContext("2d");

// /* CLEAR */

// ctx.clearRect(0,0,canvas.width,canvas.height);

// /* DRAW SAVED */

// data.objects.forEach(obj=>{

// ctx.beginPath();

// ctx.moveTo(obj.x0,obj.y0);

// ctx.lineTo(obj.x1,obj.y1);

// ctx.strokeStyle=obj.color;

// ctx.lineWidth=obj.size;

// ctx.stroke();

// });

// });

// },[]);



// /* ================= */
// /* RECEIVE DRAW */
// /* ================= */

// useEffect(()=>{

// socket.on("drawUpdate",(data)=>{

// const canvas=canvasRef.current;

// const ctx=canvas.getContext("2d");

// ctx.beginPath();

// ctx.moveTo(data.x0,data.y0);

// ctx.lineTo(data.x1,data.y1);

// ctx.strokeStyle=data.color;

// ctx.lineWidth=data.size;

// ctx.stroke();

// /* STORE */

// objectsRef.current.push(data);

// });

// },[]);



// /* ================= */
// /* START DRAW */
// /* ================= */

// const startDraw=(e)=>{

// drawing.current=true;

// lastX.current=e.nativeEvent.offsetX;

// lastY.current=e.nativeEvent.offsetY;

// };



// /* ================= */
// /* STOP DRAW */
// /* ================= */

// const stopDraw=()=>{

// drawing.current=false;

// };



// /* ================= */
// /* DRAW */
// /* ================= */

// const draw=(e)=>{

// if(!drawing.current) return;

// const canvas=canvasRef.current;

// const ctx=canvas.getContext("2d");

// const x=e.nativeEvent.offsetX;
// const y=e.nativeEvent.offsetY;

// ctx.beginPath();

// ctx.moveTo(lastX.current,lastY.current);

// ctx.lineTo(x,y);

// ctx.strokeStyle=color;

// ctx.lineWidth=size;

// ctx.stroke();


// const drawData={

// boardId,
// x0:lastX.current,
// y0:lastY.current,
// x1:x,
// y1:y,
// color,
// size

// };


// /* STORE */

// objectsRef.current.push(drawData);


// /* SEND SOCKET */

// socket.emit("draw",drawData);


// lastX.current=x;
// lastY.current=y;

// };



// /* ================= */
// /* SAVE BOARD */
// /* ================= */

// const saveBoard=async()=>{

// await fetch(

// "http://localhost:3001/api/boards/"+boardId,

// {

// method:"POST",

// headers:{
// "Content-Type":"application/json"
// },

// body:JSON.stringify({

// objects:objectsRef.current

// })

// }

// );

// alert("Saved Successfully");

// };



// return(

// <div>

// <h1>Whiteboard</h1>


// Color:

// <input
// type="color"
// value={color}
// onChange={(e)=>setColor(e.target.value)}
// />


// Size:

// <input
// type="range"
// min="1"
// max="10"
// value={size}
// onChange={(e)=>setSize(e.target.value)}
// />


// <button onClick={saveBoard}>
// Save Board
// </button>


// <br/><br/>


// <canvas
// ref={canvasRef}
// width={900}
// height={500}
// style={{
// border:"1px solid black"
// }}
// onMouseDown={startDraw}
// onMouseMove={draw}
// onMouseUp={stopDraw}
// onMouseLeave={stopDraw}
// />

// </div>

// );

// }

// export default BoardPage;

import { useEffect,useRef,useState } from "react";
import socket from "./socket";

function BoardPage(){

const canvasRef=useRef(null);

const lastX=useRef(0);
const lastY=useRef(0);

const drawing=useRef(false);

/* REAL BOARD ID */

const boardId="e8f66d43-f4a6-40e1-a9a9-42b7736690a6";

/* STORE OBJECTS */

const objectsRef=useRef([]);

const [color,setColor]=useState("#000000");
const [size,setSize]=useState(3);



/* JOIN ROOM */

useEffect(()=>{

socket.emit("joinRoom",{boardId});

},[]);



/* LOAD BOARD */

useEffect(()=>{

fetch("http://localhost:3001/api/boards/"+boardId)

.then(res=>res.json())

.then(data=>{

if(!data || !data.objects) return;

objectsRef.current=data.objects;

const canvas=canvasRef.current;
const ctx=canvas.getContext("2d");

ctx.clearRect(0,0,canvas.width,canvas.height);

/* DRAW SAVED */

data.objects.forEach(obj=>{

if(obj.type==="line"){

ctx.beginPath();

ctx.moveTo(obj.x0,obj.y0);
ctx.lineTo(obj.x1,obj.y1);

ctx.strokeStyle=obj.color;
ctx.lineWidth=obj.size;

ctx.stroke();

}

/* RECTANGLE */

if(obj.type==="rect"){

ctx.strokeStyle=obj.color;

ctx.strokeRect(
obj.x,
obj.y,
obj.w,
obj.h
);

}

});

});

},[]);



/* RECEIVE DRAW */

useEffect(()=>{

socket.on("drawUpdate",(data)=>{

const canvas=canvasRef.current;
const ctx=canvas.getContext("2d");

ctx.beginPath();

ctx.moveTo(data.x0,data.y0);
ctx.lineTo(data.x1,data.y1);

ctx.strokeStyle=data.color;
ctx.lineWidth=data.size;

ctx.stroke();

objectsRef.current.push(data);

});

},[]);



/* RECEIVE RECTANGLE */

useEffect(()=>{

socket.on("objectAdded",(data)=>{

const canvas=canvasRef.current;
const ctx=canvas.getContext("2d");

ctx.strokeStyle=data.color;

ctx.strokeRect(
data.x,
data.y,
data.w,
data.h
);

objectsRef.current.push(data);

});

},[]);



/* START DRAW */

const startDraw=(e)=>{

drawing.current=true;

lastX.current=e.nativeEvent.offsetX;
lastY.current=e.nativeEvent.offsetY;

};



/* STOP DRAW */

const stopDraw=()=>{

drawing.current=false;

};



/* DRAW */

const draw=(e)=>{

if(!drawing.current) return;

const canvas=canvasRef.current;
const ctx=canvas.getContext("2d");

const x=e.nativeEvent.offsetX;
const y=e.nativeEvent.offsetY;

ctx.beginPath();

ctx.moveTo(lastX.current,lastY.current);
ctx.lineTo(x,y);

ctx.strokeStyle=color;
ctx.lineWidth=size;

ctx.stroke();


const drawData={

type:"line",

boardId,
x0:lastX.current,
y0:lastY.current,
x1:x,
y1:y,
color,
size

};


objectsRef.current.push(drawData);

socket.emit("draw",drawData);

lastX.current=x;
lastY.current=y;

};



/* ADD RECTANGLE */

const addRectangle=()=>{

const canvas=canvasRef.current;
const ctx=canvas.getContext("2d");

const rect={

type:"rect",

boardId,

x:100,
y:100,

w:200,
h:120,

color

};


ctx.strokeStyle=color;

ctx.strokeRect(
rect.x,
rect.y,
rect.w,
rect.h
);


objectsRef.current.push(rect);

socket.emit("addObject",rect);

};



/* SAVE BOARD */

const saveBoard=async()=>{

await fetch(

"http://localhost:3001/api/boards/"+boardId,

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

objects:objectsRef.current

})

}

);

alert("Saved Successfully");

};



return(

<div>

<h1>Whiteboard</h1>


Color:

<input
type="color"
value={color}
onChange={(e)=>setColor(e.target.value)}
/>


Size:

<input
type="range"
min="1"
max="10"
value={size}
onChange={(e)=>setSize(e.target.value)}
/>



<button onClick={addRectangle}>
Add Rectangle
</button>



<button onClick={saveBoard}>
Save Board
</button>


<br/><br/>



<canvas
ref={canvasRef}
width={900}
height={500}
style={{
border:"1px solid black"
}}
onMouseDown={startDraw}
onMouseMove={draw}
onMouseUp={stopDraw}
onMouseLeave={stopDraw}
/>

</div>

);

}

export default BoardPage;