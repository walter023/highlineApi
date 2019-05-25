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
    location: {
        type: {
            type: String,
            enum: ['Point'], 
            required: true
        },
        coordinates: []
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

LocationSchema.index({ location: "2dsphere" });

export default mongoose.model('Location', LocationSchema);