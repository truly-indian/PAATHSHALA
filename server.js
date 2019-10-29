const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const exphbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const adminRoutes = require("./routes/admin");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const CourseAdminRoutes = require('./routes/course-admin')
const methodOverride = require('method-override')
const app = express();

const SERVER_PORT = process.env.PORT || 3000;

require("dotenv").config();

app.use(methodOverride('_method'))

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);

app.set("view engine", "handlebars");
app.use(cors());
app.use(morgan());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect( keys.mongodb.dbURI , { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log( 'connected to mongodb'))
  .catch(err => {
    console.log(err);
  });

  app.get("/", (req, res) => {
    res.send('you are seeing the welocme page!!')
  })
   
app.use("/admin", adminRoutes);
app.use('/courseadmin' , CourseAdminRoutes)



app.listen(SERVER_PORT, (req, res) => {
  console.log("server started at " + SERVER_PORT);
});
