import express from "express"
import dotenv from "dotenv"
import multer from "multer"

import sellersRegApi from "./src/Apis/sellersRegApi.js"
import loginApi from "./src/Apis/loginApi.js"
import otpRouter from "./src/Apis/otpApi.js"

// configuration of .env file
dotenv.config()
// configuration of multer
let upload = multer()
// configuration server express
let app = express()

// configuration of accepting body parser for json
app.use(express.json())
// configuration of accepting body parser for form-data
app.use(upload.any())
// configuration of accepting body parser of x-www-form-urlencoded
app.use(express.urlencoded(
    {extended: true}
))

// api middleware for registration of sellers
app.use(sellersRegApi)

// api middleware for login for all
app.use(loginApi)

// api for handling router
app.use(otpRouter)

app.get("/", (req,res) => {
    res.send("first heroku app")
})

// defined the server port
let serverPort = process.env.SERVER_PORT || 80

// creating the node server
app.listen(80, () => {
    console.log("node server is started");
    console.log(`on port number ${serverPort}`);
})
