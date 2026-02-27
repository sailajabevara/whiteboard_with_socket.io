import { useEffect } from "react";
import socket from "./socket";

function Board() {

 const boardId = "test-room";

 useEffect(() => {

  socket.emit("joinRoom", {
   boardId: boardId
  });

 }, []);

 return (
  <div>

   <h2>Board Page</h2>

   <p>Board ID: {boardId}</p>

  </div>
 );

}

export default Board;