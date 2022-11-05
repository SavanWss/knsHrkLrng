// this file for sending the sms

import axios from "axios";
//  sending the sms (sms.arihant service)
const otpSender = async (mobile, otp, apikey, clientid, senderid) => {
    console.log("first line at functtion");

    const sms = await axios.get(`https://api.arihantsms.com/api/v2/SendSMS?ApiKey=${apikey}&ClientId=${clientid}&SenderId=${senderid}&Message=Verification code for Free Recharge Unlimited is ${otp}&MobileNumbers=+91${mobile}`)

    return sms
}

export { otpSender }