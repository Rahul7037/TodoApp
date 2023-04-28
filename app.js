const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const Login = require('./models/data');
const flash = require('connect-flash');
const session = require('express-session');
const show = require('./config/flashMiddle');
const express_ejs_layouts = require('express-ejs-layouts');
const dot_env = require('dotenv');
dot_env.config();
mongoose.set('strictQuery', false);

const port = 8080;

const app = express();

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));

// connect to mongodb & listen for requests
// const CRUD = require('./config/mongoose');
// register view engine
app.use(express_ejs_layouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.set('view engine', 'ejs');
app.set('views', 'views');

// middleware & static files
app.use(express.static('public')); //this will helps to use style.css file
app.use(express.urlencoded({ extended: true })); //this will helps to get submitted data of form in req.body obj

app.use(flash());
app.use(show.flash);

app.use('/', require('./routes/main'));

const ConnectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected  successfull : ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error In Connecting MongoDB: ${err}`);
    process.exit(1);
  }
};
ConnectDB().then(() => {
  app.listen(port,()=> {
      console.log(`Successfull Connected With the Port:${port}`);
  });
});