import mongoose from 'mongoose';

const Schema = mongoose.Schema;
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
    anchors: [{
        rhsMain: {
            type: String,
            required: 'Enter RSH main'
        },
        rhsBackUp: {
            type: String,
            required: 'Enter RSH Main'
        },
        lhsMain: {
            type: String,
            required: 'Enter LSH Main'
        },
        lhsBackUp: {
            type: String,
            required: 'Enter LSH Main'
        }
    }],
    imagesUrl: [{
        type: String
    }],
    establishedBy: {
        type: String
    },
    created_date: {
        type: Date
    }
});

export default mongoose.model('Highline', HighlineSchema);
