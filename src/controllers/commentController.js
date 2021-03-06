import Comment from "../models/commentModel";
import Highline from "../models/highlineModel";
import appError from "../utilities/appError";

var generalResponse = { messageCode: 200, message: "Success!", data: null };

export const addNewComment = async (req, res) => {
  try {
    validateHighline(req.body.highlineId);
    let newComment = new Comment(req.body);
    newComment.userId = req.userData.userId;
    const commentSaved = await newComment.save();
    res.json({ ...generalResponse, data: commentSaved });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message
    });
  }
};

export const getsComments = async (req, res) => {
  try {
    validateHighline(req.body.highlineId);
    const comments = await Comment.find({ highlineId: req.body.highlineId });
    if (comments < 1) throw new appError("no comments found.", 404);
    res.json({ ...generalResponse, data: comments });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message
    });
  }
};

export const getcommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.body.commentId);
    res.json({ ...generalResponse, data: comment });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    validateHighline(req.body.highlineId);

    if (!req.body.commentId) throw new appError("comment id is required");

    const commment = Comment.findById(req.body.commentId);
    if (!commment) throw new appError("comment no found", 404);

    if (commment.userId != req.userData.userId)
      throw new appError("unauthorized", 401);

    const commentUpdated = await Comment.findOneAndUpdate(
      { _id: req.body.commentId },
      req.body,
      { new: true }
    );
    res.json({ ...generalResponse, data: commentUpdated });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    validateHighline(req.body.highlineId);

    if (!req.body.commentId) throw new appError("comment id is required");

    const commentToDelete = comment.findById(req.body.commentId);
    if (!commentToDelete) throw new appError("comment no found", 404);

    if (commentToDelete.userId != req.userData.userId)
      throw new appError("unauthorized", 401);

    await Comment.remove({ _id: req.body.commentId });
    res.json({ ...generalResponse });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message
    });
  }
};

const validateHighline = async highlineId => {
  if (!highlineId) {
    throw new appError("Highline id is required.");
  }
  const higlineFound = await Highline.findById(highlineId);
  if (!higlineFound) {
    throw new appError("Highline no found.", 404);
  }
};
