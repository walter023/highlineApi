import Location from "../models/locationModel";
import AppError from "../utilities/appError";

var generalResponse = { messageCode: 200, message: "Success!", data: null };

export const addNewLocation = async (req, res) => {
  try {
    const newLocation = new Location(req.body);
    const saveLocation = await newLocation.save();
    res.json({ ...generalResponse, data: saveLocation });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};

export const getLocations = async (req, res) => {
  try {
    validateCoordinates(req.params);
    const locations = await Location.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [
              parseFloat(req.params.lng),
              parseFloat(req.params.lat),
            ],
          },
          distanceField: "dist.calculated",
          maxDistance: 100000,
          spherical: true,
        },
      },
      { $limit: 20 },
    ]);
    if (locations.length <= 0) {
      throw new AppError(
        "Sorry, we could not find any highline in this area.",
        404
      );
    }
    const highlines = await Location.populate(locations, {
      path: "highlines",
    });
    res.json({ ...generalResponse, data: highlines });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};
export const getLocationById = async (req, res) => {
  try {
    validateLocation(req.params.locationId);
    const location = await Location.findById(req.params.locationId);
    res.json({ ...generalResponse, data: location });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};
export const getLocationbyName = async (req, res) => {
  try {
    const location = await Location.find(
       req.params.str 
        ? {
            name: { $regex: `^${req.params.str}`, $options: "i" },
          }
        : {}
    )
      .select("name description approach location")
      .limit(5);
    res.json({ ...generalResponse, data: location });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};

export const searchLocation = async (req, res) => {
  try {
    const location = await Location.findOne({
      locationName: { $regex: `^${req.params.name}`, $options: "i" },
    }).populate("highlines");
    res.json({ ...generalResponse, data: location });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};
export const updateLocation = async (req, res) => {
  try {
    validateLocation(req.params.locationId);
    const locationToUpdate = await Location.findOneAndUpdate(
      { _id: req.params.locationId },
      req.body,
      { new: true }
    ).populate("highlines");
    res.json({ ...generalResponse, data: locationToUpdate });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};

const validateLocation = async (locationId) => {
  if (!locationId) {
    throw new AppError("Highline id is required.");
  }
  const location = await Location.findById(locationId);
  if (!location) {
    throw new AppError("Highline no found.", 404);
  }
};

const validateCoordinates = (coordinates) => {
  const latitude = coordinates.lat;
  const longitude = coordinates.lng;
  if (!latitude || !longitude || longitude == "" || latitude == "") {
    throw new AppError("longitude and latitude are required.", 411);
  }
  var reg = new RegExp("-?[0-9]{1,3}[.][0-9]+");
  if (!reg.test(latitude)) {
    throw new AppError("latitude not valid.", 422);
  }
  if (!reg.test(longitude)) {
    throw new AppError("longitude not valid.", 422);
  }
};
