import { addNewHighline, getsHighlines, getHighlineById, updateHighline, deleteHighline, addNewImage, deleteImages } from '../controllers/highlineController';
import upload from '../utilities/storageImage';
import auth from '../utilities/authorization';

const highlineRoutes = (app) => {
    app.route('/highline')
        .get(getsHighlines)
        .post(auth, addNewHighline);

    app.route('/highline/:locationId/:highlineId')
        .get(getHighlineById)
        .put(auth, updateHighline)
        .delete(auth, deleteHighline);

    app.route('/highline/image/:highlineId')
        .put(auth, upload.array('imagesUrl', 3), addNewImage)
        .delete(auth, deleteImages);
}

export default highlineRoutes;