import Location from '../models/locationModel';
import AppError from '../utilities/appError';

var generalResponse = { messageCode: 200, message: "Success!", data: null };

export const addNewLocation = async (req, res) => {
    try {
        let newLocation = new Location(req.body);
        var saveLocation = await newLocation.save();
        res.json({ ...generalResponse, data: saveLocation });
    }
    catch (error) {
        res.json({ ...generalResponse, messageCode: 500, message: error.error });
    }
};

export const getLocations = async (req, res) => {
    try {
        var locations = await Location.find({}).populate('highlines');
        res.json({ ...generalResponse, data: locations });
    }
    catch (error) {
        res.json({ ...generalResponse, messageCode: 500, message: error.message });
        return console.error(error);
    }
};

export const getLocationById = async (req, res) => {
    try {

        validateLocation(req.params.locationId);
        var  location = await  Location.findById(req.params.locationId).populate('highlines');
        res.json({ ...generalResponse, data: location });
    }
    catch (error) {
        res.json({ ...generalResponse, messageCode: 500, message: error.message });
        return console.error(error);
    }
}
export const updateLocation = async (req, res) => {
    try {
        validateLocation(req.params.locationId);
        var locationToUpdate = await Location.findOneAndUpdate({ _id: req.params.locationId }, req.body, { new: true });
        res.json({ ...generalResponse, data: locationToUpdate });
    }
    catch (error) {
        res.json({ ...generalResponse, messageCode: 500, message: error.message });
        return console.error(error);
    }
};

const validateLocation = async (locationId) => {
    if (!locationId) {
        throw new AppError("Highline id is required.");
    }
    var location = await Location.findById(locationId);
    if (!location) {
        throw new AppError("Highline no found.", 404);
    }
}

