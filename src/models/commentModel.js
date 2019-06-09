import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    highlineId: {
        type: String,
        required: 'Enter highlineId'
    },
    userId: {
        type: String,
        required: 'Enter userId'
    },
    comment: {
        type: String,
        required: 'Enter the comment'
    },
});

export default mongoose.model('Comment', CommentSchema);
