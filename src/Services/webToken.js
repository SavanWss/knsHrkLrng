import jwt from "jsonwebtoken"


// function for creating the json web token
const createJwt = async (unique_id) => {
    // creating the json web token
    const jsnToken = await jwt.sign(unique_id, process.env.JWT_SECRET_KEY) 
    return jsnToken
}

// function for verify the json web token
const verifyJwt = async (web_token) => {
    // verifying the json web token
    const verificationFlag = await jwt.verify(web_token, process.env.JWT_SECRET_KEY)
    return verificationFlag
}

export {createJwt, verifyJwt}