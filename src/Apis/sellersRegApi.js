// this file for sellers registration

import express from "express"

import otpCollection from "../Models/otpModel.js"
import sellersDocCollection from "../Models/sellerModel.js"

import { errResponseSender } from "../Services/errorResponseSender.js"
import { verifyHashPwd } from "../Services/passwordHashing.js"

// configring the router
const selleresRegRoute = new express.Router()

/// api for sellers registration
selleresRegRoute.post("/reg/seller", async (request, response) => {
    console.log("in first line register office");
    // try {
        console.log("in try block");
        // retrieve data from incoming request
        const name = request.body.name
        const pincode = request.body.pincode
        const county = request.body.county
        const district = request.body.district
        const mobile = request.body.mobile
        const gender = request.body.gender
        const role = request.body.role

        const otp = request.body.otp
        console.log("in try block1");
        // null and undefind checking 
        const bodyDataForErrorArray = [name, pincode, county, district, mobile, gender, role, otp]
        const bodyDataForErrorKeyWordArray = ["name", "pincode", "county", "district", "mobile", "gender", "role", "otp"]

        for (const i in bodyDataForErrorArray) {
            const errorFlag = errResponseSender(response, bodyDataForErrorArray[i], `${bodyDataForErrorKeyWordArray[i]} is required`)

            if (errorFlag === true) {
                return
            }
        }

        // checking the role request of the client
        if (role === "admin") {
            response.status(400).json({
                status: "failed",
                error: "users are not enroll as a admin"
            })
            return
        }

        // number uniqueness validation 
        const user = await sellersDocCollection.find({mobile: mobile}) 
        console.log("out side user",  user);
        console.log(user.length !== 0);
        if (user.length !== 0) {
            console.log("mobile", mobile);
            console.log("user === ", user);
            response.status(400).send({
                status: "failed",
                error: "user already exist"
            })
            return
        }

        // password checking
        // if (password !== confirmpassword) {
        //     response.status(400).json({
        //         error: "passwords not matched"
        //     })
        //     return
        // }
        
        // get last otp from user
        const allOtpFromUser = await otpCollection.find({ mobile: mobile })
  
        const lastSendedOtpFromUser = allOtpFromUser[allOtpFromUser.length - 1]
   
        // otp nullification verification
        if (lastSendedOtpFromUser === undefined || lastSendedOtpFromUser === null || lastSendedOtpFromUser === {}) {
            console.log("nulling validatrion is failed");
            response.status(400).send({
                status: "failed",
                error: "otp verificartion failled"
            })
            return
        }

        // last sended otp purpose validation
        if (lastSendedOtpFromUser.purpose !== "signUp") {
            console.log(lastSendedOtpFromUser.purpose);
            console.log(lastSendedOtpFromUser.purpose === "signUp");
            console.log("type validation failed");
            response.status(400).send({
                status: "failed",
                error: "otp verification failed"
            })
            return
        }

        // otp timing validastion (maximum 30 second)
        const currntTime = new Date().getTime()
        const otpSentTime = lastSendedOtpFromUser.createdAt.getTime()

        if ((currntTime - otpSentTime) >= 60000) {
            console.log("for more than 1 minute time diiference");
            response.status(400).send({
                status: "failed",
                error: "otp validation failed"
            })
            return
        }

        // otp status validation 
        if(lastSendedOtpFromUser.status === "Expired") {
            response.status(400).send({
                status: "failed",
                error: "otp validation is failed"
            })
            return
        }

        // otp validation
        const otpVerificationFlag = await verifyHashPwd(otp, lastSendedOtpFromUser.hashedOtp)
        if (otpVerificationFlag === false) {
            console.log("enteredotp is false");
            response.status(400).send({
                status: "failed",
                error: "otp velidation failed"
            })
            return
        } 
        console.log("otp validation is successfull");

        // change the status of otp
        await otpCollection.updateMany({ mobile: { $eq: mobile } }, {$set: { "status" : "Expired" }})

        // creating data for inserting in database  
        const sellersData = new sellersDocCollection({
            name: name,
            pincode: pincode,
            county: county,
            district: district,
            mobile: mobile,
            gender: gender,
            role: role,

        })

        // creating the json web token
        let jsonWebToken;
        try {
            jsonWebToken = await sellersData.generateAuthToken()
        } catch (error) {
            response.status(400).json({
                status: "failed",
                errortitle: "error in creating in authentication token error",
                error: error
            })
            return
        }

        // saving the data in database
        let savedSellersData
        try {
            savedSellersData = await sellersData.save();
        } catch (error) {
            response.status(400).json({
                status: "failed",
                errortitle: "error in holding the data",
                error: error
            })
            return
        }

        // give successfull response
        response.cookie("NKSToken", jsonWebToken)
        response.status(200).send({
            status: "success",
            body: savedSellersData
        })
    // } catch (error) {
    //     response.status(400).send({
    //         status: "failed",
    //         error: error
    //     })
    // }

})



export default selleresRegRoute