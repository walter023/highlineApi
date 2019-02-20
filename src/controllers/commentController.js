import { Comment } from '../models/commentModel';


var generalResponse = { messageCode: 200, message: "Success!", data: null };

export const addNewComment = async (req, res) => {
    try {
        let newComment = new Comment(req.body);
        var commentSaved = await newComment.save();
        res.json({ ...generalResponse, data: commentSaved });
    }
    catch (error) {
         res.json({ ...generalResponse, messageCode: 500, message: error.message });
    }
};

export const getsComments = async (req, res) => {
    try {
        var comments = await Comment.find({});
        res.json({ ...generalResponse, data: comments });
    }
    catch (error) {
        res.json({ ...generalResponse, messageCode: 500, message: error.message });
        return console.error(error);
    }
};

export const getcommentById = async (req, res) => {
    try {
        var comment = await Comment.findById(req.params.commentId);
        res.json({ ...generalResponse, data: comment });
    }
    catch (error) {
        res.json({ ...generalResponse, messageCode: 500, message: error.message });
        return console.error(error);
    }
};

export const updateComment = async (req, res) => {
    try {
        var commentUpdated = await Comment.findOneAndUpdate({ _id: req.params.commentId }, req.body, { new: true });
        res.json({ ...generalResponse, data: commentUpdated });
    }
    catch (error) {
        res.json({ ...generalResponse, messageCode: 500, message: error.message });
        return console.error(error);
    }
};

export const deleteComment = async (req, res) => {
    try {
        if (req.params.commentId) {
            throw "comment id is required";
        }
        await Comment.remove({ _id: req.params.commentId });
        res.json({ ...generalResponse });
    }
    catch (error) {
        res.json({ ...generalResponse, messageCode: 500, message: error.message });
        return console.error(error);
    }
};