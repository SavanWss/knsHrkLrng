// function for sebding error message as an response

function errResponseSender(response, value, errMag) {
    if (value === undefined || value === "") {
        response.status(400).send({
            error: errMag
        })
        return true
    } else {
        return false
    }
    
}
export {errResponseSender}