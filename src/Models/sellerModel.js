import mongoose from "mongoose";

import { pincodeValidator } from "../Services/pincodeValidator.js";
import { createJwt } from "../Services/webToken.js";
import { createHashPwd } from "../Services/passwordHashing.js";


// schema for sellers collection
const sellersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },

    county: {
        type: String,
        require: true,
        trim: true,
        maxLength: 50,
    },

    district: {
        type: String,
        require: true,
        trim: true,
        maxLength: 50,
    },

    pincode: {
        type: String,
        require: true,
        trim: true,
        validate(value) {
            if (!pincodeValidator(value)) {
                throw new Error("enter correct pincode")
            }
        }
    },

    mobile: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minLength: 10,
        maxLength: 10
    },


    gender: {
        type: String,
        trim: true,
        enum: ["male", "female", "other"],
        required: true
    },

    password: {
        type: String,
        trim: true,
        required: true
    },

    confirmpassword: {
        type: String,
        trim: true,
        required: true
    },

    tokens: [{
        token: {
            type: String,
            // required: true
        }
    }],

    createdAt: {
        type: Date,
        defaultt: Date.now()
    },

    totalcustomer: {
        type: Number,
        default: 0
    }

})


// middleware for generating the json web token
sellersSchema.methods.generateAuthToken = async function () {
    try {

        // creting the jw token
        let jsonToken = await createJwt(this.mobile)

        // save the token in body
        this.tokens = this.tokens.concat({ token: jsonToken })

        return jsonToken
    } catch (error) {
        console.log(error);
        response.status(400).send({
            errortitle: "error in creating authentication token",
            error: error
        })
    }
}


// middleware for hashing the password
sellersSchema.pre("save", async function (next) {
   
    console.log("in this pre method non hashed raw password is ", this.password);

    if(!this.isModified(this.password)) {
        this.password = await createHashPwd(this.password)
        // this.confirmpassword = undefined
    }

    console.log("in this pre method hashed non raw password is ", this.password);

    next()
})


// model for sellers collection
const sellersCollection = new mongoose.model("Sellers", sellersSchema)

export default sellersCollection