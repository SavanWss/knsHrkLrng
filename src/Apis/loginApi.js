// this file for login process of sellers and Admin
import expres from "express";

import sellersCollection from "../Models/sellerModel.js";
import otpCollection from "../Models/otpModel.js";

import { errResponseSender } from "../Services/errorResponseSender.js";
import { verifyHashPwd } from "../Services/passwordHashing.js";

// configure the login router
let loginRouter = new expres.Router()

// api for login process
loginRouter.post("/login", async (request, response) => {
try {
    
    //  retrieve data for login process
    const mobile = request.body.mobile
    const enteredOtp = request.body.otp

    // null and undefind checking 
    const bodyDataForErrorArray = [mobile, enteredOtp]
    const bodyDataForErrorKeyword = ["mobile", "password"]

    for (const i in bodyDataForErrorArray) {

        const errFlag = errResponseSender(response, bodyDataForErrorArray[i], `${bodyDataForErrorKeyword[i]} is required`)
        if (errFlag === true) {
            return
        }

    }

    // get the data accoring to body data requesr
    let loggedInUserData = await sellersCollection.findOne({mobile: mobile})
    
    // loggedin user existance verification 
    if(loggedInUserData === null || loggedInUserData === undefined || loggedInUserData === {}) {
        response.status(401).send({
            status: "failed",
            msg: "user does not exist"
        })
        return
    }
    console.log(loggedInUserData);
    
    // get last sened otp from user
    const allSendedOtp = await otpCollection.find({mobile:mobile})
    const lastSendedOtp = allSendedOtp[allSendedOtp.length - 1]


    if(lastSendedOtp === null || lastSendedOtp === undefined || lastSendedOtp == {}) {
        console.log("in this if condition");
        response.status(401).send({
            status: "failed",
            error: "otp validation failed"
        })
        return
    }

    // last sended otp is for login pupose verification
    if(lastSendedOtp.purpose !== "signIn") {
        response.status(401).send({
            status: "failed",
            error: "otp validation failed"
        })
        return
    }

    //  time verification of sended otp (validate for only 30 second)
    const currentTime = new Date().getTime()
    const lastSendedOtpTime = lastSendedOtp.createdAt.getTime()

    if(currentTime - lastSendedOtpTime >= 60000) {
        response.status(401).send({
            status: "failed",
            error: "otp validatiorn is failed"
        })
        return
    }

    // otp ssatus verification
    if (lastSendedOtp.status === "Expired") {
        response.status(401).send({
            status: "failed",
            error: "otp verification failed"
        })
        return
    }

    // user entered otp vertificartion 

    let otpVerificationFlag = await verifyHashPwd(enteredOtp, lastSendedOtp.hashedOtp)

    console.log("otp verification flag", otpVerificationFlag);

    if(otpVerificationFlag === true) {

        // updating the status of otp to expired 
        await otpCollection.updateMany({ mobile: { $eq: mobile } }, {$set: { "status" : "Expired" }})
        // console.log(response);
        response.cookie("NSToken", loggedInUserData.tokens[0].token)
        response.status(200).send({
            status: "success",
            body: {
                name: loggedInUserData.name,
                county: loggedInUserData.county,
                district: loggedInUserData.district,
                pincode: loggedInUserData.pincode,
                mobile: loggedInUserData.mobile,
                gender: loggedInUserData.gender,
                role: loggedInUserData.role,
                totalcustomer: loggedInUserData.totalcustomer,
                token: loggedInUserData.tokens[0].token
            }
        })
        return
    } else{
        response.status(401).send({
            status: "failed",
            error: "otp validation is failed"
        })
        return
    }

    
    // users password verification
    // let pwdVerificationFlag = await verifyHashPwd(password, loggedInUserData.password )

    /*
    if(pwdVerificationFlag === true) {
        delete(loggedInUserData["password"])
        console.log(loggedInUserData.password);
        response.cookie("NSToken", loggedInUserData.tokens[0].token)
        response.status(200).send({
            status: "success",
            body: {
                name: loggedInUserData.name,
                county: loggedInUserData.county,
                district: loggedInUserData.district,
                pincode: loggedInUserData.pincode,
                mobile: loggedInUserData.mobile,
                gender: loggedInUserData.gender,
                role: loggedInUserData.role,
                totalcustomer: loggedInUserData.totalcustomer,
                token: loggedInUserData.tokens[0].token
            }
        })
        return
    } else {
        response.status(400).send({
            status: "failed",
            msg: "login credential is invalid",
        })
        return
    }
    */
} catch (error) {
    response.status(400).send({
        status: "failed",
        error : error
    })
}
})

export default loginRouter