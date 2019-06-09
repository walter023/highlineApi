import mongoose from 'mongoose';
import anchorSchema from '../models/anchorSchema';

const Schema = mongoose.Schema;
const subSchema = anchorSchema

const HighlineSchema = new Schema({
    highlineName: {
        type: String,
        required: 'Enter highline name'
    },
    remarks: {
        type: String,
        required: 'Enter remarks'
    },
    long: {
        type: String,
        required: 'Enter how long is the highline.'
    },
    high: {
        type: String,
        required: 'Enter how high is the highline.'
    },
    anchors: [subSchema],
    imagesUrl: [{
        type: String
    }],
    establishedBy: {
        type: String,
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    created_date: {
        type: Date
    }
});

export default mongoose.model('Highline', HighlineSchema);
