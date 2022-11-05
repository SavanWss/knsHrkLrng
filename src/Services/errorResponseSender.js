// function for sebding error message as an response

const errResponseSender = (response, value, errMag) => {
    if (value === undefined || value === "" || value === null) {
        response.status(400).send({
            status: "faild",
            msg: errMag
        })
        return true
    } else {
        return false
    }
    
}
export {errResponseSender}