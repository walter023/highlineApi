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
        const locations = await Location.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [parseFloat(req.params.long), parseFloat(req.params.latt)] },
                    distanceField: "dist.calculated",
                    maxDistance: 100000,
                    num: 20,
                    spherical: true
                }
            }
        ]);
        Location.populate(locations, { path: "highlines" }, (err, result) => {
            if (err) { throw new AppError(err); }
            res.json({ ...generalResponse, data: result });
        });
    }
    catch (error) {
        res.json({ ...generalResponse, messageCode: 500, message: error.message });
        return console.error(error);
    }
};

export const getLocationById = async (req, res) => {
    try {
        validateLocation(req.params.locationId);
        var location = await Location.findById(req.params.locationId).populate('highlines');
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
        var locationToUpdate = await Location.findOneAndUpdate({ _id: req.params.locationId },
            req.body, { new: true }).populate('highlines');
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

