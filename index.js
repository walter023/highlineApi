import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import locationRoutes from './src/routes/locationRoute';
import highlineRoute from './src/routes/highlineRoute';
import commentRoute from "./src/routes/commentRoute"
import userRoute from "./src/routes/userRoute"
import cors from './src/utilities/cors'
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// mongoose connection
mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err) => {
    console.log('mongo db connection', err)
});

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

cors(app);

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