const express = require("express");
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const appRoutes = require('./routes/routes');
const queryHandler = require('./controllers/query-handler');

const app = express();
const port =  process.env.PORT || 4000;
app.use(cors());
dotenv.config();
app.use(express.json());
app.set('view engine', 'html');
app.use(express.static(path.join('public')));


const server = http.createServer(app);
const io = socketio(server);

io.use( async (socket, next) => {
  try {
    await queryHandler.addSocketId({
      userId: socket.request._query['userId'],
      socketId: socket.id
    });
    next();
  } catch (error) {
          console.error(error);
        }

  io.on('connection', (socket) => {

    // Get the user's Chat list
    socket.on(`chat-list`, async (data) => {
      if (data.userId == '') {
        io.emit(`chat-list-response`, {
          error : true,
          message : "User does not exists"
        });
      }else{
        try {
          const [UserInfoResponse, chatlistResponse] = await Promise.all([
            queryHandler.getUserInfo( {
              userId: data.userId,
              socketId: false
            }),
            queryHandler.getChatList( socket.id )
            ]);
          io.to(socket.id).emit(`chat-list-response`, {
            error : false,
            singleUser : false,
            chatList : chatlistResponse
          });
          socket.broadcast.emit(`chat-list-response`,{
            error : false,
            singleUser : true,
            chatList : UserInfoResponse
          });
        } catch ( error ) {
          io.to(socket.id).emit(`chat-list-response`,{
            error : true ,
            chatList : []
          });
        }
      }
    });

    // send the messages to the user
    socket.on(`add-message`, async (data) => {
      if (data.message === '') {
        io.to(socket.id).emit(`add-message-response`,{
          error : true,
          message: "Message can't be empty"
        });
      }else if(data.fromUserId === ''){
        io.to(socket.id).emit(`add-message-response`,{
          error : true,
          message: "Something went wrong"
        });
      }else if(data.toUserId === ''){
        io.to(socket.id).emit(`add-message-response`,{
          error : true,
          message: "Select a user to chat"
        });
      }else{
        try{
          const [toSocketId, messageResult ] = await Promise.all([
            queryHandler.getUserInfo({
              userId: data.toUserId,
              socketId: true
            }),
            queryHandler.insertMessages(data)
          ]);
          io.to(toSocketId).emit(`add-message-response`,data);
        } catch (error) {
          io.to(socket.id).emit(`add-message-response`,{
            error : true,
            message : "Something went wrong"
          });
        }
      }
    });


    // Logout the user
    socket.on('logout', async (data)=>{
      try{
        const userId = data.userId;
        await queryHandler.logout(userId);
        io.to(socket.id).emit(`logout-response`,{
          error : false,
          message: "User is not logged in",
          userId: userId
        });

        socket.broadcast.emit(`chat-list-response`,{
          error : false ,
          userDisconnected : true ,
          userid : userId
        });
      } catch (error) {
        io.to(socket.id).emit(`logout-response`,{
          error : true,
          message: "Something went wrong",
          userId: userId
        });
      }
    });


    // sending the disconnected user to all socket users.
    socket.on('disconnect',async () => {
      socket.broadcast.emit(`chat-list-response`,{
        error : false ,
        userDisconnected : true ,
        userid : socket.request._query['userId']
      });

    });

  });
});

app.use(appRoutes);

server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
