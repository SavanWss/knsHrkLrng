import express from "express";

import otpCollection from "../Models/otpModel.js";
import sellersCollection from "../Models/sellerModel.js";

import { errResponseSender } from "../Services/errorResponseSender.js";
import { generateOtp } from "../Services/otpGenerator.js";
import { otpSender } from "../Services/otpSender.js";


// configure the router for otp Sender Api
let otpRouter = new express.Router()

otpRouter.post("/otp", async (request, response) => {
    console.log("headers ==> ", request.headers);
    try {
        const otpNumber = request.body.mobile
        const otpPurpose = request.body.purpose

        // mobile number null verification
        const mobileNullErrFlag = errResponseSender(response, otpNumber, "mobile number is required")

        if (mobileNullErrFlag === true) {
            return
        }

        // mobile number length verification
        if (otpNumber.length !== 10) {
            response.status(400).send({
                status: "failed",
                error: "mobile number must be 10 number"
            })
            return
        }

        // getting the data accordiing to number
        // const detailOfUser = await sellersCollection.findOne({mobile: otpNumber})

        // // user existance verification 
        // if (detailOfUser === undefined || detailOfUser === null || detailOfUser === {}) {
        //     response.status(400).send({
        //         status: "failed",
        //         error: "user doesn't exist"
        //     })
        //     return
        // } 

        /// 30 second gap verification for sended 

        // get last sended otp details of user
        const allSendedOtp = await otpCollection.find({ mobile: otpNumber })
        const lastSendedOtpFromUser = allSendedOtp[allSendedOtp.length - 1]
        console.log("all sended otp", allSendedOtp);

        if (lastSendedOtpFromUser !== undefined) {
            // purpose verification
            if (lastSendedOtpFromUser.purpose === otpPurpose) {
                // time gap verification (min 30 sec)
                const currentTime = new Date().getTime()
                const lastSendedOtpTime = lastSendedOtpFromUser.createdAt.getTime()
                
                if ((currentTime - lastSendedOtpTime) <= 30000) {
                    response.status(400).send({
                        status: "failed",
                        error: "you cant get the new otp within 30 second"
                    })
                    return
                }

            }
        }

        // otp status updation to Expired
        await otpCollection.updateMany({ mobile: { $eq: otpNumber } }, { $set: { "status": "Expired" } })

        // generate the otp 
        let generatedOtp = generateOtp(6, true, false, false, false)

        // create the otp data to save otp in db
        let otpData = new otpCollection({
            mobile: otpNumber,
            otp: generatedOtp,
            purpose: otpPurpose
        })
        "mobile, otp, apikey, clientid, senderid"

        // retrieve the configuration of arihant sms service for sending the sms

        const apiKey = process.env.SMS_API_KEY
        const clientId = process.env.SMS_CLIENT_ID
        const senderId = process.env.SMS_SENDER_ID

        const sms = await otpSender(otpNumber,generatedOtp,apiKey,clientId,senderId)
        
        console.log("sended sms detail ===>", sms.data);
        console.log("sms.data.Data[0].MessageErrorCode === ",sms.data.Data[0].MessageErrorCode);
        console.log("sms.data.ErrorCode === ",sms.data.ErrorCode);

        if(sms.data.Data[0].MessageErrorCode !== 0 || sms.data.ErrorCode !== 0) {
            response.satus(401).send({
                status : "failed",
                error: "unknown error to send the otp"
            })
        }

        let savedOtpData = await otpData.save()
        console.log("otp sended successfully");
        response.status(200).send({
            status: "succes",
            msg: "otp sucsessfully sended on sms",
            body: savedOtpData
        })        

    } catch (error) {
        response.status(400).send({
            status: "failed",
            error: error
        })
    }
})

export default otpRouter