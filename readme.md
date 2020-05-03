# Todo API

Todo REST API built by Node.js/Express.

## Functions and Features

- CRUD operations for todos(tasks)
- CRUD operations for users
- User authentication
- Todo pagination and ordering
- Image uploading
- Automatic testing

## Development setup

- Install Node.js and NPM.
- Under project root directory, run `npm install` to install all required packages.
- Install Mongodb and start Mongodb service
  _ Create a directory for data storage. Say: `mkdir "c:\mongo-data"`
  _ Navigate to the directory where Mongodb is install. For example: `cd "c:\program files\mongodb\server\3.6\bin"` \* Start Mongodb: `./mongod.exe --dbpath "c:\mongo-data"`
- With database server running, start app server. Still under project root directory, run `npm start`.
- To run testing cases: `npm run test`

  **_Update on 20200503_**

- Rather than installing MongoDB on local machine, you can use [cloud database](https://www.mongodb.com/cloud).
- Before running, create file `config.json` under `config` directory and set up port and MongoDB URI as below(Make sure change the password to the actual password):

```json
{
  "development": {
    "MONGODB_URI": "mongodb+srv://dbuser:<password>@cluster0-bwnpp.mongodb.net/test?retryWrites=true&w=majority",
    "PORT": "3000",
    "JWT_SECRET": "secret"
  },
  "test": {
    "MONGODB_URI": "mongodb+srv://dbuser:<password>@cluster0-bwnpp.mongodb.net/test?retryWrites=true&w=majority",
    "PORT": "3000",
    "JWT_SECRET": "secret"
  }
}
```

## API Endpoints

Assume base url is `http://localhost:3000`

- _GET_ /todos - Get all todos created by logged-in user
- _GET_ /todos/:id - List a todo by id and created by logged-in user
- _POST_ /todos - Create a todo
- _PATCH_ /todos/:id - Update a todo by logged-in user
- _DELETE_ /todos/:id - Delete a todo created by logged-in user

- _POST_ /users - Create a user
- _GET_ /users/me - Get the current logged-in user
- _POST_ /users/login - Login user
- _POST_ /users/logout - Logout user
- _POST_ /users/all/logout - Log user out from all devices
- _PATCH_ /users/me - Update the current logged-in user
- _DELETE_ /users/me - Delete the current logged-in user
- _POST_ /users/me/avatar - Upload current user's avatar image
- _DELETE_ /users/me/avatar - Delete current user's avatar image
- _GET_ /users/:id/avatar - Get user's avatar image by id

## Development Environment

- Node.js 8.9.3
- Express 4.16.3
- Mongo DB 3.6
