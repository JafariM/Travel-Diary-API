const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors/')

const auth = async (req, res, next) =>{
    // check for request header
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer')) { 
        throw new UnauthenticatedError('Authentication invalid')
    }
    const token = authHeader.split(' ')[1]
   
    //check if the token is correct
    try {
        const payLoad = jwt.verify(token, process.env.JWT_SECRET)
        //attach the user to travel routes
        req.user = {userId : payLoad.userId, name:payLoad.name}
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }
}

module.exports = auth