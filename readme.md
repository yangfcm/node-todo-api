# Todo API

Todo REST API built by Node.js/Express.

## Functions and Features
* CRUD operations for todos(tasks)
* CRUD operations for users
* User authentication
* Todo pagination and ordering
* Image uploading
* Automatic testing

## Development setup
* Install Node.js and NPM.
* Under project root directory, run `npm install` to install all required packages.
* Install Mongodb and start Mongodb service
	* Create a directory for data storage. Say: `mkdir "c:\mongo-data"`
	* Navigate to the directory where Mongodb is install. For example: `cd "c:\program files\mongodb\server\3.6\bin"`
	* Start Mongodb: `./mongod.exe --dbpath "c:\mongo-data"`
* With database server running, start app server. Still under project root directory, run `npm start`.
* To run testing cases: `npm run test`

## API Endpoints
Assume base url is `http://localhost:3000`
* *GET* /todos - Get all todos created by logged-in user
* *GET* /todos/:id - List a todo by id and created by logged-in user
* *POST* /todos - Create a todo
* *PATCH* /todos/:id - Update a todo by logged-in user
* *DELETE* /todos/:id - Delete a todo created by logged-in user

* *POST* /users - Create a user
* *GET* /users/me - Get the current logged-in user
* *POST* /users/login - Login user
* *POST* /users/logout - Logout user
* *POST* /users/all/logout - Log user out from all devices
* *PATCH* /users/me - Update the current logged-in user
* *DELETE* /users/me - Delete the current logged-in user
* *POST* /users/me/avatar - Upload current user's avatar image
* *DELETE* /users/me/avatar - Delete current user's avatar image
* *GET* /users/:id/avatar - Get user's avatar image by id

## Development Environment
* Node.js 8.9.3
* Express 4.16.3
* Mongo DB 3.6