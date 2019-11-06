import Location from '../models/locationModel';
import AppError from '../utilities/appError';

var generalResponse = { messageCode: 200, message: "Success!", data: null };

export const addNewLocation = async (req, res) => {
    try {
        let newLocation = new Location(req.body);
        let saveLocation = await newLocation.save();
        res.json({ ...generalResponse, data: saveLocation });
    }
    catch (error) {
        res.status(error.status || 500)
            .json({
                error: error.message
            });
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
            if (result.length <= 0){ throw new AppError('Sorry not highlines around you.', 404);}
            res.json({ ...generalResponse, data: result });
        });
    }
    catch (error) {
        res.status(error.status || 500)
            .json({
                error: error.message
            });
    }
};
export const getLocationById = async (req, res) => {
    try {
        validateLocation(req.params.locationId);
        const location = await Location.findById(req.params.locationId);
        res.json({ ...generalResponse, data: location });
    }
    catch (error) {
        res.status(error.status || 500)
            .json({
                error: error.message
            });
    }
};
export const getLocationNames = async (req, res) => {
    try {
        const location = await Location
            .find({ locationName: { $regex: `^${req.params.name}`, $options: 'i' } })
            .select('locationName description approach location').limit(5);
        res.json({ ...generalResponse, data: location });
    }
    catch (error) {
        res.status(error.status || 500)
            .json({
                error: error.message
            });
    }
};
export const updateLocation = async (req, res) => {
    try {
        validateLocation(req.params.locationId);
        const locationToUpdate = await Location.findOneAndUpdate({ _id: req.params.locationId },
            req.body, { new: true }).populate('highlines');
        res.json({ ...generalResponse, data: locationToUpdate });
    }
    catch (error) {
        res.status(error.status || 500)
            .json({
                error: error.message
            });
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

