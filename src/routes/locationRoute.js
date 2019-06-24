import {
    addNewLocation,
    getLocations,
    getLocationById,
    updateLocation,
    getLocationNames
}
from '../controllers/locationController';
import auth from '../utilities/authorization';

const locationRoutes = (app) => {
    app.route('/location')
        .post(auth, addNewLocation);

        app.route('/locationNames/:name')
        .get(getLocationNames);

    app.route('/location/:long/:latt')
        .get(getLocations);

    app.route('/location/:locationId')
        .get(getLocationById)
        .put(auth, updateLocation);

 

}

export default locationRoutes;