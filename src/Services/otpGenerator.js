import otpGenerator from "otp-generator";

// generate the otp function
const generateOtp = (length, digit, uppercasechar, lowercasechar, specialChar) => {
    let otp = otpGenerator.generate(length, {
        digits: digit,
        upperCaseAlphabets: uppercasechar,
        lowerCaseAlphabets: lowercasechar,
        specialChars: specialChar
    })
    return otp
}

export {generateOtp}