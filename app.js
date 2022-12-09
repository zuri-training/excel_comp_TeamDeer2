const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// home route
const homeRouter = require("./routes/homeRouter");
const User = require("./models/userModel");



app.use("/", homeRouter);

// starting server
app.listen(4000, () => {
  console.log("Server is listening on port 4000.");
});

    console.log('Server is listening on port 4000.');
})

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running"));
});