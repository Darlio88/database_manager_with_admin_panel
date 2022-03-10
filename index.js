import mongoose from 'mongoose';
import express from "express";

//importing user models
import User from "./models/user.js"


//imports required in order to use the admin-bro user interface
import AdminBro from "admin-bro"
import adminBroMongoose from "admin-bro-mongoose"
import formidableMiddleware from 'express-formidable'
import AdminBroExpressjs from 'admin-bro-expressjs'


import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv";
dotenv.config();

// We have to tell AdminBro that we will manage mongoose resources with it
AdminBro.registerAdapter(adminBroMongoose)

//defining the express server 
const app = express()
app.use(formidableMiddleware());


// Using the parsing middleware
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

// Import the routes
import userRoutes from "./routes/user.js"

// Using routes
app.use('/api', userRoutes) 


// Pass all configuration settings to AdminBro
const adminBro = new AdminBro({
  resources: [User],
  rootPath: '/admin',
})


// Build and use a router which will handle all AdminBro routes
const router = AdminBroExpressjs.buildRouter(adminBro)
app.use(adminBro.options.rootPath, router)

const port = process.env.PORT || 5000






const run = async () => {
  // connecting the database to the express server
  await mongoose.connect(process.env.DATABASE_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }).then(() => {
    console.log("the app is connected to mongo database")
  }).catch((error) => {
    console.log(`failed to connect to the database and the error is ${error.message}`)
  })

  // Starting a server 
    await app.listen(port, () => {
  console.log(`App is running at ${port}`)
})

}
run()