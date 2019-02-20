import { sigIn, signUp } from '../controllers/userController';

const userRoutes = (app) => {
    app.route('/signup')
        .post(signUp);


    app.route('/signin')
        .post(sigIn);
}

export default userRoutes;