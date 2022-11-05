import mongoose from "mongoose";

import { pincodeValidator } from "../Services/pincodeValidator.js";
import { createJwt } from "../Services/webToken.js";
import { createHashPwd } from "../Services/passwordHashing.js";


// schema for sellers collection
const sellersCollectionSchema = new mongoose.Schema({
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
        maxLength: 10,
        validate(value) {
            if(parseInt(value) === null) {
                throw new Error("mobile must contaion only digits")
            }
        }
    },

    gender: {
        type: String,
        trim: true,
        enum: ["male", "female", "other"],
        required: true
    },

    role: {
        type: String,
        trim: true,
        enum: ["seller"],
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
sellersCollectionSchema.methods.generateAuthToken = async function () {
    try {

        // creting the jw token
        let jsonToken = await createJwt(this.mobile)

        // save the token in body
        this.tokens = this.tokens.concat({ token: jsonToken })

        return jsonToken
    } catch (error) {
        console.log(error);
        response.status(400).send({
            status: "failed",
            errortitle: "error in creating authentication token",
            error: error
        })
        return
    }
}


// middleware for hashing the password
sellersCollectionSchema.pre("save", async function (next) {

    // if(!this.isModified(this.password)) {
    //     this.password = await createHashPwd(this.password)
    //     this.createdAt = new Date()
    //     // this.confirmpassword = undefined
    // }

    next()
})

// model for sellers collection
const sellersCollection = new mongoose.model("Sellers", sellersCollectionSchema)

export default sellersCollection