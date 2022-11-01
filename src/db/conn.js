import mongoose from "mongoose";
import dotenv from "dotenv"

// configuring the env functions
dotenv.config()

// configuring the data for atlas db connection
const dbProtocol = process.env.DB_PROTOCOL
const dbAtlasUser = process.env.DB_ATLAS_USER
const dbAtlasPassword = process.env.DB_ATLAS_PASSWORD
const dbAtlasPath = process.env.DB_ATLAS_PATH
const dbAtlasPermissions = process.env.DB_ATLAS_PERMISSIONS
const dbName = process.env.DB_NAME


// configure the url for db connection
const uri = `${dbProtocol}://${dbAtlasUser}:${dbAtlasPassword}@${dbAtlasPath}/${dbName}?${dbAtlasPermissions}`

// db connection function
mongoose.connect(uri).then(
    () => {
        console.log("your db is connected");
    }
).catch(
    (err) => {
        console.log("your db is not connected");
        console.log(err);
    }
)