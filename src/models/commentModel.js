import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const CommentSchema = new Schema({
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
