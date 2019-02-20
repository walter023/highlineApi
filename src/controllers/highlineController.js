import Highline from '../models/highlineModel';
import Location from '../models/locationModel';
import AppError from '../utilities/appError';
import fs from 'fs';

var generalResponse = { messageCode: 200, message: "Success!", data: null };

export const addNewHighline = async (req, res) => {
    try {
        var location = await Location.findById(req.body.location);
        if (!location) {
            throw new AppError("location no found", 404);
        }
        let newHighline = new Highline(req.body);
        var saveHighline = await newHighline.save();
        res.json({ ...generalResponse, data: saveHighline });
    }
    catch (error) {
        res.json({ ...generalResponse, messageCode: error.status || 500, message: error.message });
        console.log(error);
    }
};

export const getsHighlines = async (req, res) => {
    try {
        var highlines = await Highline.find({});
        res.json({ ...generalResponse, data: highlines });
    }
    catch (error) {
        res.json({ ...generalResponse, messageCode: 500, message: error.message });
        return console.error(error);
    }
};

export const getHighlineById = async (req, res) => {
    try {
        validateHighline(req.params.highlineId)
        res.json({ ...generalResponse, data: highline });
    }
    catch (error) {
        res.json({ ...generalResponse, messageCode: error.status || 500, message: error.message });
        return console.error(error);
    }
};

export const updateHighline = async (req, res) => {
    try {
        validateHighline(req.params.highlineId)
        var highlineUpdated = await Highline.findOneAndUpdate({ _id: req.params.highlineId }, req.body, { new: true });
        res.json({ ...generalResponse, data: highlineUpdated });
    }
    catch (error) {
        res.json({ ...generalResponse, messageCode: 500, message: error.message });
        return console.error(error);
    }
};

export const deleteHighline = async (req, res) => {
    try {
        validateHighline(req.params.highlineId)
        await Highline.deleteOne({ _id: req.params.highlineId });
        res.json({ ...generalResponse });
    }
    catch (error) {
        res.json({ ...generalResponse, messageCode: 500, message: error.message });
        return console.error(error);
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
            throw new AppError("Highline no found.", 404)
        }
        var imagesUrl = higlineFound.imagesUrl || [];
        for (let file of req.files) {
            imagesUrl.push(file.path);
        }
        var highlineToupdate = await Highline.findOneAndUpdate({ _id: req.params.highlineId },
            { imagesUrl: imagesUrl }, { new: true });

        res.json({ ...generalResponse, data: highlineToupdate });
    }
    catch (error) {
        res.json({ ...generalResponse, messageCode: error.status || 500, message: error.message });
        console.log(error);
    }
};

export const deleteImage = async (req, res) => {
    try {
        var imagePath = req.body.image;
        var highlineId = req.params.highlineId;
        if (!highlineId || !imagePath)
            throw new AppError("Highline id and image url are required.");

        var higlineFound = await Highline.findById(highlineId);
        if (!higlineFound)
            throw new AppError("HIghline no found.", 404)

        var imagesUrl = higlineFound.imagesUrl;
        if (!imagesUrl)
            throw new AppError("image no found.", 404)

        imagesUrl = imagesUrl.filter(urlValue => urlValue != imagePath);

        await fs.unlink(imagePath, resultHandler);

        var highlineToupdate = await Highline.findOneAndUpdate({ _id: req.params.highlineId },
            { imagesUrl: imagesUrl }, { new: true });

        res.json({ ...generalResponse, data: highlineToupdate });
    }
    catch (error) {
        res.json({ ...generalResponse, messageCode: error.status || 500, message: error.message });
        console.log(error);
    }
};

const validateHighline = async (highlineId) => {
    if (!highlineId) {
        throw new AppError("Highline id is required.");
    }
    var higlineFound = await Highline.findById(highlineId);
    if (!higlineFound) {
        throw new AppError("Highline no found", 404);
    }
};

const resultHandler = (error) => {
    if (error) {
        throw new AppError(error);
    } else {
        generalResponse = { ...generalResponse, message: "file deleted" };
    }
}