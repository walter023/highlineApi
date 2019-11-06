import jwt from 'jsonwebtoken';
require('dotenv').config();
import appError from './appError';

var generalResponse = { messageCode: 200, message: "Success!", data: null };

export default (req, res, next) => {
    try {
        if (!req.headers.authorization)
            throw new appError('auth failed.', 401)

        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        res.status(error.status || 500)
            .json({
                error: error.message
            });
    }
};