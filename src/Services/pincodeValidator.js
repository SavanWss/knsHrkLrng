import pinValidator from "pincode-validator"

// function pincode validation
const  pincodeValidator =  (pincode) => {
    return pinValidator.validate(pincode)
}
export {pincodeValidator}