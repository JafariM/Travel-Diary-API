const express = require('express')
const { 
        getAllTravels,
        createTravel,
        getTravel,
        deleteTravel,
        updateTravel } = require('../controllers/travel')
const router = express.Router()

router.route('/').get(getAllTravels).post(createTravel)
router.route('/:id').get(getTravel).delete(deleteTravel).patch(updateTravel)

module.exports= router