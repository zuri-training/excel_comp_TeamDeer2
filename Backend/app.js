const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");
//MONGODB
require("./config/db");

const { json } = require("express");
app.use(json({ extended: false }));

//accepting post from  data
const bodyparser = require("express").json;
app.use(bodyparser({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

//middleware to parse cookies
app.use(cookieParser());

//user routes
const userRouter = require("./controllers/userController");

// home route
const homeRouter = require("./routes/homeRouter");

//file routes
const fileRouter = require("./routes/fileRouter");

//static folder
app.use(express.static(path.resolve(__dirname, "public")));

app.use("/", homeRouter);
app.use("/user", userRouter);
app.use("/file", fileRouter);

// // Connecting DB and starting server!
// const dbURI = MONGO_URI;
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
