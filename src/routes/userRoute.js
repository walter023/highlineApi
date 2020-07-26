import { sigIn, signUp } from "../controllers/userController";

const userRoutes = (app, version) => {
  app.route(`/${version}/signup`).post(signUp);

  app.route(`/${version}/signin`).post(sigIn);
};

export default userRoutes;
