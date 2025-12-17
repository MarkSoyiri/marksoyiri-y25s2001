var createError = require('http-errors');
var express = require('express');
var app = express();
const cors = require('cors');
const serverless = require('serverless-http');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override')
require('dotenv').config();

const ProductRoute = require("./routes/ProductRoutes")
const mongose = require('mongoose');
const fs = require('fs');







// // override with POST having ?_method=DELETE
app.use(methodOverride('_method'))




// // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }



// // Replace "Ecommerce" with your actual database name
mongose.connect(process.env.MONGO_URI).then(() => {

  console.log('✅ Connected to MongoDB');

}).catch((err) => {

  console.error('❌ MongoDB connection error:', err);

}); 




// Or allow only specific origins like this:
app.use(cors({

  origin: "http://localhost:5173",/// change to your frontend URL
  methods:['GET', 'POST', 'PUT', 'DELETE'],
  credentials:true
  
}));

app.use(express.json()); // <--- VERY IMPORTANT for POST requests with JSON bodies



// Your routes

app.use('/', ProductRoute);



// HOME ROUTE
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});


// // catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// // error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//create a nodemailer transporter
const nodemailer = require("nodemailer");

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});
// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
}); 
// Example route to send email
app.post("/send-email", (req, res) => {
  // const { to, subject, text } = req.body;

  transporter.sendMail({
    from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
    to:"marksoyiri45@gmail.com",
    subject:"test email from nodemailer",
    text:"Hello World"
  }, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.messageId);
      res.status(200).send("Email sent successfully");
    }
  });
});

app.listen(process.env.PORT, () => console.log(`127.0.0.1:${process.env.PORT}`));

module.exports = app;
// module.exports.handler = serverless(app);