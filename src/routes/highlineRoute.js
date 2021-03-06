import {
  addNewHighline,
  getsHighlines,
  getHighlineById,
  updateHighline,
  deleteHighline,
  addNewImage,
  deleteImages
} from "../controllers/highlineController";
import upload from "../utilities/storageImage";
import auth from "../utilities/authorization";

const highlineRoutes = (app, version) => {
  app
    .route(`/${version}/highline`)
    .get(getsHighlines)
    .post(auth, addNewHighline);

  app
    .route(`/${version}/highline/image/:highlineId`)
    .put(auth, upload.array("imagesUrl", 3), addNewImage)
    .delete(auth, deleteImages);

  app
    .route(`/${version}/highline/:locationId/:highlineId`)
    .get(getHighlineById)
    .put(auth, updateHighline)
    .delete(auth, deleteHighline);
};

export default highlineRoutes;
