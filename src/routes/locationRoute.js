import {
  addNewLocation,
  getLocations,
  getLocationById,
  updateLocation,
  getLocationbyName,
  searchLocation,
} from "../controllers/locationController";
import auth from "../utilities/authorization";

const locationRoutes = (app, version) => {
  app.route(`/${version}/location`).post(auth, addNewLocation);
  app.route(`/${version}/location/name/:str?`).get(getLocationbyName);
  app.route(`/${version}/location/:lng/:lat`).get(getLocations);
  app.route(`/${version}/search/:name`).get(searchLocation);
 
  app
    .route(`/${version}/location/:locationId`)
    .get(getLocationById)
    .put(auth, updateLocation);
};

export default locationRoutes;
