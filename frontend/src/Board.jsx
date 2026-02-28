


// import { useEffect,useRef,useState } from "react";
// import socket from "./socket";

// function BoardPage(){

// const canvasRef=useRef(null);

// const lastX=useRef(0);
// const lastY=useRef(0);

// const drawing=useRef(false);

// const startX=useRef(0);
// const startY=useRef(0);

// /* BOARD ID */

// const boardId="5f3ffffc-6dd2-4b00-82db-2a4efae200fe";

// /* STORE OBJECTS */

// const objectsRef=useRef([]);

// /* TOOL */

// const [tool,setTool]=useState("pen");

// const [color,setColor]=useState("#000000");
// const [size,setSize]=useState(3);



// /* JOIN ROOM */

// useEffect(()=>{

// socket.emit("joinRoom",{boardId});

// },[]);



// /* LOAD BOARD */

// useEffect(()=>{

// fetch("http://localhost:3001/api/boards/"+boardId)

// .then(res=>res.json())

// .then(data=>{

// if(!data || !data.objects) return;

// objectsRef.current=data.objects;

// const canvas=canvasRef.current;

// const ctx=canvas.getContext("2d");

// ctx.clearRect(0,0,canvas.width,canvas.height);

// data.objects.forEach(obj=>{

// if(obj.type==="pen"){

// ctx.beginPath();
// ctx.moveTo(obj.x0,obj.y0);
// ctx.lineTo(obj.x1,obj.y1);
// ctx.strokeStyle=obj.color;
// ctx.lineWidth=obj.size;
// ctx.stroke();

// }

// if(obj.type==="rect"){

// ctx.strokeStyle=obj.color;
// ctx.lineWidth=obj.size;

// ctx.strokeRect(
// obj.x,
// obj.y,
// obj.width,
// obj.height
// );

// }

// });

// });

// },[]);



// /* RECEIVE DRAW */

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

// objectsRef.current.push(data);

// });

// },[]);



// /* RECEIVE RECTANGLE */

// useEffect(()=>{

// socket.on("objectAdded",(data)=>{

// const canvas=canvasRef.current;
// const ctx=canvas.getContext("2d");

// ctx.strokeStyle=data.color;
// ctx.lineWidth=data.size;

// ctx.strokeRect(
// data.x,
// data.y,
// data.width,
// data.height
// );

// objectsRef.current.push(data);

// });

// },[]);



// /* START DRAW */

// const startDraw=(e)=>{

// drawing.current=true;

// const x=e.nativeEvent.offsetX;
// const y=e.nativeEvent.offsetY;

// lastX.current=x;
// lastY.current=y;

// startX.current=x;
// startY.current=y;

// };



// /* STOP DRAW */

// const stopDraw=(e)=>{

// if(!drawing.current) return;

// drawing.current=false;


// if(tool==="rect"){

// const canvas=canvasRef.current;
// const ctx=canvas.getContext("2d");

// const x=e.nativeEvent.offsetX;
// const y=e.nativeEvent.offsetY;

// const width=x-startX.current;
// const height=y-startY.current;

// ctx.strokeStyle=color;
// ctx.lineWidth=size;

// ctx.strokeRect(
// startX.current,
// startY.current,
// width,
// height
// );


// const rectData={

// boardId,
// type:"rect",
// x:startX.current,
// y:startY.current,
// width,
// height,
// color,
// size

// };

// objectsRef.current.push(rectData);

// socket.emit("addObject",rectData);

// }

// };



// /* DRAW */

// const draw=(e)=>{

// if(!drawing.current) return;

// if(tool!=="pen") return;

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
// type:"pen",
// x0:lastX.current,
// y0:lastY.current,
// x1:x,
// y1:y,
// color,
// size

// };

// objectsRef.current.push(drawData);

// socket.emit("draw",drawData);

// lastX.current=x;
// lastY.current=y;

// };



// /* SAVE BOARD */

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

// alert("Saved successfully");

// };



// return(

// <div>

// <h1>Whiteboard</h1>


// <button onClick={()=>setTool("pen")}>
// Pen
// </button>

// <button onClick={()=>setTool("rect")}>
// Rectangle
// </button>


// <br/><br/>


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

const startX=useRef(0);
const startY=useRef(0);


/* BOARD ID */

const boardId="5f3ffffc-6dd2-4b00-82db-2a4efae200fe";


/* STORE OBJECTS */

const objectsRef=useRef([]);


/* TOOL */

const [tool,setTool]=useState("pen");

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

if(!data.objects) return;

objectsRef.current=data.objects;

const canvas=canvasRef.current;
const ctx=canvas.getContext("2d");

ctx.clearRect(0,0,canvas.width,canvas.height);


/* DRAW SAVED OBJECTS */

data.objects.forEach(obj=>{


/* PEN */

if(obj.type==="pen"){

ctx.beginPath();

ctx.moveTo(obj.x0,obj.y0);

ctx.lineTo(obj.x1,obj.y1);

ctx.strokeStyle=obj.color || "black";

ctx.lineWidth=obj.size || 3;

ctx.stroke();

}


/* RECTANGLE */

if(obj.type==="rect"){

ctx.strokeStyle=obj.color || "black";

ctx.lineWidth=obj.size || 3;

ctx.strokeRect(

obj.x,
obj.y,
obj.width,
obj.height

);

}

});

});

},[]);



/* RECEIVE PEN */

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

ctx.lineWidth=data.size;

ctx.strokeRect(

data.x,
data.y,
data.width,
data.height

);

objectsRef.current.push(data);

});

},[]);



/* START */

const startDraw=(e)=>{

drawing.current=true;

const x=e.nativeEvent.offsetX;
const y=e.nativeEvent.offsetY;

lastX.current=x;
lastY.current=y;

startX.current=x;
startY.current=y;

};



/* STOP */

const stopDraw=(e)=>{

if(!drawing.current) return;

drawing.current=false;


/* RECTANGLE */

if(tool==="rect"){

const canvas=canvasRef.current;
const ctx=canvas.getContext("2d");

const x=e.nativeEvent.offsetX;
const y=e.nativeEvent.offsetY;

const width=x-startX.current;
const height=y-startY.current;


ctx.strokeStyle=color;

ctx.lineWidth=size;

ctx.strokeRect(

startX.current,
startY.current,
width,
height

);


const rectData={

boardId,
type:"rect",
x:startX.current,
y:startY.current,
width,
height,
color,
size

};


objectsRef.current.push(rectData);


socket.emit("addObject",rectData);

}

};



/* DRAW PEN */

const draw=(e)=>{

if(!drawing.current) return;

if(tool!=="pen") return;

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

boardId,
type:"pen",
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



/* SAVE */

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


<button onClick={()=>setTool("pen")}>
Pen
</button>

<button onClick={()=>setTool("rect")}>
Rectangle
</button>


<br/><br/>


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