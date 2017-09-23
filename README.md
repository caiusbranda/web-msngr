# web-msngr

web-msngr is personal messaging webapp (akin to Facebook Messenger or WhatsApp Web) designed using the MEAN stack and Socket.io.

![Welcome Screen](https://i.imgur.com/im8OgzQ.png?)

## Live demo

A live demo of the application can be found hosted using Google Cloud [here](http://web-msngr.jafer.ca).

You can get started by signing up, adding a friend to your friends list (try adding dummy@test.com if you want to add a dummy account), and then create a chat!

## Features

### Server-side user information

Using a MongoDB instance, all information is stored server side and populated from the NoSQL database. This allows for features such as:

* Creating an account
* Adding friends to your friends list
* Creating multiple group chats and saving them

![alt text](https://i.imgur.com/vZvsJan.gif)

![alt text](https://i.imgur.com/j6RyK6e.gif)

### Socket.io implementation

Using socket broadcasting and emitting, everything in web-msngr happens in real time:

* Messages sent between users appear instantly
* Chats created by one user appear immediately for all participants
* Notifications from different chats work seamlessly together

![alt text](https://i.imgur.com/idhiNd0.gif)

![alt text](https://i.imgur.com/8QeTZrE.gif)
## Installation

After clone the repository, you'll need to set the following environment variables:

* mongdb: the connection string for your mongo database
* username: the username for your database
* password: the password for your database
* secret: the secret key you want to use to hash user passwords

You may choose to add a `.env` file with these file types or you can update the `app.yaml` file if you wil be deploying using google cloud.

You can then run `npm install` to install all dependencies and build the angular front end. By default, if no port is specified `npm start` will start an instance of web-msngr on `localhost:3000`.