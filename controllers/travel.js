const Travel = require('../models/Travel')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,NotFoundError} = require('../errors')


const getAllTravels = async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const parsedLimit = parseInt(limit, 10) || 5; // Ensure it's a number
    try {
        const skip = (page - 1) * limit;

        const travels = await Travel.find({ createdBy: req.user.userId })
            .sort('-visitDate')
            .skip(skip)
            .limit(parsedLimit);

        const totalTravels = await Travel.countDocuments({ createdBy: req.user.userId });
        const totalPages = Math.ceil(totalTravels / parsedLimit);

        res.status(StatusCodes.OK).json({
            travels,
            totalTravels,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        console.error('Error fetching travels:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Server error' });
    }
};

const getTravel = async (req,res)=>{
    // const {
    //     user: { userId },
    //     params: { id: travelId },
    //   } = req
    const traveId = req.params.id
    const userId = req.user.userId //user obj is added to request in auth middleware

    const travel = await Travel.findOne({
        _id: traveId,
        createdBy: userId
    }) 
  
    if(!travel){
        throw new NotFoundError(`No travel with that id` )
    }
    res.status(StatusCodes.OK).json({travel})
}

const createTravel = async (req,res)=>{
    req.body.createdBy = req.user.userId
    const travel = await Travel.create(req.body)
    res.status(StatusCodes.CREATED).json({travel})
}

const updateTravel = async (req,res)=>{
    const traveId = req.params.id
    const userId = req.user.userId 
    const{placeName,location,visitDate} = req.body;
    
    if(placeName === "" || location === ""|| visitDate === ""){
        
        throw new BadRequestError('Place name, location and visit date can not be empty ')
    }

    const travel = await Travel.findByIdAndUpdate({
        _id:traveId,
        createdBy: userId
    },req.body,{
        new:true,
        runValidators: true
    })
   
    if(!travel){
        throw new NotFoundError(`No travel with the id ${traveId}` )
    }
    res.status(StatusCodes.OK).json({travel})

}
const deleteTravel = async (req,res)=>{
    const traveId = req.params.id
    const userId = req.user.userId

    const travel = await Travel.findByIdAndRemove({
        _id : traveId,
        createdBy: userId
    })
    if(!travel){
        throw new NotFoundError(`No travel with the id ${traveId}` )
    }
    res.status(StatusCodes.OK).send()
}
module.exports= {
    getAllTravels,
    getTravel,
    createTravel,
    updateTravel,
    deleteTravel
}