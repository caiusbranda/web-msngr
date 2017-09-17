exports = module.exports = function(io) {  
    // Set socket.io listeners.
    io.on('connection', (socket) => {
        // console.log('connection established');
        // subscribe to all chats in list
        /* socket.on('get chats', (chats) => {
            console.log('socket: ' + socket._id);
            chats.forEach(function(chat) {
                socket.join(chat._id);
                //console.log('joined ' + chat._id);
            }); 
        });*/
        
        // On chat creation, join broadcast for the chat
        socket.on('join', (chat) => {
            socket.join(chat);
            // console.log('joined ' + chat);
        });

        // when user creates a chat, make sure it shows up for the other people
        // in the newly created chat
        socket.on('new chat', (chatData, userId) => {
            socket.to(userId).emit('new chat', chatData);
        });
    
        // On a new message in a chat, broadcast to chat that a refresh is needed
        socket.on('new message', (chat, msg) => {
            // console.log('chat:' + chat);
            // console.log('msg:' + msg);
            socket.to(chat).emit('new message', msg);
        });

        // While there are any characters typed out (the user does not have to be actively typing)
        socket.on('start typing', (chat) => {
            socket.to(chat).emit('typing', userId)
        })
        
        // when there is no message typed up
        socket.on('stop typing', (chat) => {
            socket.to(chat).emit('typing', userId)
        });

        socket.on('disconnect', () => {
            // console.log('user disconnected');
        });
    });
  }