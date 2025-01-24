const { BadRequestError,UnauthenticatedError } = require('../errors')
const User= require('../models/User')
const {StatusCodes} = require('http-status-codes')
const bycrypt = require('bcryptjs')

const register = async(req,res)=>{
    const {name,email,password} = req.body
    //Old validation
    // if(!name || !username || !password){
    //     throw new BadRequestError('Please provide name, email and password')
    // }

    const user = await User.create({...req.body})
    const token = user.createJWT() //token come from User model
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token})
}

const login = async (req,res)=>{

    const{email,password} = req.body
    
    if(!email || !password){
        throw new BadRequestError('Please provide the email and password')
    }
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    
    if(!user){
        throw new UnauthenticatedError('Invalid credential')
    }
    //check if password is correct
    const correctPassword = await user.comparePassword(password) //comparePassword function is initiated in user model
    if(!correctPassword){
        throw new UnauthenticatedError('Invalid credential') 
    }
    const token = user.createJWT() // createJWT function is initiated in user model
    res.status(StatusCodes.OK).json({user:{name:user.name},token})
}

module.exports = {
    register,
    login
}