import {
    addNewComment,
    getsComments,
    getcommentById,
    updateComment,
    deleteComment
} from '../controllers/commentController'

const commentRoute = (app) => {
    app.route('/comment')
        .get(getsComments)
        .post(addNewComment);

    app.route('/comment/:commentId')
        .get(getcommentById)
        .put(updateComment)
        .delete(deleteComment);
}

export default commentRoute;