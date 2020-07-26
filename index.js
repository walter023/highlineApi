import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import locationRoutes from "./src/routes/locationRoute";
import highlineRoute from "./src/routes/highlineRoute";
import commentRoute from "./src/routes/commentRoute";
import userRoute from "./src/routes/userRoute";
import cors from "./src/utilities/cors";

import swaggerDoc from "./swagger.json";
import swaggerUI from "swagger-ui-express";

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const version = process.env.VERSION;

// mongoose connection
mongoose.Promise = global.Promise;

mongoose.connect(
  process.env.DB_URL,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (err) => {
    console.log("mongo db connection", err);
  }
);
cors(app);
app.use(
  `/${process.env.VERSION}/api-docs`,
  swaggerUI.serve,
  swaggerUI.setup(swaggerDoc)
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


locationRoutes(app, version);
highlineRoute(app, version);
commentRoute(app, version);
userRoute(app, version);

app.get(`/${version}`, (req, res) =>
  res.send(`Highline server is running on port ${PORT}`)
);

app.listen(PORT, () =>
  console.log(`Highline server is running on port ${PORT}`)
);
