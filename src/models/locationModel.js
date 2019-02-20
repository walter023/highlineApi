import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    locationName: {
        type: String,
        required: 'Enter LocationName'
    },
    description: {
        type: String,
        required: 'Enter description'
    },
    latitude: {
        type: Number,
        required: 'Enter latitude',
        validate: {
            validator: lat => isFinite(lat) && Math.abs(lat) <= 90,
            message: props => `The latitude provided is ${props.value} and it must be between -90 and 90 degrees !`
        },
    },
    longitude: {
        type: Number,
        required: 'Enter longitude',
        validate: {
            validator: lng => isFinite(lng) && Math.abs(lng) <= 180,
            message: props => `The longitude provided is ${props.value} and it must be between -90 and 90 degrees !`
        },
    },
    approach: {
        type: String,
        required: 'Enter Approach'
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    highlines: [{
        type: Schema.Types.ObjectId,
        ref: 'Highline'
    }],
});

export default mongoose.model('Location', LocationSchema);