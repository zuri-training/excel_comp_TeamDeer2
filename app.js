const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const path = require('path');

//just added
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// dotenv.config();
//MONGODB
require('./config/db');

const cors = require('cors');

const { json } = require('express');
app.use(json({ extended: false }));

//accepting post from  data
const bodyparser = require('express').json;
app.use(bodyparser());

//middleware to parse cookies
app.use(cookieParser());
app.use(cors());

// const tempelatePath = path.join(__dirname, '../tempelates');
// const publicPath = path.join(__dirname, '../public');
// console.log(publicPath);

// app.set('view engine', 'hbs');
// app.set('views', tempelatePath);
// app.use(express.static(publicPath));

//user routes
const { userRouter } = require('./controllers/userController');

// home route
const homeRouter = require('./routes/homeRouter');

app.use('/', homeRouter);
app.use('/user', userRouter);

// app.use("/", homeRouter);
// app.use("/user", userRouter);

// // Connecting DB and starting server!
// const dbURI = MONGO_URI;
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

//just added

// mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
//     console.log("Connected to db!");
//     app.listen(3000, () => console.log("Server Up and running"));
// });
