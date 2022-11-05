import mongoose from "mongoose";

import { createHashPwd } from "../Services/passwordHashing.js";

const otpCollectionSchema = new mongoose.Schema({
    mobile: {
        type: String,
        minLength: 10,
        maxLength: 10,
        trim: true,
        required: true,
        validate(value) {
            if(parseInt(value) === null) {
                throw new Error("mobile must contaion only digits")
            }
        }
    },

    otp: {
        type: String,
        trim: true,
        required: true
    },

    hashedOtp: {
        type: String,
        trim: true,
        // required: true
    },

    purpose: {
        type: String,
        trim: true,
        required: true,
        enum: ["signIn", "signUp"]
    },

    status: {
        type: String,
        trim: true,
        required: true,
        enum: ["Active", "Expired"],
        default: "Active"
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
}) 

// middleware for hashing the otp
otpCollectionSchema.pre("save", async function (next) {

    if (!this.isModified(this.otp)) {
        const hashOtp = await createHashPwd(this.otp)
        this.hashedOtp = hashOtp
        this.createdAt = Date.now()
        this.status = "Active"
        // this.otp = undefined
        
        return hashOtp
    }
    next()
})

const otpCollection = new mongoose.model("otps", otpCollectionSchema)

export default otpCollection