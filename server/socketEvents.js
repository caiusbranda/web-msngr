exports = module.exports = function(io) {  
    // Set socket.io listeners.
    io.on('connection', (socket) => {
        console.log('connection established');
  
        // On chat creation, join broadcast for the chat
        socket.on('new chat', (chat) => {
            socket.join(chat);
            console.log('joined ' + chat);
        });
    
        // On a new message in a chat, broadcast to chat that a refresh is needed
        socket.on('new message', (chat) => {
            io.sockets.in(chat).emit('refresh chat', chat);
            });
        
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
  }