const Travel = require('../models/Travel')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,NotFoundError} = require('../errors')


const getAllTravels = (req,res)=>{
    res.send('all travels')
}
const getTravel = (req,res)=>{
    res.send('get a  travel')
}
const createTravel = async (req,res)=>{
    req.body.createdBy = req.user.userId
    const travel = await Travel.create(req.body)
    res.status(StatusCodes.CREATED).json({travel})
}

const updateTravel = (req,res)=>{
    res.send('update travel')
}
const deleteTravel = (req,res)=>{
    res.send('delete a travel')
}
module.exports= {
    getAllTravels,
    getTravel,
    createTravel,
    updateTravel,
    deleteTravel
}