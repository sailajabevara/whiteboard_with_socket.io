
import { useEffect,useRef,useState } from "react";
import socket from "./socket";

function BoardPage(){

const canvasRef=useRef(null);

const lastX=useRef(0);
const lastY=useRef(0);

const drawing=useRef(false);

const startX=useRef(0);
const startY=useRef(0);

const boardId="5f3ffffc-6dd2-4b00-82db-2a4efae200fe";

/* OBJECT STORAGE */

const objectsRef=useRef([]);

/* UNDO REDO STACKS */

const undoStack=useRef([]);
const redoStack=useRef([]);

/* TOOL */

const [tool,setTool]=useState("pen");

const [color,setColor]=useState("#000000");
const [size,setSize]=useState(3);

/* USERS */

const [users,setUsers]=useState([]);

/* CURSORS */

const [cursors,setCursors]=useState({});



/* JOIN ROOM */

useEffect(()=>{

socket.emit("joinRoom",{boardId});

},[]);



/* USERS LIST */

useEffect(()=>{

socket.on("roomUsers",(data)=>{

setUsers(data.users);

});

},[]);



/* LOAD BOARD */

useEffect(()=>{

fetch("http://localhost:3001/api/boards/"+boardId)
.then(res=>res.json())
.then(data=>{

if(!data.objects) return;

objectsRef.current=data.objects;

drawAll();

});

},[]);



/* DRAW ALL */

const drawAll=()=>{

const canvas=canvasRef.current;
const ctx=canvas.getContext("2d");

ctx.clearRect(0,0,canvas.width,canvas.height);

objectsRef.current.forEach(obj=>{

if(obj.type==="pen"){

ctx.beginPath();
ctx.moveTo(obj.x0,obj.y0);
ctx.lineTo(obj.x1,obj.y1);
ctx.strokeStyle=obj.color;
ctx.lineWidth=obj.size;
ctx.stroke();

}

if(obj.type==="rect"){

ctx.strokeStyle=obj.color;
ctx.lineWidth=obj.size;

ctx.strokeRect(
obj.x,
obj.y,
obj.width,
obj.height
);

}

});

};



/* RECEIVE DRAW */

useEffect(()=>{

socket.on("drawUpdate",(data)=>{

objectsRef.current.push(data);

drawAll();

});

},[]);



/* RECEIVE RECT */

useEffect(()=>{

socket.on("objectAdded",(data)=>{

objectsRef.current.push(data);

drawAll();

});

},[]);



/* RECEIVE CURSOR */

useEffect(()=>{

socket.on("cursorUpdate",(data)=>{

setCursors(prev=>({
...prev,
[data.userId]:data
}));

});

},[]);



/* START */

const startDraw=(e)=>{

drawing.current=true;

lastX.current=e.nativeEvent.offsetX;
lastY.current=e.nativeEvent.offsetY;

startX.current=e.nativeEvent.offsetX;
startY.current=e.nativeEvent.offsetY;

};



/* STOP */

const stopDraw=(e)=>{

drawing.current=false;

if(tool==="rect"){

const x=e.nativeEvent.offsetX;
const y=e.nativeEvent.offsetY;

const rectData={

boardId,
type:"rect",
x:startX.current,
y:startY.current,
width:x-startX.current,
height:y-startY.current,
color,
size

};

objectsRef.current.push(rectData);

/* UNDO STACK */

undoStack.current.push(rectData);
redoStack.current=[];

socket.emit("addObject",rectData);

drawAll();

}

};



/* DRAW */

const draw=(e)=>{

if(!drawing.current) return;
if(tool!=="pen") return;

const x=e.nativeEvent.offsetX;
const y=e.nativeEvent.offsetY;

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

/* UNDO STACK */

undoStack.current.push(drawData);
redoStack.current=[];

socket.emit("draw",drawData);

drawAll();

lastX.current=x;
lastY.current=y;

/* CURSOR */

socket.emit("cursorMove",{
boardId,
x,
y
});

};



/* UNDO */

const undo=()=>{

if(undoStack.current.length===0) return;

const last=undoStack.current.pop();

redoStack.current.push(last);

objectsRef.current.pop();

drawAll();

};



/* REDO */

const redo=()=>{

if(redoStack.current.length===0) return;

const obj=redoStack.current.pop();

undoStack.current.push(obj);

objectsRef.current.push(obj);

drawAll();

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

alert("Saved");

};



/* JSON TEST FUNCTION */

window.getCanvasAsJSON=()=>{

return objectsRef.current;

};



return(

<div>

<h1>Whiteboard</h1>

<button onClick={()=>setTool("pen")}>
Pen
</button>

<button
data-testid="tool-rectangle"
onClick={()=>setTool("rect")}
>
Rectangle
</button>


<button
data-testid="undo-button"
onClick={undo}
>
Undo
</button>


<button
data-testid="redo-button"
onClick={redo}
>
Redo
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



<h3>Users</h3>

<ul data-testid="user-list">

{users.map(u=>(

<li key={u.id}>
{u.name}
</li>

))}

</ul>


<br/>


<div style={{position:"relative"}}>

<canvas
ref={canvasRef}
width={900}
height={500}
style={{border:"1px solid black"}}
onMouseDown={startDraw}
onMouseMove={draw}
onMouseUp={stopDraw}
onMouseLeave={stopDraw}
/>


{Object.values(cursors).map((c,i)=>(

<div
key={i}
data-testid="remote-cursor"
style={{
position:"absolute",
left:c.x,
top:c.y,
width:"10px",
height:"10px",
background:"red",
borderRadius:"50%"
}}
/>

))}


</div>

</div>

);

}

export default BoardPage;