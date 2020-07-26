import {
  addNewComment,
  getsComments,
  getcommentById,
  updateComment,
  deleteComment
} from "../controllers/commentController";
import auth from "../utilities/authorization";

const commentRoute = (app, version) => {
  app
    .route(`/${version}/comment`)
    .get(getsComments)
    .post(auth, addNewComment);

  app
    .route(`/${version}/comment/:commentId`)
    .get(auth, getcommentById)
    .put(auth, updateComment)
    .delete(auth, deleteComment);
};

export default commentRoute;
