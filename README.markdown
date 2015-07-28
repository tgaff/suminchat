# Purpose
Chat with translation
# Usage 

To run (in development):
    npm install  
    gulp

Gulp will automatically open a web browser or 
to try, visit: localhost:8000/chat.html

You can also run `node server.js`.

In order to use translation with Microsoft Translator you need to register with Microsoft and get your CLIENT_ID and CLIENT_SECRET.  Set these as environment variables before running the server.

# Components

## Front-end
Jquery, and it's pretty darn messy at that ;-/ 
CSS was borrowed from a Firebase sample project: https://github.com/firebase/examples under MIT license.

## Data 
Firebase

## Server
node / connect

## Authentication
Authentication is provided by Google's OAuth.

## Translation
Translation is provided by the Microsoft Bing Translator API.  
