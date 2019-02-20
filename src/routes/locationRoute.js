import { addNewLocation, getLocations, getLocationById, updateLocation } from '../controllers/locationController';
import auth from '../utilities/authorization';

const locationRoutes = (app) => {
    app.route('/location')
    .get(getLocations)
    .post(auth, addNewLocation);

    app.route('/location/:locationId')
    .get(getLocationById)
    .put(auth, updateLocation);
}

export default locationRoutes;