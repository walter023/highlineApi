import User from '../models/userModel';
import AppError from '../utilities/appError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
require('dotenv').config();

var generalResponse = { messageCode: 200, message: "Success!", data: null };

export const signUp = async (req, res) => {
    try {
        var user = await User.find({ email: req.body.email });
        if (user.length >= 1)
            throw new AppError('email already exsit.', 409);

        await bcrypt.hash(req.body.password, 10, (error, hash) => {
            if (error)
                throw new AppError(error);

            var userData = new User({ email: req.body.email, password: hash });
            userData.save();
        });
        res.json({ ...generalResponse, message: 'user created.' });
    }
    catch (error) {
        res.status(error.status || 500)
        .json({
            error: error.message
        });
    }
};

export const sigIn = async (req, res) => {
    try {
        var user = await User.findOne({ email: req.body.email });
        if (!user)
            throw new AppError('email no found.', 404);

        await bcrypt.compare(req.body.password, user.password, (error, result) => {

            if (error)
                throw new AppError(error);

            if (result) {
                const token = jwt.sign(
                    {
                        email: user.email,
                        userId: user._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    })
                res.json({ ...generalResponse, message: 'log in successful.', data: token });
            }
            else {
                res.status(401)
                    .json({
                        error: 'auth failed.'
                    });
            }
        });
    }
    catch (error) {
        res.status(error.status || 500)
            .json({
                error: error.message
            });
    }
};

export const deleteUser = async (req, res) => {
    try {

        await Highline.deleteOne({ _id: req.params.userId });
        res.json({ ...generalResponse, message: 'user deleted.' });
    }
    catch (error) {
        res.status(500)
        .json({
            error: error.message
        });
    }
};
