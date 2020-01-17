import Highline from "../models/highlineModel";
import Location from "../models/locationModel";
import AppError from "../utilities/appError";
import { deleteS3Images } from "../utilities/storageImage";

var generalResponse = { messageCode: 200, message: "Success!", data: null };

export const addNewHighline = async (req, res) => {
  try {
    let location = await Location.findById(req.body.locationId);
    if (!location) {
      throw new AppError("location no found", 404);
    }
    const newHighline = new Highline(req.body);
    const saveHighline = await newHighline.save();
    location.highlines.push(saveHighline._id);
    await Location.findOneAndUpdate({ _id: location._id }, location);

    res.json({ ...generalResponse, data: saveHighline });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message
    });
  }
};

export const getsHighlines = async (req, res) => {
  try {
    const highlines = await Highline.find({});
    res.json({ ...generalResponse, data: highlines });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message
    });
  }
};

export const getHighlineById = async (req, res) => {
  try {
    await validateHighline(req.params.highlineId);
    await validateLocation(req.params.locationId);
    const highline = await Location.findById(req.params.locationId).populate({
      path: "highlines",
      match: { _id: { $eq: req.params.highlineId } }
    });
    res.json({ ...generalResponse, data: highline });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message
    });
  }
};

export const updateHighline = async (req, res) => {
  try {
    validateHighline(req.params.highlineId);
    var highlineUpdated = await Highline.findOneAndUpdate(
      { _id: req.params.highlineId },
      req.body,
      { new: true }
    );
    res.json({ ...generalResponse, data: highlineUpdated });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message
    });
  }
};

export const deleteHighline = async (req, res) => {
  try {
    validateHighline(req.params.highlineId);
    await Highline.deleteOne({ _id: req.params.highlineId });
    res.json({ ...generalResponse });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message
    });
  }
};

export const addNewImage = async (req, res) => {
  try {
    var highlineId = req.params.highlineId;
    if (!highlineId) {
      throw new AppError("Highline id is required.");
    }
    var higlineFound = await Highline.findById(highlineId);
    if (!higlineFound) {
      throw new AppError("Highline no found.", 404);
    }
    var imagesUrl = higlineFound.imagesUrl || [];
    for (let file of req.files) {
      imagesUrl.push(file.location);
    }
    var highlineToupdate = await Highline.findOneAndUpdate(
      { _id: req.params.highlineId },
      { imagesUrl: imagesUrl },
      { new: true }
    );

    res.json({ ...generalResponse, data: highlineToupdate });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message
    });
  }
};

export const deleteImages = async (req, res) => {
  try {
    var images = req.body.images;
    var highlineId = req.params.highlineId;
    if (!highlineId || images.length < 1)
      throw new AppError("Highline id and image(s) url are required.");

    var higlineFound = await Highline.findById(highlineId);

    if (!higlineFound) throw new AppError("HIghline no found.", 404);

    if (higlineFound.imagesUrl.length < 1)
      throw new AppError("no images found.", 404);

    images = higlineFound.imagesUrl.filter(function(e) {
      return this.indexOf(e) >= 0;
    }, images);

    if (images.length < 1) throw new AppError("no image found.", 404);

    deleteS3Images(images);
    images = higlineFound.imagesUrl.filter(function(e) {
      return this.indexOf(e) < 0;
    }, images);

    var highlineToupdate = await Highline.findOneAndUpdate(
      { _id: req.params.highlineId },
      { imagesUrl: images },
      { new: true }
    );

    res.json({ ...generalResponse, data: highlineToupdate });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message
    });
  }
};

const validateHighline = async highlineId => {
  if (!highlineId) {
    throw new AppError("Highline id is required.");
  }
  var higlineFound = await Highline.findById(highlineId);
  if (!higlineFound) {
    throw new AppError("Highline no found", 404);
  }
};

const validateLocation = async locationId => {
  if (!locationId) {
    throw new AppError("location id is required.");
  }
  var locationFound = await Location.findById(locationId);
  if (!locationFound) {
    throw new AppError("Highline no found", 404);
  }
};
