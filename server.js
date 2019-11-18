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
const amqp = require('amqplib/callback_api')
const app = express();

const SERVER_PORT = process.env.PORT || 3000;

require("dotenv").config();
//app.use(cors())

app.use((req,res,next) => {
   res.header('Access-Control-Allow-Origin', '*'      /* '*' basically gives access to any link from the server*/)
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
   if(req.method === 'OPTIONS') {
     res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET, COPY, HEAD, LINK, UNLINK, PURGE, LOCK, UNLOCK, VIEW, PROPFIND')
     return res.status(200).json({})
   }
})

app.use(methodOverride('_method'))

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);

app.set("view engine", "handlebars");
app.use(morgan());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect( 'mongodb+srv://deepak:deepak123@cluster0-6rn6a.mongodb.net/test?retryWrites=true&w=majority' , { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log( 'connected to mongodb'))
  .catch(err => {
    console.log(err);
  });
/*
amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, ch) => {
  const queue = 'FirstQueue'
  const message = {type: '2', content: 'Hello RabbitMQ'}
  ch.assertQueue(queue, {durable: false})
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
  console.log(`Message was sent!!`)
  })
  setTimeout(() => {
    conn.close()
    process.exit(0)
  },500)
})
*/



  app.get("/", (req, res) => {
    res.send('you are seeing the welocme page!!')
  })
   
app.use("/admin", adminRoutes);
app.use('/courseadmin' , CourseAdminRoutes)



app.listen(SERVER_PORT, (req, res) => {
  console.log("server started at " + SERVER_PORT);
});
