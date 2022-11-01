import express from "express"
import sellersDocCollection from "../Models/sellerModel.js"
import { errResponseSender } from "../Services/errorResponseSender.js"

// configring the router
const selleresRegRoute = new express.Router()

/// api for sellers registration
selleresRegRoute.post("/sellers/reg", async (request, response) => {

    // retrieve data from incoming request
    const name = request.body.name
    const pincode = request.body.pincode
    const county = request.body.county
    const district = request.body.district
    const mobile = request.body.mobile
    const gender = request.body.gender
    const password = request.body.password
    const confirmpassword = request.body.confirmpassword

    // null and undefind checkin 
    const bodyDataForErrorArray = [name, pincode, county, district, mobile, gender, password, confirmpassword]
    const bodyDataForErrorKeyWordArray = ["name", "pincode", "county", "district", "mobile", "gender", "password", "confirmpassword"]

    for (const i in bodyDataForErrorArray) {
        const errorFlag = errResponseSender(response, bodyDataForErrorArray[i], `${bodyDataForErrorKeyWordArray[i]} is required`)

        if (errorFlag === true) {
            return
        }
    }

    // creating data for inserting in database  
    const sellersData = new sellersDocCollection({
        name: name,
        pincode: pincode,
        county: county,
        district: district,
        mobile: mobile,
        gender: gender,
        password: password,
        confirmpassword: confirmpassword

    })

    // creating the json web token
    try {
        await sellersData.generateAuthToken()
    } catch (error) {
        response.status(400).json({
            errortitle: "error in creating in authentication token error",
            error: error
        })

    }

    // saving the data in database
    let savedSellersData
    try {
        savedSellersData = await sellersData.save();
    } catch (error) {
        response.status(400).json({
            errortitle: "error in holding the data",
            error: error
        })
    }

    // give successfull response
    response.status(200).send({
        body: savedSellersData
    })
})



export default selleresRegRoute