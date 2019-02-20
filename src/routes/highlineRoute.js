import { addNewHighline, getsHighlines, getHighlineById, updateHighline, deleteHighline, addNewImage, deleteImage } from '../controllers/highlineController';
import Upload from '../utilities/storageImage';
import auth from '../utilities/authorization';

const highlineRoutes = (app) => {
    app.route('/highline')
        .get(getsHighlines)
        .post(auth, addNewHighline);

    app.route('/highline/:highlineId')
        .get(getHighlineById)
        .put(auth, updateHighline)
        .delete(deleteHighline);

    app.route('/highline/image/:highlineId')
        .put(auth, Upload.array('imagesUrl', 3), addNewImage)
        .delete(auth, deleteImage);
}

export default highlineRoutes;