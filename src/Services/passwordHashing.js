import bcrypt from "bcrypt"

// function for converting the password into hash
const createHashPwd = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 8)
    return hashedPassword
}

// function for verify the password with hashedPassword
const verifyHashPwd = async (password, hashedpwd) => {
    const pwdVerificationFlag = await bcrypt.compare(password, hashedpwd)
}

export { createHashPwd, verifyHashPwd }