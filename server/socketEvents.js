exports = module.exports = function(io) {  
    // Set socket.io listeners.
    io.on('connection', (socket) => {
        console.log('connection established');
        // subscribe to all chats in list
        socket.on('get chats', (chats) => {
            console.log('socket: ' + socket._id);
            chats.forEach(function(chat) {
                socket.join(chat._id);
                //console.log('joined ' + chat._id);
            });
        });
        
        // On chat creation, join broadcast for the chat
        socket.on('join', (chat) => {
            socket.join(chat);
            console.log('joined ' + chat);
        });
    
        // On a new message in a chat, broadcast to chat that a refresh is needed
        socket.on('new message', (chat, msg) => {
            console.log('chat:' + chat);
            console.log('msg:' + msg);
            socket.to(chat).emit('new message', msg);
        });
        
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
  }