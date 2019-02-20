import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import locationRoutes from './src/routes/locationRoute';
import highlineRoute from './src/routes/highlineRoute';
import commentRoute from "./src/routes/commentRoute"
import  userRoute from "./src/routes/userRoute"
import { config } from './config';

const app = express();
const PORT = config.app.port;

// mongoose connection
mongoose.Promise = global.Promise;

mongoose.connect(config.db.dbUrl, { useNewUrlParser: true, useFindAndModify: false}, (err) => {
    console.log('mongo db connection', err)
});

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));


locationRoutes(app);
highlineRoute(app);
commentRoute(app);
userRoute(app);

app.get('/', (req, res) =>
    res.send(`Highline server is running on port ${PORT}`)
);

app.listen(PORT, () =>
    console.log(`Highline server is running on port ${PORT}`)
);