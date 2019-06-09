import mongoose from 'mongoose';
import anchorType from '../utilities/anchorType';


const anchorSchema = mongoose.Schema({
    rhs: [
        mongoose.Schema({
            main: { type: String, enum: anchorType, trim: true },
            howManyOnMain: Number,
            backup: { type: String, enum: anchorType, trim: true },
            howMany: Number,
            size: String
        }, { _id: false })
    ],
    lhs: [
        mongoose.Schema({
            main: { type: String, enum: anchorType, trim: true },
            howManyOnMain: Number,
            backup: { type: String, enum: anchorType, trim: true },
            howMany: Number,
            size: String
        }, { _id: false })
    ]
}, { _id: false });

export default anchorSchema;
