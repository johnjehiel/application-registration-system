const sendToken = (user, statusCode, res) => {

    //Creating JWT Token
    const token = user.getJwtToken();

    //setting cookies 
    const options = {
        expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRES_TIME  * 24 * 60 * 60 * 1000 
            ),
        httpOnly: true,
        // secure: true, //process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
        // sameSite: 'Strict'
    }

    res.status(statusCode)
    .cookie('token', token, options)
    .json({
        success: true,
        token,
        user
    })
}

module.exports = sendToken;