import http from "node:http";
import path from "node:path";

import express from "express";
import { Server } from "socket.io"

async function main() {
  const PORT = process.env.PORT || 8021;

  const app = express();
  const server = http.createServer(app);

  const io = new Server()
  io.attach(server)

  //socker IO handler
  io.on('connection',((socket) =>{
    console.log(`Socket connected (id: ${socket.id})`);
    
  }))

  // express handler
  app.use(express.static(path.resolve('./public')))
  
  app.get("/health", (req, res) =>
    res.json({ message: "Server is healthy", healthy: true }),
  );
  
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  
}

main()